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
(7, 1, 7), (8, 1, 8), (9, 2, 9), (10, 2, 10), (11, 2, 11),
(12, 2, 12), (13, 2, 13), (14, 3, 14), (15, 3, 15), (16, 3, 16),
(17, 4, 17), (18, 4, 18), (19, 4, 19), (20, 3, 20);

INSERT INTO `Roles` (`id`, `Rolename`)
Values (1, "Студент"), (2, "Учител");

INSERT INTO `Users`
Values (1, "test1", "Калоян", "Кателиев", "Tester1-1", "email@gmail.com", 1, "2002-12-20", 1, 1),
(2, "test2", "Адриана", "Атанасова", "Tester2-2", "email@gmail.com", 1, "2002-01-20", 1, 1);

INSERT INTO `Events`
VALUES (1, "Event1", "LONGLONGLONGlonglong long long short SHORT Description", "2024-06-24", "25-06-2024", "15:00:00", "16:00:00", "8mi Blok na SU", False, False ),
(2, "Event2", "LONGLONGLONGlonglong long long short SHORT Description", "2024-06-20", "2024-06-24", "15:00:00", "16:00:00", "6A Studentski grad", False, True ),
(3, "Event3", "LONGLONGLONGlonglong long long short SHORT Description", "2024-06-21", "2024-06-24", "15:00:00", "16:00:00", "FMI", False, False ),
(4, "Event4", "LONGLONGLONGlonglong long long short SHORT Description", "2024-06-23", "2024-06-26", "15:00:00", "16:00:00", "DRUG FACULTET", False, False );

INSERT INTO `events_faculties`
VALUES (1, 1, 1, False),
(2, 2, 1, False), 
(3, 3, 1, False),
(4, 4, 2, True);

INSERT INTO `personalized`
VALUES (1, 2, True, 1);

INSERT INTO `users_events`
VALUES (1, 2, 1, 1, 0);