import { useState, useEffect, useCallback } from 'react';
import { getAllTasks } from '../services';

/**
 * useTask  (hooks/useTask.js)
 *
 * Responsibility: fetching and caching the task list.
 *
 * Returns:
 *   tasks        Task[]   — the current list (empty while loading)
 *   loading      boolean  — true while the initial / refresh fetch is in-flight
 *   error        string|null
 *   refreshTasks () => void — manually re-fetch (used after mutations)
 *
 * Separation of concerns:
 *   This hook only knows about *reading* tasks.
 *   All mutation logic (create / update / delete / markAsDone) lives in
 *   useTaskManager so each hook stays small and focused.
 */
export const useTask = () => {
  const [tasks,   setTasks]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const refreshTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setTasks(await getAllTasks());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch on mount
  useEffect(() => {
    refreshTasks();
  }, [refreshTasks]);

  return { tasks, setTasks, loading, error, setError, refreshTasks };
};
