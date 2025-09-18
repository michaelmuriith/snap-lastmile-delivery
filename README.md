# SNAP - Last-Mile Delivery Application

A scalable last-mile delivery platform built with NestJS backend and React frontend, featuring real-time tracking, role-based authentication, and mobile-first design.

## 🚀 Quick Start with Docker

### Prerequisites
- Docker and Docker Compose installed
- At least 4GB RAM available
- Ports 3000, 5432, and 6379 available

### Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd snap
   ```

2. **Start the development environment**
   ```bash
   docker-compose -f docker-compose.dev.yml up --build
   ```

   This will start:
   - **PostgreSQL** on port 5432
   - **Redis** on port 6379
   - **Backend API** on port 3000 with hot reload

3. **Database initialization**
   The database will be automatically initialized with the schema when the containers start.

4. **Access the application**
   - API: http://localhost:3000
   - API Documentation: http://localhost:3000/api (when Swagger is implemented)

### Production Setup

1. **Build and start production environment**
   ```bash
   docker-compose up --build -d
   ```

2. **Check logs**
   ```bash
   docker-compose logs -f backend
   ```

### Docker Commands

```bash
# Start all services
docker-compose -f docker-compose.dev.yml up -d

# Stop all services
docker-compose down

# Rebuild and restart
docker-compose up --build

# View logs
docker-compose logs -f

# Access database directly
docker exec -it snap_postgres psql -U postgres -d snap_db

# Access Redis directly
docker exec -it snap_redis redis-cli
```

## 🏗️ Architecture

### Backend (NestJS + TypeScript)
- **Authentication**: JWT with refresh tokens
- **Database**: PostgreSQL with raw SQL queries
- **Cache**: Redis for sessions and caching
- **Real-time**: WebSocket support for live tracking
- **CQRS**: Command Query Responsibility Segregation for complex operations

### Database Schema
- Users (customers, drivers, admins)
- Deliveries with status tracking
- Real-time GPS tracking sessions
- Payment transactions
- Notifications and audit logs

## 🔧 Environment Configuration

Copy `.env.example` to `.env` and configure:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=snap_db

# JWT
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
```

## 📡 API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - User logout
- `GET /auth/profile` - Get user profile

### Users (Protected)
- `GET /users` - List users (admin only)
- `GET /users/:id` - Get user details
- `PUT /users/:id` - Update user

### Deliveries (Protected)
- `POST /deliveries` - Create delivery request
- `GET /deliveries` - List user deliveries
- `GET /deliveries/:id` - Get delivery details
- `PUT /deliveries/:id/status` - Update delivery status

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run e2e tests
npm run test:e2e

# Run with coverage
npm run test:cov
```

## 🚀 Deployment

### Docker Production Build
```bash
docker build -f backend/Dockerfile -t snap-backend ./backend
docker run -p 3000:3000 snap-backend
```

### Environment Variables for Production
- Use strong, unique secrets for JWT
- Configure proper database credentials
- Set `NODE_ENV=production`
- Configure CORS for your frontend domain

## 📁 Project Structure

```
snap/
├── backend/                 # NestJS API server
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   ├── database/       # Database connection & migrations
│   │   ├── users/          # User management
│   │   ├── deliveries/     # Delivery operations
│   │   └── ...
│   ├── Dockerfile
│   └── package.json
├── frontend/                # React application (future)
├── docs/                   # Documentation
├── docker-compose.yml      # Production setup
├── docker-compose.dev.yml  # Development setup
└── README.md
```

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Tokens**: Short-lived access tokens with refresh mechanism
- **Role-Based Access**: Customer, Driver, Admin roles
- **Input Validation**: Class-validator for all inputs
- **CORS Protection**: Configured for frontend domain
- **SQL Injection Prevention**: Parameterized queries

## 📊 Monitoring

- Health checks for all services
- Database connection monitoring
- Application performance metrics
- Error logging and tracking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Common Issues

**Database Connection Failed**
```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# Check database logs
docker-compose logs postgres
```

**Port Already in Use**
```bash
# Find process using port
netstat -tulpn | grep :3000

# Kill process or change port in docker-compose.yml
```

**Redis Connection Issues**
```bash
# Test Redis connection
docker exec -it snap_redis redis-cli ping
```

### Logs and Debugging

```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend

# Access container shell
docker exec -it snap_backend sh
```

For more help, check the [Issues](https://github.com/your-repo/issues) page or create a new issue.