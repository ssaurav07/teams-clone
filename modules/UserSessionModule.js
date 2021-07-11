
var userSessions = new Map();

var User = function (name, socketid) {
    this.name = name;
    this.socketId = socketid;

}

var SessionManager = function () {
    this.sessions = new Map();
}

SessionManager.prototype.hello = function () {
}

SessionManager.prototype.setUser = function (userId, socketId) {

    let user = new User(userId, socketId);
    this.sessions.set(userId, user);


    return false;
}

SessionManager.prototype.deleteUser = function (socketId) {
    let userId = getByValue(this.sessions, socketId)
    if (userId) {
        this.sessions.delete(userId);
        return true;
    }
    return false;
}

function getByValue(map, searchValue) {
    for (let [key, value] of map.entries()) {
        if (value === searchValue)
            return key;
    }
}


SessionManager.prototype.getUser = function (userId) {
    if (this.sessions.has(userId)) {
        let user = this.sessions.get(userId);
        return user;
    }
    return false;
}




module.exports = SessionManager

