const fetch = require('node-fetch')

function poeditorFetchHook(webhookKey) {
  fetch(`https://api.poeditor.com/webhooks/${webhookKey}`)
    .then(() => console.info(`${webhookKey} was exported to Github`))
    .catch(err => console.error(`Exporting was failed for ${webhookKey} language. Error:`, err))
}

module.exports = {poeditorFetchHook}
