const PORT = process.env.PORT || 8080;
const fs = require('fs');

// Data

var prizeCounter = {};
fs.readFile('database/prize_counter.json', 'utf8', (err, data) => {
    prizeCounter = JSON.parse(data)
});

// Api

/** GET /api/fortuna/get-wheel-item */
console.log(`##fortuna http://localhost:${PORT}/api/fortuna/get-wheel-item`);
exports.toGetWheelItem = (req, res) => {
    const recordPrize = [
        '001',
        '003',
        '005',
        '007',
        '009',
        '010',
    ];
    
    const avilablePrize = [
        '002',
        '004',
        '006',
        '008',
        '010',
    ];
    
    

    const getRandomInt = (max) => {
        var result = Math.floor(Math.random() * max);
        var checkNum = avilablePrize[result];

        if (recordPrize.includes(checkNum)) {
            if (prizeCounter[checkNum].counter === prizeCounter[checkNum].limit) {
                return getRandomInt(avilablePrize.length);
            }

            prizeCounter[checkNum].counter = prizeCounter[checkNum].counter + 1;

            var json = JSON.stringify(prizeCounter);

            fs.writeFile('database/prize_counter.json', json, 'utf8', (err) => {
                if (err) throw err;
                const git = require('simple-git');
                git()
                    .add('database/prize_counter.json')
                    .commit("commit database/prize_counter.json!")
                    .push('origin', 'main')
                    .then((i) => console.log('!***push', i))
                    .catch((err) => console.error('!***failed: ', err));
            });
        }

        return result;
    };

    let resultRandom = avilablePrize[getRandomInt(avilablePrize.length)];

    res.status(200).send(resultRandom);
};
