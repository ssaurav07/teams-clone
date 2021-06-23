const socket = io('/')
const myPeer = new Peer({host:'peerjs-server.herokuapp.com', secure:true, port:443})

const videoGrid =  document.getElementById('video-grid');
const muteAudio = document.getElementById('mute-mic');
const muteVideo = document.getElementById('mute-vid');
const shareScreen = document.getElementById('share-screen');

muteAudio.onclick = function() { muteMic() }
muteVideo.onclick = function() { muteCam() }
shareScreen.onclick = function() { screenShare() }

let myStream;
var currPeer;

const myVideo = document.createElement('video')
myVideo.muted = true
const peers = {}
navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  myStream = stream;
  addVideoStream(myVideo, stream)

  myPeer.on('call', call => {
    call.answer(stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      currPeer = call.peerConnection
      addVideoStream(video, userVideoStream)
    })
  })

//   socket.on('user-connected', userId => {
//     connectToNewUser(userId, stream)
//   })
  socket.on('user-connected', userId => {
    currId=userId;
    console.log('New User Connected: ' + userId)
    const fc = () => connectToNewUser(userId, stream)
    timerid = setTimeout(fc, 0 )
    })
    
    let text = $("input");
  // when press enter send message
  $('html').keydown(function (e) {
    if (e.which == 13 && text.val().length !== 0) {
      socket.emit('message', text.val());
      text.val('')
    }
  });
  socket.on("createMessage", message => {
    $("ul").append(`<li class="message"><b>user</b><br/>${message}</li>`);
    scrollToBottom()
  })

})

const scrollToBottom = () => {
  var d = $('.main__chat_window');
  d.scrollTop(d.prop("scrollHeight"));
}


socket.on('user-disconnected', userId => {
  if (peers[userId]){
    peers[userId].close()
  }
})

myPeer.on('open', id => {
  socket.emit('join-room', ROOM_ID, id)
})


function connectToNewUser(userId, stream) {
  const call = myPeer.call(userId, stream)
  const video = document.createElement('video')
  call.on('stream', userVideoStream => {
    currPeer = call.peerConnection
    addVideoStream(video, userVideoStream)
  })
  call.on('close', () => {
    video.remove();
  })

  peers[userId] = call
}

function addVideoStream(video, stream) {
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  
  // video.className="col";
  videoGrid.appendChild(video);
  // let count = (90/videoGrid.childElementCount);
  // var h = count.toString();
  // console.log(count);
  // video.style.height = h+"vh";
}

function muteMic() {
  myStream.getAudioTracks().forEach(track => track.enabled = !track.enabled);
  let ih = document.getElementById("mute-mic");
  if(ih.innerHTML==='<i class="fas fa-microphone-slash"></i>'){
    ih.innerHTML='<i class="fas fa-microphone"></i>';
  }
  else{
    ih.innerHTML='<i class="fas fa-microphone-slash"></i>';
  }

}

function muteCam() {
  myStream.getVideoTracks().forEach(track => track.enabled = !track.enabled);
  let ih = document.getElementById("mute-vid");
  if(ih.innerHTML==='<i class="fas fa-video-slash"></i>'){
    ih.innerHTML='<i class="fas fa-video"></i>';
  }
  else{
    ih.innerHTML='<i class="fas fa-video-slash"></i>';
  }
}


// For screen sharing ,f

function screenShare (){
  navigator.mediaDevices.getDisplayMedia({
    video: {
      cursor : "always"
    },
    audio: {
      echoCancellation : true,
      noiseSuppression : true
    }
  }).then((stream)=>{
    let videoTrack = stream.getVideoTracks()[0];
    let sender = currPeer.getSenders().find( function(s){
      return s.track.kind === "video"
    })
    sender.replaceTrack(videoTrack);
  }).catch((err)=>{
    console.log("unable to display media" + err);
  })
}

//Picture IN Picture 
var pip = document.getElementById("pipButtonElement");

pip.addEventListener('click', async function() {
  pip.disabled = true;

  try {
    await myVideo.requestPictureInPicture();
  }
  catch(error) {
    // TODO: Show error message to user.
    console.log("error",error);
  }
  finally {
    pipButtonElement.disabled = false;
  }
})