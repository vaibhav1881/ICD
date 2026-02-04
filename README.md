# Idea Collision Generator

A personal knowledge-intelligence engine that tracks your reading, extracts concepts, and generates creative insights.

## Project Structure

- **backend/**: FastAPI application for NLP and data management.
- **frontend/**: Next.js dashboard for visualization.
- **extension/**: Chrome extension for capturing articles.
- **docker-compose.yml**: Infrastructure (Neo4j, PostgreSQL, Redis).

## Prerequisites

- Docker & Docker Compose
- Node.js 18+
- Python 3.11+
- Chrome Browser

## Getting Started

### 1. Start Infrastructure
Run the database services:
```bash
docker-compose up -d
```

### 2. Backend Setup
Navigate to the backend directory:
```bash
cd backend
python -m venv venv
# Windows
.\venv\Scripts\activate
# Linux/Mac
# source venv/bin/activate

pip install -r requirements.txt
python -m spacy download en_core_web_sm

# Run the server
uvicorn app.main:app --reload
```
The API will be available at `http://localhost:8000`.

### 3. Frontend Setup
Navigate to the frontend directory:
```bash
cd frontend
npm install
npm run dev
```
The dashboard will be available at `http://localhost:3000`.

### 4. Extension Setup
1. Open Chrome and go to `chrome://extensions/`.
2. Enable "Developer mode" (top right).
3. Click "Load unpacked".
4. Select the `extension` folder in this project.
5. Pin the extension to your toolbar.

## Usage

1. **Read**: Visit an article page.
2. **Capture**: Click the extension icon and "Capture This Page".
3. **Explore**: Go to the Dashboard to see extracted concepts and the knowledge graph.
