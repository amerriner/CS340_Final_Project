
-----------------------------------SELECTS--------------------------------

--
SELECT id, name, specie, birthdate FROM pets
--
SELECT p.name FROM pets p INNER JOIN isInterestedIn i ON i.petID = p.id INNER JOIN adopters a ON a.id = i.adopterID GROUP BY i.petID
--
SELECT a.fName, k.name FROM adopters a INNER JOIN buys b ON b.adopterID = a.id INNER JOIN accessories k ON k.name = b.accessoryName GROUP BY b.adopterID
--
SELECT s.name FROM species s INNER JOIN isFor f ON f.specieID = s.id INNER JOIN accessories a ON a.name = f.accessoryName GROUP BY f.accessoryName
--
SELECT a.id, a.name, a.quantity, FROM accessories a
--
SELECT a.id, a.name, a.quantity FROM accessories a WHERE a.id=?
--
SELECT id, fName, lName FROM adopters
--
SELECT id, name FROM species
--
SELECT id, fName, lName, FROM adopters a WHERE id=?

-----------------------------------INSERTS--------------------------------

-- add pet
INSERT INTO pets (name, specie, birthdate) VALUES (:nameInput_insert, :specieIDInput_insert, :birthdateInput_insert)
-- add new adopter
INSERT INTO adopters (fName, lName) VALUES (:fNameInput_insert, :lNameInput_insert)
-- add new accessory
INSERT INTO accessories (name, quantity) VALUES (:nameInput_insert, :quantityInput_insert)
-- associate adopter with pet and vice versa
INSERT INTO isInterestedin (petID, adopterID) VALUES (:petIDInput_insert, :adopterIDInput_insert)
-- associate accessories with adopter and vice versa
INSERT INTO buys (adopterID, accessoryID) VALUES (:adopterIDInput_insert, :accessoryIDInput_insert)
-- associate accessories with species
INSERT INTO isFor (accessoryId, specieID) VALUES (:accessoryIDInput_insert, :specieIDInput_insert)
-- add new species
INSERT INTO species (name) VALUES (:specieNameInput_Insert)
 
-----------------------------------UPDATES--------------------------------

-- UPDATE accessory quantity
UPDATE accessories SET name= :nameInput_Update, quantity = :quantityInput_update WHERE id=?

-----------------------------------DELETES--------------------------------

-- delete a pet (bought, deceased, etc)
DELETE FROM pets WHERE id = :pet_IDInput_del
-- dis-associate isInterestedin relationship (probably will be called in a loop to delete a pet or adopter)
DELETE FROM isInterestedin WHERE petID = :petIDInput_del AND adopterID = :adopterIDInput_del
-- delete a adopter(no longer interested, deceased, etc)
DELETE FROM adopters WHERE id = :adopter_IDInput_del
-- disassociate adopter to accessory
