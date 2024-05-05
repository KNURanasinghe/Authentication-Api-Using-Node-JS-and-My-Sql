// emailService.js

const nodemailer = require('nodemailer');
const mysql = require('mysql');

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.MAIL_DB
});

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.MY_MAIL,
        pass: process.env.APP_PASSWORD
    }
});

function getEmailsFromQueue(callback) {
    const query = 'SELECT * FROM email_queue';
    db.query(query, (error, results) => {
        if (error) {
            console.error('Error fetching emails from queue:', error);
            callback(error, null);
            return;
        }
        callback(null, results);
    });
}

function sendMail(recipientEmail, subject, content, callback) {
    const mailOptions = {
        from: process.env.MY_MAIL,
        to: recipientEmail,
        subject: subject,
        text: content
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            callback(error, null);
        } else {
            console.log('Email sent:', info.response);
            callback(null, info);
        }
    });
}

module.exports = {
    getEmailsFromQueue,
    sendMail
};
