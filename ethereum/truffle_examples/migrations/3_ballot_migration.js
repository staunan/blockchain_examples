const Ballot = artifacts.require("Ballot");

module.exports = function (deployer, network, accounts) {
  deployer.deploy(Ballot, ['BJP', 'TMC', 'Congress', 'CPIM'], {gas: 9000000, from: accounts[0]});
};