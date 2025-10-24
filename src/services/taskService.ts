import type { Task as TaskType, TaskStatus } from 'src/shared';
import { initialTasks } from 'src/shared/data';

const STORAGE_KEY = 'app_tasks_v1';

export function loadTasks(): TaskType[] {
  if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') {
    return initialTasks;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as TaskType[];
  } catch (err) {
  }

  return initialTasks;
}

export function saveTasks(tasks: TaskType[]) {
  if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') return;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (err) {
  }
}

export function addTask(tasks: TaskType[], task: TaskType): TaskType[] {
  return [task, ...tasks];
}

export function updateTaskStatus(tasks: TaskType[], id: string, status: TaskStatus): TaskType[] {
  return tasks.map((t) => (t.id === id ? { ...t, status } : t));
}

export function deleteTask(tasks: TaskType[], id: string): TaskType[] {
  return tasks.filter((t) => t.id !== id);
}

export function groupByStatus(tasks: TaskType[]): Record<TaskStatus, TaskType[]> {
  const grouped: Record<TaskStatus, TaskType[]> = {
    'waiting': [],
    'in-progress': [],
    'completed': [],
    'abandoned': [],
  };

  tasks.forEach((t) => grouped[t.status].push(t));
  return grouped;
}

export default {
  loadTasks,
  saveTasks,
  addTask,
  updateTaskStatus,
  deleteTask,
  groupByStatus,
};
