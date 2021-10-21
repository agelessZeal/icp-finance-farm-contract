const hre = require("hardhat");
require('dotenv').config();

const {ethers} = hre
const {parseEther, formatEther} = ethers.utils;

const {MaxUint256} = ethers.constants

const depositAmount = '2000000000000'

const deployer = new ethers.Wallet(process.env.PRIVATE_KEY, ethers.provider)

async function main() {
    // const [deployer] = await ethers.getSigners()
    // console.log("owner address", owner.address)

    const bbcToken = await ethers.getContractAt("IERC20", process.env.BBC_TOKEN, deployer);

    const MasterChef = await ethers.getContractFactory("MasterChefM", deployer);

    console.log(deployer.address, formatEther(await deployer.getBalance()));

    console.log("Deploy params bbcToken", bbcToken.address);

    const bigbar = await Bigboybar.deploy(bbcToken.address);
    await bigbar.deployed();

    console.log("bigbar Contract deployed to ", bigbar.address)

    const masterChef = await MasterChef.deploy(bbcToken.address,bigbar.address,deployer.address,'2000000000000000000','11923071');

    await masterChef.deployed();

    console.log("masterChef Contract deployed to ", masterChef.address)

    console.log("bbc balance",formatEther(await bbcToken.balanceOf(deployer.address)))

    let tx

    tx = await masterChef.add(300,bbcBNBLp.address,true)
    await tx.wait()

    console.log("add BBC-BNB pair lp",bbcBNBLp.address)


    tx = await bbcToken.transfer(bigbar.address,  parseEther('100'))
    await tx.wait()

    console.log("bigbar transfer bbc")

    tx = await bbcToken.approve(masterChef.address, MaxUint256)
    await tx.wait()

    tx = await bbcBNBLp.approve(masterChef.address, MaxUint256)
    await tx.wait()

    console.log("Approve finished")

    tx = await masterChef.setBBCReferral(referral.address)
    await tx.wait()
    console.log("setBBCReferral finished",referral.address)

    tx = await masterChef.setReferralCommissionRate(200)
    await tx.wait()

    console.log("setReferralCommissionRate finished")


    tx = await bigbar.transferOwnership(masterChef.address)
    await tx.wait()
    console.log("bigbar transferOwnership finished")

    tx = await referral.updateOperator(masterChef.address,true)
    await tx.wait()

    console.log("updateOperator finished")


    tx = await masterChef.enterStaking( parseEther('100'), '0x2402aa453F593fF39f443B177c84413b7Eb7971D')
    await tx.wait()

    console.log("enterStaking finished")

    // tx = await masterChef.enterStaking( parseEther('10'), '0x2402aa453F593fF39f443B177c84413b7Eb7971D')
    // await tx.wait()

    // console.log("second enterStaking finished")

    // tx = await masterChef.leaveStaking( parseEther('10'))
    // await tx.wait()
    //
    // console.log("second leaveStaking finished")
    //
    // tx = await masterChef.deposit(1, parseEther('1'), '0x2402aa453F593fF39f443B177c84413b7Eb7971D')
    // await tx.wait()
    //
    // console.log("deposit finished")
    //
    // tx = await masterChef.withdraw(1, parseEther('1'))
    // await tx.wait()
    //
    // console.log("withdraw finished")
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
