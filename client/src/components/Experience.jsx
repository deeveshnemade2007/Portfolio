import React from 'react';
import { Briefcase, Calendar, MapPin, CheckCircle2 } from 'lucide-react';

const Experience = ({ experience = [] }) => {
  return (
    <section id="experience" className="py-20 bg-slate-900/40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
            <Briefcase className="w-4 h-4" />
            Work & Internships
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Professional <span className="gradient-text">Experience</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Internships, industry roles, and leadership experience in software development.
          </p>
        </div>

        {experience.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-sm">
            No work experience entries yet. Add internship & work records in the Admin CMS.
          </div>
        ) : (
          <div className="space-y-8 max-w-4xl mx-auto">
            {experience.map((item, idx) => (
              <div
                key={item.id || idx}
                className="glass-card glass-card-hover rounded-2xl p-6 sm:p-8 relative border-l-4 border-l-indigo-500"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      {item.title}
                      {item.is_current ? (
                        <span className="px-2.5 py-0.5 text-[10px] uppercase font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full">
                          Current Role
                        </span>
                      ) : null}
                    </h3>
                    <p className="text-indigo-400 font-medium text-sm pt-0.5">{item.company}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg">
                      <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                      {item.start_date} - {item.is_current ? 'Present' : item.end_date}
                    </div>
                    {item.location && (
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg">
                        <MapPin className="w-3.5 h-3.5 text-rose-400" />
                        {item.location}
                      </div>
                    )}
                  </div>
                </div>

                {item.description && (
                  <p className="text-slate-300 text-sm leading-relaxed mb-4">
                    {item.description}
                  </p>
                )}

                {Array.isArray(item.highlights) && item.highlights.length > 0 && (
                  <ul className="space-y-2 text-sm text-slate-300">
                    {item.highlights.map((point, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Experience;
