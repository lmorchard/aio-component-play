/* jshint node:true */
'use strict';

var fs = require('fs');
var es = require('event-stream');

var bowerDist = require('gulp-bower-dist');
var bump = require('gulp-bump');
var concat = require('gulp-concat');
var connect = require('gulp-connect');
var ghpages = require('gulp-gh-pages');
var gulp = require('gulp');
var helptext = require('gulp-helptext');
var jshint = require('gulp-jshint');
var rename = require('gulp-rename');
var rm = require('gulp-rm');
var stylus = require('gulp-stylus');
var vulcanize = require('gulp-vulcanize');

var paths = {
  'main': 'src/aio-play.html',
  'scripts': 'src/*.js',
  'stylesheets': 'src/*.styl',
  'themes': 'src/themes/**/*.styl',
  'src': 'src/**/*',
  'dist': 'dist/**/*',
  'index': 'index.html',
  'bowerComponents': 'bower_components/**/*',
};

var DATA = {
  HTML: fs.readFileSync('src/aio-play.html', {encoding: 'utf8'})
};

// build scripts and styles
gulp.task('build', ['lint','styles','themes','embedDataInJS','clean']);

gulp.task('embedDataInJS', function () {
  gulp.src('src/**/*.js')
    .pipe(embedDataInJS(DATA))
    .pipe(gulp.dest('dist'));
});

function embedDataInJS (data) {
  return es.map(function (file, cb) {
    file.contents = Buffer.concat([
      new Buffer("(function (__DATA) {\n\n"),
      file.contents,
      new Buffer("\n})(" + JSON.stringify(data) + ");\n")
    ]);
    return cb(null, file);
  });
}

gulp.task('lint', function() {
  gulp.src(paths.scripts)
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('styles', function() {
  return gulp.src(paths.stylesheets)
    .pipe(stylus())
    .pipe(concat('aio-play.css'))
    .pipe(gulp.dest('src'));
});

gulp.task('themes', function() {
  return gulp.src(paths.themes)
    .pipe(stylus())
    .pipe(gulp.dest('src/themes'));
});

gulp.task('clean', function() {
  gulp.src(['src/*.css', 'src/themes/**/*.css'])
    .pipe(rm());
});

gulp.task('connect', function() {
  connect.server({
    port: 3001
  });
});

gulp.task('watch', function () {
  gulp.watch(paths.src, ['build']);
});

// do a build, start a server, watch for changes
gulp.task('server', ['build','connect','watch']);

// Bump up the Version (patch)
gulp.task('bump', function(){
  gulp.src(['bower.json','package.json'])
  .pipe(bump())
  .pipe(gulp.dest('./'));
});

gulp.task('help', helptext({
  'default': 'Shows the help message',
  'help': 'This help message',
  'styles': 'Compiles main stylus',
  'themes': 'Compiles themes stylus',
  'vulcanize': 'Vulcanizes to component html file',
  'lint': 'Runs JSHint on your code',
  'server': 'Starts the development server',
  'bump': 'Bumps up the Version',
  'deploy': 'Publish to Github pages'
}));

// publish to gh pages
gulp.task('deploy', function () {
  gulp.src([
    paths.index,
    paths.dist,
    paths.bowerComponents
  ],{base:'./'})
    .pipe(ghpages());
});

gulp.task('default', ['help']);
