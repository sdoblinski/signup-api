"use strict";

const config = require("../../config");
const utils = require("../../utils"),
  myError = utils.myError;
const sha1 = require("sha1");
const User = require("../../models/user");

function signin(req, res) { 
  return new Promise(function(resolve, reject) {
    User.findOne({email:req.body.email})
      .then(u => {
        if(u.password !== sha1(req.body.password)){
          reject(myError(401, " Usuário e/ou senha inválidos"));
        }
        else{
          u.update({$set: {lastLogin:new Date(), updateDate:new Date()}})
          .then(ok => resolve(u))
          .catch(e => reject(myError(400, e)));
        }     
        
      })
      .catch(e => reject(myError(401, "Usuário e/ou senha inválidos")));
  }); 
}

module.exports = signin;