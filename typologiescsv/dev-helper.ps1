<#
CSV Visualizer Development Helper Script
This script provides quick functions for the most common development tasks.
#>

param (
    [string]$Task = "help"
)

function ShowHelp {
    Write-Host "`nCSV Visualizer Development Helper" -ForegroundColor Cyan
    Write-Host "===================================" -ForegroundColor Cyan
    Write-Host "Available tasks:" -ForegroundColor Yellow
    Write-Host "  dev       - Run development environment (React + Server)"
    Write-Host "  build     - Build the application for production"
    Write-Host "  server    - Run the server only"
    Write-Host "  client    - Run the React client only"
    Write-Host "  copycsv   - Copy CSV files to public directory"
    Write-Host "  prod      - Build and run in production mode"
    Write-Host "  clean     - Clean build directories"
    Write-Host "  deploy    - Create deployment package" 
    Write-Host "  info      - Show project configuration information"
    Write-Host "  fix       - Fix common development issues"
    Write-Host "  help      - Show this help text"
    Write-Host "`nUsage: .\dev-helper.ps1 <task>"
    Write-Host "Example: .\dev-helper.ps1 dev`n"
}

function RunDevEnvironment {
    Write-Host "`nStarting development environment..." -ForegroundColor Cyan
    Write-Host "This will start both the React app and Express server.`n" -ForegroundColor Yellow
    
    try {
        npm run dev
    } catch {
        Write-Host "`nError starting development environment. Make sure dependencies are installed:" -ForegroundColor Red
        Write-Host "  npm install" -ForegroundColor Yellow
        Write-Host "  npm install concurrently --save-dev" -ForegroundColor Yellow
    }
}

function BuildApp {
    Write-Host "`nBuilding application for production..." -ForegroundColor Cyan
    
    # Run copyCSVFiles first to ensure we have CSV files
    CopyCsvFiles
    
    npm run build
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`nBuild completed successfully!" -ForegroundColor Green
        Write-Host "The build output is located in the ./build directory" -ForegroundColor Yellow
    } else {
        Write-Host "`nBuild failed!" -ForegroundColor Red
    }
}

function RunServer {
    Write-Host "`nStarting server..." -ForegroundColor Cyan
    
    npm run server
}

function RunClient {
    Write-Host "`nStarting React client..." -ForegroundColor Cyan
    
    npm run start
}

function CopyCsvFiles {
    Write-Host "`nCopying CSV files to public directory..." -ForegroundColor Cyan
    
    node copyCSVFiles.js
    
    Write-Host "CSV files copied." -ForegroundColor Green
}

function RunProduction {
    Write-Host "`nBuilding and running in production mode..." -ForegroundColor Cyan
    
    npm run prod
}

function CleanDirectories {
    Write-Host "`nCleaning build directories..." -ForegroundColor Cyan
    
    if (Test-Path "build") {
        Remove-Item -Path "build" -Recurse -Force
        Write-Host "Removed build directory" -ForegroundColor Green
    }
    
    Write-Host "Clean completed!" -ForegroundColor Green
}

function ShowProjectInfo {
    Write-Host "`nCSV Visualizer Project Information" -ForegroundColor Cyan
    Write-Host "==================================" -ForegroundColor Cyan
    
    # Check Node.js version
    try {
        $nodeVersion = node -v
        Write-Host "Node.js Version: $nodeVersion" -ForegroundColor Green
    } catch {
        Write-Host "Node.js: Not found" -ForegroundColor Red
    }
    
    # Check npm version
    try {
        $npmVersion = npm -v
        Write-Host "npm Version: $npmVersion" -ForegroundColor Green
    } catch {
        Write-Host "npm: Not found" -ForegroundColor Red
    }
    
    # Check package.json
    if (Test-Path "package.json") {
        try {
            $packageJson = Get-Content -Path "package.json" -Raw | ConvertFrom-Json
            Write-Host "Project Name: $($packageJson.name)" -ForegroundColor Green
            Write-Host "Version: $($packageJson.version)" -ForegroundColor Green
            
            # List key dependencies
            Write-Host "`nKey Dependencies:" -ForegroundColor Yellow
            Write-Host "  React: $($packageJson.dependencies.react)" -ForegroundColor Green
            Write-Host "  Express: $($packageJson.dependencies.express)" -ForegroundColor Green
            Write-Host "  Three.js: $($packageJson.dependencies.three)" -ForegroundColor Green
        } catch {
            Write-Host "Error reading package.json" -ForegroundColor Red
        }
    } else {
        Write-Host "package.json not found!" -ForegroundColor Red
    }
    
    # Check environment files
    Write-Host "`nEnvironment Files:" -ForegroundColor Yellow
    if (Test-Path ".env") {
        Write-Host "  .env: Found" -ForegroundColor Green
    } else {
        Write-Host "  .env: Not found (copy from .env.example)" -ForegroundColor Red
    }
    
    if (Test-Path ".env.example") {
        Write-Host "  .env.example: Found" -ForegroundColor Green
    } else {
        Write-Host "  .env.example: Not found" -ForegroundColor Red
    }
    
    # Check output directory
    try {
        $outputDir = $env:OUTPUT_DIR
        if (-not $outputDir) {
            $outputDir = "./Output"
        }
        
        if (Test-Path $outputDir) {
            Write-Host "`nOutput Directory: $outputDir (exists)" -ForegroundColor Green
        } else {
            Write-Host "`nOutput Directory: $outputDir (does not exist - will be created at runtime)" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "`nError checking output directory" -ForegroundColor Red
    }
    
    # Check CSV files
    $csvPath = "./public/typologiescsv/possible3ds"
    if (Test-Path $csvPath) {
        $csvFiles = Get-ChildItem -Path $csvPath -Filter "*.csv" | Measure-Object
        Write-Host "`nCSV Files: $($csvFiles.Count) files found in $csvPath" -ForegroundColor Green
    } else {
        Write-Host "`nCSV Files: Directory $csvPath not found" -ForegroundColor Yellow
        Write-Host "  Run 'copycsv' task to create and populate this directory" -ForegroundColor Yellow
    }
    
    Write-Host "`nFor deployment instructions, see:" -ForegroundColor Yellow
    Write-Host "  DEPLOYMENT_GUIDE.md" -ForegroundColor White
    
    Write-Host "`nFor project structure information, see:" -ForegroundColor Yellow
    Write-Host "  PROJECT_STRUCTURE.md" -ForegroundColor White
}

function FixCommonIssues {
    Write-Host "`nFixing common development issues..." -ForegroundColor Cyan
    
    # Fix web-vitals issue
    $reportWebVitalsPath = ".\src\reportWebVitals.ts"
    if (Test-Path $reportWebVitalsPath) {
        Write-Host "Fixing web-vitals compatibility in reportWebVitals.ts..." -ForegroundColor Yellow
        
        # Create the updated content
        $updatedContent = @"
import { onCLS, onFCP, onLCP, onTTFB, onINP } from 'web-vitals';

type ReportFn = (metric: any) => void;

const reportWebVitals = (onPerfEntry?: ReportFn) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    onCLS(onPerfEntry);
    onFCP(onPerfEntry);
    onLCP(onPerfEntry);
    onTTFB(onPerfEntry);
    onINP(onPerfEntry);
  }
};

export default reportWebVitals;
"@
        # Write the updated content to the file
        Set-Content -Path $reportWebVitalsPath -Value $updatedContent
        
        Write-Host "Fixed web-vitals compatibility issue in reportWebVitals.ts" -ForegroundColor Green
    }
    
    # Check for TypeScript errors
    Write-Host "Running TypeScript check..." -ForegroundColor Yellow
    npx tsc --noEmit
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "TypeScript check passed!" -ForegroundColor Green
    } else {
        Write-Host "TypeScript check found errors. Some issues may need manual fixing." -ForegroundColor Yellow
    }
    
    Write-Host "`nFixing complete. Try running the development environment again." -ForegroundColor Cyan
}

function CreateDeployment {
    Write-Host "`nCreating deployment package..." -ForegroundColor Cyan
    
    # First build the app
    BuildApp
    
    # Create a deployment directory
    $deployDir = "deployment-package"
    if (Test-Path $deployDir) {
        Remove-Item -Path $deployDir -Recurse -Force
    }
    New-Item -ItemType Directory -Path $deployDir | Out-Null
    
    # Copy necessary files
    Copy-Item -Path "build" -Destination "$deployDir/" -Recurse
    Copy-Item -Path "server.js" -Destination "$deployDir/"
    Copy-Item -Path "package.json" -Destination "$deployDir/"
    Copy-Item -Path "DEPLOYMENT_GUIDE.md" -Destination "$deployDir/"
    
    # Create output directory
    New-Item -ItemType Directory -Path "$deployDir/output" | Out-Null
    
    # Create a simplified package.json for deployment
    $packageJson = Get-Content -Path "package.json" -Raw | ConvertFrom-Json
    
    # Keep only production dependencies needed for the server
    $prodDependencies = @{}
    $prodDependencies['express'] = $packageJson.dependencies.express
    $prodDependencies['cors'] = $packageJson.dependencies.cors
    $prodDependencies['body-parser'] = "^1.20.2"  # Add body-parser if needed
    
    $deployPackage = @{
        name = $packageJson.name
        version = $packageJson.version
        private = $true
        dependencies = $prodDependencies
        scripts = @{
            start = "node server.js"
        }
    }
    
    $deployPackageJson = $deployPackage | ConvertTo-Json -Depth 10
    $deployPackageJson | Set-Content -Path "$deployDir/package.json"
    
    # Create a .env file for the deployment
    @"
# Production environment settings
PORT=3000
OUTPUT_DIR=./output
NODE_ENV=production
"@ | Set-Content -Path "$deployDir/.env"
    
    Write-Host "`nDeployment package created in ./$deployDir" -ForegroundColor Green
    Write-Host "To deploy, copy this directory to your server and run:" -ForegroundColor Yellow
    Write-Host "  npm install --production" -ForegroundColor White
    Write-Host "  node server.js" -ForegroundColor White
    Write-Host "`nSee DEPLOYMENT_GUIDE.md for detailed instructions." -ForegroundColor Yellow
}

# Execute the requested task
switch ($Task.ToLower()) {
    "dev" { RunDevEnvironment }
    "build" { BuildApp }
    "server" { RunServer }
    "client" { RunClient }
    "copycsv" { CopyCsvFiles }
    "prod" { RunProduction }
    "clean" { CleanDirectories }
    "deploy" { CreateDeployment }
    "info" { ShowProjectInfo }
    "fix" { FixCommonIssues }
    default { ShowHelp }
}
