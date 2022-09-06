const express = require('express')
const Db = require('./DB/Db')
const app = express()
const port = 3001
const register = require('./Route/UserLogin')
const passwordchange = require('./Route/passwordchange')
const AccountDelete = require('./Route/AccountDelete')
const Influncer = require('./Route/Influncer')
const Brand = require('./Route/Brand')
const Conversation = require('./Route/Conversation')
const Converationmessage = require('./Route/Converationmessage')
const Loginwithgoogle = require('./Route/loginwithgoogle')
const Gigscreate = require('./Route/gigscreate')


app.use('/uploads', express.static('uploads'));
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
var cors = require('cors')
app.use(bodyParser.json())
// app.use(bodyParser.json())
app.use(cors())

app.use('/api', register)
app.use('/api', passwordchange)
app.use('/api', AccountDelete)
app.use('/api', Influncer)
app.use('/api', Brand)
app.use('/api', Conversation)
app.use('/api', Converationmessage)
app.use('/api', Loginwithgoogle)
app.use('/api', Gigscreate)





app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
  Db
})