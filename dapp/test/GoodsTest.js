const Goods = artifacts.require('./Goods.sol');
const assert = require('assert');

let goodsInstance;
before(async () => {
    goodsInstance = await Goods.deployed();
    console.log(goodsInstance.address);
});

contract('Goods', (accounts) => {

    var account_one = accounts[0];
    var account_two = accounts[1];

    it('should return hello', async () => {
        const output = await goodsInstance.getHello.call();
        assert.equal(output, 'Hello from Goods');
    });

    it('should create a new batch of goods', async () => {
        await goodsInstance.createBatch("Batch1","ABC", "Merck",{from: account_one});
        const goods = await goodsInstance.getBatchById('ABC');
        assert.ok(goods);
        assert.equal(goods[0], 'Batch1');
        const isOwnerResultAcct1 = await goodsInstance.isCurrentOwnerOf(account_one,'ABC');
        assert.equal(isOwnerResultAcct1, true);
    });

    it('should not create new batch with existing batch ids', async () => {
        await goodsInstance.createBatch("Batch1","ABC", "Merck",{from: account_one});
        await goodsInstance.createBatch("Batch2","ABC", "Merck1",{from: account_one});
        // what to assert? Event check?
    });

    it('should transfer a batch of manafactured goods to another', async () => {
      await goodsInstance.createBatch("Batch2","BCD", "Merck",{from: account_one});
      const goods = await goodsInstance.getBatchById('BCD');
      assert.ok(goods);
      assert.equal(goods[0], 'Batch2');
      await goodsInstance.transferBatch(account_two, "BCD", {from:account_one});
      const isOwnerResultAcct1 = await goodsInstance.isCurrentOwnerOf(account_one,'BCD');
      const isOwnerResultAcct2 = await goodsInstance.isCurrentOwnerOf(account_two,'BCD');
      assert.equal(isOwnerResultAcct1, false);
      assert.equal(isOwnerResultAcct2, true);

    });

    it('should not transfer batch without createBatch step', async () => {
        await goodsInstance.transferBatch(account_two, "DEF", {from:account_one});
        //what to assert? Event check?
    });
})