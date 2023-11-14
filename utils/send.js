var nodemailer = require('nodemailer');
const send = (option) => {
    const transport = nodemailer.createTransport({
      host: process.env.HOST,
      port: process.env.PORT,
      auth: {
        user: process.env.USERNAME,
        pass: process.env.MAILTRAP_PASSWORD
      }
    });

    var mailOptions = {
      from: 'test@gmail.com',
      to: 'user1@example.com, user2@example.com',
      subject: 'Nice Nodemailer test',
      text: 'Hey there, it’s our first message sent with Nodemailer ',
      html: '<b>Hey there! </b><br> This is our first message sent with Nodemailer<br />',
    };

}    


module.exports = send