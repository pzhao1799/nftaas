import { NFTStorage, File } from "nft.storage"
import fs from 'fs'
import dotenv from 'dotenv'
dotenv.config()

const API_KEY = process.env.NFT_STORAGE_API_KEY

export async function storeAsset(nftName, description) {
   const client = new NFTStorage({ token: API_KEY })
   const metadata = await client.store({
       name: nftName,
       description: description,
       image: new File(
           [await fs.promises.readFile('assets/nft.png')],
           'nft.png',
           { type: 'image/png' }
       ),
   })
   console.log("Metadata stored on Filecoin and IPFS with URL:", metadata.url)
}

storeAsset("MyNFT", "My random NFT!")
   .then(() => process.exit(0))
   .catch((error) => {
       console.error(error);
       process.exit(1);
   });