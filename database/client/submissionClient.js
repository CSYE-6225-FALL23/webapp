// Import custom files
const Assignment = require("../models/assignment");
const Submission = require("../models/submission");
const { sequelize } = require("./connection");

class SubmissionClient {
    constructor() {
        this.filename = "assignmentClient.js";
    }
    /**
     * Create Assignment
     *
     * @param {Object} req - Request Object
     * @param {Object} res - Response Object
     * @returns {Object} Assignment Object
     */
    createSubmission = async (payload, assignment_id) => {
        let date = new Date()
        try {
            const { submission_url } = payload;
            const assignment = await Submission.create({
                submission_url: submission_url,
                attempts: 1,
                assignment_id: assignment_id,
                submission_date: date.toISOString(),
            });
            return assignment.toJSON();
        } catch (error) {
            throw error;
        }
    };

    updateSubmission = async (submission, submissionId) => {
        try {
            const [updatedRows, updatedSubmission] = await Submission.update(
                {
                    ...submission,
                    attempts: sequelize.literal('attempts + 1'),
                    submission_updated: new Date().toISOString(),
                },
                {
                    where: { id: submissionId },
                    fields: [
                        "submission_url",
                        "attempts",
                        "submission_updated",
                    ],
                    returning: true,
                },
            );
            return updatedSubmission[0]['dataValues'];
        } catch (error) {
            throw error;
        }
    };

    getSubmissionsByID = async (assignmentId) => {
        try {
            const submission = await Submission.findOne({
                where: { assignment_id: assignmentId }
            });
            if (submission) return submission.toJSON();
            else return {};
        } catch (error) {
            throw error;
        }
    };
}

module.exports = SubmissionClient;
