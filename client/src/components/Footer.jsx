import React from 'react';
import { Lock } from 'lucide-react';

const Footer = ({ profile, onOpenLogin }) => {
  return (
    <footer className="py-12 border-t border-slate-800/80 bg-slate-950 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="font-medium text-slate-300">
            © {new Date().getFullYear()} {profile?.full_name || 'Portfolio'}. All rights reserved.
          </p>
          <p className="text-slate-500 text-[11px] mt-0.5">
            Built with React, Express, SQLite & Tailwind CSS. Powered by embedded CMS.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={onOpenLogin}
            className="flex items-center gap-1.5 text-slate-400 hover:text-indigo-400 transition-colors"
          >
            <Lock className="w-3.5 h-3.5 text-indigo-400" />
            <span>Admin CMS Login</span>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
