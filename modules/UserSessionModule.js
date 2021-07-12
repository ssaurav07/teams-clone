
var userSessions = new Map();

// Defining user class having properties name and socket ID

var User = function (name, socketid) {
    this.name = name;
    this.socketId = socketid;

}

// Defining session manager class  with user to socket mapping table

var SessionManager = function () {
    this.sessions = new Map();
}

// Creates a new user object and stores in the map if not exist

SessionManager.prototype.setUser = function (userId, socketId) {
    
    let user = new User(userId, socketId);
    this.sessions.set(userId, user);


    return false;
}

// Remove user entry from map, user identified by socket id

SessionManager.prototype.deleteUser = function (socketId) {
    let userId = getByValue(this.sessions, socketId)
    if (userId) {
        this.sessions.delete(userId);
        return true;
    }
    return false;
}

// Retrieve an object from map based on value 

function getByValue(map, searchValue) {
    for (let [key, value] of map.entries()) {
        if (value === searchValue)
            return key;
    }
}

// Public Getter method to retrieve user object by ID

SessionManager.prototype.getUser = function (userId) {
    if (this.sessions.has(userId)) {
        let user = this.sessions.get(userId);
        return user;
    }
    return false;
}




module.exports = SessionManager

