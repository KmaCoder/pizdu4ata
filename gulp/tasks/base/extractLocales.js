const gulp = require('gulp'),
  config = require('../../config'),
  fs = require('fs-extra'),
  gettextParser = require('gettext-parser'),
  gettextHelper = new (require('../../modules/gettextHelper'))()


const prepareGettextFiles = () => {
  let templateFile = fs.readFileSync('./locales/.language.po.template', 'utf8')

  // Add a blank .po file for a language if it doesn't exist already.
  config.gettext.languages.forEach(language => {
    if (!fs.existsSync('./locales/' + language + '.po')) {
      fs.writeFileSync('./locales/' + language + '.po', templateFile)
    }
  })
}

// Extract gettext strings from Nunjucks template files and .json data files.
const extractGettext = () => {
  // Extract all gettext strings for every supported language.
  config.gettext.languages.forEach(function (language) {
    // Load existing translations from .po file.
    let languageFile = fs.readFileSync('./locales/' + language + '.po')
    let oldTranslations = gettextParser.po.parse(languageFile)
    oldTranslations.charset = 'utf-8'

    // First extract string from templates then from data files.
    gettextHelper.extract(config.gettext.sources, 'templateExtraction', function (newTemplateTranslations) {

      // Run extraction for data files.
      gettextHelper.extract(config.gettext.dataSources, 'dataExtraction', function (newDataTranslations) {
        // Merge template and data strings.
        let mergedTranslations = gettextHelper.merge(newDataTranslations, newTemplateTranslations)
        // Merge new strings with strings loaded from the .po file.
        let updatedTranslations = gettextHelper.merge(mergedTranslations, oldTranslations, 'cleanup')

        // Write updated .po file.
        fs.writeFileSync('./locales/' + language + '.po', gettextParser.po.compile(updatedTranslations))
      })
    })
  })
}

const extractLocales = gulp.series((done) => {
  if (config.environment.env === 'dev') {
    prepareGettextFiles()
    extractGettext()
  }
  done()
})

module.exports = extractLocales
