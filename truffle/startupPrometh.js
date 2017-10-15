
module.exports = () => {
	let Web3 = require("web3")

	var agentAddress = '0xe75395c6873a915ebd5f45badd60275d29cab4a5'
	var creatorAddress = '0x51cba97b180d9897b44382ddb111c4323122b066'
	var prometheusAddress = '0x90c781b9baaefc8755d7e25ee6bc7a728386d10e'

	let web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))

	let prometheusABI = require("./build/contracts/prometheus.json").abi
	let promethABI = require("./build/contracts/prometh.json").abi
	let agentABI = require("./build/contracts/dummyAgent.json").abi

	prometheus = new web3.eth.Contract(prometheusABI, prometheusAddress)
	var prometh;
	var agent;

	let promise = prometheus.methods.createPrometh(agentAddress).send({from: creatorAddress, gas: 1000000})
		.then(() => {
			return prometheus.methods.promethCount().call()
		})
		.then((promethCount) => {
			console.log('Alpha', promethCount)
			return prometheus.methods.promeths(promethCount - 1).call();
		})
		.then((promethAddr) => {
			console.log('Beta', promethAddr)
			prometh = new web3.eth.Contract(promethABI, promethAddr);
			web3.eth.sendTransaction({from: creatorAddress, to: prometh._address, value: 5000000000000000})
			return prometh.methods.promethAgent().call();
		}).then((agentAddr) => {
			console.log('Agent address:', agentAddr);
			agent = new web3.eth.Contract(agentABI, agentAddr);
			agent.methods.setReward(5000000000000000).send({from: creatorAddress, gas: 1000000});
			agent.methods.setGasCost(100000).send({from: creatorAddress, gas: 1000000});
		}).catch((e) => { console.log('error:', e) });
}
