const BC_MAIN_NODE_ENDPOINT = 'http://localhost:8545';
const Web3 = require('web3');
const bip39 = require('bip39')
const Goods = require('./build/contracts/Goods.json');
const contract = require('truffle-contract');
const web3 = new Web3(new Web3.providers.HttpProvider(BC_MAIN_NODE_ENDPOINT));
const HDWalletProvider = require("truffle-hdwallet-provider");
const goodsInstance = contract(Goods);

generateSeed = () => {
    return bip39.generateMnemonic();
}

addAccount = () => {
    return new Promise((resolve, reject) => {
        let newUserAddress;
        let seed = generateSeed();
        console.log("Seed", seed);
        let provider = new HDWalletProvider(seed, BC_MAIN_NODE_ENDPOINT, 1);
        web3.setProvider(provider); // Check with team about reusing instances between web3 provider and hd wallet provider
        web3.eth.getAccounts((error, accounts) => {
            newUserAddress = accounts[0];
            console.log("NEW USER ADD", newUserAddress);
            web3.setProvider(new Web3.providers.HttpProvider(BC_MAIN_NODE_ENDPOINT));
            web3.eth.getAccounts((error, accounts) => {
                console.log("ROOT USER", accounts[0]);
                const rootAccountPass = 'testpassword'; // needs to be configured
                web3.eth.personal.unlockAccount(accounts[0], rootAccountPass, 1000).then(() => {
                    web3.eth.sendTransaction({ from: accounts[0], to: newUserAddress, value: web3.utils.toWei("1") })
                        .then(() => {
                            console.log(`Finished sending money to the new user: ${newUserAddress}`);
                            web3.eth.getBalance(newUserAddress)
                                .then(bal => {
                                    console.log(`The new user's balance is: ${bal}`);
                                    if (bal > 0) {
                                        resolve([newUserAddress, seed]);
                                    } else {
                                        reject(new Error(`The balance of the newly added account: ${newUserAddress} is ${bal}`));
                                    }
                                });
                        })
                })
                    .catch(err => {
                        console.log(err);
                        reject(new Error("Problem adding an account"));
                    })
            });
        });
    });
};

createBatch = (seedPhrase, batchInfo) => {
    var provider = new HDWalletProvider(seedPhrase, BC_MAIN_NODE_ENDPOINT, 1);
    web3.setProvider(provider);
    goodsInstance.setProvider(provider);
    const params = [batchInfo.name, batchInfo.uuid, batchInfo.manafacturerName];
    var configs = {};
    configs.gas = 470000;
    configs.gasPrice = 1;
    return web3.eth.getAccounts().then((accounts) => {
        userAddress = accounts[0].toLowerCase();
        return goodsInstance.deployed()
            .then((instance) => {
                configs.from = userAddress; // can be fetched from web3.eth.getAccounts.
                return instance["createBatch"](...params, configs);
            }).then((result) => {
                console.log(result)
                return result;
            })
    });
}

getBatch = (batchId) => {
    const params = [batchId];
    return goodsInstance.deployed()
        .then((instance) => {
            console.log("GetBatch By ID", params)
            return instance["getBatchById"](...params);
        }).then((result) => {
            console.log(result)
            return result;
        })

}


module.exports = {
    addAccount: addAccount,
    createBatch: createBatch,
    getBatch: getBatch

};
