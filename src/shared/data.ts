import type { Task } from './types';

export const initialTasks: Task[] = [
  { id: 't1', title: 'Aprobar nueva página para la compañía', description: 'Revisar contenido y aprobar diseño', due: 'Hoy, 18:00', status: 'waiting' },
  { id: 't2', title: 'Actualizar la página web', description: 'Subir nueva imagen hero y textos', due: '5 Mayo, 19:00', status: 'in-progress' },
  { id: 't3', title: 'Proyecto de la página', description: 'Planificar sprints y asignar tareas', due: '7 Mayo, 11:00', status: 'completed' },
  { id: 't4', title: 'Comprobar los datos de contacto', description: 'Verificar formulario y enlaces', due: '27 Mayo, 18:00', status: 'waiting' },
  { id: 't5', title: 'Recolección de datos para campaña', description: 'Preparar CSV y columnas', due: '31 Mayo, 18:00', status: 'abandoned' },
];
