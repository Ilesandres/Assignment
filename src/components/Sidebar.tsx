import React from 'react';
import { useNavigate } from 'react-router-dom';

type SidebarProps = {
  isOpen?: boolean;
  onClose?: () => void;
};

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const navigate = useNavigate();

  const handleTasksClick = () => {
    navigate('/task');
    // Cerrar sidebar en móvil después de navegar
    if (onClose) {
      onClose();
    }
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-20 w-64 transform bg-white border-r border-gray-100 shadow-lg transition-transform duration-200 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:inset-auto`}
      aria-hidden={!isOpen}
    >
      <div className="h-full flex flex-col">
        <div className="px-4 py-4 flex items-center justify-between border-b border-gray-100">
          <div className="text-lg font-semibold">Menu</div>
          <button
            onClick={onClose}
            className="md:hidden p-1 rounded hover:bg-gray-100 focus:outline-none"
            aria-label="Close sidebar"
          >
            <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="p-4 flex-1 overflow-y-auto">
          <ul className="space-y-2">
            <li>
              <a href="#" className="block px-3 py-2 rounded-md hover:bg-gray-50">Inicio</a>
            </li>
            <li>
              <button 
                onClick={handleTasksClick}
                className="block w-full text-left px-3 py-2 rounded-md hover:bg-gray-50 cursor-pointer"
              >
                Tareas
              </button>
            </li>
            <li>
              <a href="#" className="block px-3 py-2 rounded-md hover:bg-gray-50">Proyectos</a>
            </li>
            <li>
              <a href="#" className="block px-3 py-2 rounded-md hover:bg-gray-50">Ajustes</a>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
}