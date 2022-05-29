const wloggerController = require('../../controllers/wlogger')

module.exports = {
    name: "optout",
    arg_flags: ["raw_args", "sender_name"],
    code: async ({ raw_args, senderUsername }) => {
        if (raw_args.length == 0)
            return `Please specify which service to opt out from`

        service = raw_args[0]

        if (service.toUpperCase() == "LOGS") {
            const suceeded = await wloggerController.optOutUser(senderUsername)
            if (!suceeded) return `Failed to opt out please try again later :/`
        } else {
            return `The service you are trying to opt out from does not exist`
        }

        return `Sucessfully opted you out from service: ${service}`
    },
    cooldown: 5000
}