module.exports = function(){
    var express = require('express');
    var router = express.Router();


    function getAccessories(res, mysql, context, complete){
	mysql.pool.query("SELECT id, name FROM accessories", function(error, results, fields){
		if(error){
			res.write(JSON.stringify(error));
			res.end();
		}
		context.accessories = results;
		complete();
	   });
    }

    function getSpecies(res, mysql, context, complete){
	sql = "SELECT id, name FROM species";
	mysql.pool.query(sql, function(error, results, fields){
		if(error){
			res.write(JSON.stringify(error));
			res.end();
		}
		context.species = results;
		complete();
	});
    }

    function getIsFor(res, mysql, context, complete){
	sql = "SELECT accessoryID, specieID, name AS accessoryName, species.name AS specieName FROM accessories INNER JOIN isFor i ON i.accessoryID = accessories.id INNER JOIN species ON species.id = i.specieID ORDER BY accessoryNameame, specieName";
	sql = "SELECT AC.ID AS accessoryID, SP.ID AS specieID FROM accessories AC INNER JOIN isFor i ON i.accessoryID = AC.id INNER JOIN species SP ON SP.id = i.specieID ORDER BY AC.name, SP.name";
	mysql.pool.query(sql, function(error, results, fields){
		if(error){
			res.write(JSON.stringify(error));
			res.end();
		}
		context.isFor = results;
		complete();
	});
    }

    router.get('/', function(req, res){
	var callbackCount = 0;
	var context = {};
	context.jsscripts = ["deleteAccessories.js"];
	var mysql = req.app.get('mysql');
	var handlebars_file = "isFor";

	getAccessories(res, mysql, context, complete);
	getSpecies(res, mysql, context, complete);
	getIsFor(res, mysql, context, complete);
	function complete(){
		callbackCount++;
		if(callbackCount >= 3){
			res.render(handlebars_file, context);
		}
	}
    });

    router.post('/', function(req, res){
	console.log("We get the multi-select accessory dropdown as ", req.body.accessory);
	var mysql = req.app.get('mysql');

	var accessories = req.body.accessories;
	var specieID = req.body.species;
	for (let accessoryID of accessories){
		var sql = "INSERT INTO isFor (specieID, accessoryID) VALUES (?,?)";
		var inserts = [specieID, accessoryID];
		sql = mysql.pool.query(sql, inserts, function(error, results, fields){
			if(error){
				console.log(error);
			}
		});
	}
	res.redirect('/isFor');
    });

    return router;
}(); 
