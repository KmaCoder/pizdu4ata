const config = require('./config')
const poeditorHelper = require('./poeditorHelper')

config.syncHooks.map(poeditorHelper.poeditorFetchHook)
