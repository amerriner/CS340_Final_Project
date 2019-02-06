
 CREATE TABLE `species` (
  `id` int(50) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

 CREATE TABLE `pets` (
   `id` int(50) NOT NULL AUTO_INCREMENT,
   `name` varchar(50) NOT NULL,
   `birthdate` DATE NOT NULL DEFAULT "2000-01-01",
   `specie` int(50) NOT NULL,
   PRIMARY KEY (`id`),
   FOREIGN KEY (`specie`) REFERENCES `species`(`id`)
) ENGINE=InnoDB;

 CREATE TABLE `accessories` (
   `id` int(50) NOT NULL AUTO_INCREMENT,
   `name` varchar(50) NOT NULL,
   `quantity` int(50) NOT NULL DEFAULT 0,
   PRIMARY KEY (`id`)
) ENGINE=InnoDB;

 CREATE TABLE `adopters`(
   `id` int(50) NOT NULL AUTO_INCREMENT,
   `lName` varchar(50),
   `fName` varchar(50) NOT NULL,
   PRIMARY KEY (`id`)
) ENGINE=InnoDB;

 CREATE TABLE `isInterestedIn`(
   `petID` int(50) NOT NULL,
   `adopterID` int(50) NOT NULL DEFAULT 0,
   PRIMARY KEY (petID, adopterID),
   FOREIGN KEY (`petID`) REFERENCES `pets`(`id`) ON DELETE CASCADE,
   FOREIGN KEY (`adopterID`) REFERENCES `adopters`(`id`)
) ENGINE=InnoDB;

 CREATE TABLE `buys`(
   `adopterID` int(50) NOT NULL,
   `accessoryID` INT(50) NOT NULL,
   PRIMARY KEY (adopterID, accessoryID),
   FOREIGN KEY (`adopterID`) REFERENCES `adopters`(`id`),
   FOREIGN KEY (`accessoryID`) REFERENCES `accessories`(`id`)
) ENGINE=InnoDB;

 CREATE TABLE `isFor`(
   `accessoryID` INT(50) NOT NULL,
   `specieID` int(50) NOT NULL,
   PRIMARY KEY (accessoryID, specieID),
   FOREIGN KEY (`accessoryID`) REFERENCES `accessories`(`id`),
   FOREIGN KEY (`specieID`) REFERENCES `species`(`id`)
) ENGINE=InnoDB;

INSERT INTO species (name) values ("Dog"), ("Cat"), ("Hamster"), ("Snake"), ("Ferret");

INSERT INTO pets (name, birthdate, specie) values ("Frodo Waggins", "2016-09-22", 1),("Neil Patrick Hamster", "2015-03-05", 3), ("Harry Pawtter", "2007-07-31", 2), ("Sir Hiss", "2010-03-01", 4), ("Ralph", "2015-11-14", 1), ("Meowcifer", "2015-06-06", 2), ("Professor Purr", "2012-02-21", 2), ("Cat", "2014-07-23", 1), ("Ferret Fawcett", "2013-01-12", 5);

INSERT INTO accessories (name, quantity) values ("Ferret Bed", 23), ("Dog Food", 51), ("Hamster Wheel", 2), ("Dog Leash", 7);

INSERT INTO adopters (lName, fName) values ("Weasley", "Fred"), ("Smith", "John"), ("Mapa", "Michael"), ("Merriner", "Ashley");

INSERT INTO isInterestedIn (petID, adopterID) values (2, 3), (3, 2), (5, 4), (9, 1);

INSERT INTO buys (adopterID, accessoryID) values (1, 1), (2, 2), (3, 3), (4, 4);

INSERT INTO isFor (accessoryID, specieID) values (1, 5), (2, 1), (3, 3), (4, 1); 
