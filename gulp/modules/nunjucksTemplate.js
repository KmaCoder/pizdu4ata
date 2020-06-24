const _ = require('lodash')
const fs = require('fs')
const path = require('path')
const through = require('through2')
const nunjucks = require('nunjucks')
const gettextNode = require('node-gettext')
const gettextParser = require('gettext-parser')
const nunjucksMarkdown = require('nunjucks-markdown')
const marked = require('marked')
const stripJSONComments = require('strip-json-comments')
const moment = require('moment')
const PluginError = require('plugin-error')

// Custom modules
const gettextHelper = new (require('./gettextHelper'))()
const sortProperties = require("./utils").sortProperties

// Get config from config.js
const config = require('../config')

function nunjucksTemplate(options, lang) {
  // Default values.
  const defaults = {
    templateDir: config.app.templatesPath,
    templateExt: '.njk'
  }

  // Merge defaults with options.
  options = _.assign(defaults, options)

  // Language support.
  const language = lang || config.app.defaultLanguage
  const translate = new gettextNode()
  const languageFile = fs.readFileSync('locales/' + gettextHelper.stripLanguage(language) + '.po')
  translate.addTranslations(language, 'messages', gettextParser.po.parse(languageFile))
  translate.setLocale(language)

  // Through.
  return through.obj((file, enc, cb) => {
    if (file.isStream()) {
      cb(new PluginError({
        plugin: 'nunjucks-template',
        message: 'Streaming not supported'
      }))
      return
    }

    // Variables.
    const frontmatterData = file.frontmatter || {}
    let data = {}
    let localData = file.localData || {}
    let markdownData
    let templatePath

    /**
     * Figures out Template Path
     * Priority 1 : options given by user
     * Priority 2 : template in frontmatter
     * Fallback   : Use self
     */
    if (options.template) {
      templatePath = path.join(process.cwd(), options.templateDir, options.template + options.templateExt)
      try {
        fs.openSync(templatePath, 'r')
      } catch (e) {
        cb(pluginError(`${options.template}${options.templateExt} not found in ${options.templateDir}`))
      }

    } else if (!_.isEmpty(frontmatterData) && frontmatterData.template) {
      templatePath = path.join(file.cwd, options.templateDir, frontmatterData.template + options.templateExt)
      try {
        fs.openSync(templatePath, 'r')
      } catch (e) {
        cb(pluginError(`${frontmatterData.template}${options.templateExt} not found in ${options.templateDir}`))
      }
    } else {
      templatePath = file.path
    }

    // Set markdown data to (if any).
    markdownData = file.contents ? {body: file.contents.toString()} : {}

    // Get data from data (if any).
    if (options.data) {
      const sources = options.data
      if (_.isString(sources)) {
        data = getDataFromSource(sources, data, translate)
      } else if (_.isArray(sources)) {
        _.forEach(sources, (source) => {
          data = getDataFromSource(source, data, translate)
        })
      }
    }

    // Get data from additional sources (if any).
    if (file.frontmatter) {
      const sources = file.frontmatter.data || file.frontmatter.sources
      if (_.isString(sources)) {
        localData = getDataFromSource(sources, localData, translate)
      } else if (_.isArray(sources)) {
        _.forEach(sources, (source) => {
          localData = getDataFromSource(source, localData, translate)
        })
      }
    }

    // Add active language and languages to data.
    data = _.assign(data, {
      availableLanguages: config.app.languages,
      defaultLanguage: config.app.defaultLanguage,
      activeLanguage: language
    })

    // Inject dynamic data.
    data.siteUrl = config.environment.baseUrl

    // Inject active env.
    data.activeEnv = config.environment.env

    // Get active page name and inject it with replaced 'index'
    const fileStartStr = '/pages/'
    const fileEndStr = defaults.templateExt

    let activePage = templatePath
      .substring(templatePath.indexOf(fileStartStr) + fileStartStr.length, templatePath.indexOf(fileEndStr))
      .replace('index', '')
      .replace('//', '/')

    if (activePage.endsWith('/'))
      activePage = activePage.substring(0, activePage.length - 1)

    data.activePage = activePage

    // Inject full site url with language and active page
    data.siteFullUrl = data.siteUrl + (language !== undefined && language !== config.app.defaultLanguage ? ('/' + language) : '') + '/' + data.activePage

    // Consolidates data.
    data = _.assign(data, frontmatterData, markdownData, localData)

    // Setup Nunjucks environment
    const environment = new nunjucks.Environment(new nunjucks.FileSystemLoader(
      [options.templateDir, path.join(process.cwd(), 'app/pages')]
    ))

    environment.opts = _.assign(environment.opts, {
      autoescape: false,
      watch: false,
      nocache: true
    })

    // Add gettext functions.
    // Expose all gettext functions to global.
    const translateGlobal = translate
    translateGlobal.gettextFunctions = {
      _gettext: {
        alias: '_',
        method: function (msgid) {
          return translateGlobal.gettext(msgid)
        }
      },
      _dgettext: {
        alias: '_d',
        method: function (domain, msgid) {
          return translateGlobal.dgettext(domain, msgid)
        }
      },
      _ngettext: {
        alias: '_n',
        method: function (msgid, msgidPlural, count) {
          return translateGlobal.ngettext(msgid, msgidPlural, count)
        }
      },
      _dngettext: {
        alias: '_dn',
        method: function (domain, msgid, msgidPlural, count) {
          return translateGlobal.dngettext(domain, msgid, msgidPlural, count)
        }
      },
      _pgettext: {
        alias: '_p',
        method: function (msgctxt, msgid) {
          return translateGlobal.pgettext(msgctxt, msgid)
        }
      },
      _dpgettext: {
        alias: '_dp',
        method: function (domain, msgctxt, msgid) {
          return translateGlobal.dpgettext(domain, msgctxt, msgid)
        }
      },
      _npgettext: {
        alias: '_np',
        method: function (msgctxt, msgid, msgidPlural, count) {
          return translateGlobal.npgettext(msgctxt, msgid, msgidPlural, count)
        }
      },
      _dnpgettext: {
        alias: '_dnp',
        method: function (domain, msgctxt, msgid, msgidPlural, count) {
          return translateGlobal.dnpgettext(domain, msgctxt, msgid, msgidPlural, count)
        }
      }
    }

    // Load the 'node-gettext' lib to the Nunjucks environment as 'translate'.
    environment.addGlobal('translate', translateGlobal)

    // Expose data as globalData.
    environment.addGlobal('globalData', data)

    // Load all gettext functions into global.
    for (const _function in translateGlobal.gettextFunctions) {
      const functionStructure = {
        name: _function.replace('_', ''),
        alias: translateGlobal.gettextFunctions[_function].alias,
        method: translateGlobal.gettextFunctions[_function].method
      }

      environment.addGlobal(functionStructure.name, functionStructure.method).addGlobal(functionStructure.alias, functionStructure.method)
    }

    // Function to load translated markdown.
    environment.addGlobal('translateMarkdown', function (filePath) {
      const base = filePath.split('/')[0]
      return filePath.slice(0, base.length + 1) + language + filePath.slice(base.length)
    })

    // Get url of translated active page.
    environment.addGlobal('getUrlTranslated', function (lang = "") {
      let url = config.environment.baseUrl
      if (config.environment.env === 'dev')
        url = '//' + config.browserSync.host + ':' + config.browserSync.port

      if (lang !== config.app.defaultLanguage)
        url += ('/' + lang)

      return (url + "/" + activePage)
    })

    function getRootLink(uri) {
      let url = config.environment.baseUrl
      if (config.environment.env === 'dev')
        url = '//' + config.browserSync.host + ':' + config.browserSync.port
      return url + uri
    }

    function getAssetLink(uri) {
      return getRootLink('/assets' + uri)
    }

    function format (str, o) {
      return str.replace(/{([^{}]*)}/g,
        function (a, b) {
          const r = o[b];
          return typeof r === 'string' || typeof r === 'number' ? r : a;
        }
      )
    }

    // console.log(format())

    environment.addFilter('format', format)

    // For accessing assets
    environment.addGlobal('asset', getAssetLink)
    environment.addGlobal('root', getRootLink)
    environment.addGlobal('image', filePath => getAssetLink('/images/' + filePath))
    environment.addGlobal('style', fileName =>
      `<link rel="stylesheet" href="${getAssetLink(`/css/${fileName}.css`)}" type="text/css">`)
    environment.addGlobal('script', fileName =>
      `<script defer src="${getAssetLink(`/js/${fileName}.js`)}" type="text/javascript"></script>`)

    // Link pages.
    environment.addGlobal('href', function (uri) {
      let url = config.environment.baseUrl

      if (language !== undefined && language !== config.app.defaultLanguage)
        url += ('/' + language)

      return (url + uri)
    })

    // Link for app
    environment.addGlobal('hrefApp', function (uri) {
      let url = config.environment.appUrl

      if (language !== undefined && language !== config.app.defaultLanguage)
        url += ('/' + language)

      return (url + uri)
    })

    // Filter for sorting a simple object by value.
    environment.addFilter('simpleObjectSort', function (object) {
      const sorted = sortProperties(object)
      const newObject = {}
      sorted.forEach(i => newObject[sorted[i][0].toString()] = sorted[i][1])
      return newObject
    })

    // Format date filter.
    environment.addFilter('formatDate', function (unixTime) {
      moment.locale(language)
      return moment(unixTime).format('dddd, DD MMMM')
    })

    // Add markdown support to Nunjucks.
    marked.setOptions(config.app.markdownOptions)
    nunjucksMarkdown.register(environment, marked)

    // Render Nunjucks to HTML.
    environment.render(templatePath, data, (err, res) => {
      if (err) cb(pluginError(err))

      file.contents = Buffer.from(res)
      cb(null, file)
    })
  })
}

function pluginError(message) {
  return new PluginError({
    plugin: 'templator',
    message: message
  })
}

// Gets JSON data from file path and assign to given data object
function getDataFromSource(filepath, returnedData, translate) {
  try {
    // Get data file context name.
    const context = gettextHelper.getContextName(filepath)

    // Translate translatable data strings.
    function propsWalker(item) {
      for (const prop in item) {
        if (item.hasOwnProperty(prop)) {
          if (item[prop] !== null && typeof item[prop] === 'object') {
            propsWalker(item[prop])
          } else {
            if (typeof item[prop] === 'string' && /^~i18n:\s.+/i.test(item[prop])) {
              // Remove the "~i18n:" flag and translate the string.
              item[prop] = translate.pgettext(context, item[prop].substring('~i18n:'.length).trim())
            }
          }
        }
      }
    }

    // Return translated data.
    const data = JSON.parse(stripJSONComments(fs.readFileSync(filepath).toString()))

    // Translate strings and merge them.
    propsWalker(data)
    returnedData = _.assign(returnedData, data)
  } catch (e) {
    log.error(`Data in ${filepath} is not valid JSON`)
  }

  return returnedData
}

module.exports = nunjucksTemplate
