const gulp = require('gulp'),
  extractLocales = require('./base/extractLocales'),
  copyPublic = require('./base/copyPublic'),
  clean = require('./base/clean'),
  optimizeImages = require('./base/optimizeImages'),
  scss = require('./compile/scss'),
  ts = require('./compile/ts'),
  njk = require('./compile/njk')

const generateSite = gulp.series(extractLocales, njk)
const buildParallel = gulp.parallel(ts, scss, copyPublic, optimizeImages, generateSite)
const build = gulp.series(clean, buildParallel)

module.exports = build
