pragma solidity ^0.4.17;

contract Goods {
    
    function getHello() public returns(string) {
		return "Hello from Goods";
	}
    event BatchLog (uint indexed eventDesc, string batchId, string content, address indexed doer, uint timestamp);
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
            emit BatchCreateError(msg.sender, uuid, "Batch with this UUID already created.");
            return;
        }
        batchStore[uuid] = Batch(name, manufacturerName, true);
        batchCurrentOwner[msg.sender][uuid] = true;
        emit BatchCreate(msg.sender, uuid, manufacturerName);
        emit BatchLog(1, uuid, "Batch successfully created", msg.sender, now);//BATCH_CREATED
    }

    function getBatchById(string uuid) constant returns (string, string) {
        return (batchStore[uuid].name, batchStore[uuid].manufacturerName);
    }

    function transferBatch(address to, string uuid) {
        if(!batchStore[uuid].readyToShip) {
            emit BatchTransferError(msg.sender, to, uuid, "No batch with this UUID exists");
            return;
        }
        if(!batchCurrentOwner[msg.sender][uuid]) {
            emit BatchTransferError(msg.sender, to, uuid, "Sender does not own this batch.");
            return;
        }
        batchCurrentOwner[msg.sender][uuid] = false;
        batchCurrentOwner[to][uuid] = true;
        emit BatchTransfer(msg.sender, to, uuid);
         string memory content = strConcat("Batch transferred to: ", toString(to));
        emit BatchLog(2, uuid, content, msg.sender, now);//BATCH_TRANSFERRED
    }

    // Public address of owner
    function isCurrentOwnerOf(address owner, string uuid) constant returns (bool) {
        if(batchCurrentOwner[owner][uuid]) {
            return true;
        }
        return false;
    }

    function strConcat(string _a, string _b) internal pure returns (string){
        bytes memory _ba = bytes(_a);
        bytes memory _bb = bytes(_b);
        string memory ab = new string(_ba.length + _bb.length);
        bytes memory bab = bytes(ab);
        uint k = 0;
        for (uint i = 0; i < _ba.length; i++) bab[k++] = _ba[i];
        for (i = 0; i < _bb.length; i++) bab[k++] = _bb[i];
        return string(bab);
    }

    function toString(address x) returns (string) {
    bytes memory b = new bytes(20);
    for (uint i = 0; i < 20; i++)
        b[i] = byte(uint8(uint(x) / (2**(8*(19 - i)))));
    return string(b);
    }
}