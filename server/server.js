// Get the packages we need
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var router = express.Router();

//replace this with your Mongolab URL
mongoose.connect('mongodb://avg:avg@ds023560.mlab.com:23560/svn_game_builder');
mongoose.connection.once('open', function () {
    console.log("Database successfully connect");
});

// Create our Express application
var app = express();
var Scene = require('./models/scene.js');
var Task = require('./models/status.js');

// Use environment defined port or 4000
var port = process.env.PORT || 4000;

//Allow CORS so that backend and frontend could pe put on different servers
var allowCrossDomain = function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept");
    next();
};
app.use(allowCrossDomain);

// Use the body-parser package in our application
app.use(bodyParser.urlencoded({
    extended: true
}));

// All our routes will start with /api
app.use('/api', router);

//The scene's route
var SceneRoute = router.route('/scene');
var scene = require('./api/scene_api')(SceneRoute);

//the scene_id's route.
var SceneRouteID = router.route('/scene/:session');
var sceneid = require('./api/scene_id_api.js')(SceneRouteID);


//Default route here
var homeRoute = router.route('/');


// Start the server
app.listen(port);
console.log('Server running on port ' + port);