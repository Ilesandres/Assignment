import React from 'react';

type NavbarProps = {
  onToggleSidebar?: () => void;
};

export default function Navbar({ onToggleSidebar }: NavbarProps) {
  return (
    <header className="w-full bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile: toggle button */}
            <button
              onClick={onToggleSidebar}
              className="md:hidden p-2 rounded-md hover:bg-gray-100 focus:outline-none"
              aria-label="Toggle sidebar"
            >
              <svg className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div className="text-lg font-semibold text-gray-900">Task Manager</div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center text-sm text-gray-600">
              Bienvenido, Usuario
            </div>
            <div>
              <button className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 focus:outline-none">
                <span className="sr-only">Open user menu</span>
                <img
                  src="/favicon.ico"
                  alt="avatar"
                  className="h-8 w-8 rounded-full"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
