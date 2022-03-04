//SPDX-License-Identifier: GPL-3.0


pragma solidity >=0.5.0<0.9.0;

import "./interface.sol";

import "hardhat/console.sol";

import "./recover.sol";


contract main{
    /*function checking(bytes32 PERMIT_TYPEHASH,address owner,address spender,uint256 value,uint256 currentValidNonce,uint256 deadline) external returns(bytes32) {
        bytes32 inert = keccak256(abi.encodePacked("PERMIT_TYPEHASH, owner, spender, value, currentValidNonce, deadline"));
        //console.log(inert);
        return inert;
    }*/
    function func(bytes32 PERMIT_TYPEHASH, address owner,address spender,uint256 value,uint256 currentValidNonce,uint256 deadline) external pure returns (bytes32) {
        return keccak256(abi.encode(PERMIT_TYPEHASH, owner, spender, value, currentValidNonce, deadline));
    }

    function func1(bytes32 DOMAIN_SEPARATOR, bytes32 PERMIT_TYPEHASH, address owner,address spender,uint256 value,uint256 currentValidNonce,uint256 deadline) external pure returns (bytes32) {
        bytes32 hash = keccak256(abi.encode(PERMIT_TYPEHASH, owner, spender, value, currentValidNonce, deadline));
        //console.log("this is", hash);
        //return hash;
        return keccak256(abi.encode('\x19\x01', DOMAIN_SEPARATOR, hash));
    }

  function permit(
    bytes32 PERMIT_TYPEHASH,
    bytes32 DOMAIN_SEPARATOR,
    uint256 currentValidNonce,
    address owner,
    address spender,
    uint256 value,
    uint256 deadline,
    uint8 v,
    bytes32 r,
    bytes32 s
  ) external pure returns(address) {
    require(owner != address(0), 'INVALID_OWNER');
    //solium-disable-next-line
    //require(block.timestamp <= deadline, 'INVALID_EXPIRATION');
    bytes32 digest =
      keccak256(
        abi.encodePacked(
          '\x19\x01',
          DOMAIN_SEPARATOR,
          keccak256(abi.encode(PERMIT_TYPEHASH, owner, spender, value, currentValidNonce, deadline))
        )
      );
      //console.log("nln",v);
      //console.log(r);
      //console.log(s);
    address x = ecrecover(digest, v, r, s);
    //console.log(x);
    //require(owner == ecrecover(digest, v, r, s), 'INVALID_SIGNATURE');
    return x;

  }
}