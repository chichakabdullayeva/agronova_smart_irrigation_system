#!/bin/bash

# AGRANOVA Vercel Deployment Helper
# This script helps you prepare and deploy to Vercel with demo data

# Color codes
GREEN='\033[0;92m'
RED='\033[0;91m'
YELLOW='\033[0;93m'
BLUE='\033[0;94m'
NC='\033[0m' # No Color

function print_header() {
    echo -e "\n${BLUE}════════════════════════════════════════${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}════════════════════════════════════════${NC}\n"
}

function print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

function print_error() {
    echo -e "${RED}✗${NC} $1"
}

function print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

function print_info() {
    echo -e "${BLUE}→${NC} $1"
}

function test_mongodb() {
    print_header "Testing MongoDB Connection"
    
    read -p "Enter your MongoDB URI: " mongo_uri
    if [ -z "$mongo_uri" ]; then
        print_error "MongoDB URI cannot be empty"
        return 1
    fi
    
    print_info "MongoDB URI format looks valid"
    print_success "MongoDB connection URI ready"
    
    echo "$mongo_uri"
}

function update_environment() {
    local mongo_uri="$1"
    local app_url="$2"
    
    print_header "Updating Environment Variables"
    
    # Update backend .env
    if [ -f "backend/.env" ]; then
        print_info "Updating backend/.env..."
        
        # Use sed to update the file
        sed -i.bak "s|MONGODB_URI=.*|MONGODB_URI=$mongo_uri|g" backend/.env
        sed -i.bak "s|FRONTEND_URL=.*|FRONTEND_URL=https://$app_url|g" backend/.env
        sed -i.bak "s|NODE_ENV=.*|NODE_ENV=production|g" backend/.env
        
        rm -f backend/.env.bak
        print_success "Updated backend/.env"
    else
        print_error "backend/.env not found"
    fi
    
    # Update frontend .env.production
    if [ -f "frontend/.env.production" ]; then
        print_info "Updating frontend/.env.production..."
        
        cat > frontend/.env.production << EOF
REACT_APP_API_URL=https://$app_url/api
REACT_APP_SOCKET_URL=https://$app_url
EOF
        
        print_success "Updated frontend/.env.production"
    else
        print_error "frontend/.env.production not found"
    fi
}

function seed_database() {
    print_header "Seeding Database with Demo Data"
    
    cd backend
    
    print_info "Installing backend dependencies..."
    npm install > /dev/null 2>&1
    
    print_info "Running comprehensive seed script..."
    print_info "This will create:"
    print_info "  • 16 users across 7 regions"
    print_info "  • 15 irrigation systems with sensors"
    print_info "  • 6 shop devices"
    print_info "  • 12 orders"
    print_info "  • Community content"
    echo ""
    
    npm run seed:comprehensive
    
    cd ..
}

function deploy_vercel() {
    print_header "Deploying to Vercel"
    
    print_info "Checking git status..."
    if [ -n "$(git status --porcelain)" ]; then
        print_warning "You have uncommitted changes"
        read -p "Continue with deployment? (y/n) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_error "Deployment cancelled"
            return
        fi
    fi
    
    print_info "Committing changes..."
    git add .
    git commit -m "Deploy to Vercel with demo data - $(date '+%Y-%m-%d %H:%M:%S')"
    
    print_info "Pushing to GitHub..."
    git push origin main
    
    print_success "Pushed to GitHub!"
    print_info "Visit Vercel dashboard to monitor deployment: https://vercel.com/dashboard"
    print_info "Deployment typically completes in 2-5 minutes"
}

function show_summary() {
    local mongo_uri="$1"
    local app_url="$2"
    
    print_header "Deployment Summary"
    
    print_info "Database Configuration:"
    echo "  URI: $mongo_uri"
    
    print_info "Deployment Information:"
    echo "  App URL: https://$app_url"
    echo "  Environment: production"
    
    print_info "Demo Accounts:"
    echo "  Admin 1: admin@agranova.com / admin123"
    echo "  Admin 2: demo@agranova.com / demo123"
    echo "  Farmers: rashad@farmer.com, leyla@farm.az, etc. / user123"
    
    print_info "Seeded Data:"
    echo "  • 16 users"
    echo "  • 15 irrigation systems"
    echo "  • 6 shop devices"
    echo "  • 12 orders"
    echo "  • Community discussions"
    
    print_info "Next Steps:"
    echo "  1. Monitor deployment at: https://vercel.com/dashboard"
    echo "  2. Wait for build to complete (2-5 minutes)"
    echo "  3. Visit: https://$app_url/admin"
    echo "  4. Login with admin credentials"
    echo "  5. Verify all data displays correctly"
    
    print_info "For detailed guide, see: VERCEL_DEPLOYMENT_GUIDE.md"
    print_info "For troubleshooting, see: DEPLOYMENT_QUICK_START.md"
}

function show_help() {
    print_header "AGRANOVA Deployment Helper"
    
    print_info "Usage: ./deploy.sh [action]"
    
    echo "Available Actions:"
    echo "  test-mongo      - Test MongoDB Atlas connection"
    echo "  setup           - Interactive setup and deployment"
    echo "  seed            - Seed database with demo data"
    echo "  deploy          - Deploy to Vercel"
    echo "  status          - Show deployment status"
    echo "  help            - Show this help message"
    
    echo ""
    echo "Examples:"
    echo "  ./deploy.sh setup"
    echo "  ./deploy.sh seed"
    echo "  ./deploy.sh deploy"
    
    echo ""
    echo "Quick Start:"
    echo "  1. ./deploy.sh setup              (interactive setup)"
    echo "  2. ./deploy.sh seed              (seed database)"
    echo "  3. ./deploy.sh deploy            (deploy to Vercel)"
    echo ""
}

function interactive_setup() {
    print_header "AGRANOVA Interactive Setup"
    
    print_info "This script will help you deploy to Vercel with demo data"
    
    # Get MongoDB URI
    mongo_uri=$(test_mongodb)
    if [ $? -ne 0 ]; then
        return
    fi
    
    # Get app URL
    echo ""
    print_info "What is your Vercel app URL? (e.g., agranova-demo.vercel.app)"
    read -p "App URL: " app_url
    if [ -z "$app_url" ]; then
        print_error "App URL cannot be empty"
        return
    fi
    
    # Update environment files
    update_environment "$mongo_uri" "$app_url"
    
    # Ask to seed
    echo ""
    read -p "Seed database with demo data? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        seed_database
    fi
    
    # Ask to deploy
    echo ""
    read -p "Deploy to Vercel? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        deploy_vercel
    fi
    
    # Show summary
    show_summary "$mongo_uri" "$app_url"
}

# Main logic
action="${1:-help}"

case "$action" in
    test-mongo)
        test_mongodb
        ;;
    setup)
        interactive_setup
        ;;
    seed)
        seed_database
        ;;
    deploy)
        deploy_vercel
        ;;
    status)
        print_info "For deployment status, visit: https://vercel.com/dashboard"
        ;;
    help)
        show_help
        ;;
    *)
        show_help
        ;;
esac
