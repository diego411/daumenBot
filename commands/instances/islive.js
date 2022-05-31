const twitchapi = require('../../controllers/twitch')
const formatUser = require('../../utils/formatter').formatUser

module.exports = {
    name: "islive",
    arg_flags: ["raw_args", "sender_name"],
    code: async ({ raw_args, senderUsername }) => {
        let channel_name

        if (!raw_args[0])
            channel_name = senderUsername
        else channel_name = formatUser(raw_args[0])

        if (!channel_name)
            return `Invalid channel provided`

        const isLive = await twitchapi.isLive(channel_name)

        return `Channel is ${isLive ? `` : `not`} live`
    }
}
