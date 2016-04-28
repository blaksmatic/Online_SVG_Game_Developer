var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var router = express.Router();

//mongoose.connect('mongodb://mp3user:mp3user@ds011409.mlab.com:11409/cs498rk');

var app = express();
app.use(express.static(__dirname + '/public'));

var port = process.env.PORT || 3000;
console.log("Express server running on " + port);
app.listen(process.env.PORT || port);

