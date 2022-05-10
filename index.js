(async function () {

  const logger = require('./utils/logger');

  if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
    logger.log("Running in debug mode")
  }

  const commandHandler = require('./commands/commandHandler')
  const eventHandler = require('./events/eventHandler')

  const database = require('./database')
  await database.connect()

  const client = require('./client');

  client.init(await database.getChannelNames())

  require('./crons/gmvn').startNamJob()

  client.on("ready", () => logger.log('Online'));
  client.on("close", (error) => {
    if (error != null) {
      console.error("Client closed due to error", error);
    }
  });

  client.on("PRIVMSG", async (msg) => {
    eventHandler.handle(msg)
    commandHandler.handle(msg)
  })

}())

