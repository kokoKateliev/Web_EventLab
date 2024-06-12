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

INSERT INTO `Users`
Values (1, "ilian", "Илиян", "Петров", "$2y$10$2YMtWlPPI0P5Etavk8gP7OwFUQtHR4w25ZOUMXT.vvr9YrD/llcOe", "ilian@gmail.com", 1, "1990-12-06", 1, 1),
(2, "koko", "Калоян", "Кателиев", "$2y$10$2YMtWlPPI0P5Etavk8gP7OwFUQtHR4w25ZOUMXT.vvr9YrD/llcOe", "koko@gmail.com", 1, "2002-06-15", 1, 1),
(3, "pepi", "Петрарка", "Ивановска", "$2y$10$2YMtWlPPI0P5Etavk8gP7OwFUQtHR4w25ZOUMXT.vvr9YrD/llcOe", "pepi@gmail.com", 2, "1985-09-05", 1, 0),
(4, "ulian", "Юлиан", "Иванов", "$2y$10$2YMtWlPPI0P5Etavk8gP7OwFUQtHR4w25ZOUMXT.vvr9YrD/llcOe", "ulian@gmail.com", 2, "1970-07-29", 1, 0);

INSERT INTO `Events`
VALUES (1, "Консултация за изпит", "Здравейте колеги! Ще има консултация на 24.06 по Структуране на база данни, като моля да си носите лаптопи. Ще покрием всички елементи от курса, като ще дам и задачи за упражнение. Нека се подготвите с въпроси, за да бъда максимално полезен. Ще нося и формуляри за изпита, ако не сте си ги изпринтирали. Няма да показвам задачи от контролното или поне ще се опитвам да не конкретизирам толкова. Моля, не закъснявайте! От Илиян Петров.", "2024-06-24", "2024-06-24", "15:00:00", "22:00:00", "ФМИ стая 325", False, False ),
(2, "Отворени врати", "Здравейте! Ще се проведе ден на отворените врати на различни фирми. Ще имат възможност да представят себе си, както и с какво се занимават. Бъдете внителни и търсете това, което искате да бъде вашето бъдеще. Ще има и обяд - сандвичи в 12ч. Следете и за проблеми, ако има такива се обърнете към съответните лица. От Петрарка Ивановска, отдел студенти", "2024-06-15", "2024-06-15", "9:00:00", "18:00:00", "Главния вход", False, False ),
(3, "Откриване на учебната година", "Откриваме 2024/2025 учебната година на 1.10. Всеки първокурсник е добре дошъл да се запознае с обстановката, да се запознае и колегите. Задължителни елементи - доборото ВИ настроение. Приготвени са игри - шах, белот, билярд, джаги, както и компютърнии игри - LoL, CS турнири. Който желае да се присъедини да натисне ТУК. Ако искате допълнителни материали - обърнете се към нас. Поздрави, ФСС.", "2024-10-01", "2024-10-02", "9:00:00", "16:00:00", "ФМИ, кв. Лозенец", False, False ),
(4, "Контролно по Информатика", "Привет колеги! Контролното по Информатика ще се проведе на 14.06 от 10:00ч. Носете си химикал и БЕЛИ листи, като ако се нуждаете от други материали ни кажете по рано. Изпитът ще е две части - задача на компютър и задача на лист. Ще покрива материал от целия курс. Поздрави гл. ас. Петър Карапавлов", "2024-06-14", "2024-06-14", "10:00:00", "13:00:00", "ФХФ 210 ", True, False ),
(5, "Рожден ден - лектор Иванов.", "Здравейте! Ще отпразнуваме празника на лектор Иванов в стая 100, като ако желаете може да се включите", "2024-06-21", "2024-06-21", "9:00:00", "23:00:00", "Фми зала 100", False, True ),
(6, "Илинден", "Здравейте! Ще отпразнуваме празника на Илина, Илияна и Илиян. Нека са живи и здрави и успехи по пътя. Ако желаете да се включите към подаръците, по-долу има форма за онлайн плащания. Нека отпразнуваме заедно един хубав летен ден.", "2024-07-20", "2024-07-20", "9:00:00", "23:00:00", "ФМИ, Зала 526", False, True ),
(7, "Рожден ден на Калоян", "Нека отпразнуваме заедно рождения ден на Калоян Кателиев. Подаръци има добавени в секция Подаръци, като събираме пари до него ден за ваучер. При желания към неговия подарък - в коментарите може да ги добавите.", "2024-06-15", "2024-06-15", "9:00:00", "23:00:00", "Фми главен вход", False, True );

INSERT INTO `events_faculties`
VALUES (1, 1, 1, False),
(2, 2, 1, False), 
(3, 3, 1, False),
(4, 4, 1, True),
(5, 5, 1, False),
(6, 6, 1, True),
(7, 7, 1, False);

INSERT INTO `users_events`
VALUES (1, 1, 1, 1, 0),
(2, 1, 6, 0, 0),
(3, 1, 7, 0, 1),
(4, 2, 7, 0, 0),
(5, 2, 1, 0, 0),
(6, 2, 3, 0, 1),
(7, 2, 4, 0, 0),
(8, 2, 5, 0, 0),
(9, 2, 6, 1, 0),
(10, 3, 2, 1, 0),
(11, 3, 3, 1, 0),
(12, 3, 4, 1, 0),
(13, 4, 5, 0, 0),
(14, 4, 7, 1, 0),
(15, 4, 5, 0, 0),
(16, 1, 5, 1, 0);

INSERT INTO `personalized`
VALUES (1, 5, False, 4, 500),
(2, 6, True, 1, 200),
(3, 7, False, 2, 0);

INSERT INTO `Comments` (`CommentText`, `CommentDate`, `EventID`, `UserID`)
VALUES ('Страхотно събитие!', '2024-06-10 12:00:00', 3, 2),
       ('Ще присъствам.', '2024-06-10 12:30:00', 2, 3),
       ('Ще има ли картички?', '2024-06-10 13:00:00', 5, 2),
       ('Присъствам', '2024-06-10 13:30:00', 4, 2);


INSERT INTO `Presents` (`Title`, `Price`, `EndDate`, `EventID`)
VALUES ('Ваучер Converse магазин.', 100.00, '2024-06-30 23:59:59', 7),
       ('Бонбони и лакомстав', 25.00, '2024-06-30 23:59:59', 5),
       ('Основни хранителни елемени', 200.99, '2024-06-30 23:59:59', 6);

