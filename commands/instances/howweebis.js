const WLoggerController = require('../../controllers/wlogger')

module.exports = {
    name: "howweebis",
    arg_flags: ["raw_args", "sender_name"],
    code: async ({ raw_args, senderUsername }) => {
        const user_name = raw_args[0] || senderUsername

        const stats = await WLoggerController.statsForUser(user_name)
        if (!stats) return `Encountered problem with wlogger api`

        if (stats.score == 0) return `That user has a clean record. No weeb lines logged NaM 👍`
        return `I have a total of ${stats.message_count} weeb lines logged for ${user_name} (Total score: ${stats.score}) NaM`
    },
    trigger: (command_name) => command_name === "howweebis" || command_name === "hwis",
    cooldown: 2000
}