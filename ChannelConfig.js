const spam_cd = {
    LOW: 10000,
    MID: 5000,
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

    constructor(channel_name, spam = "LOW", talkInOnline = false, weebFilter = "OFF") {
        this.channel_name = channel_name
        this.spam = spam_cd[spam.toUpperCase()]
        this.talkInOnline = talkInOnline
        this.weebFilter = weeb_freq[weebFilter.toUpperCase()]
    }

    static construct_from(params) {
        if (params.channel_name)
            return new this(params.channel_name, params.spam, params.talkInOnline, params.weebFilter)

        try {
            let config = { channel_name: params[0] }
            for (let i = 0; i < params.length; i++) {
                let [key, value] = params[i].split(":")
                if (value == 'true') config[key] = true
                else if (value == 'false') config[key] = false
                else config[key] = value
            }
            return this.construct_from(config)
        } catch (e) {
            console.log(e)
            return null
        }
    }
}