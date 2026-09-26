# 🌟 Modern Personal Portfolio Website & Admin CMS

A modern, responsive personal portfolio website with a built-in secure **Admin Dashboard / CMS** designed for students and professionals. Manage personal bio, contact channels (Phone, LinkedIn, GitHub), education & marks, work experience, skills, projects, certificates (with file upload), resume, and visitor messages without modifying source code.

---

## ✨ Features

- **Personal Bio & Contact**: Phone number, LinkedIn, GitHub, Email, Location, and interactive contact message form.
- **Academic Marks & Results**: Showcases degrees, institution, CGPA / Percentage scores, semester honors, and coursework.
- **Work Experience & Internships**: Timeline layout detailing roles, duration, current role badges, and bullet-point achievements.
- **Skills & Technical Stack**: Categorized skill cards with proficiency percentage bars and category filter tabs.
- **Projects Showcase**: Interactive project cards with tech stack badges, GitHub repo links, live demo links, and screenshot viewer modals.
- **Certificates & Verification**: Supports uploading certificate documents (PDFs & Images), credential verification links, an interactive modal file viewer, and direct download buttons.
- **Resume Showcase**: Features an embedded PDF resume viewer modal and quick download button.
- **Secure Admin CMS**: Password-protected dashboard with tabs for managing all portfolio content dynamically.

---

## 🛠️ Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Lucide React, Framer Motion, Axios
- **Backend**: Node.js, Express.js
- **Database**: SQLite (`portfolio.db`) with `sqlite3`
- **Authentication**: `jsonwebtoken` & `bcryptjs`
- **File Storage**: `multer` with file filtering for PDFs and Images

---

## 🚀 Quick Start

### 1. Clone Repository
```bash

git clone https://github.com/deeveshnemade2007/portfolio-cms.git

cd portfolio-cms

```

### 2. Install Dependencies
```bash

\\# Install Server Dependencies

cd server

npm install



\\# Install Client Dependencies

cd ../client

npm install

```

### 3. Run Application
```bash

\\# Build Frontend

cd client

npm run build



\\# Start Backend Server

cd ../server

npm start

```

Access the application in your browser at `http://localhost:5000`.

---

## 📄 License
MIT License
