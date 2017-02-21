var gulp = require('gulp');
var spawn = require('child_process').spawn;
var spawnSync = require('child_process').spawnSync;
const gulpExe = require.resolve('./node_modules/.bin/gulp');

gulp.task('default', ['run-without-client-logs']);
gulp.task('run-with-client-logs', ['watch-and-build-client', 'run-server']);
gulp.task('run-without-client-logs', ['watch-and-build-client-without-logs', 'run-server']);
gulp.task('run-server', function () {
    spawn(gulpExe, [], {stdio: 'inherit', cwd: 'server', shell: true});
});
gulp.task('watch-and-build-client', function () {
    spawn(gulpExe, [], {stdio: 'inherit', cwd: 'client', shell: true});
});
gulp.task('watch-and-build-client-without-logs', function () {
    spawn(gulpExe, ['watch-and-build-without-logs'], {stdio: 'inherit', cwd: 'client', shell: true});
});

gulp.task('install', ['npm-install-server', 'npm-install-client']);
gulp.task('npm-install-server', function () {
    spawnSync('npm', ['install'], {stdio: 'inherit', cwd: 'server', shell: true});
});
gulp.task('npm-install-client', function () {
    spawnSync('npm', ['install'],  {stdio: 'inherit', cwd: 'client', shell: true});
});

gulp.task('test', ['npm-test-server']);
gulp.task('npm-test-server', function () {
    spawnSync('npm', ['test'], {stdio: 'inherit', cwd: 'server', shell: true});
});
gulp.task('npm-test-client', function () {
    spawnSync('npm', ['test'],  {stdio: 'inherit', cwd: 'client', shell: true});
});

