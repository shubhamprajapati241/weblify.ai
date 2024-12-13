export interface Project {
  id: string;
  name: string;
  description: string;
  files: ProjectFile[];
  tasks: ProjectTask[];
}

export interface ProjectFile {
  id: string;
  name: string;
  path: string;
  content: string;
  type: "html" | "css" | "javascript" | "typescript" | "json" | "other";
}

export interface ProjectTask {
  id: string;
  title: string;
  status: "pending" | "in-progress" | "completed";
}

export enum StepType {
  CreateFile,
  CreateFolder,
  EditFile,
  DeleteFile,
  RunScript,
}

export interface Step {
  id: number;
  title: string;
  description: string;
  type: StepType;
  status: "pending" | "in-progress" | "completed";
  code?: string;
  path?: string;
}

export interface Project {
  prompt: string;
  steps: Step[];
}

export interface FileItem {
  name: string;
  type: "file" | "folder";
  children?: FileItem[];
  content?: string;
  path: string;
}

export interface FileViewerProps {
  file: FileItem | null;
  onClose: () => void;
}
