"use strict";

const express = require("express");
const app = require("../app.js");
const router = express.Router();
const signup = require("../services/user/signup");
const signin = require("../services/user/signin");
const getUuid = require("../services/user/getuuid");

router.post("/signup", function(req, res, next){
	signup(req, res)
	.then(u => res.status(200).json(u))
	.catch(e => next(e));
});
router.post("/signin", function(req, res, next){
	signin(req, res)
	.then(u => res.status(200).json(u))
	.catch(e => next(e));
});
router.get("/:uuid", function(req, res, next){
	getUuid(req, res)
	.then(u => res.status(200).json(u))
	.catch(e => next(e));
});

module.exports = router;