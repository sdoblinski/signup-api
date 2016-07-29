"use strict";

const config = require("./config");

function bootApp(app){
	app.listen(8080, function(err){
		if(err) throw err;
		if(app.settings.env == "development"){
			console.log("app na porta: 8080");
			console.log("banco "+config.mongoURI[app.settings.env]);
		}		
	});
}

function myError(code, msg){
	const err = new Error(msg);
	err.status = code;
	return err;
}

function dateDifferenceInSeconds(d){
	return Math.ceil(Math.abs(new Date().getTime() - d) / 1000 / 60);
}

module.exports = {
	bootApp,
	myError, 
	dateDifferenceInSeconds
};