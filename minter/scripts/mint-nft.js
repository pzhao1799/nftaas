const { ethers } = require("hardhat")

const NFT_NAME = "NFT"
const CONTRACT_ADDRESS = "0x334CDe7E6Ab7bbdd7B9f76F1543d4741176bc4a1"
const META_DATA_URL = "ipfs://bafyreiarrnhpwygfgr3oye2ytwybiri5sqsdys35vdgjbm266xf6n7kofu/metadata.json"

async function mintNFT(contractName, contractAddress, metaDataURL, receiverAddress = null) {
    const contractFactory = await ethers.getContractFactory(contractName)
    const [owner] = await ethers.getSigners()
    receiver = receiverAddress ?? owner.address
    await contractFactory.attach(contractAddress).mintNFT(receiver, metaDataURL)
    console.log("NFT minted to: ", receiver)
}

// mintNFT(NFT_NAME, CONTRACT_ADDRESS, META_DATA_URL)
//    .then(() => process.exit(0))
//    .catch((error) => {
//        console.error(error);
//        process.exit(1);
//    });

module.exports = { mintNFT }