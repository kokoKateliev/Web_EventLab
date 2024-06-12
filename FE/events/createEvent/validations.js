function isValidName(field) {
	if (field.value == "") {
		return "Полетo \"" + field.placeholder + "\" е задължително."
	}
	if (field.value.length < 2) {
		return "Полетo \"" + field.placeholder + "\" трябва да съдържа поне 2 символа."
	}
	if (field.value.length > 50) {
		return "Полетo \"" + field.placeholder + "\" трябва да съдържа не повече от 50 символа."
	}

	return "";
}

function isValidDescription(field) {
	if (field.value == "") {
		return "Полетo \"" + field.placeholder + "\" е задължително."
	}
	if (field.value.length < 1) {
		return "Полетo \"" + field.placeholder + "\" трябва да съдържа поне 2 символа."
	}
	if (field.value.length > 500) {
		return "Полетo \"" + field.placeholder + "\" трябва да съдържа не повече от 50 символа."
	}
	
	return "";
}

function isValidEmail(field) {
	if (field == "") {
		return "Полетo \"E-mail\" е задължително."
	}
	if (field.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/) == null) {
		return "Въведен е невалиден имейл."
	}
	return "";
}

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
		return "Въведена е невалидна парола."
	}
	return "";
}

const validateTitle = event => {
	const name = event.target;
	document.querySelector("p[id='errEventName']").innerText = isValidName(name);
};

const validateLocation = event => {
	const name = event.target;
	document.querySelector("p[id='errLocation']").innerText = isValidName(name);
};

const validateDescr = event => {
	const desc = event.target;
	document.querySelector("p[id='errEventDescription']").innerText = isValidName(desc);
};

const validateEmail = event => {
	const email = event.target.value;
	document.querySelector("p[id='errEmail']").innerText = isValidEmail(email);
};

const validateDate = event => {
	const username = event.target.value;
	const start = document.querySelector("input[name='EventDateSt']").value;
	document.querySelector("input[name='EventDateEn']").setAttribute('min', start);
};

const today = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
};



document.querySelector("input[name='EventName']").addEventListener('keyup', validateTitle);
document.querySelector("textarea[name='EventDescription']").addEventListener('keyup', validateDescr);
document.querySelector("input[name='EventDateSt']").setAttribute('min', today());
document.querySelector("input[name='EventDateSt']").addEventListener('change', validateDate);
document.querySelector("input[name='EventDateEn']").setAttribute('min', today());
document.querySelector("input[name='EventDateEn']").addEventListener('change', validateDate);
document.querySelector("input[name='location']").addEventListener('keyup', validateLocation);
document.querySelector("input[name='celebratorEmail']").addEventListener('keyup', validateEmail);

function validate(errors, fields) {
	
	for (const field of fields) {
		if(field == "") {
			document.getElementById('user-message').innerText = "Моля, попълнени всички задължителни полета.";
			return false;
		}
	}
	
	for (const err of errors) {
		if (err != "") {
			document.getElementById('user-message').innerText = "Mоля, въведете валидни данни.";
			return false;
		}
	}
	
	document.getElementById('user-message').innerText = "";
	return true;
}

function selectedRole(roles) {
	id = "";
	for(i = 0; i < roles.length; i++) { 
        if(roles[i].checked) {
			id = roles[i].value;
		}
    } 
	return id; 
}

const onFormSubmitted = event => {
    event.preventDefault();

    const formElement = event.target;
	
	roleID = selectedRole(formElement.querySelectorAll("input[name='role']"));
	
    const formData = {
		EventName: formElement.querySelector("input[name='EventName']").value,
		EventDescription: formElement.querySelector("textarea[name='EventDescription']").value,
		EventDateSt: formElement.querySelector("input[name='EventDateSt']").value,
        EventDateEn: formElement.querySelector("input[name='EventDateEn']").value,
        EventTimeSt: formElement.querySelector("input[name='EventTimeSt']").value,
        EventTimeEn: formElement.querySelector("input[name='EventTimeEn']").value,
        location: formElement.querySelector("input[name='location']").value,
        universityId: parseInt(formElement.querySelector("select[name='university']").value),
		facultyId: parseInt(formElement.querySelector("select[name='faculty']").value),
		isAnonnymus: !!formElement.querySelector("input[name='isAnonnymus']").checked,
		isGlobal: !!formElement.querySelector("input[name='isGlobal']").checked,
		isPersonalized: !!formElement.querySelector("input[name='isPersonalized']").checked,
		celebratorEmail: formElement.querySelector("input[name='celebratorEmail']").value,
		isVisible: !!formElement.querySelector("input[name='isVisible']").checked,
    };
	
	const fields = [
		formData.EventName,
		formData.EventDescription,
		formData.location,
		formData.EventDateSt,
		formData.EventDateEn,
		formData.EventTimeSt,
		formData.EventTimeEn,
		formData.location
	];
	
	const errors = [
		formElement.querySelector("p[id='errEventName']").innerText,
		formElement.querySelector("p[id='errEventDescription']").innerText,
		formElement.querySelector("p[id='errLocation']").innerText 	
	];
	
	if (validate(errors, fields)) {		
		fetch('../../../backend/api/save_Event_DB.php', {
			method: 'POST',
			body: JSON.stringify(formData),
		})
		.then(response=>response.json())
		.then(response => {
			if (response.success) {
				window.location.replace("../events.html");
			} else {
				if(response.message == "There is no active transaction"){
					document.getElementById('user-message').innerText = "Имейлът на празнуващия не е намерен.";
					return;
				}
				document.getElementById('user-message').innerText = response.message;
			}
		})
		.catch(err => {
			console.error(err);
		})
	}
};
document.getElementById('create-form').addEventListener('submit', onFormSubmitted);