const Connection = require("./connection");
const User = require("../models/user");
const Assignment = require("../models/assignment");
const Submission = require("../models/submission");
const { DataTypes } = require("sequelize");

const sequelize = Connection.sequelize;

User.hasMany(Assignment);
Assignment.belongsTo(User, {
  foreignKey: {
    type: DataTypes.UUID,
    allowNull: false,
  },
});

Assignment.hasMany(Submission, { onDelete: 'CASCADE' });
Submission.belongsTo(Assignment);

const syncModels = async () => {
  try {
    // Test database connection
    await Connection.testConnection();

    // Synchronize models with the DB
    await sequelize.sync({ alter: true });
  } catch (error) {
    throw error;
  }
};

module.exports = syncModels;
