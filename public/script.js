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
    currPeer = call.peerConnection
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
    return s.track.kind == videoTrack.kind
  })
  sender.replaceTrack(videoTrack);
}).catch((err)=>{
  console.log("unable to display media" + err);
})
}


// Screen Recording while Meeting

// let constraintObj = { 
//   audio: true, 
//   video: true,
//   //  { 
//   //     facingMode: "user", 
//   //     width: { min: 640, ideal: 1280, max: 1920 },
//   //     height: { min: 480, ideal: 720, max: 1080 } 
//   // } 
// }; 

// if (navigator.mediaDevices === undefined) {
//   navigator.mediaDevices = {};
//   navigator.mediaDevices.getUserMedia = function(constraintObj) {
//       let getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
//       if (!getUserMedia) {
//           return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
//       }
//       return new Promise(function(resolve, reject) {
//           getUserMedia.call(navigator, constraintObj, resolve, reject);
//       });
//   }
// }else{
//   navigator.mediaDevices.enumerateDevices()
//   .then(devices => {
//       devices.forEach(device=>{
//           console.log(device.kind.toUpperCase(), device.label);
//           //, device.deviceId
//       })
//   })
//   .catch(err=>{
//       console.log(err.name, err.message);
//   })
// }

// navigator.mediaDevices.getUserMedia(constraintObj)
// .then(function(mediaStreamObj) {
//   //connect the media stream to the first video element
//   let video = document.querySelector('video');
//   if ("srcObject" in video) {
//       video.srcObject = mediaStreamObj;
//   } else {
//       //old version
//       video.src = window.URL.createObjectURL(mediaStreamObj);
//   }
  
//   video.onloadedmetadata = function(ev) {
//       //show in the video element what is being captured by the webcam
//       video.play();
//   };
  
//   //add listeners for saving video/audio
//   let start = document.getElementById('btnStart');
//   let stop = document.getElementById('btnStop');
//   let vidSave = document.getElementById('vid2');
//   let mediaRecorder = new MediaRecorder(mediaStreamObj);
//   let chunks = [];
  
//   start.addEventListener('click', (ev)=>{
//       mediaRecorder.start();
//       console.log(mediaRecorder.state);
//   })
//   stop.addEventListener('click', (ev)=>{
//       mediaRecorder.stop();
//       console.log(mediaRecorder.state);
//   });
//   mediaRecorder.ondataavailable = function(ev) {
//       chunks.push(ev.data);
//   }
//   mediaRecorder.onstop = (ev)=>{
//       let blob = new Blob(chunks, { 'type' : 'video/mp4;' });
//       chunks = [];
//       let videoURL = window.URL.createObjectURL(blob);
//       vidSave.src = videoURL;
//   }
// })
// .catch(function(err) { 
//   console.log(err.name, err.message); 
// });