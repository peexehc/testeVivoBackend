const express = require('express')
const Api = require('./Controllers/Api')

const routes = new express.Router()

routes.get('/championship', Api.championship)

module.exports = routes
