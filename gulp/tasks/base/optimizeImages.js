const gulp = require('gulp'),
  config = require('../../config'),
  browserSync = require('browser-sync'),
  imagemin = require('gulp-imagemin'),
  cache = require('gulp-cache')

const optimizeImages = () => {
  return gulp.src(config.images.src)
    .pipe(cache(imagemin({
      interlaced: true
    })))
    .pipe(gulp.dest(config.images.dest))
    .pipe(browserSync.reload({
      stream: true
    }))
}

module.exports = optimizeImages
