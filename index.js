const commandHandler = require('./messagehandlers/commandHandler')
const weebHandler = require('./messagehandlers/weebHandler')
const eventHandler = require('./messagehandlers/eventHandler')

const replitConfig = require('./replitConfig')
replitConfig.config()

const fs = require('fs');
const blackList = './db/blacklist.txt';

const client = require('./client')
client.init()

const PREFIX = '+'

client.on("ready", () => console.log('Online'));
client.on("close", (error) => {
  if (error != null) {
    console.error("Client closed due to error", error);
  }
});

client.on("PRIVMSG", (msg) => {
  let msgType = getMsgType(msg)
  console.log(msgType)

  switch (msgType) {
    case MSGTYPES.COMMAND: {
      commandHandler.handle(msg, client)
      break
    }
    case MSGTYPES.WEEBMSG: {
      weebHandler.handle(msg, client)
      break
    }
    case MSGTYPES.EVENT: {
      eventHandler.handle(msg, client)
      break
    }
    default: return
  }
})

const getMsgType = (msg) => {
  if (isCommand(msg)) return MSGTYPES.COMMAND
  if (weebDetected(msg)) return MSGTYPES.WEEBMSG
  if (isEvent(msg)) return MSGTYPES.EVENT
  return MSGTYPES.NONE
}

const MSGTYPES = {
  COMMAND: 0,
  WEEBMSG: 1,
  EVENT: 2,
  NONE: 3
}

function isCommand(msg) {
  if (msg.messageText.charAt(0) === PREFIX) return true;
  else return false;
}

//TODO
function isEvent(msg) {
  return true;
}

function weebDetected(msg) {
  let s = fs.readFileSync(blackList).toString();
  s = s.split(" ");

  for (let i = 0; i < s.length; i++) {
    if (msg.messageText.includes(s[i]) && s[i] != '') return true;
  }

  return false;
}