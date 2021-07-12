

// --------------------- Mute/Unmute Your Mic -------------------------------------------

function muteMic() {
  myStream.getAudioTracks().forEach(track => track.enabled = !track.enabled);
  let ih = document.getElementById("mute-mic");
  if (ih.innerHTML === '<i class="fas fa-microphone-slash"></i>') {
    ih.innerHTML = '<i class="fas fa-microphone"></i>';
    $("#mute-mic").css("color", "black")
  }
  else {
    ih.innerHTML = '<i class="fas fa-microphone-slash"></i>';
    $("#mute-mic").css("color", "red")
  }

}


// --------------------- Turn on/off your video -------------------------------------------

function muteCam() {
  myStream.getVideoTracks().forEach(track => track.enabled = !track.enabled);
  let ih = document.getElementById("mute-vid");
  if (ih.innerHTML === '<i class="fas fa-video-slash"></i>') {
    $("#mute-vid").css("color", "black")
    ih.innerHTML = '<i class="fas fa-video"></i>'
  }
  else {
    ih.innerHTML = '<i class="fas fa-video-slash"></i>';
    $("#mute-vid").css("color", "red")
  }
}



// --------------------- Share Screen -------------------------------------------

function screenShare() {
  navigator.mediaDevices.getDisplayMedia({
    video: {
      cursor: "always"
    },
    audio: {
      echoCancellation: true,
      noiseSuppression: true
    }
  }).then((stream) => {
    screenShareStream = stream;
    let videoTrack = stream.getVideoTracks()[0];

    videoTrack.onended = () => { 
      console.log('stopped from chrome api')
      stopScreenShare(); 
    }

    for (let [key, rtcObj] of Object.entries(peers)) {
      let sender = rtcObj.peerConnection.getSenders().find(function (s) {
        return s.track.kind === "video"
      })
      sender.replaceTrack(videoTrack);
    }
    $("#share-screen").css("color", "green")
    screenFlag = true;
  }).catch((err) => {
    console.log("unable to display media" + err);
  })


}

// --------------------- Stop sharing Screen -------------------------------------------

function stopScreenShare() {
  let videoTrack = myStream.getVideoTracks()[0];
  for (let [key, rtcObj] of Object.entries(peers)) {
    let sender = rtcObj.peerConnection.getSenders().find(function (s) {
      return s.track.kind === "video"
    })
    sender.replaceTrack(videoTrack);
  }
  screenFlag = false;
  screenShareStream.getTracks().forEach(function (track) {
    track.stop();
  });

  $("#share-screen").css("color", "black")

}


// --------------------- Picture in Picture Feature -------------------------------------------

var pip = document.getElementById("pipButtonElement");

pip.addEventListener('click', async function () {
  $('#other-options').hide();
  pip.disabled = true;

  try {
    // If there is no element in Picture-in-Picture yet, request for it
    if (myVideo !== document.pictureInPictureElement) {
      await myVideo.requestPictureInPicture();
    }
    // If Picture-in-Picture already exists, exit the mode
    else {
      await document.exitPictureInPicture();
    }

  } catch (error) {
    console.log(`Oh Horror! ${error}`);
  } finally {
    pip.disabled = false; //enable toggle button after the event
  }
})


// --------------------- Toggle Chat Box -------------------------------------------

function toggleChat() {
  $('#other-options').hide();
  $("#participant_box").hide();
  if (document.querySelector('#chat_box').style.display === 'none')
    $("#chat_box").css("display", "flex");
  else
    $("#chat_box").css("display", "none");
}


// --------------------- Toggle Participants Box-------------------------------------------

function toggleParticipants() {
  $('#other-options').hide();
  $("#chat_box").hide();
  if (document.querySelector('#participant_box').style.display === 'none')
    $("#participant_box").css("display", "flex");
  else
    $("#participant_box").css("display", "none");
}


// --------------------- Invite Others -------------------------------------------

function invite() {
  $('#other-options').hide();
  let link = location.href;
  const el = document.createElement('textarea');
  el.value = link;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);

  alert("Invitation link copied to clipboard!", link)
}

// --------------------- Hand Raise -------------------------------------------

function handRaise() {
  $('#other-options').hide();
  socket.emit('hand-raise', { name: currentUser });
}

function toggleOtherOptions() {
  $('#participant_box').hide();
  $('#chat_box').hide();
  $('#other-options').toggle();
}