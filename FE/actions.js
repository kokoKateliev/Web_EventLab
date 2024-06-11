const logoff = () => {
    fetch('../backend/api/logout.php', {
        method: 'POST',
        body: JSON.stringify(),
    })
    .then(response=>response.json())
    .then(response => {
        if (response.success) {
            window.location.href = "index.html";
        } else {
            // document.getElementById('user-message').innerText = response.message;
        }
    });
}

const hideElements = () => {
    let button = document.getElementById('user');
    let buttonL = document.getElementById('logout');
    button.style.display = 'none';
    buttonL.style.display = 'none';
    let login = document.getElementById('login');
    let register = document.getElementById('register');
    login.style.display = 'flex';
    register.style.display = 'flex';}
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
                button.style.display = 'flex';
                buttonL.style.display = 'flex';
                let login = document.getElementById('login');
                let register = document.getElementById('register');
                login.style.display = 'none';
                register.style.display = 'none';
            }   
            else {
                hideElements();
            }
        } else {
            hideElements();
        }
    });
}

isLogged();
