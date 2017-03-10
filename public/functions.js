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

function checkAlreadyLogged() {
    if(localStorage.getItem('username') != undefined) {
        socket.emit('logIn', localStorage.getItem('username'));
        isAlreadyLogged = true;
    }
}

//Never used
// function scrollToBottom() {
//     lastElementTop = document.querySelector('#chatContainer div:last-child').offsetTop;
//     // scrollAmount = lastElementTop - 200 ;
//     chatContainer.animate({scrollTop: lastElementTop * 10}, 0);
// }