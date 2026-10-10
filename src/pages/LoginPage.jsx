import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { Button } from '../components/common/Button.jsx';
import { Activity, LogIn, Lock, Mail, Sparkles } from 'lucide-react';

export const LoginPage = () => {
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form);
      addToast(`Welcome back, ${user.name}!`, 'success');
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (email, password = 'TitanDemo123!') => {
    setForm({ email, password });
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-8">
      <div className="w-full max-w-md titan-card p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/30 items-center justify-center text-teal-400 mb-2">
            <Activity className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">Sign In to TITAN</h2>
          <p className="text-xs text-slate-400">
            Access your network operations dashboard or bandwidth requests
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input
                type="email"
                required
                placeholder="name@domain.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          <Button type="submit" variant="primary" loading={loading} className="w-full" icon={LogIn}>
            Sign In
          </Button>
        </form>

        {/* Quick Demo Credentials Autofill */}
        <div className="pt-4 border-t border-slate-800">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" /> Quick Demo One-Click Fill:
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleQuickFill('admin@titan.local')}
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left transition-colors"
            >
              <p className="font-semibold text-teal-300">Admin</p>
              <p className="text-[10px] text-slate-500 font-mono truncate">admin@titan.local</p>
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('alex@titan.local')}
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left transition-colors"
            >
              <p className="font-semibold text-blue-300">User A (Exam)</p>
              <p className="text-[10px] text-slate-500 font-mono truncate">alex@titan.local</p>
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('bella@titan.local')}
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left transition-colors"
            >
              <p className="font-semibold text-amber-300">User B (Video)</p>
              <p className="text-[10px] text-slate-500 font-mono truncate">bella@titan.local</p>
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('charlie@titan.local')}
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left transition-colors"
            >
              <p className="font-semibold text-rose-300">User C (Bulk)</p>
              <p className="text-[10px] text-slate-500 font-mono truncate">charlie@titan.local</p>
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400">
          Don't have an account yet?{' '}
          <Link to="/register" className="text-teal-400 font-semibold hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};
