# 🧠 Idea Collision Generator (ICD)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.10+](https://img.shields.io/badge/python-3.10+-blue.svg)](https://www.python.org/downloads/)
[![Next.js](https://img.shields.io/badge/Next.js-16.0-black)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109-009688.svg)](https://fastapi.tiangolo.com/)

An AI-powered research assistant that discovers unexpected connections between concepts from your reading materials. Capture articles, build a knowledge graph, and generate creative "idea collisions" using GPT-4 or intelligent mock generation.

![Dashboard Preview](https://via.placeholder.com/800x400?text=ICD+Dashboard)

## 🎯 What It Does

The Idea Collision Generator helps researchers, students, and creative professionals:

1. **📚 Capture** web articles via browser extension
2. **🔍 Extract** key concepts using advanced NLP (spaCy)
3. **🕸️ Build** a knowledge graph showing concept relationships (Neo4j)
4. **✨ Generate** AI-powered "idea collisions" - creative connections between unrelated concepts
5. **📊 Visualize** your knowledge network in interactive 3D

### Example Collision

**Concepts**: "Neural Networks" + "Mycelial Networks" (fungal growth)

**Insight**: Both systems optimize for efficient resource distribution through probabilistic pathways and self-organizing structures.

**Application**: Design quantum algorithms inspired by fungal growth patterns for distributed computing networks that adapt and self-prune like biological systems.

**Domain**: Technology × Biology

---

## 🏗️ Architecture

```
┌─────────────────┐
│ Browser         │ ← Capture articles
│ Extension       │
└────────┬────────┘
         │ HTTP POST
         ↓
┌─────────────────────────────────────────────────────┐
│              FastAPI Backend (Python)                │
│  • NLP Extraction (spaCy)                           │
│  • LLM Service (OpenAI GPT-4 / Mock)                │
│  • Graph Service (Neo4j)                            │
└─────────────────────────────────────────────────────┘
         │                    │
         ↓                    ↓
┌─────────────────┐  ┌─────────────────┐
│  PostgreSQL     │  │    Neo4j        │
│  (Articles,     │  │  (Knowledge     │
│   Collisions)   │  │   Graph)        │
└─────────────────┘  └─────────────────┘
         ↑
         │ HTTP GET
         │
┌─────────────────────────────────────────────────────┐
│         Next.js Frontend (React/TypeScript)          │
│  • Dashboard • Library • Collisions • 3D Graph      │
└─────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites

- **Docker Desktop** (for PostgreSQL, Neo4j, Redis)
- **Python 3.10+**
- **Node.js 18+**
- **Git**

### 1. Clone the Repository

```bash
git clone https://github.com/vaibhav1881/ICD.git
cd ICD
```

### 2. Set Up Environment Variables

```bash
# Copy the example file
cp .env.example backend/.env

# Edit backend/.env and add your credentials
# Required: DATABASE_URL, NEO4J_URI, NEO4J_USER, NEO4J_PASSWORD
# Optional: OPENAI_API_KEY (system works with mock data if not provided)
```

### 3. Start Infrastructure (Docker)

```bash
docker-compose up -d
```

This starts:
- PostgreSQL (port 5432)
- Neo4j (ports 7474, 7687)
- Redis (port 6379)

### 4. Set Up Backend

```bash
# Create virtual environment
python -m venv venv

# Activate (Windows)
.\venv\Scripts\activate
# Activate (Mac/Linux)
source venv/bin/activate

# Install dependencies
pip install -r backend/requirements.txt

# Download spaCy model
python -m spacy download en_core_web_sm

# Start backend server
uvicorn backend.app.main:app --reload --host 0.0.0.0 --port 8000
```

### 5. Set Up Frontend

```bash
cd frontend
npm install
npm run dev
```

### 6. Load Browser Extension

1. Open Chrome/Edge and go to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `extension/` folder

---

## 📖 Usage

### Capture Articles

1. Browse to any article (e.g., Wikipedia, Medium, research papers)
2. Click the ICD extension icon
3. Article is captured and concepts are extracted automatically

### View Knowledge Graph

- Visit http://localhost:3000/graph
- Interactive 3D visualization
- Pan, zoom, rotate to explore connections

### Generate Collisions

1. Go to http://localhost:3000/collisions
2. Click "Generate New"
3. Review AI-generated insights and applications

### Manage Your Library

- http://localhost:3000/library
- Search, filter, and delete articles
- View all captured content

---

## 🛠️ Technology Stack

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - PostgreSQL ORM
- **spaCy** - Advanced NLP for concept extraction
- **Neo4j Python Driver** - Graph database client
- **OpenAI API** - GPT-4-Turbo for collision generation
- **python-dotenv** - Environment management

### Frontend
- **Next.js 16** - React framework with SSR
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first styling
- **Three.js** - 3D graph visualization
- **Axios** - HTTP client

### Databases
- **PostgreSQL 16** - Relational data (articles, collisions)
- **Neo4j 5.16** - Graph database (concepts, relationships)
- **Redis 7.2** - Caching layer

### Infrastructure
- **Docker Compose** - Container orchestration
- **Uvicorn** - ASGI server

---

## 📁 Project Structure

```
ICD/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI routes
│   │   ├── models.py            # SQLAlchemy models
│   │   ├── schemas.py           # Pydantic schemas
│   │   ├── database.py          # DB connection
│   │   └── services/
│   │       ├── nlp.py           # Concept extraction
│   │       ├── llm.py           # Collision generation
│   │       └── graph.py         # Neo4j operations
│   ├── requirements.txt
│   └── .env                     # Environment variables (not in repo)
├── frontend/
│   ├── app/
│   │   ├── page.tsx             # Dashboard
│   │   ├── library/page.tsx     # Article library
│   │   ├── collisions/page.tsx  # Collisions view
│   │   ├── graph/page.tsx       # 3D graph
│   │   └── settings/page.tsx    # Settings
│   ├── components/
│   │   ├── CollisionCard.tsx
│   │   ├── ConceptGraph.tsx     # Three.js visualization
│   │   └── RecentArticles.tsx
│   └── lib/
│       └── api.ts               # API client
├── extension/
│   ├── manifest.json            # Extension config
│   ├── background.js            # Service worker
│   ├── content.js               # Content script
│   └── popup.html               # Extension UI
├── docker-compose.yml           # Infrastructure setup
├── .gitignore
├── .env.example
└── README.md
```

---

## 🔧 Configuration

### Environment Variables

Create `backend/.env` with:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/idea_collision

# Neo4j
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=password

# Redis
REDIS_URL=redis://localhost:6379

# OpenAI (Optional)
OPENAI_API_KEY=sk-...
```

### OpenAI Integration

- **With API Key**: Uses GPT-4-Turbo for high-quality collisions
- **Without API Key**: Falls back to intelligent mock generator
- **Hybrid**: Uses OpenAI when available, falls back on errors

---

## 🧪 Testing

### Backend Health Check

```bash
curl http://localhost:8000/health
# Expected: {"status":"healthy"}
```

### API Documentation

Visit http://localhost:8000/docs for interactive Swagger UI

### Test NLP Extraction

```python
from backend.app.services import nlp

text = "Artificial intelligence and machine learning are transforming healthcare."
concepts = nlp.extract_concepts(text)
print(concepts["concepts"])
# Expected: ['Artificial Intelligence', 'Machine Learning', 'Healthcare']
```

---

## 📊 Features

### ✅ Implemented

- [x] Browser extension for article capture
- [x] Advanced NLP concept extraction (entities, noun phrases, keywords)
- [x] Knowledge graph storage and visualization
- [x] AI-powered collision generation (OpenAI + mock fallback)
- [x] 3D interactive graph (Three.js)
- [x] Article management (search, filter, delete)
- [x] Collision management (generate, view, delete)
- [x] Dark mode UI with glassmorphism
- [x] Responsive design (desktop + mobile)
- [x] Docker-based infrastructure

### 🚧 Roadmap

- [ ] User authentication (JWT)
- [ ] Multi-user support
- [ ] Collision favorites/bookmarks
- [ ] Export collisions (PDF, PNG)
- [ ] Advanced search and filtering
- [ ] Bulk operations
- [ ] Undo/redo functionality
- [ ] Collision history and versioning
- [ ] Collaborative features
- [ ] API rate limiting
- [ ] Automated testing (pytest, Cypress)
- [ ] CI/CD pipeline
- [ ] Production deployment guide

---

## 🐛 Troubleshooting

### Neo4j Connection Issues

```bash
# Check if Neo4j is running
docker ps | grep neo4j

# Restart Neo4j
docker-compose restart neo4j

# View logs
docker logs fyp-neo4j-1
```

### Frontend Not Loading

```bash
# Clear Next.js cache
cd frontend
rm -rf .next
npm run dev
```

### Backend Import Errors

```bash
# Reinstall dependencies
pip install -r backend/requirements.txt

# Download spaCy model
python -m spacy download en_core_web_sm
```

---

## 📝 Documentation

- [Startup Guide](STARTUP_GUIDE.md)
- [Extension Setup](EXTENSION_GUIDE.md)
- [Improvements Summary](IMPROVEMENTS_SUMMARY.md)
- [API Documentation](http://localhost:8000/docs)

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors

- **Vaibhav** - *Initial work* - [vaibhav1881](https://github.com/vaibhav1881)

---

## 🙏 Acknowledgments

- spaCy for NLP capabilities
- OpenAI for GPT-4 API
- Neo4j for graph database
- Next.js and FastAPI communities
- All contributors and testers

---

## 📞 Support

For issues and questions:
- Open an [Issue](https://github.com/vaibhav1881/ICD/issues)
- Check [Documentation](STARTUP_GUIDE.md)
- Review [Troubleshooting](#-troubleshooting)

---

**Built with ❤️ for researchers, students, and creative thinkers**
