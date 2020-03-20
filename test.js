const tmi = require('tmi.js');
const cooldown = require('cooldown');
const fs = require('fs');
let f = fs.readFileSync('./db/channels.txt').toString();
let names = f.split(" ");
names[1] = "newfroggy";

const channelsFile = './db/channels.txt';
const channelOptions = fs.readFileSync(channelsFile).toString().split('"').filter(
    function(i){return i != null;}).join('').split(' ')


const cd = new cooldown(1000);
const pyramidcd = new cooldown(15000)

const prefix = "!";

cd.on('ready', console.log.bind('console', 'off cooldown'));

const config = {
    options: {
        debug: false,
    },
    connection: {
        secure: true,
        reconnect: true,
    },
    identity: {
        username: `daumenbot`,
        password: `oauth:ql53i0xwhxdoalefhwr8tacdw0jntc`
    },
    channels: channelOptions
};

const client = new tmi.client(config)
client.connect();

client.on(`chat`, async (channel, user, message, self) => {
    if(self) return;
    if(user['user-id'] != '150819483'&&user['user-id'] != '124776535') {
        if(message.includes('PepeLaugh')&&cd.fire()) {
            client.say(names[1], `xQc's chat has spammed PepeLaugh`);
            console.count('PepeLaugh');
        }
        else if(message.includes('Pepega')&&cd.fire()) {
            client.say(names[1], `xQc's chat has spammed Pepega`);
            console.count('Pepega');
      }
    }
});