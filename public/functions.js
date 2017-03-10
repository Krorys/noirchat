function logInAnimation() {
    var guestForm = document.getElementById('guestForm');
    
    guestForm.style.display = 'none';
    document.getElementById('logged-users-list').style.display = 'initial';

    setTimeout(function() {
        document.getElementById('chat').style.display = 'initial';
        document.getElementById('logged-users-list').style.opacity = '1';
        messageInput.focus();
    }, 500);
    
    document.getElementById('fromUser').innerText = '@'+loggedUser;
}

function logInAfterInputAnimation() {
    var guestForm = document.getElementById('guestForm');
    
    guestForm.style.opacity = '0';
    setTimeout(function() {
        guestForm.style.display = 'none';
        document.getElementById('chat').style.display = 'initial';
        document.getElementById('logged-users-list').style.display = 'initial';
        messageInput.focus();
    }, 500);
    
    document.getElementById('fromUser').innerText = '@'+loggedUser;
}

function firstLogAnimation() {
    var guestForm = document.getElementById('guestForm');
    
    guestForm.style.display = 'block'
    
    setTimeout(function() {
        guestForm.style.opacity = '1';
    }, 500);
}

function checkAlreadyLogged() {
    if(localStorage.getItem('username') != undefined) {
        socket.emit('logIn', localStorage.getItem('username'));
        isAlreadyLogged = true;
    }
    else{
        firstLogAnimation();
        isAlreadyLogged = false;
    }
}

//Never used
// function scrollToBottom() {
//     lastElementTop = document.querySelector('#chatContainer div:last-child').offsetTop;
//     // scrollAmount = lastElementTop - 200 ;
//     chatContainer.animate({scrollTop: lastElementTop * 10}, 0);
// }