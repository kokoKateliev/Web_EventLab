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

CREATE TABLE IF NOT EXISTS `web_eventlab_db`.`UsersToEvents` {
    `id` INT NOT NULL AUTO_INCREMENT,
    `usersID` INT NOT NULL,
    `subjectsID` INT NOT NULL,,
    PRIMARY KEY (UserID, EventID),
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    FOREIGN KEY (EventID) REFERENCES Events(EventID)
};

CREATE TABLE IF NOT EXISTS `web_eventlab_db`.`Univesities` {
    UniversityID INT PRIMARY KEY,
    UnivesityName VARCHAR(50),
};

CREATE TABLE IF NOT EXISTS `web_eventlab_db`.`Faculties` {
    `id` INT PRIMARY KEY,
    `Facultyname` VARCHAR(50) NOT NULL,
    UNIQUE INDEX `name_UNIQUE` (`Facultyname` ASC) VISIBLE
};

CREATE TABLE IF NOT EXISTS `web_eventlab_db`.`users_subjects`{
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
    EventID INT PRIMARY KEY,
    EventName VARCHAR(50),
    EventDate DATE,
    EventTime TIME
};


INSERT INTO Univesities (UnivesityName)
VALUES ('University of California, Los Angeles'),
('University of California, Berkeley'),
('University of California, San Diego'),
('University of California, Santa Barbara'),
('University of California, Irvine'),
('University of California, Riverside'),
('University of California, San Francisco'),
('University of California, San Jose');