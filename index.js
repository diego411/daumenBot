const logger = require('./logger');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
  logger.log("Running in debug mode")
}

const commandHandler = require('./messagehandlers/commandHandler')
const weebHandler = require('./messagehandlers/weebHandler')
const eventHandler = require('./messagehandlers/eventHandler')

const replitConfig = require('./replitConfig')
replitConfig.config()

const Database = require("@replit/database");
const db = new Database('https://kv.replit.com/v0/eyJhbGciOiJIUzUxMiIsImlzcyI6ImNvbm1hbiIsImtpZCI6InByb2Q6MSIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJjb25tYW4iLCJleHAiOjE2NDY3MTAyOTMsImlhdCI6MTY0NjU5ODY5MywiZGF0YWJhc2VfaWQiOiIwMzg0ZGRmOC1iNGIyLTQyYmEtYjhmYi02NmY2YzkzYzZmYTAifQ.WhiraD8eu9SUAvGa9jd-Bgnjzxh4raXB30HDJwRLJHesmGHVUQRbLAcRSvNIMrrFxZF_9pWATXlR0YGfot9K4Q');

commandHandler.init(db)
weebHandler.init(db)

const client = require('./client');

if (process.env.NODE_ENV !== 'production') db.get('debugchannels').then(client.init)
else db.get('channels').then(client.init)

const gmvn = require('./gmvn')
gmvn.startNamJob(client, db)

client.on("ready", () => logger.log('Online'));
client.on("close", (error) => {
  if (error != null) {
    console.error("Client closed due to error", error);
  }
});

client.on("PRIVMSG", async (msg) => {
  let msgType = await getMsgType(msg)

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

const getMsgType = async (msg) => {
  if (commandHandler.isCommand(msg)) return MSGTYPES.COMMAND
  if (await weebHandler.weebDetected(msg)) return MSGTYPES.WEEBMSG
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