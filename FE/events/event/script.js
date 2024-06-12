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
            fetch('../../../backend/api/save_Present_DB.php', {
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
                        window.location.replace('event.html?id=' + eventID)
                    }, 2000);
                } else {
                    document.getElementById('error').innerText = "Грешка: " + response.message;
                }
            }).catch(err => console.err('Грешка: '+ err.message));	
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
    titleLabel.textContent = 'Подарък:';
    const titleInput = document.createElement('input');
    titleInput.setAttribute('type', 'text');
    titleInput.setAttribute('name', 'title');
    titleInput.placeholder = 'Подарък';
    titleInput.className = 'inputs inputs-wi';
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
    priceInput.className = 'inputs inputs-wi';

    const endDateLabel = document.createElement('label');
    endDateLabel.setAttribute('for', 'endDate');
    endDateLabel.textContent = 'Крайна дата:';
    const endDateInput = document.createElement('input');
    endDateInput.setAttribute('type', 'date');
    endDateInput.className = 'inputs inputs-wi';
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
    button.className = 'buttons ';
    button.style.alignSelf = 'center';
    button.type = 'submit';

    form.appendChild(button);

    section.appendChild(form);

    presentsFormListen();
}

function moneyFormListen() {
    let section = document.getElementById('money-form');
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
            money: parseFloat(personalizedData.money) + parseFloat(formElement.querySelector("input[name='price'").value),
        };
        
        const fields = [
            formData.eventId,
            formData.money, 
        ];
        
        if (validate(fields)) {		
            fetch('../../../backend/api/save_Money_DB.php', {
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
                        window.location.replace('event.html?id=' + eventID);
                    }, 2000);
                } else {
                    document.getElementById('error').innerText = "Грешка: " + response.message;
                }
            }).catch(err => console.err('Грешка: '+ err.message));	
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
    priceInput.className = 'inputs bigger'

    form.appendChild(priceLabel);
    form.appendChild(priceInput);

    const pErr = document.createElement('p');
    pErr.id = 'error';
    form.appendChild(pErr);

    const button = document.createElement('button');
    button.textContent = 'Изпрати пари';
    button.className = 'buttons';
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
        addButton.className = 'buttons small'
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
    addMButton.className = 'buttons small'

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

        section.className = 'present-templ';

        const div1 = document.createElement('div');

        const h3 = document.createElement('h2');
        h3.textContent = present.title;
        const p = document.createElement('p');
        p.textContent = present.endDate;

        div1.appendChild(h3);
        div1.appendChild(p);

        const div2 = document.createElement('div');

        const h4 = document.createElement('h4');
        h4.textContent = present.price + ' лв.';
        
        div2.appendChild(h4);

        section.appendChild(div1);
        section.appendChild(div2);

        if(admin) {
            const div3 = document.createElement('div');
            
            

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
        const fileField = document.getElementById('musicInput');
        
        const formElement = event.target;
        
        const formEl = {
            name: formElement.querySelector("textarea[name='textInput']").value,
            musicURL: fileField.files[0].name,
            eventId: eventID
        };
            
        let formData = new FormData();
        if (fileField.files.length > 0) {
            formData.append("musicURL", fileField.files[0])
        }

        const text = document.getElementById('textInput').value;
        formData.append("name", text);
        formData.append('eventId', eventID)

        if (validate()) {		
            fetch('../../../backend/api/upload_music.php', {
                method: 'POST',
                body: formData,
            })
            .then(response=>response.json())
            .then(response => {
                if (response.success) {
                    //
                } else {
                    document.getElementById('errors').innerText = "Грешка: " + response.message;
                }
            }).catch(err => console.err('Грешка: '+ err.message));	

            fetch('../../../backend/api/save_Music_DB.php', {
                method: 'POST',
                body: JSON.stringify(formEl),
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
                        window.location.replace('event.html?id=' + eventID);
                    }, 2000);
                } else {
                    document.getElementById('errors').innerText = "Грешка: " + response.message;
                }
            }).catch(err => console.err('Грешка: '+ err.message));	
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
    form.enctype= 'multipart/form-data';
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
            submitButton.className = 'buttons small';

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
    fetch('../../../backend/api/delete_Music.php', {
        method: 'POST',
        body: JSON.stringify({musicId: musicId}),
    })
    .then(response=>response.json())
    .then(response => {
        if (response.success) {
            const section = document.getElementById('formMusic-menu');
            section.innerHTML = '';
            const successMessage = document.createElement('p');
            successMessage.textContent = 'Успeшно премахнат музикален проздрав!';

            setTimeout(() => {
                window.location.replace('event.html?id=' + eventID);
            }, 2000);
        } else {
            document.getElementById('errors').innerText = "Грешка: " + response.message;
        }
    }).catch(err => console.err('Грешка: '+ err.message));	
}

function showMusic() {
    let menu = document.getElementById("event-menu");
    menu.innerHTML = '';
    menu.style.display = 'flex';

    
    const addButton = document.createElement('button');
    addButton.textContent = 'Добави музика';
    addButton.className = 'buttons medium';
    addButton.onclick = function() {
        addMusic();
    };

    menu.appendChild(addButton);
    
    let sectionForm = document.createElement('section');
    sectionForm.id = 'formMusic-menu';
    menu.appendChild(sectionForm);  

    personalizedData.musics.forEach(music => {
        const section = document.createElement('section');
        section.id = music.id;
        section.className = 'music-templ';

        const audio = document.createElement('audio');

        audio.src = '../../../files/upload_audio/' + music.musicURL;

        audio.controls = true;
        audio.autoplay = false;

        const p = document.createElement('p');
        p.textContent = music.title;

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
        const fileField = document.getElementById('fileInput');

        const formElement = event.target;

        const formEl = {
            name: formElement.querySelector("textarea[name='textInput']").value,
            photo: fileField.files[0].name,
            eventId: eventID
        };

        let formData = new FormData();
        if (fileField.files.length > 0) {
            formData.append("photo", fileField.files[0])

        }
        
        const text = document.getElementById('textInput').value;
        formData.append("name", text);
        formData.append('eventId', eventID);
        
        if (validate()) {		
            fetch('../../../backend/api/upload_image.php', {
                method: 'POST',
                body: formData,
            })
            .then(response=>response.json())
            .then(response => {
                if (response.success) {
                    //
                } else {
                    document.getElementById('errors').innerText = "Грешка: " + response.message;
                }
            }).catch(err => console.err('Грешка: '+ err.message));	

            fetch('../../../backend/api/save_Card_DB.php', {
                method: 'POST',
                body: JSON.stringify(formEl),
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
                        window.location.replace('event.html?id=' + eventID);
                    }, 2000);
                } else {
                    document.getElementById('errors').innerText = "Грешка: " + response.message;
                }
            }).catch(err => console.err('Грешка: '+ err.message));	
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
        textInput.setAttribute('class', 'inputs');
        
        textInput.setAttribute('id', 'textInput');
        textInput.setAttribute('name', 'textInput');
        textInput.setAttribute('rows', '4'); 
        textInput.setAttribute('cols', '50');

        const pErr = document.createElement('p');
        pErr.id = 'errors';
        
        const submitButton = document.createElement('button');
        submitButton.setAttribute('type', 'submit');
        submitButton.textContent = 'Качи';
        submitButton.className = 'buttons small';
        submitButton.style.alignSelf = 'center';


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
    fetch('../../../backend/api/delete_Card.php', {
        method: 'POST',
        body: JSON.stringify({cardId: cardId}),
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
                window.location.replace('event.html?id=' + eventID);
            }, 2000);
        } else {
            document.getElementById('errors').innerText = "Грешка: " + response.message;
        }
    }).catch(err => console.err('Грешка: '+ err.message));	
}

function showCards() {
    let menu = document.getElementById("event-menu");
    menu.innerHTML = '';
    menu.style.display = 'flex';

    const div = document.createElement('div');
    div.className = 'card-buttons';
    
    const addButton = document.createElement('button');
    addButton.textContent = 'Добави картичка';
    addButton.className = 'buttons medium';
    addButton.onclick = function() {
        addCard();
    };

    div.appendChild(addButton);
    
    menu.appendChild(addButton);
    
    
    let sectionForm = document.createElement('section');
    sectionForm.id = 'formCard-menu';
    menu.appendChild(sectionForm);  

    personalizedData.cards.forEach(card => {
        const section = document.createElement('section');
        section.id = card.id;
        section.className = 'card-background';

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
    fetch('../../../backend/api/save_User_Event.php', {
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
    }).catch(err => console.log("Грешка в заявката: " + err.message ));
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
    }).catch(err => console.err('Грешка: '+ err.message));
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
            document.getElementById('joinbutton').style.visibility = 'hidden';
        }
    }).catch(err => console.err('Грешка: '+ err.message));
}

function showParticipants(userParticipants) {
    let participantsList = document.getElementById('participants-list');
    if(eventData.isAnonnymus === "1"){
        participantsList.innerHTML = 'Събитието е анонимно';
        return;
    }
    participantsList.innerHTML = '';
    let participantsCounter = document.getElementById('participants-counter');
    participantsCounter.innerHTML = userParticipants.length;
    userParticipants.forEach(user => {
        let li = document.createElement('li');
        li.textContent = user.name;
        if(user.isHelper === '1'){
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

        if(admin && user.isHelper === '0' && user.isAdmin === '0'){
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

        if(eventData.isPersonalized === "1"){
            if(personalizedData.celebrator === user.name){
                const svgNS = "http://www.w3.org/2000/svg";

                // Create SVG element
                const svg = document.createElementNS(svgNS, "svg");
                svg.setAttribute("class", "w-6 h-6 text-gray-800 dark:text-white");
                svg.setAttribute("aria-hidden", "true");
                svg.setAttribute("xmlns", svgNS);
                svg.setAttribute("width", "24");
                svg.setAttribute("height", "24");
                svg.setAttribute("fill", "currentColor");
                svg.setAttribute("viewBox", "0 0 24 24");

                // Create first path element
                const path1 = document.createElementNS(svgNS, "path");
                path1.setAttribute("d", "M11 9a1 1 0 1 1 2 0 1 1 0 0 1-2 0Z");

                // Create second path element
                const path2 = document.createElementNS(svgNS, "path");
                path2.setAttribute("fill-rule", "evenodd");
                path2.setAttribute("d", "M9.896 3.051a2.681 2.681 0 0 1 4.208 0c.147.186.38.282.615.255a2.681 2.681 0 0 1 2.976 2.975.681.681 0 0 0 .254.615 2.681 2.681 0 0 1 0 4.208.682.682 0 0 0-.254.615 2.681 2.681 0 0 1-2.976 2.976.681.681 0 0 0-.615.254 2.682 2.682 0 0 1-4.208 0 .681.681 0 0 0-.614-.255 2.681 2.681 0 0 1-2.976-2.975.681.681 0 0 0-.255-.615 2.681 2.681 0 0 1 0-4.208.681.681 0 0 0 .255-.615 2.681 2.681 0 0 1 2.976-2.975.681.681 0 0 0 .614-.255ZM12 6a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z");
                path2.setAttribute("clip-rule", "evenodd");

                // Create third path element
                const path3 = document.createElementNS(svgNS, "path");
                path3.setAttribute("d", "M5.395 15.055 4.07 19a1 1 0 0 0 1.264 1.267l1.95-.65 1.144 1.707A1 1 0 0 0 10.2 21.1l1.12-3.18a4.641 4.641 0 0 1-2.515-1.208 4.667 4.667 0 0 1-3.411-1.656Zm7.269 2.867 1.12 3.177a1 1 0 0 0 1.773.224l1.144-1.707 1.95.65A1 1 0 0 0 19.915 19l-1.32-3.93a4.667 4.667 0 0 1-3.4 1.642 4.643 4.643 0 0 1-2.53 1.21Z");

                // Append paths to SVG
                svg.appendChild(path1);
                svg.appendChild(path2);
                svg.appendChild(path3);

                li.appendChild(svg); 
            }
        }

        if(user.isAdmin === '1') {
            const svgNS = "http://www.w3.org/2000/svg";

            // Create SVG element
            const svg = document.createElementNS(svgNS, "svg");
            svg.setAttribute("class", "w-6 h-6 text-gray-800 dark:text-white");
            svg.setAttribute("aria-hidden", "true");
            svg.setAttribute("xmlns", svgNS);
            svg.setAttribute("width", "24");
            svg.setAttribute("height", "24");
            svg.setAttribute("fill", "currentColor");
            svg.setAttribute("viewBox", "0 0 24 24");
        
            // Create path element
            const path = document.createElementNS(svgNS, "path");
            path.setAttribute("d", "M11 21V2.352A3.451 3.451 0 0 0 9.5 2a3.5 3.5 0 0 0-3.261 2.238A3.5 3.5 0 0 0 4.04 8.015a3.518 3.518 0 0 0-.766 1.128c-.042.1-.064.209-.1.313a3.34 3.34 0 0 0-.106.344 3.463 3.463 0 0 0 .02 1.468A4.017 4.017 0 0 0 2.3 12.5l-.015.036a3.861 3.861 0 0 0-.216.779A3.968 3.968 0 0 0 2 14c.003.24.027.48.072.716a4 4 0 0 0 .235.832c.006.014.015.027.021.041a3.85 3.85 0 0 0 .417.727c.105.146.219.285.342.415.072.076.148.146.225.216.1.091.205.179.315.26.11.081.2.14.308.2.02.013.039.028.059.04v.053a3.506 3.506 0 0 0 3.03 3.469 3.426 3.426 0 0 0 4.154.577A.972.972 0 0 1 11 21Zm10.934-7.68a3.956 3.956 0 0 0-.215-.779l-.017-.038a4.016 4.016 0 0 0-.79-1.235 3.417 3.417 0 0 0 .017-1.468 3.387 3.387 0 0 0-.1-.333c-.034-.108-.057-.22-.1-.324a3.517 3.517 0 0 0-.766-1.128 3.5 3.5 0 0 0-2.202-3.777A3.5 3.5 0 0 0 14.5 2a3.451 3.451 0 0 0-1.5.352V21a.972.972 0 0 1-.184.546 3.426 3.426 0 0 0 4.154-.577A3.506 3.506 0 0 0 20 17.5v-.049c.02-.012.039-.027.059-.04.106-.064.208-.13.308-.2s.214-.169.315-.26c.077-.07.153-.14.225-.216a4.007 4.007 0 0 0 .459-.588c.115-.176.215-.361.3-.554.006-.014.015-.027.021-.041.087-.213.156-.434.205-.659.013-.057.024-.115.035-.173.046-.237.07-.478.073-.72a3.948 3.948 0 0 0-.066-.68Z");
        
            // Append path to SVG
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
    }).catch(err => console.err('Грешка: '+ err.message));
}

function formatDate(dateTimeString) {
    const date = new Date(dateTimeString);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() returns 0-11
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}.${month}.${year} в ${hours}:${minutes}`;

}

function loadComments() {
    const commentSection = document.getElementById('comment-section');
    if(eventData.comments.length){
        commentSection.innerHTML = '';
    }
    eventData.comments.reverse();
    eventData.comments.forEach(comment => {
        const creatorFullName = document.createElement('h3');
        const div = document.createElement('div');
        div.className='group-comment';
        const date = document.createElement('p');
        const text = document.createElement('p');

        const commented = document.createElement('h5');
        commented.textContent="Коментира: ";
        creatorFullName.textContent = comment.creatorFullName;
        date.textContent = formatDate(comment.date);
        text.textContent = comment.text;
        
        div.appendChild(creatorFullName);
        div.appendChild(date);
        commentSection.appendChild(div);
        commentSection.appendChild(commented);
        commentSection.appendChild(text);

    });
    
        
}

function loadEvent() {
    let title = document.getElementById('title');
    let stDate = document.getElementById('stDate');
    let enDate = document.getElementById('enDate');
    let location = document.getElementById('location');    

    let mainSection = document.getElementById('main-section');

    title.innerHTML = eventData.title;
    let startDate = new Date(eventData.dateStart);
    let endDate = new Date(eventData.dateEnd);
    stDate.innerHTML = "Започва на: <span class='boldered'>" + formatDate(startDate) + '</span>';
    enDate.innerHTML = "Приключва на: <span class='boldered'>" + formatDate(endDate) + '</span>';

    location.innerHTML = "Локация: <span class='boldered'>" + eventData.location + '</span>';

    loadParticipants();
    loadComments();

    if(eventData.isPersonalized === "1"){
        let p1 = document.createElement('p');
        p1.className = 'header-user';
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
    if(eventData.isGlobal === "1"){
        let li = document.createElement('li');
        li.innerHTML = 'Публично събитие';
        ul.appendChild(li);
    }

    if(eventData.isAnonnymus === "1") {
        let li = document.createElement('li');
        li.innerHTML = 'Анонимно събитие';
        ul.appendChild(li);
    }

    if(eventData.isPersonalized === "1" && personalizedData?.isVisible === "1") {
        let li = document.createElement('li');
        li.innerHTML = 'Събитието е скрито за ' + personalizedData.celebrator;
        ul.appendChild(li);
    }

    mainSection.append(ul);
    
    let personalPresents = document.getElementById('personal-buttons');
    if(eventData.isPersonalized === "1"){
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
        admin - false;
    }
})
.catch( err => {
    console.error("Грешка със заявката за проверка за Админ: " + err.message);
})

fetch('../../../backend/api/get_Event_All_Info.php', {
    method: 'POST',
    body: JSON.stringify({id: eventID}),
})
.then(response=>response.json())
.then(response => {
    if (response.success) {
        eventData = new Event(response.data.id, response.data.title, response.data.description, response.data.dateStart, response.data.dateEnd, response.data.timeStart, response.data.timeEnd, response.data.location, response.data.comments, response.data.isAnonnymus, response.data.isPersonalized, response.data.isGlobal)
        
        if(eventData.isPersonalized === "1") {
            personalizedData = new Personalized(response.data.personalizedData.isVisible, response.data.personalizedData.celebrator, response.data.personalizedData.presents, response.data.personalizedData.cards, response.data.personalizedData.money, response.data.personalizedData.musics );
        }
        loadEvent();
    } else {
        // error
        // document.getElementById('msg').innerText = 'Грешка' + response.message;
    }
}).catch( err => {
    console.error("Грешка със заявката за проверка за данни: " + err.message);
});

const isLogged = () => {
    fetch('../../../backend/api/get_isJoined.php', {
        method: 'POST',
        body: JSON.stringify({eventId: eventID})
    })
    .then (response => response.json())
    .then (response => {
        if(response.success){
            const isJoined = !!response.isJoined;

            if(isJoined){
                document.getElementById('joinbutton').style.display = 'none';
            }
        }
    })
    .catch(err => console.error("Грешка: " + err.message));
}


isLogged();


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


function currentDateTime() {
    const date = new Date();

    // Extract parts
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() returns 0-11
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    // Format and return
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
const commentForm = event => {
    event.preventDefault();

    const formElement = event.target;
	
    const formData = {
		date: currentDateTime(),
		text: formElement.querySelector("textarea[name='comment']").value,
		eventId: eventID,
    };
	

	
	if(formData.text === "") {
        document.getElementById('errComment').textContent = "Въведете коментар";
        return;
    }
    else{
        document.getElementById('errComment').textContent = "";
    }

    fetch('../../../backend/api/save_Comment_DB.php', {
        method: 'POST',
        body: JSON.stringify(formData),
    })
    .then(response=>response.json())
    .then(response => {
        if (response.success) {
            window.location.replace('event.html?id=' + eventID)
        } else {
            document.getElementById('errComment').innerText = response.message;
        }
    }).catch(err => console.err('Грешка: '+ err.message));	
	
};


let isVisiblee = false;
function changeVision(){
    const button = document.getElementById('bttn-hide')
    const commentmenu = document.getElementById('commments-menu');
    isVisiblee = !isVisiblee;
    if(isVisiblee){
        commentmenu.style.display = 'flex';
        button.innerHTML = "Скрий коментари";
    }
    else{
        commentmenu.style.display = 'none';
        button.innerHTML = "Покажи коментари";
    }
}

document.getElementById('comments-form').addEventListener('submit', commentForm);