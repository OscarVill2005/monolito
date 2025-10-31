const express = require('express');
const cookieParser = require('cookie-parser');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const path = require('path');
require('dotenv').config();

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
// eslint-disable-next-line no-undef
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

const pool = new Pool({
    // eslint-disable-next-line no-undef
  host: process.env.DB_HOST || 'dreamy_buck',
    // eslint-disable-next-line no-undef
  port: process.env.DB_PORT || 5432,
  // eslint-disable-next-line no-undef
  database: process.env.DB_NAME || 'monolito',
    // eslint-disable-next-line no-undef
  user: process.env.DB_USER || 'postgres',
    // eslint-disable-next-line no-undef
  password: process.env.DB_PASSWORD || 'Rumbo2005',
});

function isAdmin(req, res, next) {
  if (req.cookies.user && req.cookies.role === 'admin') return next();
  return res.redirect('/');
}

function isUser(req, res, next) {
  if (req.cookies.user && req.cookies.role === 'user') return next();
  return res.redirect('/');
}

//function isAuth(req, res, next) {
  //if (req.cookies.user) return next();
  //return res.redirect('/');
//}

app.get('/', (req, res) => {
  console.log('login page');
  res.render('login');
});
app.get('/home', isUser, (req, res) =>
  res.render('home', { user: req.cookies.user }),
);
app.get('/admin', isAdmin, (req, res) =>
  res.render('admin', { user: req.cookies.user }),
);

app.get('/registro', (req, res) => {
  console.log('registro page');
  res.render('registro');
});

app.get('/logout', (req, res) => {
  res.clearCookie('user');
  res.clearCookie('role');
  console.log('logged out');
  res.redirect('/');
});

app.post('/login', async (req, res) => {
  const { user, password } = req.body;
  try {
    const result = await pool.query(
      'SELECT username, password, role FROM users WHERE username = $1',
      [user],
    );

    const dbuser = result.rows[0];
    if (!dbuser) {
      console.log('Usuario no encontrado');
      return res.redirect('/');
    }

    const ok = await bcrypt.compare(password, dbuser.password);
    if (!ok) {
      console.log('Contraseña incorrecta');
      return res.redirect('/');
    }

    res.cookie('user', dbuser.username, { httpOnly: true });
    res.cookie('role', dbuser.role, { httpOnly: true });

    console.log(`${dbuser.role} logged in`);
    return res.redirect(dbuser.role === 'admin' ? '/admin' : '/home');
  } catch (err) {
    console.error('Login error:', err);
    return res.redirect('/');
  }
});

app.post('/registro', async (req, res) => {
  const { user, password } = req.body;
  try {
    pool.query(
      'INSERT INTO users (username, password, role) VALUES ($1, $2, $3)',
      [user, await bcrypt.hash(password, 10), 'user'],
    );
    console.log('Usuario registrado');
    return res.redirect('/');
  } catch (err) {
    console.error('Registro error:', err);
    return res.redirect('/registro');
  }
});

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
  console.log('Usuarios de prueba: admin/adminpass y user/userpass');
});
