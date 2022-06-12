const twitchapi = require('../../controllers/twitch')

module.exports = {
    name: "isbanphrased",
    arg_flags: ["raw_args", "sender_name"],
    code: async ({ raw_args }) => {
        if (raw_args.length == 0)
            return `Please specify a message for the banphrase check`

        const message = raw_args.join()
        return `That message is ${await twitchapi.isBannedPhrase(message) ? `` : `not`} banphrased`
    },
    cooldown: 10000
}