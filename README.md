# Daumenbot

![nam](assets/namapprove.png)

This is a dank twitch bot i primarly made for learning purposes. The bot is divided into three services at this moment. This is the actual twitch client that reads the commands typed in chat and responds to them. Other than that a [logging service](https://github.com/diego411/wlogger) and a [weeb emote detection service](https://github.com/diego411/WED) are part of the architecture. For more information on those parts of the bot refer to the linked repositories.

## Get the bot

If you want the bot to join your channel just whisper @daumenloser on twitch or type in my channel :] 

## Commands
The bot's prefix is '+'. In order to use a command, type the prefix following the command name. For example: +ping.

| Name           | Alias | Description                                                                                                                                                                                                                                                            | AdminRequired |
| -------------- | ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| howweebis      | hwis  | Gives you an overview of how many weeb messages a certain user has typed and what their current score is.                                                                                                                                                              | No            |
| randomweebline | rwl   | Expects a channel name. The output will be a random weeb line from the given channel if one exists.                                                                                                                                                                    | No            |
| weebcheck      | wc    | Expects a channel name and message. The output will be an assessment of wether the given message is weeb or not along with a confidence.                                                                                                                               | No            |
| ping           | /     | Pong!                                                                                                                                                                                                                                                                  | No            |
| optout         | /     | Allows you to optout from specific services. Currently only "logs" is supported which stops the bot from collecting logs of your messages. This does not delete already collected logs. If you want to get rid of all your logs please contact @daumenloser on twitch. | No            |
| optin          | /     | Allows you to opt into services you have opted out from previously. Currently only supports "logs".                                                                                                                                                                    | No            |
| userid         | uid   | Outputs the user id of a given user if they exist.                                                                                                                                                                                                                     | No            |
| islive         | /     | Tells you wether a given channel is live or not.                                                                                                                                                                                                                       | No            |
| isbanphrased   | /     | Tells you wether a given message is banphrased or not (using pajbot's api).                                                                                                                                                                                            | No            |
| test           | /     | FeelsDankMan                                                                                                                                                                                                                                                           | No            |
| get            | /     | Outputs the value for a given database key in the console                                                                                                                                                                                                              | Yes           |
| join           | /     | Joins the given channel. Optionally the following parameters can be defined: spam, talkInOnline, weebFilter, events.                                                                                                                                                   | Yes           |
| part           | /     | Parts the given channel.                                                                                                                                                                                                                                               | Yes           |
| say            | /     | Echoes the given message in the chat.                                                                                                                                                                                                                                  | Yes           |
| sayeverywhere  | /     | Echoes the given message in all joined chats.                                                                                                                                                                                                                          | Yes           |
| whitelist      | /     | Tells the weebdetection service to ignore the given emote when assessing messages                                                                                                                                                                                      | Yes           |

## Host own instance

If you want you can host your own instance of this bot. However, many of the bot's functionalities aren't avaible when only hosting this service. If you want to host the entire bot with all of its features the easiest way would be to clone all three services and then use docker-compose with this [yml](https://gist.github.com/diego411/a2fc840c10c7075d0bb35a8d0c6de3ae). 
If you only want to run the bot you can set it up as a node app or use the Dockerfile. Make sure you have a redis instance running as well. You will need the following env variables to run the bot locally.
- OAUTH=<your_oauth_token>
- CLIENT_ID=<your_client_id>
- REDIS_HOST=localhost (if you're running locally)
- REDIS_PORT=6379 (default)