module.exports = {
    name: "TriHardTag",
    arg_flags: ["sender_name"],
    code: ({ senderUsername }) => `@${senderUsername} TriHard`,
    trigger: (msg) => msg.messageText.includes("daumenbot") && msg.messageText.includes("TriHard"),
}