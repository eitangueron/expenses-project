const express = require('express')
const app = express()
const api = require('./server/routes/api')
const bodyParser = require('body-parser')
//path

const mongoose = require('mongoose')
mongoose.connect("mongodb://localhost/expenses")


app.use(bodyParser.urlencoded({ extended : false}))
app.use(bodyParser.json())

app.use('/',api)




const port = 3000
app.listen(port,function(){
    console.log('Server is running on port 3000')
})