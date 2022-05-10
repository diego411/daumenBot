const db = require('../../database')
const client = require('../../client')

module.exports = {
    name: "part",
    arg_flags: ["raw_args", "sender"],
    code: async ({ raw_args }) => {
        if (raw_args.lenght == 0)
            return `Please specify a channel to part from`

        channel_name = raw_args[0]
        await client.part(channel_name)
        await db.removeConfig(channel_name)

        return `Left ${channel_name}`
    },
    cooldown: 2000,
    adminRequired: true
}