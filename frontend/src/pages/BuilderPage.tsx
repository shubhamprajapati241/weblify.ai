import React, { useEffect } from "react";
import Split from "react-split";
import axios from "axios";
import { BASE_URL } from "../config";
import { TaskList } from "../components/TaskList";
import { FileExplorer } from "../components/FileExplorer";
import { FilePreview } from "../components/FilePreview";
import { useInitializeProject } from "../hooks/useInitializeProject";
import { useLocation } from "react-router-dom";

export function BuilderPage() {
  useInitializeProject();

  const location = useLocation();
  const task = location.state as { task: string };

  async function init() {
    const response = await axios.post(`${BASE_URL}/api/template`, {
      prompt: task.task,
    });
    // const { promts, uiPrompts } = response.data;
    console.log(response.data);
  }

  useEffect(() => {
    init();
  });

  return (
    <div className="h-[calc(100vh-4rem)]">
      <Split
        sizes={[20, 30, 50]}
        minSize={[200, 200, 300]}
        gutterSize={4}
        className="flex h-full"
      >
        <TaskList />
        <FileExplorer />
        <FilePreview />
      </Split>
    </div>
  );
}
