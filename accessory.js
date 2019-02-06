module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getAccessories(res, mysql, context, complete){
	mysql.pool.query("SELECT a.id, a.name, a.quantity FROM accessories a", function (error, results, fields){
	    if (error){
		res.write(JSON.stringify(error));
		res.end();
	    }
	    context.accessories = results;
	    complete();
	});
    }

    function getAccessory(res, mysql, context, id, complete){
	var sql = "SELECT a.id, a.name, a.quantity FROM accessories a WHERE a.id = ?";
	var inserts = [id];
	mysql.pool.query(sql, inserts, function(error, results, fields){
	    if(error){
		res.write(JSON.stringify(error));
		res.end();
	    }
	    context.accessories = results[0];
            complete();
        });
    }

    router.get('/', function(req, res){
	var callbackCount = 0;
	var context = {};
	context.jsscripts = [];
	var mysql = req.app.get('mysql');
	getAccessories(res, mysql, context, complete);
	function complete(){
		callbackCount++;
		if(callbackCount >= 1){
			res.render('accessories', context);
		}
	}
    });

    router.get('/:id', function(req, res){
	callbackCount = 0;
	var context = {};
	context.jsscripts = ["updateAccessory.js"];
	var mysql = req.app.get('mysql');
        getAccessory(res, mysql, context, req.params.id, complete);
        function complete(){
		callbackCount++;
		if(callbackCount >= 1){
			res.render('update-accessories', context);
		}
	}
    });

    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO accessories (name, quantity) VALUES (?,?)";
        var inserts = [req.body.name, req.body.quantity];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/accessories');
            }
        });
    });

    router.post('/:id', function(req, res){
	var mysql = req.app.get('mysql');
        console.log(req.body)
	console.log(req.params.id)
        var sql = "UPDATE accessories SET name=?, quantity=? WHERE id=?";
	var inserts = [req.body.name, req.body.quantity, req.params.id];
	sql = mysql.pool.query(sql, inserts, function(error, results, fields){
		if(error){
			console.log(error);
			res.write(JSON.stringify(error));
			res.end();
		} else {
			res.status(200);
			res.end();
		}
	});
    });
    return router;
}();
