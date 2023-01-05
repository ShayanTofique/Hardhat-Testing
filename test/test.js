// To test contract run command : npx hardhat test

const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");

// console.log(time);
// console.log(loadFixtures);

const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");

// console.log(anyValue); //this give us function for transfer that we utilize to transfer funds 

const { expect } = require("chai");  //using expect we can compare values see chai documentation
const { ethers } = require("hardhat");

//In hardhat we have a word "describe" form MOCHA library 

describe("myTest", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployOneYearLockFixture() {
    const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
    const ONE_GWEI = 1_000_000_000;

    const lockedAmount = ONE_GWEI;
    const unlockTime = (await time.latest()) + ONE_YEAR_IN_SECS;

    // Contracts are deployed using the first signer/account by default
    //hardhat gives us total 20 accounts;
    const [owner, otherAccount] = await ethers.getSigners();

    const MyTest = await ethers.getContractFactory("MyTest");
    const myTest = await MyTest.deploy(unlockTime, { value: lockedAmount }); //Here we are sending values to construtor during deployment as we do in remix ide 

    return { myTest, unlockTime, lockedAmount, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should set the right unlockTime", async function () {
      const { myTest, unlockTime } = await loadFixture(deployOneYearLockFixture);

      expect(await myTest.unlockedTime()).to.equal(unlockTime);
    });

    it("Should set the right owner", async function () {
      const { myTest, owner } = await loadFixture(deployOneYearLockFixture);

      expect(await myTest.owner()).to.equal(owner.address);
    });
    it("Should receive and share the funds to myTest", async function () {
      const { myTest, lockedAmount } = await loadFixture(deployOneYearLockFixture);
      // console.log(lockedAmount);
      // const contractBal = await ethers.provider.getBalance(myTest.address);
      // console.log(contractBal.toNumber());
      expect(await ethers.provider.getBalance(myTest.address)).to.equal(lockedAmount);
    });
    //checking the required statement
    it("Should fail if unlocked time is not in the future", async function () {
      // const latestTime = time.latest()    //future time
      // console.log(latestTime / 60 / 60 / 60 / 24);
      const { myTest } = await loadFixture(deployOneYearLockFixture);
      const latestTime = time.latest();
      expect(await latestTime).to.be.revertedWith("unlockedTime must be in future");
    });
  });

  describe('Withdraw', function () {
    describe('Validations', function () {
      it("Should reverted if called too soon", async function () {
        const { myTest } = await loadFixture(deployOneYearLockFixture);
        await expect(myTest.Withdraw()).to.be.revertedWith("Wait till the time period completed!");
      });
    });
    it("Should reverted if someone withdraw funds other than the owner", async function () {
      const { myTest, unlockTime, otherAccount } = await loadFixture(deployOneYearLockFixture);
      await time.increaseTo(unlockTime)
      await expect(myTest.connect(otherAccount).Withdraw()).to.be.revertedWith("you cannot withdraw funds!");
    });

  });
  describe('Events', function () {
    it("Should emit the events on withdrawals ", async function () {
      const { myTest, unlockTime } = await loadFixture(deployOneYearLockFixture);
      await time.increaseTo(unlockTime);
      await expect(myTest.Withdraw()).to.emit(myTest, "withdraw");
    });
    it("Checking events with arguments", async function () {
      const { myTest, unlockTime ,lockedAmount} = await loadFixture(deployOneYearLockFixture);
      await time.increaseTo(unlockTime);
      await expect(myTest.Withdraw())
      .to.emit(myTest, "withdraw")
      .withArgs( anyValue,lockedAmount); //we have to pass arguments here
    });

  });
});
