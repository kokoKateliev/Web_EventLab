INSERT INTO `universities`(`id`, `UniversityName`) 
VALUES (1, 'Софийски университет "Св. Климент Охридски"'),
(2, 'Технически университет София'),
(3, 'Университет за Национално и Световно стопанство'),
(4, 'Университет по Архитектура, Строителство и Геодезия');

INSERT INTO `faculties` (`id`, `Facultyname`)
VALUES (1, 'ФМИ - Софтуерно инженерство'),
(2, 'ФМИ - Компютърни науки'),
(3, 'ФМИ - Информационни системи'),
(4, 'ФМИ - Информатика'),
(5, 'ФСФ - Българска филология'),
(6, 'ФСФ - Английска филология'),
(7, 'ФСФ - Германска филология'),
(8, 'ФСФ - Френска филология'),
(9, 'ФА - Архитектура'),
(10, 'ФА - Урбанистика'),
(20, 'ФА - Ландшафтна архитектура'),
(11, 'ФГ - Геодезия'),
(12, 'ФГ - Картография'),
(13, 'ФГ - География'),
(14, 'ОФ - Обща икономика'),
(15, 'СФ - Финанси'),
(16, 'СФ - Счетоводство'),
(17, 'ФА - Автомобилно строителство'),
(18, 'ЕФ - Електроника'),
(19, 'ЕФ - Електротехника');

INSERT INTO `universities_faculties`(`id`, `UniId`,`FacultyID`)
VALUES (1, 1, 1),
(2, 1, 2), (3, 1, 3), (4, 1, 4), (5, 1, 5), (6, 1, 6),
(7, 1, 7), (8, 1, 8), (9, 4, 9), (10, 4, 10), (11, 4, 11),
(12, 4, 12), (13, 4, 13), (14, 3, 14), (15, 3, 15), (16, 3, 16),
(17, 2, 17), (18, 2, 18), (19, 2, 19), (20, 3, 20);

INSERT INTO `Roles` (`id`, `Rolename`)
Values (1, "Студент"), (2, "Учител");