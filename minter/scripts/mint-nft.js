const { ethers } = require("hardhat")

const NFT_NAME = "NFT"
const CONTRACT_ADDRESS = "0x334CDe7E6Ab7bbdd7B9f76F1543d4741176bc4a1"
const META_DATA_URL = "ipfs://bafyreiarrnhpwygfgr3oye2ytwybiri5sqsdys35vdgjbm266xf6n7kofu/metadata.json"

const GIFT_CARD_NFT = "GiftCardNFT"
const CARD_NFT_CONTRACT_ADDRESS = "0x069eEc21e749624ee9624b7A823b0bf7275fbcA0"

async function mintNFT(contractName, contractAddress, metaDataURL, receiverAddress = null) {
    const contractFactory = await ethers.getContractFactory(contractName)
    const [owner] = await ethers.getSigners()
    receiver = receiverAddress ?? owner.address
    await contractFactory.attach(contractAddress).mintNFT(receiver, metaDataURL)
    console.log("NFT minted to: ", receiver)
}

async function safeMint(contractName, contractAddress, metaDataURL, value_amount, message, receiverAddress = null) {
    const contractFactory = await ethers.getContractFactory(contractName)
    const options = {value: ethers.utils.parseEther(value_amount)}
    const [owner] = await ethers.getSigners()
    receiver = receiverAddress ?? owner.address
    await contractFactory.attach(contractAddress).safeMint(receiver, metaDataURL, message, owner.address, options)
    console.log("NFT minted to: ", receiver, "with value: ", value_amount)
}

async function unwrapGiftCard(contractName, contractAddress, tokenId) {
    const contractFactory = await ethers.getContractFactory(contractName)
    // const [owner] = await ethers.getSigners()
    await contractFactory.attach(contractAddress).unwrapGiftCard(tokenId);
    console.log("Gift card nft unwrapped.")
}

async function transferFrom(contractName, contractAddress, targetAddress, tokenId) {
    const contractFactory = await ethers.getContractFactory(contractName)
    const [owner] = await ethers.getSigners()
    await contractFactory.attach(contractAddress).transferFrom(owner.address, targetAddress, tokenId);
    console.log("NFT transfered to: ", targetAddress)
}

// mintNFT(NFT_NAME, CONTRACT_ADDRESS, META_DATA_URL)
//    .then(() => process.exit(0))
//    .catch((error) => {
//        console.error(error);
//        process.exit(1);
//    });

// safeMint(GIFT_CARD_NFT, CARD_NFT_CONTRACT_ADDRESS, META_DATA_URL, "0.1", "happyholidays")
//    .then(() => process.exit(0))
//    .catch((error) => {
//        console.error(error);
//        process.exit(1);
//    });

module.exports = { mintNFT, safeMint, unwrapGiftCard, transferFrom }