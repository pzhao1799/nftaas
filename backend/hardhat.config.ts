/**
* @type import('hardhat/config').HardhatUserConfig
*/
require('dotenv').config();
require("@nomiclabs/hardhat-ethers");
const { API_URL, PRIVATE_TEST_KEY, MUMBAI_API_URL } = process.env;
module.exports = {
   solidity: "0.7.3",
   defaultNetwork: "mumbai",
   networks: {
      hardhat: {},
      goerli: {
         url: API_URL,
         accounts: [`0x${PRIVATE_TEST_KEY}`]
      },
      mumbai: {
        url: MUMBAI_API_URL,
        accounts: [`0x${PRIVATE_TEST_KEY}`]
     },
   },
}