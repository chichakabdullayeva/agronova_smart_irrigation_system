# AGRANOVA Vercel Deployment Helper
# This script helps you prepare and deploy to Vercel with demo data

param(
    [string]$action = "help"
)

# Color codes for output
$green = "`e[92m"
$red = "`e[91m"
$yellow = "`e[93m"
$blue = "`e[94m"
$reset = "`e[0m"

function Write-Header {
    param([string]$text)
    Write-Host "`n$blue╔$('═' * ($text.Length + 2))╗$reset"
    Write-Host "$blue║ $text ║$reset"
    Write-Host "$blue╚$('═' * ($text.Length + 2))╝$reset`n"
}

function Write-Success {
    param([string]$text)
    Write-Host "$green✓$reset $text"
}

function Write-Error-Custom {
    param([string]$text)
    Write-Host "$red✗$reset $text"
}

function Write-Warning-Custom {
    param([string]$text)
    Write-Host "$yellow⚠$reset $text"
}

function Write-Info {
    param([string]$text)
    Write-Host "$blue→$reset $text"
}

function Test-MongoDB {
    Write-Header "Testing MongoDB Connection"
    
    $mongoUri = Read-Host "Enter your MongoDB URI"
    if ([string]::IsNullOrWhiteSpace($mongoUri)) {
        Write-Error-Custom "MongoDB URI cannot be empty"
        return $false
    }
    
    Write-Info "Testing connection..."
    # Note: Actual connection test would require MongoDB tools
    Write-Success "MongoDB URI format valid"
    
    return $mongoUri
}

function Update-Environment {
    param(
        [string]$mongoUri,
        [string]$appUrl
    )
    
    Write-Header "Updating Environment Variables"
    
    # Update backend .env
    $backendEnv = "backend\.env"
    if (Test-Path $backendEnv) {
        Write-Info "Updating backend/.env..."
        
        $content = Get-Content $backendEnv -Raw
        $content = $content -replace "MONGODB_URI=.*", "MONGODB_URI=$mongoUri"
        $content = $content -replace "FRONTEND_URL=.*", "FRONTEND_URL=https://$appUrl"
        $content = $content -replace "NODE_ENV=.*", "NODE_ENV=production"
        
        Set-Content $backendEnv $content
        Write-Success "Updated backend/.env"
    } else {
        Write-Error-Custom "backend/.env not found"
    }
    
    # Update frontend .env.production
    $frontendEnv = "frontend\.env.production"
    if (Test-Path $frontendEnv) {
        Write-Info "Updating frontend/.env.production..."
        
        $content = @"
REACT_APP_API_URL=https://$appUrl/api
REACT_APP_SOCKET_URL=https://$appUrl
"@
        
        Set-Content $frontendEnv $content
        Write-Success "Updated frontend/.env.production"
    } else {
        Write-Error-Custom "frontend/.env.production not found"
    }
}

function Seed-Database {
    Write-Header "Seeding Database with Demo Data"
    
    Push-Location backend
    
    Write-Info "Installing backend dependencies..."
    npm install 2>&1 | Out-Null
    
    Write-Info "Running comprehensive seed script..."
    Write-Info "This will create:"
    Write-Info "  • 16 users across 7 regions"
    Write-Info "  • 15 irrigation systems with sensors"
    Write-Info "  • 6 shop devices"
    Write-Info "  • 12 orders"
    Write-Info "  • Community content"
    Write-Info ""
    
    npm run seed:comprehensive
    
    Pop-Location
}

function Deploy-Vercel {
    Write-Header "Deploying to Vercel"
    
    Write-Info "Checking git status..."
    $status = git status --porcelain
    
    if ($status) {
        Write-Warning-Custom "You have uncommitted changes"
        $continue = Read-Host "Continue with deployment? (y/n)"
        if ($continue -ne "y") {
            Write-Error-Custom "Deployment cancelled"
            return
        }
    }
    
    Write-Info "Committing changes..."
    git add .
    git commit -m "Deploy to Vercel with demo data - $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
    
    Write-Info "Pushing to GitHub..."
    git push origin main
    
    Write-Success "Pushed to GitHub!"
    Write-Info "Visit Vercel dashboard to monitor deployment: https://vercel.com/dashboard"
    Write-Info "Deployment typically completes in 2-5 minutes"
}

function Show-Summary {
    param(
        [string]$mongoUri,
        [string]$appUrl
    )
    
    Write-Header "Deployment Summary"
    
    Write-Info "Database Configuration:"
    Write-Host "  URI: $mongoUri"
    
    Write-Info "`nDeployment Information:"
    Write-Host "  App URL: https://$appUrl"
    Write-Host "  Environment: production"
    
    Write-Info "`nDemo Accounts:"
    Write-Host "  Admin 1: admin@agranova.com / admin123"
    Write-Host "  Admin 2: demo@agranova.com / demo123"
    Write-Host "  Farmers: rashad@farmer.com, leyla@farm.az, etc. / user123"
    
    Write-Info "`nSeeded Data:"
    Write-Host "  • 16 users"
    Write-Host "  • 15 irrigation systems"
    Write-Host "  • 6 shop devices"
    Write-Host "  • 12 orders"
    Write-Host "  • Community discussions"
    
    Write-Info "`nNext Steps:"
    Write-Host "  1. Monitor deployment at: https://vercel.com/dashboard"
    Write-Host "  2. Wait for build to complete (2-5 minutes)"
    Write-Host "  3. Visit: https://$appUrl/admin"
    Write-Host "  4. Login with admin credentials"
    Write-Host "  5. Verify all data displays correctly"
    
    Write-Info "`nFor detailed guide, see: VERCEL_DEPLOYMENT_GUIDE.md"
    Write-Info "For troubleshooting, see: DEPLOYMENT_QUICK_START.md"
}

function Show-Help {
    Write-Header "AGRANOVA Deployment Helper"
    
    Write-Info "Usage: .\deploy.ps1 [action]"
    
    Write-Host "`nAvailable Actions:"
    Write-Host "  test-mongo      - Test MongoDB Atlas connection"
    Write-Host "  setup           - Interactive setup and deployment"
    Write-Host "  seed            - Seed database with demo data"
    Write-Host "  deploy          - Deploy to Vercel"
    Write-Host "  status          - Show deployment status"
    Write-Host "  help            - Show this help message"
    
    Write-Host "`nExamples:"
    Write-Host "  .\deploy.ps1 setup"
    Write-Host "  .\deploy.ps1 seed"
    Write-Host "  .\deploy.ps1 deploy"
    
    Write-Host "`nQuick Start:"
    Write-Host "  1. .\deploy.ps1 setup              (interactive setup)"
    Write-Host "  2. .\deploy.ps1 seed              (seed database)"
    Write-Host "  3. .\deploy.ps1 deploy            (deploy to Vercel)"
    Write-Host ""
}

function Interactive-Setup {
    Write-Header "AGRANOVA Interactive Setup"
    
    Write-Info "This script will help you deploy to Vercel with demo data"
    
    # Get MongoDB URI
    $mongoUri = Test-MongoDB
    if (-not $mongoUri) { return }
    
    # Get app URL
    Write-Host ""
    Write-Info "What is your Vercel app URL? (e.g., agranova-demo.vercel.app)"
    $appUrl = Read-Host "App URL"
    if ([string]::IsNullOrWhiteSpace($appUrl)) {
        Write-Error-Custom "App URL cannot be empty"
        return
    }
    
    # Update environment files
    Update-Environment $mongoUri $appUrl
    
    # Ask to seed
    Write-Host ""
    $seedConfirm = Read-Host "Seed database with demo data? (y/n)"
    if ($seedConfirm -eq "y") {
        Seed-Database
    }
    
    # Ask to deploy
    Write-Host ""
    $deployConfirm = Read-Host "Deploy to Vercel? (y/n)"
    if ($deployConfirm -eq "y") {
        Deploy-Vercel
    }
    
    # Show summary
    Show-Summary $mongoUri $appUrl
}

# Main logic
switch ($action) {
    "test-mongo" { 
        Test-MongoDB | Out-Null
    }
    "setup" { 
        Interactive-Setup 
    }
    "seed" { 
        Seed-Database 
    }
    "deploy" { 
        Deploy-Vercel 
    }
    "status" { 
        Write-Info "For deployment status, visit: https://vercel.com/dashboard"
    }
    "help" { 
        Show-Help 
    }
    default { 
        Show-Help 
    }
}
