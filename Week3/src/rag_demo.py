import os
from pathlib import Path

import psycopg
from dotenv import load_dotenv
from google import genai
from google.genai import types
from pgvector.psycopg import register_vector


load_dotenv()

ai_client = genai.Client()


def load_document(file_path: str) -> str:
    return Path(file_path).read_text(encoding="utf-8")


def split_into_chunks(
    text: str,
    chunk_size: int = 50,
    overlap: int = 10,
) -> list[str]:
    words = text.split()
    chunks = []
    step = chunk_size - overlap

    for start in range(0, len(words), step):
        chunk_words = words[start : start + chunk_size]

        if not chunk_words:
            break

        chunks.append(" ".join(chunk_words))

    return chunks


def create_embeddings(chunks: list[str]) -> list[list[float]]:
    result = ai_client.models.embed_content(
        model="gemini-embedding-001",
        contents=chunks,
        config=types.EmbedContentConfig(
            task_type="RETRIEVAL_DOCUMENT",
            output_dimensionality=768,
        ),
    )

    return [embedding.values for embedding in result.embeddings]


def save_to_database(
    chunks: list[str],
    embeddings: list[list[float]],
) -> None:
    database_url = os.environ["DATABASE_URL"]

    with psycopg.connect(database_url) as connection:
        register_vector(connection)

        with connection.cursor() as cursor:
            cursor.execute("TRUNCATE TABLE rag_documents RESTART IDENTITY")

            cursor.executemany(
                """
                INSERT INTO rag_documents (content, embedding)
                VALUES (%s, %s)
                """,
                list(zip(chunks, embeddings)),
            )

        connection.commit()


document = load_document("data/source.txt")
chunks = split_into_chunks(document)
embeddings = create_embeddings(chunks)

save_to_database(chunks, embeddings)

print(f"Saved {len(chunks)} chunks to PostgreSQL.")