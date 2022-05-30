module.exports = {
    name: "get",
    arg_flags: ["raw_args", "sender"],
    code: ({ raw_args }) => {
        if (raw_args.length == 0)
            return `No key specified`

        const key = raw_args[0]
        require('../../database').get(key).then(require('../../utils/logger').log)

        return `Logged value for key ${key} to console`
    },
    cooldown: 2000,
    adminRequired: true
}