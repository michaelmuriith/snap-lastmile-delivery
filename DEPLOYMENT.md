# SNAP Application Deployment Guide

This guide covers deploying the SNAP (Last-Mile Delivery) application to a VPS using Docker Compose.

## Prerequisites

- Ubuntu/Debian VPS with at least 2GB RAM and 20GB storage
- Docker and Docker Compose installed
- Domain name (optional but recommended)
- SSL certificate (Let's Encrypt recommended)

## Quick Start

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd snap
   ```

2. **Configure environment variables:**
   ```bash
   # Copy and edit environment files
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env

   # Edit with your actual values
   nano backend/.env
   nano frontend/.env
   ```

3. **Start the application:**
   ```bash
   docker-compose up -d
   ```

4. **Check status:**
   ```bash
   docker-compose ps
   ```

## Services Overview

### Application Services
- **Frontend**: React SPA served via Nginx (Port 80)
- **Backend**: NestJS API server (Port 3000)
- **PostgreSQL**: Database (Port 5432, localhost only)
- **Redis**: Cache & sessions (Port 6379, localhost only)

### Monitoring Services
- **pgAdmin**: Database management (Port 5050)
- **Prometheus**: Metrics collection (Port 9090)
- **Grafana**: Monitoring dashboard (Port 3001)
- **Node Exporter**: System metrics (Port 9100)
- **cAdvisor**: Container metrics (Port 8080)

## Access URLs

After deployment, access your application at:

- **Main Application**: `http://your-vps-ip`
- **API Documentation**: `http://your-vps-ip/api/docs`
- **pgAdmin**: `http://your-vps-ip:5050`
  - Email: `admin@snap.com`
  - Password: `admin123`
- **Prometheus**: `http://your-vps-ip:9090`
- **Grafana**: `http://your-vps-ip:3001`
  - Username: `admin`
  - Password: `admin123`

## Security Configuration

### 1. Database Security
The PostgreSQL port is bound to localhost only for security. Access it via pgAdmin or SSH tunnel:

```bash
# SSH tunnel to PostgreSQL
ssh -L 5432:localhost:5432 user@your-vps-ip
```

### 2. Change Default Passwords
Update these default credentials in production:

- **pgAdmin**: Change `PGADMIN_DEFAULT_PASSWORD` in docker-compose.yml
- **Grafana**: Change `GF_SECURITY_ADMIN_PASSWORD` in docker-compose.yml
- **JWT Secrets**: Update in `backend/.env`

### 3. SSL/TLS Setup (Recommended)

Install Nginx as reverse proxy with SSL:

```bash
# Install Nginx
sudo apt update
sudo apt install nginx certbot python3-certbot-nginx

# Configure Nginx
sudo nano /etc/nginx/sites-available/snap

# Add this configuration:
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Enable site
sudo ln -s /etc/nginx/sites-available/snap /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com
```

## Environment Variables

### Backend (.env)
```env
NODE_ENV=production
PORT=3000
DB_HOST=postgres
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your-secure-password
DB_NAME=snap_db
DB_MAX_CONNECTIONS=20
REDIS_HOST=redis
REDIS_PORT=6379
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
FRONTEND_URL=https://your-domain.com
```

### Frontend (.env)
```env
VITE_API_BASE_URL=https://your-domain.com/api
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

## Monitoring Setup

### Grafana Dashboards
1. Access Grafana at `http://your-vps-ip:3001`
2. Login with admin/admin123
3. Navigate to Dashboards → SNAP Application Overview
4. The dashboard includes:
   - System CPU/Memory usage
   - Container resource usage
   - Database connections
   - Redis memory usage

### Prometheus Metrics
Access Prometheus at `http://your-vps-ip:9090` to:
- Query metrics manually
- Check alerting rules
- View service discovery

## Database Management

### pgAdmin Setup
1. Access at `http://your-vps-ip:5050`
2. Login with admin@snap.com / admin123
3. Add server connection:
   - Host: `postgres`
   - Port: `5432`
   - Username: `postgres`
   - Password: `password`
   - Database: `snap_db`

## Backup Strategy

### Database Backup
```bash
# Create backup script
cat > backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/opt/snap-backups"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup PostgreSQL
docker exec snap_postgres pg_dump -U postgres snap_db > $BACKUP_DIR/snap_db_$DATE.sql

# Backup Redis (if needed)
# docker exec snap_redis redis-cli --rdb /tmp/redis_backup.rdb

# Clean old backups (keep last 7 days)
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete

echo "Backup completed: $BACKUP_DIR/snap_db_$DATE.sql"
EOF

chmod +x backup.sh
```

### Automated Backups
```bash
# Add to crontab for daily backups at 2 AM
crontab -e
# Add: 0 2 * * * /path/to/snap/backup.sh
```

## Troubleshooting

### Common Issues

1. **Port conflicts**: Check if ports are already in use
   ```bash
   sudo netstat -tulpn | grep :80
   ```

2. **Container not starting**: Check logs
   ```bash
   docker-compose logs <service-name>
   ```

3. **Database connection issues**: Verify environment variables
   ```bash
   docker-compose exec backend env | grep DB_
   ```

4. **Memory issues**: Increase VPS memory or optimize containers
   ```bash
   docker system prune -a
   ```

### Health Checks
```bash
# Check all services
docker-compose ps

# Check specific service logs
docker-compose logs backend

# Restart specific service
docker-compose restart backend
```

## Performance Optimization

### VPS Configuration
```bash
# Increase file descriptors
echo "fs.file-max = 65536" | sudo tee -a /etc/sysctl.conf
echo "* soft nofile 65536" | sudo tee -a /etc/security/limits.conf
echo "* hard nofile 65536" | sudo tee -a /etc/security/limits.conf

# Apply changes
sudo sysctl -p
```

### Docker Optimization
```yaml
# Add to docker-compose.yml services
deploy:
  resources:
    limits:
      memory: 512M
    reservations:
      memory: 256M
```

## Scaling

### Horizontal Scaling
For high traffic, scale individual services:

```bash
# Scale backend services
docker-compose up -d --scale backend=3

# Scale frontend (requires load balancer)
docker-compose up -d --scale frontend=2
```

### Load Balancing
Use Nginx as load balancer for multiple instances:

```nginx
upstream backend {
    server localhost:3000;
    server localhost:3001;
    server localhost:3002;
}

server {
    listen 80;
    location /api/ {
        proxy_pass http://backend;
    }
}
```

## Updates

### Application Updates
```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose down
docker-compose up -d --build

# Check for issues
docker-compose logs
```

### Security Updates
```bash
# Update Docker images
docker-compose pull

# Restart with new images
docker-compose up -d
```

## Support

For issues or questions:
1. Check logs: `docker-compose logs`
2. Verify configuration files
3. Check system resources: `htop` or `docker stats`
4. Review monitoring dashboards in Grafana

---

**Note**: This deployment is configured for development/demo purposes. For production use, implement additional security measures, backup strategies, and monitoring alerts.