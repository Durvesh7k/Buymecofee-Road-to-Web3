const hre = require('hardhat');

async function printBalance(addresses) {
    let idx = 0;
    for(const address of addresses){
        const balanceBigInt = await hre.ethers.provider.getBalance(address)
        const balance = await hre.ethers.utils.formatEther(balanceBigInt)
        console.log(`This is the balance of this account ${address} is: `,balance );
        idx++;
    }
}

async function printMemos(memos){
    for(const memo of memos){
        const tipper = memo.from;
        const name = memo.name;
        const message  = memo.message;
        const timestamp = memo.timestamp;
        console.log(`${name} having address ${tipper} said: ${message} at ${timestamp.toString()}`)
    }

}

const Main = async () => {
    const [owner, tipper, tipper1, tipper2] = await hre.ethers.getSigners();
    const coffe = await hre.ethers.getContractFactory('Buymecofee');
    const contract = await coffe.deploy();
    await contract.deployed();


    const addresses = [owner.address, tipper.address, tipper1.address, tipper2.address, contract.address];
    console.log(contract.address);
    

    console.log("<-----------Intial Balance------------------>")
    await printBalance(addresses);

    const tip = {value: hre.ethers.utils.parseEther("1")}

    await contract.connect(tipper).buyme("Ayush", "hello good work", tip);
    await contract.connect(tipper1).buyme("Om", "Nice work", tip);
    await contract.connect(tipper2).buyme("Atharva", "Good to go", tip);

    console.log("<-----------Balance after tipping------------------>")
    await printBalance(addresses)

    await contract.connect(tipper).withdraw();
    console.log("<-----------Balance after withdraw------------------>")
    await printBalance(addresses)

    console.log("<---------------memo list------------------>")

    const memos = await contract.getMemos();
    await printMemos(memos);

}

const runMain = async () => {
    try {
        await Main();
        process.exit(1);
    }
    catch (err) {
        console.error(err);
        process.exit(0);
    }
}

runMain();