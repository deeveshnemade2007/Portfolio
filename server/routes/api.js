const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { run, get, all } = require('../db');
const { verifyAdminToken } = require('../middleware/auth');

const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
    'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images (JPG, PNG, WEBP, SVG) and document files (PDF) are allowed.'));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 15 * 1024 * 1024 }
});

router.get('/profile', async (req, res) => {
  try {
    const profile = await get('SELECT * FROM profile ORDER BY id DESC LIMIT 1');
    res.json(profile || {});
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

router.get('/education', async (req, res) => {
  try {
    const rows = await all('SELECT * FROM education ORDER BY sort_order ASC, id DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch education records' });
  }
});

router.get('/experience', async (req, res) => {
  try {
    const rows = await all('SELECT * FROM experience ORDER BY sort_order ASC, id DESC');
    const parsed = rows.map(r => ({
      ...r,
      highlights: r.highlights ? JSON.parse(r.highlights) : []
    }));
    res.json(parsed);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch experience records' });
  }
});

router.get('/skills', async (req, res) => {
  try {
    const rows = await all('SELECT * FROM skills ORDER BY category ASC, sort_order ASC, id ASC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch skills' });
  }
});

router.get('/projects', async (req, res) => {
  try {
    const rows = await all('SELECT * FROM projects ORDER BY sort_order ASC, id DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

router.get('/certificates', async (req, res) => {
  try {
    const rows = await all('SELECT * FROM certificates ORDER BY sort_order ASC, id DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch certificates' });
  }
});

router.get('/resume', async (req, res) => {
  try {
    const resume = await get('SELECT * FROM resume WHERE is_active = 1 ORDER BY id DESC LIMIT 1');
    res.json(resume || null);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch resume' });
  }
});

router.post('/messages', async (req, res) => {
  try {
    const { sender_name, sender_email, sender_phone, subject, message } = req.body;
    if (!sender_name || !sender_email || !message) {
      return res.status(400).json({ error: 'Name, email, and message content are required.' });
    }

    const result = await run(`
      INSERT INTO messages (sender_name, sender_email, sender_phone, subject, message)
      VALUES (?, ?, ?, ?, ?)
    `, [sender_name, sender_email, sender_phone || '', subject || 'Portfolio Contact Form', message]);

    res.json({ message: 'Your message has been sent successfully!', id: result.id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send message.' });
  }
});

router.post('/admin/upload', verifyAdminToken, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file was uploaded.' });
  }
  const fileUrl = `/uploads/${req.file.filename}`;
  const isPdf = req.file.mimetype === 'application/pdf';
  res.json({
    message: 'File uploaded successfully',
    file_url: fileUrl,
    filename: req.file.originalname,
    file_type: isPdf ? 'pdf' : 'image'
  });
});

router.put('/admin/profile', verifyAdminToken, async (req, res) => {
  try {
    const { full_name, title, bio, phone, email, location, linkedin_url, github_url, avatar_url } = req.body;
    const existing = await get('SELECT * FROM profile LIMIT 1');

    if (existing) {
      await run(`
        UPDATE profile
        SET full_name = ?, title = ?, bio = ?, phone = ?, email = ?, location = ?, linkedin_url = ?, github_url = ?, avatar_url = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [full_name, title, bio, phone, email, location, linkedin_url, github_url, avatar_url, existing.id]);
    } else {
      await run(`
        INSERT INTO profile (full_name, title, bio, phone, email, location, linkedin_url, github_url, avatar_url)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [full_name, title, bio, phone, email, location, linkedin_url, github_url, avatar_url]);
    }

    const updated = await get('SELECT * FROM profile ORDER BY id DESC LIMIT 1');
    res.json({ message: 'Profile updated successfully!', profile: updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

router.post('/admin/education', verifyAdminToken, async (req, res) => {
  try {
    const { degree, institution, field_of_study, start_year, end_year, marks_type, marks_value, description, sort_order } = req.body;
    const result = await run(`
      INSERT INTO education (degree, institution, field_of_study, start_year, end_year, marks_type, marks_value, description, sort_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [degree, institution, field_of_study, start_year, end_year, marks_type, marks_value, description, sort_order || 0]);

    res.json({ message: 'Education record added', id: result.id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add education record' });
  }
});

router.put('/admin/education/:id', verifyAdminToken, async (req, res) => {
  try {
    const { degree, institution, field_of_study, start_year, end_year, marks_type, marks_value, description, sort_order } = req.body;
    await run(`
      UPDATE education
      SET degree = ?, institution = ?, field_of_study = ?, start_year = ?, end_year = ?, marks_type = ?, marks_value = ?, description = ?, sort_order = ?
      WHERE id = ?
    `, [degree, institution, field_of_study, start_year, end_year, marks_type, marks_value, description, sort_order || 0, req.params.id]);

    res.json({ message: 'Education record updated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update education record' });
  }
});

router.delete('/admin/education/:id', verifyAdminToken, async (req, res) => {
  try {
    await run('DELETE FROM education WHERE id = ?', [req.params.id]);
    res.json({ message: 'Education record deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete education record' });
  }
});

router.post('/admin/experience', verifyAdminToken, async (req, res) => {
  try {
    const { title, company, location, start_date, end_date, is_current, description, highlights, sort_order } = req.body;
    const highlightsJson = Array.isArray(highlights) ? JSON.stringify(highlights) : (highlights || '[]');
    const result = await run(`
      INSERT INTO experience (title, company, location, start_date, end_date, is_current, description, highlights, sort_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [title, company, location, start_date, end_date, is_current ? 1 : 0, description, highlightsJson, sort_order || 0]);

    res.json({ message: 'Experience record added', id: result.id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add experience record' });
  }
});

router.put('/admin/experience/:id', verifyAdminToken, async (req, res) => {
  try {
    const { title, company, location, start_date, end_date, is_current, description, highlights, sort_order } = req.body;
    const highlightsJson = Array.isArray(highlights) ? JSON.stringify(highlights) : (highlights || '[]');
    await run(`
      UPDATE experience
      SET title = ?, company = ?, location = ?, start_date = ?, end_date = ?, is_current = ?, description = ?, highlights = ?, sort_order = ?
      WHERE id = ?
    `, [title, company, location, start_date, end_date, is_current ? 1 : 0, description, highlightsJson, sort_order || 0, req.params.id]);

    res.json({ message: 'Experience record updated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update experience record' });
  }
});

router.delete('/admin/experience/:id', verifyAdminToken, async (req, res) => {
  try {
    await run('DELETE FROM experience WHERE id = ?', [req.params.id]);
    res.json({ message: 'Experience record deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete experience record' });
  }
});

router.post('/admin/skills', verifyAdminToken, async (req, res) => {
  try {
    const { name, category, sort_order } = req.body;
    const result = await run(`
      INSERT INTO skills (name, category, sort_order)
      VALUES (?, ?, ?)
    `, [name, category, sort_order || 0]);

    res.json({ message: 'Skill added', id: result.id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add skill' });
  }
});

router.put('/admin/skills/:id', verifyAdminToken, async (req, res) => {
  try {
    const { name, category, sort_order } = req.body;
    await run(`
      UPDATE skills
      SET name = ?, category = ?, sort_order = ?
      WHERE id = ?
    `, [name, category, sort_order || 0, req.params.id]);

    res.json({ message: 'Skill updated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update skill' });
  }
});

router.delete('/admin/skills/:id', verifyAdminToken, async (req, res) => {
  try {
    await run('DELETE FROM skills WHERE id = ?', [req.params.id]);
    res.json({ message: 'Skill deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete skill' });
  }
});

router.post('/admin/projects', verifyAdminToken, async (req, res) => {
  try {
    const { title, description, full_details, tags, github_url, live_url, image_url, featured, sort_order } = req.body;
    const result = await run(`
      INSERT INTO projects (title, description, full_details, tags, github_url, live_url, image_url, featured, sort_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [title, description, full_details, tags, github_url, live_url, image_url, featured ? 1 : 0, sort_order || 0]);

    res.json({ message: 'Project added', id: result.id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add project' });
  }
});

router.put('/admin/projects/:id', verifyAdminToken, async (req, res) => {
  try {
    const { title, description, full_details, tags, github_url, live_url, image_url, featured, sort_order } = req.body;
    await run(`
      UPDATE projects
      SET title = ?, description = ?, full_details = ?, tags = ?, github_url = ?, live_url = ?, image_url = ?, featured = ?, sort_order = ?
      WHERE id = ?
    `, [title, description, full_details, tags, github_url, live_url, image_url, featured ? 1 : 0, sort_order || 0, req.params.id]);

    res.json({ message: 'Project updated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update project' });
  }
});

router.delete('/admin/projects/:id', verifyAdminToken, async (req, res) => {
  try {
    await run('DELETE FROM projects WHERE id = ?', [req.params.id]);
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

router.post('/admin/certificates', verifyAdminToken, async (req, res) => {
  try {
    const { title, issuer, issue_date, credential_url, file_url, file_type, description, featured, sort_order } = req.body;
    const result = await run(`
      INSERT INTO certificates (title, issuer, issue_date, credential_url, file_url, file_type, description, featured, sort_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [title, issuer, issue_date, credential_url, file_url, file_type || 'pdf', description, featured ? 1 : 0, sort_order || 0]);

    res.json({ message: 'Certificate added', id: result.id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add certificate' });
  }
});

router.put('/admin/certificates/:id', verifyAdminToken, async (req, res) => {
  try {
    const { title, issuer, issue_date, credential_url, file_url, file_type, description, featured, sort_order } = req.body;
    await run(`
      UPDATE certificates
      SET title = ?, issuer = ?, issue_date = ?, credential_url = ?, file_url = ?, file_type = ?, description = ?, featured = ?, sort_order = ?
      WHERE id = ?
    `, [title, issuer, issue_date, credential_url, file_url, file_type || 'pdf', description, featured ? 1 : 0, sort_order || 0, req.params.id]);

    res.json({ message: 'Certificate updated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update certificate' });
  }
});

router.delete('/admin/certificates/:id', verifyAdminToken, async (req, res) => {
  try {
    await run('DELETE FROM certificates WHERE id = ?', [req.params.id]);
    res.json({ message: 'Certificate deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete certificate' });
  }
});

router.post('/admin/resume', verifyAdminToken, async (req, res) => {
  try {
    const { file_url, filename } = req.body;
    if (!file_url || !filename) {
      return res.status(400).json({ error: 'File URL and filename are required.' });
    }

    await run('UPDATE resume SET is_active = 0');

    const result = await run(`
      INSERT INTO resume (file_url, filename, is_active)
      VALUES (?, ?, 1)
    `, [file_url, filename]);

    res.json({ message: 'Resume uploaded and set as active', id: result.id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to set active resume' });
  }
});

router.get('/admin/messages', verifyAdminToken, async (req, res) => {
  try {
    const messages = await all('SELECT * FROM messages ORDER BY id DESC');
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

router.delete('/admin/messages/:id', verifyAdminToken, async (req, res) => {
  try {
    await run('DELETE FROM messages WHERE id = ?', [req.params.id]);
    res.json({ message: 'Message deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

module.exports = router;
