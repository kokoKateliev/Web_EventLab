const logoff = () => {
    fetch('../backend/api/logout.php', {
        method: 'POST',
        body: JSON.stringify(),
    })
    .then(response=>response.json())
    .then(response => {
        if (response.success) {
            location.href("index.html");
        } else {
            // document.getElementById('user-message').innerText = response.message;
        }
    });
}
const isLogged = () => {
    fetch('../backend/api/get_Logged_User.php', {
        method: 'POST',
        body: JSON.stringify(),
    })
    .then(response=>response.json())
    .then(response => {
        if (response.success) {
            if(response.isLogged){
                let button = document.getElementById('user');
                let buttonL = document.getElementById('logout');
                button.style.display = 'block';
                buttonL.style.display = 'block';
                let buttons = document.getElementById('no-user');
                buttons.style.display = 'none';
            }   
            else {
                let button = document.getElementById('user');
                let buttonL = document.getElementById('logout');
                button.style.display = 'none';
                buttonL.style.display = 'none';
                let buttons = document.getElementById('no-user');
                buttons.style.display = 'block';
            }
        } else {
            // document.getElementById('user-message').innerText = response.message;
        }
    });
}

isLogged();
