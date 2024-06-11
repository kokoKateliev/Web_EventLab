CREATE TABLE IF NOT EXISTS `web_eventlab_db`.`Roles` (
  `id` INT PRIMARY KEY,
  `Rolename` VARCHAR(50) NOT NULL,
  UNIQUE INDEX `name_UNIQUE` (`Rolename` ASC) 
)ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS `web_eventlab_db`.`Universities` (
  `id` INT PRIMARY KEY,
  `UniversityName` VARCHAR(50),
  UNIQUE INDEX `name_UNIQUE` (`UniversityName` ASC) 
)ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS `web_eventlab_db`.`Faculties` (
  `id` INT PRIMARY KEY,
  `Facultyname` VARCHAR(50) NOT NULL,
  UNIQUE INDEX `name_UNIQUE` (`Facultyname` ASC) 
)ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS `web_eventlab_db`.`universities_faculties` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `UniID` INT NOT NULL,
  `FacultyID` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `university_has_faculties_universities_idx` (`UniID` ASC),
  INDEX `university_has_faculties1_idx` (`FacultyID` ASC),
  CONSTRAINT `university_has_faculties1`
    FOREIGN KEY (`FacultyID`)
    REFERENCES `web_eventlab_db`.`Faculties` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `university_has_faculties_universities`
    FOREIGN KEY (`UniID`)
    REFERENCES `web_eventlab_db`.`Universities` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `web_eventlab_db`.`Users` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(256) NOT NULL,
  `Firstname` VARCHAR(50) NOT NULL,
  `Lastname` VARCHAR(50) NOT NULL,
  `Password` VARCHAR(256) NOT NULL,
  `Email` VARCHAR(256) NOT NULL,
  `RoleID` INT NOT NULL,
  `Birthdate` DATE NOT NULL,
  `UniversityID` INT NOT NULL,
  `FacultyID` INT,
  UNIQUE INDEX `username_UNIQUE` (`username` ASC) ,
  INDEX `fk_users_roles1_idx` (`RoleID` ASC) ,
  INDEX `fk_users_universities1_idx` (`UniversityID` ASC) ,
  CONSTRAINT `fk_users_roles1`
    FOREIGN KEY (`RoleID`)
    REFERENCES `web_eventlab_db`.`Roles` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_users_universities1`
    FOREIGN KEY (`UniversityID`)
    REFERENCES `web_eventlab_db`.`Universities` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
)ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS `web_eventlab_db`.`Events` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `EventName` VARCHAR(50) NOT NULL,
  `EventDescription` VARCHAR(500),
  `EventDateSt` DATE NOT NULL,
  `EventDateEn` DATE NOT NULL,
  `EventTimeSt` TIME NOT NULL,
  `EventTimeEn` TIME NOT NULL,
  `Location` VARCHAR(80),
  `isAnonymous` Boolean NOT NULL,
  `isPersonalized` Boolean NOT NULL
)ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS `web_eventlab_db`.`users_events` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `usersID` INT NOT NULL,
  `EventID` INT NOT NULL,
  `isAdmin` Boolean NOT NULL,
  `isHelper` Boolean NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_users_has_events_events1_idx` (`EventID` ASC) ,
  INDEX `fk_users_has_events_users1_idx` (`usersID` ASC) ,
  CONSTRAINT `fk_users_has_events_users1`
    FOREIGN KEY (`usersID`)
    REFERENCES `web_eventlab_db`.`Users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_users_has_events_events1`
    FOREIGN KEY (`EventID`)
    REFERENCES `web_eventlab_db`.`Events` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
)ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS `web_eventlab_db`.`events_faculties` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `EventID` INT NOT NULL,
  `FacultyID` INT NOT NULL,
  `isGlobal` Boolean DEFAULT FALSE,
  PRIMARY KEY (`id`),
  INDEX `faculties_has_events1_idx` (`FacultyID` ASC),
  INDEX `faculties_has_events1_events_idx` (`EventID` ASC) ,
  CONSTRAINT `faculties_has_events1`
    FOREIGN KEY (`FacultyID`)
    REFERENCES `web_eventlab_db`.`Faculties` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `faculties_has_events1_events`
    FOREIGN KEY (`EventID`)
    REFERENCES `web_eventlab_db`.`Events` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
)ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS `web_eventlab_db`.`Personalized` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `EventID` INT NOT NULL,
    `isVisible` Boolean NOT NULL,
    `celebratorID` INT NOT NULL,
    `Amount` DECIMAL, 
    INDEX `fk_Personalized_Events1_idx` (`EventID` ASC) ,
    INDEX `fk_user_celebrator1_idx` (`celebratorID` ASC) ,    
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
)ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS `web_eventlab_db`.`Cards` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `senderID` INT NOT NULL,
  `description` VARCHAR(200),
  `imgURL` VARCHAR(50),
  `EventID` INT NOT NULL, 
  INDEX `fk_Cards_Users1_idx` (`senderID` ASC),
  INDEX `events_has_cards_events_idx` (`EventID` ASC),
  CONSTRAINT `events_has_cards_events`
    FOREIGN KEY (`EventID`)
    REFERENCES `web_eventlab_db`.`Events` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION, 
  CONSTRAINT `fk_Cards_Users1`
    FOREIGN KEY (`senderID`)
    REFERENCES `web_eventlab_db`.`Users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
)ENGINE=INNODB;


CREATE TABLE IF NOT EXISTS `web_eventlab_db`.`Presents` (
  `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT ,
  `Title` VARCHAR(30) NOT NULL,
  `Price` DECIMAL(10, 2) NOT NULL,
  `EndDate` TIMESTAMP NOT NULL,
  `EventID` INT NOT NULL, 
  INDEX `events_has_presents_events_idx` (`EventID` ASC),
  CONSTRAINT `events_has_presents_events`
    FOREIGN KEY (`EventID`)
    REFERENCES `web_eventlab_db`.`Events` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
)ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS `web_eventlab_db`.`Music` (
  `id` INT  NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `senderID` INT NOT NULL,
  `title` VARCHAR(50) NOT NULL,
  `musicURL` VARCHAR(50) NOT NULL,
  `EventID` INT NOT NULL, 
  INDEX `fk_Music_Users1_idx` (`senderID` ASC),
  INDEX `fk_Music_Events_Events1_idx` (`EventID` ASC), 
  CONSTRAINT `fk_Music_Events_Events1` 
    FOREIGN KEY (`EventID`)
    REFERENCES `Events` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION, 
  CONSTRAINT `fk_Music_Users1`
    FOREIGN KEY (`senderID`)
    REFERENCES `web_eventlab_db`.`Users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
)ENGINE=INNODB;


CREATE TABLE IF NOT EXISTS `web_eventlab_db`.`Comments` (
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `CommentText` VARCHAR(200) NOT NULL,
    `CommentDate` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `LikeCount` INT NOT NULL DEFAULT 0,
    `EventID` INT NOT NULL, 
    `UserID` INT NOT NULL,
    INDEX `fk_Comments_Events_Events1_idx` (`EventID` ASC),
    INDEX `fk_Comments_Events_Users1_idx` (`UserID` ASC),
    CONSTRAINT `fk_Comments_Events_Events1`
      FOREIGN KEY (`EventID`)
      REFERENCES `Events` (`id`)
      ON DELETE NO ACTION
      ON UPDATE NO ACTION,
    CONSTRAINT `fk_Comments_Events_Users1`
      FOREIGN KEY (`UserID`)
      REFERENCES `Users` (`id`)
      ON DELETE NO ACTION
      ON UPDATE NO ACTION  
)ENGINE=INNODB;
