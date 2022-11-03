Gift card contract address mumbai: 0x069eEc21e749624ee9624b7A823b0bf7275fbcA0

hardhat deployment commands:

npx hardhat compile
npx hardhat run scripts/deploy.js

curl -X POST http://localhost:3000/deploy -H 'Content-Type: application/json' -d {"name":"test"}
curl -X POST http://localhost:3000/deploy?name=test
curl -X POST http://localhost:3000/deploy?name=nft

curl -H 'Content-Type:application/json' -d '{"name":"tianyou", "symbol": "ty"}' -X POST http://localhost:3000/deploy
curl -XPOST localhost:3000/deploy -d '{"name":"test"}' -H 'content-type:application/json; charset=utf-8'

0xf015828235b030363757b79247137c96Aad82c84

curl -H 'Content-Type:application/json' -d '{"contractName":"tianyou","contractAddress":"0xf015828235b030363757b79247137c96Aad82c84","metadataURL":"https://bafybeihm3rhnpja7ce2basqmauh5vf3bjqtpcdtvjrdjodmq2ws3snlqne.ipfs.nftstorage.link/nft-2.png"}' -X POST http://localhost:3000/mint

  contractName = req.body.contractName //contract name that the user wants
    contractAddress = req.body.contractAddress //contract address from /deploy
    metadataURL = req.body.metadataURL //the image metadata from /generate or /upload


curl -H 'Content-Type:application/json' -d '{"contractAddress":"0x069eEc21e749624ee9624b7A823b0bf7275fbcA0","tokenId":0}' -X POST http://localhost:3000/unwrap

curl -H 'Content-Type:application/json' -d '{"targetAddress":"0xFdAaEdB23a680757B8A7427BaF775b7b7204D4fc","tokenId":"3","contractAddress":"0x069eEc21e749624ee9624b7A823b0bf7275fbcA0"}' -X POST http://localhost:3000/sendgift

TEST WALLET2 = 0xFdAaEdB23a680757B8A7427BaF775b7b7204D4fc

curl -H 'Content-Type:application/json' -d '{"contractAddress":"0x069eEc21e749624ee9624b7A823b0bf7275fbcA0","metadataURL":"https://bafybeihm3rhnpja7ce2basqmauh5vf3bjqtpcdtvjrdjodmq2ws3snlqne.ipfs.nftstorage.link/nft-2.png","valueAmount":"0.1","message":"merry christmas"}' -X POST http://localhost:3000/safemint