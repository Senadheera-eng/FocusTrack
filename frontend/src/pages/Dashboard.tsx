import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { format } from "date-fns";
import {
  PlusIcon,
  CheckIcon,
  TrashIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";

interface Task {
  id: string;
  title: string;
  description?: string;
  status: "todo" | "in_progress" | "done";
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

const Dashboard: React.FC = () => {
  const { state, logout } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get("http://localhost:4000/tasks");
        setTasks(res.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load tasks");
      } finally {
        setLoading(false);
      }
    };

    if (state.isAuthenticated) {
      fetchTasks();
    }
  }, [state.isAuthenticated]);

  const handleMarkComplete = async (id: string) => {
    try {
      await axios.patch(`http://localhost:4000/tasks/${id}`, {
        status: "done",
      });
      setTasks(
        tasks.map((t) =>
          t.id === id
            ? { ...t, status: "done", completedAt: new Date().toISOString() }
            : t,
        ),
      );
    } catch (err) {
      alert("Failed to update task");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this task?")) return;
    try {
      await axios.delete(`http://localhost:4000/tasks/${id}`);
      setTasks(tasks.filter((t) => t.id !== id));
    } catch (err) {
      alert("Failed to delete task");
    }
  };

  if (!state.isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Redirecting...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50/30">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-700">FocusTrack</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">
              {state.token ? "Logged in" : ""}
            </span>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header + Add button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Your Tasks</h2>
            <p className="text-gray-600 mt-1">
              Manage your work and track time
            </p>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg">
            <PlusIcon className="h-5 w-5" />
            Add New Task
          </button>
        </div>

        {/* Loading / Error / Tasks */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-xl text-red-700">
            {error}
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow border border-gray-100">
            <h3 className="text-xl font-medium text-gray-700 mb-3">
              No tasks yet
            </h3>
            <p className="text-gray-500">
              Create your first task to get started
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="bg-white rounded-2xl shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                      {task.title}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        task.status === "done"
                          ? "bg-green-100 text-green-800"
                          : task.status === "in_progress"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {task.status === "todo"
                        ? "To Do"
                        : task.status === "in_progress"
                          ? "In Progress"
                          : "Done"}
                    </span>
                  </div>

                  {task.description && (
                    <p className="text-gray-600 mb-6 line-clamp-3">
                      {task.description}
                    </p>
                  )}

                  <div className="text-sm text-gray-500 mb-4">
                    Created: {format(new Date(task.createdAt), "MMM d, yyyy")}
                    {task.completedAt && (
                      <span className="ml-4 text-green-600">
                        Completed:{" "}
                        {format(new Date(task.completedAt), "MMM d, yyyy")}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-3">
                    {task.status !== "done" && (
                      <button
                        onClick={() => handleMarkComplete(task.id)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <CheckIcon className="h-5 w-5" />
                        Complete
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(task.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      <TrashIcon className="h-5 w-5" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
