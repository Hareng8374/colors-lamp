-- Database setup for the COLORS app (COP 4331 LAMP lab).
-- Creates the COP4331 database, its tables, sample data, and the MySQL user
-- that the PHP API connects as. Taken from the lab handout.
--
-- Before running:
--   Replace CHANGE_ME near the bottom of this file with a real password, and
--   put the same password in api/config.php (DB_PASS). Do not commit it.
--
-- Run as a MySQL user that can create databases and users, for example:
--   mysql -u root -p < database/schema.sql

CREATE DATABASE COP4331;
USE COP4331;

-- Accounts that can log in. Passwords are stored as plain text.
CREATE TABLE `COP4331`.`Users`
(
    `ID` INT NOT NULL AUTO_INCREMENT ,
    `FirstName` VARCHAR(50) NOT NULL DEFAULT '' ,
    `LastName` VARCHAR(50) NOT NULL DEFAULT '' ,
    `Login` VARCHAR(50) NOT NULL DEFAULT '' ,
    `Password` VARCHAR(50) NOT NULL DEFAULT '' ,
    PRIMARY KEY (`ID`)
) ENGINE = InnoDB;

-- Colors saved by each user. UserID is the ID of the owning row in Users.
CREATE TABLE `COP4331`.`Colors`
(
    `ID` INT NOT NULL AUTO_INCREMENT ,
    `Name` VARCHAR(50) NOT NULL DEFAULT '' ,
    `UserID` INT NOT NULL DEFAULT '0' ,
    PRIMARY KEY (`ID`)
) ENGINE = InnoDB;

-- Not used by the COLORS app. Created in the lab as a starting point for the
-- later team project.
CREATE TABLE `COP4331`.`Contacts`
(
    `ID` INT NOT NULL AUTO_INCREMENT ,
    `FirstName` VARCHAR(50) NOT NULL DEFAULT '' ,
    `LastName` VARCHAR(50) NOT NULL DEFAULT '' ,
    `Phone` VARCHAR(50) NOT NULL DEFAULT '' ,
    `Email` VARCHAR(50) NOT NULL DEFAULT '' ,
    `UserID` INT NOT NULL DEFAULT '0' ,
    PRIMARY KEY (`ID`)
) ENGINE = InnoDB;

-- Sample users. Rows 1 and 2 store plain text passwords, which is what the
-- current front end sends. Rows 3 and 4 store the MD5 hashes of the same two
-- passwords, for use if MD5 hashing is turned on in public/js/code.js.
insert into Users (FirstName,LastName,Login,Password) VALUES ('Rick','Leinecker','RickL','COP4331');
insert into Users (FirstName,LastName,Login,Password) VALUES ('Sam','Hill','SamH','Test');
insert into Users (FirstName,LastName,Login,Password) VALUES ('Rick','Leinecker','RickL','5832a71366768098cceb7095efb774f2');
insert into Users (FirstName,LastName,Login,Password) VALUES ('Sam','Hill','SamH','0cbc6611f5540bd0809a388dc95a615b');

-- Sample colors for users 1 and 3.
insert into Colors (Name,UserID) VALUES ('Blue',1);
insert into Colors (Name,UserID) VALUES ('White',1);
insert into Colors (Name,UserID) VALUES ('Black',1);
insert into Colors (Name,UserID) VALUES ('gray',1);
insert into Colors (Name,UserID) VALUES ('Magenta',1);
insert into Colors (Name,UserID) VALUES ('Yellow',1);
insert into Colors (Name,UserID) VALUES ('Cyan',1);
insert into Colors (Name,UserID) VALUES ('Salmon',1);
insert into Colors (Name,UserID) VALUES ('Chartreuse',1);
insert into Colors (Name,UserID) VALUES ('Lime',1);
insert into Colors (Name,UserID) VALUES ('Light Blue',1);
insert into Colors (Name,UserID) VALUES ('Light Gray',1);
insert into Colors (Name,UserID) VALUES ('Light Red',1);
insert into Colors (Name,UserID) VALUES ('Light Green',1);
insert into Colors (Name,UserID) VALUES ('Chiffon',1);
insert into Colors (Name,UserID) VALUES ('Fuscia',1);
insert into Colors (Name,UserID) VALUES ('Brown',1);
insert into Colors (Name,UserID) VALUES ('Beige',1);
insert into Colors (Name,UserID) VALUES ('Blue',3);
insert into Colors (Name,UserID) VALUES ('White',3);
insert into Colors (Name,UserID) VALUES ('Black',3);
insert into Colors (Name,UserID) VALUES ('gray',3);
insert into Colors (Name,UserID) VALUES ('Magenta',3);
insert into Colors (Name,UserID) VALUES ('Yellow',3);
insert into Colors (Name,UserID) VALUES ('Cyan',3);
insert into Colors (Name,UserID) VALUES ('Salmon',3);
insert into Colors (Name,UserID) VALUES ('Chartreuse',3);
insert into Colors (Name,UserID) VALUES ('Lime',3);
insert into Colors (Name,UserID) VALUES ('Light Blue',3);
insert into Colors (Name,UserID) VALUES ('Light Gray',3);
insert into Colors (Name,UserID) VALUES ('Light Red',3);
insert into Colors (Name,UserID) VALUES ('Light Green',3);
insert into Colors (Name,UserID) VALUES ('Chiffon',3);
insert into Colors (Name,UserID) VALUES ('Fuscia',3);
insert into Colors (Name,UserID) VALUES ('Brown',3);
insert into Colors (Name,UserID) VALUES ('Beige',3);

-- MySQL user for the PHP API. Replace CHANGE_ME with a real password.
CREATE USER 'TheBeast'@'%' IDENTIFIED BY 'CHANGE_ME';
GRANT ALL PRIVILEGES ON COP4331.* TO 'TheBeast'@'%';
