const gulp = require('gulp'),
  config = require('../../config'),
  browserSync = require('browser-sync')

const copyPublic = () => {
  return gulp.src([config.publicFolder + '/**/*'])
    .pipe(gulp.dest(config.destFolder))
    .pipe(browserSync.reload({
      stream: true
    }))
}

module.exports = copyPublic
