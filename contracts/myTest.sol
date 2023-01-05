// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import "hardhat/console.sol";  //to see any value in terminal 

contract MyTest{
    uint256 public unlockedTime;
    address payable public owner;

    event withdraw(uint256 amount,uint256 when);

    constructor(uint256 _unlockedTime) payable{
        require(block.timestamp < _unlockedTime,"unlockedTime must be in future");
        unlockedTime=_unlockedTime;
        owner = payable(msg.sender);
    }

    function Withdraw() public {
        require(block.timestamp >= unlockedTime,"Wait till the time period completed!");
        require(msg.sender == owner,"you cannot withdraw funds!");
        owner.transfer(address(this).balance);
        emit withdraw(address(this).balance,unlockedTime);
    }
}
