var express = require('express');
var mysql = require('./dbcon.js');
var bodyParser = require('body-parser');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

app.engine('handlebars', handlebars.engine);
app.use(bodyParser.urlencoded({extended:true}));
app.use('/static', express.static('public'));
app.set('view engine', 'handlebars');
app.set('port', 52002);
app.set('mysql', mysql);
app.use('/', express.static('public'));
app.use('/pets', require('./pets.js'));
app.use('/accessories', require('./accessory.js'));
app.use('/adopters', require('./adopter.js'));
app.use('/species', require('./species.js'));
app.use('/adopters2', require('./isInterestedIn.js'));
app.use('/buys', require('./buys.js'));
app.use('/isFor', require('./isFor.js'));

app.get('/', function(req, res){
  res.render('homeDB');
});

app.get('/pets', function(req, res){
  var context = {};
  res.render('pets', context);
});

app.get('/adopters', function(req, res){
  var context = {};
  res.render('adopters', context);
});

app.get('/adopters2', function(req, res){
  var context = {};
  res.render('adopters2', context);
});

app.get('/accessories', function(req, res){
  var context = {};
  res.render('accessories', context);
});

app.get('/species', function(req, res){
  var context = {};
  res.render('species', context);
});

app.get('/buys', function(req, res){
  var context = {};
  res.render('buys', context);
});

app.get('/isFor', function(req, res){
  var context = {};
  res.render('isFor', context);
});

app.use(function(req, res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started, press Ctrl-C to terminate.');
});
