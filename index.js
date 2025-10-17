const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const Database = require('better-sqlite3');
const bcrypt = require('bcrypt');
const db = new Database('database.sqlite', { verbose: console.log });
const port = 3000;

app.set('view engine', 'ejs');

app.use(express.urlencoded());
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.render('index', { title: 'Titulo', name: 'Nombre' });
});

const isAdmin = (req, res, next) => {
  if (req.cookies && req.cookies.user && req.cookies.role == 'admin') {
    return next();
  }
  res.redirect('login');
}

const isAuth = (req, res, next) => {
  if (req.cookies && req.cookies.user && req.cookies.role == 'user') {
    return next();
  }
  res.redirect('login');
};

//gestion vista
app.get('/login', (req, res) => {
  res.render('login');
});

//gestion de los parametros post
app.post('/login', (req, res) => {
  const { user, password } = req.body;
  console.log(req.body);

  const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
  const dbUser = stmt.get(user);

  if (dbUser && bcrypt.compareSync(password, dbUser.password)) {
    res.cookie('user', dbUser.username);
    res.cookie('role', dbUser.role);
    if (dbUser.role === 'admin') {
      res.redirect('admin');
    } else {
      res.redirect('home');
    }
  } else {
    res.status(401).redirect('login');
  }
});

app.get('/home', isAuth, (req, res) => {
  res.render('home');
});

app.get('/admin', isAdmin, (req, res) => {
  res.render('admin');
});

app.get('/logout', isAuth, isAdmin, (req, res) => {
  res.clearCookie('role');
  res.clearCookie('user');
  res.redirect('login');
});

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});
