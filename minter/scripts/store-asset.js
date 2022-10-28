const { NFTStorage, File } = require('nft.storage')

async function storeAsset(nftName, description, image, nftStorageClient) {
   const metadata = await nftStorageClient.store({
       name: nftName,
       description: description,
       image: image
   })
   console.log("Metadata stored on Filecoin and IPFS with URL:", metadata.url)
   return metadata.url
}

// storeAsset("MyNFT", "My random NFT!", "image", new NFTStorage({ token: process.env.NFT_STORAGE_API_KEY }))
//    .then(() => process.exit(0))
//    .catch((error) => {
//        console.error(error);
//        process.exit(1);
//    });

module.exports = { storeAsset }