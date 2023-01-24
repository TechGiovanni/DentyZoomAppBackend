import { Application, json, urlencoded, Request, Response, NextFunction } from 'express';
import http from 'http';
import cors from 'cors';
// import colors from 'colors';
import hpp from 'hpp';
import helmet from 'helmet';
import 'express-async-errors';
import compression from 'compression';
import { config } from '@utils/config';
import { logger } from '@utils/logger'
import cookieSession from 'cookie-session';
import HTTP_STATUS from 'http-status-codes';
import bunyan from 'bunyan';
const log: bunyan = logger.createLogger("setupServer");
import { Server } from 'socket.io'
import { createClient } from 'redis';
import { createAdapter } from '@socket.io/redis-adapter'
import ApplicationRoutes from '@routes/routes'
import { CustomError, IErrorResponse } from '@global/helpers/error-handler';

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
      keys: [config.COOKIE_KEY_ONE!, config.COOKIE_KEY_TWO!],
      maxAge: 24 * 7 * 3600000,
      secure: config.NODE_ENV === 'development' ? false : true
    }));
    app.use(hpp());
    app.use(helmet());
    app.use(cors({
      origin: config.CLIENT_URL,
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

  private routeMiddleware(app: Application): void {
    ApplicationRoutes(app)
  }

  private globalErrorHandler(app: Application): void {

    app.all('*', (req:Request, res:Response) => {
      // urls that are not available
      res.status(HTTP_STATUS.NOT_FOUND).json({ mesage: `${req.originalUrl} not found`})
    })

    app.use((error:IErrorResponse, req:Request, res:Response, next:NextFunction) => {
      log.error(error);
      if(error instanceof CustomError) {
        res.status(error.statusCode).json(error.serializeErrors())
      }
      next()

    })
  }

  private async startServer(app: Application): Promise<void> {
    try {
      const httpServer = new http.Server(app)
      const socketIO: Server = await this.createSocketIO(httpServer)
      this.socketIOConnections(socketIO)
      this.StartHttpServer(httpServer)

    } catch (error) {
      config.NODE_ENV === 'development' ? log.error(`server Error: ${error}`.red) : log.error(`server Error: ${error}`)
    }
  }

  private async createSocketIO(httpServer: http.Server): Promise<Server> {
    const io: Server = new Server(httpServer, {
      cors: {
        origin: config.CLIENT_URL,
        methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS']
      }
    })

    // publishing
    const pubClient = createClient({ url: config.REDIS_HOST});
    const subClient = pubClient.duplicate(); // subscription
    await Promise.all([pubClient.connect(), subClient.connect()])
    io.adapter(createAdapter(pubClient, subClient));
    return io; // io is of type "Server" so return the Type "Server"
  }

  private StartHttpServer(httpServer: http.Server): void {
    log.info(`Server has started with ${process.pid}`)
    httpServer.listen(
      process.env.PORT || config.SERVER_PORT, () => {
      log.info(`Server started on Port ${ process.env.PORT || config.SERVER_PORT}`.cyan);
    });
  }

  private socketIOConnections(io: Server):void {}
}
