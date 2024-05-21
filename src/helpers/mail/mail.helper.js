const nodemailer = require('nodemailer');

const config = {
    mail: process.env.MAIL,
    port: process.env.MAIL_PORT,
    pass: process.env.MAIL_PASSWORD,
    host: process.env.MAIL_HOST,
}

/**
 * @description Mail transporter
 * @type {Transporter}
 * @constant
 */
let transporter = nodemailer.createTransport({
    host: config.host,
    port: parseInt(config.port),
    secure: true,
    auth: {
        user: config.mail,
        pass: config.pass,
    }
});

/**
 * @description Send an email to the user
 * @param {String} to Email address
 * @param {String} subject Email subject
 * @param {String} body Email body
 */
const sendEmail = async (to, subject, body) => {
    // Setting mail options
    const mailOptions = {
        from: 'Booksment <norply@booksment.com.tr>',
        to: to,
        subject: subject,
        html: body
    };

    // Returning result
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
            return;
        }
    });
};

module.exports = sendEmail;