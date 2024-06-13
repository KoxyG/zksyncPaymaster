import * as hre from "hardhat";
import { getWallet, getProvider } from "./utils";
import { ethers } from "ethers";
import { utils } from "zksync-ethers";
import paymaster from "./paymaster";
import { getPaymasterParams } from "zksync-ethers/build/paymaster-utils";



const CONTRACT_ADDRESS = "0x5bb39E782bdba06C985218887ba67877b9C48D04"
const PAYMASTER_ADDRESS = "0x3818b14d3848b32bA30c1fc221eCb12a83d5609c"


if (!CONTRACT_ADDRESS || !PAYMASTER_ADDRESS) 
     throw "⛔️ Provide address of the contract to interact with!";

export default async function() {
     console.log(`Running script`)

     const contractArtifact = await hre.artifacts.readArtifact(
          "Greeter"
     );

     const contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          contractArtifact.abi,
          getWallet()
     );

     const provider = getProvider();
     let balanceBeforeTransaction = await provider.getBalance(getWallet().address)
     console.log(`Wallet balance before interaction: ${ethers.formatEther(balanceBeforeTransaction)} ETH`);

     const greetMesssage = "Hello this is koxy"

     const paymasterParams = getPaymasterParams(PAYMASTER_ADDRESS, {
          type: "General",
          innerInput: new Uint8Array(),
     })

     

     const transaction = await contract.setGreeting(greetMesssage, {
          
          customData: {
               paymasterParams,
             },
     })

     console.log(`Transaction hash of setting new message: ${transaction.hash}`);

     await transaction.wait();

     let balanceAfterTransaction = await provider.getBalance(getWallet().address);
     console.log(`Wallet balance after interaction: ${ethers.formatEther(balanceAfterTransaction)} ETH`);
}