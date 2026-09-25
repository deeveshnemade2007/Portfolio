import React from 'react';
import { Phone, Mail, Linkedin, Github, MapPin, Download, ArrowRight, ShieldCheck, FileText } from 'lucide-react';

const Hero = ({ profile, resume }) => {
  if (!profile) return null;

  return (
    <section id="about" className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[350px] h-[350px] bg-purple-600/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Available for Opportunities & Roles
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
              Hi, I'm <span className="gradient-text">{profile.full_name || 'Alex Morgan'}</span>
            </h1>

            <p className="text-xl sm:text-2xl font-semibold text-slate-300">
              {profile.title || 'Full Stack Developer & Computer Science Student'}
            </p>

            <p className="text-slate-400 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0">
              {profile.bio || 'Passionate software engineer focused on building clean, high-performance web applications and intuitive software solutions.'}
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-medium text-slate-300">
              {profile.phone && (
                <a href={`tel:${profile.phone}`} className="flex items-center gap-2 px-3 py-2 bg-slate-900/80 border border-slate-800 rounded-xl hover:border-indigo-500/40 hover:text-indigo-400 transition-colors">
                  <Phone className="w-4 h-4 text-indigo-400" />
                  <span>{profile.phone}</span>
                </a>
              )}

              {profile.email && (
                <a href={`mailto:${profile.email}`} className="flex items-center gap-2 px-3 py-2 bg-slate-900/80 border border-slate-800 rounded-xl hover:border-indigo-500/40 hover:text-indigo-400 transition-colors">
                  <Mail className="w-4 h-4 text-indigo-400" />
                  <span>{profile.email}</span>
                </a>
              )}

              {profile.location && (
                <div className="flex items-center gap-2 px-3 py-2 bg-slate-900/80 border border-slate-800 rounded-xl text-slate-400">
                  <MapPin className="w-4 h-4 text-rose-400" />
                  <span>{profile.location}</span>
                </div>
              )}
            </div>

            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <a
                href="#projects"
                className="px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm rounded-xl shadow-xl shadow-indigo-600/25 flex items-center gap-2 transition-all hover:scale-[1.02]"
              >
                View Projects
                <ArrowRight className="w-4 h-4" />
              </a>

              {resume?.file_url ? (
                <a
                  href={resume.file_url}
                  download={resume.filename || 'Resume.pdf'}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-3.5 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-white font-medium text-sm rounded-xl flex items-center gap-2 transition-all"
                >
                  <Download className="w-4 h-4 text-indigo-400" />
                  Download Resume
                </a>
              ) : (
                <a
                  href="#resume"
                  className="px-5 py-3.5 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-white font-medium text-sm rounded-xl flex items-center gap-2 transition-all"
                >
                  <FileText className="w-4 h-4 text-indigo-400" />
                  View Resume
                </a>
              )}

              <div className="flex items-center gap-2 pl-2">
                {profile.linkedin_url && (
                  <a
                    href={profile.linkedin_url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 bg-slate-900/90 border border-slate-800 hover:border-indigo-500 text-slate-300 hover:text-indigo-400 rounded-xl transition-all"
                    title="LinkedIn Profile"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                )}

                {profile.github_url && (
                  <a
                    href={profile.github_url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 bg-slate-900/90 border border-slate-800 hover:border-indigo-500 text-slate-300 hover:text-white rounded-xl transition-all"
                    title="GitHub Profile"
                  >
                    <Github className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center">
            <div className="relative group">
              <div className="absolute -inset-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl blur-md opacity-60 group-hover:opacity-100 transition duration-500" />
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl">
                <img
                  src={profile.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600'}
                  alt={profile.full_name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="absolute -bottom-4 -left-4 bg-slate-900/95 backdrop-blur-md border border-slate-800 p-3 rounded-2xl shadow-xl flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Verified Portfolio</p>
                  <p className="text-[11px] text-slate-400">CMS Managed</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
