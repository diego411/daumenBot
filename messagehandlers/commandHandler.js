const logger = require('../logger')

const weebHandler = require('./weebHandler')

const twitchapi = require('../twitchapi');

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
        if (args.length == 0) {
            client.say(msg.channelName, 'please specify a channel to join')
            return
        }
        let config = { channel: args[0] }
        for (let i = 1; i < args.length; i++) {
            [key, value] = args[i].split(":")
            if (value == 'true') config[key] = true
            else if (value == 'false') config[key] = false
            else config[key] = value
        }
        if (!config["spam"]) config["spam"] = "LOW"
        if (!config["talkInOnline"]) config["talkInOnline"] = false
        if (!config["weebFilter"]) config["weebFilter"] = "OFF"
        if (process.env.NODE_ENV !== "production") {
            db.get('debugchannels').then(channels => db.set('debugchannels', [...channels, config]))
        } else {
            db.get('channels').then(channels => db.set('channels', [...channels, config]))
        }
        client.join(config)
        client.say(msg.channelName, `joined ${args[0]}`);
        logger.log(`joined ${args[0]}`)
    }
    else if (command === "part" && isAdmin(msg)) {
        if (process.env.NODE_ENV !== "production") {
            db.get('debugchannels').then((channels) => {
                db.set('debugchannels', channels.filter(channel => channel.channel !== args[0]))
                client.part(args[0])
                client.say(msg.channelName, `left ${args[0]}`)
                logger.log(`left ${args[0]}`)
            })
        } else {
            db.get('channels').then((channels) => {
                db.set('channels', channels.filter(channel => channel.channel !== args[0]))
                client.part(args[0])
                client.say(msg.channelName, `left ${args[0]}`)
                logger.log(`left ${args[0]}`)
            })
        }
    }
    else if (command === 'quit' && isAdmin(msg)) {
        client.say(msg.channelName, 'quitting').then(() => {
            process.exit(1);
        })
    }
    else if (command === 'get' && isAdmin(msg)) {
        db.get(args[0]).then(console.log)
    }
    else if (command === 'check' && isAdmin(msg)) {
        db.get('forsenPuke').then(forsenPuke => client.say(msg.channelName, forsenPuke))
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
    else if (command === "sayEverywhere" && isAdmin(msg)) {
        if (process.env.NODE_ENV !== "production") {
            db.get('debugchannels').then(channels => client.sayEverywhere(channels, args[0]))
        } else {
            db.get('channels').then(channels => client.sayEverywhere(channels, args[0]))
        }
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
        let channelconfigs = process.env.NODE_ENV === "production" ? await db.get('channels') : await db.get('debugchannels')
        let channels = "";
        for (cc of channelconfigs) {
            console.log(cc)
            channels += `${cc.channel}, `
        }
        client.say(msg.channelName, channels)
    }
    else if (command === "uid") {
        const id = args[0] ? await twitchapi.getUserId(args[0]) : await twitchapi.getUserId(msg.senderUsername)
        client.say(msg.channelName, `@${msg.senderUsername} ${id}`)
    }
    else if (command === "isLive") {
        const isLive = await twitchapi.isLive(args[0])
        client.say(msg.channelName, isLive)
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
    return (msg.senderUserID === '150819483' || msg.senderUserID === '124776535' || msg.senderUserID === '275711366' || msg.senderUserID === '151035078');
}

const isCommand = (msg) => {
    if (msg.messageText.charAt(0) === PREFIX) return true;
    else return false;
}

exports.handle = handle
exports.isCommand = isCommand
exports.init = init
