# Setup Local

## Install Truffle globally
Open CMD in administrative mode and run the following command to install truffle globally.
> npm install -g truffle

## Create a initial scaffold 
Run the following command inside a new empty directory to generate a basic scaffold 
> truffle init

The above command will generate few directory inside the directory where you have run the command.

## Create a Contract
The following command creates a contract in the **contracts** directory, with some boilerplate code.
> truffle create contract MyContract

## Test Contracts
Then go to truffle project directory and run the following command
> truffle test
The above command will test all test files exists within **test** directory. To test a particular test file, use the following command
> truffle test test/test_filename.js