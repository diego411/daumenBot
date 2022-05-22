const express = require('express')
const app = express()
const database = require('../database')

const BASE_URL = "/api/v1/"

app.get(`${BASE_URL}channels`, async function (req, res) {
    res.send({
        status: 200,
        channels: await database.getChannelNames()
    })
})

app.listen(3000)