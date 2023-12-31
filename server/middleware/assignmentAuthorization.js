const AssignmentErrorHandler = require("../error/assignmentErrorHandler");
const GeneralErrorHandler = require("../error/generalErrorHandler");
const AuthErrorHandler = require("../error/authErrorHandler");
const logger = require("../logger/winston");

const AssignmentClient = require("database").AssignmentClient;

const assignmentClient = new AssignmentClient();

// Middleware to check authorization
const canUserDeleteAssignment = async (req, res, next) => {
  try {
    if (req.headers["content-type"]) throw new GeneralErrorHandler("GEN_102");
    if (!req.params.id) throw new AssignmentErrorHandler("ASSGN_103");

    const assignment = await assignmentClient.getAssignment(req.params.id);
    if (!assignment) throw new AssignmentErrorHandler("ASSGN_101");

    if (assignment.dataValues.UserId != req.user.id)
      throw new AuthErrorHandler("AUTH_104");
    next();
  } catch (error) {
    logger.error("Failed to delete assignment", error);
    if (!error.statusCode) error.statusCode = 500;
    res.status(error.statusCode).send(error);
  }
};

const canUserUpdateAssignment = async (req, res, next) => {
  try {
    if (!req.params.id) throw new AssignmentErrorHandler("ASSGN_103");

    const assignmentBody = Object.keys(req.body).reduce(
      (result, key) =>
        req.body[key] !== null &&
        ["name", "points", "num_of_attempts", "deadline"].includes(key)
          ? { ...result, [key]: req.body[key] }
          : result,
      {},
    );
    if (Object.keys(assignmentBody).length == 0)
      throw new GeneralErrorHandler("GEN_102");
    req.body.assignmentBody = assignmentBody;

    const assignment = await assignmentClient.getAssignment(req.params.id);
    if (!assignment) throw new AssignmentErrorHandler("ASSGN_101");

    if (assignment.dataValues.UserId != req.user.id)
      throw new AuthErrorHandler("AUTH_104");
    next();
  } catch (error) {
    logger.error("Failed to update assignment", error);
    if (!error.statusCode) error.statusCode = 500;
    res.status(error.statusCode).send(error);
  }
};

module.exports = {
  canUserDeleteAssignment,
  canUserUpdateAssignment,
};
