const PORT = process.env.PORT || 8080;
const fs = require('fs');
const { nanoid } = require('nanoid');
const nodemailer = require('nodemailer');

/*

Nodemailer api

*/
let transport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_LOGIN,
        pass: process.env.EMAIL_PASS
    }
});

// Data

var userContact = [];
fs.readFile('database/user_contact.json', 'utf8', (err, data) => {
    if (err) return;
    userContact = JSON.parse(data);
});

const getInfoData = () => {
    const date = Date.now()
    return {
        id: nanoid(8),
        createDate: date,
        isNew: true,
        isRead: false,
        description: ''
    }
}


/********** Api ***********/

/** POST /api/email/add-user-contact */
console.log(`##email http://localhost:${PORT}/api/email/add-user-contact`);
exports.toAddUserContact = (req, res) => {
    const mapUserData = {
        name: req.query.name,
        email: req.query.email,
        phone: req.query.phone,
        inst: req.query.inst,
    };
    userContact.push({ ...getInfoData(), ...mapUserData });
    var json = JSON.stringify(userContact);

    fs.writeFile('database/user_contact.json', json, 'utf8', (err) => {
        if (err) throw err;
        res.status(200).send(`success`);
    });

    // send message to user
    const message = {
        from: process.env.EMAIL_LOGIN, // Sender address
        to: req.query.email,         // List of recipients
        subject: 'shop.astrologdemidova.ru | Колесо фортуны',
        html: 'This <i>message</i> with <strong>attachments</strong>.',
        // attachments: [
        //     {
        //         filename: 'greetings.txt',
        //         path: '/assets/files/'
        //     },
        //     {
        //         filename: 'greetings.txt',
        //         content: 'Message from file.',
        //     },
        // ]
    };


    transport.sendMail(message, function (err, info) {
        if (err) {
            console.log(err)
        } else {
            console.log(info);
        }
    });
};


/** GET /api/email/read-user-contact */
console.log(`##email http://localhost:${PORT}/api/email/read-user-contact`);
exports.toReadUserContact = (req, res) => {

    res.status(200).send(userContact);

};
