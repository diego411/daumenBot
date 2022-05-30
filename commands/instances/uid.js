const twitchapi = require('../../controllers/twitch')

module.exports = {
    name: "uid",
    arg_flags: ["raw_args", "sender"],
    code: async ({ raw_args, senderUserID }) => {
        const given_user = raw_args[0]
        console.log(raw_args)
        const id = given_user ? await twitchapi.getUserId(given_user) : senderUserID
        return `${id ? id : `User does not exist or is banned`}`
    },
    cooldown: 5000
}