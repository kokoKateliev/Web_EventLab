function Event(id, title, description, dateStart, dateEnd, timeStart, timeEnd, location, comments, isAnonnymus, isPersonalized, isGlobal) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.dateStart = dateStart;
    this.dateEnd = dateEnd;
    this.timeStart = timeStart;
    this.timeEnd = timeEnd;
    this.location = location;
    this.comments = comments;
    this.isAnonnymus = isAnonnymus;
    this.isPersonalized = isPersonalized;
    this.isGlobal = isGlobal;
}

function Comments(date, text, likeCount) {
    this.date = date;
    this.text = text;
    this.likeCount = likeCount
}

function Personalized(isVisible, celebrator, presents, cards, money, musics ) {
    this.isVisible = isVisible;
    this.celebrator = celebrator;
    this.presents = presents;
    this.cards = cards;
    this.money = money;
    this.musics = musics;
}

let admin = false;
let eventID = getQueryParam();

// D------------------------------------------

function presentsFormListen() {

    let section = document.getElementById('form-menu');
    if(!section){
        return;
    }

    const isValidTitle = field => {
        if (field.value == "") {
            return "Полетo \"" + field.placeholder + "\" е задължително."
        }
        if (field.value.length < 1) {
            return "Полетo \"" + field.placeholder + "\" трябва да съдържа поне 1 символ."
        }
        if (field.value.length > 50) {
            return "Полетo \"" + field.placeholder + "\" трябва да съдържа не повече от 50 символа."
        }
        if (field.value.match(/^(?=.*[a-zA-Zа-яА-Я0-9])[a-zA-Zа-яА-Я0-9]+$/) == null) {
            return "Полетo \"" + field.placeholder + "\" трябва да съдържа само текст на латиница, кирилица и цифри.";
        }
        return "";
    }

    const isValidPrice = field => {
        if (field.value == "") {
            return "Полетo \"Цена\" е задължително."
        }
        if (isNaN(parseFloat(field.value)) || parseFloat(field.value) < 0) {
            return "Въведен е невалидна цена."
        }
        return "";
    }


    const isValidDate= field => {
        const today = new Date().toISOString().split('T')[0];
        if (field.value === '') {
            return 'Полето "Крайна дата" е задължително.';
        } else if (field.value < today) {
            return 'Крайната дата не може да бъде в миналото.';
        }
        return "";
    }

    const validateTitle = event => {
        title = event.target;
        document.querySelector("p[id='error']").innerText = isValidTitle(title);
    };

    const validatePrice = event => {
        price = event.target;
        document.querySelector("p[id='error']").innerText = isValidPrice(price);
    };

    const validateDate = event => {
        date = event.target.value;
        document.querySelector("p[id='error']").innerText = isValidDate(date);
    };

    document.querySelector("input[name='title']").addEventListener('keyup', validateTitle);
    document.querySelector("input[name='price']").addEventListener('keyup', validatePrice);
    document.querySelector("input[name='endDate']").addEventListener('keyup', validateDate);

    const validate = fields => {
        
        for (const field of fields) {
            if(field == "") {
                document.getElementById('error').innerText = "Моля, попълнени всички задължителни полета.";
                return false;
            }
        }
        
        document.getElementById('error').innerText = "";
        return true;
    }

    const onFormSubmitted = event => {
        event.preventDefault();

        const formElement = event.target;
        
        const formData = {
            eventId: eventID,
            title: formElement.querySelector("input[name='title'").value,
            price: formElement.querySelector("input[name='price'").value,
            endDate: formElement.querySelector("input[name='endDate'").value,
        };
        
        const fields = [
            formData.eventId,
            formData.title,
            formData.price, 
            formData.endDate
        ];
        
        if (validate(fields)) {		
            fetch('../../backend/api/present.php', {
                method: 'POST',
                body: JSON.stringify(formData),
            })
            .then(response=>response.json())
            .then(response => {
                if (response.success) {
                    const section = document.getElementById('form-menu');
                    section.innerHTML = '';
                    const successMessage = document.createElement('p');
                    successMessage.textContent = 'Успeшно добавен подарък!';
                    section.appendChild(successMessage);
                    setTimeout(() => {
                        successMessage.style.display = 'none';
                        showPresents();
                    }, 2000);
                } else {
                    document.getElementById('error').innerText = "Грешка: " + response.message;
                }
            });	
        }
    };

    if(document.getElementById('presents-form')){
        document.getElementById('presents-form').addEventListener('submit', onFormSubmitted);
    }
}

function addPresent() {
    let section = document.getElementById('form-menu');
    if(!section){
        return;
    }
    section.innerHTML = '';
    let form = document.createElement('form');
    form.id = 'presents-form';

    const titleLabel = document.createElement('label');
    titleLabel.setAttribute('for', 'title');
    titleLabel.textContent = 'Подарък:';
    const titleInput = document.createElement('input');
    titleInput.setAttribute('type', 'text');
    titleInput.setAttribute('name', 'title');
    titleInput.placeholder = 'Подарък';

    const priceLabel = document.createElement('label');
    priceLabel.setAttribute('for', 'price');
    priceLabel.textContent = 'Цена:';
    const priceInput = document.createElement('input');
    priceInput.setAttribute('type', 'number');
    priceInput.setAttribute('id', 'price');
    priceInput.setAttribute('name', 'price');
    priceInput.setAttribute('min', '0');
    priceInput.setAttribute('step', '0.01');
    priceInput.setAttribute('placeholder', '0.00');
    priceInput.placeholder = 'Цена';

    const endDateLabel = document.createElement('label');
    endDateLabel.setAttribute('for', 'endDate');
    endDateLabel.textContent = 'Крайна дата:';
    const endDateInput = document.createElement('input');
    endDateInput.setAttribute('type', 'date');
    endDateInput.setAttribute('id', 'endDate');
    endDateInput.setAttribute('name', 'endDate');

    const today = new Date().toISOString().split('T')[0];
    endDateInput.setAttribute('min', today);

    form.appendChild(titleLabel);
    form.appendChild(titleInput);
    form.appendChild(priceLabel);
    form.appendChild(priceInput);
    form.appendChild(endDateLabel);
    form.appendChild(endDateInput);

    const pErr = document.createElement('p');
    pErr.id = 'error';
    form.appendChild(pErr);

    const button = document.createElement('button');
    button.textContent = 'Добави подарък';
    button.type = 'submit';

    form.appendChild(button);

    section.appendChild(form);

    presentsFormListen();
}

function moneyFormListen() {
    let section = document.getElementById('money-menu');
    if(!section){
        return;
    }

    const isValidPrice = field => {
        if (field.value == "") {
            return "Полетo \"Цена\" е задължително."
        }
        
        if (parseFloat(field.value) < 0) {
            return "Въведен е невалидна цена."
        }
        return "";
    }

    const validatePrice = event => {
        price = event.target;
        document.querySelector("p[id='error']").innerText = isValidPrice(price);
    };

    document.querySelector("input[name='price']").addEventListener('keyup', validatePrice);

    const validate = fields => {
        
        for (const field of fields) {
            if(field == "") {
                document.getElementById('error').innerText = "Моля, попълнени всички задължителни полета.";
                return false;
            }
        }
        
        document.getElementById('error').innerText = "";
        return true;
    }

    const onFormSubmitted = event => {
        event.preventDefault();

        const formElement = event.target;
        
        const formData = {
            eventId: eventID,
            price: formElement.querySelector("input[name='price'").value,
        };
        
        const fields = [
            formData.eventId,
            formData.price, 
        ];
        
        if (validate(fields)) {		
            fetch('../../backend/api/present.php', {
                method: 'POST',
                body: JSON.stringify(formData),
            })
            .then(response=>response.json())
            .then(response => {
                if (response.success) {
                    const section = document.getElementById('form-menu');
                    section.innerHTML = '';
                    const successMessage = document.createElement('p');
                    successMessage.textContent = 'Успeшно изпратени пари!';
                    section.appendChild(successMessage);
                    setTimeout(() => {
                        successMessage.style.display='none';
                    }, 2000);
                } else {
                    document.getElementById('error').innerText = "Грешка: " + response.message;
                }
            });	
        }
    };

    if(document.getElementById('money-form')){
        document.getElementById('money-form').addEventListener('submit', onFormSubmitted);
    }
}
function addMoney() {
    let section = document.getElementById('form-menu');
    if(!section){
        return;
    }
    section.innerHTML = '';
    let form = document.createElement('form');
    form.id = 'money-form';

    const priceLabel = document.createElement('label');
    priceLabel.setAttribute('for', 'price');
    priceLabel.textContent = 'Изпрати пари към подаръка:';
    const priceInput = document.createElement('input');
    priceInput.setAttribute('type', 'number');
    priceInput.setAttribute('id', 'price');
    priceInput.setAttribute('name', 'price');
    priceInput.setAttribute('min', '0');
    priceInput.setAttribute('step', '0.01');
    priceInput.setAttribute('placeholder', '0.00');
    priceInput.placeholder = 'Цена';

    form.appendChild(priceLabel);
    form.appendChild(priceInput);

    const pErr = document.createElement('p');
    pErr.id = 'error';
    form.appendChild(pErr);

    const button = document.createElement('button');
    button.textContent = 'Изпрати пари';
    button.type = 'submit';

    form.appendChild(button);

    section.appendChild(form);

    moneyFormListen();
}

function showPresents() {
    let menu = document.getElementById("event-menu");
    menu.innerHTML = '';
    menu.style.display = 'flex';

    const div = document.createElement('div');
    div.className = 'presents-buttons';
    
    if(admin){
        const addButton = document.createElement('button');
        addButton.textContent = 'Добави';
        addButton.onclick = function() {
            addPresent();
        };
        // const editButton = document.createElement('button');
        // editButton.textContent = 'Промяна';
        // editButton.setAttribute('onclick', 'editPresent()');
        // button.onclick = function() {
        //     navigateToEvent(event.id); 
        // };


        div.appendChild(addButton);
        // div.appendChild(editButton);

    }
    const addMButton = document.createElement('button');
    addMButton.textContent = 'Добави пари';
    addMButton.onclick = function() {
        addMoney();
    };
    div.appendChild(addMButton);
    menu.appendChild(div);
    
    
    let sectionForm = document.createElement('section');
    sectionForm.id = 'form-menu';
    menu.appendChild(sectionForm);  

    personalizedData.presents.forEach(present => {
        const section = document.createElement('section');
        section.id = present.id;

        const div1 = document.createElement('div');

        const h3 = document.createElement('h3');
        h3.textContent = present.title;
        const p = document.createElement('p');
        p.textContent = present.endDate;

        div1.appendChild(h3);
        div1.appendChild(p);

        const div2 = document.createElement('div');

        const h4 = document.createElement('h4');
        h4.textContent = present.price;
        
        div2.appendChild(h4);

        section.appendChild(div1);
        section.appendChild(div2);

        if(admin) {
            const div3 = document.createElement('div');
            
            const editButton = document.createElement('button');
            editButton.textContent = "Промени"
            editButton.onclick = function() {
                editPresent(present.id)
            };

            div3.appendChild(editButton);

            section.appendChild(div3);
        }

        menu.appendChild(section);
    });

    // 
}

function musicFormListen() {
    let section = document.getElementById('formMusic-menu');
    if(!section){
        return;
    }

    const isValidText = field => {
        if (field.value.length < 1) {
            return "Полетo \"Текст\" трябва да съдържа поне 1 символ."
        }
        if (field.value.length > 200) {
            return "Полетo \" Текст \" трябва да съдържа не повече от 200 символа."
        }
        
        return "";
    }

    const validateText= event => {
        text = event.target;
        document.querySelector("p[id='errors']").innerText = isValidText(text);
    };

    document.querySelector("input[name='textInput']").addEventListener('keyup', validateText);

    const validate = () => {
        
        const field = document.getElementById('textInput').value;
            if(field == "") {
                document.getElementById('errors').innerText = "Моля, попълнете полето за текст.";
                return false;
            }
            if(field.length > 200){
                document.getElementById('errors').innerText = "Моля, полето за текст да не е повече от 200 символа.";
                return false;
            }
        
        document.getElementById('errors').innerText = "";
        return true;
    }

    const onFormSubmitted = event => {
        event.preventDefault();

        const formData = new FormData(event.target);

        formData.append('eventId', eventID)
        
        if (validate()) {		
            fetch('../../backend/api/present.php', {
                method: 'POST',
                body: JSON.stringify(formData),
            })
            .then(response=>response.json())
            .then(response => {
                if (response.success) {
                    const section = document.getElementById('formMusic-menu');
                    section.innerHTML = '';
                    const successMessage = document.createElement('p');
                    successMessage.textContent = 'Успeшно добавен музикален поздрав!';
                    section.appendChild(successMessage);
                    setTimeout(() => {
                        successMessage.style.display = 'none';
                        showMusic();
                    }, 2000);
                } else {
                    document.getElementById('errors').innerText = "Грешка: " + response.message;
                }
            });	
        }
    };

    if(document.getElementById('uploadMusicForm')){
        document.getElementById('uploadMusicForm').addEventListener('submit', onFormSubmitted);
    }
}

function addMusic(){
    let section = document.getElementById('formMusic-menu');
    if(!section){
        return;
    }
    section.innerHTML = '';
    const form = document.createElement('form');
            form.setAttribute('id', 'uploadMusicForm');

            const fileLabel = document.createElement('label');
            fileLabel.setAttribute('for', 'musicInput');
            fileLabel.textContent = 'Изберете музикален поздрав:';
            const fileInput = document.createElement('input');
            fileInput.setAttribute('type', 'file');
            fileInput.accept = 'audio/*';
            fileInput.setAttribute('id', 'musicInput');
            fileInput.setAttribute('name', 'musicInput');

            const textLabel = document.createElement('label');
            textLabel.setAttribute('for', 'textInput');
            textLabel.textContent = 'Добавете текст:';
            const textInput = document.createElement('textarea');
            textInput.setAttribute('id', 'textInput');
            textInput.setAttribute('name', 'textInput');
            textInput.setAttribute('rows', '4'); 
            textInput.setAttribute('cols', '50');

            const pErr = document.createElement('p');
            pErr.id = 'errors';
            
            const submitButton = document.createElement('button');
            submitButton.setAttribute('type', 'submit');
            submitButton.textContent = 'Качи';

            form.appendChild(fileLabel);
            form.appendChild(fileInput);
            form.appendChild(textLabel);
            form.appendChild(textInput);
            form.appendChild(pErr);
            form.appendChild(submitButton);

    section.appendChild(form);

    musicFormListen();
}

function removeMusic(musicId) {
    fetch('../../backend/api/present.php', {
        method: 'POST',
        body: JSON.stringify({id: musicId}),
    })
    .then(response=>response.json())
    .then(response => {
        if (response.success) {
            const section = document.getElementById('formMusic-menu');
            section.innerHTML = '';
            const successMessage = document.createElement('p');
            successMessage.textContent = 'Успeшно премахнат музикален проздрав!';

            setTimeout(() => {
                section.innerHTML= '';
                showMusic();
            }, 2000);
        } else {
            document.getElementById('errors').innerText = "Грешка: " + response.message;
        }
    });	
}

function showMusic() {
    let menu = document.getElementById("event-menu");
    menu.innerHTML = '';
    menu.style.display = 'flex';

    const div = document.createElement('div');
    div.className = 'music-buttons';
    
    const addButton = document.createElement('button');
    addButton.textContent = 'Добави музика';
    addButton.onclick = function() {
        addMusic();
    };

    div.appendChild(addButton);
    
    menu.appendChild(div);
    
    
    let sectionForm = document.createElement('section');
    sectionForm.id = 'formMusic-menu';
    menu.appendChild(sectionForm);  

    personalizedData.musics.forEach(music => {
        const section = document.createElement('section');
        section.id = music.id;

        const audio = document.createElement('audio');

        audio.src = music.musicUrl;

        audio.controls = true;
        audio.autoplay = false;

        const p = document.createElement('p');
        p.textContent = music.text;

        section.appendChild(audio);
        section.appendChild(p);

        if(admin) {
            const div3 = document.createElement('div');
            
            const svgNS = "http://www.w3.org/2000/svg"; 

            const svg = document.createElementNS(svgNS, "svg");
            svg.setAttribute("class", "w-6 h-6 text-gray-800 dark:text-white cursor-pointer"); // добавяне на cursor-pointer, за да се покаже, че това е кликващо елемент
            svg.setAttribute("aria-hidden", "true");
            svg.setAttribute("xmlns", svgNS);
            svg.setAttribute("width", "24");
            svg.setAttribute("height", "24");
            svg.setAttribute("fill", "none");
            svg.setAttribute("viewBox", "0 0 24 24");

            svg.addEventListener("click", function() {
                removeMusic(music.id);
            });

            const path = document.createElementNS(svgNS, "path");
            path.setAttribute("stroke", "currentColor");
            path.setAttribute("stroke-linecap", "round");
            path.setAttribute("stroke-width", "2");
            path.setAttribute("d", "m6 6 12 12m3-6a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z");

            svg.appendChild(path);

            div3.appendChild(svg);

            section.appendChild(div3);
        }

        menu.appendChild(section);
    });
}

function cardsFormListen() {
    let section = document.getElementById('formCard-menu');
    if(!section){
        return;
    }

    const isValidText = field => {
        if (field.value.length < 1) {
            return "Полетo \"Текст\" трябва да съдържа поне 1 символ."
        }
        if (field.value.length > 200) {
            return "Полетo \" Текст \" трябва да съдържа не повече от 200 символа."
        }
        
        return "";
    }

    const validateText= event => {
        text = event.target;
        document.querySelector("p[id='errors']").innerText = isValidText(text);
    };

    document.querySelector("textarea[name='textInput']").addEventListener('keyup', validateText);

    const validate = () => {
        
        const field = document.getElementById('textInput').value;
            if(field == "") {
                document.getElementById('errors').innerText = "Моля, попълнете полето за текст.";
                return false;
            }
            if(field.length > 200){
                document.getElementById('errors').innerText = "Моля, полето за текст да не е повече от 200 символа.";
                return false;
            }
        
        document.getElementById('errors').innerText = "";
        return true;
    }

    const onFormSubmitted = event => {
        event.preventDefault();

        const formData = new FormData();
        const fileField = document.getElementById('fileInput');
        if (fileField.files.length > 0) {
            formData.append("photo", fileField.files[0])

        }
        
        const text = document.getElementById('textInput').value;
        formData.append("name", text)
        formData.append('eventId', eventID)
        
        if (validate()) {		
            fetch('../../../backend/api/upload_image.php', {
                method: 'POST',
                body: formData,
            })
            .then(response=>response.json())
            .then(response => {
                if (response.success) {
                    const section = document.getElementById('formCard-menu');
                    section.innerHTML = '';
                    const successMessage = document.createElement('p');
                    successMessage.textContent = 'Успeшно добавена картичка!';
                    section.appendChild(successMessage);
                    setTimeout(() => {
                        successMessage.style.display = 'none';
                        showCards();
                    }, 2000);
                } else {
                    document.getElementById('errors').innerText = "Грешка: " + response.message;
                }
            });	
        }
    };

    if(document.getElementById('uploadForm')){
        document.getElementById('uploadForm').addEventListener('submit', onFormSubmitted);
    }
}

function addCard(){
    let section = document.getElementById('formCard-menu');
    if(!section){
        return;
    }
    section.innerHTML = '';
    const form = document.createElement('form');
        form.setAttribute('id', 'uploadForm');

        const fileLabel = document.createElement('label');
        fileLabel.setAttribute('for', 'fileInput');
        fileLabel.textContent = 'Изберете снимка:';
        const fileInput = document.createElement('input');
        fileInput.setAttribute('type', 'file');
        fileInput.setAttribute('id', 'fileInput');
        fileInput.setAttribute('name', 'fileInput');

        const textLabel = document.createElement('label');
        textLabel.setAttribute('for', 'textInput');
        textLabel.textContent = 'Добавете текст:';
        const textInput = document.createElement('textarea');
        textInput.setAttribute('id', 'textInput');
        textInput.setAttribute('name', 'textInput');
        textInput.setAttribute('rows', '4'); 
        textInput.setAttribute('cols', '50');

        const pErr = document.createElement('p');
        pErr.id = 'errors';
        
        const submitButton = document.createElement('button');
        submitButton.setAttribute('type', 'submit');
        submitButton.textContent = 'Качи';

        form.appendChild(fileLabel);
        form.appendChild(fileInput);
        form.appendChild(textLabel);
        form.appendChild(textInput);
        form.appendChild(pErr);
        form.appendChild(submitButton);

    section.appendChild(form);

    cardsFormListen();
}

function removeCard(cardId) {
    fetch('../../backend/api/present.php', {
        method: 'POST',
        body: JSON.stringify({id: cardId}),
    })
    .then(response=>response.json())
    .then(response => {
        if (response.success) {
            const section = document.getElementById('formCard-menu');
            section.innerHTML = '';
            const successMessage = document.createElement('p');
            successMessage.textContent = 'Успeшно премахната картичка!';

            setTimeout(() => {
                section.innerHTML= '';
                showCards();
            }, 2000);
        } else {
            document.getElementById('errors').innerText = "Грешка: " + response.message;
        }
    });	
}

function showCards() {
    let menu = document.getElementById("event-menu");
    menu.innerHTML = '';
    menu.style.display = 'flex';

    const div = document.createElement('div');
    div.className = 'card-buttons';
    
    const addButton = document.createElement('button');
    addButton.textContent = 'Добави картичка';
    addButton.onclick = function() {
        addCard();
    };

    div.appendChild(addButton);
    
    menu.appendChild(div);
    
    
    let sectionForm = document.createElement('section');
    sectionForm.id = 'formCard-menu';
    menu.appendChild(sectionForm);  

    personalizedData.cards.forEach(card => {
        const section = document.createElement('section');
        section.id = card.id;

        const img = document.createElement('img');

        img.src= '../../../files/upload_image/' + card.imgUrl;
        img.alt="Card Image";
        
        const p = document.createElement('p');
        p.textContent = card.text;

        section.appendChild(img);
        section.appendChild(p);

        if(admin) {
            const div3 = document.createElement('div');
            
            const svgNS = "http://www.w3.org/2000/svg"; 

            const svg = document.createElementNS(svgNS, "svg");
            svg.setAttribute("class", "w-6 h-6 text-gray-800 dark:text-white cursor-pointer"); // добавяне на cursor-pointer, за да се покаже, че това е кликващо елемент
            svg.setAttribute("aria-hidden", "true");
            svg.setAttribute("xmlns", svgNS);
            svg.setAttribute("width", "24");
            svg.setAttribute("height", "24");
            svg.setAttribute("fill", "none");
            svg.setAttribute("viewBox", "0 0 24 24");

            svg.addEventListener("click", function() {
                removeCard(card.id);
            });

            const path = document.createElementNS(svgNS, "path");
            path.setAttribute("stroke", "currentColor");
            path.setAttribute("stroke-linecap", "round");
            path.setAttribute("stroke-width", "2");
            path.setAttribute("d", "m6 6 12 12m3-6a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z");

            svg.appendChild(path);

            div3.appendChild(svg);

            section.appendChild(div3);
        }

        menu.appendChild(section);
    });
}

function formatDate(date) {
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    if (day < 10) {
        day = '0' + day;
    }

    if (month < 10) {
        month = '0' + month;
    }

    return day + '.' + month + '.' + year;
}

function joinEvent() {
    fetch('../../backend/api/join-event.php', {
        method: 'POST',
        body: JSON.stringify({id: eventID}),
    })
    .then(response=>response.json())
    .then(response => {
        if (response.success) {
            loadParticipants();
        } else {
            // error
            // document.getElementById('msg').innerText = 'Грешка' + response.message;
        }
    });
}

function makeHelper(userId){
    fetch('../../backend/api/join-event.php', {
        method: 'POST',
        body: JSON.stringify({id: userId}),
    })
    .then(response=>response.json())
    .then(response => {
        if (response.success) {
            loadParticipants();
        } else {
            // error
            // document.getElementById('msg').innerText = 'Грешка' + response.message;
        }
    });
}

function removeHelper(userId){
    fetch('../../backend/api/join-event.php', {
        method: 'POST',
        body: JSON.stringify({id: userId}),
    })
    .then(response=>response.json())
    .then(response => {
        if (response.success) {
            loadParticipants();
        } else {
            // error
            // document.getElementById('msg').innerText = 'Грешка' + response.message;
        }
    });
}

function showParticipants(userParticipants) {
    let participantsList = document.getElementById('participants-list');
    participantsList.innerHTML = '';
    let participantsCounter = document.getElementById('participants-counter');
    participantsCounter.innerHTML = userParticipants.length;
    userParticipants.forEach(user => {
        let li = document.createElement('li');
        li.textContent = user.name;
        if(user.isHelper){
            const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svg.setAttribute("class", "w-6 h-6 text-gray-800 dark:text-white");
            svg.setAttribute("aria-hidden", "true");
            svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
            svg.setAttribute("width", "24");
            svg.setAttribute("height", "24");
            svg.setAttribute("fill", "currentColor");
            svg.setAttribute("viewBox", "0 0 24 24");

            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute("fill-rule", "evenodd");
            path.setAttribute("d", "M12 2a7 7 0 0 0-7 7 3 3 0 0 0-3 3v2a3 3 0 0 0 3 3h1a1 1 0 0 0 1-1V9a5 5 0 1 1 10 0v7.083A2.919 2.919 0 0 1 14.083 19H14a2 2 0 0 0-2-2h-1a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h1a2 2 0 0 0 1.732-1h.351a4.917 4.917 0 0 0 4.83-4H19a3 3 0 0 0 3-3v-2a3 3 0 0 0-3-3 7 7 0 0 0-7-7Zm1.45 3.275a4 4 0 0 0-4.352.976 1 1 0 0 0 1.452 1.376 2.001 2.001 0 0 1 2.836-.067 1 1 0 1 0 1.386-1.442 4 4 0 0 0-1.321-.843Z");
            path.setAttribute("clip-rule", "evenodd");

            if(admin) {
                svg.addEventListener("click", function() {
                    removeHelper(user.id)
                });
            }

            svg.appendChild(path);
            li.appendChild(svg); 
        }

        if(admin && !user.isHelper){
            const svgNS = "http://www.w3.org/2000/svg"; 
            
            const svg = document.createElementNS(svgNS, "svg");
            svg.setAttribute("class", "w-6 h-6 text-gray-800 dark:text-white");
            svg.setAttribute("aria-hidden", "true");
            svg.setAttribute("xmlns", svgNS);
            svg.setAttribute("width", "24");
            svg.setAttribute("height", "24");
            svg.setAttribute("fill", "none");
            svg.setAttribute("viewBox", "0 0 24 24");

            const path = document.createElementNS(svgNS, "path");
            path.setAttribute("stroke", "currentColor");
            path.setAttribute("stroke-linecap", "round");
            path.setAttribute("stroke-linejoin", "round");
            path.setAttribute("stroke-width", "2");
            path.setAttribute("d", "M5 12h14m-7 7V5");

            svg.addEventListener("click", function() {
                makeHelper(user.id)
            });

            svg.appendChild(path);
            li.appendChild(svg); 
        }
        
        participantsList.appendChild(li);
    });


}

function loadParticipants(){
    fetch('../../../backend/api/get_User_Participants.php', {
        method: 'POST',
        body: JSON.stringify({id: eventID}),
    })
    .then(response=>response.json())
    .then(response => {
        if (response.success) {
            showParticipants(response.userParticipants);
        } else {
            // error
            let li = document.createElement('li');
            li.innerHTML = 'Грешка: Не можгат да се зарадят участниците към събитието';
            document.getElementById('participants-list').appendChild(li);
        }
    });
}

function loadEvent() {
    let title = document.getElementById('title');
    let creator = document.getElementById('creator');
    let stDate = document.getElementById('stDate');
    let enDate = document.getElementById('enDate');
    let location = document.getElementById('location');    

    let mainSection = document.getElementById('main-section');

    title.innerHTML = eventData.title;
    if(eventData.isAnonnymus){
        creator.innerHTML = eventData.creator;
    }
    let startDate = new Date(eventData.dateStart);
    let endDate = new Date(eventData.dateEnd);
    stDate.innerHTML = "Започва на:" + formatDate(startDate);
    enDate.innerHTML = "Приключва на:" + formatDate(endDate);

    location.innerHTML = eventData.location;

    loadParticipants();

    if(eventData.isPersonalized){
        let p1 = document.createElement('p');
        let h3 = document.createElement('h3');
        h3.innerHTML = personalizedData.celebrator;
        p1.innerHTML = "Събитие за: ";
        mainSection.appendChild(p1);
        mainSection.appendChild(h3);
    }

    let p2 = document.createElement('p');
    p2.innerHTML = eventData.description;
    mainSection.appendChild(p2);

    let ul = document.createElement('ul');
    ul.id = 'status-list';
    if(eventData.isGlobal){
        let li = document.createElement('li');
        li.innerHTML = 'Публично събитие';
        ul.appendChild(li);
    }

    if(eventData.isAnonnymus) {
        let li = document.createElement('li');
        li.innerHTML = 'Анонимно събитие';
        ul.appendChild(li);
    }

    if(eventData.isPersonalized && personalizedData?.isVisible) {
        let li = document.createElement('li');
        li.innerHTML = 'Събитието е скрито за ' + personalizedData.celebrator;
        ul.appendChild(li);
    }

    mainSection.append(ul);
    
    let personalPresents = document.getElementById('personal-buttons');
    if(eventData.isPersonalized){
        personalPresents.style.display = 'flex';
        
    }
    else{
        personalPresents.style.display = 'none';
    }



}

function getQueryParam() {
    let queryParam = {};
    let queryString = window.location.search.substring(1);
    let pair = queryString.split('=');
    queryParam[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
    
    return parseInt(queryParam.id);
}

//ako ne sa personalizirani dobavi mnogo if

var eventData = null;
var personalizedData = null;

fetch('../../../backend/api/get_User_Admin.php', {
    method: 'POST',
    body: JSON.stringify({id: eventID}),
})
.then(response=>response.json())
.then(response => {
    if (response.success) {
        admin = true;
    } else {
        // error
        // document.getElementById('msg').innerText = 'Грешка' + response.message;
    }
});

fetch('../../../backend/api/get_Event_All_Info.php', {
    method: 'POST',
    body: JSON.stringify({id: eventID}),
})
.then(response=>response.json())
.then(response => {
    if (response.success) {
        eventData = new Event(response.data.id, response.data.title, response.data.description, response.data.dateStart, response.data.dateEnd, response.data.timeStart, response.data.timeEnd, response.data.location, response.data.comments, response.data.isAnonnymus, !!response.data.isPersonalized, response.data.isGlobal)
        if(eventData.isPersonalized) {
            personalizedData = new Personalized(response.data.personalizedData.isVisible, response.data.personalizedData.celebrator, response.data.personalizedData.presents, response.data.personalizedData.cards, response.data.personalizedData.money, response.data.personalizedData.musics );
        }
        loadEvent();
    } else {
        // error
        // document.getElementById('msg').innerText = 'Грешка' + response.message;
    }
});


