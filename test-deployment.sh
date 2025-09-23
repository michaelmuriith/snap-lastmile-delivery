#!/bin/bash

# SNAP Application - Deployment Test Script
# Run this after deployment to verify everything is working

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_header() {
    echo -e "\n${BLUE}================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}================================${NC}\n"
}

print_success() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

print_info() {
    echo -e "${BLUE}[i]${NC} $1"
}

# Get domain/IP from environment or ask user
get_domain() {
    if [[ -f ".env" ]]; then
        DOMAIN=$(grep "VITE_API_BASE_URL" .env | cut -d'=' -f2 | sed 's|https://||' | sed 's|/api||')
    fi

    if [[ -z "$DOMAIN" ]]; then
        read -p "Enter your domain/IP: " DOMAIN
    fi

    echo $DOMAIN
}

# Test service availability
test_service() {
    local service_name=$1
    local url=$2
    local expected_code=${3:-200}

    print_info "Testing $service_name..."

    if curl -s --max-time 10 --head "$url" | head -n 1 | grep -q "$expected_code"; then
        print_success "$service_name is accessible"
        return 0
    else
        print_error "$service_name is not accessible"
        return 1
    fi
}

# Test Docker services
test_docker_services() {
    print_header "Testing Docker Services"

    # Check if docker-compose is running
    if ! docker-compose ps | grep -q "Up"; then
        print_error "No Docker services are running"
        print_info "Run: docker-compose up -d"
        return 1
    fi

    print_success "Docker services are running"

    # Check individual services
    services=$(docker-compose ps --services --filter "status=running")
    for service in $services; do
        print_success "Service $service is running"
    done
}

# Test application endpoints
test_application() {
    print_header "Testing Application Endpoints"

    DOMAIN=$(get_domain)

    # Test main application
    test_service "Frontend" "http://$DOMAIN" || return 1

    # Test backend API
    test_service "Backend API" "http://$DOMAIN:3000/health" || return 1

    # Test pgAdmin
    test_service "pgAdmin" "http://$DOMAIN:5050" || return 1

    # Test Prometheus
    test_service "Prometheus" "http://$DOMAIN:9090" || return 1

    # Test Grafana
    test_service "Grafana" "http://$DOMAIN:3001" || return 1
}

# Test database connectivity
test_database() {
    print_header "Testing Database Connectivity"

    # Test database connection via backend
    if docker-compose exec -T backend curl -s http://localhost:3000/health | grep -q "ok"; then
        print_success "Database connection is working"
    else
        print_error "Database connection failed"
        return 1
    fi
}

# Test SSL certificate
test_ssl() {
    print_header "Testing SSL Certificate"

    DOMAIN=$(get_domain)

    # Skip if using IP address
    if [[ $DOMAIN =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
        print_info "Using IP address - SSL test skipped"
        return 0
    fi

    if curl -s --max-time 10 "https://$DOMAIN" | head -n 1 | grep -q "200"; then
        print_success "SSL certificate is working"
    else
        print_warning "SSL certificate may not be configured"
        print_info "Run: sudo certbot --nginx -d $DOMAIN"
    fi
}

# Show access information
show_access_info() {
    print_header "Access Information"

    DOMAIN=$(get_domain)

    echo "🌐 Main Application: http://$DOMAIN"
    echo "🔧 pgAdmin: http://$DOMAIN:5050"
    echo "📊 Prometheus: http://$DOMAIN:9090"
    echo "📈 Grafana: http://$DOMAIN:3001"
    echo "🔌 Backend API: http://$DOMAIN:3000"
    echo
    echo "Credentials:"
    echo "pgAdmin: admin@snap.com / [configured password]"
    echo "Grafana: admin / [configured password]"
    echo
}

# Show system information
show_system_info() {
    print_header "System Information"

    echo "Disk Usage:"
    df -h | head -n 5
    echo

    echo "Memory Usage:"
    free -h
    echo

    echo "Docker Containers:"
    docker-compose ps
    echo

    echo "Recent Logs:"
    docker-compose logs --tail=10
}

# Main test function
main() {
    print_header "SNAP Application - Deployment Test"

    local all_passed=true

    # Run all tests
    test_docker_services || all_passed=false
    test_application || all_passed=false
    test_database || all_passed=false
    test_ssl

    # Show information
    show_access_info
    show_system_info

    # Final result
    print_header "Test Results"

    if $all_passed; then
        print_success "All tests passed! Your SNAP application is ready."
        echo
        print_info "Next steps:"
        echo "1. Access your application at http://$DOMAIN"
        echo "2. Create your first admin user"
        echo "3. Configure monitoring alerts in Grafana"
        echo "4. Set up automated backups"
    else
        print_error "Some tests failed. Please check the errors above."
        echo
        print_info "Common solutions:"
        echo "1. Check logs: docker-compose logs"
        echo "2. Restart services: docker-compose restart"
        echo "3. Rebuild: docker-compose down && docker-compose up -d --build"
        echo "4. Check environment variables in .env files"
    fi
}

# Run main function
main "$@"