const express = require('express')
const mintNFT = require('../scripts/mint-nft.mjs')
const airdropNFT = require('../scripts/airdrop-nft.mjs')
const storeAsset = require('../scripts/store-asset.mjs')
const deployContract = require('../scripts/deploy-contract.mjs')

const app = express()
const port = 3000

// Healthcheck
app.get('/health', (req, res) => {
    const data = {
        uptime: process.uptime(),
        message: 'Ok',
        date: new Date()
    }
    res.status(200).send(data);
})

app.get('/', (req, res) => {
    res.send('Welcome to our Homepage!')
})

app.get('/generate', (req, res) => {
    nftName = req.params.name
    description = req.body
    metadataURL = storeAsset(nftName, description) //Uses NFT.Storage API to store on Filecoin
    if (metadataURL != null) {
        res.send(metadataURL)
    }
    
})

app.get('/deploy', (req, res) => {
    // Costs some money
    address = deployContract(req.params.name)
    if (address != null) {
        res.status(200).send("NFT Contract Deployed")
    }
})

app.get('/mint', (req, res) => {
    // Costs some money
    contractName = null //contract name that the user wants
    contractAddress = null //contract address from /deploy
    metadataURL = null //the image metadata from /generate
    mintNFT(contractName, contractAddress, metadataURL)
    res.status(200).send("NFT Minted")
})

app.get('/airdrop', (req, res) => {
    // Costs some money
    contractName = null //contract name that the user wants
    contractAddresses = null //contract address from /deploy
    metadataURL = null //the image metadata from /generate
    receiverAddresses = req.body
    airdropNFT(contractName, contractAddress, metadataURL, receiverAddresses)
    res.status(200).send("NFT Minted")
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})