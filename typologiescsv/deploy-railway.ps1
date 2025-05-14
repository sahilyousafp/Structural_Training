# Railway Deployment Script
$PSVersion = $PSVersionTable.PSVersion
Write-Host "PowerShell Version: $($PSVersion.Major).$($PSVersion.Minor).$($PSVersion.Build)"

# Function to check if command exists
function Test-Command($command) {
    $exists = $null -ne (Get-Command $command -ErrorAction SilentlyContinue)
    return $exists
}

# Check for Railway CLI
if (-not (Test-Command "railway")) {
    Write-Host "Railway CLI not found. Installing..."
    # Install Railway CLI
    try {
        Invoke-WebRequest -Uri "https://raw.githubusercontent.com/railwayapp/cli/master/install.ps1" -OutFile "railway-install.ps1"
        .\railway-install.ps1
        Remove-Item "railway-install.ps1" -Force
    } catch {
        Write-Host "Failed to install Railway CLI. Please install it manually: https://docs.railway.app/develop/cli"
        exit 1
    }
}

# Check for Docker
if (-not (Test-Command "docker")) {
    Write-Host "Docker not found. Please install Docker Desktop: https://www.docker.com/products/docker-desktop/"
    exit 1
}

# Verify Docker is running
try {
    docker info | Out-Null
    Write-Host "Docker is running..."
} catch {
    Write-Host "Docker is not running. Please start Docker Desktop and try again."
    exit 1
}

# Login to Railway
Write-Host "Logging in to Railway..."
railway login

# Create a new Railway project if not linked
try {
    $projectInfo = railway project
    Write-Host "Using existing linked project: $projectInfo"
} catch {
    Write-Host "No project linked. Creating new project..."
    railway project create
    railway link
}

# Deploy to Railway
Write-Host "Deploying to Railway..."
railway up

Write-Host "Deployment complete! Your app should be available at the Railway-provided URL."
Write-Host "You can find your deployment URL by running: railway domain"
