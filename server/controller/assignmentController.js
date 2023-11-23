// Import custom files
const AssignmentClient = require("database").AssignmentClient;
const SubmissionClient = require("database").SubmissionClient;

const AssignmentErrorHandler = require("../error/assignmentErrorHandler");
const GeneralErrorHandler = require("../error/generalErrorHandler");
const logger = require('../logger/winston');

const assignmentClient = new AssignmentClient();
const submissionClient = new SubmissionClient();

const StatsD = require('node-statsd');
const statsd = new StatsD({ host: 'localhost', port: 8125 });

/**
 * Create Assignment
 *
 * @param {Object} req - Request Object
 * @param {Object} res - Response Object
 * @returns {boolean} Status of DB
 */
const createAssignment = async (req, res) => {
  try {
    statsd.increment('api.request.createAssignment');

    if (Object.keys(req.query).length > 0)
      throw new GeneralErrorHandler("GEN_101");

    const { name, points, num_of_attempts, deadline } = req.body;
    if (!name || !points || !num_of_attempts || !deadline)
      throw new GeneralErrorHandler("GEN_102");
    if (points > 10 || points < 1 || points % 1 != 0)
      throw new AssignmentErrorHandler("ASSGN_104");
    if (deadline <= new Date().toISOString() || !/(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3})Z/.test(deadline))
      throw new AssignmentErrorHandler("ASSGN_102");
    if (num_of_attempts % 1 != 0) throw new AssignmentErrorHandler("ASSGN_105");
    if (!isNaN(name)) throw new AssignmentErrorHandler("ASSGN_106")

    const payload = {
      name: name,
      points: points,
      num_of_attempts: num_of_attempts,
      deadline: deadline,
      submissions: 0
    };
    const assignment = await assignmentClient.createAssignment(
      payload,
      req.user.id,
    );
    logger.info(`Assignment created: ${assignment}`);
    res.status(201).send(assignment);
  } catch (error) {
    logger.error("Error creating assignment:", error);
    if (!error.statusCode) error.statusCode = 500;
    res.status(error.statusCode).send(error);
  }
};

const deleteAssignment = async (req, res) => {
  try {
    statsd.increment('api.request.deleteAssignment');

    const isDeleted = await assignmentClient.deleteAssignment(req.params.id);
    if (!isDeleted) throw new AssignmentErrorHandler("ASSGN_101");
    logger.info(`Assignment deleted: ${req.params.id}`);
    res.status(204).send();
  } catch (error) {
    logger.error("Error deleting assignment:", error);
    if (!error.statusCode) error.statusCode = 500;
    res.status(error.statusCode).send(error);
  }
};

const getAssignment = async (req, res) => {
  try {
    statsd.increment('api.request.getAssignment');

    if (req.headers["content-type"]) throw new GeneralErrorHandler("GEN_102");

    const assignment = await assignmentClient.getAssignment(req.params.id);
    if (!assignment) throw new AssignmentErrorHandler("ASSGN_101");

    const assignmentjson = assignment.toJSON();
    delete assignmentjson.UserId;
    logger.info(`Assignment fetched: ${req.params.id}`);
    res.status(200).send(assignmentjson);
  } catch (error) {
    logger.error("Error getting assignment:", error);
    if (!error.statusCode) error.statusCode = 500;
    res.status(error.statusCode).send(error);
  }
};

const getAllAssignment = async (req, res) => {
  try {
    statsd.increment('api.request.getAllAssignment');

    if (req.headers["content-type"]) throw new GeneralErrorHandler("GEN_102");
    if (Object.keys(req.query).length > 0)
      throw new GeneralErrorHandler("GEN_101");

    const assignments = await assignmentClient.getAllAssignment();
    assignments.forEach((assignment) => {
      return assignment.toJSON();
    });
    logger.info(`All assignment fetched by ${req.user.id}`);
    res.status(200).send(assignments);
  } catch (error) {
    logger.error("Error getting assignment:", error);
    if (!error.statusCode) error.statusCode = 500;
    res.status(error.statusCode).send(error);
  }
};

const updateAssignment = async (req, res) => {
  try {
    statsd.increment('api.request.updateAssignment');

    const assignmentId = req.params.id;
    if (!assignmentId) throw new AssignmentErrorHandler("ASSGN_103");

    await assignmentClient.updateAssignment(
      req.body.assignmentBody,
      assignmentId,
      req.user.id,
    );
    logger.info(`Assignment ${req.params.id} updated`);
    res.status(204).send();
  } catch (error) {
    logger.error("Error updating assignment:", error);
    if (!error.statusCode) error.statusCode = 500;
    res.status(error.statusCode).send(error);
  }
};

const submitAssignment = async (req, res) => {
  try {
    statsd.increment('api.request.submitAssignment');

    const assignmentId = req.params.id;
    if (!assignmentId) throw new AssignmentErrorHandler("ASSGN_103");

    const assignment = await assignmentClient.getAssignment(assignmentId);
    if (!assignment) throw new AssignmentErrorHandler("ASSGN_101")

    const submission = await submissionClient.getSubmissionsByID(assignmentId);
    if (submission.id) {
      if (submission.attempts >= assignment.num_of_attempts) throw new AssignmentErrorHandler("ASSGN_107")
      const updatedSubmission = await submissionClient.updateSubmission({
        submission_url: req.body.submission_url,
      }, submission.id)
      logger.info(`Assignment ${req.params.id} submission successfully updated`);
      res.status(201).send(updatedSubmission);
    } else {
      const createdSubmission = await submissionClient.createSubmission(req.body, assignmentId);
      logger.info(`Assignment ${req.params.id} submission successfuly created`);
      res.status(201).send(createdSubmission);
    }
  } catch (error) {
    logger.error("Error submitting assignment:", error);
    if (!error.statusCode) error.statusCode = 500;
    res.status(error.statusCode).send(error);
  }
};

module.exports = {
  createAssignment,
  deleteAssignment,
  getAssignment,
  getAllAssignment,
  updateAssignment,
  submitAssignment
};
