"use strict";

var gulp   = require('gulp');
var babel  = require('gulp-babel');
var browserify = require('browserify');
var source	 = require('vinyl-source-stream');

gulp.task('default', ['buildsrc', 'buildclient', 'watch']);

gulp.task('buildsrc', function() {
	return gulp.src('src/**/*.js')
		.pipe(babel({
			plugins: ['syntax-async-functions', 'transform-runtime'],
			presets: ['es2015-node4', 'stage-3']
		}))
		.pipe(gulp.dest('build'));
});

gulp.task('buildclient', function() {
	return browserify({ entries: ['public/js/main.js'] })
	 .transform(['babelify'])
	   .bundle()
	   .pipe(source('bundle.js'))
	   .pipe(gulp.dest('public/js'));
});

gulp.task('watch', function() {
	gulp.watch(['src/**/*.js'], ['buildsrc']);
	gulp.watch(['public/js/**/*.js', '!public/js/bundle.js'], ['buildclient']);
});
