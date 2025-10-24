import type { ButtonVariant, TaskStatus } from "./types";

export const btnVariants: Record<ButtonVariant, string> = {
  primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
  secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-300",
};

export const statusColumnBg: Record<TaskStatus, string> = {
  'waiting': 'bg-yellow-200',
  'in-progress': 'bg-teal-200',
  'completed': 'bg-blue-200',
  'abandoned': 'bg-red-200',
};

export const statusPillClass: Record<TaskStatus, string> = {
  'waiting': 'bg-yellow-500 text-yellow-800',
  'in-progress': 'bg-teal-500 text-teal-800',
  'completed': 'bg-blue-500 text-blue-800',
  'abandoned': 'bg-red-500 text-red-800',
};
