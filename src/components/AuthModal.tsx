import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Role } from '../types';
import { X, LogIn, UserPlus, Shield, Sparkles, UserCheck } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'register';
  onLoginSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'login',
  onLoginSuccess,
}) => {
  if (!isOpen) return null;

  const [tab, setTab] = useState<'login' | 'register'>(defaultTab);
  const [role, setRole] = useState<Role>('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mockUser: User = {
      id: `usr-${Date.now()}`,
      name: name || (email.split('@')[0] || 'User'),
      email: email || 'user@snapstories.in',
      role,
    };
    onLoginSuccess(mockUser);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/90 backdrop-blur-2xl"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-[#121212] border border-neutral-800 rounded-3xl p-6 shadow-2xl z-10 text-white"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-neutral-400 hover:text-white border border-neutral-800 transition"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Tab Switcher */}
          <div className="flex items-center space-x-2 p-1 bg-neutral-900 border border-neutral-800 rounded-2xl mb-6">
            <button
              onClick={() => setTab('login')}
              className={`flex-1 py-2 text-xs font-space font-bold rounded-xl transition ${
                tab === 'login' ? 'bg-gradient-brand text-white shadow' : 'text-neutral-400'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setTab('register')}
              className={`flex-1 py-2 text-xs font-space font-bold rounded-xl transition ${
                tab === 'register' ? 'bg-gradient-brand text-white shadow' : 'text-neutral-400'
              }`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Selection */}
            <div>
              <label className="text-[10px] font-mono text-amber-400 uppercase font-bold block mb-2">
                Account Type
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'customer', label: 'Customer', icon: UserCheck },
                  { id: 'creator', label: 'Creator', icon: Sparkles },
                  { id: 'admin', label: 'Admin', icon: Shield },
                ].map((r) => {
                  const Icon = r.icon;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setRole(r.id as Role)}
                      className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center space-y-1 ${
                        role === r.id
                          ? 'bg-neutral-800 border-amber-500 text-white font-bold'
                          : 'bg-black/60 border-neutral-800 text-neutral-400'
                      }`}
                    >
                      <Icon className="w-4 h-4 text-orange-400" />
                      <span className="text-[11px]">{r.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {tab === 'register' && (
              <div>
                <label className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ananya Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-black/60 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>
            )}

            <div>
              <label className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/60 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">
                Password
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/60 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-gradient-brand text-white font-space font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(255,59,0,0.4)] hover:brightness-110 transition mt-2"
            >
              {tab === 'login' ? `Login as ${role}` : `Create ${role} Account`}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
