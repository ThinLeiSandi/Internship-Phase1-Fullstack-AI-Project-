import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import type { Task } from "../types";
import api, {
    getBackendHealth,
    getRagHealth,
} from "../services/api";

export default function DashboardPage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    const [newTitle, setNewTitle] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [isCreating, setIsCreating] = useState(false);
    const [backendStatus, setBackendStatus] = useState("Checking...");
    const [ragStatus, setRagStatus] = useState("Checking...");
    const refreshHealth = async () => {
        try {
            const backend = await getBackendHealth();
            setBackendStatus(backend.status === "ok" ? "Online" : "Offline");
        } catch {
            setBackendStatus("Offline");
        }

        try {
            const rag = await getRagHealth();
            setRagStatus(rag.status === "ok" ? "Online" : "Offline");
        } catch {
            setRagStatus("Offline");
        }
    };

    useEffect(() => {
        refreshHealth();
    }, []);
    useEffect(() => {
        async function loadTasks() {
            try {
                const response = await api.get<Task[]>("/tasks");
                setTasks(response.data);
            } catch {
                setError("Could not load tasks.");
            } finally {
                setIsLoading(false);
            }
        }

        loadTasks();
    }, []);

    async function handleCreateTask(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        if (!newTitle.trim()) {
            return;
        }

        setIsCreating(true);
        setError("");

        try {
            const response = await api.post<Task>("/tasks", {
                title: newTitle,
                description: newDescription,
            });

            setTasks((currentTasks) => [...currentTasks, response.data]);
            setNewTitle("");
            setNewDescription("");
        } catch {
            setError("Could not create the task.");
        } finally {
            setIsCreating(false);
        }
    }

    async function handleToggleTask(task: Task) {
        try {
            const response = await api.put<Task>(`/tasks/${task.id}`, {
                title: task.title,
                description: task.description ?? "",
                completed: !task.completed,
            });

            setTasks((currentTasks) =>
                currentTasks.map((currentTask) =>
                    currentTask.id === task.id ? response.data : currentTask
                )
            );
        } catch {
            setError("Could not update the task.");
        }
    }

    async function handleDeleteTask(taskId: number) {
        const confirmed = window.confirm(
            "Are you sure you want to delete this task?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await api.delete(`/tasks/${taskId}`);

            setTasks((currentTasks) =>
                currentTasks.filter((task) => task.id !== taskId)
            );
        } catch {
            setError("Could not delete the task.");
        }
    }


    function handleLogout() {
        logout();
        navigate("/login");
    }

    return (
        <main className="min-h-screen bg-slate-100 p-8">
            <div className="mx-auto max-w-4xl">
                <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">
                            Dashboard
                        </h1>

                        <p className="mt-1 text-slate-600">
                            Welcome, {user?.name}.
                        </p>
                    </div>
                    <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                        {user?.role === "admin" && (
                            <Link
                                to="/admin"
                                className="w-full rounded-md bg-purple-600 px-3 py-2 text-center text-sm text-white hover:bg-purple-700 sm:w-auto"
                            >
                                Manage Users
                            </Link>
                        )}

                        <Link
                            to="/chat"
                            className="w-full rounded-md bg-blue-600 px-3 py-2 text-center text-sm text-white hover:bg-blue-700 sm:w-auto"
                        >
                            Open Chat
                        </Link>

                        <button
                            onClick={handleLogout}
                            className="w-full rounded-md bg-slate-800 px-3 py-2 text-center text-sm text-white hover:bg-slate-900 sm:w-auto"
                        >
                            Logout
                        </button>
                    </div>
                </header>

                <form
                    onSubmit={handleCreateTask}
                    className="mt-8 space-y-4 rounded-md bg-white p-6 shadow-sm"
                >
                    <h2 className="text-xl font-semibold text-slate-900">
                        Create a Task
                    </h2>

                    <input
                        type="text"
                        value={newTitle}
                        onChange={(event) => setNewTitle(event.target.value)}
                        placeholder="Task title"
                        required
                        className="w-full rounded-md border border-slate-300 px-3 py-2"
                    />

                    <textarea
                        value={newDescription}
                        onChange={(event) => setNewDescription(event.target.value)}
                        placeholder="Task description"
                        rows={3}
                        className="w-full rounded-md border border-slate-300 px-3 py-2"
                    />

                    <button
                        type="submit"
                        disabled={isCreating}
                        className="w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-60 sm:w-auto"
                    >
                        {isCreating ? "Creating..." : "Create Task"}
                    </button>
                </form>
                <section className="mt-8 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-lg bg-white p-5 shadow-sm">
                        <h2 className="text-lg font-semibold text-slate-900">
                            Node.js API
                        </h2>
                        <p className="mt-2 font-medium text-green-600">
                            {backendStatus}
                        </p>
                    </div>

                    <div className="rounded-lg bg-white p-5 shadow-sm">
                        <h2 className="text-lg font-semibold text-slate-900">
                            LangGraph RAG
                        </h2>
                        <p className="mt-2 font-medium text-green-600">
                            {ragStatus}
                        </p>
                    </div>
                </section>
                <div className="flex justify-center">
                    <button
                        type="button"
                        onClick={refreshHealth}
                        className="mt-6 w-full max-w-md rounded-md bg-slate-800 px-4 py-3 font-medium text-white hover:bg-slate-700"
                    >
                        Refresh Status
                    </button>
                </div>
                <section className="mt-8">
                    <h2 className="text-xl font-semibold text-slate-900">
                        My Tasks
                    </h2>

                    {isLoading && (
                        <p className="mt-4 text-slate-600">Loading tasks...</p>
                    )}

                    {error && (
                        <p className="mt-4 rounded-md bg-red-50 p-3 text-red-700">
                            {error}
                        </p>
                    )}

                    {!isLoading && !error && tasks.length === 0 && (
                        <p className="mt-4 text-slate-600">
                            You do not have any tasks yet.
                        </p>
                    )}

                    <div className="mt-4 space-y-3">
                        {tasks.map((task) => (
                            <div
                                key={task.id}
                                className="rounded-md bg-white p-4 shadow-sm"
                            >
                                <h3 className="font-semibold text-slate-900">
                                    {task.title}
                                </h3>

                                {task.description && (
                                    <p className="mt-1 text-slate-600">
                                        {task.description}
                                    </p>
                                )}

                                <p className="mt-2 text-sm text-slate-500">
                                    Status: {task.completed ? "Completed" : "Pending"}
                                </p>

                                <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:justify-center">
                                    <button
                                        onClick={() => handleToggleTask(task)}
                                        className="w-full rounded-md bg-green-600 px-3 py-2 text-sm text-white hover:bg-green-700 sm:w-auto"
                                    >
                                        {task.completed ? "Mark as Pending" : "Mark as Complete"}
                                    </button>

                                    <button
                                        onClick={() => handleDeleteTask(task.id)}
                                        className="w-full rounded-md bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-700 sm:w-auto"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
}