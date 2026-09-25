import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Education from './components/Education';
import Experience from './components/Experience';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Certificates from './components/Certificates';
import Resume from './components/Resume';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AdminLoginModal from './components/admin/AdminLoginModal';
import AdminDashboard from './components/admin/AdminDashboard';

axios.defaults.baseURL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000';

const fallbackProfile = {
  full_name: 'Alex Morgan',
  title: 'Software Engineer & Computer Science Student',
  bio: 'Passionate full-stack developer and computer science student with a strong foundation in building scalable web applications, modern APIs, and intuitive user experiences.',
  phone: '+1 (555) 234-5678',
  email: 'alex.morgan@example.com',
  location: 'San Francisco, CA',
  linkedin_url: 'https://linkedin.com/in/alexmorgan-dev',
  github_url: 'https://github.com/alexmorgan-dev',
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600'
};

const fallbackEducation = [
  {
    id: 1,
    degree: 'Bachelor of Science in Computer Science',
    institution: 'University of Technology',
    field_of_study: 'Computer Science & Engineering',
    start_year: '2021',
    end_year: '2025',
    marks_type: 'CGPA',
    marks_value: '3.92 / 4.00',
    description: "Major in Software Systems & Data Science. Dean's Honor List for 6 consecutive semesters."
  }
];

const fallbackExperience = [
  {
    id: 1,
    title: 'Full Stack Software Engineer Intern',
    company: 'CloudScale Technologies',
    location: 'San Francisco, CA',
    start_date: 'May 2024',
    end_date: 'Aug 2024',
    is_current: 0,
    description: 'Engineered high-concurrency microservices and React dashboards.',
    highlights: [
      'Engineered React + TypeScript analytics dashboard improving page load speed by 35%.',
      'Developed REST & GraphQL endpoints processing over 50,000 requests daily.'
    ]
  }
];

const fallbackSkills = [
  { id: 1, name: 'JavaScript / TypeScript', category: 'Languages' },
  { id: 2, name: 'Python', category: 'Languages' },
  { id: 3, name: 'React.js & Next.js', category: 'Frameworks' },
  { id: 4, name: 'Node.js & Express', category: 'Frameworks' },
  { id: 5, name: 'Tailwind CSS', category: 'Frameworks' },
  { id: 6, name: 'PostgreSQL & SQLite', category: 'Tools' },
  { id: 7, name: 'Git & GitHub', category: 'Tools' },
  { id: 8, name: 'Data Structures & Algorithms', category: 'Core CS' }
];

const fallbackProjects = [
  {
    id: 1,
    title: 'DevConnect - Developer Networking Platform',
    description: 'Full-stack developer platform to showcase projects, collaborate, and share technical articles.',
    tags: 'React, Node.js, Express, PostgreSQL, Tailwind CSS',
    github_url: 'https://github.com/alexmorgan-dev/devconnect',
    live_url: 'https://devconnect-demo.example.com',
    image_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800',
    featured: 1
  }
];

const fallbackCertificates = [
  {
    id: 1,
    title: 'AWS Certified Cloud Practitioner',
    issuer: 'Amazon Web Services',
    issue_date: '2024-06-15',
    credential_url: 'https://aws.amazon.com/verification',
    file_url: 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?auto=format&fit=crop&q=80&w=800',
    file_type: 'image',
    description: 'Demonstrates overall understanding of AWS Cloud platform, security practices, and cloud architecture.'
  }
];

const getInitialState = (key, fallback) => {
  try {
    const saved = localStorage.getItem(`portfolio_user_${key}`);
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return fallback;
};

function App() {
  const [profile, setProfile] = useState(() => getInitialState('profile', fallbackProfile));
  const [education, setEducation] = useState(() => getInitialState('education', fallbackEducation));
  const [experience, setExperience] = useState(() => getInitialState('experience', fallbackExperience));
  const [skills, setSkills] = useState(() => getInitialState('skills', fallbackSkills));
  const [projects, setProjects] = useState(() => getInitialState('projects', fallbackProjects));
  const [certificates, setCertificates] = useState(() => getInitialState('certificates', fallbackCertificates));
  const [resume, setResume] = useState(() => getInitialState('resume', null));

  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('portfolio_token') || null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);

  useEffect(() => {
    if (token) {
      setIsAdminLoggedIn(true);
      if (!token.startsWith('local_')) {
        axios.get('/api/auth/verify', { headers: { Authorization: `Bearer ${token}` } })
          .catch(() => {});
      }
    } else {
      setIsAdminLoggedIn(false);
    }
  }, [token]);

  const saveToStorage = (key, val) => {
    try {
      localStorage.setItem(`portfolio_user_${key}`, JSON.stringify(val));
    } catch (e) {}
  };

  const fetchAllData = async () => {
    try {
      const [profRes, eduRes, expRes, skillRes, projRes, certRes, resRes] = await Promise.all([
        axios.get('/api/profile'),
        axios.get('/api/education'),
        axios.get('/api/experience'),
        axios.get('/api/skills'),
        axios.get('/api/projects'),
        axios.get('/api/certificates'),
        axios.get('/api/resume')
      ]);

      if (profRes.data && Object.keys(profRes.data).length > 0) {
        setProfile(profRes.data);
        saveToStorage('profile', profRes.data);
      }
      if (Array.isArray(eduRes.data)) {
        setEducation(eduRes.data);
        saveToStorage('education', eduRes.data);
      }
      if (Array.isArray(expRes.data)) {
        setExperience(expRes.data);
        saveToStorage('experience', expRes.data);
      }
      if (Array.isArray(skillRes.data)) {
        setSkills(skillRes.data);
        saveToStorage('skills', skillRes.data);
      }
      if (Array.isArray(projRes.data)) {
        setProjects(projRes.data);
        saveToStorage('projects', projRes.data);
      }
      if (Array.isArray(certRes.data)) {
        setCertificates(certRes.data);
        saveToStorage('certificates', certRes.data);
      }
      if (resRes.data) {
        setResume(resRes.data);
        saveToStorage('resume', resRes.data);
      }
    } catch (err) {
      console.log('Backend server not connected. Using locally saved user state.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleUpdateData = (type, itemData, action = 'edit') => {
    if (type === 'profile') {
      setProfile(itemData);
      saveToStorage('profile', itemData);
      return;
    }
    if (type === 'resume') {
      setResume(itemData);
      saveToStorage('resume', itemData);
      return;
    }

    const stateMap = {
      education: [education, setEducation],
      experience: [experience, setExperience],
      skills: [skills, setSkills],
      projects: [projects, setProjects],
      certificates: [certificates, setCertificates]
    };

    if (!stateMap[type]) return;
    const [currentList, setList] = stateMap[type];

    let newList = [];
    if (action === 'delete') {
      newList = currentList.filter(item => item.id !== itemData);
    } else if (action === 'add') {
      const newItem = { ...itemData, id: itemData.id || Date.now() };
      newList = [newItem, ...currentList];
    } else {
      newList = currentList.map(item => item.id === itemData.id ? { ...item, ...itemData } : item);
    }

    setList(newList);
    saveToStorage(type, newList);
  };

  const handleLoginSuccess = (newToken) => {
    setToken(newToken);
    setIsAdminLoggedIn(true);
    setIsAdminDashboardOpen(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('portfolio_token');
    setToken(null);
    setIsAdminLoggedIn(false);
    setIsAdminDashboardOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
        <p className="text-sm font-semibold tracking-wide text-slate-400">Loading Portfolio CMS...</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen relative selection:bg-indigo-500 selection:text-white">
      <Navbar
        profile={profile}
        isAdminLoggedIn={isAdminLoggedIn}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onOpenAdmin={() => setIsAdminDashboardOpen(true)}
        onLogout={handleLogout}
      />

      <main>
        <Hero profile={profile} resume={resume} />
        <Education education={education} />
        <Experience experience={experience} />
        <Skills skills={skills} />
        <Projects projects={projects} />
        <Certificates certificates={certificates} />
        <Resume resume={resume} />
        <Contact profile={profile} />
      </main>

      <Footer profile={profile} onOpenLogin={() => setIsLoginModalOpen(true)} />

      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {isAdminLoggedIn && (
        <AdminDashboard
          isOpen={isAdminDashboardOpen}
          onClose={() => setIsAdminDashboardOpen(false)}
          token={token}
          onRefreshData={fetchAllData}
          onUpdateData={handleUpdateData}
          profile={profile}
          education={education}
          experience={experience}
          skills={skills}
          projects={projects}
          certificates={certificates}
          resume={resume}
        />
      )}
    </div>
  );
}

export default App;
