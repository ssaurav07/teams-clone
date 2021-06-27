const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const { v4: uuidV4 } = require('uuid');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');
const flash = require('connect-flash');
const User = require('./models/user');
const MongoStore = require('connect-mongo');
const {isLoggedIn} = require('./middleWare');
const port = process.env.PORT || 3000;
// const db_URL = 'mongodb://localhost:27017/msUserDb';
const db_URL = 'mongodb+srv://ssquare:ssquare@cluster0.jq82u.mongodb.net/teams-clone?retryWrites=true&w=majority';


mongoose.connect(db_URL,{useNewUrlParser: true, useUnifiedTopology: true})
    .then(() =>{
      console.log("Mongo ready to rock")
    })
    .catch(err => console.error)
    
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
  debug: true
});


app.use(session ({
  store: MongoStore.create({ mongoUrl: db_URL }),
  secret: 'notagoodsecret',
  resave:false,
	saveUninitialized:false,
}));
app.use(flash());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use('/peerjs', peerServer);
app.use(express.static('public'));

app.use(passport.initialize());
app.use(passport.session());

app.use((req,res,next)=>{
  res.locals.currentUser="";
	if(req.isAuthenticated()) res.locals.currentUser = req.user;
	res.locals.error=req.flash("error");
	res.locals.success=req.flash("success");
	next();
})

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Routes 

app.get('/', (req, res) => {
  if(req.isAuthenticated()){
    res.redirect('/explore');
    return;
  }
  res.render('home')
})

app.get('/register', (req, res) => {
  res.render('signup')
})

app.post('/register', async (req, res , next) => {
  const {email,name,username,password} = req.body;
  const user = new User({email,name,username});
  const registeredUser = await User.register(user,password);
  
  req.login(registeredUser , err =>{
      if(err) return next(err);

      res.redirect('/explore');
  });
})

app.get('/login', (req, res) => {
  res.render('signin');
})

app.post('/login', passport.authenticate('local' , {failureFlash: true , failureRedirect:'/login'}),(req, res) => {
  console.log("Logged in successfully!")
  res.redirect('/explore')
})

app.get('/explore', isLoggedIn , (req, res) => {
  res.render('explore')
})

app.get('/logout', (req, res)=>{
  req.logout();
  res.redirect('/');
})

app.get('/room', isLoggedIn , (req, res) => {
  res.redirect(`/${uuidV4()}`)
})

app.get('/:room', isLoggedIn , (req, res) => {
  res.render('room', { roomId: req.params.room })
})

const users = {}
 

io.on('connection', socket => {

  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId)
    socket.broadcast.to(roomId).emit('user-connected', userId)

    socket.on('message', (message) => {
      io.to(roomId).emit('createMessage', message)
  }); 

    socket.on('disconnect', () => {
      socket.broadcast.to(roomId).emit('user-disconnected', userId)
    })
  })
}) 

server.listen(port);