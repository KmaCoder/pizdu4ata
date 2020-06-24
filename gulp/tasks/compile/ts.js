const gulp = require('gulp'),
  config = require('../../config'),
  path = require('path'),
  glob = require('glob'),
  browserSync = require('browser-sync'),
  browserify = require('browserify'),
  source = require('vinyl-source-stream'),
  tsify = require('tsify'),
  sourcemaps = require('gulp-sourcemaps'),
  buffer = require('vinyl-buffer'),
  uglify = require('gulp-uglify'),
  gulpif = require('gulp-if')

const compileScript = (entryPath, sourceName) =>
  () => browserify({
    entries: [entryPath],
    debug: true,
    cache: {},
    packageCache: {}
  })
    .plugin(tsify)
    .transform('babelify', {
      presets: [
        "@babel/preset-env"
      ],
      plugins: [
        "@babel/plugin-transform-runtime"
      ],
      extensions: ['.ts']
    })
    .bundle()
    .on('error', console.error.bind(console))
    .pipe(source(sourceName))
    .pipe(buffer())
    .pipe(gulpif(config.environment.env === 'prod', sourcemaps.init({loadMaps: true})))
    .pipe(gulpif(config.environment.env === 'prod', uglify()))
    .pipe(gulpif(config.environment.env === 'prod', sourcemaps.write('./')))
    .pipe(gulp.dest(config.scripts.dest))
// .pipe(browserSync.reload({
//   stream: true
// }))

const ts = (done) => {
  glob(config.scripts.src, (err, files) => {
    if (err) done(err)
    const tasks = files.map((entryPath) => {
      const sourceName = path.basename(entryPath, path.extname(entryPath)) + '.js'
      const task = compileScript(entryPath, sourceName)
      task.displayName = `ts:compile:${sourceName}`
      return task
    })
    return gulp.series(...tasks, (seriesDone) => {
      seriesDone()
      done()
    })()
  })
}

module.exports = ts
