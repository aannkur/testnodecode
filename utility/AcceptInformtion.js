
const nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var handlebars = require('handlebars');
const hbs = require('nodemailer-handlebars');
var fs = require('fs');
var path = require('path')

module.exports = {
    sendStatus: async (input) => {
        console.log(input)
        const transporter = nodemailer.createTransport({
            port: 465,
            host: "smtp.gmail.com",
            auth: {
                user: 'si3010280@gmail.com',
                pass: 'lhxunszxjfqwyyrm',
            },
            secure: true, 
        });

        transporter.use('compile', hbs({
            viewEngine: {
                defaultLayout: false
            },
            viewPath: './views'
        }));
       
       
        console.log("init")
        const mailData = {
            from: 'Influncers<si3010280@gmail.com>',
            to: input.email,
            subject: "Gigs Interest",
            text: "text",
            html: `Your Gigs Request has been ${input.Status}`
           
        };
        console.log('medium')
        transporter.sendMail(mailData, (error, info) => {
            if (error) {
                return console.log(error);
            }
            consoole.log('sendmail')
            res.status(200).send({ message: "Mail send" });
        });
    }


}