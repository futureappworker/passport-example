const express = require('express')
const app = express()
const serveStatic = require('serve-static')
const dotenv = require('dotenv')

const authRouter = require('./routes/auth')

dotenv.config()

require('./strategies/googleStrategy')

const port = 3000

app.use(serveStatic('public', { index: ['index.html'] }))

app.use('/auth', authRouter)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
