"use strict";

const utils = require("../../utils"),
  myError = utils.myError,
  dateDifferenceInSeconds = utils.dateDifferenceInSeconds;
const User = require("../../models/user");

function getUuid(req, res) {
  return new Promise(function(resolve, reject) {
    User.findOne({uuid:req.params.uuid})
    .then(u => {
      if(dateDifferenceInSeconds(u.lastLogin.getTime()) >= 30)
        reject(myError(401, "Sessão inválida"));
      else
        resolve(u);
    })
    .catch(e => reject(myError(400, "Usuário não encontrado")));    
    });
}

module.exports = getUuid;