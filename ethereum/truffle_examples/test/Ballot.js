var assert = require('assert');

// Import the contract artifacts 
const Ballot = artifacts.require("Ballot");
let deployedContractInstance = null;

contract("Ballot", accounts => {
    it("Deploy the Contract", async function(){
        deployedContractInstance = await Ballot.deployed();
        console.log("Contract Deployed to Test Network !!!");
        console.log("Contract Address : " + deployedContractInstance.address);
        assert.ok(deployedContractInstance.address);
    });
    
    it("Check Account Balance", async function(){
        // web3 module is automatically configured and imported by Truffle, so no need to import web3. Just use it directly --
        let balance = await web3.eth.getBalance(accounts[0]);
        // Current balance is in wei, so convert it to ether unit
        let balanceInEth = await web3.utils.fromWei(balance, 'ether');
        console.log("Balance : " + balanceInEth);
        assert.ok(balanceInEth); // Balance is almost 1000
    });
});