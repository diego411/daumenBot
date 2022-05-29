const express = require('express')
const app = express()
const database = require('../database')

const BASE_URL = "/api/v1/"

app.get(`${BASE_URL}config`, async function (req, res) {
    res.send({
        status: 200,
        channels: await database.getChannelNames(),
        whitelist: await database.getWhitelist()
    })
})

app.listen(3000)