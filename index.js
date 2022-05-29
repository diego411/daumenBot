(async function () {

  const logger = require('./utils/logger');

  if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
    logger.log("Running in debug mode")
  } else logger.log("Running in production mode")

  const commandHandler = require('./commands/commandHandler')
  const eventHandler = require('./events/eventHandler')

  const database = require('./database')
  await database.connect()

  require('./api/index')

  const client = require('./client');

  const channelNames = await database.getChannelNames()
  if (channelNames.length == 0) {
    await database.addConfig({
      channel_name: "daumenbot"
    })
    await require('./controllers/wlogger').joinChannel("daumenbot")
    await require('./controllers/wed').joinChannel("daumenbot")
    client.init(await database.getChannelNames())
  } else {
    channelNames.map(async channelName => {
      const wloggerController = require('./controllers/wlogger')

      await wloggerController.joinChannel(channelName)
      await require('./controllers/wed').joinChannel(channelName)

      wloggerController.optOutUser("daumenbot")
    })
    client.init(channelNames)
  }

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

