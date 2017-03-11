var gulp = require('gulp');
var webpack = require('webpack-stream');
var zip = require('gulp-zip');
var gsub = require('gulp-gsub');
var git = require('git-rev');
// https://stackoverflow.com/questions/40573196/using-webpack-2-from-gulp-webpack-stream-for-webpack-2
var webpack2 = require('webpack');

gulp.task('default', function() {
  return gulp.src('app.js')
    .pipe(webpack(require('./webpack.config.js'), webpack2))
    .pipe(gulp.dest('build/'));
});

gulp.task('timestamp', function(cb) {
  git.long(function(commit) {
    git.branch(function(branch) {
      return gulp.src('timestamp.txt')
        .pipe(gsub({source: '_TIMESTAMP_', target: process.env.BUILDTIMESTAMP || new Date().toISOString() || "No BUILDTIMESTAMP variable set"}))
        .pipe(gsub({source: '_BRANCH_', target: process.env.BRANCH || branch || "No BRANCH variable set"}))
        .pipe(gsub({source: '_BUILD_NUMBER_', target: process.env.BUILDNUMBER || "No BUILDNUMBER variable set" }))
        .pipe(gsub({source: '_BUILD_KEY_', target: process.env.BUILDKEY || "No BUILDKEY variable set" }))
        .pipe(gsub({source: '_BAMBOO_REVISION_', target: process.env.CHANGELIST || commit || "No CHANGELIST variable set" }))
        .pipe(gulp.dest('build/'))
        .on('end', cb)
    });
  });
})

gulp.task('package', ['default', 'timestamp'], function() {
  var branch = process.env.BRANCH;
  var buildnr = process.env.BUILDNUMBER;
  var project_name = 'build';
  var archive_name = project_name+'.zip';
  if (branch && buildnr) {
    archive_name = project_name+'-'+branch+'.'+buildnr+'.zip';
  }
  return gulp.src(['build/**/*', '!build/'+project_name+'*.zip'])
    .pipe(zip(archive_name))
    .pipe(gulp.dest('build'));
});
