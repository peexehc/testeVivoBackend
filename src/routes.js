const express = require('express')
const Api = require('./Controllers/Api')

const routes = new express.Router()

routes.get('/championship/:rodada?', Api.championship)
routes.get('/championship/time/:time', Api.championshipByTeam)
routes.get('/team/:time?', Api.team)
routes.get('/team/rodada/:rodada', Api.teamByRound)

module.exports = routes
