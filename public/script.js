const socket = io('/')
// const myPeer = new Peer({host:'peerjs-server.herokuapp.com', secure:true, port:443})
const myPeer = new Peer({secure:true, port:443})

const videoGrid =  document.getElementById('video-grid'); // Grid containing participant videos


// --------------------- Global Variables (current User Infos) -------------------------------------------

let userName = currentUser;
let myStream;
var currPeer;
var perm;
var myId;
var participants = [];



$(".participants").append(`<li class="message"><b>${userName} (You)</b></li>`); // Adds your name to participant box


// --------------------- Create your video  -------------------------------------------

const myVideo = document.createElement('video')
myVideo.muted = true
const peers = {}
navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  myStream = stream;
  addVideoStream(myVideo, stream)

// --------------------- Answer Calls -------------------------------------------

  myPeer.on('call', call => {
    call.answer(stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {      
      currPeer = call.peerConnection;

      addVideoStream(video, userVideoStream , call.peer)
    })
  })

// --------------------- Get Ids of people already in meet -------------------------------------------

  socket.on('know-my-id',(herObj)=>{
    if(herObj.userId == myId){
      participants.push(herObj.myId);
      $(".participants").append(`<li class="message"><b id="name" class=${herObj.myId}>${herObj.myName}</b></li>`);
      console.log(herObj.myId,herObj.myName);
    }
   
  })
  
  // --------------------- ON User Connection -------------------------------------------

  socket.on('user-connected', user => {
    $(".participants").append(`<li class="message"><b id="name" class=${user.userId}>${user.username}</b></li>`);
    currId=user.userId;
    socket.emit('know-my-id',{myId: myId,userId: user.userId,myName:userName});

    // alert(user.username + " has joined the call!")
    console.log('New User Connected: ' + user.userId + user.username);

    const fc = () => connectToNewUser(user.userId, stream)
    timerid = setTimeout(fc, 0 )
       
  })


  // --------------------- For Text Messaging -------------------------------------------

  let text = $("input");
  // when press enter send message
  $('html').keydown(function (e) {
    if (e.which == 13 && text.val().length !== 0) {

      let msg = {
        text : text.val(), 
        name : userName
      }

      socket.emit('message',msg);
      text.val('')
    }
  });
  socket.on("createMessage", message => {
    $(".messages").append(`<li class="message"><b id="name">${message.name}</b><br/>${message.text}</li>`);
    scrollToBottom()
  })

})

const scrollToBottom = () => {
  var d = $('.main__chat_window');
  d.scrollTop(d.prop("scrollHeight"));
}


// --------------------- ON User Disconnection -------------------------------------------

socket.on('user-disconnected', userId => {
  if (peers[userId]){
    peers[userId].close()
  }
  var left = document.getElementById(userId);
    console.log(left);
    if(left) left.parentNode.removeChild(left);
    console.log("child removed");

  var leftPart = document.getElementsByClassName(userId)[0];
    console.log(leftPart);
    if(leftPart) leftPart.parentNode.removeChild(leftPart);
    console.log("child removed");
})


// --------------------- ON Joining Room -------------------------------------------

myPeer.on('open', id => {
  socket.emit('join-room', ROOM_ID, id)
  myId = id;
})


// --------------------- Connecting to new User -------------------------------------------

function connectToNewUser(userId, stream) {
  const call = myPeer.call(userId, stream)
  const video = document.createElement('video')
  call.on('stream', (userVideoStream) => {
    currPeer = call.peerConnection;
    addVideoStream(video, userVideoStream , call.peer)
  })
  call.on('close', () => {
    video.remove();
  })

  peers[userId] = call;

}

// --------------------- For Adding new video stream to screen -------------------------------------------

function addVideoStream(video, stream , id) {
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  if(id) video.id=id;
  videoGrid.appendChild(video);
}
