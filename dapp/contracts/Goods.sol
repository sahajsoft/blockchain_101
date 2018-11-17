pragma solidity ^0.4.17;

contract Goods {
    
    function getHello() public returns(string) {
		return "Hello from Goods";
	}

    event BatchCreate(address sender, string uuid, string manufacturer);
    event BatchCreateError(address sender, string uuid, string message);
    event BatchTransfer(address sender, address receiver, string uuid);
    event BatchTransferError(address sender, address receiver, string uuid, string message);

    struct Batch {
        string name;
        string manufacturerName;
        bool readyToShip; 
    }

    mapping(string  => Batch) private batchStore;

    mapping(address => mapping(string => bool)) private batchCurrentOwner;

    function createBatch(string name, string uuid, string manufacturerName) {
    if(batchStore[uuid].readyToShip) {
            BatchCreateError(msg.sender, uuid, "Batch with this UUID already created.");
            return;
        }
        batchStore[uuid] = Batch(name, manufacturerName, true);
        batchCurrentOwner[msg.sender][uuid] = true;
        BatchCreate(msg.sender, uuid, manufacturerName);
    }

    function getBatchById(string uuid) constant returns (string, string) {
        return (batchStore[uuid].name, batchStore[uuid].manufacturerName);
    }

    function transferBatch(address to, string uuid) {
        if(!batchStore[uuid].readyToShip) {
            BatchTransferError(msg.sender, to, uuid, "No batch with this UUID exists");
            return;
        }
        if(!batchCurrentOwner[msg.sender][uuid]) {
            BatchTransferError(msg.sender, to, uuid, "Sender does not own this batch.");
            return;
        }
        batchCurrentOwner[msg.sender][uuid] = false;
        batchCurrentOwner[to][uuid] = true;
        BatchTransfer(msg.sender, to, uuid);
    }

    function isCurrentOwnerOf(address owner, string uuid) constant returns (bool) {
        if(batchCurrentOwner[owner][uuid]) {
            return true;
        }
        return false;
    }
}