CREATE DATABASE IF NOT EXISTS `web_eventlab_db`;
CREATE TABLE IF NOT EXISTS `web_eventlab_db`.`Users` {
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `Firstname` VARCHAR(50) NOT NULL,
    `Lastname` VARCHAR(50) NOT NULL,
    `Password` VARCHAR(50) NOT NULL,
    `Email` VARCHAR(100) NOT NULL,
    `RoleID` INT NOT NULL FOREIGN KEY REFERENCES Roles(RoleID),
    UNIQUE INDEX `username_UNIQUE` (`username` ASC) VISIBLE,
    INDEX `fk_users_roles1_idx` (`roles_id` ASC) VISIBLE,
    CONSTRAINT `fk_users_roles1`
        FOREIGN KEY (`roles_id`)
        REFERENCES `web_eventlab_db`.`Roles` (`id`)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION
};

CREATE TABLE IF NOT EXISTS `web_eventlab_db`.`Roles` {
    `id` INT PRIMARY KEY,
    `Rolename` VARCHAR(50) NOT NULL,
    UNIQUE INDEX `name_UNIQUE` (`Rolename` ASC) VISIBLE
};

CREATE TABLE IF NOT EXISTS `web_eventlab_db`.`Univesities` {
    `UniversityID` INT PRIMARY KEY,
    `UnivesityName` VARCHAR(50),
    UNIQUE INDEX `name_UNIQUE` (`UnivesityName` ASC) VISIBLE
};

CREATE TABLE IF NOT EXISTS `web_eventlab_db`.`Faculties` {
    `id` INT PRIMARY KEY,
    `Facultyname` VARCHAR(50) NOT NULL,
    UNIQUE INDEX `name_UNIQUE` (`Facultyname` ASC) VISIBLE
};

CREATE TABLE IF NOT EXISTS `web_eventlab_db`.`universities_faculties`{
  `id` INT NOT NULL AUTO_INCREMENT,
  `UniID` INT NOT NULL,
  `FacultyID` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `university_has_faculties1_idx` (`FacultyID` ASC) VISIBLE,
  INDEX `university_has_faculties_universities_idx` (`UniID` ASC) VISIBLE,
  CONSTRAINT `university_has_faculties_universities`
    FOREIGN KEY (`UniID`)
    REFERENCES `web_eventlab_db`.`Universities` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `university_has_faculties1`
    FOREIGN KEY (`FacultyID`)
    REFERENCES `web_eventlab_db`.`Faculties` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
};

CREATE TABLE IF NOT EXISTS `web_eventlab_db`.`Events` {
    `id` INT PRIMARY KEY,
    `EventName` VARCHAR(50),
    `EventDescription` VARCHAR(500),
    `EventDateSt` DATE,
    `EventDateEn` DATE,
    `EventTimeSt` TIME,
    `Location` VARCHAR(80),
    `isAnonymous` Boolean,
    `eventType` Boolean,
    `isPersonalized` Boolean,
    `EventAdmin` VARCHAR(50)
};

CREATE TABLE IF NOT EXISTS `web_eventlab_db`.`users_events` {
  `id` INT NOT NULL AUTO_INCREMENT,
  `usersID` INT NOT NULL,
  `events_id` INT NOT NULL,
  `isAdmin` Boolean NOT NULL,
  `isHelper` Boolean NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_users_has_events_events1_idx` (`events_id` ASC) VISIBLE,
  INDEX `fk_users_has_events_users1_idx` (`usersID` ASC) VISIBLE,
  CONSTRAINT `fk_users_has_events_users1`
    FOREIGN KEY (`usersID`)
    REFERENCES `web_eventlab_db`.`Users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_users_has_events_events1`
    FOREIGN KEY (`events_id`)
    REFERENCES `web_eventlab_db`.`Events` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
};

CREATE TABLE IF NOT EXISTS `web_eventlab_db`.`Personalized` {
    `id` INT PRIMARY KEY,
    `EventID` INT NOT NULL,
    `isVisible` Boolean NOT NULL,
    `celebratorID` INT NOT NULL,
    INDEX `fk_Personalized_Events1_idx` (`EventID` ASC) VISIBLE,
    INDEX `fk_user_celebrator1_idx` (`celebratorID` ASC) VISIBLE,
    CONSTRAINT `fk_Personalized_Events1`
        FOREIGN KEY (`EventID`)
        REFERENCES `web_eventlab_db`.`Events` (`id`)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION,
    CONSTRAINT `fk_user_celebrator1`
        FOREIGN KEY (`celebratorID`)
        REFERENCES `web_eventlab_db`.`Users` (`id`)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION
};



INSERT INTO Univesities (UnivesityName)
VALUES ('Софийски университет "Св. Климент Охридски"'),
('Технически университет София'),
('Университет за Национално и Световно стопанство'),
('Университет по Архитектура, Строителство и Геодезия');