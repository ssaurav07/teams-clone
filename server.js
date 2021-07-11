const express               = require('express');
const app                   = express();
const server                = require('http').Server(app);
const io                    = require('socket.io')(server);
const { v4: uuidV4 }        = require('uuid');  //for generating random Room IDs
const bodyParser            = require('body-parser');
const expressSanitizer      = require('express-sanitizer');
const mongoose              = require('mongoose');
const passport              = require('passport');
const LocalStrategy         = require('passport-local');
const session               = require('express-session');
const flash                 = require('connect-flash');
const methodOverride        = require('method-override');  //for executing PUT requests
const MongoStore            = require('connect-mongo');
const { isLoggedIn }        = require('./middleWares/isLoggedIn');



// ---------------------Importing Database models-------------------------------------- //

const User            = require('./models/user');
const Message         = require("./models/message");
const Conversation    = require("./models/meetConversation");
const SessionManager  = require('./modules/UserSessionModule');

// ---------------------Importing Website Routes-------------------------------------- //

const homePageRoute               = require('./routes/homePageRoute')
const userRoutes                  = require('./routes/userRoutes');
const authRoutes                  = require('./routes/authRoutes');
const userHomeRoute               = require('./routes/userHomeRoute')
const postRoutes                  = require('./routes/postRoutes');
const personalConversationRoutes  = require('./routes/personalConversationRoutes');
const meetConversationRoutes      = require('./routes/meetConversationRoutes');
const messageRoutes               = require('./routes/messageRoutes');
const roomRoutes                  = require('./routes/roomRoutes');
const undefinedPagesRoute         = require('./routes/undefinedPagesRoute')


// ---------------------website host & keys-------------------------------------- //

const port = process.env.PORT || 3000;
// const db_URL = 'mongodb://localhost:27017/msUserDb';
const db_URL = process.env.DB_URL;
require('./0auth/googleAuth');

let inFeedRoute = false;
let username = "";
var sessionManager = new SessionManager()


app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

mongoose.connect(db_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB ready!")
  })
  .catch(err => console.error);

const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
  debug: true
});


app.use(session({
  store: MongoStore.create({ mongoUrl: db_URL }),
  secret: 'notagoodsecret',
  resave: false,
  saveUninitialized: false,
}));

app.use(methodOverride("_method"));
app.use(flash());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer())
app.set('view engine', 'ejs');
app.use('/peerjs', peerServer);

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.inFeedRoute = inFeedRoute;
  res.locals.currentUser = "";
  res.locals.userid = "";
  if (req.isAuthenticated()) {
    res.locals.currentUser = req.user;
    username = req.user.name;
    res.locals.userid = req.user._id;
  }
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
})


passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ---------------------------Using imported Routes------------------------------------- //

app.use(homePageRoute);
app.use(authRoutes);
app.use(userRoutes);
app.use(userHomeRoute);
app.use(postRoutes);
app.use(personalConversationRoutes);
app.use(meetConversationRoutes);
app.use(messageRoutes);
app.use(roomRoutes);
app.use(undefinedPagesRoute);


// ---------------------------Socket Connection----------------------------------------- //

io.on('connection', socket => {

  // -------------------------Socket events for Meeting Room----------------------------- //

  socket.on('join-room', (roomId, userId) => {

    socket.join(roomId)
    let user = { userId: userId, username: username }
    socket.broadcast.to(roomId).emit('user-connected', user);

    socket.on('message', (message) => {
      io.to(roomId).emit('createMessage', message)
    });

    socket.on('know-my-id', (herObj) => {
      socket.broadcast.to(roomId).emit('know-my-id', herObj);
    })

    socket.on('hand-raise', (user) => {
      socket.broadcast.to(roomId).emit('hand-raise', user);
    })

    socket.on('disconnect', () => {
      socket.broadcast.to(roomId).emit('user-disconnected', userId)
    })
  })

  // -------------------------Other global socket events----------------------------- //

  socket.on('message', (message) => {
    io.to(message.roomId).emit('createMessage', message)
  });

  socket.on('login', (data) => {
    sessionManager.setUser(data.username, socket.id);

  })

  socket.on('reconnect', (data) => {
    console.log("reconnected")
  })

  socket.on('disconnect', () => {
    sessionManager.deleteUser(socket.id)
  })

  socket.on('user-reconnected', function () {
    console.log("reconneted")
  });


  socket.on('add-message-to-server', async (data, cb) => {
    const newMessage = new Message({
      conversationId: data.activeConversationId,
      sender: data.userId,
      text: data.message
    });

    try {
      const savedMessage = await newMessage.save();
      sendMessageToParticipants(data)
      cb();
    } catch (err) {
      res.status(500).json(err);
    }
  })

})

// -----------------------send message to conversation participants--------------------------- //

async function sendMessageToParticipants(data) {
  let conversation = await Conversation.findOne({
    roomId: data.activeConversationId
  })

  let members = conversation.members;

  members = members.filter(function (member) {
    if (!data.fromMeet) return member != data.userId;
    else return member;
  })

  members.forEach(member => {


    let user = sessionManager.getUser(member)

    if (user) {

      io.to(user.socketId).emit('newMessage', data);
    }
    else
      console.log("message not sent")
  });


}

server.listen(port);