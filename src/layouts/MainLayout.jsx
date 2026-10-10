import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar.jsx';

export const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#0a0f1d] text-slate-100">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
      <footer className="border-t border-[#1f293d] bg-[#0d1322] py-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            <strong className="text-slate-300 font-mono">TITAN</strong> — Shared Internet Bandwidth Usage Manager &copy; 2026
          </p>
          <div className="flex items-center space-x-4 font-mono text-[11px]">
            <span>Team ID: <strong className="text-teal-400">CBC048</strong></span>
            <span>Problem: <strong className="text-teal-400">PS-32</strong></span>
            <span>Stack: <strong className="text-slate-300">MERN + Sockets</strong></span>
          </div>
        </div>
      </footer>
    </div>
  );
};
