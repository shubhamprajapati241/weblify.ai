import { create } from 'zustand';
import { Project, ProjectFile, ProjectTask } from '../types';

interface ProjectState {
  currentProject: Project | null;
  setCurrentProject: (project: Project) => void;
  selectedFile: ProjectFile | null;
  setSelectedFile: (file: ProjectFile | null) => void;
  selectedTask: ProjectTask | null;
  setSelectedTask: (task: ProjectTask | null) => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  currentProject: null,
  setCurrentProject: (project) => set({ currentProject: project }),
  selectedFile: null,
  setSelectedFile: (file) => set({ selectedFile: file }),
  selectedTask: null,
  setSelectedTask: (task) => set({ selectedTask: task }),
}));