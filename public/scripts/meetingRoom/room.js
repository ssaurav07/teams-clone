const socket = io('/')

const myPeer = new Peer({ secure: true, port: 443 })

const videoGrid = document.getElementById('video-grid'); // Grid containing participant videos

// --------------------- Global Variables (current User Infos) -------------------------------------------

let userName = currentUser;
let myStream;
var currPeer;
var myId;
let screenFlag = false;
let screenShareStream;


$(".participants").append(`<li class="message"><b>${userName} (You)</b></li>`); // Adds your name to participant list


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

      addVideoStream(video, userVideoStream, call.peer)
    })
    call.on('close', () => {
      video.remove();
    })
    peers[call.peer] = call;
  })

  // --------------------- Get Ids of people already in meet ------------------------------------

  socket.on('know-my-id', (herObj) => {
    if (herObj.userId == myId) {
      $(".participants").append(`<li class="message"><b id="name" class=${herObj.myId}>${herObj.myName}</b></li>`);
      console.log(herObj.myId, herObj.myName);
    }
  })

  // --------------------- Alerts everyone if someone raises the hand-----------------------------

  socket.on('hand-raise', user => {
    alert(`${user.name} has raised the hand!`)
  })

  // --------------------- ON User Connection -------------------------------------------

  socket.on('user-connected', user => {
    $(".participants").append(`<li class="message"><b id="name" class=${user.userId}>${user.username}</b></li>`);
    currId = user.userId;
    socket.emit('know-my-id', { myId: myId, userId: user.userId, myName: userName });

    
    $(".messages").append(`<li class="newMember"><span id="join_time">${new Date().toLocaleTimeString()}</span> ${user.username} has joined the call!</li>`);
    scrollToBottom();
    

    const fc = () => connectToNewUser(user.userId, stream)
    timerid = setTimeout(fc, 0)

  })


  // --------------------- For Appending Messages to meeting chat----------------------------- //

  socket.on("createMessage", async message => {

    if (dbUserId != message.name) {
      let user = await axios.post(`/user/${message.name}`)
      $(".messages").append(`<li class="message"><b id="name">${user.data.name}</b><br/>${message.text}</li>`);
    }
    else {
      $(".messages").append(`<li class="message"><b id="name">You</b><br/>${message.text}</li>`);
    }

    scrollToBottom()
  })

})

const scrollToBottom = () => {
  var d = $('.main__chat_window');
  d.scrollTop(d.prop("scrollHeight"));
}


// --------------------- ON User Disconnection -------------------------------------------

socket.on('user-disconnected', userId => {
  if (peers[userId]) {
    peers[userId].close()
  }
  var left = document.getElementById(userId);
  if (left) left.parentNode.removeChild(left);
  

  var leftPart = document.getElementsByClassName(userId)[0];
  if (leftPart) leftPart.parentNode.removeChild(leftPart);

  let childCount=Math.ceil((videoGrid.childElementCount)/2);
  console.log(childCount)
  $("video").height(`calc((100% - 45px)/${childCount})`);
})


// --------------------- ON Joining Room -------------------------------------------

myPeer.on('open', id => {
  socket.emit('join-room', roomId, id)
  myId = id;
})


// --------------------- Connecting to new User -------------------------------------------

function connectToNewUser(userId, stream) {
  const call = myPeer.call(userId, stream)
  const video = document.createElement('video')

  call.on('stream', (userVideoStream) => {
    currPeer = call.peerConnection;
    addVideoStream(video, userVideoStream, call.peer)
  })
  call.on('close', () => {
    video.remove();
  })

  if (screenFlag) {
    let videoTrack = screenShareStream.getVideoTracks()[0];
    let sender = call.peerConnection.getSenders().find(function (s) {
      return s.track.kind === "video"
    })
    sender.replaceTrack(videoTrack);
  }
  peers[userId] = call;

}

// --------------------- For Adding new video stream to screen -------------------------------------------

function addVideoStream(video, stream, id) {
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  if (id) video.id = id;
  video.className = "item";
  videoGrid.appendChild(video);

  
  let childCount=Math.ceil((videoGrid.childElementCount)/2);
  console.log(childCount)
  $("video").height(`calc((100% - 45px)/${childCount})`);

  if(videoGrid.childElementCount <=2){
    $('#video-grid').addClass("row row-cols-2 row-cols-sm-2 row-cols-md-2")
  }
  else{
    $('#video-grid').addClass("row row-cols-2 row-cols-sm-2 row-cols-md-3")
  }

}


// --------------------- For Text Messaging during meeting------------------------------------------- //

let text = $("input");

$('input').keydown((e)=>{
  if ((e.which == 13 && text.val().length !== 0)) { // when pressed enter , send message
      sendMessage()
}
}); 

function sendMessage(){
  let msg = {
      text:  text.val(),
      name: dbUserId
  }

  // emits the message to conversations group chat
  socket.emit("add-message-to-server", { activeConversationId: roomId, userId: dbUserId, message: text.val(), fromMeet: true }, () => {

  })

  socket.emit('message', msg);

  text.val('')
}


// --------------------- Detect mobile device ------------------------------------------- //
function detectMob() {
  return ( ( document.documentElement.clientWidth <= 800 ) && ( document.documentElement.clientHeight <= 600 ) );
}