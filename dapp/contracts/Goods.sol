pragma solidity ^0.4.17;

contract Goods {
    
    function getHello() public returns(string) {
		return "Hello from Goods";
	}

    event BatchCreate(address sender, string uuid, string manufacturer);
    event BatchCreateError(address sender, string uuid, string message);
  
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
}