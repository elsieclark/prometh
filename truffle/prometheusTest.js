var Web3 = require("web3")

var consoleSuccess = (result) => {
	console.log("Success result is:\n" + result)
}

var consoleFail = (result) => {
	console.log("Fail result is:\n" + result)
}

var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))

var myJSON = require("./build/contracts/prometheus.json")

var promethABI = require("./build/contracts/prometh.json").abi

var myContract = new web3.eth.Contract(myJSON.abi, '0x039ad7bc8ae2fb1860b354aa2e4b0ddbb79f1bec')

myContract.methods.createPrometh('0x6168531b1d9364d9d3a723061d34d257a74e6900').send({from: '0x3fb39acd627cecf8546013470a016f8db00aa744', gas: 1000000}).then(console.log)

myContract.methods.promeths(0).call().then(consoleSuccess, consoleFail)

myContract.methods.promeths(0).call().then((promethAddr) => {
		let prometh = new web3.eth.Contract(promethABI, promethAddr);
		return prometh.methods.promethAgent().call();
	})
	.then((addr) => {
		console.log('Agent address:', addr);
	})
	.catch((e) => { console.log('error:', e) });

