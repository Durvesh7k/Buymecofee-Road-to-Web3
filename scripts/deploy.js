const hre = require('hardhat');

const Main = async () => {
  const [deployer] = await hre.ethers.getSigners();
  const coffe = await hre.ethers.getContractFactory('Buymecofee');
  const coffeContract = await coffe.deploy();
  await coffeContract.deployed();


  console.log("The contract is deployed by: ", deployer.address);
  console.log("The contract address is: ", coffeContract.address);

}

const runMain = async() => {
  try{
    await Main();
    process.exit(1);
  }
  catch(err){
    console.error(err);
    process.exit(0);
  }
}

runMain();