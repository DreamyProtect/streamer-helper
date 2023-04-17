const tmi = require('tmi.js');
const fs = require('fs');
const { JsonDB, Config } = require('node-json-db');
const parseDuration = require('parse-duration');
const winston = require('winston');

// Create the logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [ new winston.transports.Console() ]
});

logger.info("Parsing configuration...");
var config = {};
try {
  const config_path = process.env.CONFIG_PATH || "config.json"
  const data = fs.readFileSync(config_path);
  config = JSON.parse(data, 'utf8');
} catch (error) {
  logger.error("Something went wrong when parsing the configuration file, exiting...");
  logger.error(error);
  process.exit(1);
}
logger.info("Parsed configuration succesfully...");

logger.level = config.loglevel;

logger.info("Initializing DB...");
const db = new JsonDB(new Config(config.database.path || "db.json", true, false, '/'));
db.getData('/')
  .then((data) => {
    if (Object.keys(data).length === 0) {
      db.push('/users', []);
    }
  })
  .catch((error) => {
    logger.error(`Something went wrong while initializing the database: ${error}`)
  })
logger.info("Initialized DB successfully");

logger.info("Initializing TMI client...");
const client = new tmi.client({
  identity: {
    username: config.twitch_chatbot.username,
    password: `${process.env.TWITCH_ACCESS_TOKEN}`
  },
  channels: config.twitch_chatbot.connected_channels
});
logger.info("Succesfully initialized TMI client");

logger.info("Connecting to twitch's chat...")
client.connect();
client.on('connected', (addr, port) => { logger.info(`Connected to ${addr}:${port}`) });

client.on('message', onMessageHandler);

function onMessageHandler (channel, tags, _, self) {
  if (self) { return; }

  if (config.twitch_chatbot.shoutouts.includes(tags.username)){
    db.getData("/users")
      .then((data) => {
        if (data.filter((elem) => elem.username == tags.username).length === 0){
          client.say(channel, `!so ${tags.username}`);
          db.push(`/users`, [{ username: tags.username, ttl: Date.now() }], false);
          logger.info(`Added ${tags.username} in the database`);
          logger.info(`Shoutouted ${tags.username} successfully !`);
          return;
        }
        const now = Date.now();
        const updatedb = data.map((elem) => {
          if ((elem.username === tags.username) && (now - elem.ttl > parseDuration(config.twitch_chatbot.shoutouts_ttl, 'ms'))){
            client.say(channel, `!so ${tags.username}`);
            logger.info(`Shoutouted ${tags.username} successfully !`);
            return { username: elem.username, ttl: Date.now() }
          }
          return { username: elem.username, ttl: elem.ttl }
        })
        if (JSON.stringify(data) !== JSON.stringify(updatedb)){
          db.push("/users", updatedb, true)
            .catch((error) => {
              logger.error(`Something went wrong while updating the database: ${error}`);
            });
        }
      })
      .catch((error) => {
        logger.error(`Something went wrong while fetching the users in DB: ${error}`);
      })
  }
}
