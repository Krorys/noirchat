var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = 3000;

Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

app.use("/", express.static(__dirname + "/public"));
http.listen(port, function() {
    console.log("Server is listening on : " + port);
});




var writingUsers = [];
var currentUsers = [];

io.on('connection', function(socket){
    // console.log('User connected');
    var loggedUser;

    socket.on('disconnect', function(){
        // console.log('User disconnected', loggedUser);
        if (loggedUser == null)
            return;
        currentUsers.remove(loggedUser);
        /*
        var currentUserIndex;
        currentUsers.forEach(function(currentUser, index) {
            if (currentUser.id == socket.id)
                currentUserIndex = index;
        }, this);
        currentUsers.splice(currentUserIndex, 1);
        */
        io.emit('usersList', currentUsers);
        var message = {
            sender: loggedUser.name,
            at : new Date().toISOString(),
            text : 'has disconnected.', 
            type: 'status'
        };
        socket.broadcast.emit('displayMsg', message);
    });

    socket.on('logIn', function (username) {
        // console.log('Logged as :', username);
        loggedUser = {
            id: socket.id,
            name: username
        };
        currentUsers.push(loggedUser);
        
        socket.emit('logInSuccess', loggedUser.name);
        io.emit('usersList', currentUsers);
        
        var message = {
            sender: loggedUser.name,
            at : new Date().toISOString(),
            text : 'has joined.',
            type: 'status'
        };
        io.emit('displayMsg', message);
    });

    socket.on('sendMsg', function (message) {
        // console.log('Message sent :', message);
        io.emit('displayMsg', message);
    });

    socket.on('writingMsg', function (user) {
        // console.log('Message being written by :', user)
        if (writingUsers.indexOf(user) == -1)
            writingUsers.push(user);
        socket.broadcast.emit('displayIsWriting', writingUsers);
    });

    socket.on('stopWritingMsg', function (user) {
        // console.log('Stopped writing :', user);
        writingUsers.splice(writingUsers.indexOf(user), 1);
        io.emit('displayIsWriting', writingUsers);
    });
});