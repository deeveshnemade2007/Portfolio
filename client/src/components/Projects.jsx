import React, { useState } from 'react';
import { FolderGit2, ExternalLink, Github, Sparkles, Info, X } from 'lucide-react';

const Projects = ({ projects = [] }) => {
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <section id="projects" className="py-20 bg-slate-900/40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
            <FolderGit2 className="w-4 h-4" />
            Portfolio Showcase
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Software projects, web platforms, and open-source contributions.
          </p>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-sm">
            No projects added yet. Use the Admin CMS to showcase your projects.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => {
              const tagsList = project.tags ? project.tags.split(',').map(t => t.trim()) : [];

              return (
                <div
                  key={project.id}
                  className="glass-card glass-card-hover rounded-2xl overflow-hidden flex flex-col justify-between group border border-slate-800/80"
                >
                  <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                    <img
                      src={project.image_url || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800'}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {project.featured ? (
                      <span className="absolute top-3 left-3 px-3 py-1 bg-indigo-600/90 backdrop-blur-md text-white text-[11px] font-bold rounded-lg flex items-center gap-1.5 shadow-lg">
                        <Sparkles className="w-3.5 h-3.5" /> Featured
                      </span>
                    ) : null}
                  </div>

                  <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-3">
                      <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">
                        {project.title}
                      </h3>

                      <p className="text-slate-300 text-sm line-clamp-3 leading-relaxed">
                        {project.description}
                      </p>

                      {tagsList.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-2">
                          {tagsList.map((tag, tIdx) => (
                            <span
                              key={tIdx}
                              className="px-2.5 py-1 bg-slate-900 border border-slate-800 text-slate-300 text-xs font-medium rounded-lg"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
                      <button
                        onClick={() => setSelectedProject(project)}
                        className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                      >
                        <Info className="w-3.5 h-3.5" /> Details
                      </button>

                      <div className="flex items-center gap-2">
                        {project.github_url && (
                          <a
                            href={project.github_url}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 bg-slate-900 border border-slate-800 text-slate-300 hover:text-white rounded-xl hover:border-slate-700 transition-all"
                            title="GitHub Source"
                          >
                            <Github className="w-4 h-4" />
                          </a>
                        )}

                        {project.live_url && (
                          <a
                            href={project.live_url}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all shadow-md"
                          >
                            <span>Demo</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <div className="glass-card max-w-2xl w-full rounded-2xl p-6 sm:p-8 relative space-y-6 max-h-[90vh] overflow-y-auto border border-slate-800 shadow-2xl">
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-900 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-4">
                <img
                  src={selectedProject.image_url || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800'}
                  alt={selectedProject.title}
                  className="w-full h-56 object-cover rounded-xl border border-slate-800"
                />

                <h3 className="text-2xl font-extrabold text-white">{selectedProject.title}</h3>

                <p className="text-slate-300 text-sm leading-relaxed">
                  {selectedProject.full_details || selectedProject.description}
                </p>

                {selectedProject.tags && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Technologies Used</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.tags.split(',').map((t, idx) => (
                        <span key={idx} className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium rounded-lg">
                          {t.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center gap-4">
                {selectedProject.live_url && (
                  <a
                    href={selectedProject.live_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2"
                  >
                    <span>Visit Live Demo</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}

                {selectedProject.github_url && (
                  <a
                    href={selectedProject.github_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2"
                  >
                    <Github className="w-4 h-4" />
                    <span>Source Code</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;
