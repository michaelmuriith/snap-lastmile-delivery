#!/bin/bash

# SNAP Environment Setup Script
# Run this after deploy.sh to configure your environment variables

echo "🔧 SNAP Environment Configuration"
echo "=================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Backend environment setup
echo -e "${BLUE}Configuring Backend Environment...${NC}"

read -p "Enter your domain name (or IP) [localhost]: " DOMAIN
DOMAIN=${DOMAIN:-localhost}

read -p "Enter database password [your-secure-password-change-this]: " DB_PASSWORD
DB_PASSWORD=${DB_PASSWORD:-your-secure-password-change-this}

read -p "Enter JWT secret [$(openssl rand -hex 32)]: " JWT_SECRET
if [ -z "$JWT_SECRET" ]; then
    JWT_SECRET=$(openssl rand -hex 32)
fi

read -p "Enter JWT refresh secret [$(openssl rand -hex 32)]: " JWT_REFRESH_SECRET
if [ -z "$JWT_REFRESH_SECRET" ]; then
    JWT_REFRESH_SECRET=$(openssl rand -hex 32)
fi

# Update backend .env
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

echo -e "${GREEN}✓ Backend environment configured${NC}"

# Frontend environment setup
echo -e "${BLUE}Configuring Frontend Environment...${NC}"

read -p "Enter Google Maps API Key: " GOOGLE_MAPS_KEY

# Update frontend .env
cat > frontend/.env << EOF
VITE_API_BASE_URL=https://${DOMAIN}/api
VITE_GOOGLE_MAPS_API_KEY=${GOOGLE_MAPS_KEY}
EOF

echo -e "${GREEN}✓ Frontend environment configured${NC}"

# Docker Compose environment
echo -e "${BLUE}Configuring Docker Services...${NC}"

read -p "Enter pgAdmin password [admin123]: " PGADMIN_PASSWORD
PGADMIN_PASSWORD=${PGADMIN_PASSWORD:-admin123}

read -p "Enter Grafana password [admin123]: " GRAFANA_PASSWORD
GRAFANA_PASSWORD=${GRAFANA_PASSWORD:-admin123}

# Update docker-compose.yml with custom passwords
sed -i "s/PGADMIN_DEFAULT_PASSWORD: admin123/PGADMIN_DEFAULT_PASSWORD: ${PGADMIN_PASSWORD}/g" docker-compose.yml
sed -i "s/GF_SECURITY_ADMIN_PASSWORD: admin123/GF_SECURITY_ADMIN_PASSWORD: ${GRAFANA_PASSWORD}/g" docker-compose.yml

echo -e "${GREEN}✓ Docker services configured${NC}"

# Display configuration summary
echo ""
echo -e "${GREEN}🎉 Environment Setup Complete!${NC}"
echo "=================================="
echo ""
echo "Access URLs:"
echo "🌐 Main Application: https://${DOMAIN}"
echo "🔧 pgAdmin: https://${DOMAIN}:5050"
echo "📊 Prometheus: https://${DOMAIN}:9090"
echo "📈 Grafana: https://${DOMAIN}:3001"
echo ""
echo "Credentials:"
echo "pgAdmin: admin@snap.com / ${PGADMIN_PASSWORD}"
echo "Grafana: admin / ${GRAFANA_PASSWORD}"
echo ""
echo -e "${YELLOW}⚠️  IMPORTANT SECURITY NOTES:${NC}"
echo "1. Change default passwords in production"
echo "2. Use strong, unique passwords"
echo "3. Keep JWT secrets secure and rotate regularly"
echo "4. Set up SSL/TLS certificates"
echo "5. Configure firewall rules"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "1. Run: docker-compose down && docker-compose up -d"
echo "2. Check logs: docker-compose logs -f"
echo "3. Set up SSL: Follow DEPLOYMENT.md for Let's Encrypt"
echo "4. Configure domain DNS to point to this server"