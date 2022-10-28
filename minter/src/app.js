const Moralis = require('moralis').default
const { NFTStorage, File } = require('nft.storage')
const express = require('express')
const mintNFT = require('../scripts/mint-nft.js')
const airdropNFT = require('../scripts/airdrop-nft.js')
const storeAsset = require('../scripts/store-asset.js')
const deployContract = require('../scripts/deploy-contract.js')
const displayNFT = require('../scripts/display-nft.js')

const app = express()
const port = 3000
app.use(express.json())

nftStorageClient = new NFTStorage({ token: process.env.NFT_STORAGE_API_KEY })

// Healthcheck
app.get('/health', (req, res) => {
    const data = {
        uptime: process.uptime(),
        message: 'Ok',
        date: new Date()
    }
    res.status(200).send(data);
})

// Root stuff
app.get('/', (req, res) => {
    res.send('Welcome to our Homepage!')
})

// POST /generate/name/description with formData body 
app.post('/generate/:name/:description', (req, res) => {
    nftName = req.params.name
    description = req.params.description
    // TODO call generate endpoint
    image = null
    metadataURL = storeAsset(nftName, description, image, nftStorageClient) //Uses NFT.Storage API to store on Filecoin
    if (metadataURL != null) {
        res.send(metadataURL)
    }
})

app.post('/upload/:name/:description', (req, res) => {
    nftName = req.params.name
    description = req.params.description
    // TODO semantics of file upload
    image = new File([req.body], nftName, {type: 'image'})
    metadataURL = storeAsset(nftName, description, image, nftStorageClient) //Uses NFT.Storage API to store on Filecoin
    if (metadataURL != null) {
        res.send(metadataURL)
    }
    
})

// Deploys a smart contract to chain
app.get('/deploy', (req, res) => {
    // Costs some money
    address = deployContract(req.params.name)
    if (address != null) {
        res.status(200).send("NFT Contract Deployed")
    }
})

// Calls smart contract mint method
app.get('/mint', (req, res) => {
    // Costs some money
    contractName = null //contract name that the user wants
    contractAddress = null //contract address from /deploy
    metadataURL = null //the image metadata from /generate
    mintNFT(contractName, contractAddress, metadataURL)
    res.status(200).send("NFT Minted")
})

// Calls smart contract airdrop method
app.get('/airdrop', (req, res) => {
    // Costs some money
    contractName = null //contract name that the user wants
    contractAddresses = null //contract address from /deploy
    metadataURL = null //the image metadata from /generate
    receiverAddresses = req.body
    airdropNFT(contractName, contractAddress, metadataURL, receiverAddresses)
    res.status(200).send("NFT Minted")
})

// Deploys a smart contract to chain
app.get('/display/:address', (req, res) => {
    // Costs some money
    displayNFT(req.params.address, )
    if (address != null) {
        res.status(200).send("NFT Contract Deployed")
    }
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})

const initServer = async () => {
    await Moralis.start({
        apiKey: process.env.MORALIS_API_KEY
    })
}

initServer()