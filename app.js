const { default: Web3 } = require("web3");
const { Chain, Common, Hardfork } = require("@ethereumjs/common");
const { FeeMarketEIP1559Transaction } = require("@ethereumjs/tx");

let web3 = new Web3("HTTP://127.0.0.1:7545");

let sendingAddress = "0xfC800c0BED134ceD288F9461cf13c375c6f2aDF2";
let receivingAddress = "0x6b17C82167b35d55Fb3be542c76AF4A8e33AEbf6";

web3.eth.getBalance(sendingAddress).then(console.log);
web3.eth.getBalance(receivingAddress).then(console.log);

let newNonce = 0;
web3.eth
  .getTransactionCount(sendingAddress)
  .then((transactionNum) => (newNonce = transactionNum));

let rawTransaction = {
  nonce: newNonce,
  to: receivingAddress,
  maxPriorityFeePerGas: 8750000039,
  maxFeePerGas: 8750000900,
  gasPrice: 20000000,
  gasLimit: 30000,
  value: 12,
  data: "",
  chainId: 1337,
};

let privateKeySender =
  "171b9111e395b1b82bc0cf66b47d19b2c2c8c21d41721d6379b93044f3fa4ee9";

const chain = new Common({
  chain: Chain.Mainnet,
  hardfork: Hardfork.Istanbul,
});
const tx = FeeMarketEIP1559Transaction.fromTxData(rawTransaction, { chain });

let privateKey = Buffer.from(privateKeySender, "hex");
const signedTx = tx.sign(privateKey);

//test
let serializedTx = signedTx.serialize();
let rawTxHex = "0x" + serializedTx.toString("hex");
console.log(rawTxHex);

//send
const serializedTransaction = signedTx.serialize();
web3.eth.sendSignedTransaction(serializedTransaction);

//verify
web3.eth.getBalance(sendingAddress).then(console.log);
web3.eth.getBalance(receivingAddress).then(console.log);
