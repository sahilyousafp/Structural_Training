# Clean up Docker and Railway related files
Write-Host "Removing Docker and Railway files from project..." -ForegroundColor Cyan

# List of files and directories to remove
$filesToRemove = @(
    # Configuration files
    ".dockerignore",
    "docker-compose.yml",
    "Dockerfile",
    "Dockerfile.minimal",
    "railway.json",
    "Procfile",
    
    # Deployment scripts
    "deploy-railway.ps1",
    "deploy-direct.ps1",
    "deploy-clean.ps1",
    "deploy-final.ps1",
    "direct-deploy.ps1",
    "final-railway-deploy.ps1",
    "test-railway.ps1",
    "verify-railway.ps1",
    "restructure-for-github.ps1",
    
    # Documentation
    "RAILWAY.md",
    "RAILWAY_CHECKLIST.md", 
    "FIXING_RAILWAY_ERRORS.md",
    "SIMPLIFIED_RAILWAY.md",
    
    # Deployment directories
    "railway-deployment",
    "railway-final",
    "railway-simplified"
)

$removedCount = 0

# Remove files and directories
foreach ($file in $filesToRemove) {
    $path = Join-Path -Path (Get-Location) -ChildPath $file
    
    if (Test-Path -Path $path) {
        if (Test-Path -Path $path -PathType Container) {
            # Remove directory and its contents
            Remove-Item -Path $path -Recurse -Force
            Write-Host "Removed directory: $file" -ForegroundColor Green
        } else {
            # Remove file
            Remove-Item -Path $path -Force
            Write-Host "Removed file: $file" -ForegroundColor Green
        }
        
        $removedCount++
    }
}

# Remove any references to Railway or Docker in gitignore
$gitignorePath = ".gitignore"
if (Test-Path $gitignorePath) {
    $gitignoreContent = Get-Content $gitignorePath
    $newContent = $gitignoreContent | Where-Object {
        $_ -notmatch "docker|Docker|railway|Railway"
    }
    
    Set-Content -Path $gitignorePath -Value $newContent
    Write-Host "Updated .gitignore to remove Docker/Railway references" -ForegroundColor Green
}

Write-Host "`nCleanup complete! Removed $removedCount files/directories related to Docker and Railway." -ForegroundColor Cyan
Write-Host "The project is now configured for local development only." -ForegroundColor Green
