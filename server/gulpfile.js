var gulp = require('gulp');
var ts = require('gulp-typescript');
var tsProject = ts.createProject('tsconfig.json');
var sourcemaps = require('gulp-sourcemaps');
var spawn = require('child_process').spawn;
var runSequence = require('run-sequence');
var jasmine = require('gulp-jasmine');

gulp.task('default', function () {
  runSequence('build', 'unittests', ['watch', 'run']);
});

gulp.task('watch', function () {
  gulp.watch(['./**/*.ts', '!./public/**/*'], ['build']);
});

gulp.task('run', function () {
  spawn('node', ['app.js'], {stdio: 'inherit'});
});

gulp.task('build', function () {
  return tsProject.src()
    .pipe(sourcemaps.init())
    .pipe(tsProject()).js
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./'));
});

// Just run tests, app must have been started before
gulp.task('jasmine', function () {
  return gulp.src('spec/*.js').pipe(jasmine());
});

// run only unittests, no integration tests
gulp.task('unittests', function () {
  return gulp.src('spec/models/*.js').pipe(jasmine());
});

// Start app, run tests and stop app
gulp.task('test', function () {
  return runSequence(['run', 'jasmine'], function () {
    process.exit();
  });
});
