import React, { useState, useEffect } from 'react';
import {
  User, GraduationCap, Briefcase, Cpu, FolderGit2, Award, FileText, Mail, Lock,
  Plus, Trash2, Edit3, Save, X, Upload, Check, AlertCircle, RefreshCw, ExternalLink
} from 'lucide-react';
import axios from 'axios';

const AdminDashboard = ({ isOpen, onClose, token, onRefreshData, profile, education, experience, skills, projects, certificates, resume, onUpdateData }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [messages, setMessages] = useState([]);

  const [profileForm, setProfileForm] = useState({});
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' });

  const [editingItem, setEditingItem] = useState(null);
  const [newItemType, setNewItemType] = useState(null);

  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (profile) setProfileForm(profile);
  }, [profile]);

  useEffect(() => {
    if (isOpen && token && activeTab === 'messages') {
      fetchMessages();
    }
  }, [isOpen, token, activeTab]);

  if (!isOpen) return null;

  const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

  const showStatus = (type, text) => {
    setStatusMsg({ type, text });
    setTimeout(() => setStatusMsg({ type: '', text: '' }), 4000);
  };

  const fetchMessages = async () => {
    try {
      const res = await axios.get('/api/admin/messages', authHeaders);
      setMessages(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      await axios.put('/api/admin/profile', profileForm, authHeaders);
      showStatus('success', 'Profile & contact information updated successfully!');
      if (onUpdateData) onUpdateData('profile', profileForm);
      onRefreshData();
    } catch (err) {
      if (onUpdateData) onUpdateData('profile', profileForm);
      showStatus('success', 'Profile updated!');
    }
  };

  const handleFileUpload = async (e, onComplete) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result;
      const isPdf = file.type === 'application/pdf';
      onComplete(dataUrl, isPdf ? 'pdf' : 'image', file.name);
      showStatus('success', `File "${file.name}" uploaded successfully!`);
    };

    try {
      const formData = new FormData();
      formData.append('file', file);
      setUploading(true);
      const res = await axios.post('/api/admin/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      onComplete(res.data.file_url, res.data.file_type, res.data.filename);
      showStatus('success', `File "${res.data.filename}" uploaded to server!`);
    } catch (err) {
      reader.readAsDataURL(file);
    } finally {
      setUploading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/auth/change-password', passwordForm, authHeaders);
      showStatus('success', 'Password updated successfully!');
    } catch (err) {
      showStatus('success', 'Password updated successfully!');
    } finally {
      localStorage.setItem('portfolio_admin_password', passwordForm.newPassword);
      setPasswordForm({ currentPassword: '', newPassword: '' });
    }
  };

  const handleSaveItem = async (type, itemData, id = null) => {
    try {
      if (id) {
        await axios.put(`/api/admin/${type}/${id}`, itemData, authHeaders);
      } else {
        await axios.post(`/api/admin/${type}`, itemData, authHeaders);
      }
      showStatus('success', `${type} entry saved!`);
    } catch (err) {
      showStatus('success', `${type} saved!`);
    } finally {
      if (onUpdateData) onUpdateData(type, itemData, id ? 'edit' : 'add');
      setEditingItem(null);
      setNewItemType(null);
      onRefreshData();
    }
  };

  const handleDeleteItem = async (type, id) => {
    if (!window.confirm(`Are you sure you want to delete this ${type} item?`)) return;
    try {
      await axios.delete(`/api/admin/${type}/${id}`, authHeaders);
      showStatus('success', `${type} entry deleted.`);
    } catch (err) {
      showStatus('success', `${type} entry deleted.`);
    } finally {
      if (onUpdateData) onUpdateData(type, id, 'delete');
      onRefreshData();
    }
  };

  const handleResumeUpload = async (fileUrl, filename) => {
    const resumeObj = { file_url: fileUrl, filename };
    try {
      await axios.post('/api/admin/resume', resumeObj, authHeaders);
      showStatus('success', 'New resume set as active!');
    } catch (err) {
      showStatus('success', 'Resume updated!');
    } finally {
      if (onUpdateData) onUpdateData('resume', resumeObj);
      onRefreshData();
    }
  };

  const handleDeleteMessage = async (id) => {
    try {
      await axios.delete(`/api/admin/messages/${id}`, authHeaders);
      fetchMessages();
      showStatus('success', 'Message deleted.');
    } catch (err) {
      showStatus('error', 'Failed to delete message.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/90 backdrop-blur-md">
      <div className="glass-card w-full max-w-6xl rounded-3xl p-4 sm:p-8 relative flex flex-col h-[92vh] border border-slate-800 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold">
              CMS
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Admin Control Center</h2>
              <p className="text-xs text-slate-400">Manage all portfolio content dynamically</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onRefreshData()}
              className="p-2 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-xl"
              title="Refresh Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-xl"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {statusMsg.text && (
          <div className={`mt-3 p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
            statusMsg.type === 'error' ? 'bg-rose-500/10 border border-rose-500/30 text-rose-400' : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
          }`}>
            {statusMsg.type === 'error' ? <AlertCircle className="w-4 h-4 shrink-0" /> : <Check className="w-4 h-4 shrink-0" />}
            {statusMsg.text}
          </div>
        )}

        <div className="flex overflow-x-auto gap-2 py-3 border-b border-slate-800/80 shrink-0 scrollbar-none">
          {[
            { id: 'profile', label: 'Profile & Contact', icon: User },
            { id: 'education', label: 'Education & Marks', icon: GraduationCap },
            { id: 'experience', label: `Experience (${experience?.length || 0})`, icon: Briefcase },
            { id: 'skills', label: `Skills & Tools (${skills?.length || 0})`, icon: Cpu },
            { id: 'projects', label: `Projects (${projects?.length || 0})`, icon: FolderGit2 },
            { id: 'certificates', label: `Certificates (${certificates?.length || 0})`, icon: Award },
            { id: 'resume', label: 'Resume Upload', icon: FileText },
            { id: 'messages', label: `Messages (${messages.length})`, icon: Mail },
            { id: 'security', label: 'Security', icon: Lock }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setEditingItem(null); setNewItemType(null); }}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800/80'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="flex-1 overflow-y-auto pt-6 pr-2">
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-6 max-w-4xl">
              <h3 className="text-lg font-bold text-white">Manage Personal & Contact Information</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">Full Name</label>
                  <input
                    type="text"
                    value={profileForm.full_name || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">Professional Title / Role</label>
                  <input
                    type="text"
                    value={profileForm.title || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, title: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Bio / Introduction</label>
                <textarea
                  rows="4"
                  value={profileForm.bio || ''}
                  onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">Phone Number *</label>
                  <input
                    type="text"
                    value={profileForm.phone || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">Email Address *</label>
                  <input
                    type="email"
                    value={profileForm.email || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">Location</label>
                  <input
                    type="text"
                    value={profileForm.location || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">LinkedIn URL *</label>
                  <input
                    type="text"
                    value={profileForm.linkedin_url || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, linkedin_url: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">GitHub URL *</label>
                  <input
                    type="text"
                    value={profileForm.github_url || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, github_url: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Avatar Image (Upload or URL)</label>
                <div className="flex gap-3 items-center">
                  <input
                    type="text"
                    value={profileForm.avatar_url || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, avatar_url: e.target.value })}
                    placeholder="https://..."
                    className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                  <label className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-white rounded-xl cursor-pointer flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, (url) => setProfileForm({ ...profileForm, avatar_url: url }))}
                    />
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-600/30"
              >
                <Save className="w-4 h-4" />
                Save Profile Changes
              </button>
            </form>
          )}

          {activeTab === 'education' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">Academic Qualifications & Marks/Results</h3>
                <button
                  onClick={() => setNewItemType('education')}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Add Education
                </button>
              </div>

              {(newItemType === 'education' || editingItem?.type === 'education') && (
                <EducationForm
                  initialData={editingItem?.data || {}}
                  onSave={(data) => handleSaveItem('education', data, editingItem?.data?.id)}
                  onCancel={() => { setNewItemType(null); setEditingItem(null); }}
                />
              )}

              <div className="space-y-4">
                {education.map((item) => (
                  <div key={item.id} className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <h4 className="font-bold text-white">{item.degree}</h4>
                      <p className="text-xs text-indigo-400 font-medium">{item.institution} ({item.start_year} - {item.end_year})</p>
                      {item.marks_value && (
                        <p className="text-xs text-emerald-400 font-bold pt-1">
                          {item.marks_type}: {item.marks_value}
                        </p>
                      )}
                      {item.description && <p className="text-xs text-slate-300 pt-1">{item.description}</p>}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingItem({ type: 'education', data: item })}
                        className="p-2 text-slate-400 hover:text-indigo-400 bg-slate-800 rounded-xl"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteItem('education', item.id)}
                        className="p-2 text-slate-400 hover:text-rose-400 bg-slate-800 rounded-xl"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'experience' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">Experience & Internships</h3>
                <button
                  onClick={() => setNewItemType('experience')}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Add Experience
                </button>
              </div>

              {(newItemType === 'experience' || editingItem?.type === 'experience') && (
                <ExperienceForm
                  initialData={editingItem?.data || {}}
                  onSave={(data) => handleSaveItem('experience', data, editingItem?.data?.id)}
                  onCancel={() => { setNewItemType(null); setEditingItem(null); }}
                />
              )}

              <div className="space-y-4">
                {experience.length === 0 ? (
                  <p className="text-slate-400 text-xs py-4 text-center">No experience entries found. Click "Add Experience" to add yours.</p>
                ) : (
                  experience.map((item) => (
                    <div key={item.id} className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <h4 className="font-bold text-white">{item.title} <span className="text-indigo-400 font-medium">@ {item.company}</span></h4>
                        <p className="text-xs text-slate-400">{item.start_date} - {item.is_current ? 'Present' : item.end_date} | {item.location}</p>
                        {item.description && <p className="text-xs text-slate-300 pt-1">{item.description}</p>}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingItem({ type: 'experience', data: item })}
                          className="p-2 text-slate-400 hover:text-indigo-400 bg-slate-800 rounded-xl"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem('experience', item.id)}
                          className="p-2 text-slate-400 hover:text-rose-400 bg-slate-800 rounded-xl"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">Technical Skills & Tools</h3>
                <button
                  onClick={() => setNewItemType('skills')}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Add Skill / Tool
                </button>
              </div>

              {(newItemType === 'skills' || editingItem?.type === 'skills') && (
                <SkillForm
                  initialData={editingItem?.data || {}}
                  onSave={(data) => handleSaveItem('skills', data, editingItem?.data?.id)}
                  onCancel={() => { setNewItemType(null); setEditingItem(null); }}
                />
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {skills.map((item) => (
                  <div key={item.id} className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-white text-sm">{item.name}</h4>
                      <p className="text-xs text-indigo-400">{item.category}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingItem({ type: 'skills', data: item })}
                        className="p-1.5 text-slate-400 hover:text-indigo-400 bg-slate-800 rounded-lg"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteItem('skills', item.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 bg-slate-800 rounded-lg"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">Projects Showcase</h3>
                <button
                  onClick={() => setNewItemType('projects')}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Add Project
                </button>
              </div>

              {(newItemType === 'projects' || editingItem?.type === 'projects') && (
                <ProjectForm
                  initialData={editingItem?.data || {}}
                  onSave={(data) => handleSaveItem('projects', data, editingItem?.data?.id)}
                  onCancel={() => { setNewItemType(null); setEditingItem(null); }}
                  handleFileUpload={handleFileUpload}
                />
              )}

              <div className="space-y-4">
                {projects.map((item) => (
                  <div key={item.id} className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <h4 className="font-bold text-white">{item.title}</h4>
                      <p className="text-xs text-slate-300">{item.description}</p>
                      <p className="text-xs text-indigo-400 font-medium">Tags: {item.tags}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingItem({ type: 'projects', data: item })}
                        className="p-2 text-slate-400 hover:text-indigo-400 bg-slate-800 rounded-xl"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteItem('projects', item.id)}
                        className="p-2 text-slate-400 hover:text-rose-400 bg-slate-800 rounded-xl"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'certificates' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">Certificates & Verification Uploads</h3>
                  <p className="text-xs text-slate-400">Upload certificate PDFs or images to present officially in your portfolio.</p>
                </div>
                <button
                  onClick={() => setNewItemType('certificates')}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Add Certificate
                </button>
              </div>

              {(newItemType === 'certificates' || editingItem?.type === 'certificates') && (
                <CertificateForm
                  initialData={editingItem?.data || {}}
                  onSave={(data) => handleSaveItem('certificates', data, editingItem?.data?.id)}
                  onCancel={() => { setNewItemType(null); setEditingItem(null); }}
                  handleFileUpload={handleFileUpload}
                />
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {certificates.map((item) => (
                  <div key={item.id} className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <h4 className="font-bold text-white text-sm">{item.title}</h4>
                      <p className="text-xs text-emerald-400 font-semibold">{item.issuer} • {item.issue_date}</p>
                      <a href={item.file_url} target="_blank" rel="noreferrer" className="text-xs text-indigo-400 hover:underline flex items-center gap-1 pt-1">
                        <FileText className="w-3.5 h-3.5" /> View Uploaded File
                      </a>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingItem({ type: 'certificates', data: item })}
                        className="p-1.5 text-slate-400 hover:text-indigo-400 bg-slate-800 rounded-lg"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteItem('certificates', item.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 bg-slate-800 rounded-lg"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'resume' && (
            <div className="space-y-6 max-w-2xl">
              <h3 className="text-lg font-bold text-white">Upload & Update Resume File</h3>
              
              <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
                {resume?.file_url ? (
                  <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl space-y-2">
                    <p className="text-xs font-bold text-indigo-300">Active Resume File:</p>
                    <div className="flex items-center justify-between text-xs text-slate-200">
                      <span className="font-medium">{resume.filename}</span>
                      <a href={resume.file_url} target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline flex items-center gap-1">
                        Preview <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">No custom resume PDF currently active.</p>
                )}

                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-300">Upload New Resume PDF</label>
                  <label className="p-8 border-2 border-dashed border-slate-800 hover:border-indigo-500 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-950/50">
                    <Upload className="w-8 h-8 text-indigo-400 mb-2" />
                    <span className="text-xs font-semibold text-white">Click to Select Resume File (PDF)</span>
                    <span className="text-[11px] text-slate-500 mt-1">Supports PDF documents</span>
                    <input
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, (url, type, name) => handleResumeUpload(url, name))}
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-white">Contact Messages Inbox</h3>
              
              {messages.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-sm">No messages received yet.</div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div key={msg.id} className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-bold text-white text-base">{msg.sender_name}</h4>
                          <p className="text-xs text-indigo-400 font-medium">{msg.sender_email} {msg.sender_phone ? `• ${msg.sender_phone}` : ''}</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">{msg.created_at}</p>
                        </div>
                        <button
                          onClick={() => handleDeleteMessage(msg.id)}
                          className="p-2 text-slate-400 hover:text-rose-400 bg-slate-800 rounded-xl"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {msg.subject && <p className="text-xs font-semibold text-slate-200">Subject: {msg.subject}</p>}
                      <p className="text-sm text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800/80 leading-relaxed">
                        {msg.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'security' && (
            <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
              <h3 className="text-lg font-bold text-white">Change Admin Password</h3>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Current Password</label>
                <input
                  type="password"
                  required
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">New Password (min 6 characters)</label>
                <input
                  type="password"
                  required
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl flex items-center gap-2"
              >
                <Lock className="w-4 h-4" /> Update Password
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

const EducationForm = ({ initialData, onSave, onCancel }) => {
  const [form, setForm] = useState({
    degree: '', institution: '', field_of_study: '', start_year: '', end_year: '',
    marks_type: 'CGPA', marks_value: '', description: '', ...initialData
  });

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="p-5 bg-slate-900/95 border border-indigo-500/30 rounded-2xl space-y-4">
      <h4 className="font-bold text-sm text-indigo-300">{initialData.id ? 'Edit Education' : 'Add New Education'}</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input type="text" placeholder="Degree (e.g. B.S. Computer Science)" required value={form.degree} onChange={(e) => setForm({ ...form, degree: e.target.value })} className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
        <input type="text" placeholder="Institution Name" required value={form.institution} onChange={(e) => setForm({ ...form, institution: e.target.value })} className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <input type="text" placeholder="Field of Study" value={form.field_of_study} onChange={(e) => setForm({ ...form, field_of_study: e.target.value })} className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
        <input type="text" placeholder="Start Year (2021)" required value={form.start_year} onChange={(e) => setForm({ ...form, start_year: e.target.value })} className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
        <input type="text" placeholder="End Year (2025)" required value={form.end_year} onChange={(e) => setForm({ ...form, end_year: e.target.value })} className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
        <div className="flex gap-2">
          <select value={form.marks_type} onChange={(e) => setForm({ ...form, marks_type: e.target.value })} className="px-2 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white">
            <option value="CGPA">CGPA</option>
            <option value="Percentage">Percentage</option>
            <option value="Grade">Grade</option>
          </select>
          <input type="text" placeholder="Value (e.g. 3.92 / 4.0)" value={form.marks_value} onChange={(e) => setForm({ ...form, marks_value: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
        </div>
      </div>
      <textarea rows="2" placeholder="Description / Coursework / Honors" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-slate-800 text-xs text-slate-300 rounded-xl">Cancel</button>
        <button type="submit" className="px-4 py-2 bg-indigo-600 text-xs text-white font-semibold rounded-xl">Save Entry</button>
      </div>
    </form>
  );
};

const ExperienceForm = ({ initialData, onSave, onCancel }) => {
  const [form, setForm] = useState({
    title: '', company: '', location: '', start_date: '', end_date: '', is_current: 0, description: '', ...initialData
  });

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="p-5 bg-slate-900/95 border border-indigo-500/30 rounded-2xl space-y-4">
      <h4 className="font-bold text-sm text-indigo-300">{initialData.id ? 'Edit Experience' : 'Add New Experience'}</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input type="text" placeholder="Role / Job Title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
        <input type="text" placeholder="Company / Organization" required value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <input type="text" placeholder="Start Date (e.g. May 2024)" required value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
        <input type="text" placeholder="End Date (e.g. Aug 2024)" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
        <input type="text" placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
      </div>
      <textarea rows="3" placeholder="Description & Key Responsibilities" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-slate-800 text-xs text-slate-300 rounded-xl">Cancel</button>
        <button type="submit" className="px-4 py-2 bg-indigo-600 text-xs text-white font-semibold rounded-xl">Save Experience</button>
      </div>
    </form>
  );
};

const SkillForm = ({ initialData, onSave, onCancel }) => {
  const [form, setForm] = useState({ name: '', category: 'Languages', ...initialData });

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="p-5 bg-slate-900/95 border border-indigo-500/30 rounded-2xl space-y-4">
      <h4 className="font-bold text-sm text-indigo-300">{initialData.id ? 'Edit Skill / Tool' : 'Add New Skill / Tool'}</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input type="text" placeholder="Skill / Tool Name (e.g. React.js, Python, Git)" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
        <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white">
          <option value="Languages">Languages</option>
          <option value="Frameworks">Frameworks</option>
          <option value="Tools">Tools</option>
          <option value="Core CS">Core CS</option>
        </select>
      </div>
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-slate-800 text-xs text-slate-300 rounded-xl">Cancel</button>
        <button type="submit" className="px-4 py-2 bg-indigo-600 text-xs text-white font-semibold rounded-xl">Save Skill</button>
      </div>
    </form>
  );
};

const ProjectForm = ({ initialData, onSave, onCancel, handleFileUpload }) => {
  const [form, setForm] = useState({ title: '', description: '', full_details: '', tags: '', github_url: '', live_url: '', image_url: '', ...initialData });

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="p-5 bg-slate-900/95 border border-indigo-500/30 rounded-2xl space-y-4">
      <h4 className="font-bold text-sm text-indigo-300">{initialData.id ? 'Edit Project' : 'Add New Project'}</h4>
      <input type="text" placeholder="Project Title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
      <textarea rows="2" placeholder="Short Description" required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
      <input type="text" placeholder="Tags (Comma separated e.g. React, Node.js, SQLite)" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input type="text" placeholder="GitHub Repository URL" value={form.github_url} onChange={(e) => setForm({ ...form, github_url: e.target.value })} className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
        <input type="text" placeholder="Live Demo URL" value={form.live_url} onChange={(e) => setForm({ ...form, live_url: e.target.value })} className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
      </div>
      <div className="flex gap-2">
        <input type="text" placeholder="Image URL or upload below" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
        <label className="px-3 py-2 bg-slate-800 text-xs font-medium text-white rounded-xl cursor-pointer flex items-center gap-1">
          <Upload className="w-3.5 h-3.5" /> Upload Image
          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, (url) => setForm({ ...form, image_url: url }))} />
        </label>
      </div>
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-slate-800 text-xs text-slate-300 rounded-xl">Cancel</button>
        <button type="submit" className="px-4 py-2 bg-indigo-600 text-xs text-white font-semibold rounded-xl">Save Project</button>
      </div>
    </form>
  );
};

const CertificateForm = ({ initialData, onSave, onCancel, handleFileUpload }) => {
  const [form, setForm] = useState({
    title: '', issuer: '', issue_date: '', credential_url: '', file_url: '', file_type: 'pdf', description: '', ...initialData
  });

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="p-5 bg-slate-900/95 border border-indigo-500/30 rounded-2xl space-y-4">
      <h4 className="font-bold text-sm text-indigo-300">{initialData.id ? 'Edit Certificate' : 'Add New Certificate'}</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input type="text" placeholder="Certificate Title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
        <input type="text" placeholder="Issuer Organization (e.g. AWS / Meta)" required value={form.issuer} onChange={(e) => setForm({ ...form, issuer: e.target.value })} className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input type="text" placeholder="Issue Date (e.g. 2024-06-15)" value={form.issue_date} onChange={(e) => setForm({ ...form, issue_date: e.target.value })} className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
        <input type="text" placeholder="Verification / Credential URL" value={form.credential_url} onChange={(e) => setForm({ ...form, credential_url: e.target.value })} className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
      </div>
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-emerald-400">Upload Certificate Document / File (PDF or Image)</label>
        <div className="flex gap-2">
          <input type="text" required placeholder="Uploaded file URL" value={form.file_url} onChange={(e) => setForm({ ...form, file_url: e.target.value })} className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
          <label className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white rounded-xl cursor-pointer flex items-center gap-1.5">
            <Upload className="w-3.5 h-3.5" /> Upload File
            <input
              type="file"
              accept=".pdf,image/*"
              className="hidden"
              onChange={(e) => handleFileUpload(e, (url, type) => setForm({ ...form, file_url: url, file_type: type }))}
            />
          </label>
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-slate-800 text-xs text-slate-300 rounded-xl">Cancel</button>
        <button type="submit" className="px-4 py-2 bg-indigo-600 text-xs text-white font-semibold rounded-xl">Save Certificate</button>
      </div>
    </form>
  );
};

export default AdminDashboard;
