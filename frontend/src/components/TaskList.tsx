import React from "react";
import { CheckCircle2, Circle, Timer } from "lucide-react";
import { useProjectStore } from "../store/projectStore";
import { ProjectTask } from "../types";

export function TaskList() {
  const { currentProject, selectedTask, setSelectedTask } = useProjectStore();

  const getStatusIcon = (status: ProjectTask["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case "in-progress":
        return <Timer className="w-4 h-4 text-yellow-500" />;
      default:
        return <Circle className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="h-full bg-gray-900 border-r border-gray-800 p-4">
      <h2 className="text-lg font-semibold mb-4">Tasks</h2>
      <div className="space-y-2">
        {currentProject?.tasks.map((task) => (
          <button
            key={task.id}
            onClick={() => setSelectedTask(task)}
            className={`w-full text-left p-3 rounded-lg transition-colors ${
              selectedTask?.id === task.id
                ? "bg-indigo-500 text-white"
                : "hover:bg-gray-800"
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              {getStatusIcon(task.status)}
              <span className="font-medium">{task.title}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
