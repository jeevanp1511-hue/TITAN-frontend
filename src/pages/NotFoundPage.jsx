import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button.jsx';
import { Home, AlertCircle } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-black text-white">404 — Page Not Found</h1>
      <p className="text-sm text-slate-400 max-w-sm">
        The requested bandwidth management view or network resource does not exist.
      </p>
      <Link to="/" className="pt-2">
        <Button variant="primary" icon={Home}>
          Return to Overview
        </Button>
      </Link>
    </div>
  );
};
