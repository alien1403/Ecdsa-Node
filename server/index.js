const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "020b1e8614aa3d94c8b127e79635ebf1ed9bcf5061850581f39c4ecb93e9cb460e": 100,
  "02226d2b9e8f983e8337b1783eec474a6ebe29a07a328e66e1a3ac037aecee7e4b": 50,
  "02ab3b59ac1b5abceb9f249e39f1d157a575ee9909aa05eabde82cad609c752b91": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  // TODO: get a signature from the client-side application
  // TODO: recover the public address from the signature and this will be the sender
  
  const { sender, recipient, amount } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
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
