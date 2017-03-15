var socket = io();

var loggedUser;
var connectForm = document.getElementById('connect-form');
var messageForm = document.getElementById('message-form');
var messageInput = document.getElementById('message-input');
var messagesContainer = document.getElementById('messages-container');
var guestForm = document.getElementById('guest-form');
var loggedUsersList = document.getElementById('logged-users-list');
var chat = document.getElementById('chat');

var isAlreadyLogged;

//If user already signed up, previously used username is retrieved
checkAlreadyLogged();


//EVENT LISTENERS//
connectForm.addEventListener('submit', function(e) {
    e.preventDefault();

    var username = document.getElementById('username');
    if (username.value.trim().length == 0)
        return;

    
    socket.emit('logIn', username.value);
    //console.log('Tring to log in as :', username.value);
    // username.value = '';

    localStorage.setItem('username', username.value);
});

messageForm.addEventListener('submit', function(e) {
    e.preventDefault();
    if (messageInput.value.trim().length == 0)
        return;

    var message = {
        sender: loggedUser,
        at: new Date().toISOString(),
        text: messageInput.value,
        type: 'message'
    }
    socket.emit('sendMsg', message);
    socket.emit('stopWritingMsg', loggedUser);
    //console.log('Sending : ', message);
    messageInput.value = '';
    messageInput.focus();
});

var timeout;
messageInput.addEventListener('keypress', function(e) {
    socket.emit('writingMsg', loggedUser);

    if (timeout) {
        clearTimeout(timeout);
        timeout = null;
    }
    timeout = setTimeout(function() {
        // console.log('Stopped writing :', loggedUser);
        socket.emit('stopWritingMsg', loggedUser);
    }, 1000);
});
//EVENT LISTENERS//


//SOCKET FUNCTIONS//
socket.on('logInSuccess', function (user) {
    loggedUser = user;
    //console.log("Successfully logged in as  :", user);
    if(isAlreadyLogged)
        logInLoggedUserAnimation();
    else
        logInNewUserAnimation();
});

socket.on('displayMsg', function (message) {
    if (loggedUser == null)
        return;
    //console.log("Received :", message);

    var newDiv = document.createElement('div');
    var pseudo = document.createElement('span');
    pseudo.innerText = message.sender;
    pseudo.classList.add('pseudo');
    var messageTxt = document.createElement('span');
    messageTxt.innerText = message.text;

    messagesContainer.appendChild(newDiv);
    newDiv.appendChild(pseudo);
    newDiv.appendChild(messageTxt);
    if (message.type == 'status') {
        pseudo.classList.add('status');
        messageTxt.classList.add('status');
    }

    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    // scrollToBottom();
});

socket.on('displayIsWriting', function (users) {
    if (loggedUser == null)
        return;
    // console.log("Message being written by :", user);

    var txt = users + ' is writing...';
    if (users.length == 0)
        var txt = '';
    document.getElementById('is-writing-field').innerText = txt;
});

socket.on('usersList', function (currentUsers) {
    //console.log(loggedUser);
    if (loggedUser == null)
        return;

    var usersDOM = document.getElementById('logged-users-list');
    var newUsersList = ["<p>Logged users:<br/>"];

    for (var i = 0; i < currentUsers.length; i++) {
        newUsersList.push("- " + currentUsers[i] + "<br/>")
    }
    newUsersList.push("</p>");

    usersDOM.innerHTML = newUsersList.join("");
});
//SOCKET FUNCTIONS//