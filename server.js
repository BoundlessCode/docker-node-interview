'use strict'

const fs = require('fs')
const path = require('path')
const express = require('express')

const PORT = 3000
const HOST = '0.0.0.0'

const logPath = path.join(__dirname, 'logs')
if(!fs.existsSync(logPath)) {
  fs.mkdirSync(logPath)
}
const outLog = fs.createWriteStream(path.join(logPath, 'out.log'), { flags: 'a' })
const errLog = fs.createWriteStream(path.join(logPath, 'err.log'), { flags: 'a' })

const app = express()
app.get('/', (req, res) => {
  info('GET / started')
  res.send('Hello World')
  info('GET / finished')
})

app.get('/err', (req, res) => {
  info('GET /err started')
  throw new Error('GET /err threw!')
})

app.use((err, req, res, next) => {
  error(err)
  next(err)
})

app.listen(PORT, HOST)
info(`Running on http://${HOST}:${PORT}`)

function composeLogMessage(message, type) {
  return `[${type}][${new Date().toISOString()}] ${message}\n`
}

function info(message) {
  const fullMessage = composeLogMessage(message, 'INFO')
  outLog.write(fullMessage)
  console.log(fullMessage)
}

function error(err) {
  const fullMessage = composeLogMessage(err.stack || err, 'ERROR')
  errLog.write(fullMessage)
  console.error(fullMessage)
}
