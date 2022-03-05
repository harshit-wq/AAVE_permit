//SPDX-License-Identifier: GPL-3.0


pragma solidity >=0.5.0<0.9.0;

import "./interface.sol";

import "hardhat/console.sol";



contract main{
    /*function checking(bytes32 PERMIT_TYPEHASH,address owner,address spender,uint256 value,uint256 currentValidNonce,uint256 deadline) external returns(bytes32) {
        bytes32 inert = keccak256(abi.encodePacked("PERMIT_TYPEHASH, owner, spender, value, currentValidNonce, deadline"));
        //console.log(inert);
        return inert;
    }*/

    function splitSignature(bytes memory sig)
        public
        pure
        returns (
            bytes32 r,
            bytes32 s,
            uint8 v
        )
    {
        require(sig.length == 65, "invalid signature length");

        assembly {
            /*
            First 32 bytes stores the length of the signature

            add(sig, 32) = pointer of sig + 32
            effectively, skips first 32 bytes of signature

            mload(p) loads next 32 bytes starting at the memory address p into memory
            */

            // first 32 bytes, after the length prefix
            r := mload(add(sig, 32))
            // second 32 bytes
            s := mload(add(sig, 64))
            // final byte (first byte of the next 32 bytes)
            v := byte(0, mload(add(sig, 96)))
        }
        return (r, s, v);
    }

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
    //uint256 currentValidNonce = _nonces[owner];
    bytes32 digest =
      keccak256(
        abi.encodePacked(
          '\x19\x01',
          DOMAIN_SEPARATOR,
          keccak256(abi.encode(PERMIT_TYPEHASH, owner, spender, value, currentValidNonce, deadline))
        )
      );
    return ecrecover(digest, v, r, s);
    require(owner == ecrecover(digest, v, r, s), 'INVALID_SIGNATURE');
    //_nonces[owner] = currentValidNonce.add(1);
    //_approve(owner, spender, value);
  }
}