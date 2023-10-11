// Import custom files
const Connection = require("database").Connection;

const GeneralErrorHandler = require("../error/generalErrorHandler");

/**
 * Get DB Status
 *
 * @param {Object} req - Request Object
 * @param {Object} res - Response Object
 * @returns {boolean} Status of DB
 */
const getDBHealthStatus = async (req, res) => {
  try {
    if (Object.keys(req.query).length > 0)
      throw new GeneralErrorHandler("GEN_101");
    if (req.headers["content-type"]) throw new GeneralErrorHandler("GEN_102");

    const isDBRunning = await Connection.testConnection();
    if (!isDBRunning) throw new GeneralErrorHandler("GEN_103");
    res.status(200).send();
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    res.status(error.statusCode).send();
  }
};

module.exports = {
  getDBHealthStatus,
};
