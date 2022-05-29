const db = require('../../database')
const wedController = require('../../controllers/wed')

module.exports = {
    name: "whitelist",
    arg_flags: ["raw_args", "sender"],
    code: async ({ raw_args }) => {
        if (raw_args.length == 0)
            return `No term specified`

        const term = raw_args[0]

        await db.addWhitelistTerm(term)
        await wedController.addWhitelistTerm(term)

        return `Whitelisted term: ${term}`
    },
    cooldown: 2000,
    adminRequired: true,
    banphraseCheckRequired: true
}