const Joi = require(`joi`);

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string()
      .valid(`production`, `development`, `test`)
      .required(),
    PORT: Joi.number().default(3000).description(`The port for the API server`),
    MONGODB_URL: Joi.string().required().description(`Mongo DB url`),
    JWT_SECRET: Joi.string().required().description(`JWT secret key`),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number()
      .default(30)
      .description(`minutes after which access tokens expire`),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number()
      .default(30)
      .description(`days after which refresh tokens expire`),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description(`minutes after which reset password token expires`),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description(`minutes after which verify email token expires`),
    SMTP_HOST: Joi.string().description(`server that will send the emails`),
    SMTP_PORT: Joi.number().description(`port to connect to the email server`),
    SMTP_USERNAME: Joi.string().description(`username for email server`),
    SMTP_PASSWORD: Joi.string().description(`password for email server`),
    EMAIL_FROM: Joi.string().description(
      `the from field in the emails sent by the app`,
    ),
    CORS: Joi.string().valid(`true`, `false`).description(`Enable CORS`),
    API_URL: Joi.string().description(`url to make api calls to. used by src/static`),
    DISCORD_BOT_TOKEN: Joi.string().required().description(`discord bot token`),
    // temporary
    DISCORD_OAUTH_URI: Joi.string().required().description(`discord bot token`),
    STATIC_SERVER: Joi.string().valid(`true`, `false`).description(`discord bot token`),
    STATIC_SERVER_PORT: Joi.number().description(`The port for another static server (if true, both api server and static server will be online)`),
    STATIC_SERVER_API_URL: Joi.string().description(`The API url this static server should use`),
    STATIC_ROUTE: Joi.string().valid(`true`, `false`).description(`Serve /static`),
  })
  .unknown();

module.exports = envVarsSchema;
