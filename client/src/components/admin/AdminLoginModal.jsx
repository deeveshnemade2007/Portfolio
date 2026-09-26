import React, { useState } from 'react';
import { Lock, KeyRound, User, X, AlertCircle, ShieldCheck } from 'lucide-react';
import axios from 'axios';

const AdminLoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const inputUser = username.trim();
    const inputPass = password.trim();

    try {
      const res = await axios.post('/api/auth/login', { username: inputUser, password: inputPass });
      const { token, admin } = res.data;
      localStorage.setItem('portfolio_token', token);
      onLoginSuccess(token, admin);
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid credentials. Default is username: admin | password: admin123');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="glass-card max-w-md w-full rounded-2xl p-6 sm:p-8 relative space-y-6 border border-slate-800 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-900 rounded-xl"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-bold text-white">Admin CMS Login</h3>
          <p className="text-xs text-slate-400">
            Log in to manage bio, education marks, skills, projects, certificates, and resume files.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Username</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Password</label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          <div className="p-3 bg-indigo-500/5 border border-indigo-500/15 rounded-xl text-[11px] text-slate-400">
            <p className="font-semibold text-indigo-300 mb-0.5 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" /> Default Access Credentials:
            </p>
            Username: <code className="text-white">admin</code> | Password: <code className="text-white">admin123</code>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Access Admin Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginModal;
