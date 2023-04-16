# streamer-helper

TODO:

- add logger: https://github.com/winstonjs/winston
- add db :
  - [x] List of objects with: username and timestamp of the last message
  - [x] configure TTL using configfile: parse: https://github.com/jkroso/parse-duration
  - [x] add lockfile to db ? https://www.npmjs.com/package/proper-lockfile
  - Only connect when stream is active https://gist.github.com/d0p3t/3b763f561fd4ae83f46ef7cb78e72bad
