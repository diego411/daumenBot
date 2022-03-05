const express = require('express')
const app = express()
const readline = require('readline')
const port = 8080

app.use(express.text())

const config = () => {

    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    app.get('/', (req, res) => {
        res.end('Alive!')
    })

    app.post('/refresh', async (req, res) => {
        console.log("repl.deploy" + req.body + req.header("Signature"))

        const result = JSON.parse((await getStdinLine()))

        res.statusCode = await result.status
        res.end(await result.body)

        console.log("repl.deploy-success")
    })

    app.listen(port)

    async function getStdinLine() {
        for await (const line of rl) {
            return line
        }
    }

    console.log("replit config success")
}

exports.config = config