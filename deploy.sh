#!/bin/bash

# SNAP Application Deployment Script
# This script deploys the SNAP application to a VPS

set -e

echo "🚀 Starting SNAP Application Deployment"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   print_error "This script should not be run as root. Please run as a regular user with sudo access."
   exit 1
fi

# Update system
print_status "Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install required packages
print_status "Installing required packages..."
sudo apt install -y curl wget git htop ufw

# Install Docker
print_status "Installing Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    print_warning "Please log out and log back in for Docker group changes to take effect"
else
    print_status "Docker is already installed"
fi

# Install Docker Compose
print_status "Installing Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
else
    print_status "Docker Compose is already installed"
fi

# Configure firewall
print_status "Configuring firewall..."
sudo ufw --force enable
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 3000  # Backend API
sudo ufw allow 5050  # pgAdmin
sudo ufw allow 9090  # Prometheus
sudo ufw allow 3001  # Grafana

# Create application directory
print_status "Creating application directory..."
mkdir -p ~/opt/snap
cd ~/opt/snap

# Clone repository (you'll need to replace with your actual repo URL)
print_status "Cloning SNAP repository..."
git clone https://github.com/michaelmuriith/snap-lastmile-delivery.git .
# For now, we'll assume the files are already there

# Create environment files
print_status "Creating environment configuration..."

# Backend .env
cat > backend/.env << EOF
NODE_ENV=production
PORT=3000
DB_HOST=postgres
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your-secure-password-change-this
DB_NAME=snap_db
DB_MAX_CONNECTIONS=20
REDIS_HOST=redis
REDIS_PORT=6379
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
FRONTEND_URL=http://localhost
EOF

# Frontend .env
cat > frontend/.env << EOF
VITE_API_BASE_URL=http://localhost/api
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
EOF

print_warning "Please update the environment variables in backend/.env and frontend/.env with your actual values!"

# Create monitoring directory structure
print_status "Setting up monitoring configuration..."
mkdir -p monitoring/grafana/provisioning/datasources
mkdir -p monitoring/grafana/provisioning/dashboards
mkdir -p monitoring/grafana/dashboards

# Create Prometheus configuration
cat > monitoring/prometheus.yml << 'EOF'
global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  # - "first_rules.yml"
  # - "second_rules.yml"

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  - job_name: 'snap-backend'
    static_configs:
      - targets: ['backend:3000']
    scrape_interval: 5s
    metrics_path: '/metrics'

  - job_name: 'postgres'
    static_configs:
      - targets: ['postgres:5432']
    scrape_interval: 10s

  - job_name: 'redis'
    static_configs:
      - targets: ['redis:6379']
    scrape_interval: 10s

  - job_name: 'node-exporter'
    static_configs:
      - targets: ['node-exporter:9100']
    scrape_interval: 15s

  - job_name: 'cadvisor'
    static_configs:
      - targets: ['cadvisor:8080']
    scrape_interval: 15s
    scrape_timeout: 10s
EOF

# Create Grafana datasource configuration
cat > monitoring/grafana/provisioning/datasources/prometheus.yml << 'EOF'
apiVersion: 1

datasources:
  - name: Prometheus
    type: prometheus
    access: proxy
    url: http://prometheus:9090
    isDefault: true
    editable: true
EOF

# Create Grafana dashboard provisioning
cat > monitoring/grafana/provisioning/dashboards/dashboard.yml << 'EOF'
apiVersion: 1

providers:
  - name: 'SNAP Dashboards'
    type: file
    disableDeletion: false
    updateIntervalSeconds: 10
    allowUiUpdates: true
    options:
      path: /var/lib/grafana/dashboards
EOF

# Create sample dashboard
cat > monitoring/grafana/dashboards/snap-overview.json << 'EOF'
{
  "dashboard": {
    "id": null,
    "title": "SNAP Application Overview",
    "tags": ["snap", "overview"],
    "timezone": "browser",
    "panels": [
      {
        "id": 1,
        "title": "System CPU Usage",
        "type": "graph",
        "targets": [
          {
            "expr": "100 - (avg by(instance) (irate(node_cpu_seconds_total{mode=\"idle\"}[5m])) * 100)",
            "legendFormat": "{{instance}}"
          }
        ],
        "gridPos": {
          "h": 8,
          "w": 12,
          "x": 0,
          "y": 0
        }
      },
      {
        "id": 2,
        "title": "System Memory Usage",
        "type": "graph",
        "targets": [
          {
            "expr": "100 - ((node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes) * 100)",
            "legendFormat": "Memory Usage %"
          }
        ],
        "gridPos": {
          "h": 8,
          "w": 12,
          "x": 12,
          "y": 0
        }
      }
    ],
    "time": {
      "from": "now-1h",
      "to": "now"
    },
    "timepicker": {},
    "templating": {
      "list": []
    },
    "annotations": {
      "list": []
    },
    "refresh": "30s",
    "schemaVersion": 27,
    "version": 0,
    "links": []
  }
}
EOF

# Start the application
print_status "Starting SNAP application..."
docker-compose down 2>/dev/null || true
docker-compose up -d

# Wait for services to start
print_status "Waiting for services to start..."
sleep 30

# Check service status
print_status "Checking service status..."
docker-compose ps

# Display access information
print_success "🎉 SNAP Application Deployment Complete!"
echo ""
echo "Access your application at:"
echo "🌐 Main Application: http://$(curl -s ifconfig.me)"
echo "🔧 pgAdmin: http://$(curl -s ifconfig.me):5050"
echo "📊 Prometheus: http://$(curl -s ifconfig.me):9090"
echo "📈 Grafana: http://$(curl -s ifconfig.me):3001"
echo ""
echo "Default credentials:"
echo "pgAdmin: admin@snap.com / admin123"
echo "Grafana: admin / admin123"
echo ""
print_warning "⚠️  IMPORTANT: Update default passwords and environment variables before going to production!"
print_warning "⚠️  Update JWT secrets, database password, and Google Maps API key in the .env files"

# Create backup script
print_status "Creating backup script..."
cat > backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/opt/snap-backups"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory
sudo mkdir -p $BACKUP_DIR
sudo chown $USER:$USER $BACKUP_DIR

# Backup PostgreSQL
docker exec snap_postgres pg_dump -U postgres snap_db > $BACKUP_DIR/snap_db_$DATE.sql

# Clean old backups (keep last 7 days)
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete

echo "Backup completed: $BACKUP_DIR/snap_db_$DATE.sql"
EOF

chmod +x backup.sh

print_success "Backup script created. Run './backup.sh' to backup your database."

# Setup automated backups (optional)
read -p "Do you want to set up automated daily backups? (y/n): " setup_backups
if [[ $setup_backups =~ ^[Yy]$ ]]; then
    (crontab -l ; echo "0 2 * * * $PWD/backup.sh") | crontab -
    print_success "Automated daily backups configured for 2 AM"
fi

print_success "🚀 Deployment completed successfully!"
print_status "Check logs with: docker-compose logs -f"
print_status "Stop application with: docker-compose down"
print_status "Update application with: docker-compose pull && docker-compose up -d"