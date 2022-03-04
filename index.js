//const http = require('http');
// http.createServer((_, res) => {
//   res.end("Alive!")
// }).listen(8080)
const express = require('express')
const app = express()
const port = 8080;

var readline = require('readline');

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

app.get('/', (req, res) => {
  res.end('Alive!')
})

app.post('/refresh', async (req, res) => {
  console.log("repl.deploy" + req.body + req.header("Signature"))

  const result = JSON.parse((await getStdinLine()))

  res.statusCode = result.statusCode
  res.end(result.body)

  console.log("repl.deploy-success")
})

app.listen(port, () => {

})

async function getStdinLine() {
  for await (const line of rl) {
    return line
  }
}


const cooldown = require('cooldown');
const fs = require('fs');
const { ChatClient } = require("dank-twitch-irc");
const PREFIX = '@'
let f = fs.readFileSync('./db/channels.txt').toString();
let names = f.split(" ");
names[1] = "ii_dee";
names[2] = "ninr"

var jam = ['lebronJAM aye', 'TriKool aye', 'TriKool🔥', '🔥THIS SOME🔥lebronJAM🔥ABSOLUTE FIRE🔥', 'lebronJAM 🔥', '🔥TriDance🔥', 'TriDance 🔥', 'TriDance', 'TriDance aye', 'TriKool'];
const channelsFile = './db/channels.txt';
const blackList = './db/blacklist.txt';
const channelOptions = fs.readFileSync(channelsFile).toString().split('"').filter(i => i != null).join('').split(' ')


const cd = new cooldown(2000);
const pyramidcd = new cooldown(15000);

let client = new ChatClient({

  username: `daumenbot`,
  password: `oauth:ql53i0xwhxdoalefhwr8tacdw0jntc`,

  maxChannelCountPerConnection: 10,

  connectionRateLimits: {
    parallelConnections: 20,
    releaseTime: 2000,
  },
});

client.connect();
client.joinAll(channelOptions)

let i = 0;
let weebC = 0;
let NaMloop = false;

client.on("ready", () => console.log('Online'));
client.on("close", (error) => {
  if (error != null) {
    console.error("Client closed due to error", error);
  }
});

client.on("PRIVMSG", (msg) => {
  if (weebDetected(msg)) weebC++;
  if ((msg.messageText.includes("daumenbot") && weebDetected(msg)) && cd.fire() || (weebDetected(msg) && weebC % 15 === 0)) {
    if (msg.senderUserID === '275711366' || msg.senderUserID === '150819483' || msg.senderUserID === '455288756') return;
    if (i % 2 === 0) client.say(msg.channelName, `${msg.senderUsername}, NaM stfu`);
    else if (i % 5 === 0) client.say(msg.channelName, `${msg.senderUsername}, NaM 🇻🇳 ⣰⠛⣦⠛⣿⠛⢸⠛⠛⣿⠀⣿⠀⠸⡇⣸⡄⡿⢸⠛⠛⣿⠛⠃⣿⠛⡆⣴⠛⣦⠀ ⠘⠷⣄⠀⣿⠀⢸⠶⠆⣿⠀⣿⠀⠀⣇⡇⣇⡇⢸⠶⠆⣿⠶⠆⣿⠾⡅⠙⠶⣄⠀ ⠻⣤⠟⠀⠿⠀⠸⠀⠀⠹⣤⠟⠀⠀⠹⠃⠻⠀⠸⠤⠤⠿⠤⠄⠿⠤⠇⠻⣤⠟ `)
    else client.say(msg.channelName, `${msg.senderUsername}, NaM stfu weeb`);
    i++;
  }
  else return;
});


client.on("PRIVMSG", (msg) => {

  let [command, ...args] = msg.messageText.slice(PREFIX.length).split(/ +/g);

  if (msg.senderUsername === 'daumenbot') return;
  if (msg.messageText == `widepeepoHappy` && cd.fire()) {
    if (i % 2 == 0) client.say(msg.channelName, `widepeepoHappy`)
    else client.say(msg.channelName, `widepeepoHappy` + " " + "⠀")
    i++;
  }
  if (msg.messageText == `TriDance` && cd.fire()) {
    if (i % 2 == 0) client.say(msg.channelName, `TriDance`)
    else client.say(msg.channelName, `TriDance ⠀`)
    i++;
  }
  if (msg.messageText === 'cringe' && cd.fire()) {
    if (i % 2 == 0) client.say(msg.channelName, `${msg.senderUsername} LUL BWAHAHAHAHHAHAHAHAHHAHAHA`)
    else client.say(msg.channelName, `${msg.senderUsername} LUL BWAHAHAHAHHAHAHAHAHHAHAHA⠀`)
    i++;
  }
  if (msg.messageText === ('PogU') && cd.fire()) {
    if (i % 2 == 0) client.say(msg.channelName, `${msg.senderUsername}, PagChomp Clap`)
    else client.say(msg.channelName, `${msg.senderUsername}, PagChomp Clap` + " " + "⠀")
    i++;
  }
  if (msg.messageText === 'play roblox' && cd.fire()) {
    if (i % 2 == 0) client.say(names[2], `FeelsWeirdManW 🤚 ${msg.senderUsername}`)
    else client.say(names[2], `FeelsWeirdManW 🤚 ${msg.senderUsername}⠀`)
    i++;
  }
  if (msg.messageText === 'TriHard' && cd.fire()) {
    if (i % 2 == 0) client.say(msg.channelName, `TriHard`)
    else client.say(msg.channelName, `TriHard 7`)
    i++;
  }
  if (msg.messageText.includes('lebronJAM') && cd.fire()) {
    const jammsg = jam[Math.floor(Math.random() * jam.length)];
    if (i % 2 == 0) client.say(msg.channelName, jammsg)
    else client.say(msg.channelName, jammsg + " ")
    i++;
  }
  if (msg.messageText.includes('$gn')) {
    if (msg.channelName === 'eiectricevil')
      // client.say(msg.channelName, 'Hope you have a good night ' + msg.senderUsername + ' Foreheadkiss ❤')
      client.say(msg.channelName, '$tuck ' + msg.senderUsername + ' Hope you have a good night Foreheadkiss ❤')
  }
  if (isAlertEvent(msg) && cd.fire()) {
    if (i % 2 == 0) client.me(msg.channelName, `pajaSubs 🚨 ALERT`)
    else client.me(msg.channelName, "pajaSubs 🚨 ALERT ⠀")
    i++;
  }
})

/*client.on("PRIVMSG", (msg) => {
    if(msg.displayName === 'daumenbot') return;
    if(msg.isMod){
       if (msg.messageText == `bro`) {
            fs.appendFileSync('./db/bro.txt','bro');
        }
    }
}); */

/*client.on(`chat`, async (channel, user, msg, self) => {
    if(msg.displayName === 'daumenbot') return;
    if(user['user-id'] != '150819483'&&user['user-id'] != '124776535') {
        if(msg.startsWith('!join'))
            console.log(user, msg);
        if(msg.messageText('lac')&&cd.fire()) {
            client.say(names[1], `FeelsWeirdMan`)
        if(msg.startsWith('*help')&&cd.fire()) {
            client.say(channel, "My commands are 'widepeepoHappy', 'TriHard', 'TriAlien', 'PogU', 'cringe'")
            }
        }
    }
}); */


//commands
client.on("PRIVMSG", async (msg) => {
  if (msg.displayName === 'daumenbot') return;
  if (isCommand(msg.messageText) && pyramidcd.fire()) {
    let tmp = msg.messageText.split(" ");
    if (tmp[0].slice(1, tmp[0].length) === "join" && isAdmin(msg)) {
      fs.appendFileSync(channelsFile, " " + tmp[1]);
      client.say(msg.channelName, "added " + tmp[1] + " to channel, restarting");
      cd.fire();
    }
    if (tmp[0].slice(1, tmp[0].length) === "part" && isAdmin(msg)) {
      let name = tmp[1];
      let s = fs.readFileSync(channelsFile).toString();
      s = s.split(" ");
      for (let k = 0; k < s.length; k++) {
        if (s[k] === name) {
          s.splice(k);
        }
      }
      fs.writeFileSync(channelsFile, s.toString());
    }
    if (msg === '!restart' && isAdmin(msg)) {
      client.say(msg.channelName, 'restarting').then(() => {
        process.exit(1);
      })
    }
    if (tmp[0].slice(1, tmp[0].length) === "pyramid" && (msg.isMod) || (msg.isModRaw)) {
      if (weebDetected(msg)) client.say(msg.channelName, "No, I don't think so")
      else {
        let emote = tmp[2];
        let n = tmp[1];
        let max = 50; let min = 3;
        if (n <= max && n >= min) {
          for (let k = 0; k <= n; k++) {
            client.privmsg(msg.channelName, stackEmote(k, emote));
          }
          for (let k = n - 1; k > 0; k--) {
            client.privmsg(msg.channelName, stackEmote(k, emote));
          }
        }
      }
    }
    if (tmp[0].slice(1, tmp[0].length) === "test") {
      console.log(msg)
      console.log("test");
    }

    if (tmp[0].slice(1, tmp[0].length) === "say" && isAdmin(msg)) {
      console.log("trihard");
      client.say(msg.channelName, `${args.join(' ')}`);
    };

    if (tmp[0].slice(1).toLowerCase() == 'startnamming' && !NaMloop) {
      NaMloop = true;
      loop();
    };
    if (tmp[0].slice(1).toLowerCase() == 'stopnamming' && NaMloop) {
      NaMloop = false;
    };

    if (tmp[0].slice(1, tmp[0].length) === "blacklist" && isAdmin(msg)) {
      client.say(msg.channelName, "added to blacklist");
      fs.appendFileSync(blackList, " " + tmp[1]);
    }
    if (tmp[0].slice(1, tmp[0].length) === "channellist") {
      let s = fs.readFileSync(channelsFile).toString();
      client.say(msg.channelName, s);
    }
  }
});

function isCommand(msg) {
  if (msg.charAt(0) === '+') return true;
  else return false;
}

function stackEmote(n, emote) {
  let s = "";
  for (let i = 0; i < n; i++) {
    s = s.concat(" " + emote);
  }
  return s;
}

function weebDetected(msg) {
  let s = fs.readFileSync(blackList).toString();
  s = s.split(" ");

  for (let i = 0; i < s.length; i++) {
    if (msg.messageText.includes(s[i]) && s[i] != '') return true;
  }

  return false;
}

function isAdmin(msg) {
  return (msg.senderUserID === '150819483' || msg.senderUserID === '124776535' || msg.senderUserID === '275711366');
}

function isAlertEvent(msg) {
  return msg.isAction &&
    msg.senderUsername == 'pajbot' &&
    msg.messageText.includes('pajaS 🚨 ALERT');
}
