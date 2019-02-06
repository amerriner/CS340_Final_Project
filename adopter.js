module.exports = function(){
    var express = require('express');
    var router = express.Router();

    /* Adds a person, redirects to the people page after adding */
    
    function getPets(res, mysql, context, complete){
	mysql.pool.query("SELECT p.id, p.name FROM pets p", function (error,results, fields){
		if(error){
		   res.write(JSON.stringify(error));
		   res.end();
		}
		context.pets = results;
		complete();
	   });
    }

    function getAdopters(res, mysql, context, complete){
	mysql.pool.query("SELECT adopters.id, adopters.fName, adopters.lName FROM adopters", function(error, results, fields){
		if (error){
		    res.write(JSON.stringify(error));
		    res.end();
		}
		context.adopters = results;
		complete();
	     });
	}
    function getAdopter(res, mysql, context, id, complete){
	var sql ="SELECT a.id, a.fName, a.lName, FROM adopters a WHERE a.id =?";
	var inserts = [id];
	mysql.pool.query(sql, inserts, function(error, results, fields){
		if (error){
		     res.write(JSON.stringify(error));
		     res.end();
		}
		context.adopter = results[0];
		complete();
	    });
	}

    router.get('/', function(req, res){
	var callbackCount = 0;
	var context = {};
	context.jsscripts = ["deleteAdopter.js", "filterAdopters.js", "searchAdopters.js"];
	var mysql = req.app.get('mysql');
	getAdopters(res, mysql, context, complete);
	getPets(res, mysql, context, complete);
	function complete(){
	     callbackCount++;
	     if (callbackCount >= 2) {
		res.render('adopters', context);
	     }
	}
    });

    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO adopters (fName, lName) VALUES (?,?)";
        var inserts = [req.body.fName, req.body.lName];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/adopters');
            }
        });
    });

    return router;
}();
