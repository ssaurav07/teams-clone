const socket = io('/')
const myPeer = new Peer({host:'peerjs-server.herokuapp.com', secure:true, port:443})

const videoGrid =  document.getElementById('video-grid');
const muteAudio = document.getElementById('mute-mic');
const muteVideo = document.getElementById('mute-vid');

muteAudio.onclick = function() { muteMic() }
muteVideo.onclick = function() { muteCam() }

let myStream;

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
      addVideoStream(video, userVideoStream)
    })
  })

//   socket.on('user-connected', userId => {
//     connectToNewUser(userId, stream)
//   })
  socket.on('user-connected', userId => {
    console.log('New User Connected: ' + userId)
    const fc = () => connectToNewUser(userId, stream)
    timerid = setTimeout(fc, 0 )
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
  
  video.className="col";
  videoGrid.appendChild(video);
}

function muteMic() {
  myStream.getAudioTracks().forEach(track => track.enabled = !track.enabled);
}

function muteCam() {
  myStream.getVideoTracks().forEach(track => track.enabled = !track.enabled);
}