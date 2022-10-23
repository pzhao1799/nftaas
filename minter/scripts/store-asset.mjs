import { NFTStorage, File } from "nft.storage"
import fs from 'fs'

export async function storeAsset(nftName, description, image, nftStorageClient) {
   const metadata = await nftStorageClient.store({
       name: nftName,
       description: description,
       image: image
   })
   console.log("Metadata stored on Filecoin and IPFS with URL:", metadata.url)
   return metadata.url
}

storeAsset("MyNFT", "My random NFT!")
   .then(() => process.exit(0))
   .catch((error) => {
       console.error(error);
       process.exit(1);
   });