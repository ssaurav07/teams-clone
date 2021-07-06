console.log("hello",axios);
axios.get('/conversations/'+userId).then((res,err)=>{
    console.log(res.data);

    const data = res.data;
    data.forEach((item)=>{
        let friendId = "";
        if(item.members[0]===userId){
            friendId = item.members[1];
        }
        else{
            friendId = item.members[0];
        }
                       

        axios.get(`/user/${friendId}`).then((res,err)=>{
            let chatDiv = document.createElement('div');
                chatDiv.className = 'chat_list';
            let chatPeople = document.createElement('div');
                chatPeople.className = 'chat_people';
                chatPeople.id=friendId;
            let chatImage = document.createElement('div');
                chatImage.className = 'chat_img';
                chatImage.innerHTML ='<img src="https://ptetutorials.com/images/user-profile.png" alt="User">';
            let chatIb = document.createElement('div');
                chatIb.className = 'chat_ib';
                chatIb.id = item._id;
            let today = new Date().toLocaleDateString();
                chatIb.innerHTML = `<h5> ${res.data.name} <span class="chat_date"> ${today} </span></h5>
                                    <p> This is Just a demo message for now! I hope we acheive success very soon!</p>`
                chatPeople.appendChild(chatImage);
                chatPeople.appendChild(chatIb);
                chatDiv.appendChild(chatPeople);
                $("#people").append(chatDiv);
        })

        
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

    let selFriendId = document.getElementById(convoId).parentNode.id;
    
        axios.get(`/user/${selFriendId}`).then((res,err)=>{
            $("#friendName").text(`${res.data.name}`)
        })

    axios.get(`/messages/${convoId}`).then((res,err)=>{
        // $("#loading-spinner").css("display","none");

        $(`#${active_id}`).parent().parent().addClass("active_chat");
        let data = res.data;
        
        $("#chats").html("");

        data.forEach((item)=>{

            if(item.sender === userId){
                let outgoingMessage = document.createElement('div');
                    outgoingMessage.className = 'outgoing_msg';
                let sentMessage = document.createElement('div');
                    sentMessage.className = 'sent_msg';

                    sentMessage.innerHTML = `<p>${item.text}</p> <span class="time_date_out"> 11:01 AM    |    June 9</span> </div>`;

                    outgoingMessage.appendChild(sentMessage);
                $("#chats").append(outgoingMessage);
            }
            else{
                let incomingMessage = document.createElement('div');
                    incomingMessage.className = 'incoming_msg';
                let incomingMessageImage = document.createElement('div');
                    incomingMessageImage.className = 'incoming_msg_img';
                    incomingMessageImage.innerHTML ='<img src="https://ptetutorials.com/images/user-profile.png" alt="User">';
                let receivedMessage = document.createElement('div');
                    receivedMessage.className = 'received_msg';
                let receivedWithdateMessage = document.createElement('div');
                    receivedWithdateMessage.className = 'received_withd_msg'
                    receivedWithdateMessage.innerHTML = `<p>${item.text}</p> <span class="time_date_in"> 11:01 AM    |    June 10</span> </div>`;
                
                    receivedMessage.appendChild(receivedWithdateMessage);
                    incomingMessage.appendChild(incomingMessageImage);
                    incomingMessage.appendChild(receivedMessage);
                $("#chats").append(incomingMessage);
            }
           
        })
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
        // name : userName
      }
    let outgoingMessage = document.createElement('div');
        outgoingMessage.className = 'outgoing_msg';
    let sentMessage = document.createElement('div');
        sentMessage.className = 'sent_msg';

        sentMessage.innerHTML = `<p>${msg.text}</p> <span class="time_date_out"> 11:01 AM    |    June 9</span> </div>`;
        outgoingMessage.appendChild(sentMessage);
        
    $("#chats").append(outgoingMessage);
    scrollToBottom();
    //   socket.emit('user-chat',msg);
      text.val('')
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