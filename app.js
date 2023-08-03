const { default: Web3 } = require("web3");
const { Chain, Common, Hardfork } = require("@ethereumjs/common");
const { FeeMarketEIP1559Transaction } = require("@ethereumjs/tx");
const dotenv = require("dotenv");
dotenv.config();

(async () => {
  let web3 = new Web3(
    "https://goerli.infura.io/v3/f6f0f3e54cc34206ad9dbcd62bf49891"
  );

  let sendingAddress = "0x21B267c4a4A9FFf308f06974B5095aeE4B21f4Ef";
  let receivingAddress = "0x136ece6c16473185cdB9560eFb07ae938be6dA48";

  await web3.eth.getBalance(sendingAddress).then(console.log);
  await web3.eth.getBalance(receivingAddress).then(console.log);

  let newNonce = 0;
  await web3.eth
    .getTransactionCount(sendingAddress)
    .then((transactionNum) => (newNonce = transactionNum));

  let rawTransaction = {
    nonce: newNonce,
    to: receivingAddress,
    maxPriorityFeePerGas: 8750000039,
    maxFeePerGas: 8750000900,
    gasPrice: 20000000,
    gasLimit: 30000,
    value: 1402831131312886n,
    data: "",
    chainId: 5,
  };

  let privateKeySender = process.env.PK_USER;

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
  await web3.eth.sendSignedTransaction(serializedTransaction);

  //verify
  await web3.eth.getBalance(sendingAddress).then(console.log);
  await web3.eth.getBalance(receivingAddress).then(console.log);
})();
