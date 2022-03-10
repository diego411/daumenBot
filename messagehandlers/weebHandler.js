const logger = require('../logger')
const cooldown = require('cooldown');
const weebcd = new cooldown(1000000)
let db;

let puke = 0;
let weebC = 0;
let latestWeebTerm;

const init = (database) => {
    db = database
}

const handle = (msg, client) => {
    if (msg.displayName === 'daumenbot') return;
    if (msg.channelName != 'forsen') {
        if (msg.messageText.includes("daumenbot") || weebC % 25 === 0) {
            if (msg.senderUserID === '275711366' || msg.senderUserID === '455288756') return;
            let rand = Math.floor(Math.random() * 3)
            if (rand == 0) client.say(msg.channelName, `${msg.senderUsername}, NaM stfu`);
            if (rand == 1) client.say(msg.channelName, `${msg.senderUsername}, NaM 🇻🇳 ⣰⠛⣦⠛⣿⠛⢸⠛⠛⣿⠀⣿⠀⠸⡇⣸⡄⡿⢸⠛⠛⣿⠛⠃⣿⠛⡆⣴⠛⣦⠀ ⠘⠷⣄⠀⣿⠀⢸⠶⠆⣿⠀⣿⠀⠀⣇⡇⣇⡇⢸⠶⠆⣿⠶⠆⣿⠾⡅⠙⠶⣄⠀ ⠻⣤⠟⠀⠿⠀⠸⠀⠀⠹⣤⠟⠀⠀⠹⠃⠻⠀⠸⠤⠤⠿⠤⠄⠿⠤⠇⠻⣤⠟ `)
            if (rand == 2) client.say(msg.channelName, `${msg.senderUsername}, NaM stfu weeb`);
            logger.log(`NaMed ${msg.senderUsername} for weeb term: ${latestWeebTerm} in ${msg.channelName}`)
        }
        weebC++;
    } else {
        if (puke % 1000 === 0 && weebcd.fire()) {
            let rand = Math.floor(Math.random() * 3)
            if (rand == 0) client.say(msg.channelName, `${msg.senderUsername}, NaM stfu`);
            if (rand == 1) client.say(msg.channelName, `${msg.senderUsername}, NaM 🇻🇳 ⣰⠛⣦⠛⣿⠛⢸⠛⠛⣿⠀⣿⠀⠸⡇⣸⡄⡿⢸⠛⠛⣿⠛⠃⣿⠛⡆⣴⠛⣦⠀ ⠘⠷⣄⠀⣿⠀⢸⠶⠆⣿⠀⣿⠀⠀⣇⡇⣇⡇⢸⠶⠆⣿⠶⠆⣿⠾⡅⠙⠶⣄⠀ ⠻⣤⠟⠀⠿⠀⠸⠀⠀⠹⣤⠟⠀⠀⠹⠃⠻⠀⠸⠤⠤⠿⠤⠄⠿⠤⠇⠻⣤⠟ `)
            if (rand == 2) client.say(msg.channelName, `${msg.senderUsername}, NaM stfu weeb`);
            logger.log(`NaMed ${msg.senderUsername} for weeb term: ${latestWeebTerm} in ${msg.channelName}`)
        }
        //db.get('forsenPuke').then(puke => db.set('forsenPuke', puke + 1))
        puke++;
    }
}

const weebDetected = async (msg) => {
    let weebMap = await db.get('weebMap');
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