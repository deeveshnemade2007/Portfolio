import React, { useState } from 'react';
import { FileText, Download, Eye, X, CheckCircle2 } from 'lucide-react';

const Resume = ({ resume }) => {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <section id="resume" className="py-20 bg-slate-900/40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card rounded-3xl p-8 sm:p-12 relative overflow-hidden border border-slate-800/80">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
                <FileText className="w-4 h-4" />
                Curriculum Vitae
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Official <span className="gradient-text">Resume</span>
              </h2>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
                Download my latest updated resume for complete details on work experience, education results, software projects, and technical skills.
              </p>

              <div className="pt-2 flex flex-wrap gap-4 text-xs font-medium text-slate-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Up to Date</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                  <span>PDF Document</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-400" />
                  <span>Managed via CMS</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
              {resume?.file_url ? (
                <>
                  <button
                    onClick={() => setShowPreview(true)}
                    className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all"
                  >
                    <Eye className="w-4 h-4" />
                    Preview Resume
                  </button>

                  <a
                    href={resume.file_url}
                    download={resume.filename || 'Resume.pdf'}
                    target="_blank"
                    rel="noreferrer"
                    className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-all"
                  >
                    <Download className="w-4 h-4 text-indigo-400" />
                    Download PDF
                  </a>
                </>
              ) : (
                <div className="text-center p-4 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-400">
                  No custom resume PDF uploaded yet. Upload your resume in the Admin CMS.
                </div>
              )}
            </div>
          </div>
        </div>

        {showPreview && resume?.file_url && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
            <div className="glass-card max-w-4xl w-full rounded-2xl p-6 relative space-y-4 max-h-[90vh] flex flex-col border border-slate-800 shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <FileText className="w-6 h-6 text-indigo-400" />
                  <h3 className="text-lg font-bold text-white">Resume Preview</h3>
                </div>
                <button
                  onClick={() => setShowPreview(false)}
                  className="p-2 text-slate-400 hover:text-white bg-slate-900 rounded-xl"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 bg-slate-950 rounded-xl overflow-hidden min-h-[500px]">
                <iframe
                  src={resume.file_url}
                  title="Resume PDF"
                  className="w-full h-[600px] border-none"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <a
                  href={resume.file_url}
                  download={resume.filename || 'Resume.pdf'}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download Resume PDF
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Resume;
