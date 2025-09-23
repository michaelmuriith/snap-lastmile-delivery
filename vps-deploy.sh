#!/bin/bash

# SNAP Application - Complete VPS Deployment Script
# Run this on a fresh Ubuntu/Debian VPS to deploy the entire application

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration variables
DOMAIN=""
EMAIL=""
DB_PASSWORD=""
JWT_SECRET=""
JWT_REFRESH_SECRET=""
PGADMIN_PASSWORD=""
GRAFANA_PASSWORD=""
GOOGLE_MAPS_API_KEY=""

# Function to print colored output
print_header() {
    echo -e "\n${PURPLE}================================${NC}"
    echo -e "${PURPLE}$1${NC}"
    echo -e "${PURPLE}================================${NC}\n"
}

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
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

print_info() {
    echo -e "${CYAN}[INFO]${NC} $1"
}

# Check if running as root
check_root() {
    if [[ $EUID -eq 0 ]]; then
        print_error "This script should not be run as root. Please run as a regular user with sudo access."
        exit 1
    fi
}

# Get user input for configuration
get_user_input() {
    print_header "SNAP Application Configuration"

    echo "Please provide the following information for your deployment:"
    echo

    read -p "Enter your domain name (or IP address): " DOMAIN
    while [[ -z "$DOMAIN" ]]; do
        read -p "Domain/IP is required. Enter your domain name (or IP address): " DOMAIN
    done

    read -p "Enter your email address (for SSL certificates): " EMAIL

    read -p "Enter database password [$(openssl rand -hex 16)]: " DB_PASSWORD
    if [ -z "$DB_PASSWORD" ]; then
        DB_PASSWORD=$(openssl rand -hex 16)
    fi

    read -p "Enter JWT secret [$(openssl rand -hex 32)]: " JWT_SECRET
    if [ -z "$JWT_SECRET" ]; then
        JWT_SECRET=$(openssl rand -hex 32)
    fi

    read -p "Enter JWT refresh secret [$(openssl rand -hex 32)]: " JWT_REFRESH_SECRET
    if [ -z "$JWT_REFRESH_SECRET" ]; then
        JWT_REFRESH_SECRET=$(openssl rand -hex 32)
    fi

    read -p "Enter pgAdmin password [$(openssl rand -hex 12)]: " PGADMIN_PASSWORD
    if [ -z "$PGADMIN_PASSWORD" ]; then
        PGADMIN_PASSWORD=$(openssl rand -hex 12)
    fi

    read -p "Enter Grafana password [$(openssl rand -hex 12)]: " GRAFANA_PASSWORD
    if [ -z "$GRAFANA_PASSWORD" ]; then
        GRAFANA_PASSWORD=$(openssl rand -hex 12)
    fi

    read -p "Enter Google Maps API Key (required for maps): " GOOGLE_MAPS_API_KEY
    while [[ -z "$GOOGLE_MAPS_API_KEY" ]]; do
        read -p "Google Maps API Key is required. Enter your API key: " GOOGLE_MAPS_API_KEY
    done

    echo
    print_success "Configuration completed!"
    echo
}

# Update system
update_system() {
    print_step "Updating system packages..."
    sudo apt update && sudo apt upgrade -y
    print_success "System updated"
}

# Install required packages
install_dependencies() {
    print_step "Installing required packages..."
    sudo apt install -y curl wget git htop ufw software-properties-common apt-transport-https ca-certificates gnupg lsb-release
    print_success "Dependencies installed"
}

# Install Docker
install_docker() {
    print_step "Installing Docker..."

    # Remove old versions
    sudo apt remove -y docker docker-engine docker.io containerd runc 2>/dev/null || true

    # Add Docker's official GPG key
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

    # Set up stable repository
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

    # Install Docker
    sudo apt update
    sudo apt install -y docker-ce docker-ce-cli containerd.io

    # Start and enable Docker
    sudo systemctl start docker
    sudo systemctl enable docker

    # Add user to docker group
    sudo usermod -aG docker $USER

    print_success "Docker installed"
    print_warning "Please log out and log back in for Docker group changes to take effect"
}

# Install Docker Compose
install_docker_compose() {
    print_step "Installing Docker Compose..."

    # Install Docker Compose v2
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose

    # Verify installation
    docker-compose --version

    print_success "Docker Compose installed"
}

# Configure firewall
configure_firewall() {
    print_step "Configuring firewall..."

    # Enable UFW
    sudo ufw --force enable

    # Allow SSH
    sudo ufw allow ssh

    # Allow HTTP and HTTPS
    sudo ufw allow 80
    sudo ufw allow 443

    # Allow application ports
    sudo ufw allow 3000  # Backend API
    sudo ufw allow 5050  # pgAdmin
    sudo ufw allow 9090  # Prometheus
    sudo ufw allow 3001  # Grafana

    # Reload firewall
    sudo ufw reload

    print_success "Firewall configured"
}

# Clone repository and setup application
setup_application() {
    print_step "Setting up SNAP application..."

    # Create application directory
    mkdir -p ~/snap
    cd ~/snap

    # For this demo, we'll assume the files are already there
    git clone https://github.com/michaelmuriith/snap-lastmile-delivery.git .

    print_success "Application directory created"
}

# Create environment files
create_environment() {
    print_step "Creating environment configuration..."

    # Backend .env
    cat > backend/.env << EOF
NODE_ENV=production
PORT=3000
DB_HOST=postgres
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=${DB_PASSWORD}
DB_NAME=snap_db
DB_MAX_CONNECTIONS=20
REDIS_HOST=redis
REDIS_PORT=6379
JWT_SECRET=${JWT_SECRET}
JWT_REFRESH_SECRET=${JWT_REFRESH_SECRET}
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
FRONTEND_URL=https://${DOMAIN}
EOF

    # Frontend .env
    cat > frontend/.env << EOF
VITE_API_BASE_URL=https://${DOMAIN}/api
VITE_GOOGLE_MAPS_API_KEY=${GOOGLE_MAPS_API_KEY}
EOF

    print_success "Environment files created"
}

# Setup monitoring configuration
setup_monitoring() {
    print_step "Setting up monitoring configuration..."

    # Create monitoring directory structure
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

    print_success "Monitoring configuration created"
}

# Update docker-compose with custom passwords
update_docker_compose() {
    print_step "Updating Docker Compose configuration..."

    # Update pgAdmin password
    sed -i "s/PGADMIN_DEFAULT_PASSWORD: admin123/PGADMIN_DEFAULT_PASSWORD: ${PGADMIN_PASSWORD}/g" docker-compose.yml

    # Update Grafana password
    sed -i "s/GF_SECURITY_ADMIN_PASSWORD: admin123/GF_SECURITY_ADMIN_PASSWORD: ${GRAFANA_PASSWORD}/g" docker-compose.yml

    print_success "Docker Compose updated"
}

# Start the application
start_application() {
    print_step "Starting SNAP application..."

    # Stop any existing containers
    docker-compose down 2>/dev/null || true

    # Start all services
    docker-compose up -d

    # Wait for services to start
    print_info "Waiting for services to start (this may take a few minutes)..."
    sleep 60

    # Check service status
    print_step "Checking service status..."
    docker-compose ps

    print_success "Application started successfully"
}

# Setup SSL certificates
setup_ssl() {
    if [[ -n "$EMAIL" && "$DOMAIN" != "$(curl -s ifconfig.me)" ]]; then
        print_step "Setting up SSL certificates..."

        # Install certbot
        sudo apt install -y certbot python3-certbot-nginx

        # Get SSL certificate
        sudo certbot certonly --standalone -d snaplast.duckdns.org --email michaelwanjiru01@gmail.com --agree-tos --non-interactive

        print_success "SSL certificates obtained"
    else
        print_warning "SSL setup skipped. Configure manually with: sudo certbot --nginx -d $DOMAIN"
    fi
}

# Create backup script
create_backup_script() {
    print_step "Creating backup script..."

    cat > backup.sh << EOF
#!/bin/bash
BACKUP_DIR="/opt/snap-backups"
DATE=\$(date +%Y%m%d_%H%M%S)

# Create backup directory
sudo mkdir -p \$BACKUP_DIR
sudo chown \$USER:\$USER \$BACKUP_DIR

# Backup PostgreSQL
docker exec snap_postgres pg_dump -U postgres snap_db > \$BACKUP_DIR/snap_db_\$DATE.sql

# Clean old backups (keep last 7 days)
find \$BACKUP_DIR -name "*.sql" -mtime +7 -delete

echo "Backup completed: \$BACKUP_DIR/snap_db_\$DATE.sql"
EOF

    chmod +x backup.sh

    print_success "Backup script created"
}

# Display completion message
show_completion() {
    print_header "🎉 DEPLOYMENT COMPLETE!"

    echo "Your SNAP application has been successfully deployed!"
    echo
    echo "Access URLs:"
    echo "🌐 Main Application: https://${DOMAIN}"
    echo "🔧 pgAdmin: https://${DOMAIN}:5050"
    echo "📊 Prometheus: https://${DOMAIN}:9090"
    echo "📈 Grafana: https://${DOMAIN}:3001"
    echo
    echo "Credentials:"
    echo "pgAdmin: admin@snap.com / ${PGADMIN_PASSWORD}"
    echo "Grafana: admin / ${GRAFANA_PASSWORD}"
    echo
    print_warning "⚠️  IMPORTANT SECURITY NOTES:"
    echo "1. Save these credentials securely"
    echo "2. Change default passwords in production"
    echo "3. Keep JWT secrets secure and rotate regularly"
    echo "4. Monitor your application using Grafana"
    echo
    print_info "Next steps:"
    echo "1. Point your domain DNS to this server IP"
    echo "2. Set up automated backups: ./backup.sh"
    echo "3. Configure monitoring alerts in Grafana"
    echo "4. Test the application functionality"
    echo
    print_success "🚀 Deployment completed successfully!"
}

# Main deployment function
main() {
    print_header "SNAP Application VPS Deployment"

    check_root
    get_user_input
    update_system
    install_dependencies
    install_docker
    install_docker_compose
    configure_firewall
    setup_application
    create_environment
    setup_monitoring
    update_docker_compose
    start_application
    setup_ssl
    create_backup_script
    show_completion
}

# Run main function
main "$@"