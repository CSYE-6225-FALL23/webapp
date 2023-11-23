const assignmentError = {
  ASSGN_101: {
    statusCode: 404,
    code: "ASSGN_101",
    msg: "Assignment not found",
    description: "Expected a valid assignment",
    timestamp: new Date().toISOString(),
  },
  ASSGN_102: {
    statusCode: 400,
    code: "ASSGN_102",
    msg: "Invalid deadline",
    description: "Deadline has to be in the future",
    timestamp: new Date().toISOString(),
  },
  ASSGN_103: {
    statusCode: 400,
    code: "ASSGN_103",
    msg: "Invalid ID",
    description: "Expected a valid id",
    timestamp: new Date().toISOString(),
  },
  ASSGN_104: {
    statusCode: 400,
    code: "ASSGN_104",
    msg: "Invalid body",
    description: "Expected valid value for points",
    timestamp: new Date().toISOString(),
  },
  ASSGN_105: {
    statusCode: 400,
    code: "ASSGN_105",
    msg: "Invalid body",
    description: "Expected valid value for number of attempts",
    timestamp: new Date().toISOString(),
  },
  ASSGN_106: {
    statusCode: 400,
    code: "ASSGN_106",
    msg: "Invalid body",
    description: "Invalid assignment name",
    timestamp: new Date().toISOString(),
  },
  ASSGN_107: {
    statusCode: 400,
    code: "ASSGN_107",
    msg: "Submission limit exceeded",
    description: "Your submissions have reached the maximum limit",
    timestamp: new Date().toISOString(),
  },
  ASSGN_108: {
    statusCode: 400,
    code: "ASSGN_108",
    msg: "Invalid submission URL",
    description: "Enter a valid submission URL",
    timestamp: new Date().toISOString(),
  },
};

class AssignmentErrorHandler extends Error {
  constructor(errorCode) {
    const { statusCode, msg, description } = assignmentError[errorCode];
    super(msg);
    this.statusCode = statusCode;
    this.msg = msg;
    this.description = description;
  }
}

module.exports = AssignmentErrorHandler;
