const channelsFile = './db/channels.txt';
const blackList = './db/blacklist.txt';

const fs = require('fs');

const handle = (msg, client) => {
    //commands
    if (msg.displayName === 'daumenbot') return;

    let [command, ...args] = msg.messageText.slice(1).split(/ +/g);

    if (command === "join" && isAdmin(msg)) {
        fs.appendFileSync(channelsFile, " " + args[0]);
        client.join(args[0])
        client.say(msg.channelName, "joined " + args[0]);
    }
    if (command === "part" && isAdmin(msg)) {
        let name = args[0];
        let s = fs.readFileSync(channelsFile).toString();
        s = s.split(" ");
        for (let k = 0; k < s.length; k++) {
            if (s[k] === name) {
                s.splice(k);
            }
        }
        fs.writeFileSync(channelsFile, s.toString());
        client.part(name);
        client.say(msg.channelName, "left" + name);
    }
    if (command === 'quit' && isAdmin(msg)) {
        client.say(msg.channelName, 'quitting').then(() => {
            process.exit(1);
        })
    }
    if (command === "pyramid" && (msg.isMod) || (msg.isModRaw)) {
        if (weebDetected(msg)) client.say(msg.channelName, "No, I don't think so")
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
        console.log("test");
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
        let s = fs.readFileSync(channelsFile).toString();
        client.say(msg.channelName, s);
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

function weebDetected(msg) {
    let s = fs.readFileSync(blackList).toString();
    s = s.split(" ");

    for (let i = 0; i < s.length; i++) {
        if (msg.messageText.includes(s[i]) && s[i] != '') return true;
    }

    return false;
}

exports.handle = handle