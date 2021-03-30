const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const http = require('http').createServer(app)
require('dotenv').config()

const corsOptions = {
  origin: 'http://localhost:8081'
}


//app.use(cors(corsOptions))
app.use(cors())



// parse requests of content-type - application/json
app.use(bodyParser.json())


// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

require('./app/routes/auth.routes')(app)
require('./app/routes/user.routes')(app)
require('./app/routes/formOfIssue.routes')(app)
require('./app/routes/countryOfManufacrute.routes')(app)
require('./app/routes/pharmacologicalGroup.routes')(app)
require('./app/routes/typeOfProperty.routes')(app)
require('./app/routes/pharmacyName.routes')(app)
require('./app/routes/area.routes')(app)
require('./app/routes/reasonForReturn.routes')(app)

PORT = 8080
http.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`)
})

module.exports = app