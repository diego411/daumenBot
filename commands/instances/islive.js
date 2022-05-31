const twitchapi = require('../../controllers/twitch')
const formatUser = require('../../utils/formatter').formatUser

module.exports = {
    name: "islive",
    arg_flags: ["raw_args", "sender_name"],
    code: async ({ raw_args, senderUsername }) => {
        const given_user = formatUser(raw_args[0])
        const channel_name = given_user ? given_user : senderUsername
        console.log(channel_name)
        const isLive = await twitchapi.isLive(channel_name)

        return `Channel is ${isLive ? `` : `not`} live`
    }
}
