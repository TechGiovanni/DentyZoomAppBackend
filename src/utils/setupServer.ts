import { Application, json, urlencoded, Request, Response, NextFunction } from 'express';
import http from 'http';
import cors from 'cors';
// import colors from 'colors';
import hpp from 'hpp';
import helmet from 'helmet';
import 'express-async-errors';
import compression from 'compression';
import cookieSession from 'cookie-session';
import HTTP_STATUS_CODE from 'http-status-codes';
// import { config } from '@utils/config';
import * as dotenv from 'dotenv';
dotenv.config();
import bunyan from 'bunyan';
const log = bunyan.createLogger({name: "setupServer"});



export class AppServerClass {
  private app: Application;

  constructor(app: Application) { // takes in the express application
    this.app = app; // the express app
  }

  public start(): void {
    this.securityMiddleware(this.app);
    this.standardMiddleware(this.app);
    this.routeMiddleware(this.app);
    this.globalErrorHandler(this.app);
    this.startServer(this.app);
  }

  private securityMiddleware(app: Application): void { // runs before req is met
    app.use(cookieSession({
      name: 'session', // we will need this name when setting up load balancer in AWS
      keys: ['test1', 'test2'],
      maxAge: 24 * 7 * 3600000,
      secure: process.env.NODE_ENV === 'development' ? false : true
    }));
    app.use(hpp());
    app.use(helmet());
    app.use(cors({
      origin: process.env.CLIENT_URL,
      credentials: true, // this is necessary for using cookies
      optionsSuccessStatus: 200, // for internet explorer and older browsers
      methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'] // methods we will be using to access the backend
    }));
  }

  private standardMiddleware(app: Application): void {
    app.use(compression()); // help compress req and response
    app.use(json({ limit: '50mb' }))
    app.use(urlencoded({ limit: '50mb', extended: true })); // allows form url codes
  }

  private routeMiddleware(app: Application): void {}

  private globalErrorHandler(app: Application): void {}

  private async startServer(app: Application): Promise<void> {
    try {
      const httpServer = new http.Server(app)
      this.StartHttpServer(httpServer)

    } catch (error) {
      process.env.NODE_ENV === 'development' ? log.error(`server Error: ${error}`.red) : log.error(`server Error: ${error}`)
    }
  }

  private createSocketIO(httpServer: http.Server): void {}

  private StartHttpServer(httpServer: http.Server): void {
    httpServer.listen(
      process.env.PORT || process.env.SERVER_PORT, () => {
      log.info(`Server started on Port ${ process.env.PORT || process.env.SERVER_PORT}`.cyan);
    })
  }
}
