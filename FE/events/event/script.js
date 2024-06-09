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

function Presents(){

}

function getQueryParam() {
    let queryParam = {};
    let queryString = window.location.search.substring(1);
    let pair = queryString.split('=');
    queryParam[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
    
    return queryParam;
}



let eventData = null;
let personalizedData = null;
let eventID = getQueryParam();
fetch('../../backend/endpoints/event.php', {
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
        loadEvents()
    } else {
        // error
        // document.getElementById('msg').innerText = 'Грешка' + response.message;
    }
});