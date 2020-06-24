const fs = require('fs')
const readline = require('readline')

const rl = readline.createInterface({
  input: fs.createReadStream('locales/en.po'),
  crlfDelay: Infinity
})

class PoString {
  constructor(value) {
    this.lines = [value]
    this.finished = false
  }

  addLine(line) {
    this.lines.push(line)
  }

  getString() {
    return this.lines.reduce((a, b) => a + `\n${b}`) + '\n'
  }

  isEmpty() {
    return this.lines.length === 1 && this.lines[0].length <= 2
  }
}

let msg_id = null,
  msg_str = null,
  new_string = ""

rl.on('line', (line) => {
  // if line starts with msgid or msgstr -> save them
  if (line.startsWith("msgid")) {
    msg_id = new PoString(line.slice(line.indexOf("\"")))
    return
  }
  if (line.startsWith("msgstr")) {
    msg_str = new PoString(line.slice(line.indexOf("\"")))
    msg_id.finished = true
    return
  }

  // string is more than 1 line, append line to msgid or msgstr
  if (line.startsWith("\"")) {
    if (msg_id && !msg_id.finished)
      msg_id.addLine(line)
    else if (msg_str && !msg_str.finished)
      msg_str.addLine(line)
    else
      console.error(`Something bad happened, check the file at line '${line}'`)
    return
  }
  appendSavedStrings()

  // append blank line or line with comment
  new_string += line + '\n'
})

function appendSavedStrings() {
  if (msg_str && !msg_str.finished) {
    // msg_str not empty, override msg_id with msg_str
    if (!msg_str.isEmpty()) {
      new_string += "msgid " + msg_str.getString()
    } else {
      new_string += "msgid " + msg_id.getString()
    }
    new_string += "msgstr " + "\"\"\n"
    msg_id = null
    msg_str = null
  }
}

rl.on('close', function () {
  appendSavedStrings()
  fs.writeFile("locales/en.po", new_string, function (err) {
    if (err) return console.log(err)

    console.log("Msg strings successfully replaced!")
  })
})
