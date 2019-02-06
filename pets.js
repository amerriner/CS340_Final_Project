module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getSpecies(res, mysql, context, complete){
        mysql.pool.query("SELECT s.id, s.name FROM species s", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.species = results;
            complete();
        });
    }

    function getPets(res, mysql, context, complete){
        mysql.pool.query("SELECT pets.id, pets.name, pets.birthdate, pets.specie FROM pets", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.pets = results;
            complete();
        });
    }

    function getPetsBySpecie(req, res, mysql, context, complete){
      var query = "SELECT pets.id, pets.name, pets.birthdate, pets.specie FROM pets WHERE pets.specie = ?";
      console.log(req.params)
      var inserts = [req.params.specie]
      mysql.pool.query(query, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.pets = results;
            complete();
        });
    }

    /* Find pets whose name starts with a given string in the req */
    function getPetWithNameLike(req, res, mysql, context, complete) {
      //sanitize the input as well as include the % character
       var query = "SELECT pets.id, pets.name, pets.birthdate, species.name FROM pets INNER JOIN species ON species.id = pets.specie WHERE pets.name LIKE " + mysql.pool.escape(req.params.s + '%');
      console.log(query)

      mysql.pool.query(query, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.pets = results;
            complete();
        });
    }
     
    function getPet(res, mysql, context, id, complete){
        var sql = "SELECT p.id, p.name, p.birthdate, p.specie FROM pets p WHERE id = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.pets = results[0];
            complete();
        });
    }

    /*Display all pets. Requires web based javascript to delete users with AJAX*/

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deletePet.js", "filterPets.js"];
        var mysql = req.app.get('mysql');
        getPets(res, mysql, context, complete);
        getSpecies(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('pets', context);
            }

        }
    });

    /*Display all pets from a given specie. Requires web based javascript to delete users with AJAX */
    router.get('/filter/:specie', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deletePet.js", "filterPets.js"];
        var mysql = req.app.get('mysql');
        getPetsBySpecie(req,res, mysql, context, complete);
        getSpecies(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('pets', context);
            }

        }
    });

    /*Display all pets whose name starts with a given string. Requires web based javascript to delete users with AJAX */ 
    router.get('/search/:s', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deletePet.js","filterPets.js","searchPets.js"];
        var mysql = req.app.get('mysql');
        getPeopleWithNameLike(req, res, mysql, context, complete);
        getPlanets(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('pets', context);
            }
        }
    });

    /* Display one pet for the specific purpose of updating pets */

    router.get('/:id', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["selectedSpecie.js", "updatePet.js"];
        var mysql = req.app.get('mysql');
        getPerson(res, mysql, context, req.params.id, complete);
        getPlanets(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('update-pet', context);
            }

        }
    });

    /* Adds a pet, redirects to the pets page after adding */

    router.post('/', function(req, res){
        console.log(req.body.specie)
        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO pets (name, birthdate, specie) VALUES (?,?,?)";
        var inserts = [req.body.name, req.body.birthdate, req.body.specie];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/pets');
            }
        });
    });

    /* The URI that update data is sent to in order to update a pet */

    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        console.log(req.body)
        console.log(req.params.id)
        var sql = "UPDATE pets SET name=?, birthdate=?, specie=? WHERE id=?";
        var inserts = [req.body.name, req.body.birthdate, req.body.specie, req.params.id];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(error)
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.status(200);
                res.end();
            }
        });
    });

    /* Route to delete a pet, simply returns a 202 upon success. Ajax will handle this.*/ 

    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM pets WHERE id = ?";
        var inserts = [req.params.id];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            }else{
                res.status(202).end();
            }
        })
    })

    return router;
}();
