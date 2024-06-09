function showFaculties(data){
    if(data.length === 0){
        throw new Error('Грешка в получените данни за факултети');
    }
    let div = document.getElementById('faculties');
    let select = document.getElementById('faculty');
    const options = [];

    data.forEach(element => {
        let value = element.replace(/\s+/g, '')
        options.push({value : element});
    });

    options.forEach(optionData => {
        const option = document.createElement('option');
        option.value = optionData.value;
        option.textContent = optionData.text;
        select.appendChild(option);
    });

    div.style.visibility = 'visible';
}

function getFaculties(facultyName) {
    fetch('../../backend/endpoints/faculties.php', {
        method: 'POST',
        body: JSON.stringify({ university: universityName }),
    })
    .then(response=>response.json())
    .then(response => {
        if (response.success) {
                showFaculties(response.data);
        } else {
            throw new Error('Мрежова грешка');
        }
    })
    .catch(error => {
        console.error('Грешка: ' + error.message);
    });
}



const generateFaculties = event => {
    const chosenElement = event.target.value;
    getFaculties(chosenElement);
}

document.querySelector("select[name='university']").addEventListener('change', generateFaculties);

