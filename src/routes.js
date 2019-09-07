// const MainController = require('../Controllers/MainController')
const express = require('express')

const routes = new express.Router()

routes.get('/', (req, res) => res.send(console.log(global.db)))

module.exports = routes
