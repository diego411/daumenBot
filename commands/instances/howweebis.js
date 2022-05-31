const WLoggerController = require('../../controllers/wlogger')
const formatUser = require('../../utils/formatter').formatUser

module.exports = {
    name: "howweebis",
    arg_flags: ["raw_args", "sender_name"],
    code: async ({ raw_args, senderUsername }) => {
        let user_name

        if (!raw_args[0])
            user_name = senderUsername
        else user_name = formatUser(raw_args[0])

        if (!user_name) return `Invalid user provided`

        const stats = await WLoggerController.statsForUser(user_name)
        if (!stats) return `Encountered problem with wlogger api`

        if (stats.score == 0) return `That user has a clean record. No weeb lines logged NaM 👍`
        return `I have a total of ${stats.message_count} weeb lines logged for ${user_name} (Total score: ${stats.score}) NaM`
    },
    trigger: (command_name) => command_name === "howweebis" || command_name === "hwis",
    cooldown: 10000
}
