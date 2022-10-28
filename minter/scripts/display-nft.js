const Moralis = require('moralis')

// Displays all NFTs owned by an address on a specified chain
async function displayNFT(address, chain) {
    nfts = await Moralis.EvmApi.nft.getWalletNFTs({
        address,
        chain,
    })
}

displayNFT("0x", "test")
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

module.exports = { displayNFT }