
var prometh;
var agent;
var promethCount;

var prometheusAccount = '0x7b5f242c2a59560c589e065d24729be5ce680f22'
var receiverAccount = '0x541f0c9a2091a8f2d26e91631a14e5bb83674965'
var gasPrice = 20000000000

var Web3 = require("web3")
var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))

var prometheusABI = require("./build/contracts/prometheus.json").abi
var promethABI = require("./build/contracts/prometh.json").abi
var agentABI = require("./build/contracts/dummyAgent.json").abi

var prometheus = new web3.eth.Contract(prometheusABI, prometheusAccount)

module.exports = () => {
	prometheus.methods.promethCount().call().then(storePromethCount)

	setTimeout(function(){ flyRaven(0) }, 1000)
}

flyRaven = (iteration) => {
	console.log("Iteration is: " + iteration)
	if (iteration === 0)
	{
		console.log("Balance at start of cycle is:")
		web3.eth.getBalance(receiverAccount).then(console.log)
	}
	let promise = prometheus.methods.promeths(iteration).call()
		.then((selectedPrometh) => {
			prometh = new web3.eth.Contract(promethABI, selectedPrometh);
			return prometh.methods.lookup().call()
		})
		.then((promethInfo) => {
			console.log(promethInfo);

			return web3.eth.getBalance(prometh._address)
				.then((balance) => {
					if (promethInfo['1'] - promethInfo['0'] * gasPrice > 0 && balance >= promethInfo['1'])
					{
						console.log("Prometh reward at access time:");
						web3.eth.getBalance(prometh._address).then(console.log);
						return prometh.methods.execute(200000, 5000000000000000).send({from: receiverAccount, gas: 200000})
					}
				});
		})
		.then(setTimeout(function(){ flyRaven((iteration + 1) % promethCount) }, 1000));
}

storePromethCount = (count) => {
	promethCount = count;
	console.log(promethCount)
}