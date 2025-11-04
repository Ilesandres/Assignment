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
    if (onClose) {
      onClose();
    }
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    if (onClose) {
        onClose();
    }
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-20 w-64 transform shadow-lg transition-transform duration-200 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:inset-auto`}
      aria-hidden={!isOpen}
      style={{ backgroundColor: 'var(--color-surface)', borderRight: '1px solid var(--color-border)', color: 'var(--color-text)' }}
    >
      <div className="h-full flex flex-col">
        <div className="px-4 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--color-border)' }}>
          <div className="text-lg font-semibold" style={{ color: 'var(--color-text)' }}>Menu</div>
          <button
            onClick={onClose}
            className="md:hidden p-1 rounded focus:outline-none"
            aria-label="Close sidebar"
            style={{ color: 'var(--color-text)' }}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: 'var(--color-text)' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="p-4 flex-1 overflow-y-auto">
          <ul className="space-y-2">
            <li>
              <button 
                onClick={() => handleNavigation('/')}
                className="nav block w-full text-left px-3 py-2 rounded-md transition-colors" 
                style={{ color: 'var(--color-text)' }}
              >
                Inicio
              </button>
            </li>
            <li>
              <button 
                onClick={() => handleNavigation('/dashboard')}
                className="nav block w-full text-left px-3 py-2 rounded-md transition-colors" 
                style={{ color: 'var(--color-text)' }}
              >
                Dashboard
              </button>
            </li>
            <li>
              <button 
                onClick={handleTasksClick}
                className="nav block w-full text-left px-3 py-2 rounded-md transition-colors cursor-pointer"
                style={{ color: 'var(--color-text)' }}
              >
                Tareas
              </button>
            </li>
            <li>
              <button onClick={() => handleNavigation('/projects')} className="nav block w-full text-left px-3 py-2 rounded-md transition-colors" style={{ color: 'var(--color-text)' }}>Proyectos</button>
            </li>
            <li>
              <button onClick={() => handleNavigation('/settings')} className="nav block w-full text-left px-3 py-2 rounded-md transition-colors" style={{ color: 'var(--color-text)' }}>Ajustes</button>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
}