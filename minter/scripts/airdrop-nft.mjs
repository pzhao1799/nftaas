import {mintNFT} from "./mint-nft.mjs"

async function airdropNFT(contractName, contractAddress, metaDataURL, recevierAddresses) {

    for (var address of recevierAddresses) {
        mintNFT(contractName, contractAddress, metaDataURL, address)
            .then(() => process.exit(0))
            .catch((error) => {
                console.error(error);
                process.exit(1);
        });
    }
    
  

}

airdropNFT()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });