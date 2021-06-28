const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const { v4: uuidV4 } = require('uuid');
const bodyParser = require('body-parser');
const expressSanitizer = require('express-sanitizer');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const User = require('./models/user');
const MongoStore = require('connect-mongo');
const {isLoggedIn} = require('./middleWare');
const port = process.env.PORT || 3000;
// const db_URL = 'mongodb://localhost:27017/msUserDb';
const db_URL = 'mongodb+srv://ssquare:ssquare@cluster0.jq82u.mongodb.net/teams-clone?retryWrites=true&w=majority';

let flag=false;

app.use(express.static('public'));

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

app.use(methodOverride("_method"));
app.use(flash());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer())
app.set('view engine', 'ejs');
app.use('/peerjs', peerServer);

app.use(passport.initialize());
app.use(passport.session());

app.use((req,res,next)=>{
  res.locals.flag=flag;
  res.locals.currentUser="";
	if(req.isAuthenticated()) res.locals.currentUser = req.user;
	res.locals.error=req.flash("error");
	res.locals.success=req.flash("success");
	next();
})

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


var post = mongoose.model("post",{
	title : String,
	image : String,
	description : String,
	author : {type:String , default:"{currentUser.name}"},
	date : {type:Date , default:Date.now}	
})


// Routes 

app.get('/', (req, res) => {
  flag=false;
  if(req.isAuthenticated()){
    res.redirect('/explore');
    return;
  }
  res.render('home')
})

app.get('/register', (req, res) => {
  res.render('signup');
})

app.post('/register', async (req, res , next) => {
  const {email,name,username,password} = req.body;
  const user = new User({email,name,username});
  const registeredUser = await User.register(user,password);
  
  req.login(registeredUser , err =>{
      if(err) return next(err);
      req.flash('success',"Welcome to MS Teams! You're all set to rock!");
      res.redirect('/explore');
  });
})

app.get('/login', (req, res) => {
  res.render('signin');
})

app.post('/login', passport.authenticate('local' , {failureFlash: true , failureRedirect:'/login'}),(req, res) => {
  req.flash('success',"Logged in successfully!");
  res.redirect('/explore')
})

app.get('/explore', isLoggedIn , (req, res) => {
  flag=false;
  res.render('explore')
})

app.get('/logout', (req, res)=>{
  req.flash('error',"Logged out successfully!");
  req.logout();
  res.redirect('/');
})

// Feed Routes

app.get('/feed', isLoggedIn ,(req, res)=>{
  if(flag===true){
    post.find({},(err,posts)=>{
      if(err){
        console.log(err);
      }
      else{
        flag=true;
        res.render("feed", {posts : posts});
      }
    });
  }
  else{
    flag=true;
    res.redirect('/feed');
  }
  
})

app.post('/feed', isLoggedIn ,(req, res)=>{
  req.body.posts.description = req.sanitize(req.body.posts.description);
  post.create(req.body.posts , (err,response)=>{
		if(err){
			console.log(err);
		}
		else{
			res.redirect("/feed");
		}
	})
})

app.get('/feed/new', isLoggedIn ,(req, res)=>{
  res.render('newPost');
})

app.get("/post/show/:id" , isLoggedIn , (req,res)=>{
	post.findById(req.params.id , (err , show)=>{
		if(err){
			console.log(err)
		}
		else{
		res.render("show" , {post : show });
		}
	});
});

app.get("/post/edit/:id", isLoggedIn , (req,res)=>{
	post.findById(req.params.id , (err,post)=>{
		if(err){
			console.log(err);
		}
		else{
			res.render("edit" , {post : post});
		}
	});
});

app.put("/post/:id", isLoggedIn , (req,res)=>{
  req.body.posts.description = req.sanitize(req.body.posts.description);
	post.findByIdAndUpdate(req.params.id , req.body.posts ,(err , post)=>{
		if(err){
			res.redirect("/post");
		}
		else{
			res.redirect("/post/show/"+req.params.id);
		}
	})	
});

app.delete("/post/:id" , isLoggedIn, (req,res)=>{
	post.findByIdAndRemove(req.params.id , (err,post)=>{
		if(err){
			res.redirect("/feed");
		}
		else{
			res.redirect("/feed");
		}
	})
});

// Room Routes
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

    socket.on('know-my-id', (herObj)=>{
      socket.broadcast.to(roomId).emit('know-my-id', herObj);
    })

    socket.on('disconnect', () => {
      socket.broadcast.to(roomId).emit('user-disconnected', userId)
    })
  })
}) 

server.listen(port);