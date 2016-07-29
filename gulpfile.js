"use strict";

const gulp = require("gulp");
const jshint = require("gulp-jshint");
const paths = ["./*.js", "./models/*.js", "./routes/*.js", "./test/*.js"];

gulp.task("jshint", jshintTask);

function jshintTask(){
	return gulp.src(paths)
		.pipe(jshint())
		.pipe(jshint.reporter("jshint-stylish", {verbose:true}));
}