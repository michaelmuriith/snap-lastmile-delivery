# SNAP - Last-Mile Delivery Application

A comprehensive last-mile delivery platform built with modern technologies, featuring real-time tracking, multi-user dashboards, and complete monitoring stack.

## 🚀 Quick Start

### Prerequisites
- Ubuntu/Debian VPS (2GB RAM, 20GB storage minimum)
- Docker and Docker Compose
- Domain name (recommended)

### One-Command Deployment

```bash
# Clone repository
git clone <your-repo-url>
cd snap

# Run deployment script
chmod +x deploy.sh && ./deploy.sh

# Configure environment
sudo chmod +x setup-env.sh && ./setup-env.sh

# Start application
docker-compose up -d
```

## 📋 Services Overview

| Service | Port | Description | Access |
|---------|------|-------------|---------|
| Frontend | 80 | React SPA with Nginx | `http://your-domain` |
| Backend | 3000 | NestJS API | `http://your-domain:3000` |
| PostgreSQL | 5432 | Database | Internal only |
| Redis | 6379 | Cache & Sessions | Internal only |
| pgAdmin | 5050 | Database Management | `http://your-domain:5050` |
| Prometheus | 9090 | Metrics Collection | `http://your-domain:9090` |
| Grafana | 3001 | Monitoring Dashboard | `http://your-domain:3001` |
| Node Exporter | 9100 | System Metrics | Internal |
| cAdvisor | 8080 | Container Metrics | Internal |

## 🔐 Default Credentials

| Service | Username | Password |
|---------|----------|----------|
| pgAdmin | admin@snap.com | admin123 |
| Grafana | admin | admin123 |

> **⚠️ Change these passwords in production!**

## 🏗️ Architecture

### Backend (NestJS)
- **CQRS Pattern**: Separate read/write operations for scalability
- **JWT Authentication**: Secure token-based auth with refresh tokens
- **Role-Based Access Control**: Customer, Driver, Admin roles
- **WebSocket Integration**: Real-time delivery tracking
- **Raw SQL Queries**: Direct database access with connection pooling

### Frontend (React + Vite)
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **PWA Features**: Offline support, installable app
- **Real-time Maps**: Google Maps integration with live tracking
- **State Management**: Zustand for efficient state handling
- **Component Library**: ShadCN UI for consistent design

### Monitoring Stack
- **Prometheus**: Metrics collection and alerting
- **Grafana**: Visualization and dashboards
- **Node Exporter**: System resource monitoring
- **cAdvisor**: Docker container metrics
- **pgAdmin**: Database administration

## 📱 Features

### 👤 User Roles
- **Customers**: Create and track deliveries
- **Drivers**: Accept and complete delivery assignments
- **Admins**: Oversee platform operations and analytics

### 📦 Delivery Management
- **Real-time Tracking**: GPS-based driver location updates
- **Status Updates**: Automated delivery lifecycle management
- **Payment Integration**: Secure payment processing
- **Notifications**: Email, SMS, and in-app notifications

### 🗺️ Mapping & Navigation
- **Google Maps Integration**: Interactive maps with custom markers
- **Route Optimization**: Efficient delivery routing
- **Geocoding**: Address-to-coordinate conversion
- **Real-time Updates**: Live driver position tracking

## 🚀 Deployment Options

### Automated Deployment
```bash
./deploy.sh          # Install dependencies and configure services
./setup-env.sh       # Configure environment variables
docker-compose up -d # Start all services
```

### Manual Deployment
1. Install Docker and Docker Compose
2. Clone repository
3. Configure environment variables
4. Run `docker-compose up -d`

### Production Setup
- Set up SSL/TLS with Let's Encrypt
- Configure domain DNS
- Set up automated backups
- Configure monitoring alerts
- Enable firewall rules

## 🔧 Development

### Local Development
```bash
# Backend
cd backend && npm install && npm run start:dev

# Frontend
cd frontend && npm install && npm run dev

# Database
docker-compose up postgres redis -d
```

### Testing
```bash
# Backend tests
cd backend && npm run test

# E2E tests
cd backend && npm run test:e2e
```

## 📊 Monitoring

### Grafana Dashboards
- **SNAP Overview**: System performance and container metrics
- **Database Performance**: PostgreSQL connection and query metrics
- **Application Metrics**: API response times and error rates

### Prometheus Metrics
- **System Resources**: CPU, memory, disk usage
- **Application Performance**: Request rates, latency, errors
- **Database Metrics**: Connection pools, query performance
- **Container Metrics**: Resource usage per service

## 🔒 Security

### Production Security
- JWT tokens with secure secrets
- Password hashing with bcrypt
- CORS configuration
- Rate limiting
- Input validation
- SQL injection prevention

### Network Security
- Internal database access only
- Firewall configuration
- SSL/TLS encryption
- Secure API endpoints

## 📚 Documentation

- **[API Documentation](./docs/api.md)**: Complete API reference
- **[Architecture](./docs/architecture.md)**: System design and patterns
- **[Deployment](./DEPLOYMENT.md)**: Detailed deployment guide
- **[Frontend Structure](./docs/frontend-structure.md)**: Component organization
- **[Backend Structure](./docs/backend-structure.md)**: Module breakdown

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Check the [Deployment Guide](./DEPLOYMENT.md)
- Review [Troubleshooting](./DEPLOYMENT.md#troubleshooting)
- Check logs: `docker-compose logs`
- Monitor dashboards in Grafana

---

**Built with ❤️ using NestJS, React, PostgreSQL, and Docker**