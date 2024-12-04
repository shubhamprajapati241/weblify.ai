import React from "react";
import { FolderOpen, File } from "lucide-react";
import { useProjectStore } from "../store/projectStore";
import { ProjectFile } from "../types";

export function FileExplorer() {
  const { currentProject, selectedFile, setSelectedFile } = useProjectStore();

  const handleFileClick = (file: ProjectFile) => {
    setSelectedFile(file);
  };

  const getFileIcon = (type: ProjectFile["type"]) => {
    return <File className="w-4 h-4 mr-2" />;
  };

  return (
    <div className="h-full bg-gray-900 border-x border-gray-800 p-4">
      <div className="flex items-center mb-4">
        <FolderOpen className="w-5 h-5 text-indigo-500 mr-2" />
        <h2 className="text-lg font-semibold">FileExplorer</h2>
      </div>
      <div className="space-y-2">
        {currentProject?.files.map((file) => (
          <button
            key={file.id}
            onClick={() => handleFileClick(file)}
            className={`w-full flex items-center p-2 rounded-lg transition-colors ${
              selectedFile?.id === file.id
                ? "bg-indigo-500 text-white"
                : "hover:bg-gray-800"
            }`}
          >
            {getFileIcon(file.type)}
            <span className="text-sm">{file.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
