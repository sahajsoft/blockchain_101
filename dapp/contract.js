const BC_MAIN_NODE_ENDPOINT = 'http://localhost:8545';
const Web3 = require('web3');
const bip39 = require('bip39')
const web3 = new Web3(new Web3.providers.HttpProvider(BC_MAIN_NODE_ENDPOINT));
const HDWalletProvider = require("truffle-hdwallet-provider");

generateSeed = () => {
    return bip39.generateMnemonic();
}

addAccount = () => {
    return new Promise((resolve, reject) => {
        let newUserAddress;
        let seed = generateSeed();
        console.log("Seed", seed);
        let provider = new HDWalletProvider(seed, BC_MAIN_NODE_ENDPOINT);
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


module.exports = {
    addAccount: addAccount,
};
