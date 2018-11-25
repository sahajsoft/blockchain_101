const express = require('express')
const app = express()
const port = 3010
const contract = require('./contract');

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
            "address": addressResult,
            "seed": seedResult
          });
      })
      .catch((err) => {
        res.json(err);
        res.end();
      })
  })

app.listen(port, () => console.log(`Dapp listening on port ${port}!`))