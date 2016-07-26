"use strict";

function myError(code, msg){
	let err = new Error(msg);
	err.status = code;
	return err;
}

function diffDate(d){
	return Math.ceil(Math.abs(new Date().getTime() - d) / 1000 / 60);
}

module.exports = {
	myError, 
	diffDate
};