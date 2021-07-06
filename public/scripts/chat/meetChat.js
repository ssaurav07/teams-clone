console.log("hello meet Chats",axios);

axios.get('/meet-conversations/'+userId).then((res,err)=>{
    console.log(res.data);

    const data = res.data;
    data.forEach((item)=>{        
        console.log(item);

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

let active_id ="";
$('#people').on('click', '.chat_ib', function(e) {
    
    if(document.documentElement.clientWidth<=604){
        $(".mesgs").css("display", "block");
        $(".inbox_people").css("display","none");
    }


    // $("#loading-spinner").css("display","flex");
    let convoId = e.currentTarget.id;

    if(active_id!=="") document.getElementById(active_id).parentNode.parentNode.classList.remove("active_chat");
    active_id = convoId;

    let roomName = document.getElementById(convoId).parentNode.id;
    
        $("#friendName").text(`${roomName}`)

    axios.get(`/messages/${convoId}`).then((res,err)=>{
        // $("#loading-spinner").css("display","none");

        $(`#${active_id}`).parent().parent().addClass("active_chat");
        let data = res.data;
        
        $("#chats").html("");
    
        data.forEach((item)=>{
            console.log("meee" , item);

            axios.get(`/user/${item.sender}`).then((res,err)=>{
                if(item.sender === userId){
                    console.log("meee" , item);
                    let outgoingMessage = document.createElement('div');
                        outgoingMessage.className = 'outgoing_msg';
                    let sentMessage = document.createElement('div');
                        sentMessage.className = 'sent_msg';
    
                        sentMessage.innerHTML = `<b>You</b><br><p>${item.text}</p> <span class="time_date_out"> 11:01 AM    |    June 9</span> </div>`;
    
                        outgoingMessage.appendChild(sentMessage);
                    $("#chats").append(outgoingMessage);
                }
                else{
                    console.log("theyyy",item);
                    let incomingMessage = document.createElement('div');
                        incomingMessage.className = 'incoming_msg';
                    let incomingMessageImage = document.createElement('div');
                        incomingMessageImage.className = 'incoming_msg_img';
                        incomingMessageImage.innerHTML ='<img src="https://ptetutorials.com/images/user-profile.png" alt="User">';
                    let receivedMessage = document.createElement('div');
                        receivedMessage.className = 'received_msg';
                    let receivedWithdateMessage = document.createElement('div');
                        receivedWithdateMessage.className = 'received_withd_msg'
                        receivedWithdateMessage.innerHTML = `<b>${res.data.name}</b><br><p>${item.text}</p> <span class="time_date_in"> 11:01 AM    |    June 10</span> </div>`;
                    
                        receivedMessage.appendChild(receivedWithdateMessage);
                        incomingMessage.appendChild(incomingMessageImage);
                        incomingMessage.appendChild(receivedMessage);
                    $("#chats").append(incomingMessage);
                }
            })
            
           
        })
    })
  });


  let text = $(".write_msg");
  // when press enter send message
  $('html').keydown(sendChat);
//   $('#send').click(sendChat);

    function sendChat(e) {
    if ((e.which == 13 && text.val().length !== 0)) {
      axios.post(`/messages/${active_id}/${userId}/${text.val()}`).then((res,err)=>{
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
          text.val('')
      })
    }
  };

//   socket.on("createMessage", message => {
//     $(".messages").append(`<li class="message"><b id="name">${message.name}</b><br/>${message.text}</li>`);
//     scrollToBottom()
//   })

const scrollToBottom = () => {
    var d = $('#chats');
    d.scrollTop(d.prop("scrollHeight"));
  }


function showPeople(){
    $(".mesgs").css("display", "none");
    $(".inbox_people").css("display","block");
    
}