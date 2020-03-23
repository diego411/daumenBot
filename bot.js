const tmi = require('tmi.js');
const cooldown = require('cooldown');
const fs = require('fs');
let f = fs.readFileSync('./db/channels.txt').toString();
let names = f.split(" ");
names[1] = "ii_dee";
names[2] = "ninr"

const channelsFile = './db/channels.txt';
const blackList = './db/blacklist.txt';
const channelOptions = fs.readFileSync(channelsFile).toString().split('"').filter(
    function(i){return i != null;}).join('').split(' ')


const cd = new cooldown(2000);
const pyramidcd = new cooldown(15000);

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

let i=0;

client.on(`chat`, (channel, tags, message, self)=>{
    if(self) return;
    if(weebDetected(message)&&cd.fire()){
        if(i%2===0)client.say(channel,`${tags.username}, NaM stfu`);
        else client.say(channel,`${tags.username}, NaM stfu weeb`);
        i++;
    }
    else return;
});

client.on(`chat`, (channel, tags, message, self) => {
    if (self) return;
    if (message == `widepeepoHappy`&&cd.fire()) {
        if(i%2==0)client.say(channel, `widepeepoHappy`)
        else client.say(channel, `widepeepoHappy` + " " + "⠀")
        i++;
    }
    if (message == `TriDance`&&cd.fire()) {
        if(i%2==0)client.say(channel, `TriDance`)
        else client.say(channel, `TriDance⠀`)
        i++;
    }
    if(message === 'cringe'&&cd.fire()) {
        if(i%2==0)client.say(channel, `${tags.username} LUL BWAHAHAHAHHAHAHAHAHHAHAHA`)
        else client.say(channel, `${tags.username} LUL BWAHAHAHAHHAHAHAHAHHAHAHA⠀`)
        i++;
    }
    if(message.includes('PogU')&&cd.fire()) {
        if(i%2==0)client.say(channel, `${tags.username}, PagChomp Clap`)
        else client.say(channel, `${tags.username}, PagChomp Clap` + " " + "⠀")
        i++;
    }
    if(message === 'play roblox'&&cd.fire()) {
        if(i%2==0)client.say(names[2], `FeelsWeirdManW 🤚 ${tags.username}`)
        else client.say(names[2], `FeelsWeirdManW 🤚 ${tags.username}⠀`)
        i++;
    }
    if(message === 'TriHard'&&cd.fire()) {
        if(i%2==0)client.say(channel, `TriHard`)
        else client.say(channel, `TriHard 7`)
        i++;
    }
})

client.on('chat', (channel, user, message, self) => {
    if(self) return;
    if(user['user-id'] === "151035078"){
        if(message.includes('bro')) {
            fs.appendFileSync('./db/bro.txt', user.name+' bro');
        }
    }
});

/*client.on(`chat`, async (channel, user, message, self) => {
    if(self) return;
    if(user['user-id'] != '150819483'&&user['user-id'] != '124776535') {
        if(message.startsWith('!join'))
            console.log(user, message);
        if(message.includes('lac')&&cd.fire()) {
            client.say(names[1], `FeelsWeirdMan`)
        if(message.startsWith('*help')&&cd.fire()) {
            client.say(channel, "My commands are 'widepeepoHappy', 'TriHard', 'TriAlien', 'PogU', 'cringe'")
            }
        }
    }
}); */


//commands
client.on(`chat`, async (channel, tags, message, self) => {   
    if(self) return;
    if(isCommand(message)&&pyramidcd.fire()) {
        let tmp = message.split(" ");
        if(tmp[0].slice(1,tmp[0].length)==="join"){
            fs.appendFileSync(channelsFile, " "+tmp[1]);  
            client.say(channel,"added " +tmp[1]+" to channel, restarting");
            cd.fire();
            process.exit(1);
        }
        if(tmp[0].slice(1,tmp[0].length)==="part"){
            let name = tmp[1];
            let s = fs.readFileSync(channelsFile).toString();
            s = s.split(" ");
            for(let k=0;k<s.length;k++){
                if(s[k]===name){
                    s.splice(k);
                }
            }
            fs.writeFileSync(channelsFile,s.toString());
            cd.fire();
            process.exit(1);
        }
        if (message === '!restart') {
            if(user['user-id'] != '150819483'&&user['user-id'] != '124776535') return;
            client.say(channel, 'restarting').then(() => {
            process.exit(1);
            })
        }
        if(tmp[0].slice(1,tmp[0].length)==="pyramid"&&(client.userstate[channel].mod)){
            if(weebDetected(message)) client.say(channel,"NaM stfu");
            else if(message.includes('WebPepeSmash')){
                let emote = 'peepoWeebSmash'
                let n = tmp[2];
                let max = 15; let min = 3;
                if(n<=max&&n>=min){
                    for(let k=0;k<=n;k++){
                        client.say(channel, stackEmote(k,emote));
                    }
                    for(let k=n-1;k>0;k--){
                        client.say(channel,stackEmote(k,emote));
                    }
                }
            }
            else {
                let emote = tmp[1];
                let n = tmp[2];
                let max = 15; let min = 3;
                if(n<=max&&n>=min){
                    for(let k=0;k<=n;k++){
                        client.say(channel, stackEmote(k,emote));
                    }
                    for(let k=n-1;k>0;k--){
                        client.say(channel,stackEmote(k,emote)); 
                    }
                }
            }
        }
        if(tmp[0].slice(1,tmp[0].length)==="test"){
            client.say(channel,"test");
            console.log("test");
        }
        if(tmp[0].slice(1,tmp[0].length)==="addToBlackList"){
            fs.appendFileSync(blackList, " "+tmp[1]);  
            client.say(channel,"added " +tmp[1]+" to blacklist, restarting");
            cd.fire();
            process.exit(1);
        }
    }  
});

function isCommand(m){
    if(m.charAt(0)==='!') return true;
    else return false;
}

function stackEmote(n,emote){
    let s = "";
    for(let i=0;i<n;i++){
        s = s.concat(" "+emote);
    }
    return s;
}

function weebDetected(m) {
    let s = fs.readFileSync(blackList).toString();
    s = s.split(" ");

    for(let i=0;i<s.length;i++){
        if(m.includes(s[i])&&s[i]!='') return true;
    }

    return false;
}


