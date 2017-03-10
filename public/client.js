var socket = io();

var loggedUser;
var connectForm = document.getElementById('connectForm');
var messageForm = document.getElementById('messageForm');
var messageInput = document.getElementById('message');
var chatContainer = document.getElementById('chatContainer');

var isAlreadyLogged = false;

//If user already signed up, previously used username is retrieved
if(localStorage.getItem('username') != undefined) {
    socket.emit('logIn', localStorage.getItem('username'));
    isAlreadyLogged = true;
}

connectForm.addEventListener('submit', function(e) {
    e.preventDefault();

    var username = document.getElementById('username');
    if (username.value.trim().length == 0)
        return;

    
    socket.emit('logIn', username.value);
    console.log('Tring to log in as :', username.value);
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
    console.log('Sending : ', message);
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

socket.on('logInSuccess', function (user) {
    loggedUser = user;
    console.log("Successfully logged in as  :", user);
    logInAnimation();
});

socket.on('displayMsg', function (message) {
    if (loggedUser == null)
        return;
    console.log("Received :", message);

    var newDiv = document.createElement('div');
    var pseudo = document.createElement('span');
    pseudo.innerText = message.sender;
    pseudo.classList.add('pseudo');
    var messageTxt = document.createElement('span');
    messageTxt.innerText = message.text;

    chatContainer.appendChild(newDiv);
    newDiv.appendChild(pseudo);
    newDiv.appendChild(messageTxt);
    if (message.type == 'status') {
        pseudo.classList.add('status');
        messageTxt.classList.add('status');
    }

    chatContainer.scrollTop = chatContainer.scrollHeight;
    // scrollToBottom();
});

socket.on('displayIsWriting', function (users) {
    if (loggedUser == null)
        return;
    // console.log("Message being written by :", user);
    var txt = users + ' is writing...';
    if (users.length == 0)
        var txt = '';
    document.getElementById('isWriting').innerText = txt;
});

socket.on('usersList', function (currentUsers) {
    var usersDOM = document.getElementById('logged-users-list');
    var newUsersList = ["Logged users:<br/>"];

    for (var i = 0; i < currentUsers.length; i++) {
        newUsersList.push("- " + currentUsers[i] + "<br/>")
    }

    usersDOM.innerHTML = newUsersList.join("");
});

function logInAnimation() {
    var guestForm = document.getElementById('guestForm');

    if(isAlreadyLogged){
        //Here do something to the html/css if user is already logged
    }
    
    guestForm.style.opacity = '0';
    setTimeout(function() {
        guestForm.style.display = 'none';
        document.getElementById('chat').style.display = 'initial';
        document.getElementById('logged-users-list').style.display = 'initial';
        messageInput.focus();
    }, 300);
    
    document.getElementById('fromUser').innerText = '@'+loggedUser;
}

function scrollToBottom() {
    lastElementTop = document.querySelector('#chatContainer div:last-child').offsetTop;
    // scrollAmount = lastElementTop - 200 ;
    chatContainer.animate({scrollTop: lastElementTop * 10}, 0);
}