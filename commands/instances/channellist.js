module.exports = {
    name: "channellist",
    code: async () => {
        const channel_names = await require('../../database').getChannelNames()
        return `channellist: ${JSON.stringify(channel_names)}`
    },
    cooldown: 20000
}