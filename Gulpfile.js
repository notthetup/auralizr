var pkg = require('./package.json');
var path = require('path');


var gulp = require('gulp');
var jshint = require('gulp-jshint');
var compass = require('gulp-compass');
var webserver = require('gulp-webserver');
var browserify = require('gulp-browserify');
var rename = require('gulp-rename');

gulp.task('compass', function() {
  gulp.src('./public/sass/style.sass')
    .pipe(compass({
      project: path.join(__dirname, 'public'),
      style : 'compressed',
      css: '.',
      sass: 'sass'
    }));
});

gulp.task('jshint', function() {
  return gulp.src(['Gulpfile.js','./lib/*.js', 'public/js/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});


gulp.task('build', ['jshint'] , function() {
  return gulp.src('public/js/app.js')
    .pipe(browserify())
    .pipe(rename('bundle.js'))
    .pipe(gulp.dest('public'));
});



gulp.task('default', ['build', 'compass']);

gulp.task('watch', function() {
  gulp.watch(['lib/*.js', 'public/js/*.js'], ['build']);
  gulp.watch('public/sass/*.sass', ['compass']);
});


gulp.task('serve',['watch'], function() {
  gulp.src('./')
    .pipe(webserver({
      open: true
    }));
});
