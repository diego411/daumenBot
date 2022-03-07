var jam = ['lebronJAM aye', 'TriKool aye', 'TriKool🔥', '🔥THIS SOME🔥lebronJAM🔥ABSOLUTE FIRE🔥', 'lebronJAM 🔥', '🔥TriDance🔥', 'TriDance 🔥', 'TriDance', 'TriDance aye', 'TriKool'];

const handle = (msg, client) => {
    if (msg.senderUsername === 'daumenbot') return;
    if (msg.messageText == '!daumenbot') {
        client.say(msg.channelName, `This bot nams the weebs xd. Contact @daumenloser or @yagnesh`)
    }
    if (msg.messageText == `widepeepoHappy`) {
        client.say(msg.channelName, `widepeepoHappy`);
    }
    if (msg.messageText == `TriDance`) {
        client.say(msg.channelName, `TriDance`);
    };
    if (msg.messageText === ('PogU')) {
        client.say(msg.channelName, `${msg.senderUsername}, PagChomp Clap`);
    }
    if (msg.messageText === 'TriHard') {
        client.say(msg.channelName, `TriHard`)
    }
    if (msg.messageText.includes('lebronJAM')) {
        const jammsg = jam[Math.floor(Math.random() * jam.length)];
        client.say(msg.channelName, jammsg);
    }
    if (msg.messageText.includes('$gn')) {
        if (msg.channelName === 'eiectricevil')
            client.say(msg.channelName, '$tuck ' + msg.senderUsername + ' Hope you have a good night Foreheadkiss ❤')
    }
    if (isAlertEvent(msg)) {
        client.me(msg.channelName, `pajaSubs 🚨 ALERT`);
    }

}

function isAlertEvent(msg) {
    return msg.isAction &&
        msg.senderUsername == 'pajbot' &&
        msg.messageText.includes('pajaS 🚨 ALERT');
}

exports.handle = handle
