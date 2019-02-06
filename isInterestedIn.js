module.exports = function(){
    var express = require('express');
    var router = express.Router();


    function getAdopters(res, mysql, context, complete){
	mysql.pool.query("SELECT id, fName FROM adopters", function(error, results, fields){
		if(error){
			res.write(JSON.stringify(error));
			res.end();
		}
		context.adopters = results;
		complete();
	   });
    }

    function getPets(res, mysql, context, complete){
	sql = "SELECT id, name FROM pets";
	mysql.pool.query(sql, function(error, results, fields){
		if(error){
			res.write(JSON.stringify(error));
			res.end();
		}
		context.pets = results;
		complete();
	});
    }

    function getIsInterestedIn(res, mysql, context, complete){
	sql = "SELECT adopterID, petID, CONCAT(fName, ' ', lName) AS adopterName, pets.name AS petName FROM pets INNER JOIN isInterestedIn i ON i.petID = pets.id INNER JOIN adopters ON adopters.id = i.adopterID ORDER BY adopterName, petName";
	mysql.pool.query(sql, function(error, results, fields){
		if(error){
			res.write(JSON.stringify(error));
			res.end();
		}
		context.isInterestedIn = results;
		complete();
	});
    }

    router.get('/', function(req, res){
	var callbackCount = 0;
	var context = {};
	context.jsscripts = ["deletePets.js"];
	var mysql = req.app.get('mysql');
	var handlebars_file = "adopters2";

	getAdopters(res, mysql, context, complete);
	getPets(res, mysql, context, complete);
	getIsInterestedIn(res, mysql, context, complete);
	function complete(){
		callbackCount++;
		if(callbackCount >= 3){
			res.render(handlebars_file, context);
		}
	}
    });

    router.post('/', function(req, res){
	console.log("We get the multi-select pets dropdown as ", req.body.pets);
	var mysql = req.app.get('mysql');

	var pet = req.body.pets;
	var adopterID = req.body.adopters;
	for (let petID of pet){
		var sql = "INSERT INTO isInterestedIn (adopterID, petID) VALUES (?,?)";
		var inserts = [adopterID, petID];
		sql = mysql.pool.query(sql, inserts, function(error, results, fields){
			if(error){
				console.log(error);
			}
		});
	}
	res.redirect('/adopters2');
    });

    return router;
}(); 
