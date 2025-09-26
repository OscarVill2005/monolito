const express = require('express')
const cookieParser = require('cookie-parser')
const app = express()
const port = 3000


app.set('view engine', 'ejs')

app.use(express.urlencoded());
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.render('index', {title: "Titulo", name:"Nombre"});
})

isAdmin = (req, res, next) => {
  if (req.cookies && req.cookies.user){
    return next();
  }
  res.redirect('login');
}

isAuth = (req, res, next) => {
  if (req.cookies && req.cookies.user){
    return next();
  }
  res.redirect('login');
}

//gestion vista
app.get('/login', (req, res) => {
  res.render('login')
})

//gestion de los parametros post
app.post('/login', (req, res) => {
  const {user, password} = req.body
  console.log(req.body)

  if(req.body.user === "oscar" && req.body.password === "12345"){
    res.cookie("user", user) // options - js no secure si
    res.redirect("home")
  }else{
    res.status(401).redirect("login")
  }
})

app.get('/home', isAuth, (req, res) => {
  res.render('home')
})

app.get('/logout', isAuth, (req, res) => {
  res.clearCookie('user')
  res.redirect('login')
})

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})

