const BC_MAIN_NODE_ENDPOINT = 'http://localhost:8545';
const Web3 = require('web3');
const bip39 = require('bip39')
const Goods = require('./build/contracts/Goods.json');
const contract = require('truffle-contract');
const HDWalletProvider = require("truffle-hdwallet-provider");

class AccountsService {
  _generateSeed() {
    return bip39.generateMnemonic();
  }

  _initialize(wei, to) {
    const provider = new Web3.providers.HttpProvider(BC_MAIN_NODE_ENDPOINT);
    const web3 = new Web3(provider);
    const { utils: { toWei }, eth } = web3;
    const { sendTransaction, personal: { unlockAccount} } = eth;
    const value = toWei(wei.toString());
    return this.getAccount(provider)
      .then(from =>
        unlockAccount(from, 'testpassword', 1000)
          .then(() => sendTransaction({ from, to, value })));
  }

  getAccount(provider) {
    return new Web3(provider)
      .eth
      .getAccounts()
      .then(accounts => accounts[0].toLowerCase());
  }

  add() {
    const seed = this._generateSeed();
    const provider = new HDWalletProvider(seed, BC_MAIN_NODE_ENDPOINT, 1);
    return this.getAccount(provider)
      .then(to => this._initialize(1, to).then(() => ({ to, seed })));
  }
}

class BatchService {
  constructor(accounts$, gas = 470000, gasPrice = 1) {
    this.accounts$ = accounts$;
    this._default_configuration = { gas, gasPrice };
  }

  _configuration(provider) {
    return this.accounts$
      .getAccount(provider)
      .then(from => ({ ...this._default_configuration, from }));
  }

  _goods(provider) {
    const goods = contract(Goods);
    goods.setProvider(provider);
    if (typeof goods.currentProvider.sendAsync !== "function") {
      goods.currentProvider.sendAsync = function () {
        return goods.currentProvider.send.apply(
          goods.currentProvider, arguments
          );
      };
    }
    return goods.deployed();
  }

  create(seed, { name, uuid, manufacturerName }) {
    const provider = new HDWalletProvider(seed, BC_MAIN_NODE_ENDPOINT, 1);
    return Promise
      .all([this._goods(provider), this._configuration(provider)])
      .then(([goods, configuration]) => 
        goods.createBatch(name, uuid, manufacturerName, configuration));
  }

  transfer(seed, batchId, to) {
    const provider = new HDWalletProvider(seed, BC_MAIN_NODE_ENDPOINT, 1);
    return Promise
      .all([this._goods(provider), this._configuration(provider)])
      .then(([goods, configuration]) =>
        goods.transferBatch(to, batchId, configuration));
  }

  getBatch(id) {
    const provider = new Web3.providers.HttpProvider(BC_MAIN_NODE_ENDPOINT);
    return this._goods(provider)
      .then(goods => goods.getBatchById(id));
  }

  checkOwner(id, ownerAddress) {
    const provider = new Web3.providers.HttpProvider(BC_MAIN_NODE_ENDPOINT);
    return this._goods(provider)
      .then(goods => goods.isCurrentOwnerOf(ownerAddress, id));
  }
}

module.exports = {
  BatchService,
  AccountsService
};
