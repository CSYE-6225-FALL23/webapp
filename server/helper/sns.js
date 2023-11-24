const AWS = require("aws-sdk");

const region = process.env.SNS_REGION;
const topicArn = process.env.SNS_TOPIC_ARN;

// Create an SNS client
const sns = new AWS.SNS({ region });

// Publish the message to the SNS topic
exports.publishSubmissionMessage = async (message) => {
  try {
    const data = await sns
      .publish({ Message: JSON.stringify(message), TopicArn: topicArn })
      .promise();
    return { status: "success", messageId: data.MessageId };
  } catch (err) {
    throw new Error("Failed to public topic");
  }
};
