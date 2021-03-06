const { ethers } = require("hardhat");
const {hexlify} =  require('ethers-utils');
const EthUtil = require('ethereumjs-util')
const { soliditySha3 } = require("web3-utils");
const dotenv = require('dotenv');
dotenv.config();

const private_key = process.env.PRIVATE_KEY;
const public_address = process.env.PUBLIC_ADDRESS;
const deadline = process.env.DEADLINE_FOR_TRANSACTION;
const value = process.env.VALUE_FOR_PERMIT;

describe("starting tests", function () {
    let sender;
    let spender;
    const aave_token_address="0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9";
    const address_having_aave_tokens = "0xddfAbCdc4D8FfC6d5beaf154f18B778f892A0740";
    const address_having_no_aave_tokens = public_address;
    let contract;

  
    before(async () =>{

      // impersonating a acccount that has some AAVE tokens
      await hre.network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [address_having_aave_tokens],
      });
      sender=await ethers.getSigner(address_having_aave_tokens);

      //impersonating my account, i have the private key of it
      await hre.network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [address_having_no_aave_tokens],
      });
      spender=await ethers.getSigner(address_having_no_aave_tokens);

      //giving myself some transaction fee
      await network.provider.send("hardhat_setBalance", [
        address_having_no_aave_tokens,
        "0x1000000000000000000000000000000000",
      ]);    // will need to remove this, this is so that i can make transactions locally as i have no eth


      //creating instance of the AAVE token contract
      aave_token_contract = await ethers.getContractAt("aave_token_functions", aave_token_address);
      

      // needed for getting public variables necessary for hashing
      const abi_contract = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"delegator","type":"address"},{"indexed":true,"internalType":"address","name":"delegatee","type":"address"},{"indexed":false,"internalType":"enum IGovernancePowerDelegationToken.DelegationType","name":"delegationType","type":"uint8"}],"name":"DelegateChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"enum IGovernancePowerDelegationToken.DelegationType","name":"delegationType","type":"uint8"}],"name":"DelegatedPowerChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"DELEGATE_BY_TYPE_TYPEHASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"DELEGATE_TYPEHASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"DOMAIN_SEPARATOR","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"EIP712_REVISION","outputs":[{"internalType":"bytes","name":"","type":"bytes"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"PERMIT_TYPEHASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"REVISION","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_aaveGovernance","outputs":[{"internalType":"contract ITransferHook","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"_nonces","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"_votingSnapshots","outputs":[{"internalType":"uint128","name":"blockNumber","type":"uint128"},{"internalType":"uint128","name":"value","type":"uint128"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"_votingSnapshotsCounts","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"delegatee","type":"address"}],"name":"delegate","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"delegatee","type":"address"},{"internalType":"uint256","name":"nonce","type":"uint256"},{"internalType":"uint256","name":"expiry","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"delegateBySig","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"delegatee","type":"address"},{"internalType":"enum IGovernancePowerDelegationToken.DelegationType","name":"delegationType","type":"uint8"}],"name":"delegateByType","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"delegatee","type":"address"},{"internalType":"enum IGovernancePowerDelegationToken.DelegationType","name":"delegationType","type":"uint8"},{"internalType":"uint256","name":"nonce","type":"uint256"},{"internalType":"uint256","name":"expiry","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"delegateByTypeBySig","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"delegator","type":"address"},{"internalType":"enum IGovernancePowerDelegationToken.DelegationType","name":"delegationType","type":"uint8"}],"name":"getDelegateeByType","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"},{"internalType":"uint256","name":"blockNumber","type":"uint256"},{"internalType":"enum IGovernancePowerDelegationToken.DelegationType","name":"delegationType","type":"uint8"}],"name":"getPowerAtBlock","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"},{"internalType":"enum IGovernancePowerDelegationToken.DelegationType","name":"delegationType","type":"uint8"}],"name":"getPowerCurrent","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"permit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"blockNumber","type":"uint256"}],"name":"totalSupplyAt","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}];
      contract = new web3.eth.Contract(abi_contract, "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9")
  
    });

    
    describe("tests", function(){
        it("testing_balance", async function(){
            console.log("balance in sender's account: ",await aave_token_contract.balanceOf(sender.address));
            console.log("balance in spender's account :",await aave_token_contract.balanceOf(spender.address));

            await aave_token_contract.connect(sender).approve(spender.address,value);
            await aave_token_contract.connect(spender).transferFrom(sender.address,spender.address,value);

            console.log("balance in sender's account after transaction: ",await aave_token_contract.balanceOf(sender.address));
            console.log("balance in spender's account after transaction:",await aave_token_contract.balanceOf(spender.address));

            //spender and sender have been interhcanged as i have only my private key so i can sign with it only
        });
        
        
        it("creating hash, signing, calling permit, transfer", async function(){

            //getting the parameters which will be used to generate data hash
            let PERMIT_TYPEHASH = await contract.methods.PERMIT_TYPEHASH().call();
            let currentValidNonce = await contract.methods._nonces(spender.address).call();
            let DOMAIN_SEPARATOR = await contract.methods.DOMAIN_SEPARATOR().call();

            
            // generating the hash to sign using private key, the hash will be similar to the one that will be sent as a message in permit function 
            const encoded = web3.eth.abi.encodeParameters(['bytes32', 'address', 'address', 'uint256', 'uint256', 'uint256'],[PERMIT_TYPEHASH, spender.address, sender.address, value, currentValidNonce, deadline]);
            const hash = web3.utils.keccak256(encoded, {encoding: 'hex'});

            const hash1_for_encodePacked = soliditySha3('\x19\x01', DOMAIN_SEPARATOR, hash);
            console.log("The hash that will be signed using private key: ", hash1_for_encodePacked);



            //getting the r ,s ,v from the signature which will be passed as arguments in permit function
            const { v, r, s } = EthUtil.ecsign(Buffer.from(hash1_for_encodePacked.slice(2), 'hex'), Buffer.from(private_key.slice(2), 'hex'));

            //the sender calls permit function to take the allowance of fund transfer from the spender(me) (Remember that they were interchanged)
            await aave_token_contract.connect(sender).permit(spender.address,sender.address,value,deadline,v, hexlify(r), hexlify(s));
            console.log("Permission granted by me to the sender to transfer funds");


            //calling the transfer from from sender to transfer the amount that was allowed by the spender (Remember that the sender and spender were interhcnaged)
            await aave_token_contract.connect(sender).transferFrom(spender.address,sender.address,value);
            console.log("The transaction has been made using permit and transfer functions")


            //getting the finla balances
            console.log("balance in sender's account now: ",await aave_token_contract.balanceOf(sender.address));
            console.log("balance in spender's account now: ",await aave_token_contract.balanceOf(spender.address));
        });


    });
  
  });