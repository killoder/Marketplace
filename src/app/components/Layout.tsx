import React from 'react';
import { NavLink, Outlet } from 'react-router';

export function Layout() {
  return (
    <div className="min-h-screen bg-[#FDFCFB] text-slate-900 font-sans selection:bg-amber-200">
      <div className="max-w-2xl mx-auto px-6 py-12 md:py-20">
        <header className="flex flex-col sm:flex-row justify-between sm:items-end gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Inventory Notes</h1>
            <p className="text-slate-500 text-sm mt-1">Keep track of your gear. Keep it simple.</p>
          </div>
          <nav className="flex gap-6 text-sm font-medium text-slate-400">
            <NavLink 
              to="/" 
              className={({ isActive }) => isActive ? "text-slate-900 transition-colors border-b-2 border-slate-900 pb-1" : "hover:text-slate-600 transition-colors pb-1"}
            >
              Active
            </NavLink>
            <NavLink 
              to="/sold" 
              className={({ isActive }) => isActive ? "text-slate-900 transition-colors border-b-2 border-slate-900 pb-1" : "hover:text-slate-600 transition-colors pb-1"}
            >
              Sold History
            </NavLink>
          </nav>
        </header>
        
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
