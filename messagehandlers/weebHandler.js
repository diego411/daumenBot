const fs = require('fs');
const blackList = './db/blacklist.txt';

let weebC = 0;

const handle = (msg, client) => {
    if (msg.messageText.includes("daumenbot") || weebC % 15 === 0) {
        if (msg.senderUserID === '275711366' || msg.senderUserID === '150819483' || msg.senderUserID === '455288756') return;
        let rand = Math.floor(Math.random() * 3)
        if (rand == 0) client.say(msg.channelName, `${msg.senderUsername}, NaM stfu`);
        if (rand == 1) client.say(msg.channelName, `${msg.senderUsername}, NaM 🇻🇳 ⣰⠛⣦⠛⣿⠛⢸⠛⠛⣿⠀⣿⠀⠸⡇⣸⡄⡿⢸⠛⠛⣿⠛⠃⣿⠛⡆⣴⠛⣦⠀ ⠘⠷⣄⠀⣿⠀⢸⠶⠆⣿⠀⣿⠀⠀⣇⡇⣇⡇⢸⠶⠆⣿⠶⠆⣿⠾⡅⠙⠶⣄⠀ ⠻⣤⠟⠀⠿⠀⠸⠀⠀⠹⣤⠟⠀⠀⠹⠃⠻⠀⠸⠤⠤⠿⠤⠄⠿⠤⠇⠻⣤⠟ `)
        if (rand == 2) client.say(msg.channelName, `${msg.senderUsername}, NaM stfu weeb`);
    }
    weebC++;
}

const weebDetected = (msg) => {
    let s = fs.readFileSync(blackList).toString();
    s = s.split(" ");

    for (let i = 0; i < s.length; i++) {
        if (msg.messageText.includes(s[i]) && s[i] != '') return true;
    }

    return false;
}

exports.handle = handle
exports.weebDetected = weebDetected