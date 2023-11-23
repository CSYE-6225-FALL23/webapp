const Connection = require("./client/connection");
const AssignmentClient = require("./client/assignmentClient");
const SubmissionClient = require("./client/submissionClient");
const UserClient = require("./client/userClient");
const syncModels = require("./client/syncModels");

module.exports = {
  Connection,
  AssignmentClient,
  SubmissionClient,
  UserClient,
  syncModels,
};
