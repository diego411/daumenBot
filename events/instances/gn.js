module.exports = {
    name: "gn",
    arg_flags: ["sender_name"],
    code: ({ senderUsername }) => `$tuck ${senderUsername} Hope you have a good night Foreheadkiss ❤`,
    trigger: (msg) => msg.channelName === 'eiectricevil' && /^\$gn(?:\s|$)/i.test(msg.messageText)
}
