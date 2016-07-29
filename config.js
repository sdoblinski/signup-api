"use strict";

const config = {};

config.mongoURI = {
	development: "mongodb://localhost:27017/signup-dev",
	test: "mongodb://localhost:27017/signup-test"
};

config.jwt = {
	secret: "concrete solutions"
};

module.exports = config;
