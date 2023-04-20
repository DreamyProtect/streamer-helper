<h1 align="center">Welcome to Stream Helper Chatbot 👋</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/dynamic/json?url=https://api.github.com/repos/DreamyProtect/streamer-helper/releases/latest&label=version&query=$.tag_name&color=blue" />
  <a href="https://github.com/DreamyProtect/streamer-helper/blob/main/README.md" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" />
  </a>
  <a href="https://github.com/DreamyProtect/streamer-helper/blob/main/LICENSE" target="_blank">
    <img alt="License: BSD 3--Clause &#34;New&#34; or &#34;Revised&#34; License" src="https://img.shields.io/badge/License-BSD 3--Clause &#34;New&#34; or &#34;Revised&#34; License-yellow.svg" />
  </a>
  <a href="https://twitter.com/DreamyProtect" target="_blank">
    <img alt="Twitter: DreamyProtect" src="https://img.shields.io/twitter/follow/DreamyProtect.svg?style=social" />
  </a>
</p>


> This project is a usefull chatbot that can be coupled with your normal chatbot helper like Nightbot and Streamelements that shoutouts streamers you configured it to shoutout.

## Usage

1. Create a JSON configuration file:
```json
{
  "loglevel": "info",
  "twitch_chatbot": {
    "username": "dreamyprotects",
    "shoutouts": [
      "dreamyprotects",
    ],
    "shoutouts_ttl": "10m",
    "connected_channels": [
        "dreamyprotects"
    ]
  },
  "database": {
    "path": "db.json"
  }
}
```
And change the variables according to your needs:

* loglevel: The level of logs you want the bot to output follow [winston's documentation](https://github.com/winstonjs/winston)
* twitch_chatbot.username: the name of the user representing the bot in your channel (must match the user you generated the token with).
* twitch_chatbot.shoutouts: the list of users you want to automatically shoutout
* twitch_chatbot.shoutouts_ttl: the ttl for the shoutout (after x period of time the user will get re-shouted out)
* twitch_chatbot.connected_channels: this is a list of twitch chats you want the bot to be connected to.
* database.path: this project uses a local database (which is essentially a json file), this is the path where that file is stored on the disk. By default the path will be in /app/db.json in the container.

2. Start the container

```sh
docker run \
  -v $(pwd)/config.json:/app/config.json # by default the configuration path is /app/config.json but you can change it using the CONFIG_PATH environment variable
  -e TWITCH_ACCESS_TOKEN=<your bot access token> \
  ghcr.io/dreamyprotect/streamer-helper:latest
```

The bot should connect to the configured chats and shoutout people automatically.

### Getting an access token

You must follow [Twitch's documentation](https://dev.twitch.tv/docs/authentication/) to register an app and get an access-token for the bot.

## Contributing

TODO:
  - personnalize shoutout commands for every user
    - need to use API: https://dev.twitch.tv/docs/api/reference/#send-chat-announcement for using commands
    - need to auto-detect chat commands
    - wrapper for API: https://github.com/twurple/twurple
  - Only connect when stream is active https://gist.github.com/d0p3t/3b763f561fd4ae83f46ef7cb78e72bad
