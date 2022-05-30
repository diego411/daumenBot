const twitchapi = require('../../controllers/twitch')
const formatUser = require('../../utils/userFormatter')

module.exports = {
    name: "uid",
    arg_flags: ["raw_args", "sender"],
    code: async ({ raw_args, senderUserID }) => {
        const given_user = formatUser(raw_args[0])
        if (given_user) {
            console.log(raw_args)
            const id = given_user ? await twitchapi.getUserId(given_user) : senderUserID
            return `${id ? id : `User does not exist or is banned`}`
        }
        else {
            return `invalid user provided`
        }
    },
    cooldown: 5000
}
