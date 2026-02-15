import { useState, useCallback } from 'react';
import {
  createTask,
  updateTask,
  markTaskAsDone,
  deleteTask,
  downloadTaskFile
} from '../services';

/**
 * useTaskManager  (hooks/useTaskManager.js)
 *
 * Responsibility: all task mutations + the UI state for modals/dialogs.
 *
 * @param {{ setTasks: Function, setError: Function }} deps
 *   Injected from useTask so mutations can update the shared task list
 *   without a full re-fetch.
 *
 * Returns:
 *   ── Modal / dialog state ──────────────────────────────────────
 *   addOpen          boolean
 *   editState        { open: boolean, task: Task|null }
 *   delState         { open: boolean, task: Task|null }
 *   successMsg       string
 *
 *   ── Handlers ─────────────────────────────────────────────────
 *   openAdd          () => void
 *   closeAdd         () => void
 *   openEdit         (task) => void
 *   closeEdit        () => void
 *   openDelete       (task) => void
 *   closeDelete      () => void
 *
 *   handleCreate     (FormData) => Promise<{success, error?}>
 *   handleUpdate     (FormData) => Promise<{success, error?}>
 *   handleMarkAsDone (task)     => void
 *   handleConfirmDelete ()      => void
 *   handleDownload   (task)     => void
 */
export const useTaskManager = ({ setTasks, setError }) => {

  // ── Feedback ──────────────────────────────────────────────────────────
  const [successMsg, setSuccessMsg] = useState('');
  const showSuccess = useCallback((msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  }, []);

  // ── Modal / dialog open state ─────────────────────────────────────────
  const [addOpen,   setAddOpen]   = useState(false);
  const [editState, setEditState] = useState({ open: false, task: null });
  const [delState,  setDelState]  = useState({ open: false, task: null });

  // ── Modal open/close helpers ──────────────────────────────────────────
  const openAdd    = useCallback(() => setAddOpen(true),  []);
  const closeAdd   = useCallback(() => setAddOpen(false), []);

  const openEdit   = useCallback((task) => setEditState({ open: true, task }), []);
  const closeEdit  = useCallback(() => setEditState({ open: false, task: null }), []);

  const openDelete  = useCallback((task) => setDelState({ open: true, task }), []);
  const closeDelete = useCallback(() => setDelState({ open: false, task: null }), []);

  // ── Create ────────────────────────────────────────────────────────────
  /**
   * Called by TaskModal (add mode) with a FormData object.
   * Optimistically prepends the new task so the UI updates instantly.
   */
  const handleCreate = useCallback(async (formData) => {
    try {
      setError(null);
      const created = await createTask(formData);
      setTasks((prev) => [created, ...prev]);
      showSuccess('Task created successfully!');
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  }, [setTasks, setError, showSuccess]);

  // ── Update ────────────────────────────────────────────────────────────
  /**
   * Called by TaskModal (edit mode) with a FormData object.
   * Replaces the old task in-place by _id.
   */
  const handleUpdate = useCallback(async (formData) => {
    try {
      setError(null);
      const updated = await updateTask(editState.task._id, formData);
      setTasks((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
      showSuccess('Task updated successfully!');
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  }, [editState.task, setTasks, setError, showSuccess]);

  // ── Mark as Done ──────────────────────────────────────────────────────
  const handleMarkAsDone = useCallback(async (task) => {
    try {
      setError(null);
      const updated = await markTaskAsDone(task._id);
      setTasks((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
      showSuccess('Task marked as done!');
    } catch (err) {
      setError(err.message);
    }
  }, [setTasks, setError, showSuccess]);

  // ── Delete ────────────────────────────────────────────────────────────
  const handleConfirmDelete = useCallback(async () => {
    try {
      setError(null);
      await deleteTask(delState.task._id);
      setTasks((prev) => prev.filter((t) => t._id !== delState.task._id));
      showSuccess('Task deleted successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      closeDelete();
    }
  }, [delState.task, setTasks, setError, showSuccess, closeDelete]);

  // ── Download ──────────────────────────────────────────────────────────
  const handleDownload = useCallback((task) => {
    downloadTaskFile(task._id);
  }, []);

  return {
    // state
    addOpen, editState, delState, successMsg,
    // open/close
    openAdd, closeAdd,
    openEdit, closeEdit,
    openDelete, closeDelete,
    // handlers
    handleCreate, handleUpdate,
    handleMarkAsDone, handleConfirmDelete,
    handleDownload
  };
};
