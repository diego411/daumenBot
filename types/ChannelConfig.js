const spam_cd = {
    VER_LOW: 10000,
    LOW: 5000,
    MID: 3000,
    HIGH: 2000,
    VERY_HIGH: 1000
}

const weeb_freq = {
    OFF: 0,
    VERY_HIGH: 10,
    HIGH: 25,
    LOW: 50,
    VERY_LOW: 100
}

module.exports = class ChannelConfig {

    constructor(channel_name, spam = "MID", talkInOnline = false, weebFilter = "OFF", events = "ALL") {
        this.channel_name = channel_name
        this.spam = spam_cd[spam.toUpperCase()] || spam_cd["LOW"]
        this.talkInOnline = talkInOnline
        this.weebFilter = weeb_freq[weebFilter.toUpperCase()] || weeb_freq["OFF"]
        this.events = events.toUpperCase() || "ALL"
    }

    static construct_from(params) {
        if (!params.channel_name) return null
        return new this(params.channel_name, params.spam, params.talkInOnline, params.weebFilter, params.events)
    }
}