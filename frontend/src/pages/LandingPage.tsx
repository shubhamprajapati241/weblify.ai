import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Rocket } from "lucide-react";

export function LandingPage() {
  const [task, setTask] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (task.trim()) {
      navigate("/builder", { state: { task } });
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <Rocket className="w-16 h-16 text-indigo-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4">
            Build Your Website with Weblify
          </h1>
          <p className="text-gray-400 text-lg">
            Describe your website and let us help you build it
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Describe your website (e.g., Create a modern portfolio website with a dark theme...)"
            className="w-full h-32 px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-gray-100 placeholder-gray-500"
          />
          <button
            type="submit"
            className="w-full py-3 px-6 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white font-semibold transition-colors"
          >
            Start Building
          </button>
        </form>
      </div>
    </div>
  );
}
