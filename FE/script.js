// sled login da se validira che ima lognat potrebitel
// da se promeni nav bar elementite

let events = null;

function navigateToEvent(id) {
    var params = '?id=' + encodeURIComponent(id); 
    
    window.location.replace("./events/event/event.html" + params);
}

function loadEvents() {
    const section = document.getElementById('globalEvents');
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

        mainDiv.className = 'event'; 

        const eventBlockDiv = document.createElement('div');
        eventBlockDiv.id = event.id;
        eventBlockDiv.className = "event-block";
        
        const titleH3 = document.createElement('h3');
        titleH3.className = 'after-hover';
        titleH3.textContent = event.title;
        eventBlockDiv.appendChild(titleH3); 

        const dateTimeP = document.createElement('p');
        dateTimeP.textContent = event.date;
        eventBlockDiv.appendChild(dateTimeP); 

        const button = document.createElement('button');
        button.textContent = "Още";
        button.className = 'buttons';
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


const loadGlobalEvents = () => {
    fetch('../backend/api/get_Global_Events.php', {
        method: 'POST',
        body: JSON.stringify(),
    })
    .then(response=>response.json())
    .then(response => {
        if (response.success) {
            events = response.globalEvents;
            loadEvents()
        } else {
            const h3 = document.createElement('h3');
            h3.style.width = '100%';
            h3.style.textAlign = 'center';
            h3.textContent = 'Към този момент няма събития с отворени врати.';
            const div = document.getElementById('globalEvents');
            div.appendChild(h3);
            document.getElementById('msg').innerText = 'Грешка' + response.message;
        }
    })
    .catch( err => {
        const h3 = document.createElement('h3');
            h3.textContent = 'Към този момент няма събития с отворени врати.';
            h3.style.width = '100%';
            h3.style.textAlign = 'center';
            const div = document.getElementById('globalEvents');
            div.appendChild(h3);
        console.log(err);
    }
    );

}

loadGlobalEvents();