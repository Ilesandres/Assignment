import type { Task as TaskType, TaskStatus } from 'src/shared';
// Se han eliminado las importaciones relacionadas con Firebase Client SDK (db, collection, query, etc.)
// y las funciones CRUD (fetchUserTasks, addTask, updateTaskStatus, deleteTask) 
// para asegurar que la gestión de tareas se realice exclusivamente
// a través del Backend de FastAPI (implementado en apiTaskService.ts).


/**
 * Agrupa las tareas por su estado (Status) para la visualización en el tablero Kanban.
 */
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
  groupByStatus,
};