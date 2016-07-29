"use strict";

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const validator = require("validator");

const userSchema = new Schema({
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
    required: [true, "Preencher campo name"]
  },
  email: {
    type: String,
    required: [true, "Preencher campo e-mail"],
    unique: true,
    validate:{ 
      validator: function(v){
        return validator.isEmail(v);
      },
      message: "E-mail inválido"
    }
  },
  password: {
    type: String,
    required: [true, "Preencher campo senha"]
  },
  phones: [String]
});

const User = mongoose.model("User", userSchema);

module.exports = User;