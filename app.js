"use strict";

var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var helmet = require('helmet');
var mongoose = require("mongoose");
var expressJWT = require("express-jwt");

var handler = require('./handler');
var config = require('./config');
var users = require('./routes/users');

var app = express();

app.use(helmet());
app.use(bodyParser.json());
app.use(expressJWT({secret:config.jwt.secret}).unless({path:'/users/signup'}));
app.use(handler.contentType);
app.use('/users', users);
app.use(handler.notFound);
app.use(handler.errorHandler);

mongoose.connect(config.mongoURI[app.settings.env], function(err) {
    if (err) throw err;
	var server = app.listen(process.env.PORT || 8080, function () {
		var port = server.address().port;
		if(app.settings.env == 'development'){
			console.log("app na porta:", port);
			console.log("banco "+config.mongoURI[app.settings.env]);
		}
	});    
});

module.exports = app;