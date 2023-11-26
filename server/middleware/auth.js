const AuthErrorHandler = require("../error/authErrorHandler");
const GeneralErrorHandler = require("../error/generalErrorHandler");
const logger = require("../logger/winston");

const UserClient = require("database").UserClient;
const Connection = require("database").Connection;

const userClient = new UserClient();

// Middleware to check authorization
const isUserAuthenticated = async (req, res, next) => {
  try {
    // Get auth header from header
    const authHeader = req.headers.authorization;
    if (!authHeader) throw new AuthErrorHandler("AUTH_101");

    // Extract relevant parameters
    const encodedCredentials = authHeader.split(" ")[1];
    if (!encodedCredentials) throw new AuthErrorHandler("AUTH_102");

    // Decode credentials
    const decodedCredentials = Buffer.from(
      encodedCredentials,
      "base64",
    ).toString("utf-8");

    // Input validations
    const [email, password] = decodedCredentials.split(":");
    if (!email || !password) throw new AuthErrorHandler("AUTH_103");

    // Get user details from DB
    const validUser = await userClient.getUser(email);
    if (!validUser) throw new AuthErrorHandler("AUTH_103");

    // Check for password match
    const match = await userClient.comparePasswords(
      password,
      validUser.password,
    );
    if (!match) throw new AuthErrorHandler("AUTH_103");

    req.user = {
      email,
      password,
      id: validUser.id,
    };
    next();
  } catch (error) {
    logger.error("Failed to Authenticate User", error);
    if (!error.statusCode) error.statusCode = 500;
    res.status(error.statusCode).send(error);
  }
};

// Middleware to check if DB is running
const isDBOnline = async (req, res, next) => {
  try {
    const isDBRunning = await Connection.testConnection();
    if (!isDBRunning) throw new GeneralErrorHandler("GEN_103");
    next();
  } catch (error) {
    logger.error("DB Connection error", error);
    if (!error.statusCode) error.statusCode = 500;
    res.status(error.statusCode).send(error);
  }
};

module.exports = {
  isUserAuthenticated,
  isDBOnline,
};
