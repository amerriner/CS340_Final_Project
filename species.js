
module.exports = function(){
    var express = require('express');
    var router = express.Router();

    /* Adds a person, redirects to the people page after adding */
    function getSpecies(res, mysql, context, complete){
	mysql.pool.query("SELECT s.id, s.name FROM species s", function (error, results, fields){
		if(error){
			res.write(JSON.stringify(error));
			res.end();
		}
		context.species = results;
		complete();
		});
   }

    router.get('/', function(req, res){
	var callbackCount = 0;
	var context = {};
	context.jsscripts = ["deleteSpecies.js"];
	var mysql = req.app.get('mysql');
	getSpecies(res, mysql, context, complete);
	function complete(){
		callbackCount++;
		if(callbackCount >= 1){
			res.render('species', context);
		}
	}
    });

    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO species (name) VALUES (?)";
        var inserts = [req.body.name, req.body.quantity];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/species');
            }
        });
    });

    return router;
}();
