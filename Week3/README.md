# Week 3 - Basic RAG Demo

This project demonstrates a simple Retrieval-Augmented Generation (RAG) pipeline using Python, Gemini, PostgreSQL and pgvector.

## What the project does

1. Reads a text document.
2. Splits the document into chunks.
3. Creates embeddings for each chunk.
4. Stores the chunks and embeddings in PostgreSQL.
5. Searches for relevant chunks using pgvector.
6. Sends the retrieved context to Gemini.
7. Generates an answer to the user's question.

## RAG Workflow

```text
source.txt
    ↓
Read document
    ↓
Split into chunks
    ↓
Create embeddings
    ↓
Store chunks and vectors in PostgreSQL
    ↓
Retrieve similar chunks with pgvector
    ↓
Generate an answer with Gemini
```

## Project structure

```text
Week3/
├── .env
├── .gitignore
├── README.md
├── data/
│   └── source.txt
├── src/
│   ├── basic_prompt.py
│   ├── rag_demo.py
│   ├── search_rag.py
│   └── ask_rag.py
└── .venv/

## Requirements

- Python 3
- Docker Desktop
- Week 1 PostgreSQL container
- Gemini API key
- PostgreSQL with pgvector enabled

## Setup

Create and activate the virtual environment:

```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
```

Install the dependencies:

```powershell
pip install python-dotenv google-genai "psycopg[binary]" pgvector
```

Create a `.env` file:

```env
GEMINI_API_KEY=your_gemini_key_here
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/myapp
```

Never commit the `.env` file or share the API key.

## Start PostgreSQL

Week 3 uses the PostgreSQL database created in Week 1.

```powershell
cd "C:\Users\Admin\Documents\PHASE 1\Week1"

docker compose up -d

docker compose ps
```

PostgreSQL should show:

```text
Up (healthy)
```

Enable pgvector:

```powershell
docker compose exec postgres-db psql -U postgres -d myapp -c "CREATE EXTENSION IF NOT EXISTS vector;"
```

Create the RAG table:

```powershell
docker compose exec postgres-db psql -U postgres -d myapp -c "CREATE TABLE IF NOT EXISTS rag_documents (id BIGSERIAL PRIMARY KEY, content TEXT NOT NULL, embedding vector(768) NOT NULL, created_at TIMESTAMPTZ DEFAULT NOW());"
```

## Run the Demo

Return to Week 3:

```powershell
cd "C:\Users\Admin\Documents\PHASE 1\Week3"
```

Test a basic Gemini prompt:

```powershell
.\.venv\Scripts\python.exe src\basic_prompt.py
```

Read the document, create embeddings, and save them:

```powershell
.\.venv\Scripts\python.exe src\rag_demo.py
```

Search for similar document chunks:

```powershell
.\.venv\Scripts\python.exe src\search_rag.py
```

Run the complete interactive RAG demo:

```powershell
.\.venv\Scripts\python.exe src\ask_rag.py
```

Example questions:

```text
What happens during employee onboarding?
Who helps new employees understand their responsibilities?
How are employee progress reviews handled?
```

## Database Verification

Check the stored chunks and vector dimensions:

```powershell
cd "C:\Users\Admin\Documents\PHASE 1\Week1"

docker compose exec postgres-db psql -U postgres -d myapp -c "SELECT id, LEFT(content, 60) AS preview, vector_dims(embedding) AS dimensions FROM rag_documents;"
```

Each embedding should have:

```text
768 dimensions
```

## Important Notes

- The Gemini API key is loaded from `.env`.
- The API key must not be hard-coded in Python files.
- The database URL uses `localhost:5432` because the Python scripts run on the host computer.
- The Week 1 database contains the existing users and tasks.
- Do not run `docker compose down -v` unless you intentionally want to delete the database volume.
- Running `rag_demo.py` again refreshes the RAG document table.
- The source document is stored in `data/source.txt`.

## Deliverable

The Week 3 deliverable is an interactive Python RAG demo that:

- Reads a text file
- Splits the text into chunks
- Creates embeddings
- Stores vectors in PostgreSQL
- Searches for relevant chunks using pgvector
- Sends retrieved context to Gemini
- Generates an answer to a user question