module.exports = {
    name: "say",
    arg_flags: ["raw_args", "sender"],
    code: ({ raw_args }) => {
        return raw_args.join(' ')
    },
    cooldown: 2000,
    adminRequired: true,
    tagUser: false,
    banphraseCheckRequired: true
}