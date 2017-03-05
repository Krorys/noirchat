var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use("/", express.static(__dirname + "/public"));
http.listen(3000, function() {
    console.log("Server is listening on : 3000");
});

var writingUsers = [];
io.on('connection', function(socket){
    // console.log('User connected');
    var loggedUser;

    socket.on('disconnect', function(){
        // console.log('User disconnected', loggedUser);
        if (loggedUser == null)
            return;
        var message = {
            sender: loggedUser,
            at : new Date().toISOString(),
            text : 'has disconnected.', 
            type: 'status'
        }
        socket.broadcast.emit('displayMsg', message);
    });

    socket.on('logIn', function (user) {
        // console.log('Logged as :', user);
        loggedUser = user;
        socket.emit('logInSuccess', loggedUser);
        var message = {
            sender: loggedUser,
            at : new Date().toISOString(),
            text : 'has joined.',
            type: 'status'
        }
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