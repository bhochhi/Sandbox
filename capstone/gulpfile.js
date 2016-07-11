var gulp = require('gulp');
var connect = require('gulp-connect');
var uglify = require('gulp-uglify');
var rev = require('gulp-rev');
var plumber = require('gulp-plumber');
var livereload = require('gulp-livereload');
var jshint = require('gulp-jshint');
var browserify = require('gulp-browserify');
var concat = require('gulp-concat');

gulp.task('copy-html-files', function() {
  gulp.src(['app/**/*.html'], {base: 'app'})
      .pipe(gulp.dest('build'))
      .pipe(livereload({auto: false}));
});

gulp.task('copy-images', function() {
  gulp.src(['app/**/*.gif'], {base: 'app'})
      .pipe(gulp.dest('build'));
});

gulp.task('copy-css', function() {
  gulp.src(['node_modules/normalize.css/normalize.css'], {
      base: 'node_modules/'})
    .pipe(gulp.dest('./build/assets/vendor'));

  gulp.src(['app/**/*.css'], {base: 'app'})
      .pipe(gulp.dest('build'))
      .pipe(livereload({auto: false}));
});

gulp.task('browserify', function() {
  gulp.src(['app/app.js'])
    .pipe(plumber())
    .pipe(browserify({
      insertGlobals: true,
      debug: true
    }))
    .pipe(concat('bundle.js'))
    .pipe(gulp.dest('build/'))
    .pipe(livereload({auto: false}));
});

gulp.task('jshint', function() {
  return gulp.src('./app/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
});

gulp.task('connect', function() {
  connect.server({
    root: 'build/'
  });
});

gulp.task('livereload', function() {
  livereload.listen();
});

gulp.task('watch', function() {
  gulp.watch(['app/**/*.html'], ['copy-html-files']);
  gulp.watch(['app/**/*.js'], ['jshint', 'browserify']);
  gulp.watch(['app/**/*.css'], ['copy-css']);
});

gulp.task('dev', ['livereload', 'default', 'connect', 'watch']);

gulp.task('default', ['copy-html-files', 'copy-images', 'copy-css', 'browserify']);
