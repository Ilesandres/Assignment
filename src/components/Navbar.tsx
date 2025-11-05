import React, { useEffect, useRef, useState } from 'react';
import useAppStore from 'src/store/useAppStore';
import { useNavigate } from 'react-router-dom';

type NavbarProps = {
  onToggleSidebar?: () => void;
  onLogout?: () => void;
  showHomeButton?: boolean; 
};

export default function Navbar({ onToggleSidebar, onLogout, showHomeButton = false }: NavbarProps) { 
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const user = useAppStore((s) => s.user);
  const logoutStore = useAppStore((s) => s.logout);
  const navigate = useNavigate();

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) setOpen(false);
    }

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }

    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  function handleLogout() {
    setOpen(false);
    if (onLogout) onLogout();
    else logoutStore();
  }

  function handleNavigation(path: string) {
    setOpen(false);
    navigate(path);
  }

  return (
    <header
      className="w-full shadow-sm border-b"
      style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleSidebar}
              className="md:hidden p-2 rounded-md hover:bg-gray-100 focus:outline-none"
              aria-label="Toggle sidebar"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: 'var(--color-text)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {showHomeButton && ( 
              <button 
                onClick={() => navigate('/')}
                className="p-2 rounded-md hover:bg-gray-100 focus:outline-none" 
                style={{ color: 'var(--color-text)' }}
                aria-label="Ir a Inicio"
                title="Ir a Inicio"
              >
                <svg 
                  className="h-5 w-5" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor" 
                  strokeWidth={2}
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" 
                  />
                </svg>
              </button>
            )}

            <div
              className="text-lg font-semibold" 
              style={{ color: 'var(--color-text)' }}
            >
              Task Manager
            </div>
          </div>

          <div className="flex items-center gap-4 relative">
            <div className="hidden sm:flex items-center text-sm" style={{ color: 'var(--color-text)' }}>
              Bienvenido, {user?.name ?? 'Usuario'}
            </div>

            <div className="relative nav rounded-lg" ref={menuRef}>
              <button
                onClick={() => setOpen((s) => !s)}
                className="p-1 rounded-full focus:outline-none cursor-pointer"
                aria-haspopup="true"
                aria-expanded={open}
                aria-label="Open user menu"
                style={{ backgroundColor: 'var(--color-surface)' }}
              >
                <img src="/favicon.ico" alt="avatar" className="h-8 w-8 rounded-full" />
              </button>

              {open && (
                <div
                  className="absolute right-0 mt-2 w-44 rounded-md shadow-lg z-20"
                  style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
                  role="menu"
                >
                  <div className="py-1">
                    <button 
                      onClick={() => handleNavigation('/profile')} 
                      className="w-full text-left px-4 py-2 text-sm nav cursor-pointer hover:bg-gray-100 transition-colors" 
                      style={{ color: 'var(--color-text)' }} 
                      role="menuitem"
                    >
                      Perfil
                    </button>
                    <button 
                      onClick={() => handleNavigation('/dashboard')} 
                      className="w-full text-left px-4 py-2 text-sm nav cursor-pointer hover:bg-gray-100 transition-colors" 
                      style={{ color: 'var(--color-text)' }} 
                      role="menuitem"
                    >
                      Dashboard
                    </button>
                    <button 
                      onClick={handleLogout} 
                      className="w-full text-left px-4 py-2 text-sm nav cursor-pointer hover:bg-gray-100 transition-colors" 
                      style={{ color: 'var(--color-text)' }} 
                      role="menuitem"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}