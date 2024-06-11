const logoff = () => {
    fetch('../../backend/api/logout.php', {
        method: 'POST',
        body: JSON.stringify(),
    })
    .then(response=>response.json())
    .then(response => {
        if (response.success) {
            location.replace("../index.html");
        } else {
            // document.getElementById('user-message').innerText = response.message;
        }
    });
}

fetch('../../backend/api/get_Logged_User.php', {
    method: 'POST',
    body: JSON.stringify(),
})
.then(response=>response.json())
.then(response => {
    if (response.success) {
        let button = document.getElementById('user');
        button.style.display = 'block';
        let buttons = document.getElementById('no-user');
        buttons.style.display = 'none';
    } else {
        // document.getElementById('user-message').innerText = response.message;
    }
});
