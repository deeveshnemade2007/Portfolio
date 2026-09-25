import React, { useState } from 'react';
import { Cpu, Code2, Wrench, Layers } from 'lucide-react';

const Skills = ({ skills = [] }) => {
  const [activeTab, setActiveTab] = useState('All');

  const categories = ['All', ...Array.from(new Set(skills.map(s => s.category)))];

  const filteredSkills = activeTab === 'All' 
    ? skills 
    : skills.filter(s => s.category === activeTab);

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Languages': return <Code2 className="w-4 h-4 text-indigo-400" />;
      case 'Frameworks': return <Layers className="w-4 h-4 text-purple-400" />;
      case 'Tools': return <Wrench className="w-4 h-4 text-pink-400" />;
      default: return <Cpu className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <section id="skills" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
            <Cpu className="w-4 h-4" />
            Skills & Technical Stack
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Skills & <span className="gradient-text">Tools</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Programming languages, frameworks, developer tools, databases, and core concepts.
          </p>
        </div>

        {categories.length > 1 && (
          <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                  activeTab === cat
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat !== 'All' && getCategoryIcon(cat)}
                {cat}
              </button>
            ))}
          </div>
        )}

        {filteredSkills.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-sm">
            No skills found. Add skills in the Admin CMS.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredSkills.map((skill) => (
              <div
                key={skill.id || skill.name}
                className="glass-card glass-card-hover rounded-2xl p-4 border border-slate-800/80 flex items-center gap-3 transition-all hover:border-indigo-500/40"
              >
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 shrink-0">
                  {getCategoryIcon(skill.category)}
                </div>
                <div className="overflow-hidden">
                  <h4 className="font-bold text-white text-sm truncate">{skill.name}</h4>
                  <span className="text-[11px] text-slate-400 block font-medium truncate">{skill.category}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Skills;
