const client = require('../../client')
const db = require('../../database')
const twitchController = require('../../controllers/twitch')
const wloggerController = require('../../controllers/wlogger')
const wedController = require('../../controllers/wed')
const formatUser = require('../../utils/formatter').formatUser

module.exports = {
    name: "join",
    arg_flags: ["raw_args", "sender"],
    code: async ({ raw_args }) => {
        if (raw_args.length == 0)
            return `Please specify a channel to join`
        channel_name = formatUser(raw_args[0])

        if (!await twitchController.getUserId(channel_name))
            return `Given channel probably does not exist or is banned`

        let config = { channel_name: channel_name.toString() }

        try {
            for (let i = 0; i < raw_args.length; i++) {
                let [key, value] = raw_args[i].split(":")
                if (value == 'true') config[key] = true
                else if (value == 'false') config[key] = false
                else config[key] = value
            }
        } catch (e) {
            return `Could not parse given arguments`
        }

        await client.join(config.channel_name)
        db.addConfig(config)
        wloggerController.joinChannel(config.channel_name)
        wedController.joinChannel(config.channel_name)

        return `Joined ${channel_name}`
    },
    cooldown: 2000,
    adminRequired: true
}
