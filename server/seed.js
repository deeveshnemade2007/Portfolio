const bcrypt = require('bcryptjs');
const { run, get, initDB } = require('./db');

const seedDatabase = async () => {
  try {
    await initDB();

    const adminExists = await get('SELECT * FROM admin WHERE username = ?', ['admin']);
    if (!adminExists) {
      const passwordHash = await bcrypt.hash('admin123', 10);
      await run('INSERT INTO admin (username, password_hash) VALUES (?, ?)', ['admin', passwordHash]);
      console.log('Default Admin created: username="admin", password="admin123"');
    }

    const profileExists = await get('SELECT * FROM profile LIMIT 1');
    if (!profileExists) {
      await run(`
        INSERT INTO profile (full_name, title, bio, phone, email, location, linkedin_url, github_url, avatar_url)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        'Alex Morgan',
        'Software Engineer & Computer Science Student',
        'Passionate full-stack developer and computer science student with a strong foundation in building scalable web applications, modern APIs, and intuitive user experiences.',
        '+1 (555) 234-5678',
        'alex.morgan@example.com',
        'San Francisco, CA',
        'https://linkedin.com/in/alexmorgan-dev',
        'https://github.com/alexmorgan-dev',
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600'
      ]);
      console.log('Profile seeded.');
    }

    const eduCount = await get('SELECT COUNT(*) as count FROM education');
    if (eduCount.count === 0) {
      await run(`
        INSERT INTO education (degree, institution, field_of_study, start_year, end_year, marks_type, marks_value, description, sort_order)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        'Bachelor of Science in Computer Science',
        'University of Technology',
        'Computer Science & Engineering',
        '2021',
        '2025',
        'CGPA',
        '3.92 / 4.00',
        'Major in Software Systems & Data Science. Dean\'s Honor List for 6 consecutive semesters.',
        1
      ]);
      console.log('Education seeded.');
    }

    const expCount = await get('SELECT COUNT(*) as count FROM experience');
    if (expCount.count === 0) {
      await run(`
        INSERT INTO experience (title, company, location, start_date, end_date, is_current, description, highlights, sort_order)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        'Full Stack Software Engineer Intern',
        'CloudScale Technologies',
        'San Francisco, CA',
        'May 2024',
        'Aug 2024',
        0,
        'Engineered high-concurrency microservices and React dashboards.',
        JSON.stringify([
          'Engineered React + TypeScript analytics dashboard improving page load speed by 35%.',
          'Developed REST & GraphQL endpoints processing over 50,000 requests daily.'
        ]),
        1
      ]);
      console.log('Experience seeded.');
    }

    const skillCount = await get('SELECT COUNT(*) as count FROM skills');
    if (skillCount.count === 0) {
      const skillsData = [
        { name: 'JavaScript / TypeScript', category: 'Languages', sort: 1 },
        { name: 'Python', category: 'Languages', sort: 2 },
        { name: 'React.js & Next.js', category: 'Frameworks', sort: 3 },
        { name: 'Node.js & Express', category: 'Frameworks', sort: 4 },
        { name: 'Tailwind CSS', category: 'Frameworks', sort: 5 },
        { name: 'PostgreSQL & SQLite', category: 'Tools', sort: 6 },
        { name: 'Git & GitHub', category: 'Tools', sort: 7 },
        { name: 'Data Structures & Algorithms', category: 'Core CS', sort: 8 }
      ];
      for (const s of skillsData) {
        await run(`
          INSERT INTO skills (name, category, sort_order)
          VALUES (?, ?, ?)
        `, [s.name, s.category, s.sort]);
      }
      console.log('Skills seeded.');
    }

    const projectCount = await get('SELECT COUNT(*) as count FROM projects');
    if (projectCount.count === 0) {
      await run(`
        INSERT INTO projects (title, description, full_details, tags, github_url, live_url, image_url, featured, sort_order)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        'DevConnect - Developer Networking Platform',
        'Full-stack developer platform to showcase projects, collaborate, and share technical articles.',
        'Built with React, Node.js, Express, and PostgreSQL. Features real-time messaging and GitHub API integration.',
        'React, Node.js, Express, PostgreSQL, Tailwind CSS',
        'https://github.com/alexmorgan-dev/devconnect',
        'https://devconnect-demo.example.com',
        'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800',
        1,
        1
      ]);
      console.log('Projects seeded.');
    }

    const certCount = await get('SELECT COUNT(*) as count FROM certificates');
    if (certCount.count === 0) {
      await run(`
        INSERT INTO certificates (title, issuer, issue_date, credential_url, file_url, file_type, description, featured, sort_order)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        'AWS Certified Cloud Practitioner',
        'Amazon Web Services',
        '2024-06-15',
        'https://aws.amazon.com/verification',
        'https://images.unsplash.com/photo-1589330694653-ded6df03f754?auto=format&fit=crop&q=80&w=800',
        'image',
        'Demonstrates overall understanding of AWS Cloud platform, security practices, and cloud architecture.',
        1,
        1
      ]);
      console.log('Certificates seeded.');
    }

    console.log('Database seeding process completed.');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
