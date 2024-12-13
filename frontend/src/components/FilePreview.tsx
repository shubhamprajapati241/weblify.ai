import { useEffect, useRef } from "react";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-css";
import "prismjs/components/prism-json";
import { FileItem } from "../types";

interface CodeEditorProps {
  selectedFile: FileItem | null;
}

export function FilePreview({ selectedFile }: CodeEditorProps) {
  const codeRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [selectedFile]);
  if (!selectedFile) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        Select a file to preview
      </div>
    );
  }
  const getLanguage = (type: string) => {
    switch (type) {
      case "javascript":
        return "javascript";
      case "typescript":
        return "typescript";
      case "css":
        return "css";
      case "json":
        return "json";
      default:
        return "javascript";
    }
  };
  return (
    <div className="h-full w-full">
      <div className="bg-gray-800 rounded-lg p-4 h-full overflow-auto">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-400">
            {selectedFile.path}
          </span>
          <span className="text-xs px-2 py-1 rounded bg-gray-700 text-gray-300">
            {selectedFile.type}
          </span>
        </div>
        <pre className="!bg-transparent !p-0">
          <code
            ref={codeRef}
            className={`language-${getLanguage(selectedFile.type)}`}
          >
            {selectedFile.content}
          </code>
        </pre>
      </div>
    </div>
  );
}
