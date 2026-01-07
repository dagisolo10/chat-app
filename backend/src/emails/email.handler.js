const { createWelcomeEmailTemplate } = require("./email.template");
const { resendClient, sender } = require("../config/resend");

exports.sendWelcomeEmail = async (email, name, clientURL) => {
    const { data, error } = await resendClient.emails.send({
        from: `${sender.name} <${sender.email}>`, // ny name and email
        to: email, // receiver email
        subject: "Welcome to Chatify!",
        html: createWelcomeEmailTemplate(name, clientURL),
    });

    if (error) {
        console.error("Error sending welcome email:", error);
        throw new Error("Failed to send welcome email");
    }

    console.log("Welcome Email sent successfully", data);
};
