const twitchapi = require('../../controllers/twitch')
const formatUser = require('../../utils/formatter').formatUser

module.exports = {
    name: "uid",
    arg_flags: ["raw_args", "sender"],
    code: async ({ raw_args, senderUserID }) => {
        if (!raw_args[0])
            return senderUserID

        const given_user = formatUser(raw_args[0])
        if (!given_user) return `Invalid user provided`

        id = await twitchapi.getUserId(given_user)
        return `${id ? id : `User does not exist or is banned`}`
    },
    cooldown: 5000
}
