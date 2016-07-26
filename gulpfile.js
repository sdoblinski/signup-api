"use strict";

var gulp = require('gulp');
var jshint = require('gulp-jshint');
var paths = ['./*.js', './models/*.js', './routes/*.js', './test/*.js'];

gulp.task('jshint', function(){
	return gulp.src(paths)
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish', {verbose:true}));
});