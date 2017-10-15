var prometh;
var agent;
let Web3 = require("web3")
let web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))

var creatorAddress = '0x9d93ca2e43896cbbb0c128a0ac09add76919aea5'
var prometheusAddress = '0x7b5f242c2a59560c589e065d24729be5ce680f22'
var agentAddress = '0xfa4de4184feffd22de53a3c92ca8a05eb57f87fa'
var amountToCreate = 10

console.log("Balance at start of creations:")
web3.eth.getBalance(creatorAddress).then(console.log);

let prometheusABI = require("./build/contracts/prometheus.json").abi
let promethABI = require("./build/contracts/prometh.json").abi
let agentABI = require("./build/contracts/dummyAgent.json").abi

prometheus = new web3.eth.Contract(prometheusABI, prometheusAddress)

module.exports = () => {
	setTimeout(function(){ createPrometh(0) }, 1000)
}

createPrometh = (iteration) => {
	if (iteration == amountToCreate)
	{
		console.log("Balance at end of creations:")
		web3.eth.getBalance(creatorAddress).then(console.log);
		return;
	}
	let promise = prometheus.methods.createPrometh(agentAddress).send({from: creatorAddress, gas: 1000000})
		.then(() => {
			return prometheus.methods.promethCount().call()
		})
		.then((promethCount) => {
			console.log('Prometh count: ', promethCount)
			return prometheus.methods.promeths(promethCount - 1).call();
		})
		.then((promethAddr) => {
			console.log('Prometh Address', promethAddr)
			prometh = new web3.eth.Contract(promethABI, promethAddr);
			web3.eth.sendTransaction({from: creatorAddress, to: prometh._address, value: 5000000000000000})
			return prometh.methods.promethAgent().call();
		}).then((agentAddr) => {
			console.log('Agent address:', agentAddr);
			agent = new web3.eth.Contract(agentABI, agentAddr);
			agent.methods.setReward(5000000000000000).send({from: creatorAddress, gas: 1000000});
			agent.methods.setGasCost(100000).send({from: creatorAddress, gas: 1000000});
		}).then(setTimeout(function(){ createPrometh(iteration + 1) }, 1000));
}