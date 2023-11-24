const { DataTypes } = require("sequelize");
const Connection = require("../client/connection");

const Submission = Connection.sequelize.define("Submission", {
    id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    assignment_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    submission_url: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    submission_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    submission_updated: {
        type: DataTypes.DATE,
    },
    attempts: {
        type: DataTypes.INTEGER
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
    }
});

module.exports = Submission;
