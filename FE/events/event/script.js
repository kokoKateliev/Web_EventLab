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

function Personalized(isVisible, celebrator, presents, cards, money, music ) {
    this.isVisible = isVisible;
    this.celebrator = celebrator;
    this.presents = presents;
    this.cards = cards;
    this.money = money;
    this.music = music;
}

let admin = false;

function showPresents() {
    let presentsMenu = document.getElementById("presents-menu");
    if(admin){
        const div = document.createElement('div');
        div.className = 'presents-buttons';

        const addButton = document.createElement('button');
        addButton.textContent = 'Добави';
        addButton.onclick = function() {
            addPresent()
        };
        // const editButton = document.createElement('button');
        // editButton.textContent = 'Промяна';
        // editButton.setAttribute('onclick', 'editPresent()');
        // button.onclick = function() {
        //     navigateToEvent(event.id); 
        // };


        div.appendChild(addButton);
        // div.appendChild(editButton);

        presentsMenu.appendChild(div);
    }

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
        const addButton = document.createElement('button');
        addButton.onclick = function() {
            addMoney(present.id)
        };

        div2.appendChild(h4);
        div2.appendChild(addButton);

        section.appendChild(div1);
        section.appendChild(div2);

        if(admin) {
            const div3 = document.createElement('div');
            
            const editButton = document.createElement('button');
            editButton.onclick = function() {
                editPresent(present.id)
            };

            div3.appendChild(editButton);

            section.appendChild(div3);
        }

        document.body.appendChild(section);
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

            svg.appendChild(path);
            li.appendChild(svg); 
        }
        participantsList.appendChild(li);
    });


}

function loadParticipants(){
    fetch('../../backend/api/event.php', {
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

    if(isPersonalized){
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
    
    let personalPresents = document.getElementById('personal-presents');
    if(eventData.isPersonalized){
        personalPresents.style.display = 'flex';
        
    }
    else{
        personalPresents.style.display = 'none';
    }



}

function joinEvent() {
    //izprati zaqvka za join
}

function getQueryParam() {
    let queryParam = {};
    let queryString = window.location.search.substring(1);
    let pair = queryString.split('=');
    queryParam[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
    
    return parseInt(queryParam.id);
}

let eventData = null;
let personalizedData = null;
let eventID = getQueryParam();

fetch('../../backend/api/admin.php', {
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

fetch('../../backend/api/event.php', {
    method: 'POST',
    body: JSON.stringify({id: eventID}),
})
.then(response=>response.json())
.then(response => {
    if (response.success) {
        eventData = new Event(response.eventData.id, response.eventData.title, response.eventData.description, response.eventData.dateStart, response.eventData.dateEnd, response.eventData.timeStart, response.eventData.timeEnd, response.eventData.location, response.eventData.comments, response.eventData.isAnonnymus, response.eventData.isPersonalized, response.eventData.isGlobal)
        if(eventData.isPersonalized) {
            personalizedData = new Personalized(response.personalizedData.isVisible, response.personalizedData.celebrator, response.personalizedData.presents, response.personalizedData.cards, response.personalizedData.money, response.personalizedData.music );
        }
        loadEvent();
    } else {
        // error
        // document.getElementById('msg').innerText = 'Грешка' + response.message;
    }
});


