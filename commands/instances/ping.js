const client = require('../../client')

module.exports = {
    name: "ping",
    code: async () => {
        let dateNow = Date.now()
        await client.ping();
        let dateAfterPing = Date.now()
        return `Ping to tmi is approx. ${dateAfterPing - dateNow} ms`
    },
    cooldown: 10000,
}