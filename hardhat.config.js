require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  networks: {
    mumbai: {
      url: process.env.NEXT_PUBLIC_ALCHEMY_URL,
      accounts: [process.env.NEXT_PUBLIC_PRIVATE_KEY]
    }
  }
};
