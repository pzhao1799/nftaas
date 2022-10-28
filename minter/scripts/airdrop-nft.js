const mintNFT = require('../scripts/mint-nft.js').mintNFT

async function airdropNFT(contractName, contractAddress, metaDataURL, recevierAddresses) {

    for (let i = 0; i < recevierAddresses.length; i++) {
        await mintNFT(contractName, contractAddress, metaDataURL, recevierAddresses[i])
            .then(() => process.exit(0))
            .catch((error) => {
                console.error(error);
                process.exit(1);
        });
    }
}

// airdropNFT("name", "address", "url", ["test", "test2", "test3"])
//   .then(() => process.exit(0))
//   .catch((error) => {
//     console.error(error);
//     process.exit(1);
//   });

module.exports = { airdropNFT }
