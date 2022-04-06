const logger = require('../logger')
const cooldown = require('cooldown');
const weebcd = new cooldown(1000000)
let db;

let weebC = 0;
let latestWeebTerm;

const init = (database) => {
    db = database
}

const weebCDMap = {
    "ON": 15,
    "LOW": 25,
    "VERY LOW": 50,
    "ULTRA LOW": 100,
    "FORSEN": 800
}

const handle = async (msg, client) => {
    if (msg.displayName === 'daumenbot') return;

    const channelConfigs = db.getChannelConfigs()
    let channelConfig;
    for (cc of channelConfigs) {
        if (cc.channel === msg.channelName) channelConfig = cc
    }
    if (!channelConfig) return
    updateUserWeebStats(msg)
    if (channelConfig.weebFilter === "OFF") return
    if (msg.messageText.includes("daumenbot") || weebC % weebCDMap[channelConfig.weebFilter] === 0) {
        if (msg.senderUserID === '275711366' || msg.senderUserID === '455288756') return;
        let rand = Math.floor(Math.random() * 3)
        if (rand == 0) client.say(msg.channelName, `${msg.senderUsername}, NaM stfu`);
        if (rand == 1) client.say(msg.channelName, `${msg.senderUsername}, NaM 🇻🇳 ⣰⠛⣦⠛⣿⠛⢸⠛⠛⣿⠀⣿⠀⠸⡇⣸⡄⡿⢸⠛⠛⣿⠛⠃⣿⠛⡆⣴⠛⣦⠀ ⠘⠷⣄⠀⣿⠀⢸⠶⠆⣿⠀⣿⠀⠀⣇⡇⣇⡇⢸⠶⠆⣿⠶⠆⣿⠾⡅⠙⠶⣄⠀ ⠻⣤⠟⠀⠿⠀⠸⠀⠀⠹⣤⠟⠀⠀⠹⠃⠻⠀⠸⠤⠤⠿⠤⠄⠿⠤⠇⠻⣤⠟ `)
        if (rand == 2) client.say(msg.channelName, `${msg.senderUsername}, NaM stfu weeb`);
        logger.log(`NaMed ${msg.senderUsername} for weeb term: ${latestWeebTerm} in ${msg.channelName}`)
    }
    weebC++;

}

const updateUserWeebStats = (msg) => {
    db.addWeebLog(msg.senderUserID, msg.senderUsername, msg.messageText)
}

const weebDetected = async (msg) => {
    let weebMap = await db.getWeebMap()
    let words = msg.messageText.split(" ")
    for (let i = 0; i < words.length; i++) {
        let firstChar = words[i].charAt(0).toLowerCase()
        if (weebMap[firstChar]) {
            for (let j = 0; j < weebMap[firstChar].length; j++) {
                let weebTerm = weebMap[firstChar][j]
                if (words[i].includes(weebTerm)) {
                    latestWeebTerm = weebTerm
                    return true;
                }
            }
        }
    }
}

exports.handle = handle
exports.weebDetected = weebDetected
exports.init = init
