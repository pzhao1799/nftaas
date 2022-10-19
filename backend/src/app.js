import { ethers } from "hardhat"
const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/deploy', (req, res) => {
  address = deployNFT()
  res.send(address)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

async function deployNFT() {
  const MyNFT = await ethers.getContractFactory("MyNFT");
 
  // Start deployment, returning a promise that resolves to a contract object
  const myNFT = await MyNFT.deploy(); // Instance of the contract
  console.log("Contract deployed to address:", myNFT.address);
  return myNFT.address
}