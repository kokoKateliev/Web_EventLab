CREATE DATABASE IF NOT EXISTS `web_eventlab_db`;
CREATE TABLE IF NOT EXISTS `web_eventlab_db`.`Users` (
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(255) NOT NULL,
    `Firstname` VARCHAR(50) NOT NULL,
    `Lastname` VARCHAR(50) NOT NULL,
    `Password` VARCHAR(50) NOT NULL,
    `Email` VARCHAR(100) NOT NULL,
    `RoleID` INT NOT NULL FOREIGN KEY REFERENCES Roles(RoleID),
    UNIQUE INDEX `username_UNIQUE` (`username` ASC) VISIBLE,
    INDEX `fk_users_roles1_idx` (`RoleID` ASC) VISIBLE,
    CONSTRAINT `fk_users_roles1`
        FOREIGN KEY (`RoleID`)
        REFERENCES `web_eventlab_db`.`Roles` (`id`)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION
);

CREATE TABLE IF NOT EXISTS `web_eventlab_db`.`Roles` (
    `id` INT PRIMARY KEY,
    `Rolename` VARCHAR(50) NOT NULL,
    UNIQUE INDEX `name_UNIQUE` (`Rolename` ASC) VISIBLE
);

CREATE TABLE IF NOT EXISTS `web_eventlab_db`.`Univesities` (
    `UniversityID` INT PRIMARY KEY,
    `UnivesityName` VARCHAR(50),
    UNIQUE INDEX `name_UNIQUE` (`UnivesityName` ASC) VISIBLE
);

CREATE TABLE IF NOT EXISTS `web_eventlab_db`.`Faculties` (
    `id` INT PRIMARY KEY,
    `Facultyname` VARCHAR(50) NOT NULL,
    UNIQUE INDEX `name_UNIQUE` (`Facultyname` ASC) VISIBLE
);

CREATE TABLE IF NOT EXISTS `web_eventlab_db`.`universities_faculties`(
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
);

CREATE TABLE IF NOT EXISTS `web_eventlab_db`.`Events` (
    `id` INT PRIMARY KEY,
    `EventName` VARCHAR(50) NOT NULL,
    `EventDescription` VARCHAR(500),
    `EventDateSt` DATE NOT NULL,
    `EventDateEn` DATE NOT NULL,
    `EventTimeSt` TIME NOT NULL,
    `Location` VARCHAR(80),
    `isAnonymous` Boolean NOT NULL,
    `isPersonalized` Boolean NOT NULL,
);

CREATE TABLE IF NOT EXISTS `web_eventlab_db`.`users_events` (
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
);

CREATE TABLE IF NOT EXISTS `web_eventlab_db`.`Personalized` (
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
);

CREATE TABLE IF NOT EXISTS `web_eventlab_db`.`Cards` (
  `id` INT PRIMARY KEY,
  `sender` VARCHAR(100) NOT NULL,
  `description` VARCHAR(200),
  `imgURL` VARCHAR(50),
  INDEX `fk_Cards_Users1_idx` (`sender` ASC) VISIBLE,
  CONSTRAINT `fk_Cards_Users1`
    FOREIGN KEY (`sender`)
    REFERENCES `web_eventlab_db`.`Users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
)

CREATE TABLE IF NOT EXISTS `web_eventlab_db`.`Cards_Events`(
  `id` INT NOT NULL AUTO_INCREMENT,
  `CardID` INT NOT NULL,
  `EventID` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `events_has_cards_idx` (`CardID` ASC) VISIBLE,
  INDEX `events_has_cards_events_idx` (`EventID` ASC) VISIBLE,
  CONSTRAINT `events_has_cards_events`
    FOREIGN KEY (`EventID`)
    REFERENCES `web_eventlab_db`.`Events` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `events_has_cards`
    FOREIGN KEY (`CardID`)
    REFERENCES `web_eventlab_db`.`Cards` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
);

CREATE TABLE IF NOT EXISTS `web_eventlab_db`.`Presents` (
  `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT ,
  `Title` VARCHAR(30) NOT NULL,
  `Price` DECIMAL(10, 2) NOT NULL
)

CREATE TABLE IF NOT EXISTS `web_eventlab_db`.`Cards_Events`(
  `id` INT NOT NULL AUTO_INCREMENT,
  `PresentID` INT NOT NULL,
  `EventID` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `events_has_presents_idx` (`PresentID` ASC) VISIBLE,
  INDEX `events_has_presents_events_idx` (`EventID` ASC) VISIBLE,
  CONSTRAINT `events_has_presents_events`
    FOREIGN KEY (`EventID`)
    REFERENCES `web_eventlab_db`.`Events` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `events_has_presents`
    FOREIGN KEY (`PresentID`)
    REFERENCES `web_eventlab_db`.`Presents` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
);

CREATE TABLE IF NOT EXISTS `web_eventlab_db`.`Music` (
  `id` INT PRIMARY KEY,
  `sender` VARCHAR(100) NOT NULL,
  `title` VARCHAR(50) NOT NULL,
  `musicURL` VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS `web_eventlab_db`.`Music_Events` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `MusicID` INT NOT NULL,
  `EventID` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_Music_Events_Music1_idx` (`MusicID` ASC) VISIBLE,
  INDEX `fk_Music_Events_Events1_idx` (`EventID` ASC) VISIBLE,
  CONSTRAINT `fk_Music_Events_Music1`
    FOREIGN KEY (`MusicID`)
    REFERENCES `Music` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Music_Events_Events1`
    FOREIGN KEY (`EventID`)
    REFERENCES `Events` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
);

CREATE TABLE IF NOT EXISTS `web_eventlab_db`.`Comments` (
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `CommentText` VARCHAR(200) NOT NULL,
    `CommentDate` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `LikeCount` INT NOT NULL DEFAULT 0,
);

CREATE TABLE IF NOT EXISTS `web_eventlab_db`.`Comment_Events` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `CommentID` INT NOT NULL,
  `EventID` INT NOT NULL,
  `UserID` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_Comments_Events_Comments1_idx` (`CommentID` ASC) VISIBLE,
  INDEX `fk_Comments_Events_Events1_idx` (`EventID` ASC) VISIBLE,
  INDEX `fk_Comments_Events_Users1_idx` (`UserID` ASC) VISIBLE,
  CONSTRAINT `fk_Comments_Events_Comments1`
    FOREIGN KEY (`ID`)
    REFERENCES `Comments` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Comments_Events_Events1`
    FOREIGN KEY (`EventID`)
    REFERENCES `Events` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
  CONSTRAINT `fk_Comments_Events_Users1`
    FOREIGN KEY (`UserID`)
    REFERENCES `Users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
);
INDEX `fk_Comments_Events1_idx` (`EventID` ASC) VISIBLE,
    INDEX `fk_Comments_Users1_idx` (`UserID` ASC) VISIBLE,
    CONSTRAINT `fk_Comments_Events1`
        FOREIGN KEY (`EventID`)
        REFERENCES `web_eventlab_db`.`Events` (`id`)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION,
    CONSTRAINT `fk_Comments_Users1`
        FOREIGN KEY (`UserID`)
        REFERENCES `web_eventlab_db`.`Users` (`id`)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION

INSERT INTO Univesities (UnivesityName)
VALUES ('Софийски университет "Св. Климент Охридски"'),
('Технически университет София'),
('Университет за Национално и Световно стопанство'),
('Университет по Архитектура, Строителство и Геодезия');