const express = require('express')
const bodyParser = require('body-parser');
const app = express()
const cors = require('cors');
const port = 3001
const morgan = require('morgan');
const { BatchService, AccountsService } = require('./contract');
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.get('/', (req, res) => res.send('Hello World!'))

// creates a new ethereum account, seeds the account with some money and creates the wallet - response provides the seed phrase that will be used to make future transactions
app.post('/account', function (req, res, next) {
  console.log('Trying to create account');
  new AccountsService()
    .add()
    .then(result => {
      console.log('Account created');
      res.json(result);
      res.end();
    })
    .catch(reason => {
      console.log(reason);
      res.sendStatus(500);
    });
})

app.post('/batch', function (req, res, next) {
  const accounts$ = new AccountsService();
  const batch$ = new BatchService(accounts$);
  
  const { seedPhrase, batchInfo } = req.body;
  console.log(batchInfo);
  batch$
    .create(seedPhrase, batchInfo)
    .then(result => {
      res.json(result);
      res.end();
    })
    .catch(reason => {
      console.log(reason);
      res.sendStatus(500);
    });
});

app.post('/batch/:batchId/transfer', function (req, res, next) {
  const accounts$ = new AccountsService();
  const batch$ = new BatchService(accounts$);
  const { seedPhrase, to } = req.body;
  batch$
    .transfer(seedPhrase, req.params.batchId, to)
    .then(result => {
      res.json(result);
      res.end();
    })
    .catch(reason => {
      console.log(reason);
      res.sendStatus(500);
    });
});

app.get('/batch/:batchId', function (req, res, next) {
  new BatchService().
    getBatch(req.params.batchId)
    .then(result => {
      res.json(result);
      res.end();
    })
    .catch(reason => {
      console.log(reason);
      res.sendStatus(500);
    });
});

app.get('/logs', function (req, res, next) {
  new BatchService().
    getLogs()
    .then(result => {
      result.get(((err, logs) => {
        res.json(logs);
        res.end();
      }))


    })
    .catch(reason => {
      console.log(reason);
      res.sendStatus(500);
    });
});

app.get('/batch/:batchId/checkOwner/:ownerAddress', function (req, res, next) {
  new BatchService().
    checkOwner(req.params.batchId, req.params.ownerAddress)
    .then(result => {
      res.json(result);
      res.end();
    })
    .catch(reason => {
      console.log(reason);
      res.sendStatus(500);
    });
});

app.listen(port, () => console.log(`Dapp listening on port ${port}!`))
