#!/bin/bash

# SNAP Database Initialization Script
# This script helps set up the database for local development

set -e

echo "🚀 Initializing SNAP Database..."

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
until docker exec snap_postgres pg_isready -U postgres -d snap_db; do
  echo "PostgreSQL is unavailable - sleeping"
  sleep 2
done

echo "✅ PostgreSQL is ready!"

# Check if database is already initialized
echo "🔍 Checking database initialization..."
DB_EXISTS=$(docker exec snap_postgres psql -U postgres -d snap_db -tAc "SELECT 1 FROM information_schema.tables WHERE table_name = 'users' LIMIT 1;")

if [ "$DB_EXISTS" = "1" ]; then
  echo "ℹ️  Database already initialized. Skipping schema creation."
else
  echo "📝 Creating database schema..."
  docker exec -i snap_postgres psql -U postgres -d snap_db < backend/src/database/migrations/001_initial_schema.sql
  echo "✅ Database schema created successfully!"
fi

# Create default admin user (optional)
echo "👤 Creating default admin user..."
docker exec snap_postgres psql -U postgres -d snap_db -c "
INSERT INTO users (name, email, phone, password, role, is_verified, created_at, updated_at)
VALUES (
  'Admin User',
  'admin@snap.com',
  '+1234567890',
  '\$2b\$10\$hashedpassword', -- This should be properly hashed
  'admin',
  true,
  NOW(),
  NOW()
) ON CONFLICT (email) DO NOTHING;
"

echo "🎉 Database initialization complete!"
echo ""
echo "📋 Next steps:"
echo "1. Start the backend: docker-compose -f docker-compose.dev.yml up backend"
echo "2. Test the API: curl http://localhost:3000"
echo "3. Check logs: docker-compose logs -f backend"
echo ""
echo "🔐 Default admin credentials:"
echo "Email: admin@snap.com"
echo "Password: admin123 (you should change this)"
echo ""
echo "📚 API Documentation: http://localhost:3000/api (when implemented)"