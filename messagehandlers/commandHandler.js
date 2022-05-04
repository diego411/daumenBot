const logger = require('../logger')

const twitchapi = require('../twitchapi');

const PREFIX = '+'
let db;

exports.init = (database) => {
    db = database
}

exports.handle = async (msg, client) => {
    if (msg.displayName === "daumenbot") return;

    let [command, ...args] = msg.messageText.slice(PREFIX.length).split(/ +/g);
    switch (command) {
        case "ping": {
            let dateNow = Date.now()
            await client.ping();
            let dateAfterPing = Date.now()
            client.say(msg.channelName, `@${msg.senderUsername} Ping to tmi is approx. ${dateAfterPing - dateNow} ms`)
            break
        }
        case "join": {
            if (!isAdmin(msg.senderUserID)) return
            if (args.length == 0) {
                client.say(msg.channelName, `@${msg.senderUsername} Please specify a channel to join`)
                return
            }
            const channel_name = args[0]
            if (!await twitchapi.getUserId(channel_name)) {
                client.say(msg.channelName, `@${msg.senderUsername} Given channel probably does not exist or is banned`)
                return
            }
            let default_config = {
                channel_name: channel_name,
                spam: "LOW",
                talkInOnline: false,
                weebFilter: "OFF"
            }
            for (let i = 1; i < args.length; i++) {
                try {
                    [key, value] = args[i].split(":")
                } catch (e) {
                    client.say(msg.channelName, `@${msg.senderUsername} Given parameters could not be parsed`)
                    return
                }
                if (value == 'true') default_config[key] = true
                else if (value == 'false') default_config[key] = false
                else default_config[key] = value
            }
            db.addConfig(default_config)
            client.join(default_config)
            client.say(msg.channelName, `joined ${channel_name}`);
            logger.log(`joined ${channel_name}`)
            break
        }
        case "part": {
            const channel_name = args[0]
            await db.removeConfig(channel_name)
            client.part(channel_name)
            client.say(msg.channelName, `left ${channel_name}`)
            logger.log(`left ${channel_name}`)
            break
        }
        case "quit": {
            client.say(msg.channelName, `quitting`).then(() => {
                process.exit(1);
            })
            break
        }
        case "get": {
            if (!args[0]) {
                client.say(msg.channelName, `No key specified`)
                return
            }
            db.get(args[0]).then(logger.log)
            break
        }
        case "test": {
            client.say(msg.channelName, "FeelsDankMan")
            break
        }
        case "say": {
            if (!isAdmin(msg.senderUserID)) return
            client.say(msg.channelName, `${args.join(' ')}`);
            logger.log(`said ${args.join(' ')} in ${msg.channelName}`)
            break
        }
        case "sayeverywhere": {
            if (!isAdmin(msg.senderUserID)) return
            client.sayEverywhere(await db.getChannelNames(), `${args.join(' ')}`);
            logger.log(`said ${args.join(' ')} in every channel`)
            break
        }
        case "channellist": {
            const channel_names = await db.getChannelNames()
            client.say(msg.channelName, `@${msg.senderUsername} channellist: ${JSON.stringify(channel_names)}`)
            break
        }
        case "uid": {
            const id = args[0] ? await twitchapi.getUserId(args[0]) : await twitchapi.getUserId(msg.senderUsername)
            client.say(msg.channelName, `@${msg.senderUsername} ${id ? id : "user does not exist or is banned"}`)
            break
        }
        case "islive": {
            const channel_name = args[0] ? args[0] : msg.channelName
            const isLive = await twitchapi.isLive(channel_name)
            client.say(msg.channelName, `@${msg.senderUsername} channel is ${isLive ? `` : `not`} live`)
            break
        }
        case "isbanphrased": {
            client.say(msg.channelName, `@${msg.senderUsername} That message is ${await twitchapi.isBannedPhrase(args[0]) ? `` : `not`} banphrased`)
        }
        default: return
    }
}

function isAdmin(id) {
    return (id === '150819483' || id === '124776535' || id === '275711366' || id === '151035078');
}

exports.isCommand = (msg) => {
    if (msg.messageText.charAt(0) === PREFIX) return true;
    else return false;
}