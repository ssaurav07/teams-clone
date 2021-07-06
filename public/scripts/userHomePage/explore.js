function showJoinMeet() {
    $("#joinMeet").css("display","flex");
}

function showJoinConvo() {
    $("#joinConvo").css("display","flex");
}

function showCreateConvo() {
    $("#createConvo").css("display","flex");
}

//hide join button
function removeJoin() {
    $("#join").css("display","flex");
}

function showJoinConvoInput(){
    $("#joinMeetInput").css("display","none");
    $("#newConvoInput").css("display","none");
    $("#joinConvoInput").css("display","flex");
}

function showJoinMeetInput(){
    $("#joinConvoInput").css("display","none");
    $("#newConvoInput").css("display","none");
    $("#joinMeetInput").css("display","flex");
}

function showCreateConvoInput(){
    $("#joinConvoInput").css("display","none");
    $("#joinMeetInput").css("display","none");
    $("#newConvoInput").css("display","flex");
}