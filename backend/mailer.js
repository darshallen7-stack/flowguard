const nodemailer = require('nodemailer');

// This uses your .env file for credentials
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

async function sendEmail({ to, subject, body }) {
  if (!process.env.SMTP_USER) {
    console.log(`[SIMULATED EMAIL] To: ${to} | Subject: ${subject}`);
    return { simulated: true };
  }

  const info = await transporter.sendMail({
    from: process.env.SMTP_USER,
    to,
    subject,
    text: body
  });

  return { messageId: info.messageId };
}

module.exports = { sendEmail };