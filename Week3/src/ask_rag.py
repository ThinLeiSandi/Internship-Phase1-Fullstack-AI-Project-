import os

import psycopg
from dotenv import load_dotenv
from google import genai
from google.genai import types
from pgvector import Vector
from pgvector.psycopg import register_vector


load_dotenv(override=True)

ai_client = genai.Client()

# Use the exact model name that worked in basic_prompt.py.
GENERATION_MODEL = "gemini-3.6-flash"


def create_query_embedding(question: str) -> list[float]:
    result = ai_client.models.embed_content(
        model="gemini-embedding-001",
        contents=question,
        config=types.EmbedContentConfig(
            task_type="RETRIEVAL_QUERY",
            output_dimensionality=768,
        ),
    )

    return result.embeddings[0].values


def retrieve_chunks(
    question_embedding: list[float],
    limit: int = 3,
) -> list[str]:
    question_vector = Vector(question_embedding)
    database_url = os.environ["DATABASE_URL"]

    with psycopg.connect(database_url) as connection:
        register_vector(connection)

        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT content
                FROM rag_documents
                ORDER BY embedding <=> %s
                LIMIT %s
                """,
                (question_vector, limit),
            )

            rows = cursor.fetchall()

    return [row[0] for row in rows]


def generate_answer(question: str, context_chunks: list[str]) -> str:
    context = "\n\n".join(context_chunks)

    prompt = f"""
Answer the question using only the context below.

If the context does not contain the answer, say:
"I don't know based on the provided document."

Context:
{context}

Question:
{question}
"""

    response = ai_client.interactions.create(
        model=GENERATION_MODEL,
        input=prompt,
    )

    return response.output_text


question = input("Ask a question about the document: ").strip()

if not question:
    raise ValueError("Question cannot be empty.")


query_embedding = create_query_embedding(question)
context_chunks = retrieve_chunks(query_embedding)
answer = generate_answer(question, context_chunks)

print(f"Question: {question}")
print("\nRetrieved context:")
print("\n".join(context_chunks))
print("\nAnswer:")
print(answer)