const Database = require('better-sqlite3');
const bcrypt = require('bcrypt');

const db = new Database('database.sqlite', { verbose: console.log });

const sentencia = db.prepare(`CREATE TABLE IF NOT EXISTS users(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT unique,
    password TEXT,
    role TEXT)`);

sentencia.run();

const insertar = db.prepare(`INSERT or IGNORE INTO users 
    (username, password, role) VALUES (?,?,?)`);

const hashedPwd = bcrypt.hashSync('1234', 10);
insertar.run('admin', hashedPwd, 'admin');

const hashedPwd2 = bcrypt.hashSync('1234', 10);
insertar.run('user', hashedPwd2, 'user');
