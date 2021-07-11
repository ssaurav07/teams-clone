const socket = io('/')
let activeConversationId = "";  //Currently selected conversation

// ---------------------------Socket event listeners------------------------------------- //

socket.on('connect', () => {
    console.log("connected", socket.id);
    socket.emit('login', { username: userId });
})

socket.on('reconnect', function () { console.log('you have been reconnected') });

socket.on('newMessage', async (data) => {
    console.log(data)
    if (data.activeConversationId == activeConversationId) {
        let msg = {
            text: data.message
        }

        if (data.userId != userId) {

            let user = await axios.post(`/user/${data.userId}`)

            let incomingMessage = document.createElement('div');
            incomingMessage.className = 'incoming_msg';
            let incomingMessageImage = document.createElement('div');
            incomingMessageImage.className = 'incoming_msg_img';
            incomingMessageImage.innerHTML = '<img class="rounded-circle" src="https://pixinvent.com/modern-admin-clean-bootstrap-4-dashboard-html-template/app-assets/images/portrait/small/avatar-s-11.png" alt="User">';
            let receivedMessage = document.createElement('div');
            receivedMessage.className = 'received_msg';
            let receivedWithdateMessage = document.createElement('div');
            receivedWithdateMessage.className = 'received_withd_msg'
            receivedWithdateMessage.innerHTML = `<b>${user.data.name}</b><br><p>${msg.text}</p> <span class="time_date_in">${dayjs(msg.sentAt).format('hh:mm A | MMM D')}</span> </div>`;

            receivedMessage.appendChild(receivedWithdateMessage);
            incomingMessage.appendChild(incomingMessageImage);
            incomingMessage.appendChild(receivedMessage);
            $("#chats").append(incomingMessage);

        }
        else {
            let outgoingMessage = document.createElement('div');
            outgoingMessage.className = 'outgoing_msg';
            let sentMessage = document.createElement('div');
            sentMessage.className = 'sent_msg';

            sentMessage.innerHTML = `<b>You</b><br><p>${msg.text}</p> <span class="time_date_in">${dayjs(Date.now()).format('hh:mm A | MMM D')}</span>`;

            outgoingMessage.appendChild(sentMessage);
            $("#chats").append(outgoingMessage);
        }

        scrollToBottom();
        text.val('')
    }
})

// --------------------------Fetch all conversations of the user-------------------------------------- //

axios.get('/personal-conversations/' + userId).then((res, err) => {

    const data = res.data;
    data.forEach(async (item) => {

        // ------------Find friend id from members array------------------------- //

        let friendId;

        if (item.members[0] == userId) {
            friendId = item.members[1];
        }
        else {
            friendId = item.members[0];
        }

        // --------------------Fetch username of friend ------------------------- //

        let user = await axios.post(`/user/${friendId}`)

        // ------------------ show all the conversations ------------------------- //

        let chatDiv = document.createElement('div');
        chatDiv.className = 'chat_list';
        let chatPeople = document.createElement('div');
        chatPeople.className = 'chat_people';
        chatPeople.id = `${user.data.name}`
        let chatImage = document.createElement('div');
        chatImage.className = 'chat_img';
        chatImage.innerHTML = '<img class="rounded-circle" src="https://pixinvent.com/modern-admin-clean-bootstrap-4-dashboard-html-template/app-assets/images/portrait/small/avatar-s-8.png" alt="User">';
        let chatIb = document.createElement('div');
        chatIb.className = 'chat_ib';
        chatIb.id = item.roomId;
        let today = new Date().toLocaleDateString();
        chatIb.innerHTML = `<h5> ${user.data.name} <span class="chat_date"> ${today} </span></h5>
                                <p> This is Just a demo message for now!</p>`
        chatPeople.appendChild(chatImage);
        chatPeople.appendChild(chatIb);
        chatDiv.appendChild(chatPeople);
        $("#people").append(chatDiv);

    })
})


// --------------------Show messages of Clicked conversation-------------------- //

$('#people').on('click', '.chat_ib', function (e) {

    // --------------For small screen responsiveness-------------- //
    if (document.documentElement.clientWidth <= 604) {
        $(".mesgs").css("display", "block");
        $(".inbox_people").css("display", "none");
        $(".navbar").css("display", "none");
    }
    else {
        $(".initial-bg").css("display", "none");
        $(".mesgs").css("display", "block");
    }

    let convoId = e.currentTarget.id;

    if (activeConversationId !== "") document.getElementById(activeConversationId).parentNode.parentNode.classList.remove("active_chat");
    activeConversationId = convoId;

    let friendName = document.getElementById(convoId).parentNode.id;

    $("#friendName").text(`${friendName}`)

    // --------------Fetch all messages of a conversation Id -------------- //

    axios.get(`/messages/${convoId}`).then((res, err) => {

        $(`#${activeConversationId}`).parent().parent().addClass("active_chat");
        let data = res.data.messages;
        let names = res.data.names;


        $("#chats").html("");

        data.forEach((item) => {

            if (item.sender === userId) {

                let outgoingMessage = document.createElement('div');
                outgoingMessage.className = 'outgoing_msg';
                let sentMessage = document.createElement('div');
                sentMessage.className = 'sent_msg';

                sentMessage.innerHTML = `<b>You</b><br><p>${item.text}</p> <span class="time_date_out">${dayjs(item.sentAt).format('hh:mm A | MMM D')}</span> </div>`;

                outgoingMessage.appendChild(sentMessage);

                $("#chats").append(outgoingMessage);
            }
            else {

                let incomingMessage = document.createElement('div');
                incomingMessage.className = 'incoming_msg';
                let incomingMessageImage = document.createElement('div');
                incomingMessageImage.className = 'incoming_msg_img';
                incomingMessageImage.innerHTML = '<img class="rounded-circle" src="https://pixinvent.com/modern-admin-clean-bootstrap-4-dashboard-html-template/app-assets/images/portrait/small/avatar-s-26.png" alt="User">';
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
            scrollToBottom();   // scroll down after appending message
        })
    })
});


let text = $(".write_msg");

$('html').keydown(sendChat);    // when pressed enter , send message

function sendChat(e) {
    if ((e.which == 13 && text.val().length !== 0)) {

        let msg = {
            text: text.val(),
            name: `${userId}`,
            roomId: activeConversationId
        }

        socket.emit('message', msg);   // Emit this message to video room's realtime chat

        // ------------ Emit this message to teams conversation groups------------------ //
        socket.emit("add-message-to-server", { activeConversationId, userId, message: text.val(), fromMeet: false }, () => {
            let msg = {
                text: text.val()
            }
            let outgoingMessage = document.createElement('div');
            outgoingMessage.className = 'outgoing_msg';
            let sentMessage = document.createElement('div');
            sentMessage.className = 'sent_msg';

            sentMessage.innerHTML = `<b>You</b><br><p>${msg.text}</p> <span class="time_date_out"> 11:01 AM    |    June 9</span> </div>`;
            outgoingMessage.appendChild(sentMessage);

            $("#chats").append(outgoingMessage);
            scrollToBottom();

            text.val('');
        })
    }
};

// ----------Scroll to bottom of chat window after new messages------------------- //

const scrollToBottom = () => {
    var d = $('#chats');
    d.scrollTop(d.prop("scrollHeight"));
}

// ---------- switch between conversations and message window (FOR MOBILES) ------------- //

function showPeople() {
    $(".mesgs").css("display", "none");
    $(".inbox_people").css("display", "block");

}

// -------Join a personal group Conversation or Create a new one to one Conversation ---- //

function joinNewPersonalChatModel() {
    let friendsId = $("#friendId").val();

    axios.get(`/join-personal-conversations/${friendsId}/${userId}`).then(async (res, err) => {
        if (res.data.status) {
            let user = await axios.post(`/user/${friendsId}`)

        // ------------------ show all the conversations ------------------------- //

        let chatDiv = document.createElement('div');
        chatDiv.className = 'chat_list';
        let chatPeople = document.createElement('div');
        chatPeople.className = 'chat_people';
        chatPeople.id = `${user.data.name}`
        let chatImage = document.createElement('div');
        chatImage.className = 'chat_img';
        chatImage.innerHTML = '<img class="rounded-circle" src="https://pixinvent.com/modern-admin-clean-bootstrap-4-dashboard-html-template/app-assets/images/portrait/small/avatar-s-8.png" alt="User">';
        let chatIb = document.createElement('div');
        chatIb.className = 'chat_ib';
        chatIb.id = res.data.message;
        let today = new Date().toLocaleDateString();
        chatIb.innerHTML = `<h5> ${user.data.name} <span class="chat_date"> ${today} </span></h5>
                                <p> This is Just a demo message for now!</p>`
        chatPeople.appendChild(chatImage);
        chatPeople.appendChild(chatIb);
        chatDiv.appendChild(chatPeople);
        $("#people").append(chatDiv);
        }
        else {
            console.log(res);
        }
    })
}

function joinVideoCall() {
    location.href = `/room/${activeConversationId}`
}

function showNewConvoBox() {
    $('#newConvoBox').show();
    $('#createBtn').hide();
}