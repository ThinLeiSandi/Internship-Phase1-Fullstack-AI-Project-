```markdown
# Phase 1 Internship Project

This project is a connected full-stack application developed during Phase 1 of the internship program.

The project combines:

- Node.js and TypeScript backend development
- PostgreSQL database
- Prisma ORM
- JWT authentication and role-based access
- Docker and Docker Compose
- React and TypeScript frontend
- TailwindCSS responsive design
- LangGraph RAG workflow
- Gemini API integration
- pgvector semantic search

The project was developed continuously across four weeks. Each week extends the work completed in the previous week.

---

## Project Goals

The main goal of this project is to build a full-stack task management application with an AI-powered chat feature.

The application allows users to:

- Register and log in
- Authenticate using JWT
- View their dashboard
- Create tasks
- Update task status
- Delete tasks
- Access pages based on their role
- Check backend and AI service status
- Ask questions through an AI chat interface
- Retrieve answers from a knowledge document using RAG
- Ask general questions using Gemini when the document does not contain the answer

---

## Project Structure

```text
PHASE 1/
|
|-- Week1/
|   |-- prisma/
|   |-- src/
|   |-- Dockerfile
|   |-- docker-compose.yml
|   |-- package.json
|   |-- .env
|   `-- README.md
|
|-- Week2/
|   |-- src/
|   |   |-- components/
|   |   |-- context/
|   |   |-- lib/
|   |   |-- pages/
|   |   |-- services/
|   |   |-- types/
|   |   |-- App.tsx
|   |   |-- App.css
|   |   |-- index.css
|   |   `-- main.tsx
|   |-- package.json
|   `-- README.md
|
|-- Week3/
|   |-- data/
|   |   `-- source.txt
|   |-- src/
|   |   |-- basic_prompt.py
|   |   |-- rag_demo.py
|   |   |-- search_rag.py
|   |   `-- ask_rag.py
|   |-- .env
|   |-- .venv/
|   `-- README.md
|
|-- Week4/
|   |-- src/
|   |   |-- langgraph_rag.py
|   |   `-- api.py
|   |-- .env
|   |-- .venv/
|   `-- README.md
|
|-- start_phase1.ps1
`-- README.md
```

---

# Week 1: Backend Foundations

Week 1 introduced backend development using Node.js, TypeScript, Express, PostgreSQL, Prisma, Docker, and JWT authentication.

The backend provides the foundation for the entire Phase 1 project.

## Week 1 Technologies

- Node.js
- TypeScript
- Express.js
- PostgreSQL
- Prisma ORM
- Docker
- Docker Compose
- JWT authentication
- bcrypt password hashing
- CORS
- Validation and error handling
- Logging

## Week 1 Features

The backend supports:

- User registration
- User login
- JWT token generation
- Protected routes
- Role-based access
- Task creation
- Task listing
- Task updating
- Task deletion
- PostgreSQL persistence
- Prisma database access
- Dockerized development environment

## Week 1 API Endpoints

### Authentication

```text
POST /auth/register
POST /auth/login
```

### Tasks

```text
GET    /tasks
POST   /tasks
PATCH  /tasks/:id
DELETE /tasks/:id
```

### Health Check

```text
GET /health
```

The health endpoint returns:

```json
{
  "status": "ok"
}
```

## Week 1 Docker Services

The backend uses Docker Compose with two services:

```text
postgres-db
api
```

The PostgreSQL service uses the pgvector image:

```text
pgvector/pgvector:pg16
```

The API runs on:

```text
http://localhost:3000
```

PostgreSQL runs on:

```text
localhost:5432
```

## Starting Week 1

```powershell
cd "C:\Users\Admin\Documents\PHASE 1\Week1"
docker compose up -d --build
```

Check the containers:

```powershell
docker compose ps
```

View API logs:

```powershell
docker compose logs api --tail 50
```

Stop the services:

```powershell
docker compose down
```

---

# Week 2: Frontend Foundations and Full-Stack Integration

Week 2 introduced frontend development using React, TypeScript, React Router, Axios, TailwindCSS, and Context API.

The React frontend connects to the Node.js backend created during Week 1.

## Week 2 Technologies

- React
- TypeScript
- Vite
- React Router
- Axios
- TailwindCSS
- Context API
- Lucide React icons

## Week 2 Features

The frontend supports:

- Login page
- User registration
- Protected routes
- Dashboard page
- Task list
- Create task form
- Update task status
- Delete task
- Logout
- Role-based admin page
- Static chat interface
- Responsive mobile layout
- Backend API integration
- Service health monitoring

## Frontend Pages

```text
/login
/dashboard
/chat
/admin
```

The dashboard is available at:

```text
http://localhost:5173/dashboard
```

The login page is available at:

```text
http://localhost:5173/login
```

## Frontend Authentication

The frontend stores the JWT token in local storage.

Axios automatically adds the token to protected API requests:

```text
Authorization: Bearer <token>
```

The authentication context manages:

- Current user
- Login
- Logout
- Token persistence
- Authentication state

## Starting Week 2

```powershell
cd "C:\Users\Admin\Documents\PHASE 1\Week2"
npm install
npm run dev
```

The frontend runs on:

```text
http://localhost:5173
```

Build the frontend:

```powershell
npm run build
```

---

# Week 3: AI Foundations and Basic RAG

Week 3 introduced large language models, prompt engineering, embeddings, vector databases, retrieval, and generation.

The project uses Gemini for text generation and embeddings.

## Week 3 Technologies

- Python
- Gemini API
- Google GenAI SDK
- PostgreSQL
- pgvector
- Psycopg
- Python virtual environment
- python-dotenv

## What Is RAG?

RAG means Retrieval-Augmented Generation.

The RAG workflow combines document search with AI generation.

The process is:

1. Read a text document.
2. Split the document into smaller chunks.
3. Convert each chunk into an embedding.
4. Store the chunks and embeddings in PostgreSQL.
5. Convert a user question into an embedding.
6. Search for similar chunks using pgvector.
7. Send the retrieved context to Gemini.
8. Generate an answer using the retrieved information.

## Week 3 RAG Workflow

```text
source.txt
    |
    v
Text chunks
    |
    v
Gemini embeddings
    |
    v
PostgreSQL with pgvector
    |
    v
Similarity search
    |
    v
Relevant context
    |
    v
Gemini answer
```

## Week 3 Database Table

The RAG documents are stored in the PostgreSQL table:

```text
rag_documents
```

The table contains:

```text
id
content
embedding
created_at
```

The embedding column uses:

```text
vector(768)
```

## Week 3 Environment Variables

Create a `.env` file inside the Week3 folder:

```env
GEMINI_API_KEY=your_gemini_api_key
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/myapp
```

Never commit `.env` files or API keys to Git.

## Week 3 Python Setup

```powershell
cd "C:\Users\Admin\Documents\PHASE 1\Week3"

python -m venv .venv
.\.venv\Scripts\Activate.ps1

pip install python-dotenv
pip install google-genai
pip install "psycopg[binary]"
pip install pgvector
```

## Week 3 Scripts

### Basic Prompt

```powershell
python src\basic_prompt.py
```

### Store Document Embeddings

```powershell
python src\rag_demo.py
```

### Search Similar Chunks

```powershell
python src\search_rag.py
```

### Ask a RAG Question

```powershell
python src\ask_rag.py
```

---

# Week 4: LangGraph and Agentic Workflow

Week 4 extended the Week 3 RAG implementation using LangGraph.

LangGraph organizes the RAG process into explicit nodes, edges, and shared state.

## Week 4 Technologies

- Python
- LangGraph
- FastAPI
- Gemini API
- PostgreSQL
- pgvector
- Psycopg
- Uvicorn
- Pydantic

## LangGraph Concepts

### State

State stores information shared between workflow nodes.

The workflow state contains:

```text
question
context
answer
```

### Node

A node is a function that performs one part of the workflow.

This project contains:

```text
retrieval
generation
```

### Edge

An edge defines the order in which nodes execute.

The workflow uses:

```text
START -> retrieval -> generation -> END
```

### Compile

The graph must be compiled before it can be executed.

## LangGraph Workflow

```text
START
  |
  v
Retrieval Node
  |
  v
Generation Node
  |
  v
END
```

The retrieval node:

- Receives the user question
- Creates a query embedding
- Searches pgvector
- Returns relevant document chunks

The generation node:

- Receives the question and context
- Sends them to Gemini
- Generates the final response

## Week 4 Environment Variables

Create a `.env` file inside the Week4 folder:

```env
GEMINI_API_KEY=your_gemini_api_key
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/myapp

GEMINI_CHAT_MODEL=gemini-3.6-flash
GEMINI_EMBEDDING_MODEL=gemini-embedding-001
EMBEDDING_DIMENSIONS=768
```

The chat model and embedding model are configurable through environment variables.

## Week 4 Configuration

The application reads the models from `.env`:

```text
GEMINI_CHAT_MODEL
GEMINI_EMBEDDING_MODEL
EMBEDDING_DIMENSIONS
```

The embedding dimension must match the PostgreSQL column:

```text
vector(768)
```

Changing the embedding dimension requires recreating the stored embeddings and updating the database column.

## Week 4 Python Setup

```powershell
cd "C:\Users\Admin\Documents\PHASE 1\Week4"

python -m venv .venv
.\.venv\Scripts\Activate.ps1

pip install langgraph
pip install fastapi
pip install uvicorn
pip install python-dotenv
pip install google-genai
pip install "psycopg[binary]"
pip install pgvector
pip install typing-extensions
```

## Run the LangGraph Demo

```powershell
cd "C:\Users\Admin\Documents\PHASE 1\Week4"

.\.venv\Scripts\python.exe src\langgraph_rag.py
```

The workflow prints a Mermaid diagram:

```text
START -> retrieval -> generation -> END
```

## Run the FastAPI Service

```powershell
cd "C:\Users\Admin\Documents\PHASE 1\Week4"

.\.venv\Scripts\python.exe -m uvicorn src.api:app --reload --port 8000
```

The FastAPI service runs on:

```text
http://127.0.0.1:8000
```

FastAPI documentation is available at:

```text
http://127.0.0.1:8000/docs
```

FastAPI health check:

```text
http://127.0.0.1:8000/health
```

The health endpoint returns:

```json
{
  "status": "ok"
}
```

## FastAPI Endpoint

```text
POST /ask
```

Example request:

```json
{
  "question": "What happens during employee onboarding?"
}
```

Example response:

```json
{
  "question": "What happens during employee onboarding?",
  "answer": "Generated answer from the retrieved context."
}
```

---

# AI Chat Integration

The React chat interface connects to the backend through the following flow:

```text
React Chat UI
    |
    v
Node.js POST /chat
    |
    v
FastAPI POST /ask
    |
    v
LangGraph workflow
    |
    v
pgvector retrieval
    |
    v
Gemini generation
    |
    v
Response returned to React
```

The Node.js backend acts as the bridge between the React frontend and the Python LangGraph service.

## Node.js Chat Endpoint

```text
POST /chat
```

Example request:

```json
{
  "question": "What happens during employee onboarding?"
}
```

Example response:

```json
{
  "answer": "Generated answer from the LangGraph RAG workflow."
}
```

## Testing the Node Chat Endpoint

```powershell
$body = @{
  question = "What happens during employee onboarding?"
} | ConvertTo-Json

Invoke-RestMethod `
  -Uri "http://localhost:3000/chat" `
  -Method Post `
  -ContentType "application/json" `
  -Body $body
```

## Testing the React Chat

Open:

```text
http://localhost:5173/chat
```

Ask a document-related question:

```text
What happens during employee onboarding?
```

Ask a general question:

```text
What is Python?
```

The application can use the retrieved document context when relevant and Gemini general knowledge when the question is outside the document.

The application should avoid inventing company-specific facts that are not included in the document.

---

# Dashboard Service Monitoring

The React dashboard includes service status cards for:

```text
Node.js API
LangGraph RAG
```

The Node.js health endpoint is:

```text
http://localhost:3000/health
```

The LangGraph health endpoint is:

```text
http://127.0.0.1:8000/health
```

The dashboard displays:

```text
Online
Offline
Checking...
```

The `Refresh Status` button checks both services again.

## Dashboard URL

```text
http://localhost:5173/dashboard
```

---

# Starting the Complete Project

The project can be started manually with separate terminals.

## Terminal 1: Start Week1

```powershell
cd "C:\Users\Admin\Documents\PHASE 1\Week1"
docker compose up -d --build
```

## Terminal 2: Start Week4

```powershell
cd "C:\Users\Admin\Documents\PHASE 1\Week4"

.\.venv\Scripts\python.exe -m uvicorn src.api:app --reload --port 8000
```

## Terminal 3: Start Week2

```powershell
cd "C:\Users\Admin\Documents\PHASE 1\Week2"
npm run dev
```

Then open:

```text
http://localhost:5173/dashboard
```

---

# One-Click Project Launcher

The project includes:

```text
start_phase1.ps1
```

This script starts:

- Docker Compose
- Node.js API
- FastAPI LangGraph service
- React frontend
- The dashboard browser page

Run the launcher from PowerShell:

```powershell
cd "C:\Users\Admin\Documents\PHASE 1"

Set-ExecutionPolicy -Scope Process Bypass

.\start_phase1.ps1
```

The launcher opens the dashboard automatically:

```text
http://localhost:5173/dashboard
```

Docker Desktop must be running before starting the launcher.

A Windows desktop shortcut can also be created with this target:

```text
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "C:\Users\Admin\Documents\PHASE 1\start_phase1.ps1"
```

---

# Testing Checklist

## Backend Testing

- Register a new user
- Log in with valid credentials
- Confirm a JWT token is returned
- Access protected endpoints with the token
- Create a task
- List tasks
- Update a task
- Delete a task
- Test invalid input
- Test unauthorized requests
- Check the Node health endpoint

## Frontend Testing

- Open the login page
- Log in successfully
- Open the dashboard
- View tasks
- Create a new task
- Mark a task as complete
- Delete a task
- Log out
- Confirm protected routes redirect to login
- Test the admin route
- Test the responsive layout
- Open the chat page
- Send multiple questions
- Check loading state
- Check error state

## RAG Testing

- Confirm source text exists
- Generate document embeddings
- Store embeddings in PostgreSQL
- Search for similar chunks
- Ask a known document question
- Ask an unrelated question
- Confirm the workflow graph
- Confirm FastAPI health status
- Confirm Node-to-Python communication
- Confirm React-to-Node communication

## Production Build Testing

```powershell
cd "C:\Users\Admin\Documents\PHASE 1\Week2"
npm run build
```

The build should complete without TypeScript or Vite errors.

---

# Example Demo Questions

Use the following questions during a project demonstration.

## Document-Based Question

```text
What happens during employee onboarding?
```

This should use the document context retrieved from PostgreSQL.

## General Question

```text
What is Python?
```

This can be answered using Gemini general knowledge when it is not covered by the document.

## Missing Company Information

```text
What is the company's vacation policy?
```

The system should not invent a company policy if it is not included in the available document.

---

# Database and pgvector

The project uses the same PostgreSQL database across the connected weeks.

Database connection:

```text
postgresql://postgres:postgres@localhost:5432/myapp
```

PostgreSQL runs in Docker.

The vector extension can be enabled with:

```powershell
docker compose exec postgres-db psql -U postgres -d myapp -c "CREATE EXTENSION IF NOT EXISTS vector;"
```

The RAG table is:

```text
rag_documents
```

To inspect stored documents:

```powershell
docker compose exec postgres-db psql -U postgres -d myapp -c "SELECT id, LEFT(content, 80) AS content_preview, vector_dims(embedding) AS dimensions FROM rag_documents;"
```

The expected vector dimension is:

```text
768
```

The database volume is managed by Docker Compose:

```text
postgres_data
```

Do not remove the database volume unless you intentionally want to delete the project data.

---

# Security Notes

- Do not commit `.env` files.
- Do not share Gemini API keys.
- Do not place Gemini API keys in the React frontend.
- Keep Gemini calls inside the Python backend.
- Use JWT authentication for protected routes.
- Use role-based access for admin routes.
- Validate all user input.
- Do not expose arbitrary shell command execution through a browser dashboard.
- Do not use `prisma db push --accept-data-loss` without checking the database first.
- Keep secrets in environment variables.

---

# Important Troubleshooting

## FastAPI Cannot Be Reached

Start FastAPI:

```powershell
cd "C:\Users\Admin\Documents\PHASE 1\Week4"

.\.venv\Scripts\python.exe -m uvicorn src.api:app --reload --port 8000
```

Test:

```powershell
Invoke-RestMethod "http://127.0.0.1:8000/health"
```

## Node API Cannot Be Reached

Check Docker:

```powershell
cd "C:\Users\Admin\Documents\PHASE 1\Week1"
docker compose ps
```

Check logs:

```powershell
docker compose logs api --tail 100
```

## Prisma Tries to Delete `rag_documents`

Do not use:

```powershell
prisma db push --accept-data-loss
```

The RAG table contains vector data created during Week 3.

The Week1 Docker startup command should not automatically run:

```text
npx prisma db push
```

The API container should start the compiled server directly:

```dockerfile
CMD ["node", "dist/server.js"]
```

## React Chat Shows an AI Error

Check these services:

```text
React:   http://localhost:5173
Node:    http://localhost:3000
FastAPI: http://127.0.0.1:8000
```

Check the browser Network tab and confirm:

```text
POST http://localhost:3000/chat
```

Check Node logs:

```powershell
docker compose logs -f api
```

Check FastAPI logs in the terminal where Uvicorn is running.

## Gemini Model Error

Check the `.env` values:

```env
GEMINI_CHAT_MODEL=gemini-3.6-flash
GEMINI_EMBEDDING_MODEL=gemini-embedding-001
```

Make sure the code uses variables without quotation marks:

```python
model=CHAT_MODEL
```

and:

```python
model=EMBEDDING_MODEL
```

Do not write:

```python
model="CHAT_MODEL"
```

or:

```python
model="EMBEDDING_MODEL"
```

---

# Phase 1 Deliverables

## Week 1 Deliverable

A Dockerized Node.js and TypeScript CRUD API with:

- PostgreSQL
- Prisma ORM
- Authentication
- JWT
- Role-based access
- Validation
- Error handling
- Logging
- Docker Compose

## Week 2 Deliverable

A React frontend with:

- Login
- Dashboard
- Task list
- CRUD actions
- Protected routes
- Role-based routes
- Static chat interface
- Responsive design
- Backend integration

## Week 3 Deliverable

A Python RAG pipeline with:

- Text file reading
- Text chunking
- Gemini embeddings
- PostgreSQL storage
- pgvector similarity search
- Gemini answer generation

## Week 4 Deliverable

A LangGraph RAG workflow with:

- Shared workflow state
- Retrieval node
- Generation node
- LangGraph edges
- FastAPI endpoint
- React chat integration
- Service health monitoring
- Connected full-stack application

---

# Final Architecture

```text
                 +----------------------+
                 |   React Frontend    |
                 |   Vite + TypeScript  |
                 +----------+-----------+
                            |
                            | HTTP
                            v
                 +----------------------+
                 |   Node.js Backend   |
                 | Express + JWT       |
                 +----------+-----------+
                            |
                            | HTTP
                            v
                 +----------------------+
                 |   Python FastAPI    |
                 |   LangGraph RAG     |
                 +----------+-----------+
                            |
                +-----------+-----------+
                |                       |
                v                       v
      +------------------+    +------------------+
      | PostgreSQL       |    | Gemini API       |
      | pgvector         |    | Chat + Embedding |
      +------------------+    +------------------+
```

---

# Phase 1 Summary

Phase 1 started with backend foundations and continued into frontend development, AI integration, vector search, and LangGraph workflows.

Week 1 created the backend foundation.

Week 2 connected a React frontend to the backend.

Week 3 introduced Gemini, embeddings, pgvector, and basic RAG.

Week 4 organized the RAG workflow using LangGraph and exposed it through FastAPI.

The final project is a connected full-stack application where a user can log in, manage tasks, monitor service health, and communicate with an AI-powered RAG system through the React chat interface.
```