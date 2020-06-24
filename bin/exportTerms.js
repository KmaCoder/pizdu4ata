const config = require('./config')
const poeditorHelper = require('./poeditorHelper')

config.exportHooks.map(poeditorHelper.poeditorFetchHook)
