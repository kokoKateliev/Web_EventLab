// fetch get events + universities + faculties + yourUni + yourFaculty
// fetch get kude uchasvam
//


let MyUniversity = "";
let MyFaculty = "";

let events = null;
let universities = null;
let faculties = null;

let selectedUni = null;
let selectedFaculty = null;

function navigateToEvent(id) {
    var params = '?id=' + encodeURIComponent(id); 
    
    window.location.replace("./event/event.html" + params);
}


function loadEvents() {
    if(section.innerHTML) {
        section.innerHTML = '';
    }
    const section = document.getElementById('events');


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
        if(event.isPersonalized){
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

function loadEventsFromFilter() {

    if(selectedFaculty === null || selectedFaculty === null) {
        document.getElementById('msg').innerText = 'Моля изберете университет и факултет';
        return;
    }

    fetch('../../backend/endpoints/events-menu.php', {
        method: 'POST',
        body: JSON.stringify({ faculty : selectedFaculty}),
    })
    .then(response=>response.json())
    .then(response => {
        if (response.success) {
            events = response.events;
            loadEvents()
        } else {
            document.getElementById('msg').innerText = 'Грешка' + response.message;
        }
    });
}

function loadFilterUnviersities() {
    if(universities !== null){
        let select = document.getElementById('university');
        universities.forEach((university) => {
            const option = document.createElement('option');
            option.value = university;
            option.textContent = university;
            if(university === myUniversity){
                option.selected = true;
                selectedUni = myUniversity;
            };

            select.appendChild(option);
        });
    }
}

function loadFilterFaculties () {
    if(faculties !== null){
        const div = document.getElementById('faculties');
        const select = document.getElementById('university');
        if(MyFaculty === ""){
            const option = document.createElement('option');
            option.value = "";
            option.textContent = "-----";
            option.selected = true;
            option.disabled = true;
            select.appendChild(option);
        }

        faculties[myUniversity].forEach((faculty) => {
            const option = document.createElement('option');
            option.value = faculty;
            option.textContent = faculty;
            if(faculty === myFaculty){
                option.selected = true;
                selectedFaculty = myFaculty;
            }
            select.appendChild(option);
        });
    }
}

function filterOptions() {
    loadFilterUnviersities();
    loadFilterFaculties();
}

function loadData(data) {
    universities = data.universities; //arr sus string
    faculties = data.faculties; //obekt ot uni:faculties arr
    myUniversity = data.myUniversity;
    myFaculty = data.myFaculty;
}

// iskam loadData elementite
fetch('../../backend/endpoints/filter-menu.php', {
    method: 'POST',
    body: JSON.stringify(),
})
.then(response=>response.json())
.then(response => {
    if (response.success) {
        loadData(response.data);
        filterOptions();
        loadEventsFromFilter();
    } else {
        document.getElementById('msg').innerText = 'Грешка' + response.message;
    }
});


