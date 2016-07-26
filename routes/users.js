"use strict";

var express = require('express');
var app = require('../app.js');
var router = express.Router();
var user = require('../models/user');

router.post("/signup", function(req, res, next){
	user.signup(req, res)
	.then(u => res.status(200).json(u))
	.catch(e => next(e));
});
router.post("/signin", function(req, res, next){
	user.signin(req, res)
	.then(u => res.status(200).json(u))
	.catch(e => next(e));
});
router.get("/:uuid", function(req, res, next){
	user.getUuid(req, res)
	.then(u => res.status(200).json(u))
	.catch(e => next(e));
});

module.exports = router;