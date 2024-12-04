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
