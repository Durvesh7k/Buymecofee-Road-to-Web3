//SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;


import "hardhat/console.sol";

contract Buymecofee{

    address payable owner;

    constructor() payable{
        owner = payable(msg.sender);
    }

    event NewMemo(
        address indexed from,
        uint256 id,
        string name,
        string message,
        uint256 timestamp
    );

    struct Memo{
        address from;
        uint256 id;
        string name;
        string message;
        uint256 timestamp;
    }

    Memo[] public memos;

    function buyme(string memory _name, string memory _message) public payable{

        memos.push(Memo(
            msg.sender,
            block.timestamp % 100,
            _name,
            _message,
            block.timestamp
        ));

        emit NewMemo(
            msg.sender,
            block.timestamp % 100,
            _name,
            _message,
            block.timestamp
        );
    }

    function getMemos() public view returns(Memo[] memory){
        return memos;
    }

    modifier onlyOwner(){
        require(msg.sender == owner, "Not the owner");
        _;
    }

    function withdraw() external onlyOwner{
        require(owner.send(address(this).balance));
    }


}