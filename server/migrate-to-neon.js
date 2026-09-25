const sqlite3 = require('sqlite3').verbose();
const { Pool } = require('pg');
const path = require('path');

const sqlitePath = path.join(__dirname, 'data', 'portfolio.db');

if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL is not set.');
    console.error('Make sure your Neon connection string is available.');
    process.exit(1);
}

const sqlite = new sqlite3.Database(sqlitePath);

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

const getAll = (table) => {
    return new Promise((resolve, reject) => {
        sqlite.all(`SELECT * FROM ${table}`, [], (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};

const tables = [
    'admin',
    'profile',
    'education',
    'experience',
    'skills',
    'projects',
    'certificates',
    'resume',
    'messages'
];

const migrateTable = async(table) => {
    const rows = await getAll(table);

    if (rows.length === 0) {
        console.log(`ℹ️ ${table}: no records found`);
        return;
    }

    for (const row of rows) {
        const columns = Object.keys(row);
        const values = Object.values(row);

        const columnNames = columns.map(column => `"${column}"`).join(', ');
        const placeholders = values.map((_, index) => `$${index + 1}`).join(', ');

        const sql = `
      INSERT INTO "${table}" (${columnNames})
      VALUES (${placeholders})
      ON CONFLICT DO NOTHING
    `;

        await pool.query(sql, values);
    }

    console.log(`✅ ${table}: ${rows.length} record(s) migrated`);
};

const main = async() => {
    try {
        console.log('==============================================');
        console.log('SQLite → Neon PostgreSQL Migration');
        console.log('==============================================');

        // Create the PostgreSQL tables first.
        await pool.query(`
      CREATE TABLE IF NOT EXISTS admin (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

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
      );

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
      );

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
      );

      CREATE TABLE IF NOT EXISTS skills (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        sort_order INTEGER DEFAULT 0
      );

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
      );

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
      );

      CREATE TABLE IF NOT EXISTS resume (
        id SERIAL PRIMARY KEY,
        file_url TEXT NOT NULL,
        filename TEXT NOT NULL,
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_active INTEGER DEFAULT 1
      );

      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        sender_name TEXT NOT NULL,
        sender_email TEXT NOT NULL,
        sender_phone TEXT,
        subject TEXT,
        message TEXT NOT NULL,
        is_read INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

        console.log('✅ PostgreSQL tables ready');

        for (const table of tables) {
            await migrateTable(table);
        }

        console.log('==============================================');
        console.log('🎉 Migration completed successfully!');
        console.log('==============================================');

    } catch (error) {
        console.error('❌ Migration failed:');
        console.error(error);
    } finally {
        await sqlite.close();
        await pool.end();
    }
};

main();