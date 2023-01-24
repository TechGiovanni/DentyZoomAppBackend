// Used to communicate with the .env variables
// more organized to just have one config file to manage all of the environment variables.
// well add all the environment variables in the dotenv file
//  call them here
// then to use it, well call/import - config.theNameOfTheVariable
import * as dotenv from 'dotenv';
dotenv.config();
import cloudinary from 'cloudinary';

class Config {
  // first create public variables
  // these are the variables to call when importing the config file.
  public CLIENT_URL: string | undefined;
  public COOKIE_KEY_TWO: string | undefined;
  public COOKIE_KEY_ONE: string | undefined;
  public JWT_TOKEN: string | undefined;
  public MONGODB_URL: string | undefined;
  public NODE_ENV: string | undefined;
  public SERVER_PORT: string | undefined;

  public API_URL: string | undefined;
  public REDIS_HOST: string | undefined;
  public CLOUD_NAME: string | undefined;
  public CLOUD_API_KEY: string | undefined;
  public CLOUD_API_SECRET: string | undefined;
  public SENDER_EMAIL: string | undefined;
  public SENDER_EMAIL_PASSWORD: string | undefined;
  public SENDGRID_API_KEY: string | undefined;
  public SENDGRID_SENDER: string | undefined;
  public EC2_URL: string | undefined;

  constructor() {
    this.CLIENT_URL = process.env.CLIENT_URL;
    this.COOKIE_KEY_TWO = process.env.COOKIE_KEY_TWO || '';
    this.COOKIE_KEY_ONE = process.env.COOKIE_KEY_ONE || '';
    this.JWT_TOKEN = process.env.JWT_TOKEN || '123456';
    this.MONGODB_URL = process.env.MONGODB_URL || '';
    this.NODE_ENV = process.env.NODE_ENV || '';
    this.SERVER_PORT = process.env.SERVER_PORT || '';
    this.REDIS_HOST = process.env.REDIS_HOST || '';
    this.CLOUD_NAME = process.env.CLOUD_NAME || '';
    this.CLOUD_API_KEY = process.env.CLOUD_API_KEY || '';
    this.CLOUD_API_SECRET = process.env.CLOUD_API_SECRET || '';
  }

  // public createLogger(name: string): bunyan {
  //   return bunyan.createLogger({name, level: 'debug'})
  // }

  public validateConfig(): void {
    // console.log("All the variables -> key & Value:", this)
    // [] validate to make sure the environment variables exist
    // the 'this' is an object containing whats inside the constructor
    // [] loop through the object of the constructor to get the key and the value.
    // [] if the constructor doesn't find any values, it will then assign/return "undefined" on that specific private variable.
    for( const [key, value] of Object.entries(this)) {
      // if value is equal to undefined
      if(value === undefined) {
        throw new Error(`Configuration ${key} is undefined`.red)
      }

    }
  }

  public cloudinaryConfig(): void {

  }

}
// this is how to use the class
// were exporting an instance of this config class
export const config: Config = new Config();
