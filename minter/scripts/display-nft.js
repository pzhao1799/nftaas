const Moralis = require('moralis').default

// Displays all NFTs owned by an address on a specified chain
async function displayNFT(address, chain) {
    nfts = await Moralis.EvmApi.nft.getWalletNFTs({
        address,
        chain,
    })
    return nfts
}

// displayNFT(0x93E7f6E488D76291663c6B11a0151E6a0a63ec74, "0x13881")
//     .then(() => process.exit(0))
//     .catch((error) => {
//         console.error(error);
//         process.exit(1);
//     });

module.exports = { displayNFT }