import Moralis from 'moralis';

// Displays all NFTs owned by an address on a specified chain
export async function displayNFT(address, chain) {
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