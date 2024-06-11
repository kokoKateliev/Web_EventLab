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