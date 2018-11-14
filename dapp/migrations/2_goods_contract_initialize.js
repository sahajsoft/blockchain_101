var Goods = artifacts.require("./Goods.sol");

module.exports = function(deployer) {
    deployer.deploy(Goods);
};
