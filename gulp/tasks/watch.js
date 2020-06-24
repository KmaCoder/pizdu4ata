const gulp = require('gulp'),
  config = require('../config'),
  browserSync = require('browser-sync'),
  scss = require('./compile/scss'),
  ts = require('./compile/ts'),
  njk = require('./compile/njk'),
  optimizeImages = require('./base/optimizeImages'),
  copyPublic = require('./base/copyPublic'),
  build = require('./build')

const watch = gulp.series(build, (done) => {
  browserSync.init({
    server: config.destFolder,
    host: config.browserSync.host,
    port: config.browserSync.port,
    open: false
  })
  gulp.watch(config.styles.srcWatch, scss)
  gulp.watch(config.scripts.srcWatch, ts)
  gulp.watch(config.images.src, optimizeImages)
  gulp.watch([config.njk.allSrc].concat(config.data.files), njk)
  gulp.watch([config.publicFolder + "/**/*"], copyPublic)
  done()
})

module.exports = watch
