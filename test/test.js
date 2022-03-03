const { ethers } = require("hardhat");
const Web3 = require("web3");
const dotenv = require('dotenv');
dotenv.config();


const alchemy_key = process.env.ALCHEMY_API_KEY;
const private_key = process.env.PRIVATE_KEY;
const ALCHEMY_POINT = `https://eth-mainnet.alchemyapi.io/v2/${alchemy_key}`;
const web3 = new Web3(new Web3.providers.HttpProvider(ALCHEMY_POINT));

describe("starting tests", function () {
    const usdc_on_aave="0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
    let sender;
    let spender;
    const aave_token_address="0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9";
    const address_having_aave_tokens = "0xddfAbCdc4D8FfC6d5beaf154f18B778f892A0740";
    const address_having_no_aave_tokens = "0x3Fc046bdE274Fe8Ed2a7Fd008cD9DEB2540dfE36";

  
    before(async () =>{
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

      //ECrecover_contract = await ethers.getContractAt("ECrecover_function", ECrecover_address);
  
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
            const a = await web3.eth.accounts.sign('Some data', private_key);
            console.log(a);
            const y = await web3.eth.accounts.recover('Some data', a.signature)
            console.log(y);
            //await aave_token_contract.connect(spender).permit(sender.address,spender.address,1000,Number.MAX_SAFE_INTEGER,v,s,r);
        });


    });
  
  });