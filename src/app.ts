import express, { Express } from 'express';
import { AppServerClass } from '@utils/setupServer';
import databaseConnection from '@utils/setupDatabase';
import 'colors';
import { config } from '@utils/config'


class Application {
  public initialize(): void { // initialize or start, which ever name is good
    this.loadConfig();
    databaseConnection();
    const app: Express = express();
    const server: AppServerClass = new AppServerClass(app);
    server.start(); // anytime we call this app, it will call this method
  }

  private loadConfig(): void { // validate env variables
    config.validateConfig()
  }
}

const application: Application = new Application();
application.initialize(); // This starts the whole app











// process.once('SIGUSR2', function () {
//   process.kill(process.pid, 'SIGUSR2');
// });

// process.on('SIGINT', function () {
//   // this is only called on ctrl+c, not restart
//   process.kill(process.pid, 'SIGINT');
// });

// process.on('SIGINT', () => { console.log("Bye bye!"); process.exit(); });
