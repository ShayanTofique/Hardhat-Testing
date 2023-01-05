//To deploy contract use command :  npx hardhat run --network localhost scripts/deploy.js

const hre = require("hardhat");
// console.log(hre)

async function main(){
    const currentTimestameInSeconds = Math.round(Date.now() / 1000); //Js function to get the current timestamp
    const ONE_YEAR_IN_SECONDS = 365 * 24 * 60 * 60; //to allow the owner to withdraw funds after one year
    const unlockedTime = currentTimestameInSeconds + ONE_YEAR_IN_SECONDS;  //future which we have to paas in the contracr

    const lockedAmount = hre.ethers.utils.parseEther("1"); //ether.js part : converting amount to parse ether : 1 ether

    // console.log(currentTimestameInSeconds);
    // console.log(ONE_YEAR_IN_SECONDS);
    // console.log(unlockedTime);
    // console.log(lockedAmount);

    const MyTest = await hre.ethers.getContractFactory("MyTest"); 
    const myTest = await MyTest.deploy(unlockedTime , { value : lockedAmount}); //Here we are sending values to construtor during deployment as we do in remix ide 

    await myTest.deployed(); //here deploying the contract

    console.log(`Contract contain 1 Eth & address : ${myTest.address}`);

    console.log(myTest); //from here e can easily find all the data about te contract
    //All the data hich is defined in the smart contract all you can find in the instance and e cam utilize that , the data we utiize to fetch the data and to connect with the frontend;
}

//calling function : because its a async function se we have to catch errors
main().catch((error)=>{
    console.log(error);
    process.exitCode = 1; //once deployement is done we have to stop the process : providing exit code
})

