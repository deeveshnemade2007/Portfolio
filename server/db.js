const { Pool } = require('pg');
const path = require('path');
const fs = require('fs');

// =====================================================
// DATABASE CONNECTION
// =====================================================

let db;
let pool;

const usePostgres = !!process.env.DATABASE_URL;

if (usePostgres) {
    console.log('Using PostgreSQL database');

    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    });
} else {
    console.log('Using local SQLite database');

    const sqlite3 = require('sqlite3').verbose();

    const dataDir = path.join(__dirname, 'data');

    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }

    const dbPath = path.join(dataDir, 'portfolio.db');
    db = new sqlite3.Database(dbPath);
}

// =====================================================
// CONVERT SQLite ? PARAMETERS TO PostgreSQL $1, $2...
// =====================================================

const convertPlaceholders = (sql) => {
    let index = 0;

    return sql.replace(/\?/g, () => {
        index++;
        return `$${index}`;
    });
};

// =====================================================
// RUN
// =====================================================

const run = async(sql, params = []) => {
    if (usePostgres) {
        const pgSql = convertPlaceholders(sql);

        const result = await pool.query(pgSql, params);

        let id = null;

        if (result.rows && result.rows[0] && result.rows[0].id) {
            id = result.rows[0].id;
        }

        return {
            id,
            changes: result.rowCount
        };
    }

    return new Promise((resolve, reject) => {
        db.run(sql, params, function(err) {
            if (err) reject(err);
            else resolve({
                id: this.lastID,
                changes: this.changes
            });
        });
    });
};

// =====================================================
// GET ONE ROW
// =====================================================

const get = async(sql, params = []) => {
    if (usePostgres) {
        const pgSql = convertPlaceholders(sql);
        const result = await pool.query(pgSql, params);

        return result.rows[0];
    }

    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
};

// =====================================================
// GET ALL ROWS
// =====================================================

const all = async(sql, params = []) => {
    if (usePostgres) {
        const pgSql = convertPlaceholders(sql);
        const result = await pool.query(pgSql, params);

        return result.rows;
    }

    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};

// =====================================================
// INITIALIZE DATABASE
// =====================================================

const initDB = async() => {

    if (usePostgres) {

        await pool.query(`
      CREATE TABLE IF NOT EXISTS admin (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

        await pool.query(`
      CREATE TABLE IF NOT EXISTS profile (
        id SERIAL PRIMARY KEY,
        full_name TEXT NOT NULL,
        title TEXT NOT NULL,
        bio TEXT NOT NULL,
        phone TEXT,
        email TEXT,
        location TEXT,
        linkedin_url TEXT,
        github_url TEXT,
        avatar_url TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

        await pool.query(`
      CREATE TABLE IF NOT EXISTS education (
        id SERIAL PRIMARY KEY,
        degree TEXT NOT NULL,
        institution TEXT NOT NULL,
        field_of_study TEXT,
        start_year TEXT NOT NULL,
        end_year TEXT NOT NULL,
        marks_type TEXT,
        marks_value TEXT,
        description TEXT,
        sort_order INTEGER DEFAULT 0
      )
    `);

        await pool.query(`
      CREATE TABLE IF NOT EXISTS experience (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        company TEXT NOT NULL,
        location TEXT,
        start_date TEXT NOT NULL,
        end_date TEXT,
        is_current INTEGER DEFAULT 0,
        description TEXT,
        highlights TEXT,
        sort_order INTEGER DEFAULT 0
      )
    `);

        await pool.query(`
      CREATE TABLE IF NOT EXISTS skills (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        sort_order INTEGER DEFAULT 0
      )
    `);

        await pool.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        full_details TEXT,
        tags TEXT NOT NULL,
        github_url TEXT,
        live_url TEXT,
        image_url TEXT,
        featured INTEGER DEFAULT 1,
        sort_order INTEGER DEFAULT 0
      )
    `);

        await pool.query(`
      CREATE TABLE IF NOT EXISTS certificates (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        issuer TEXT NOT NULL,
        issue_date TEXT,
        credential_url TEXT,
        file_url TEXT NOT NULL,
        file_type TEXT DEFAULT 'pdf',
        description TEXT,
        featured INTEGER DEFAULT 1,
        sort_order INTEGER DEFAULT 0
      )
    `);

        await pool.query(`
      CREATE TABLE IF NOT EXISTS resume (
        id SERIAL PRIMARY KEY,
        file_url TEXT NOT NULL,
        filename TEXT NOT NULL,
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_active INTEGER DEFAULT 1
      )
    `);

        await pool.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        sender_name TEXT NOT NULL,
        sender_email TEXT NOT NULL,
        sender_phone TEXT,
        subject TEXT,
        message TEXT NOT NULL,
        is_read INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    } else {

        // SQLite initialization
        await run(`
      CREATE TABLE IF NOT EXISTS admin (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

        await run(`
      CREATE TABLE IF NOT EXISTS profile (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        full_name TEXT NOT NULL,
        title TEXT NOT NULL,
        bio TEXT NOT NULL,
        phone TEXT,
        email TEXT,
        location TEXT,
        linkedin_url TEXT,
        github_url TEXT,
        avatar_url TEXT,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

        await run(`
      CREATE TABLE IF NOT EXISTS education (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        degree TEXT NOT NULL,
        institution TEXT NOT NULL,
        field_of_study TEXT,
        start_year TEXT NOT NULL,
        end_year TEXT NOT NULL,
        marks_type TEXT,
        marks_value TEXT,
        description TEXT,
        sort_order INTEGER DEFAULT 0
      )
    `);

        await run(`
      CREATE TABLE IF NOT EXISTS experience (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        company TEXT NOT NULL,
        location TEXT,
        start_date TEXT NOT NULL,
        end_date TEXT,
        is_current INTEGER DEFAULT 0,
        description TEXT,
        highlights TEXT,
        sort_order INTEGER DEFAULT 0
      )
    `);

        await run(`
      CREATE TABLE IF NOT EXISTS skills (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        sort_order INTEGER DEFAULT 0
      )
    `);

        await run(`
      CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        full_details TEXT,
        tags TEXT NOT NULL,
        github_url TEXT,
        live_url TEXT,
        image_url TEXT,
        featured INTEGER DEFAULT 1,
        sort_order INTEGER DEFAULT 0
      )
    `);

        await run(`
      CREATE TABLE IF NOT EXISTS certificates (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        issuer TEXT NOT NULL,
        issue_date TEXT,
        credential_url TEXT,
        file_url TEXT NOT NULL,
        file_type TEXT DEFAULT 'pdf',
        description TEXT,
        featured INTEGER DEFAULT 1,
        sort_order INTEGER DEFAULT 0
      )
    `);

        await run(`
      CREATE TABLE IF NOT EXISTS resume (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        file_url TEXT NOT NULL,
        filename TEXT NOT NULL,
        uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        is_active INTEGER DEFAULT 1
      )
    `);

        await run(`
      CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sender_name TEXT NOT NULL,
        sender_email TEXT NOT NULL,
        sender_phone TEXT,
        subject TEXT,
        message TEXT NOT NULL,
        is_read INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    }

    console.log('Database tables initialized successfully.');
};

module.exports = {
    db,
    run,
    get,
    all,
    initDB
};