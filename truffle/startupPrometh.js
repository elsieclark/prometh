
module.exports = () => {
	let Web3 = require("web3")

	let web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))

	let prometheusABI = require("./build/contracts/prometheus.json").abi
	let promethABI = require("./build/contracts/prometh.json").abi
	let agentABI = require("./build/contracts/dummyAgent.json").abi

	prometheus = new web3.eth.Contract(prometheusABI, '0x09c2f26ae9979fa85db715d5eb3ec31f7ba257c1')
	prometh;
	agent;

	let promise = prometheus.methods.createPrometh('0x1218eb924d11d611b64b898b18cdc117739ed978').send({from: '0xa3bd372055483a1d021e0535e658d6b0feed1cd3', gas: 1000000})
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
			return prometh.methods.promethAgent().call();
		}).then((agentAddr) => {
			console.log('Agent address:', agentAddr);
			agent = new web3.eth.Contract(agentABI, agentAddr);
		}).catch((e) => { console.log('error:', e) });
}
