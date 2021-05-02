const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const http = require('http').createServer(app)
require('dotenv').config()

app.use(cors())

app.use(bodyParser.json())

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
require('./app/routes/manufacturerFirm.routes')(app)
require('./app/routes/pharmacy.routes')(app)
require('./app/routes/employee.routes')(app)
require('./app/routes/medicine.routes')(app)
require('./app/routes/deliveries.routes')(app)
require('./app/routes/requests.routes')(app)
require('./app/routes/summaryQueries.routes')(app)

PORT = 8080
http.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`)
})

module.exports = app