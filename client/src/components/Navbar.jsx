import React, { useState, useEffect } from 'react';
import { Lock, LogOut, LayoutDashboard, Menu, X } from 'lucide-react';

const Navbar = ({ profile, isAdminLoggedIn, onOpenLogin, onOpenAdmin, onLogout }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Education', href: '#education' },
    { name: 'Experience', href: '#experience' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Certificates', href: '#certificates' },
    { name: 'Resume', href: '#resume' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 py-3 shadow-xl' : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <a href="#about" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
              {profile?.full_name ? profile.full_name.charAt(0) : 'P'}
            </div>
            <div>
              <span className="text-lg font-bold text-white tracking-tight group-hover:text-indigo-400 transition-colors">
                {profile?.full_name || 'Portfolio'}
              </span>
              <span className="block text-xs text-indigo-400 font-medium">Student / Professional</span>
            </div>
          </a>

          <div className="hidden lg:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-full border border-slate-800/80">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="px-4 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-full transition-all"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="hidden sm:flex items-center gap-3">
            {isAdminLoggedIn ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenAdmin}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-md shadow-indigo-600/30"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Admin CMS
                </button>
                <button
                  onClick={onLogout}
                  title="Log Out of Admin"
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-900 rounded-xl border border-slate-800 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl transition-all"
              >
                <Lock className="w-3.5 h-3.5 text-indigo-400" />
                Admin Portal
              </button>
            )}
          </div>

          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 p-4 bg-slate-900/95 border border-slate-800 rounded-2xl backdrop-blur-xl shadow-2xl space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-xl transition-colors"
              >
                {link.name}
              </a>
            ))}
            <div className="pt-3 border-t border-slate-800">
              {isAdminLoggedIn ? (
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => { setMobileMenuOpen(false); onOpenAdmin(); }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-xl"
                  >
                    <LayoutDashboard className="w-4 h-4" /> Open Admin CMS
                  </button>
                  <button
                    onClick={() => { setMobileMenuOpen(false); onLogout(); }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-rose-400 bg-slate-800 rounded-xl"
                  >
                    <LogOut className="w-4 h-4" /> Log Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { setMobileMenuOpen(false); onOpenLogin(); }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-200 bg-slate-800 rounded-xl"
                >
                  <Lock className="w-4 h-4 text-indigo-400" /> Admin Login
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
