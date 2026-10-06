import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import type { User } from "../types";

export default function AdminPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadUsers() {
            try {
                const response = await api.get<User[]>("/users");
                setUsers(response.data);
            } catch {
                setError("Could not load users.");
            }
        }

        loadUsers();
    }, []);

    return (
        <main className="min-h-screen bg-slate-100 p-8">
            <div className="mx-auto max-w-4xl">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-slate-900">
                        User Management
                    </h1>

                    <Link
                        to="/dashboard"
                        className="rounded-md bg-slate-800 px-4 py-2 text-white"
                    >
                        Dashboard
                    </Link>
                </div>

                {error && (
                    <p className="mt-6 rounded-md bg-red-50 p-3 text-red-700">
                        {error}
                    </p>
                )}

                <div className="mt-8 overflow-x-auto rounded-md bg-white shadow">
                    <table className="w-full text-left">
                        <thead className="border-b border-slate-200">
                            <tr>
                                <th className="p-4">Name</th>
                                <th className="p-4">Email</th>
                                <th className="p-4">Role</th>
                            </tr>
                        </thead>

                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id} className="border-b border-slate-100">
                                    <td className="p-4">{user.name}</td>
                                    <td className="p-4">{user.email}</td>
                                    <td className="p-4">{user.role}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    );
}