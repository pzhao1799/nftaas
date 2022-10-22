import {mintNFT} from "./mint-nft.mjs"

async function airdropNFT(contractName, contractAddresses, metaDataURL) {

    for (var contractAddress of contractAddresses) {
        mintNFT(contractName, contractAddress, metaDataURL)
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