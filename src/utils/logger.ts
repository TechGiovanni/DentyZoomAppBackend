import bunyan from 'bunyan';
const log = bunyan.createLogger({name: "setupServer"});
class Logger {
  public createLogger(name: string): bunyan {
    return bunyan.createLogger({name, level: 'debug'})
  }
}

export const logger: Logger = new Logger();
