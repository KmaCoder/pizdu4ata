const gulp = require('gulp'),
  config = require('../../config'),
  gulpClean = require('gulp-clean')

const clean = () => {
  return gulp.src(config.destFolder, {read: false, allowEmpty: true})
    .pipe(gulpClean())
}

module.exports = clean
