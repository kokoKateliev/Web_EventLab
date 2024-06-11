function isValidUsername(field) {
	if (field == "") {
		return "Полетo \"Потребителско име\" е задължително."
	}
	if (field.length < 2) {
		return "Полетo \"Потребителско име\" трябва да съдържа поне 3 символа."
	}
	if (field.length > 45) {
		return "Полетo \"Потребителско име\" трябва да съдържа не повече от 45 символа."
	}
	if (field.match(/^[a-zA-Z0-9]+[a-zA-Z0-9]+$/) == null) {
		return "Полетo \"Потребителско име\" трябва съдържа само латински букви, цифри, точка, тире и долна черта, както и да започва с буква."
	}
	return "";
}

function isValidPassword(field) {
	if (field == "") {
		return "Полетo \"Парола\" е задължително."
	}
	if (field.length < 6) {
		return "Полетo \"Парола\" трябва да съдържа поне 6 символа."
	}
	if (field.length > 30) {
		return "Полетo \"Парола\" трябва да съдържа не повече от 30 символа."
	}
	if (field.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[-_@!])(?=(?:[^a-zA-Z]*[a-zA-Z]){2,})(?!.*\s).{2,256}$/) == null) {
		return "Въведена е невалидна парола. Паролата трябва да има поне една главна и една малка буква, както и една цифра, и един символ ( _, -, @, ! )"
	}
	return "";
}

const validateUsername = event => {
	username = event.target.value;
	let text = isValidUsername(username);
	if(text){
		document.getElementById('user-message').style.visibility = 'visible';
		document.getElementById("user-message").innerText = text;
	}
	else{
		document.getElementById('user-message').style.visibility = 'hidden';
	}
};

const validatePassword = event => {
	password = event.target.value;
	let pass = isValidPassword(password);
	if(pass){
		document.getElementById('user-message').style.visibility = 'visible';
		document.getElementById("user-message").innerText = pass;
	}
	if(!pass){
		document.getElementById('user-message').style.visibility = 'hidden';
	}
};

document.querySelector("input[name='username']").addEventListener('keyup', validateUsername);
document.querySelector("input[name='password']").addEventListener('keyup', validatePassword);


const onFormSubmitted = event => {
    event.preventDefault();

    const formElement = event.target;
    
    const formData = {
        username: formElement.querySelector("input[name='username']").value,
        password: formElement.querySelector("input[name='password']").value,
    };
    
    fetch('../../backend/api/login.php', {
        method: 'POST',
        body: JSON.stringify(formData),
    })
    .then(response=>response.json())
    .then(response => {
        if (response.success) {
            location.replace("../index.html");
        } else {
			document.getElementById('user-message').style.visibility = 'visible';
            document.getElementById('user-message').innerText = response.message;
        }
    });

    return false;
}

document.getElementById('login-form').addEventListener('submit', onFormSubmitted);