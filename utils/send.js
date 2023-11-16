var nodemailer = require('nodemailer');

const sendMail = async (options) => {
  // CREATE A TRANSPORTER
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      auth: {
        user: process.env.MAIL_NAME,
        pass: process.env.MAIL_PASSWORD
      }
    });
    console.log(process.env.MAIL_PASSWORD)

    const mailOptions = {
      from: "DexFlix support<support@dexflix.com>",
      to: options.email,
      subject: options.subject,
      text: options.text,
    };
    await transporter.sendMail(mailOptions)
}    


module.exports = sendMail