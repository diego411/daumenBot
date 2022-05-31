const twitchapi = require('../../controllers/twitch')
const formatUser = require('../../utils/userFormatter')

module.exports = {
    name: "uid",
    arg_flags: ["raw_args", "sender"],
    code: async ({ raw_args, senderUserID }) => {
        const given_user = formatUser(raw_args[0])
        let id;
        if (!raw_args[0]) {
            id = senderUserID;
            return id.toString()
        }
        else if (given_user) {
            console.log(raw_args)
            id = await twitchapi.getUserId(given_user)
            return `${id ? id : `User does not exist or is banned`}`
        }
        else {
            return `invalid user provided`
        }
    },
    cooldown: 5000
}
