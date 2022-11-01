const Moralis = require('moralis').default
const bodyParser = require('body-parser')
const { EvmChain } = require('@moralisweb3/evm-utils')
const { NFTStorage, File } = require('nft.storage')
const express = require('express')
const mintNFT = require('../scripts/mint-nft.js').mintNFT
const safeMint = require('../scripts/mint-nft.js').safeMint
const airdropNFT = require('../scripts/airdrop-nft.js').airdropNFT
const storeAsset = require('../scripts/store-asset.js').storeAsset
const deployContract = require('../scripts/deploy-contract.js').deployContract
const displayNFT = require('../scripts/display-nft.js').displayNFT

const app = express()
const port = 3000
app.use(express.json())
app.use(express.urlencoded({ extended: true }));


nftStorageClient = new NFTStorage({ token: process.env.NFT_STORAGE_API_KEY })

const chainMapping = {
    "mumbai": EvmChain.MUMBAI,
    "polygon": EvmChain.POLYGON,
    "ethereum": EvmChain.ETHEREUM
}

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
app.post('/deploy', (req, res) => {
    // Costs some money
    console.log(req.params);
    console.log(req.body);
    console.log(req.body.name);
    try {
        address = deployContract('NFT');
        if (address != null) {
            res.status(200).send("NFT Contract Deployed")
        }
    } catch (err) {
        console.log(err);
    }
})

// Calls smart contract mint method
// request body contains all params
app.post('/mint', (req, res) => {
    // Costs some money
    contractName = req.body.contractName //contract name that the user wants
    contractAddress = req.body.contractAddress //contract address from /deploy
    metadataURL = req.body.metadataURL //the image metadata from /generate or /upload
    mintNFT(contractName, contractAddress, metadataURL)
    res.status(200).send("NFT Minted")
})

// Calls smart contract safe mint method
// request body contains all params
app.post('/safeMint', (req, res) => {
    // Costs some money
    contractName = req.body.contractName //contract name that the user wants
    contractAddress = req.body.contractAddress //contract address from /deploy
    metadataURL = req.body.metadataURL //the image metadata from /generate or /upload
    valueAmount = req.body.valueAmount
    message = req.body.message
    safeMint(contractName, contractAddress, valueAmount, message, metadataURL)
    res.status(200).send("NFT Minted")
})

// Calls smart contract airdrop method
app.post('/airdrop', (req, res) => {
    // Costs some money
    body = res.json(req.body)
    contractName = null //contract name that the user wants
    contractAddresses = null //contract address from /deploy
    metadataURL = null //the image metadata from /generate
    receiverAddresses = req.body
    airdropNFT(contractName, contractAddress, metadataURL, receiverAddresses)
    res.status(200).send("NFT Airdropped")
})

// Deploys a smart contract to chain
app.post('/display/:address/:chainName', (req, res) => {
    nfts = null
    if (req.params.chainName in chainMapping) {
        nfts = displayNFT(req.params.address, chainMapping[req.params.chainName])
    } else {
        console.log("Incorrect chain")
    }
    res.status(200).send(nfts)
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