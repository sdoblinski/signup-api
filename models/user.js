var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;
var validator = require('validator');
var config = require('../config');
var UUID = require('node-uuid');
var sha1 = require('sha1');
var eJWT = require("express-jwt");
var jwt = require("jsonwebtoken");
var userSchema;
var User;


userSchema = new Schema({
  uuid: String,
  createDate: {
    type: Date,
    default: new Date()
  },
  updateDate: {
    type: Date,
    default: new Date()
  },
  lastLogin: {
    type: Date,
    default: new Date()
  },
  token: {
    type: String
  },
  name: {
    type: String,
    required: [true, 'Preencher campo name']
  },
  email: {
    type: String,
    required: [true, 'Preencher campo e-mail'],
    unique: true,
    validate:{ 
      validator: function(v){
        return validator.isEmail(v);
      },
      message: 'E-mail inválido'
    }
  },
  password: {
    type: String,
    required: [true, 'Preencher campo senha']
  },
  phones: [String]
});


User = mongoose.model('User', userSchema);


function signup(req, res){ 
  return new Promise(function(resolve, reject) {
    let newUuid = UUID.v4();
    let newUser = new User();

    newUser.uuid = newUuid;
    newUser.token = jwt.sign({uuid:newUuid},config.jwt.secret);
    newUser.name = req.body.name; 
    newUser.email = req.body.email; 
    newUser.password = sha1(req.body.password);
    newUser.phones = req.body.phones;
    
    newUser.save()
    .then(u => resolve(u))
    .catch(function(e){
      if(e.code == 11000) 
        reject(myError(400, 'E-mail já existente'));
      else 
        reject(myError(400, e));
    });  
  });
}

function signin(req, res) { 
  return new Promise(function(resolve, reject) {
    User.findOne({email:req.body.email})
      .then(function(u){
        if(u.password !== sha1(req.body.password)){
          reject(myError(401, "Usuário e/ou senha inválidos"));
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


function getUuid(req, res) {
  return new Promise(function(resolve, reject) {
    User.findOne({uuid:req.params.uuid})
    .then(function(u){
      if(diffDate(u.lastLogin.getTime()) >= 30)
        reject(myError(401, "Sessão inválida"));
      else
        resolve(u);
    })
    .catch(e => reject(myError(400, "Usuário não encontrado")));    
    });
}


function myError(code, msg){  
  let err = new Error(msg);
  err.status = code;
  return err;
}


function diffDate(d){
  return Math.ceil(Math.abs(new Date().getTime() - d) / 1000 / 60);
}


module.exports = {
  User: User,
  signup: signup,
  signin: signin,
  getUuid: getUuid
}; 