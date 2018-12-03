const express = require('express')
const bodyParser = require('body-parser');
const app = express()
const port = 3010
const contract = require('./contract');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.get('/', (req, res) => res.send('Hello World!'))

// creates a new ethereum account, seeds the account with some money and creates the wallet - response provides the seed phrase that will be used to make future transactions
app.post('/account', function (req, res, next) {
    var addressResult, seedResult;
    contract.addAccount()
        .then(([result, seed]) => {
            addressResult = result.toLowerCase();
            seedResult = seed;
            console.log("POST ADDING ACCOUNT", addressResult);
            res.json({
                "User address": addressResult,
                "User seed phrase": seedResult
            });
        })
        .catch((err) => {
            res.json(err);
            res.end();
        })
})

app.post('/batch', function (req, res, next) {
    console.log(req.body);
    contract.createBatch(req.body.seedPhrase, req.body.batchInfo).then((result) =>  {
        res.json(result);
        res.end();
    }).catch ((err) => {
        res.json(err);
        res.end();
    })});

app.get('/batch/:batchId', function (req, res, next) {
        contract.getBatch(req.params.batchId).then((result)=>{
            res.json(result);
            res.end();
        }).catch (err => {
            res.json(err);
            res.end();
        }) 
    });

app.listen(port, () => console.log(`Dapp listening on port ${port}!`))