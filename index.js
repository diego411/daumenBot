if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const logger = require('./logger')

const commandHandler = require('./messagehandlers/commandHandler')
const weebHandler = require('./messagehandlers/weebHandler')
const eventHandler = require('./messagehandlers/eventHandler')

const replitConfig = require('./replitConfig')
replitConfig.config()

const client = require('./client')
client.init()

client.on("ready", () => logger.log('Online'));
client.on("close", (error) => {
  if (error != null) {
    logger.error("Client closed due to error", error);
  }
});

client.on("PRIVMSG", (msg) => {
  let msgType = getMsgType(msg)

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
  if (commandHandler.isCommand(msg)) return MSGTYPES.COMMAND
  if (weebHandler.weebDetected(msg)) return MSGTYPES.WEEBMSG
  if (isEvent(msg)) return MSGTYPES.EVENT
  return MSGTYPES.NONE
}

const MSGTYPES = {
  COMMAND: 0,
  WEEBMSG: 1,
  EVENT: 2,
  NONE: 3
}

//TODO
function isEvent(msg) {
  return true;
}