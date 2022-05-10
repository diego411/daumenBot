module.exports = {
    name: "alert",
    code: () => `pajaSubs 🚨 ALERT`,
    trigger: (msg) => {
        return msg.isAction &&
            msg.senderUsername == 'pajbot' &&
            msg.messageText.includes('pajaS 🚨 ALERT')
    },
}