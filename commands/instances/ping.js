const client = require('../../client')
const db = require('../../database')
const timeUtil = require('../../utils/time')
const os = require('os')

module.exports = {
    name: "ping",
    code: async () => {
        let dateNow = Date.now()
        await client.ping();
        let dateAfterPing = Date.now()

        const uptime = timeUtil.relativeTime(await db.get("start_time"))
        const byteToMB = 0.000001

        const freeMemory = Math.round(os.freemem() * byteToMB, 0)
        const totalMemory = Math.round(os.totalmem * byteToMB)

        return `Pong! Uptime: ${uptime}. Free Memory: ${freeMemory}MB / ${totalMemory}MB. Ping to TMI approx: ${dateAfterPing - dateNow} ms`
    },
    cooldown: 15000,
    tagUser: false
}