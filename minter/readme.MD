Gift card contract address mumbai: 0x069eEc21e749624ee9624b7A823b0bf7275fbcA0

hardhat deployment commands:

npx hardhat compile
npx hardhat run scripts/deploy.js

curl -X POST http://localhost:3000/deploy -H 'Content-Type: application/json' -d {"name":"test"}
curl -X POST http://localhost:3000/deploy?name=test
curl -X POST http://localhost:3000/deploy?name=nft

curl -H 'Content-Type:application/json' -d '{"name":"test"}' -X POST http://localhost:3000/deploy
curl -XPOST localhost:3000/deploy -d '{"name":"test"}' -H 'content-type:application/json; charset=utf-8'