const { ethers } = require("hardhat")

async function deployContract(contractName, nftName, nftSymbol) {
    const contractFactory = await ethers.getContractFactory(contractName)
    const contract = await contractFactory.deploy(nftName, nftSymbol)
    await contract.deployed()
    // This solves the bug in Mumbai network where the contract address is not the real one
    const txHash = contract.deployTransaction.hash
    const txReceipt = await ethers.provider.waitForTransaction(txHash)
    const contractAddress = txReceipt.contractAddress
    console.log("Contract deployed to address:", contractAddress)
    return contractAddress
}

async function deployGiftCardContract(contractName, baseURI, nftName, nftSymbol) {
    const contractFactory = await ethers.getContractFactory(contractName)
    const contract = await contractFactory.deploy(baseURI, nftName, nftSymbol)
    await contract.deployed()
    // This solves the bug in Mumbai network where the contract address is not the real one
    const txHash = contract.deployTransaction.hash
    const txReceipt = await ethers.provider.waitForTransaction(txHash)
    const contractAddress = txReceipt.contractAddress
    console.log("Contract deployed to address:", contractAddress)
    return contractAddress
}

// deployContract("NFT")
//     .then(() => process.exit(0))
//     .catch((error) => {
//         console.error(error);
//         process.exit(1);
//     });

// deployContract("GiftCardNFT")
//     .then(() => process.exit(0))
//     .catch((error) => {
//         console.error(error);
//         process.exit(1);
//     });

module.exports = { deployContract, deployGiftCardContract }