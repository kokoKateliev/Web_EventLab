const universitiesData = [
	{
		id: 1,
		name: 'Софийски университет "Св. Климент Охридски"',
		faculties: [
			{ id:1, name: 'ФМИ - Софтуерно инженерство'},
			{ id:2,  name: 'ФМИ - Компютърни науки'},
			{ id:3,  name: 'ФМИ - Информационни системи'},
			{ id:4,  name: 'ФМИ - Информатика'},
			{ id:5,  name: 'ФСФ - Българска филология'},
			{ id:6,  name: 'ФСФ - Английска филология'},
			{ id:7,  name: 'ФСФ - Германска филология'},
			{ id:8,  name: 'ФСФ - Френска филология'}
		]
	},
	{
		id:2,
		name: 'Технически университет - София',
		faculties: [
			{id:17, name:'ФА - Автомобилно строителство'},
			{id:18, name:'ЕФ - Електроника'},
			{id:19, name:'ЕФ - Електротехника'}
		]
	},
	{
		id: 3,
		name: 'Университет за Национално и Световно стопанство',
		faculties: [
			{id:14, name:'ОФ - Обща икономика'},
			{id:15, name:'СФ - Финанси'},
			{id:16, name:'СФ - Счетоводство'},
		]
	},
	{
		id:4,
		name: 'Университет по Архитектура, Строителство и Геодезия',
		faculties: [
			{id:9, name:'ФА - Архитектура'},
			{id:10, name:'ФА - Урбанистика'},
			{id:20, name:'ФА - Ландшафтна архитектура'},
			{id:11, name:'ФГ - Геодезия'},
			{id:12, name:'ФГ - Картография'},
			{id:13, name:'ФГ - География'},
		]
	}
];

const loadUniversities = () => {
    let select = document.getElementById('university');

    universitiesData.forEach(university => {
        const option = document.createElement('option');
        option.value = university.id;
        option.textContent = university.name;
        select.appendChild(option);
    });
}

function showFaculties(faculties){
    let div = document.getElementById('faculties');
    if(isTeacher){
        div.style.visibility = 'hidden';

        return;
    }
    let select = document.getElementById('faculty');

    faculties.forEach(faculty => {
        const option = document.createElement('option');
        option.value = faculty.id;
        option.textContent = faculty.name;
        select.appendChild(option);
    });

    div.style.visibility = 'visible';
}

function getFaculties(universityId) {
    const id = parseInt(universityId);
    let faculties = universitiesData.find(university => university.id === id).faculties;
    showFaculties(faculties);
}



const generateFaculties = event => {
    const chosenElement = event.target.value;
    getFaculties(chosenElement);
}

loadUniversities();
document.querySelector("select[name='university']").addEventListener('change', generateFaculties);


