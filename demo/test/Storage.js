var assert = require('assert');

// Import the contract artifacts 
const Storage = artifacts.require("Storage");
let deployedContractInstance = null;

contract("Storage", accounts => {

    it("Deploy the Contract", async function(){
        deployedContractInstance = await Storage.deployed();
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

    it("Store a number", async function(){
        let value = 50;
        // Store the value 50
        await deployedContractInstance.store(value, {from: accounts[0]});
        // Get the Number --
        let storedValue = await deployedContractInstance.retrieve.call();
        // Check if the values are equeal
        assert.equal(storedValue, value);
    });
    
});