import { Outlet } from "react-router-dom";
import { Code2, Download } from "lucide-react";
import JSZip from "jszip";
import { FileItem } from "../types";

interface LayoutPrompts {
  files: FileItem[];
}

export function Layout({ files }: LayoutPrompts) {
  const addFilesToZip = (zip: JSZip, files: FileItem[], parentPath = "") => {
    files.forEach((file) => {
      const fullPath = parentPath ? `${parentPath}/${file.name}` : file.name;
      if (file.type === "file" && file.content) {
        // add file content to zip
        zip.file(fullPath, file.content);
      } else if (file.type === "folder" && file.children) {
        // If folder, recursively add its children
        addFilesToZip(zip, file.children, fullPath);
      }
    });
  };

  const handleDownloadZip = () => {
    if (files.length == 0) return;
    const zip = new JSZip();
    // add all files (and folder) from the files states to zip
    addFilesToZip(zip, files);
    // generate the zip file and trigger download
    zip.generateAsync({ type: "blob" }).then((content) => {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(content);
      link.download = "files.zip";
      link.click();
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <nav className="border-b border-gray-800 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Code2 className="w-8 h-8 text-indigo-500" />
              <span className="ml-2 text-xl font-bold">Weblify</span>
            </div>
            <div
              className="flex items-center gap-1 px-4 py-2 rounded-md bg-indigo-500 hover:bg-indigo-600"
              onClick={handleDownloadZip}
            >
              <Download className="w-4 h-4" />
              Download
            </div>
          </div>
        </div>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
