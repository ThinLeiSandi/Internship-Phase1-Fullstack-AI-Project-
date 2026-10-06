import os
from typing_extensions import TypedDict

import psycopg
from dotenv import load_dotenv
from google import genai
from google.genai import types
from langgraph.graph import END, START, StateGraph
from pgvector import Vector
from pgvector.psycopg import register_vector


load_dotenv()

ai_client = genai.Client()

CHAT_MODEL = os.getenv("GEMINI_CHAT_MODEL", "gemini-3.6-flash")
EMBEDDING_MODEL = os.getenv(
    "GEMINI_EMBEDDING_MODEL",
    "gemini-embedding-001",
)
EMBEDDING_DIMENSIONS = int(os.getenv("EMBEDDING_DIMENSIONS", "768"))


class WorkflowState(TypedDict):
    question: str
    context: str
    answer: str


def create_query_embedding(question: str) -> list[float]:
    result = ai_client.models.embed_content(
        model=EMBEDDING_MODEL,
        contents=question,
        config=types.EmbedContentConfig(
            task_type="RETRIEVAL_QUERY",
            output_dimensionality=EMBEDDING_DIMENSIONS,
        ),
    )

    return result.embeddings[0].values


def retrieve_chunks(question: str) -> list[str]:
    question_embedding = create_query_embedding(question)
    question_vector = Vector(question_embedding)

    with psycopg.connect(os.environ["DATABASE_URL"]) as connection:
        register_vector(connection)

        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT content
                FROM rag_documents
                ORDER BY embedding <=> %s
                LIMIT 3
                """,
                (question_vector,),
            )

            rows = cursor.fetchall()

    return [row[0] for row in rows]


def retrieval_node(state: WorkflowState) -> dict:
    question = state["question"]

    print(f"Retrieval node received: {question}")

    chunks = retrieve_chunks(question)

    return {
        "context": "\n\n".join(chunks),
    }


def generation_node(state: WorkflowState) -> dict:
    context = state["context"]
    question = state["question"]

    prompt = f"""
Answer the user's question clearly.

Use the provided context when it is relevant.
If the context does not contain the answer, use your general knowledge.

If you use general knowledge, clearly say:
"This answer is not based on the provided document."

Do not invent company-specific facts.

Context:
{context}

Question:
{question}
"""

    response = ai_client.interactions.create(
        model=CHAT_MODEL,
        input=prompt,
    )

    return {
        "answer": response.output_text,
    }

workflow = StateGraph(WorkflowState)

workflow.add_node("retrieval", retrieval_node)
workflow.add_node("generation", generation_node)

workflow.add_edge(START, "retrieval")
workflow.add_edge("retrieval", "generation")
workflow.add_edge("generation", END)

graph = workflow.compile()

print("\nLangGraph workflow:")
print(graph.get_graph().draw_mermaid()) 

def run_workflow(question: str) -> dict:
    question = question.strip()

    if not question:
        raise ValueError("Question cannot be empty.")

    return graph.invoke({
        "question": question,
        "context": "",
        "answer": "",
    })


def ask_rag(question: str) -> str:
    result = run_workflow(question)
    return result["answer"]


if __name__ == "__main__":
    question = input("Ask a question about the document: ")

    result = run_workflow(question)

    print("\nRetrieved context:")
    print(result["context"])

    print("\nFinal answer:")
    print(result["answer"])