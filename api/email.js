const PORT = process.env.PORT || 8080;
const path = require("path");
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
        user: process.env.EMAIL_LOGIN,
        pass: process.env.EMAIL_PASS
    }
});

// Data

var prizeCounter = {};
fs.readFile('database/prize_counter.json', 'utf8', (err, data) => {
    // if (err) return counter = { value: 0 };
    prizeCounter = JSON.parse(data)
});

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

    /*
    console.log('!!!!!!!!!');
    console.log(
        textTemplates[req.query.id].map(
            (row, ind, arr) => {                        
                return `
                        <tr>
                         <td style="border-collapse: collapse;border: 0;margin: 0;padding: 0;-webkit-text-size-adjust: none;color: #141414;font-family: Arial, sans-serif;font-size: 16px;line-height: 26px;">
                            ${row}
                         </td>
                        </tr>
                 `
        })
    )
    console.log('!!!!!!!!!');
    */
    // send message TO USER
    const attachFileForId = ['002','004','006','008'];
    var fileName002add = 'Vash_nastoyaschii_774_znak_zodiaka.pdf';
    var filePath002add = path.join(__dirname, '../files/Vash_nastoyaschii_774_znak_zodiaka.pdf');
    var fileName002 = '91A5B3DB-1830-43BD-96AE-AC10143247DF.pdf';
    var filePath002 = path.join(__dirname, '../files/91A5B3DB-1830-43BD-96AE-AC10143247DF.pdf');
    var fileName004 = 'Znaki_ot_Vselennoi_774_pdf.pdf';
    var filePath004 = path.join(__dirname, '../files/Znaki_ot_Vselennoi_774_pdf.pdf');
    var fileName006 = 'Denezhnaya_sfera.pdf';
    var filePath006 = path.join(__dirname, '../files/Denezhnaya_sfera.pdf');
    var fileName008 = '501577A0-7DF9-4244-8EF2-88804E87D96D.pdf';
    var filePath008 = path.join(__dirname, '../files/501577A0-7DF9-4244-8EF2-88804E87D96D.pdf');
    
    const messageUser = {
        from: process.env.EMAIL_LOGIN, // Sender address
        to: `${req.query.email}`, // List of recipients
        subject: 'shop.astrologdemidova.ru | Колесо фортуны',
        headers: {
            'x-postmaster-msgtype': `msg user ${req.query.id}`,
            'X-Mailru-Msgtype': `msgtype user`,
        },
        html: `
        <body>
            <table align="center">
                <tr>
                    <td style="border-collapse: collapse;border: 0;margin: 0;padding: 0;-webkit-text-size-adjust: none;color: #555559;font-family: Arial, sans-serif;font-size: 16px;line-height: 26px;text-align: center;">
                        <span>Вы получили это письмо по причине: </span><br>
                        <span>
                            вы сделали заказ на сайте 
                        </span>
                        <a href="https://shop.astrologdemidova.ru" target="_blank">shop.astrologdemidova.ru</a>
                    </td>
                </tr>
                <tr>
                    <td style="border-collapse: collapse;border: 0;margin: 0;padding: 20px 0;">
                        <table>
                                ${
                                    textTemplates[req.query.id].map((row) => {
                                        return `
                                            <tr>
                                                <td style="border-collapse: collapse;border: 0;margin: 0;padding: 0;-webkit-text-size-adjust: none;color: #141414;font-family: Arial, sans-serif;font-size: 16px;line-height: 26px;">
                                                    ${row}
                                                </td>
                                            </tr>
                                        `
                                    })
                                }
                        </table>
                    </td>
                </tr>
                <tr>
                    <td style="border-collapse: collapse;border: 0;margin: 0;padding: 0;">
                        <footer>
                            <table align="center">
                                <tr>
                                    <td style="border-collapse: collapse;border: 0;margin: 0;padding: 0;text-align: center;">
                                        <span>Астролог Демидова Яна | astrologdemidova@mail.ru</span>
                                    </td>
                                </tr>
                            </table>
                            <table align="center">
                                <tr>
                                    <td style="border-collapse: collapse;border: 0;margin: 0;padding: 0;text-align: center;">
                                        <span>ооо «егер»</span>
                                    </td>
                                </tr>
                            </table>
                        </footer>
                    </td>
                </tr>
            </table>
        </body>
        `,
        attachments: attachFileForId.includes(req.query.id) && req.query.id === '002' ?
        [
            {
                filename:
                    req.query.id === '002' ? fileName002 :
                        req.query.id === '004' ? fileName004 :
                            req.query.id === '006' ? fileName006 :
                                req.query.id === '008' ? fileName008 : '',
                path:
                    req.query.id === '002' ? filePath002 :
                        req.query.id === '004' ? filePath004 :
                            req.query.id === '006' ? filePath006 :
                                req.query.id === '008' ? filePath008 : '',
            },
            {
                filename:
                    req.query.id === '002' ? fileName002add : '',
                path:
                    req.query.id === '002' ? filePath002add : '',
            },
        ] :
        attachFileForId.includes(req.query.id) ? [
            {
                filename:
                    req.query.id === '002' ? fileName002 :
                        req.query.id === '004' ? fileName004 :
                            req.query.id === '006' ? fileName006 :
                                req.query.id === '008' ? fileName008 : '',
                path:
                    req.query.id === '002' ? filePath002 :
                        req.query.id === '004' ? filePath004 :
                            req.query.id === '006' ? filePath006 :
                                req.query.id === '008' ? filePath008 : '',
            },
        ] : null,
    };
    
    const messageLog = {
        from: process.env.EMAIL_LOGIN, // Sender address
        to: `${process.env.EMAIL_LOGIN}`, // List of recipients
        subject: `${req.query.email} ${req.query.id} | Колесо фортуны`,
        headers: {
            'x-postmaster-msgtype': `msg cstmr`,
            'X-Mailru-Msgtype': `msgtype log`,
        },
        html: `
        <body>
            <table align="center">
                <tr>
                    <td style="border-collapse: collapse;border: 0;margin: 0;padding: 0;-webkit-text-size-adjust: none;color: #555559;font-family: Arial, sans-serif;font-size: 16px;line-height: 26px;text-align: center;">
                        <span>Вы получили это письмо по причине: </span><br>
                        <span>
                            вы сделали заказ на сайте 
                        </span>
                        <a href="https://astrologdemidova.ru" target="_blank">astrologdemidova.ru</a>
                    </td>
                </tr>
                <tr>
                    <td style="border-collapse: collapse;border: 0;margin: 0;padding: 20px 0;">
                        <table>
                                ${
                                    textTemplates[req.query.id].map((row) => {
                                        return `
                                            <tr>
                                                <td style="border-collapse: collapse;border: 0;margin: 0;padding: 0;-webkit-text-size-adjust: none;color: #141414;font-family: Arial, sans-serif;font-size: 16px;line-height: 26px;">
                                                    ${row}
                                                </td>
                                            </tr>
                                        `
                                    })
                                }
                        </table>
                    </td>
                </tr>
                <tr>
                    <td style="border-collapse: collapse;border: 0;margin: 0;padding: 0;">
                        <footer>
                            <table align="center">
                                <tr>
                                    <td style="border-collapse: collapse;border: 0;margin: 0;padding: 0;text-align: center;">
                                        <span>Астролог Демидова Яна | astrologdemidova@mail.ru</span>
                                    </td>
                                </tr>
                            </table>
                            <table align="center">
                                <tr>
                                    <td style="border-collapse: collapse;border: 0;margin: 0;padding: 0;text-align: center;">
                                        <span>ооо «егер»</span>
                                    </td>
                                </tr>
                            </table>
                        </footer>
                    </td>
                </tr>
            </table>
        </body>
        `,
    };


    transport.sendMail(messageUser, function (err, info) {
        if (err) {
            console.log(err)
        } else {
            console.log(`___ ${req.query.id} ${req.query.email} ___ `);
            console.log(info);
            //!!!!! danger
            const git = require('simple-git');
                git()
                    .add('database/user_contact.json')
                    .commit("commit database/user_contact.json!")
                    .push('origin', 'main')
                    .then((i) => console.log('!***push', i))
                    .catch((err) => console.error('!***failed: ', err));
            //!!!!!end danger
        }
    });
    
    transport.sendMail(messageLog, function (err, info) {
        if (err) {
            console.log(err)
        } else {
            console.log(info);
        }
    });

    // send message TO CUSTOMER
    var dateFormatHelper = new Date(Date.now());
    var dateFormat = dateFormatHelper.toUTCString()

    const messageCustomer = {
        from: process.env.EMAIL_LOGIN, // Sender address
        to: `${process.env.SEND_COPY_EMAIL}, astrolog.demidova@gmail.com`, // List of recipients
        subject: 'shop.astrologdemidova.ru | Колесо фортуны',
        headers: {
            'x-postmaster-msgtype': `msg cstmr super`,
            'X-Mailru-Msgtype': `msgtype cstmr super`,
        },
        html: `
        <body>
            <table>
                <tr>
                    <td>Новый выигрыш от "Колесо фортуны"</td>
                </tr>
            </table>
            <table>
                <tr>
                    <th>Время выигрыша</th>
                </tr>
                <tr>
                    <td>${dateFormat}</td>
                </tr>
            </table>
            <table>
                <tr>
                    <th>Приз</th>
                </tr>
                <tr>
                    <td>${req.query.id}</td>
                </tr>
            </table>
            <table>
                <tr>
                    <th>Имя</th>
                </tr>
                <tr>
                    <td>${req.query.name}</td>
                </tr>
            </table>
            <table>
                <tr>
                    <th>Номер</th>
                </tr>
                <tr>
                    <td>${req.query.phone}</td>
                </tr>
            </table>
            <table>
                <tr>
                    <th>Почта</th>
                </tr>
                <tr>
                    <td>${req.query.email}</td>
                </tr>
            </table>
            <table>
                <tr>
                    <th>Инстаграм</th>
                </tr>
                <tr>
                    <td>${req.query.inst}</td>
                </tr>
            </table>
            <table>
                <tr>
                    <th>Адресс</th>
                </tr>
                <tr>
                    <td>${req.query.adress}</td>
                </tr>
            </table>
            <table>
                <tr>
                    <td><b>А ниже копия письма для юзера:</b></td>
                </tr>
            </table>
            <table>
                ${textTemplates[req.query.id].map((row) => {
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

/** POST /api/email/check-user-contact */
console.log(`##email http://localhost:${PORT}/api/email/check-user-contact`);
exports.toCheckUserContact = (req, res) => {
    const messageUser = {
        from: process.env.EMAIL_LOGIN, // Sender address
        to: `${process.env.EMAIL_LOGIN}`, // List of recipients
        subject: 'shop.astrologdemidova.ru | Перешли на оплату',
        headers: {
            'x-postmaster-msgtype': `msg check user`,
        },
        html: `
        <body>
            <p>${Date.now()}</p>
            <p>${req.query.email}</p>
            <p>${req.query.phone}</p>
        </body>
        `,
    };


    transport.sendMail(messageUser, function (err, info) {
        if (err) {
            console.log(err)
        } else {
            console.log(info);
        }
    });

    


};
