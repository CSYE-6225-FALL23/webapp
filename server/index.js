// Import libraries
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require('dotenv').config({ path: require('path').join(process.cwd(), `.env.${process.env.NODE_ENV}`) });
logger.info('Environment detected -', process.env.NODE_ENV)

const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.File({ filename: 'webapp.log' }),
  ],
});

logger.log('info', 'Environment detected -', process.env.NODE_ENV);

// Import custom files
const route = require("./route/route");
const assignmentRoute = require("./route/assignmentRoute");
const handleUnsupportedMethods = require("./middleware/unsupportedRoute");
const helper = require("./helper/helper");

const syncModels = require("database").syncModels;

// Get environment variables
const PORT = process.env.SERVER_PORT;

// Initialize express
const app = express();

app.use((req, res, next) => {
  const contentType = req.headers["content-type"];
  if (contentType && !contentType.includes("application/json"))
    res.status(400).json({
      error: "Invalid Content-Type. Only application/json is allowed.",
    });
  else bodyParser.json({ extended: true })(req, res, next);
});
app.use(bodyParser.urlencoded({ extended: true }));

const corsOptions = {
  origin: "*", // Client's domain
  methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD"],
  credentials: true, // Enable HTTPS
  allowedHeaders: [
    "Access-Control-Allow-Headers",
    "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept",
  ], // Allowed headers
};

app.use(cors(corsOptions));

// Return 405 for unsupported methods
app.use(handleUnsupportedMethods);

// Valid routes
app.use("/", route);
app.use("/v1/assignments", assignmentRoute);

// Handle invalid routes
app.use("*", (req, res) => {
  res.status(404).send();
});

(async () => {
  try {
    await syncModels();

    const filePath = process.env.FILEPATH;
    logger.info(`Loading users from:`, filePath);
    const users = await helper.readUsersFromCsv(filePath);
    const addedUsers = await helper.createDefaultUsers(users);
    logger.info(`Added ${addedUsers} users`);
  } catch (error) {
    logger.error('error', error);
  }
})();

// Start server
app.listen(PORT, () => {
  logger.info(`Server is running successfully on PORT ${PORT}`);
});

module.exports = app;
