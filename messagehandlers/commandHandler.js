const logger = require('../logger')

const twitchapi = require('../twitchapi');

const PREFIX = '+'
let db;

exports.init = (database) => {
    db = database
}

exports.handle = async (msg, client) => {
    //commands
    if (msg.displayName === 'daumenbot') return;

    let [command, ...args] = msg.messageText.slice(PREFIX.length).split(/ +/g);
    if (command === "ping") {
        let dateNow = Date.now()
        await client.ping();
        let dateAfterPing = Date.now()
        client.say(msg.channelName, "Ping to tmi is approx. " + (dateAfterPing - dateNow) + "ms")
    }
    if (command === "howweebis" || command === "hwis") {
        client.say(msg.channelName, `under development`)
    }
    if (command == "randomweebline" || command === "rwl") {
        client.say(msg.channelName, `under development`)
    }
    else if (command === "join" && isAdmin(msg)) {
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
        db.addConfig(config)
        client.join(config)
        client.say(msg.channelName, `joined ${args[0]}`);
        logger.log(`joined ${args[0]}`)
    }
    else if (command === "part" && isAdmin(msg)) {
        db.removeConfig(args[0])
        client.part(args[0])
        client.say(msg.channelName, `left ${args[0]}`)
        logger.log(`left ${args[0]}`)
    }
    else if (command === 'quit' && isAdmin(msg)) {
        client.say(msg.channelName, 'quitting').then(() => {
            process.exit(1);
        })
    }
    else if (command === 'get' && isAdmin(msg)) {
        db.get(args[0]).then(console.log)
    }
    else if (command === "test") {
        client.say(msg.channelName, "FeelsDankMan")
        logger.log("test");
    }
    else if (command === "say" && isAdmin(msg)) {
        client.say(msg.channelName, `${args.join(' ')}`);
        logger.log(`said ${args.join(' ')} in ${msg.channelName}`)
    }
    else if (command === "sayEverywhere" && isAdmin(msg)) {
        client.sayEverywhere(db.getChannelNames(), args[0])
        logger.log(`said ${args[0]} in every channel`)
    }
    else if (command === "blacklist" && isAdmin(msg)) {
        db.addWeebTerm(args[0])
        client.say(msg.channelName, `added ${args[0]} to blacklist`);
        logger.log(`added ${args[0]} to blacklist`)
    }
    else if (command === "removeblacklist" && isAdmin(msg)) {
        await db.removeWeebTerm(args[0])
        client.say(msg.channelName, `removed ${args[0]} from blacklist`);
        logger.log(`remove ${args[0]} from blacklist`)
    }
    else if (command === "query" && isAdmin(msg)) {
        if (args[0] === "weebMap") {
            const weebTerms = await db.getWeebTermFor(args[1].charAt(0))
            client.say(msg.channelName, `weeb terms with ${args[1].charAt(0)}: ${weebTerms}`)
        }
    }
    else if (command === "channellist") {
        const channelconfigs = db.getChannelConfigs()
        let channels = "";
        for (cc of channelconfigs) {
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
    else if (command == "isbanphrased") {
        client.say(msg.channelName, await twitchapi.isBannedPhrase(args[0]))
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

exports.isCommand = (msg) => {
    if (msg.messageText.charAt(0) === PREFIX) return true;
    else return false;
}
