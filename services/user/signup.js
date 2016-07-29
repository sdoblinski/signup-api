"use strict";

const config = require("../../config");
const utils = require("../../utils"),
  myError = utils.myError;
const User = require("../../models/user");
const UUID = require("node-uuid");
const sha1 = require("sha1");
const eJWT = require("express-jwt");
const jwt = require("jsonwebtoken");


function signup(req, res){ 
  return new Promise(function(resolve, reject) {
    const newUuid = UUID.v4();
    const newUser = new User();

    newUser.uuid = newUuid;
    newUser.token = jwt.sign({uuid:newUuid},config.jwt.secret);
    newUser.name = req.body.name; 
    newUser.email = req.body.email; 
    newUser.password = sha1(req.body.password);
    newUser.phones = req.body.phones;
    
    newUser.save()
    .then(u => resolve(u))
    .catch(e =>{
      if(e.code === 11000) 
        reject(myError(400, "E-mail já existente"));
      else 
        reject(myError(500, e));
    });  
  });
}

module.exports = signup;