

// --------------------- Mute Your Mic -------------------------------------------

function muteMic() {
  myStream.getAudioTracks().forEach(track => track.enabled = !track.enabled);
  let ih = document.getElementById("mute-mic");
  if (ih.innerHTML === '<i class="fas fa-microphone-slash"></i>') {
    ih.innerHTML = '<i class="fas fa-microphone"></i>';
    $("#mute-mic").css("color", "#67f20a")
  }
  else {
    ih.innerHTML = '<i class="fas fa-microphone-slash"></i>';
    $("#mute-mic").css("color", "red")
  }

}


// --------------------- Turn off your video -------------------------------------------

function muteCam() {
  myStream.getVideoTracks().forEach(track => track.enabled = !track.enabled);
  let ih = document.getElementById("mute-vid");
  if (ih.innerHTML === '<i class="fas fa-video-slash"></i>') {
    $("#mute-vid").css("color", "#67f20a")
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

    stream.onended = () => { stopScreenShare(); }

    for (let [key, rtcObj] of Object.entries(peers)) {
      let sender = rtcObj.peerConnection.getSenders().find(function (s) {
        return s.track.kind === "video"
      })
      sender.replaceTrack(videoTrack);
    }
    screenFlag = true;
  }).catch((err) => {
    console.log("unable to display media" + err);
  })

  $("#share-screen").css("color", "#67f20a")
}

// --------------------- stop sharing Screen -------------------------------------------

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

  $("#share-screen").css("color", "white")

}


// --------------------- Picture in Picture Feature -------------------------------------------

var pip = document.getElementById("pipButtonElement");

pip.addEventListener('click', async function () {
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




// --------------------- Toggle the Calendar -------------------------------------------

function showCalendar() {
  if (document.getElementById('calendar').style.display === 'none')
    $("#calendar").css("display", "block");
  else
    $("#calendar").css("display", "none");
}



// --------------------- Toggle Chat Box -------------------------------------------

function toggleChat() {
  $("#participant_box").hide();
  if (document.querySelector('#chat_box').style.display === 'none')
    $("#chat_box").css("display", "flex");
  else
    $("#chat_box").css("display", "none");
}


// --------------------- Toggle Participants Box-------------------------------------------

function toggleParticipants() {
  $("#chat_box").hide();
  if (document.querySelector('#participant_box').style.display === 'none')
    $("#participant_box").css("display", "flex");
  else
    $("#participant_box").css("display", "none");
}


// --------------------- Invite Others -------------------------------------------

function invite() {
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
  socket.emit('hand-raise', { name: currentUser });
}