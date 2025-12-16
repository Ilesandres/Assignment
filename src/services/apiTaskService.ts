// src/services/apiTaskService.ts

import { fetchWithAuth } from './authService';
import type { Task as TaskType, TaskStatus } from 'src/shared/types';

// Usamos la variable de entorno para la URL de FastAPI
const API_BASE = import.meta.env.VITE_URL_API || 'http://localhost:8000';


/**
 * [Checklist: utilizar endpoint para traer el tareas del usuario]
 * Llama a GET /tasks/ en FastAPI. El Backend usa el token para filtrar por 'owner'.
 */
export async function fetchTasksApi(statusFilter?: TaskStatus): Promise<TaskType[]> {
    const url = new URL(`${API_BASE}/tasks/`);
    if (statusFilter) {
        // Usa 'status_filter' que es el query param esperado por FastAPI
        url.searchParams.append('status_filter', statusFilter);
    }
    
    const res = await fetchWithAuth(url.toString());
    if (!res.ok) {
        throw new Error(`Error fetching tasks: ${res.status} - ${await res.text()}`);
    }
    return await res.json() as TaskType[];
}

/**
 * [Checklist: utilizar endpoint para crear tareas]
 * Llama a POST /tasks/ en FastAPI. El Backend asigna el 'owner' automáticamente.
 */
export async function createTaskApi(task: Omit<TaskType, 'id' | 'owner'>): Promise<TaskType> {
    const res = await fetchWithAuth(`${API_BASE}/tasks/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task), 
    });
    if (res.status === 403) throw new Error("No autorizado para crear tareas.");
    if (!res.ok) {
        throw new Error(`Error creating task: ${res.status} - ${await res.text()}`);
    }
    return await res.json() as TaskType;
}

/**
 * [Checklist: utilizar endpoint para actualizar informacion de tareas]
 * [Checklist: utilizar endpoint para aactualizar estado de tarea]
 * Llama a PUT /tasks/{taskId} en FastAPI.
 * El Backend verifica el dueño y actualiza la tarea con el cuerpo enviado.
 */
export async function updateTaskApi(updatedTask: TaskType): Promise<TaskType> {
    const { id, ...payload } = updatedTask;
    
    const res = await fetchWithAuth(`${API_BASE}/tasks/${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        // Enviamos el objeto completo (Task) que se usará para reemplazar el documento en Firestore
        body: JSON.stringify(payload), 
    });
    if (res.status === 403) throw new Error("No autorizado para actualizar esta tarea.");
    if (!res.ok) {
        throw new Error(`Error updating task: ${res.status} - ${await res.text()}`);
    }
    return await res.json() as TaskType;
}

/**
 * [Checklist: utilizar endpoint para eliminar las tareas]
 * Llama a DELETE /tasks/{taskId} en FastAPI.
 */
export async function deleteTaskApi(taskId: string): Promise<void> {
    const res = await fetchWithAuth(`${API_BASE}/tasks/${encodeURIComponent(taskId)}`, {
        method: 'DELETE',
    });
    if (res.status === 403) throw new Error("No autorizado para eliminar esta tarea.");
    // FastAPI devuelve 204 No Content en caso de éxito.
    if (!res.ok && res.status !== 204) { 
        throw new Error(`Error deleting task: ${res.status} - ${await res.text()}`);
    }
}