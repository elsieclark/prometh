
var prometh;
var agent;

var prometheusAccount = '0x90c781b9baaefc8755d7e25ee6bc7a728386d10e'
var receiverAccount = '0x298be9e1247499e2071714cefdf24ba1cd0f19be'
var gasPrice = 20000000000

module.exports = () => {
	let Web3 = require("web3")

	let web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))

	let prometheusABI = require("./build/contracts/prometheus.json").abi
	let promethABI = require("./build/contracts/prometh.json").abi
	let agentABI = require("./build/contracts/dummyAgent.json").abi

	prometheus = new web3.eth.Contract(prometheusABI, prometheusAccount)

	let promise = prometheus.methods.promeths(10).call()
		.then((selectedPrometh) => {
			prometh = new web3.eth.Contract(promethABI, selectedPrometh);
			return prometh.methods.lookup().call()
		})
		.then((promethInfo) => {
			console.log(promethInfo);
			console.log("I am there");
			if (promethInfo['1'] - promethInfo['0'] * gasPrice > 0)
			{
				console.log("I am in");
				web3.eth.getBalance(prometh._address).then(console.log);
				return prometh.methods.execute(200000, 5000000000000000).send({from: receiverAccount, gas: 200000})
			}
		}).catch((e) => { console.log('error:', e) });
}