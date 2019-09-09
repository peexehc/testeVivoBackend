const express = require('express')
const Api = require('./Controllers/Api')

const routes = new express.Router()

routes.get('/championship/todos-jogos', Api.championship)
routes.get('/championship/rodada/:rodada', Api.championship)

module.exports = routes
