const client = require('../../client')
const db = require('../../database')

module.exports = {
    name: "join",
    arg_flags: ["raw_args", "sender"],
    code: async ({ raw_args }) => {
        if (raw_args.length == 0)
            return `Please specify a channel to join`
        channel_name = raw_args[0]

        if (!await require('../../twitchapi').getUserId(channel_name))
            return `Given channel probably does not exist or is banned`

        const config = require('../../ChannelConfig').construct_from(raw_args)
        if (!config) return `Could not parse given arguments`
        await client.join(config.channel_name)

        db.addConfig(config)

        return `Joined ${channel_name}`
    },
    cooldown: 2000,
    adminRequired: true
}