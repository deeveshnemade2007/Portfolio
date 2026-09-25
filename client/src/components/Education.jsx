import React from 'react';
import { GraduationCap, Award, Calendar, BookOpen, CheckCircle2 } from 'lucide-react';

const Education = ({ education = [] }) => {
  return (
    <section id="education" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold">
            <GraduationCap className="w-4 h-4" />
            Academic Background & Results
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Education & <span className="gradient-text">Marks</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Official academic record, degree qualifications, GPA/percentages, and performance history.
          </p>
        </div>

        {education.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-sm">
            No education records added yet. Use the Admin CMS to add your academic degrees and marks.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {education.map((item) => (
              <div
                key={item.id}
                className="glass-card glass-card-hover rounded-2xl p-6 sm:p-8 relative overflow-hidden flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-purple-500/15 border border-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                        <GraduationCap className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white leading-snug">{item.degree}</h3>
                        <p className="text-sm font-medium text-slate-400">{item.institution}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg text-xs font-medium text-slate-300">
                      <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                      {item.start_year} - {item.end_year}
                    </div>

                    {item.field_of_study && (
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg text-xs font-medium text-slate-300">
                        <BookOpen className="w-3.5 h-3.5 text-purple-400" />
                        {item.field_of_study}
                      </div>
                    )}

                    {item.marks_value && (
                      <div className="flex items-center gap-1.5 px-3.5 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-xs font-bold text-emerald-400">
                        <Award className="w-3.5 h-3.5" />
                        {item.marks_type ? `${item.marks_type}: ` : 'Score: '} {item.marks_value}
                      </div>
                    )}
                  </div>

                  {item.description && (
                    <p className="text-slate-300 text-sm leading-relaxed pt-2">
                      {item.description}
                    </p>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center gap-2 text-xs text-slate-400 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                  Official Academic Credential
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Education;
