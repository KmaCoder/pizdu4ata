const dotenv = require('dotenv')
const fs = require('fs')
const glob = require("glob")

let envConfig = {}
try {
  envConfig = dotenv.parse(fs.readFileSync('.env'))
} catch (e) {//.env file does not exist
}

const srcFolder = './app'
const publicFolder = './public'
const destFolder = './dist'
const destAssetsFolder = destFolder + '/assets'

const languages = [
  'en', 'de'
]

const environment = {
  env: envConfig['ENV'] || "prod",
  baseUrl: envConfig['BASE_URL'] || "",
  languages: envConfig.hasOwnProperty("LANGUAGES") ? envConfig.LANGUAGES.split(",") : []
}

const scripts = {
  src: srcFolder + '/scripts/main/**/*',
  srcWatch: srcFolder + '/scripts/**/*',
  dest: destAssetsFolder + '/js'
}

const styles = {
  srcBuild: srcFolder + '/styles/**/*.+(scss|sass)',
  srcWatch: srcFolder + '/styles/**/*.+(scss|sass)',
  dest: destAssetsFolder + '/css'
}

const njk = {
  allSrc: srcFolder + '/**/*.+(nj|njk|nunjucks)',
  pageSrc: srcFolder + '/pages/**/*.+(nj|njk|nunjucks)',
  templatesSrc: srcFolder + '/templates',
  dest: destFolder
}

const images = {
  src: srcFolder + '/images/**/*.+(png|jpg|jpeg|gif|svg)',
  dest: destAssetsFolder + '/images'
}

// json data to be inserted to nunjucks renderer
const dataFolder = srcFolder + "/njkData"
const data = {
  src: dataFolder,
  files: glob.sync(dataFolder + '/**/*.json')
}

const app = {
  globalData: [],
  languages: languages,
  defaultLanguage: 'en',
  markdownOptions: {
    smartypants: true,
    gfm: true
  },
  templatesPath: srcFolder + '/templates',
  pageSrc: srcFolder + '/pages/**/*.njk',
  pageDest: destFolder,
  watch: [
    srcFolder + '/templates/**/*',
    './data/**/*.json'
  ],
  destWatch: destFolder + '/**/*'
}

const browserSync = {
  host: 'localhost',
  port: envConfig['BROWSER_PORT'] || 3000
}

const gettext = {
  languages: languages,
  mainSourceFolder: './',
  sources: [srcFolder + '/templates', srcFolder + '/pages'],
  dataSources: [dataFolder]
}

module.exports = {
  srcFolder,
  publicFolder,
  destFolder,
  destAssetsFolder,
  environment,
  scripts,
  images,
  styles,
  njk,
  app,
  browserSync,
  data,
  gettext
}
