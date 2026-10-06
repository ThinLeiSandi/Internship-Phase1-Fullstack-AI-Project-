# Week 4 - LangGraph RAG Workflow

This project converts the Week 3 RAG demo into a LangGraph workflow.

The workflow uses:

- Python
- LangGraph
- Gemini
- PostgreSQL
- pgvector

## Learning Objectives

This week covers:

- LangGraph state
- LangGraph nodes
- LangGraph edges
- Graph compilation and execution
- Retrieval and generation workflows
- Comparison between LangGraph and traditional LangChain
- Phase 1 review and consolidation

## Workflow

```text
User question
    ↓
LangGraph state
    ↓
Retrieval node
    ↓
Gemini embedding
    ↓
pgvector similarity search
    ↓
Generation node
    ↓
Gemini answer
    ↓
END
```

## Graph Structure

```text
START
  ↓
retrieval
  ↓
generation
  ↓
END
```

## LangGraph Concepts

### State

State is the shared data passed between nodes.

The workflow state contains:

```python
question
context
answer
```

### Node

A node is a Python function that performs one task.

This project has two nodes:

```text
retrieval node
generation node
```

The retrieval node searches PostgreSQL for relevant document chunks.

The generation node sends the question and retrieved context to Gemini.

### Edge

An edge defines the order in which nodes execute:

```text
START → retrieval → generation → END
```

### Compile

The graph must be compiled before it can be executed:

```python
graph = workflow.compile()
```

## Project Structure

```text
Week4/
├── .env
├── .gitignore
├── README.md
├── .venv/
└── src/
    └── langgraph_rag.py
```

## Environment Configuration

Create a `.env` file inside the Week4 directory:

```env
GEMINI_API_KEY=your_gemini_key_here
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/myapp
```

Never commit or share the API key.

## Installation

Create and activate the virtual environment:

```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
```

Install the dependencies:

```powershell
pip install -U langgraph google-genai python-dotenv "psycopg[binary]" pgvector
```

## Database Requirements

Week 4 reuses the PostgreSQL database from Week 1 and the `rag_documents` table created during Week 3.

Start PostgreSQL:

```powershell
cd "C:\Users\Admin\Documents\PHASE 1\Week1"

docker compose up -d

docker compose ps
```

PostgreSQL should show:

```text
Up (healthy)
```

The database must contain the pgvector extension and the `rag_documents` table.

## Run the Workflow

Return to the Week4 directory:

```powershell
cd "C:\Users\Admin\Documents\PHASE 1\Week4"
```

Run the LangGraph RAG demo:

```powershell
.\.venv\Scripts\python.exe src\langgraph_rag.py
```

Ask a question such as:

```text
What happens during employee onboarding?
```

Then test a question that is not included in the document:

```text
What is the company's vacation policy?
```

The application should respond that it does not know based on the provided document.

## LangGraph Output

The graph displays the following workflow:

```text
__start__ → retrieval → generation → __end__
```

This confirms that:

1. The graph compiled successfully.
2. The retrieval node runs first.
3. The generation node receives the retrieved context.
4. The graph finishes at the end node.

## LangGraph Compared with LangChain

LangChain provides tools and abstractions for building applications with language models.

LangGraph focuses on controlling the workflow using:

- Explicit state
- Nodes
- Edges
- Conditional routing
- Workflow execution

LangGraph is useful when an application has multiple steps or agentic behavior that must be controlled and inspected.

## Current Limitations

This is a basic RAG pipeline.

The following features are not included yet:

- Hybrid search
- Keyword search
- Reranking
- Conversation memory
- Streaming responses
- Advanced agent tools
- Production deployment

## Deliverable

The Week 4 deliverable is a basic RAG pipeline running on LangGraph.

The workflow contains:

```text
Retrieval node → Generation node
```

It retrieves relevant document chunks from PostgreSQL with pgvector and generates an answer using Gemini.

## Phase 1 Summary

During Phase 1, the project covered:

- Node.js backend development
- PostgreSQL and Prisma
- JWT authentication
- React frontend development
- API integration
- Frontend CRUD operations
- Static chat UI
- LLM concepts
- Prompt engineering
- Embeddings
- Vector databases
- Basic RAG
- LangGraph workflows