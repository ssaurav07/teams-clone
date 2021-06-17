const socket = io('/')
const videoGrid =  document.getElementById('video-grid');
var i=-1;
var k=0;
var j=0;

myPeer = new Peer({host:'peerjs-server.herokuapp.com', secure:true, port:443})

const myVideo = document.createElement('video')
myVideo.muted = true
const peers = {}
navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  addVideoStream(myVideo, stream)

  myPeer.on('call', call => {
    call.answer(stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream)
    })
  })

//   socket.on('user-connected', userId => {
//     connectToNewUser(userId, stream)
//   })
  socket.on('user-connected', userId => {
    console.log('New User Connected: ' + userId)
    const fc = () => connectToNewUser(userId, stream)
    timerid = setTimeout(fc, 300 )
    })
    // })
})

socket.on('user-disconnected', userId => {
  if (peers[userId]) peers[userId].close()
})

myPeer.on('open', id => {
  socket.emit('join-room', ROOM_ID, id)
})

function connectToNewUser(userId, stream) {
  const call = myPeer.call(userId, stream)
  const video = document.createElement('video')
  call.on('stream', userVideoStream => {
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

  if(videoGrid.childElementCount===0 || k>5){
    var node=document.createElement("div");    
    node.className = "vidCon row"; 
    videoGrid.appendChild(node);
    i+=1;
    if(i==0) k=1;
    else k=0;
  }
  
  videoGrid.children[i].appendChild(video);
  video.className=`col-4 rounded-mg vidClass`;
  k+=1;
  
}

function muteMic() {
  myStream.getAudioTracks().forEach(track => track.enabled = !track.enabled);
}

function muteCam() {
  myStream.getVideoTracks().forEach(track => track.enabled = !track.enabled);
}