(async function () {

  const logger = require('./logger');

  if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
    logger.log("Running in debug mode")
  }

  const commandHandler = require('./messagehandlers/commandHandler')
  const eventHandler = require('./messagehandlers/eventHandler')

  const replitConfig = require('./replitConfig')
  replitConfig.config()

  const database = await require('./database').init()

  commandHandler.init(database)

  const client = require('./client');

  client.init(database.getChannelConfigs())

  const gmvn = require('./gmvn')
  gmvn.startNamJob(client, database)

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
      case MSGTYPES.EVENT: {
        eventHandler.handle(msg, client)
        break
      }
      default: return
    }
  })

  const getMsgType = async (msg) => {
    if (commandHandler.isCommand(msg)) return MSGTYPES.COMMAND
    if (eventHandler.isEvent(msg)) return MSGTYPES.EVENT
    return MSGTYPES.NONE
  }

  const MSGTYPES = {
    COMMAND: 0,
    EVENT: 1,
    NONE: 2
  }

}())

