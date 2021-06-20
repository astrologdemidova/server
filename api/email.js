const PORT = process.env.PORT || 8080;
const fs = require('fs');
const { nanoid } = require('nanoid');
const nodemailer = require('nodemailer');
const { textTemplates } = require('./helpers/textTemplates');

/*

Nodemailer api

*/
let transport = nodemailer.createTransport({
    //host: 'smtp.gmail.com',
    host: 'smtp.jino.ru',
    port: 465,
    auth: {
        // user: process.env.EMAIL_LOGIN,
        // pass: process.env.EMAIL_PASS
        user: 'email@astrologdemidova.ru',
        pass: '5fpM5Xyfg'
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
    const notificationIdPrize = ['001', '003', '005', '007', '009', '010'];

    const mapUserData = {
        name: req.query.name,
        email: req.query.email,
        phone: req.query.phone,
        inst: req.query.inst,
        adress: req.query.adress,
        idPrize: req.query.id,
    };
    userContact.push({ ...getInfoData(), ...mapUserData });
    var json = JSON.stringify(userContact);

    fs.writeFile('database/user_contact.json', json, 'utf8', (err) => {
        if (err) throw err;
        res.status(200).send(`success`);
    });

    // send message TO USER
    const messageUser = {
        //from: process.env.EMAIL_LOGIN, // Sender address
        from: 'email@astrologdemidova.ru', // Sender address
        to: `${req.query.email}`, // List of recipients
        subject: 'shop.astrologdemidova.ru | Колесо фортуны',
        html: `
        <body>
            <table>
                ${
                    textTemplates[req.query.id].map((row) => {
                        return `<tr><td>${row}</td></tr>`
                    })
                }
            </table>
        </body>
        `,
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


    transport.sendMail(messageUser, function (err, info) {
        if (err) {
            console.log(err)
        } else {
            console.log(info);
        }
    });

    // send message TO CUSTOMER
    const messageCustomer = {
        //from: process.env.EMAIL_LOGIN, // Sender address
        from: 'email@astrologdemidova.ru', // Sender address
        to: `${process.env.EMAIL_LOGIN}`, // List of recipients
        subject: 'shop.astrologdemidova.ru | Колесо фортуны',
        html: `
        <body>
            <table>
                <tr>
                    <td>Новый выигрыш от "Колесо фортуны"</td>
                </tr>
            </table>
            <table>
                <tr>
                    <th>Приз</th>
                    <th>Имя</th>
                    <th>Номер</th>
                </tr>
                <tr>
                    <td>${req.query.id}</td>
                    <td>${req.query.name}</td>
                    <td>${req.query.phone}</td>
                </tr>
            </table>
            <table>
                <tr>
                    <th>Почта</th>
                    <th>Инстаграм</th>
                    <th>Адресс</th>
                </tr>
                <tr>
                    <td>${req.query.email}</td>
                    <td>${req.query.inst}</td>
                    <td>${req.query.adress}</td>
                </tr>
            </table>
            <table>
                <tr>
                    <td><b>А ниже копия письма для юзера:</b></td>
                </tr>
            </table>
            <table>
                ${
                    textTemplates[req.query.id].map((row) => {
                        return `<tr><td>${row}</td></tr>`
                    })
                }
            </table>
        </body>
        `,
    };

    if (notificationIdPrize.includes(req.query.id)) { // send only for notificationIdPrize
        transport.sendMail(messageCustomer, function (err, info) {
            if (err) {
                console.log(err)
            } else {
                console.log(info);
            }
        });
    }
};


/** GET /api/email/read-user-contact */
console.log(`##email http://localhost:${PORT}/api/email/read-user-contact`);
exports.toReadUserContact = (req, res) => {

    res.status(200).send(userContact);

};
