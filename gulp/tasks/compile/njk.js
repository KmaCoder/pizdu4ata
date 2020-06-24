const gulp = require('gulp'),
  browserSync = require('browser-sync'),
  config = require('../../config'),
  plumber = require('../../modules/plumber'),
  nunjuckTemplate = require('../../modules/nunjucksTemplate'),
  prettyUrl = require("gulp-pretty-url"),
  htmlmin = require('gulp-htmlmin')

const njk = (done) => {
  function renderTemplates(language) {
    return () => gulp.src(config.app.pageSrc)
      .pipe(plumber())
      .pipe(nunjuckTemplate({data: config.data.files}, language))
      .on('error', console.error.bind(console))
      .pipe(prettyUrl())
      .pipe(htmlmin({collapseWhitespace: true}))
      .pipe(gulp.dest(config.destFolder + (language !== config.app.defaultLanguage ? ('/' + language) : '')))
      .pipe(plumber())
      .pipe(browserSync.reload({
        stream: true
      }))
  }

  let languagesToRender = [config.app.defaultLanguage]

  if (config.environment.env === 'prod' || config.environment.env === 'stag')
    languagesToRender = config.app.languages
  else if (config.environment.languages.length > 0)
    languagesToRender = config.environment.languages

  const tasks = languagesToRender.map(l => {
    const task = renderTemplates(l)
    task.displayName = `njk:renderLang:${l}`
    return task
  })
  return gulp.series(...tasks, (seriesDone) => {
    seriesDone()
    done()
  })()
}

module.exports = njk
