"use strict";

const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const mongoose = require("mongoose");
const expressJWT = require("express-jwt");

const handler = require("./handler");
const config = require("./config");
const users = require("./routes/users");
const bootApp = require("./utils").bootApp;

const app = express();

app.use(helmet());
app.use(bodyParser.json());
app.use(expressJWT({secret:config.jwt.secret}).unless({path:"/users/signup"}));
app.use(handler.contentType);
app.use("/users", users);
app.use(handler.notFound);
app.use(handler.errorHandler);

mongoose.connect(config.mongoURI[app.settings.env])
.then(bootApp(app))
.catch(e => {throw e;});

module.exports = app;