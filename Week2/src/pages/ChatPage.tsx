import { useState, type FormEvent } from "react";
import { Send } from "lucide-react";
import { Link } from "react-router-dom";
import { askQuestion } from "../services/api";

interface Message {
  id: number;
  text: string;
  sender: "user" | "assistant";
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! This is a chat interface connected to LangGraph RAG ",
      sender: "assistant",
    },
  ]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const question = input.trim();

    if (!question || isLoading) {
      return;
    }

    setMessages((currentMessages) => [
      ...currentMessages,
      {
        id: Date.now(),
        text: question,
        sender: "user",
      },
    ]);

    setInput("");
    setIsLoading(true);

    try {
      const answer = await askQuestion(question);

      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: Date.now() + 1,
          text: answer,
          sender: "assistant",
        },
      ]);
    } catch {
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: Date.now() + 1,
          text: "Unable to get a response from the AI service.",
          sender: "assistant",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8">
      <section className="mx-auto flex min-h-[80vh] w-full max-w-3xl flex-col rounded-lg bg-white shadow">
        <header className="border-b border-slate-200 p-5">
          <h1 className="text-2xl font-bold text-slate-900">
            Mini Chat
          </h1>

          <p className="mt-1 text-sm text-slate-600">
            Static message interface
          </p>

          <Link
            to="/dashboard"
            className="text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            Back to Dashboard
          </Link>
        </header>

        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === "user"
                  ? "justify-end"
                  : "justify-start"
                }`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-3 ${message.sender === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-900"
                  }`}
              >
                {message.text}
              </div>
            </div>
          ))}
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex gap-3 border-t border-slate-200 p-4"
        >
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Type a message..."
            className="min-w-0 flex-1 rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
          />

          <button
            type="submit"
            aria-label="Send message"
            title={isLoading ? "Waiting for response" : "Send message"}
            disabled={isLoading}
            className="rounded-md bg-blue-600 p-3 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? "..." : <Send size={18} />}
          </button>
        </form>
      </section>
    </main>
  );
}