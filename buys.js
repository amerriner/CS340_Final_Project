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

    function getAccessories(res, mysql, context, complete){
	sql = "SELECT id, name, quantity FROM accessories";
	mysql.pool.query(sql, function(error, results, fields){
		if(error){
			res.write(JSON.stringify(error));
			res.end();
		}
		context.accessories = results;
		complete();
	});
    }

    function getBuys(res, mysql, context, complete){
	sql = "SELECT adopterID, accessoryID, CONCAT(fName, ' ', lName) AS adopterName FROM accessories INNER JOIN buys ON buys.accessoryID = accessories.id INNER JOIN adopters ON adopters.id = buys.adopterID ORDER BY adopterName, accessoryID";
	mysql.pool.query(sql, function(error, results, fields){
		if(error){
			res.write(JSON.stringify(error));
			res.end();
		}
		context.buys = results;
		complete();
	});
    }

    router.get('/', function(req, res){
	var callbackCount = 0;
	var context = {};
	context.jsscripts = ["deletePets.js"];
	var mysql = req.app.get('mysql');
	var handlebars_file = "buys";

	getAdopters(res, mysql, context, complete);
	getAccessories(res, mysql, context, complete);
	getBuys(res, mysql, context, complete);
	function complete(){
		callbackCount++;
		if(callbackCount >= 3){
			res.render(handlebars_file, context);
		}
	}
    });

    router.post('/', function(req, res){
	console.log("We get the multi-select pets dropdown as ", req.body.accessories);
	var mysql = req.app.get('mysql');

	var accessory = req.body.accessories;
	var adopterID = req.body.adopters;
	for (let accessoryID of accessory){
		var sql = "INSERT INTO buys (adopterID, accessoryID) VALUES (?,?)";
		var inserts = [adopterID, accessoryID];
		sql = mysql.pool.query(sql, inserts, function(error, results, fields){
			if(error){
				console.log(error);
			}
		});
	}
	res.redirect('/buys');
    });

    return router;
}(); 

