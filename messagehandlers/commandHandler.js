const logger = require('../logger')

const weebHandler = require('./weebHandler')

const PREFIX = '+'
let db;

const init = (database) => {
    db = database
}

const handle = async (msg, client) => {
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
    else if (command === "part" && isAdmin(msg)) {
        db.get('channels').then((channels) => {
            db.set('channels', channels.filter(channel => channel !== args[0]))
            client.part(args[0])
            client.say(msg.channelName, `left ${args[0]}`)
            logger.log(`left ${args[0]}`)
        })
    }
    else if (command === 'quit' && isAdmin(msg)) {
        client.say(msg.channelName, 'quitting').then(() => {
            process.exit(1);
        })
    }
    else if (command === 'get'&&isAdmin(msg)) {
        db.get(args[0]).then(console.log) 
    }
    else if (command === "pyramid" && ((msg.isMod) || (msg.isModRaw))) {
        if (await weebHandler.weebDetected(msg)) client.say(msg.channelName, "No, I don't think so")
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
    else if (command === "test") {
        logger.log("test");
        client.say(msg.channelName, "FeelsDankMan")
    }
    else if (command === "say" && isAdmin(msg)) {
        console.log("trihard");
        client.say(msg.channelName, `${args.join(' ')}`);
    }
    else if (command === "blacklist" && isAdmin(msg)) {
        let weebMap = await db.get('weebMap')
        let firstChar = args[0].charAt(0).toLowerCase()
        if (weebMap[firstChar] != null) {
            weebMap[firstChar].push(args[0])
            await db.set('weebMap', weebMap)
            client.say(msg.channelName, `added ${args[0]} to blacklist`);
            logger.log(`added ${args[0]} to blacklist`)
        } else {
            client.say(msg.channelName, `cant add ${args[0]} to blacklist (prob not an emote)`)
        }
    }
    else if (command === "removeblacklist" && isAdmin(msg)) {
        let weebMap = await db.get('weebMap')
        let firstChar = args[0].charAt(0)
        if (weebMap[firstChar]) weebMap[firstChar] = weebMap[firstChar].filter(term => term !== args[0])
        await db.set('weebMap', weebMap)
        client.say(msg.channelName, `removed ${args[0]} from blacklist`);
        logger.log(`remove ${args[0]} from blacklist`)
    }
    else if (command === "query" && isAdmin(msg)) {
        if (args[0] === "weebMap") {
            let weebMap = await db.get('weebMap')
            let firstChar = args[1].charAt(0)
            if (weebMap[firstChar]) client.say(msg.channelName, `weeb terms with ${firstChar}: ${weebMap[firstChar]}`)
            else client.say(msg.channelName, `no terms for that letter`)
        }
    }
    else if (command === "channellist") {
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