const { ethers } = require("hardhat");
//const Web3 = require("web3");
const EthUtil = require('ethereumjs-util')
const { soliditySha3 } = require("web3-utils");
const dotenv = require('dotenv');
const {
  BigNumber,
  bigNumberify,
  getAddress,
  hexlify,
  keccak256,
  defaultAbiCoder,
  toUtf8Bytes,
  solidityPack
} =  require('ethers-utils');
dotenv.config();


const alchemy_key = process.env.ALCHEMY_API_KEY;
const private_key = process.env.PRIVATE_KEY;
//const ALCHEMY_POINT = `https://eth-mainnet.alchemyapi.io/v2/${alchemy_key}`;
//const web3 = new Web3(new Web3.providers.HttpProvider(ALCHEMY_POINT));

describe("starting tests", function () {
    const usdc_on_aave="0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
    let sender;
    let spender;
    const aave_token_address="0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9";
    const address_having_aave_tokens = "0xddfAbCdc4D8FfC6d5beaf154f18B778f892A0740";
    const address_having_no_aave_tokens = "0x3Fc046bdE274Fe8Ed2a7Fd008cD9DEB2540dfE36";
    let contract;

    let owner;
    let acc1;
    let acc2;
    let contract1;
    let instance;

  
    before(async () =>{

      [owner, acc1 ,acc2] = await ethers.getSigners();
      contract1 = await ethers.getContractFactory("main");
      instance = await contract1.deploy();
      await instance.deployed();

      await hre.network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [address_having_aave_tokens],
      });

      sender=await ethers.getSigner(address_having_aave_tokens);

      await hre.network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [address_having_no_aave_tokens],
      });

      await network.provider.send("hardhat_setBalance", [
        address_having_no_aave_tokens,
        "0x1000000000000000000000000000000000",
      ]);    // will need to remove this

      spender=await ethers.getSigner(address_having_no_aave_tokens);

      usdc_token = await ethers.getContractAt("IERC20_functions",usdc_on_aave);

      aave_token_contract = await ethers.getContractAt("aave_token_functions", aave_token_address);
      
      const abi_contract = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"delegator","type":"address"},{"indexed":true,"internalType":"address","name":"delegatee","type":"address"},{"indexed":false,"internalType":"enum IGovernancePowerDelegationToken.DelegationType","name":"delegationType","type":"uint8"}],"name":"DelegateChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"enum IGovernancePowerDelegationToken.DelegationType","name":"delegationType","type":"uint8"}],"name":"DelegatedPowerChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"DELEGATE_BY_TYPE_TYPEHASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"DELEGATE_TYPEHASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"DOMAIN_SEPARATOR","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"EIP712_REVISION","outputs":[{"internalType":"bytes","name":"","type":"bytes"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"PERMIT_TYPEHASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"REVISION","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_aaveGovernance","outputs":[{"internalType":"contract ITransferHook","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"_nonces","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"_votingSnapshots","outputs":[{"internalType":"uint128","name":"blockNumber","type":"uint128"},{"internalType":"uint128","name":"value","type":"uint128"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"_votingSnapshotsCounts","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"delegatee","type":"address"}],"name":"delegate","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"delegatee","type":"address"},{"internalType":"uint256","name":"nonce","type":"uint256"},{"internalType":"uint256","name":"expiry","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"delegateBySig","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"delegatee","type":"address"},{"internalType":"enum IGovernancePowerDelegationToken.DelegationType","name":"delegationType","type":"uint8"}],"name":"delegateByType","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"delegatee","type":"address"},{"internalType":"enum IGovernancePowerDelegationToken.DelegationType","name":"delegationType","type":"uint8"},{"internalType":"uint256","name":"nonce","type":"uint256"},{"internalType":"uint256","name":"expiry","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"delegateByTypeBySig","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"delegator","type":"address"},{"internalType":"enum IGovernancePowerDelegationToken.DelegationType","name":"delegationType","type":"uint8"}],"name":"getDelegateeByType","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"},{"internalType":"uint256","name":"blockNumber","type":"uint256"},{"internalType":"enum IGovernancePowerDelegationToken.DelegationType","name":"delegationType","type":"uint8"}],"name":"getPowerAtBlock","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"},{"internalType":"enum IGovernancePowerDelegationToken.DelegationType","name":"delegationType","type":"uint8"}],"name":"getPowerCurrent","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"permit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"blockNumber","type":"uint256"}],"name":"totalSupplyAt","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}];
      
      contract = new web3.eth.Contract(abi_contract, "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9")
  
    });
    
    describe("tests", function(){
        it("testing_balance", async function(){
            console.log("balance in sender's account: ",await aave_token_contract.balanceOf(sender.address));
            console.log("balance in spender's account :",await aave_token_contract.balanceOf(spender.address))
        });
        
        it("testing permit", async function(){
            //const currentBlock = await web3.eth.getBlock("latest");
            //console.log("current time: ",currentBlock.timestamp);
            //console.log("deadline set: ",Number.MAX_SAFE_INTEGER);
            await aave_token_contract.connect(sender).approve(spender.address,10000000);
            await aave_token_contract.connect(spender).transferFrom(sender.address,spender.address,10000000);
            console.log("balance in sender's account: ",await aave_token_contract.balanceOf(sender.address));
            console.log("balance in spender's account :",await aave_token_contract.balanceOf(spender.address));


            //spender and sender has been interhcanged as i have only my private key

            let PERMIT_TYPEHASH = await contract.methods.PERMIT_TYPEHASH().call();
            let currentValidNonce = await contract.methods._nonces(spender.address).call();
            let DOMAIN_SEPARATOR = await contract.methods.DOMAIN_SEPARATOR().call();
            console.log(PERMIT_TYPEHASH);
            console.log(currentValidNonce);
            console.log(DOMAIN_SEPARATOR);
            
            //const check_it_inert=await instance.checking(PERMIT_TYPEHASH, owner.address, spender.address, 10000000, currentValidNonce, 10000000);
            check_it_inert=await instance.func(PERMIT_TYPEHASH, spender.address, sender.address, 10000000, currentValidNonce, 1000000000000);
            console.log(check_it_inert);

            //const print = web3.utils.keccak256(PERMIT_TYPEHASH, owner.address, spender.address, 10000000, currentValidNonce, 10000000);
            //const print = web3.utils.keccak256("PERMIT_TYPEHASH, owner, spender, value, currentValidNonce, deadline");
            const encoded = web3.eth.abi.encodeParameters(['bytes32', 'address', 'address', 'uint256', 'uint256', 'uint256'],[PERMIT_TYPEHASH, spender.address, sender.address, 10000000, currentValidNonce, 1000000000000]);
            const hash = web3.utils.keccak256(encoded, {encoding: 'hex'});
            console.log(hash);

            const check_it_inert1=await instance.func1(DOMAIN_SEPARATOR, PERMIT_TYPEHASH, spender.address, sender.address, 10000000, currentValidNonce, 1000000000000);
            console.log(check_it_inert1);

            /*const encoded1 = web3.eth.abi.encodeParameters(['string', 'bytes32', 'bytes32'],['\x19\x01', DOMAIN_SEPARATOR, hash]);
            const hash1 = web3.utils.keccak256(encoded1, {encoding: 'hex'});     -> does not work in encodePacked
            console.log("this is final that should be validated: ",hash1);*/

            const hash1_for_encodePacked = soliditySha3('\x19\x01', DOMAIN_SEPARATOR, hash);
            console.log("final here", hash1_for_encodePacked);

            const { v, r, s } = EthUtil.ecsign(Buffer.from(hash1_for_encodePacked.slice(2), 'hex'), Buffer.from(private_key.slice(2), 'hex'));

            //spender and sender has been interchanged, sender is me.
            const check=await instance.permit(PERMIT_TYPEHASH,DOMAIN_SEPARATOR,currentValidNonce,spender.address,sender.address,10000000,1000000000000,v,hexlify(r), hexlify(s));
            console.log(check);

            console.log("should be:", spender.address);
            await aave_token_contract.permit(spender.address,sender.address,10000000,1000000000000,v, hexlify(r), hexlify(s));
            console.log("permited by me to the sender to transfer");
            console.log(await contract.methods.balanceOf(sender.address).call())
            await aave_token_contract.connect(sender).transferFrom(spender.address,sender.address,"10000000");
            console.log("balance in sender's account: ",await aave_token_contract.balanceOf(sender.address));
            console.log("balance in spender's account :",await aave_token_contract.balanceOf(spender.address));
        });


    });
  
  });