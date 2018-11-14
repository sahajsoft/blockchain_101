const Goods = artifacts.require('./Goods.sol');
const assert = require('assert');

let goodsInstance;
before(async () => {
    goodsInstance = await Goods.deployed();
    console.log(goodsInstance.address);
});

contract('Goods', () => {

    it('should return hello', async () => {
        const output = await goodsInstance.getHello.call();
        assert.equal(output, 'Hello from Goods');
    });
})