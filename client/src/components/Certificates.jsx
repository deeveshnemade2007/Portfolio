import React, { useState } from 'react';
import { Award, FileText, Download, ExternalLink, Calendar, Eye, X, ShieldCheck } from 'lucide-react';

const Certificates = ({ certificates = [] }) => {
  const [activePreview, setActivePreview] = useState(null);

  return (
    <section id="certificates" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold">
            <Award className="w-4 h-4" />
            Certifications & Achievements
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Verified <span className="gradient-text">Certificates</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Professional certifications, course accomplishments, and verified credentials uploaded via Admin CMS.
          </p>
        </div>

        {certificates.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-sm">
            No certificates uploaded yet. Upload certificate PDFs or images using the Admin CMS.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {certificates.map((cert) => {
              const isPdf = cert.file_type === 'pdf' || (cert.file_url && cert.file_url.endsWith('.pdf'));

              return (
                <div
                  key={cert.id}
                  className="glass-card glass-card-hover rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between border border-slate-800/80 group"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold shrink-0">
                        {isPdf ? <FileText className="w-6 h-6" /> : <Award className="w-6 h-6" />}
                      </div>

                      <div className="flex items-center gap-2">
                        {cert.issue_date && (
                          <span className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg text-xs font-medium text-slate-400 flex items-center gap-1.5">
                            <Calendar className="w-3 h-3 text-emerald-400" />
                            {cert.issue_date}
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                        {cert.title}
                      </h3>
                      <p className="text-emerald-400 font-semibold text-xs pt-1">{cert.issuer}</p>
                    </div>

                    {cert.description && (
                      <p className="text-slate-300 text-sm leading-relaxed line-clamp-3">
                        {cert.description}
                      </p>
                    )}
                  </div>

                  <div className="pt-6 mt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setActivePreview(cert)}
                      className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all"
                    >
                      <Eye className="w-3.5 h-3.5 text-indigo-400" />
                      View Certificate
                    </button>

                    <div className="flex items-center gap-2">
                      {cert.credential_url && (
                        <a
                          href={cert.credential_url}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-emerald-400 rounded-xl transition-colors"
                          title="Verify Credential"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}

                      {cert.file_url && (
                        <a
                          href={cert.file_url}
                          download={cert.title || 'Certificate'}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-colors shadow-md shadow-emerald-600/30"
                          title="Download Certificate File"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activePreview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
            <div className="glass-card max-w-4xl w-full rounded-2xl p-6 relative space-y-4 max-h-[90vh] flex flex-col border border-slate-800 shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{activePreview.title}</h3>
                    <p className="text-xs text-slate-400">Issued by {activePreview.issuer}</p>
                  </div>
                </div>
                <button
                  onClick={() => setActivePreview(null)}
                  className="p-2 text-slate-400 hover:text-white bg-slate-900 rounded-xl"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 bg-slate-950 rounded-xl overflow-hidden min-h-[400px] flex items-center justify-center border border-slate-800">
                {activePreview.file_type === 'pdf' || (activePreview.file_url && activePreview.file_url.endsWith('.pdf')) ? (
                  <iframe
                    src={activePreview.file_url}
                    title={activePreview.title}
                    className="w-full h-[550px] border-none"
                  />
                ) : (
                  <img
                    src={activePreview.file_url}
                    alt={activePreview.title}
                    className="max-h-[550px] max-w-full object-contain p-2"
                  />
                )}
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <a
                  href={activePreview.file_url}
                  download
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download File
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Certificates;
