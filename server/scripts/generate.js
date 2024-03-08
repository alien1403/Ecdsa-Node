const ethers = require("ethers");
const { toHex } = require("ethereum-cryptography/utils");
const { secp256k1 } = require("ethereum-cryptography/secp256k1");

const privateKey = secp256k1.utils.randomPrivateKey()

console.log("Private Key:", toHex(privateKey));

const publicKey = secp256k1.getPublicKey(privateKey)
console.log("Public Key:", toHex(publicKey));
