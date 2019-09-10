const express = require('express')
const Api = require('./Controllers/Api')

const routes = new express.Router()

routes.get('/championship/:rodada?', Api.championship)
routes.get('/championship/time/:time', Api.championshipByTeam)

module.exports = routes
