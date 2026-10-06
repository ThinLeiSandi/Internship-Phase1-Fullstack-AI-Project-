import os
from pgvector import Vector
import psycopg
from dotenv import load_dotenv
from google import genai
from google.genai import types
from pgvector.psycopg import register_vector


load_dotenv(override=True)

ai_client = genai.Client()


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


def search_similar_chunks(
    question_embedding: list[float],
    limit: int = 3,
) -> list[tuple[str, float]]:
    database_url = os.environ["DATABASE_URL"]
    question_vector = Vector(question_embedding)

    with psycopg.connect(database_url) as connection:
        register_vector(connection)

        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT
                    content,
                    1 - (embedding <=> %s) AS similarity
                FROM rag_documents
                ORDER BY embedding <=> %s
                LIMIT %s
                """,
                (question_vector, question_vector, limit),
            )

            return cursor.fetchall()
            
question = "What happens during employee onboarding?"
query_embedding = create_query_embedding(question)
results = search_similar_chunks(query_embedding)

print(f"Question: {question}")

for index, (content, similarity) in enumerate(results, start=1):
    print(f"\n--- Result {index} ---")
    print(f"Similarity: {similarity:.4f}")
    print(content)