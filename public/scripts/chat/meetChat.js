const socket = io('/')
let activeConversationId ="";

socket.on('connect', ()=>{
    console.log("connected", socket.id);
    socket.emit('login', {username: userId});
})

socket.on('reconnect', function () { console.log('you have been reconnected')});

socket.on('newMessage', (data)=>{
    console.log(data)
    if(data.activeConversationId == activeConversationId){
        let msg = {
            text : data.message
          }
          
        if(data.userId != userId){
            let incomingMessage = document.createElement('div');
                incomingMessage.className = 'incoming_msg';
            let incomingMessageImage = document.createElement('div');
                incomingMessageImage.className = 'incoming_msg_img';
                incomingMessageImage.innerHTML ='<img src="https://ptetutorials.com/images/user-profile.png" alt="User">';
            let receivedMessage = document.createElement('div');
                receivedMessage.className = 'received_msg';
            let receivedWithdateMessage = document.createElement('div');
                receivedWithdateMessage.className = 'received_withd_msg'
                receivedWithdateMessage.innerHTML = `<b>${data.userId}</b><br><p>${msg.text}</p> <span class="time_date_in"> 11:01 AM    |    June 10</span> </div>`;
            
                receivedMessage.appendChild(receivedWithdateMessage);
                incomingMessage.appendChild(incomingMessageImage);
                incomingMessage.appendChild(receivedMessage);
            $("#chats").append(incomingMessage);
                    
        }
        else{
            let outgoingMessage = document.createElement('div');
                outgoingMessage.className = 'outgoing_msg';
            let sentMessage = document.createElement('div');
                sentMessage.className = 'sent_msg';

                sentMessage.innerHTML = `<b>${data.userId}</b><br><p>${msg.text}</p> <span class="time_date_in"> 11:01 AM    |    June 10</span> </div>`;

                outgoingMessage.appendChild(sentMessage);
            $("#chats").append(outgoingMessage);
        }

        scrollToBottom();
        text.val('')
    }
})



axios.get('/meet-conversations/'+userId).then((res,err)=>{
    // console.log(res.data);

    const data = res.data;
    data.forEach((item)=>{        
        // console.log(item);

        let chatDiv = document.createElement('div');
            chatDiv.className = 'chat_list';
        let chatPeople = document.createElement('div');
            chatPeople.className = 'chat_people';
            chatPeople.id=`${item.name}`
        let chatImage = document.createElement('div');
            chatImage.className = 'chat_img';
            chatImage.innerHTML ='<img src="https://ptetutorials.com/images/user-profile.png" alt="User">';
        let chatIb = document.createElement('div');
            chatIb.className = 'chat_ib';
            chatIb.id = item.roomId;
        let today = new Date().toLocaleDateString();
            chatIb.innerHTML = `<h5> ${item.name} <span class="chat_date"> ${today} </span></h5>
                                <p> This is Just a demo message for now! I hope we acheive success very soon!</p>`
            chatPeople.appendChild(chatImage);
            chatPeople.appendChild(chatIb);
            chatDiv.appendChild(chatPeople);
            $("#people").append(chatDiv);
        
    })
})

$('#people').on('click', '.chat_ib', function(e) {
    
    if(document.documentElement.clientWidth<=604){
        $(".mesgs").css("display", "block");
        $(".inbox_people").css("display","none");
        $(".navbar").css("display", "none");
    }
    else{
        $(".initial-bg").css("display", "none");
        $(".mesgs").css("display", "block");
    }

    let convoId = e.currentTarget.id;

    if(activeConversationId!=="") document.getElementById(activeConversationId).parentNode.parentNode.classList.remove("active_chat");
    activeConversationId = convoId;

    let roomName = document.getElementById(convoId).parentNode.id;
    
        $("#friendName").text(`${roomName}`)

    axios.get(`/messages/${convoId}`).then((res,err)=>{
        // $("#loading-spinner").css("display","none");
        console.log(res.data)
        $(`#${activeConversationId}`).parent().parent().addClass("active_chat");
        let data = res.data.messages;
        let names = res.data.names;
        console.log(names)
        
        $("#chats").html("");
    
        data.forEach((item)=>{
            // console.log("meee" , item);

                if(item.sender === userId){
                    // console.log("meee" , item);
                    let outgoingMessage = document.createElement('div');
                        outgoingMessage.className = 'outgoing_msg';
                    let sentMessage = document.createElement('div');
                        sentMessage.className = 'sent_msg';
    
                        sentMessage.innerHTML = `<b>You</b><br><p>${item.text}</p> <span class="time_date_out"> 11:01 AM    |    June 9</span> </div>`;
    
                        outgoingMessage.appendChild(sentMessage);
                    $("#chats").append(outgoingMessage);
                }
                else{
                    // console.log("theyyy",item);
                    let incomingMessage = document.createElement('div');
                        incomingMessage.className = 'incoming_msg';
                    let incomingMessageImage = document.createElement('div');
                        incomingMessageImage.className = 'incoming_msg_img';
                        incomingMessageImage.innerHTML ='<img src="https://ptetutorials.com/images/user-profile.png" alt="User">';
                    let receivedMessage = document.createElement('div');
                        receivedMessage.className = 'received_msg';
                    let receivedWithdateMessage = document.createElement('div');
                        receivedWithdateMessage.className = 'received_withd_msg'
                        receivedWithdateMessage.innerHTML = `<b>${names[item.sender]}</b><br><p>${item.text}</p> <span class="time_date_in"> 11:01 AM    |    June 10</span> </div>`;
                    
                        receivedMessage.appendChild(receivedWithdateMessage);
                        incomingMessage.appendChild(incomingMessageImage);
                        incomingMessage.appendChild(receivedMessage);
                    $("#chats").append(incomingMessage);
                }
            
           
        })
        scrollToBottom();
    })
  });


  let text = $(".write_msg");
  // when press enter send message
  $('html').keydown(sendChat);
//   $('#send').click(sendChat);

    function sendChat(e) {
    if ((e.which == 13 && text.val().length !== 0)) {
        
        let msg = {
            text : text.val(), 
            name : "userName",
            roomId : activeConversationId
          }
        
        socket.emit('message',msg);
        socket.emit("add-message-to-server", {activeConversationId,userId, message : text.val(),fromMeet:false}, ()=>{
            let msg = {
                text : text.val()
              }
                let outgoingMessage = document.createElement('div');
                    outgoingMessage.className = 'outgoing_msg';
                let sentMessage = document.createElement('div');
                    sentMessage.className = 'sent_msg';
        
                sentMessage.innerHTML = `<b>You</b><br><p>${msg.text}</p> <span class="time_date_out"> 11:01 AM    |    June 9</span> </div>`;
                outgoingMessage.appendChild(sentMessage);
            $("#chats").append(outgoingMessage);
            scrollToBottom();
            //   socket.emit('user-chat',msg);
              text.val('');
        })
    }
  };

const scrollToBottom = () => {
    var d = $('#chats');
    d.scrollTop(d.prop("scrollHeight"));
  }


function showPeople(){
    $(".mesgs").css("display", "none");
    $(".inbox_people").css("display","block");
    $(".navbar").css("display", "block");
}

function joinCurrentMeet(){
    location.href=`/room/${activeConversationId}`
}

function inviteToConversation(){
    let link = `http://engageclone.herokuapp.com/join-meet-conversations/${activeConversationId}`;
    const el = document.createElement('textarea');
    el.value = link;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  
    alert("Invitation link copied to clipboard!" , link)
}