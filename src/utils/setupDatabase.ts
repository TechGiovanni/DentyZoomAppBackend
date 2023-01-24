import mongoose from 'mongoose';
import { config } from '@utils/config'
import { logger } from '@utils/logger'
import bunyan from 'bunyan';
const log: bunyan = logger.createLogger("setupDatabase");

export default () => {
  const connect = () => {
    mongoose.set('strictQuery', true);
    mongoose.connect(`${config.MONGODB_URL}`)
    .then(() => {
      log.info("Successfully connected to database".green)
    }).catch((error) => {
      log.error(`Error connecting to Database: ${error}`.red);
      return process.exit(1); // this exit the node process
    })
  }
  connect();

  mongoose.connection.on('disconnect', connect); // listen for the disconnected method and it will try to connect again

}
