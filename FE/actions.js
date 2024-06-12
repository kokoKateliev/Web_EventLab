function loadEvents() {
    const section = document.getElementById('events');
    if(section.innerHTML) {
        section.innerHTML = '';
    }

    if(!events.length){
        let h2 = document.createElement('h2');
        h2.textContent = 'Няма събития в момента';
        section.appendChild(h2);
        return;
    }
    //id, title, date, location, isPersonalized(vurni mi imeto ili null), description
    events.forEach(event => {
        const mainDiv = document.createElement('div');

        const eventBlockDiv = document.createElement('div');
        eventBlockDiv.id = event.id;
        eventBlockDiv.className = "event-block";
        
        const titleH3 = document.createElement('h3');
        titleH3.textContent = event.title;
        eventBlockDiv.appendChild(titleH3); 

        const dateTimeP = document.createElement('p');
        dateTimeP.textContent = event.date;
        eventBlockDiv.appendChild(dateTimeP); 

        const button = document.createElement('button');
        button.textContent = "Още за събитието";
        button.onclick = function() {
            navigateToEvent(event.id); 
        };

        eventBlockDiv.appendChild(button); 

        mainDiv.appendChild(eventBlockDiv);

        // -----------------------------------
        var onHoverDiv = document.createElement('div');
        onHoverDiv.className = "on-hover";

        var titleOrUserH3 = document.createElement('h3');
        if(event.isPersonalized === "0"){
            titleOrUserH3.textContent = event.title;
        }
        else{
            titleOrUserH3.textContent = "Празнуващ: " + event.isPersonalized;
        }
        onHoverDiv.appendChild(titleOrUserH3); 

        var locationP = document.createElement('p');
        locationP.textContent = event.location;
        onHoverDiv.appendChild(locationP);

        var shortDescP = document.createElement('p');
        shortDescP.textContent = event.description;
        onHoverDiv.appendChild(shortDescP); 

        mainDiv.appendChild(onHoverDiv);

        section.appendChild(mainDiv); 
    });
}

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
    let ev = document.getElementById('ev');
    let crEv = document.getElementById('crEv');
    ev.style.display = 'none';
    crEv.style.display = 'none';
    button.style.display = 'none';
    buttonL.style.display = 'none';
    let login = document.getElementById('login');
    let register = document.getElementById('register');
    login.style.display = 'flex';
    register.style.display = 'flex';
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
                let ev = document.getElementById('ev');
                let crEv = document.getElementById('crEv');
                ev.style.display = 'flex';
                crEv.style.display = 'flex';
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


//get_Global_Events.php