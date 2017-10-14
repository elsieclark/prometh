var prometheus = artifacts.require("./prometheus.sol");
var dummyAgent = artifacts.require("./dummyAgent.sol");

module.exports = function(deployer) {
  deployer.deploy(prometheus);
  deployer.deploy(dummyAgent);
};
