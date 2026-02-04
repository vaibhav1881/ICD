# Idea Collision Generator - Run Script

Write-Host "Starting Idea Collision Generator..." -ForegroundColor Cyan

# 1. Start Infrastructure (Docker)
Write-Host "Step 1: Starting Infrastructure (Docker)..." -ForegroundColor Yellow
docker-compose up -d
if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to start Docker containers. Make sure Docker Desktop is running."
    exit 1
}
Write-Host "Infrastructure running." -ForegroundColor Green

# 2. Start Backend
Write-Host "Step 2: Starting Backend..." -ForegroundColor Yellow
Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "cd backend; if (!(Test-Path venv)) { python -m venv venv }; .\venv\Scripts\activate; pip install -r requirements.txt; python -m spacy download en_core_web_sm; uvicorn app.main:app --reload"
Write-Host "Backend starting in new window..." -ForegroundColor Green

# 3. Start Frontend
Write-Host "Step 3: Starting Frontend..." -ForegroundColor Yellow
Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "cd frontend; npm install; npm run dev"
Write-Host "Frontend starting in new window..." -ForegroundColor Green

Write-Host "All services started!" -ForegroundColor Cyan
Write-Host "Backend: http://localhost:8000"
Write-Host "Frontend: http://localhost:3000"
Write-Host "To use the extension, load the 'extension' folder in Chrome via chrome://extensions/"
