const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

module.exports.createJwtToken = async function (id, email) {
    const token = await jwt.sign({
        id: id,
        email: email
    }, process.env.SECRET, {
        expiresIn: process.env.JWT_EXPIRY
    })

    return token;
}

module.exports.sendEmail = async function (email, subject, text, html) {
    //USE MAIL TRAP INSTEAD OF GMAIL
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: "smtp.gmail.com",
        port: 465, //or 587
        secure: true,
        auth: {
            user: process.env.USER,         //SENDER GMAIL ADDRESS
            pass: process.env.APP_PASSWORD //APP PASS FROM GMAIL ACCOUNT
        },
    });

    const mailOptions = {
        from: {
            name: 'Manveer Singh',
            address: process.env.USER
        }, //SENDER GMAIL ADDRESS
        to: email, // list of receivers
        subject: subject, // Subject line
        text: text, // plain text body
        html: html, // html body
        contentType: 'application/json',
    };

    const sendMail = async (transporter, mailOptions) => {
        try {
            await transporter.sendMail(mailOptions);
            console.log('Email has been sent')
            return true;
        } catch (err) {
            console.log(err);
            return false;
        }
    }

    const emailSent = await sendMail(transporter, mailOptions);
    return emailSent;
}