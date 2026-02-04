# 🚀 Idea Collision Generator - Startup Guide

## Prerequisites Check
- ✅ Docker Desktop installed and running
- ✅ PostgreSQL installed locally (postgres/postgres)
- ✅ Database `idea_collision` created in pgAdmin
- ✅ Node.js and npm installed
- ✅ Python installed

---

## Step 1: Start Docker Services (Neo4j + Redis)

**Open Terminal 1 (PowerShell)**

```bash
# Navigate to project root
cd d:/VJTI/VJTI/FYP

# Start Docker containers
docker-compose up -d

# Verify containers are running
docker ps
```

**Expected Output:**
```
CONTAINER ID   IMAGE              STATUS
xxxxx          neo4j:5.16.0       Up
xxxxx          redis:7.2-alpine   Up
```

**Access Neo4j Browser (Optional):**
- Open: http://localhost:7474
- Login: neo4j / password

---

## Step 2: Start Backend (FastAPI)

**Open Terminal 2 (PowerShell) - Keep this running**

```bash
# Navigate to backend
cd d:/VJTI/VJTI/FYP/backend

# Activate virtual environment
.\venv\Scripts\activate

# Start FastAPI server
uvicorn app.main:app --reload
```

**Expected Output:**
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete.
```

**Verify Backend:**
- API Docs: http://localhost:8000/docs
- Health Check: http://localhost:8000/health (should return `{"status":"healthy"}`)

---

## Step 3: Start Frontend (Next.js)

**Open Terminal 3 (PowerShell) - Keep this running**

```bash
# Navigate to frontend
cd d:/VJTI/VJTI/FYP/frontend

# Install dependencies (first time only)
npm install

# Start development server
npm run dev
```

**Expected Output:**
```
▲ Next.js 16.0.3
- Local:        http://localhost:3000
✓ Ready in 2.5s
```

**Access Dashboard:**
- Open: http://localhost:3000

---

## Step 4: Load Browser Extension

**In Google Chrome:**

1. Open Chrome and go to: `chrome://extensions/`
2. Enable **"Developer mode"** (toggle in top-right corner)
3. Click **"Load unpacked"**
4. Navigate to: `d:/VJTI/VJTI/FYP/extension`
5. Click **"Select Folder"**
6. Pin the extension to your toolbar (puzzle icon → pin)

---

## 🎯 Quick Test - End-to-End

### Test 1: Check Dashboard
1. Open http://localhost:3000
2. You should see:
   - 3 stat cards (Concepts, Collisions, Connections)
   - 3D Knowledge Graph
   - Recent Articles section

### Test 2: Capture an Article
1. Visit any article/blog page (e.g., Wikipedia, Medium)
2. Click the extension icon
3. Click **"Capture This Page"**
4. Should see success message

### Test 3: Verify Article Saved
1. Go to: http://localhost:8000/articles
2. Should see your captured article in JSON format

### Test 4: Generate a Collision
1. Go to: http://localhost:3000/collisions
2. Click **"Generate New"** button
3. A new collision card should appear

---

## 🛑 Stopping the Project

### Stop Frontend & Backend
- Press `Ctrl + C` in each terminal

### Stop Docker Containers
```bash
cd d:/VJTI/VJTI/FYP
docker-compose down
```

### Stop PostgreSQL
- PostgreSQL runs as Windows service (keeps running)
- To stop: Open Services → PostgreSQL → Stop

---

## 🔧 Troubleshooting

### Backend won't start
```bash
# Check if port 8000 is in use
netstat -ano | findstr :8000

# Kill process if needed
taskkill /PID <PID> /F
```

### Frontend won't start
```bash
# Check if port 3000 is in use
netstat -ano | findstr :3000

# Kill process if needed
taskkill /PID <PID> /F
```

### Docker containers not starting
```bash
# Check Docker Desktop is running
docker --version

# Restart Docker Desktop
# Right-click Docker icon → Restart
```

### Database connection errors
```bash
# Test all connections
cd d:/VJTI/VJTI/FYP/backend
.\venv\Scripts\activate
python test_all_connections.py
```

---

## 📊 Service Overview

| Service | URL | Status Check |
|---------|-----|--------------|
| **Backend API** | http://localhost:8000 | http://localhost:8000/health |
| **API Docs** | http://localhost:8000/docs | Interactive Swagger UI |
| **Frontend** | http://localhost:3000 | Dashboard should load |
| **Neo4j Browser** | http://localhost:7474 | Login: neo4j/password |
| **PostgreSQL** | localhost:5432 | Use pgAdmin |

---

## 🎉 You're All Set!

Your Idea Collision Generator is now running with:
- ✅ Backend API (FastAPI)
- ✅ Frontend Dashboard (Next.js)
- ✅ Graph Database (Neo4j)
- ✅ Relational Database (PostgreSQL)
- ✅ Cache/Queue (Redis)
- ✅ Browser Extension (Chrome)

**Happy collision generating!** 🚀
