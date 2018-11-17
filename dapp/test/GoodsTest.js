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

    it('should create a new batch of goods', async () => {
        await goodsInstance.createBatch("Batch1","ABC", "Merck");
        const goods = await goodsInstance.getBatchById('ABC');
        assert.ok(goods);
        assert.equal(goods[0], 'Batch1');
    });

    it('should not create new batch with existing batch ids', async () => {});

})