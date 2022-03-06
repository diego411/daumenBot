const logger = require('../logger')
const channelsFile = './db/channels.txt';
const blackList = './db/blacklist.txt';

const weebHandler = require('./weebHandler')

const fs = require('fs');

const PREFIX = '+'
let db;

const init = (database) => {
    db = database
}

const handle = (msg, client) => {
    //commands
    if (msg.displayName === 'daumenbot') return;

    let [command, ...args] = msg.messageText.slice(PREFIX.length).split(/ +/g);

    if (command === "join" && isAdmin(msg)) {
        db.get('channels').then((channels) => {
            db.set('channels', [...channels, args[0]])
            client.join(args[0])
            client.say(msg.channelName, `joined  + ${args[0]}`);
            logger.log(`joined ${args[0]}`)
        })
    }
    if (command === "part" && isAdmin(msg)) {
        db.get('channels').then((channels) => {
            db.set('channels', channels.filter(channel => channel !== args[0]))
            client.part(args[0])
            client.say(msg.channelName, `left ${args[0]}`)
            logger.log(`left ${args[0]}`)
        })
    }
    if (command === 'quit' && isAdmin(msg)) {
        client.say(msg.channelName, 'quitting').then(() => {
            process.exit(1);
        })
    }
    if (command === "pyramid" && (msg.isMod) || (msg.isModRaw)) {
        if (weebHandler.weebDetected(msg)) client.say(msg.channelName, "No, I don't think so")
        else {
            let emote = args[1];
            let n = args[0];
            let max = 50; let min = 3;
            if (n <= max && n >= min) {
                for (let k = 0; k <= n; k++) {
                    client.say(msg.channelName, stackEmote(k, emote));
                }
                for (let k = n - 1; k > 0; k--) {
                    client.say(msg.channelName, stackEmote(k, emote));
                }
            }
        }
    }
    if (command === "test") {
        logger.log("test");
        client.say(msg.channelName, "FeelsDankMan")
    }
    if (command === "say" && isAdmin(msg)) {
        console.log("trihard");
        client.say(msg.channelName, `${args.join(' ')}`);
    }
    if (command === "blacklist" && isAdmin(msg)) {
        client.say(msg.channelName, "added to blacklist");
        fs.appendFileSync(blackList, " " + args[0]);
    }
    if (command === "channellist") {
        db.get('channels').then((channels) => {
            client.say(msg.channelName, channels);
        })
    }
}

function stackEmote(n, emote) {
    let s = "";
    for (let i = 0; i < n; i++) {
        s = s.concat(" " + emote);
    }
    return s;
}

function isAdmin(msg) {
    return (msg.senderUserID === '150819483' || msg.senderUserID === '124776535' || msg.senderUserID === '275711366');
}

const isCommand = (msg) => {
    if (msg.messageText.charAt(0) === PREFIX) return true;
    else return false;
}

exports.handle = handle
exports.isCommand = isCommand
exports.init = init