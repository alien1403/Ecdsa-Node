const express = require("express");
const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const {toHex, utf8ToBytes} = require("ethereum-cryptography/utils")

const app = express();
const cors = require("cors");

const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "04f30354a006e3bdb667274f924556305772592c30d13e055b61ace72c3805a30c37bf1a57c545db0bab560758c60562e9cc84573de2f4a686e2e7b6a486f167af": 100,
  "04bfed37d7d8c6c67b3eead5aeeac62165079a1af3728b305b2ec0f7bbf8ea4e18d4c8dc6be5c3d265ea7b9a4b996acc11ac04fe97ad655c391b9b2c806fde688a": 50,
  "044f26ec12e9624421983c0fd2ffc5dfaf0bd285d00ab8538efd449112f5b92a0654d8081e31d88433a8e5544d3d43cc85bb3314245a7608e19149a09d063bc513": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", async (req, res) => {
  const { sender, recipient, amount, signature, recovery } = req.body;

  if(!signature) res.status(404).send({ message: "signature dont was provide" });
  if(!recovery) res.status(400).send({ message: "recovery dont was provide" });

  try {
    
    const bytes = utf8ToBytes(JSON.stringify({ sender, recipient, amount }));
    const hash = keccak256(bytes);

    const sig = new Uint8Array(signature);

    const publicKey = await secp.recoverPublicKey(hash, sig, recovery);

    if(toHex(publicKey) !== sender){
      res.status(400).send({ message: "signature no is valid" });
    }

    setInitialBalance(sender);
    setInitialBalance(recipient);

    if (balances[sender] < amount) {
      res.status(400).send({ message: "Not enough funds!" });
    } else {
      balances[sender] -= amount;
      balances[recipient] += amount;
      res.send({ balance: balances[sender] });
    }
  } catch (error) {
    console.log(error.message)
  }
  
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
