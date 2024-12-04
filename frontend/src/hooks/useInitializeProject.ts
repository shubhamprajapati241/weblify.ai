import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useProjectStore } from '../store/projectStore';
import { sampleProject } from '../data/sampleProject';

export function useInitializeProject() {
  const location = useLocation();
  const { setCurrentProject } = useProjectStore();

  useEffect(() => {
    const task = location.state?.task;
    if (task) {
      // Initialize with sample project data
      setCurrentProject(sampleProject);
    }
  }, [location.state, setCurrentProject]);
}