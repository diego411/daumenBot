if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const commandHandler = require('./messagehandlers/commandHandler')
const weebHandler = require('./messagehandlers/weebHandler')
const eventHandler = require('./messagehandlers/eventHandler')

const logger = require('./logger');

const replitConfig = require('./replitConfig')
replitConfig.config()

const Database = require("@replit/database");
const db = new Database('https://kv.replit.com/v0/eyJhbGciOiJIUzUxMiIsImlzcyI6ImNvbm1hbiIsImtpZCI6InByb2Q6MSIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJjb25tYW4iLCJleHAiOjE2NDY3MTAyOTMsImlhdCI6MTY0NjU5ODY5MywiZGF0YWJhc2VfaWQiOiIwMzg0ZGRmOC1iNGIyLTQyYmEtYjhmYi02NmY2YzkzYzZmYTAifQ.WhiraD8eu9SUAvGa9jd-Bgnjzxh4raXB30HDJwRLJHesmGHVUQRbLAcRSvNIMrrFxZF_9pWATXlR0YGfot9K4Q');

commandHandler.init(db)

const client = require('./client');

db.get('channels').then(client.init)

client.on("ready", () => logger.log('Online'));
client.on("close", (error) => {
  if (error != null) {
    console.error("Client closed due to error", error);
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