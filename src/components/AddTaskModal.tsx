import React, { useState, useEffect } from "react";
import { Input, Button } from "src/components";
import type { TaskStatus, Task as TaskType } from "src/shared";
import useAppStore from "src/store/useAppStore";

type AddTaskModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AddTaskModal({ isOpen, onClose }: AddTaskModalProps) {
  const addTaskAction = useAppStore((s) => s.addTask);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [statusSel, setStatusSel] = useState<TaskStatus>('waiting');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setTitle('');
      setDescription('');
      setDate('');
      setTime('');
      setStatusSel('waiting');
    }
  }, [isOpen]);

  async function handleSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!title.trim()) return;

    const due = date ? (time ? `${date} ${time}` : date) : undefined;
    
    const newTask: Omit<TaskType, 'id'> = {
      title: title.trim(),
      description: description.trim(),
      due: due,
      status: statusSel,
    };

    await addTaskAction(newTask);
    onClose(); 
  }

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-40 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl p-6 rounded-lg shadow-xl"
        style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-text)' }}
        onClick={(e) => e.stopPropagation()} 
      >
        <h2 className="text-xl font-semibold mb-4">Agregar nueva tarea</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <div className="md:col-span-2">
            <Input 
              id="new-title" 
              label="Título" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="Nueva tarea" 
              required
            />
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium var(--color-text) mb-1">Estado</label>
            <select 
              id="status" 
              value={statusSel} 
              onChange={(e) => setStatusSel(e.target.value as TaskStatus)} 
              className="block w-full px-3 py-2 border rounded-md"
              style={{ backgroundColor: 'var(--color-background)', color: 'var(--color-text)', borderColor: 'var(--color-border)' }}
            >
              <option value="waiting">En espera</option>
              <option value="in-progress">En proceso</option>
              <option value="completed">Completado</option>
              <option value="abandoned">Abandonado</option>
            </select>
          </div>

          <div className="flex gap-2">
            <div className="w-1/2">
              <label htmlFor="date" className="block text-sm font-medium var(--color-text) mb-1">Fecha</label>
              <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div className="w-1/2">
              <label htmlFor="time" className="block text-sm font-medium var(--color-text) mb-1">Hora</label>
              <Input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
            </div>
          </div>

          <div className="md:col-span-2">
            <Input 
              id="desc" 
              label="Descripción (opcional)" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Detalles sobre la tarea..." 
            />
          </div>

          <div className="md:col-span-2 flex gap-2 justify-end mt-4">
            <Button 
              type="button" 
              variant="secondary" 
              onClick={onClose} 
              className="px-4 py-2"
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="px-4 py-2"
            >
              Guardar Tarea
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}