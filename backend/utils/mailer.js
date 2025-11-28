const nodemailer = require("nodemailer");
const config = require("../config");
const logger = require("./logger");

let transporter;

const getTransporter = () => {
  if (transporter) {
    return transporter;
  }

  if (!config.mail?.enabled) {
    throw new Error("Email transport is not configured.");
  }

  transporter = nodemailer.createTransport({
    host: config.mail.smtp.host,
    port: config.mail.smtp.port,
    secure: config.mail.smtp.secure,
    auth: {
      user: config.mail.smtp.user,
      pass: config.mail.smtp.pass,
    },
  });

  return transporter;
};

const sendMail = async ({ to, subject, text, html }) => {
  if (!config.mail?.enabled) {
    throw new Error("Email transport is not configured.");
  }

  const transport = getTransporter();

  try {
    await transport.sendMail({
      from: config.mail.from,
      to,
      subject,
      text,
      html,
    });
  } catch (error) {
    logger.error("Mail delivery failed", { error });
    throw error;
  }
};

module.exports = { sendMail };
