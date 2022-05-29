module.exports = {
    name: "sayeverywhere",
    arg_flags: ["raw_args", "sender"],
    code: ({ raw_args }) => {
        return raw_args.join(' ')
    },
    cooldown: 2000,
    response_callback: require('../../client').RESPONSE_TYPE.SAY_EVERYWHERE,
    channels: (msg) => require('../../database').getChannelNames(),
    adminRequired: true,
    tagUser: false,
    banphraseCheckRequired: true
}