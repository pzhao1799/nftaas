require('dotenv').config();
const Moralis = require('moralis').default
const bodyParser = require('body-parser')
const { EvmChain } = require('@moralisweb3/evm-utils')
const { NFTStorage, File } = require('nft.storage')
const express = require('express')
const cors = require('cors')
const mintNFT = require('../scripts/mint-nft.js').mintNFT
const safeMint = require('../scripts/mint-nft.js').safeMint
const transferFrom = require('../scripts/mint-nft.js').transferFrom
const unwrapGiftCard = require('../scripts/mint-nft.js').unwrapGiftCard
const airdropNFT = require('../scripts/airdrop-nft.js').airdropNFT
const storeAsset = require('../scripts/store-asset.js').storeAsset
const deployContract = require('../scripts/deploy-contract.js').deployContract
const deployGiftCardContract = require('../scripts/deploy-contract.js').deployGiftCardContract
const displayNFT = require('../scripts/display-nft.js').displayNFT
const requestMessage = require('../scripts/auth/request-message.js').requestMessage
const authorize = require('../scripts/auth/authorize.js').authorize
// const https = require("https");
// const fs = require("fs");

const app = express()
const port = 3000
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.options('*', cors())
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

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
    const name = req.body.name;
    const symbol = req.body.symbol;

    try {
        deployContract('NFT', name, symbol).then((address) => {
            if (address != null) {
                res.status(200).send(address);
            }
        }) ;
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
    console.log(req.body)
    mintNFT('NFT', contractAddress, metadataURL)
    res.status(200).send("NFT Minted")
})

// Calls smart contract airdrop method
app.post('/airdrop', (req, res) => {
    // Costs some money
    contractName = req.body.contractName //contract name that the user wants
    contractAddress = req.body.contractAddress //contract address from /deploy
    metadataURL = req.body.metadataURL //the image metadata from /generate
    receiverAddresses = req.body.receiverAddresses
    airdropNFT(contractName, contractAddress, metadataURL, receiverAddresses)
    res.status(200).send("NFT Airdropped")
})

// Displays nfts
app.post('/display/:address/:chainName', (req, res) => {
    nfts = null
    if (req.params.chainName in chainMapping) {
        nfts = displayNFT(req.params.address, chainMapping[req.params.chainName])
    } else {
        console.log("Incorrect chain")
    }
    res.status(200).send(nfts)
})

/**
 * GIFT CARD NFT APIS
 */

// Deploys a smart contract to chain
app.post('/deploygiftcard', (req, res) => {
    console.log(req);

    // Costs some money
    const name = req.body.name;
    const symbol = req.body.symbol;
    try {
        // TODO: change this to our actual base site.
        deployGiftCardContract('GiftCardNFT', 'https://test.com', name, symbol).then((address) => {
            if (address != null) {
                res.status(200).send(`NFT Contract Deployed to: ${address}`);
            }
        });
    } catch (err) {
        console.log(err);
    }
})

// Calls smart contract safe mint method
// request body contains all params
app.post('/safemint', (req, res) => {
    // Costs some money
    contractAddress = req.body.contractAddress //contract address from /deploy
    metadataURL = req.body.metadataURL //the image metadata from /generate or /upload
    valueAmount = req.body.valueAmount // The amount
    message = req.body.message // the message on the card
    safeMint('GiftCardNFT', contractAddress, metadataURL, valueAmount, message)
    res.status(200).send("NFT Minted")
})

// TODO: catch failure
app.post('/unwrap', (req, res) => {
    contractAddress = req.body.contractAddress //contract address from /deploy
    tokenId = req.body.tokenId
    console.log(req.body)
    unwrapGiftCard('GiftCardNFT', contractAddress, tokenId);
    res.status(200).send("Unwrapped gift card")
})

// TODO: write the transfer function
app.post('/sendgift', (req, res) => {
    tokenId = req.body.tokenId
    targetAddress = req.body.targetAddress
    contractAddress = req.body.contractAddress
    console.log(req.body)
    transferFrom('GiftCardNFT', contractAddress, targetAddress, tokenId);
});

// Request auth message from moralis
app.post('/auth/request-message', (req, res) => {
    console.log("Requesting a message");
    requestMessage(req.body.address, req.body.chain, req.body.network)
        .then((message) => {
            res.status(200).send(message);
        }).catch((error) => {
            res.status(400).json({ error });
        });
})

// Authorize using moralis
app.post('/auth/authorize', (req, res) => {
    console.log("Authorizing user");
    authorize(req.body)
        .then((user) => {
            console.log("User authorized");
            res.status(200).send(user)
        }).catch((error) => {
            res.status(400).json({ error });
        });
})

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})


// Create a NodeJS HTTPS listener on port 3443 that points to the Express app
// Use a callback function to tell when the server is created.
// https
//   .createServer(
//     		// Provide the private and public key to the server by reading each
// 		// file's content with the readFileSync() method.
//         {
//             key: fs.readFileSync("key.pem"),
//             cert: fs.readFileSync("cert.pem"),
//           },
//           app
//   )
//   .listen(3443, ()=>{
//     console.log('server is runing at port 3443')
//   });
//
// // Create an try point route for the Express app listening on port 3443.
// // This code tells the service to listed to any request coming to the / route.
// // Once the request is received, it will display a message "Hello from express server."
// app.get('/', (req, res)=>{
//     res.send("Hello from express server.")
// })

const initServer = async () => {
    await Moralis.start({
        apiKey: process.env.MORALIS_API_KEY
    })
}

initServer()