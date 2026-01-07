const dotenv = require("dotenv");
const { Resend } = require("resend");
const ENV = require("./env");

dotenv.config();

exports.resendClient = new Resend(ENV.RESEND_API_KEY);

exports.sender = {
    email: ENV.EMAIL_FROM,
    name: ENV.EMAIL_FROM_NAME,
};
