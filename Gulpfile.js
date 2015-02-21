var pkg = require('./package.json');
var path = require('path');


var gulp = require('gulp');
var merge = require('merge-stream');
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
  var main = gulp.src('public/js/app.js')
    .pipe(browserify())
    .pipe(rename('bundle.js'))
    .pipe(gulp.dest('public'));

  var tracking = gulp.src('public/js/tracking.js')
    .pipe(browserify())
    .pipe(rename('bundle-tracking.js'))
    .pipe(gulp.dest('public'));

  return merge(main, tracking);
});



gulp.task('default', ['build', 'compass']);

gulp.task('watch', function() {
  gulp.watch(['lib/*.js', 'public/js/*.js'], ['build']);
  gulp.watch('public/sass/*.sass', ['compass']);
});


gulp.task('serve',['build','watch'], function() {
  gulp.src('./')
    .pipe(webserver({
      open: true
    }));
});
