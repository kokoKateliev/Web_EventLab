// fetch get events + universities + faculties + yourUni + yourFaculty
// fetch get kude uchasvam
//

// const eventData = [
//     {
//         id: 1,
//         title : "Рожден ден Мария",
//         date: new Date(),
//         location: "ФМИ",
//         isPersonalized: "Мария Петрова",
//         description: "Нека отпразнуваме заедно рождения ден на Мария Петрова във ФМИ! Ела и се включи в подаръка й!",
//         creator: "Иван Павлов",
//         isAnonnymus: false
//     }
// ];

let myUniversity = null;
let myFaculty = null;

let events = null;
let universities = null;
let faculties = null;

let selectedUni = null;
let selectedFaculty = null;

function navigateToEvent(id) {
    var params = '?id=' + encodeURIComponent(id); 
    
    window.location.replace("./event/event.html" + params);
}

function getDate() {
    const date = new Date();

    // Extract parts
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() returns 0-11
    const day = String(date.getDate()).padStart(2, '0');

    // Format and return
    return `${year}-${month}-${day}`;
}

function formatDate(dats) {
    const date = new Date(dats);

    // Extract parts
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() returns 0-11
    const day = String(date.getDate()).padStart(2, '0');

    // Format and return
    return `${day}.${month}.${year}`;
}

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
        if(event.isVisible){
            if(event.isVisible === '0'){
                if(event.isCelebrator){
                    const tday= getDate();
                    if(event.date > tday){
                        return;
                    }
                }
            }
        }

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
        dateTimeP.className = 'after-hover';
        
        eventBlockDiv.appendChild(dateTimeP); 

        const button = document.createElement('button');
        button.className = 'buttons';
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

function loadEventsFromFilter() {

    if(selectedFaculty === null) {
        document.getElementById('msg').innerText = 'Моля изберете университет и факултет';
        return;
    }

    fetch('../../backend/api/get_Event.php', {
        method: 'POST',
        body: JSON.stringify({ facultyId : parseInt(selectedFaculty)}),
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
        let select = document.getElementById('universities');
        select.innerHTML = '';
        universities.forEach((university) => {
            const option = document.createElement('option');
            option.value = university.id;
            option.textContent = university.name;
            if(university.id === myUniversity.id){
                option.selected = true;
                selectedUni = myUniversity.id;
            };

            select.appendChild(option);
        });
    }
}

function loadFilterFaculties () {
    const select = document.getElementById('faculty');
    select.innerHTML = '';
    if(myFaculty.id === null){
        const option = document.createElement('option');
        option.value = "";
        option.textContent = "-----";
        option.selected = true;
        option.disabled = true;
        select.appendChild(option);
    }

    const faculties = universities.find(university => university.id === selectedUni).faculties;
    faculties.forEach((faculty) => {
        const option = document.createElement('option');
        option.value = faculty.id;
        option.textContent = faculty.name;
        if(faculty.id === myFaculty.id){
            option.selected = true;
            selectedFaculty = myFaculty.id;
        }
        select.appendChild(option);
    });
}

function filterOptions() {
    loadFilterUnviersities();
    loadFilterFaculties();
}

function loadData(data) {
    universities = data.universities; //arr sus string
    myUniversity = data.myUniversity;
    myFaculty = data.myFaculty;
}

// iskam loadData elementite
fetch('../../backend/api/get_User_Uni_Faculty.php', {
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



const loadFilter = (event) => {
    selectedUni = event.target.value;
    const selectedChoise = event.target.value;
    const select = document.getElementById('faculty');
    select.innerHTML = '';
    if(myFaculty.id === null || selectedFaculty === null){
        const option = document.createElement('option');
        option.value = "";
        option.textContent = "-----";
        option.selected = true;
        option.disabled = true;
        select.appendChild(option);
    }
    // else {
    //     loadEventsFromFilter();
    // }

    const faculties = universities.find(university => university.id === selectedChoise).faculties;
    faculties.forEach((faculty) => {
        const option = document.createElement('option');
        option.value = faculty.id;
        option.textContent = faculty.name;
        select.appendChild(option);
        });
    selectedFaculty = select.options[select.selectedIndex].value;
    if(selectedFaculty !== null){
        loadEventsFromFilter();
    }
}


const filterOnFaculties = (event) => {
    selectedFaculty = event.target.value;
    loadEventsFromFilter();
}

document.querySelector("select[name='universities']").addEventListener('change', loadFilter);
document.querySelector("select[name='faculty']").addEventListener('change', filterOnFaculties);

