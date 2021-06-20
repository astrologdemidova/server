const PORT = process.env.PORT || 8080;

// Data

// Api

/** GET /api/fortuna/get-wheel-item */
console.log(`##fortuna http://localhost:${PORT}/api/fortuna/get-wheel-item`);
exports.toGetWheelItem = (req, res) => {
    const avilablePrize = [
        '002',
        '004',
        '006',
        '008',
    ];

    const getRandomInt = (max) => {
        return Math.floor(Math.random() * max);
    };

    const resultRandom = avilablePrize[getRandomInt(avilablePrize.length)];

    res.status(200).send(resultRandom);
};
