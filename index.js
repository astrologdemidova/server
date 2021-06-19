require("dotenv").config();
const express = require("express");
// const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const helmet = require("helmet"); // creates headers that protect from attacks (security)
const cors = require("cors");
// var fs = require('fs');
var test = require('./api/test.js');
var email = require('./api/email.js');
var fortuna = require('./api/fortuna.js');

module.exports = app;

const whitelist = [
    process.env.LOCALHOST_3000,
    process.env.LOCALHOST_8000,
    process.env.LOCALHOST_8080,
    process.env.ASTROLOG_DEVELOP,
    process.env.ASTROLOG_SHOP,
    process.env.ASTROLOG_MEDITATION
];

const corsOptions = {
    origin: function (origin, callback) {
        console.log("** Origin of request " + origin);
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            console.log("Origin acceptable");
            callback(null, true);
        } else {
            console.log("Origin rejected");
            callback(new Error("Not allowed by CORS"));
        }
    },
};
app.use(helmet());
app.use(cors(corsOptions));

const PORT = process.env.PORT || 8080;
app.listen(PORT, (req, res) => {
    console.log(`server listening on port: ${PORT}`);
});

// Test

app.get('/api/test/counter', test.testCounter);
app.get('/api/test/write-file', test.testWriteFile);

// Email

app.get('/api/email/read-user-contact', email.toReadUserContact);
// app.post('/api/email/send-template', email.toSendEmailTemplate);
app.post('/api/email/add-user-contact', email.toAddUserContact);

// Fortuna

app.get('/api/fortuna/get-wheel-item', fortuna.toGetWheelItem);
