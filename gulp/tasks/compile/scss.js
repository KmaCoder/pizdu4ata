const gulp = require('gulp'),
  browserSync = require('browser-sync'),
  config = require('../../config'),
  rename = require('gulp-rename'),
  sass = require('gulp-sass'),
  autoprefixer = require('gulp-autoprefixer')

const scss = () => {
  return gulp.src(config.styles.srcBuild)
    .on('error', console.error.bind(console))
    .pipe(sass({
      outputStyle: 'compressed',
      includePaths: ['node_modules']
    }).on('error', sass.logError))
    .pipe(autoprefixer({}))
    .pipe(rename({dirname: ''}))
    .pipe(gulp.dest(config.styles.dest))
    .pipe(browserSync.reload({
      stream: true
    }))
}

module.exports = scss
