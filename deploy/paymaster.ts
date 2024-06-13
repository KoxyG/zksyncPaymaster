import { Wallet } from "zksync-ethers";
import { deployContract, getWallet, getProvider } from "./utils";
import { ethers } from "ethers";

export default async function () {
     const contractArtifactName = "GeneralPaymaster";
     const constructorArgs = []
     const contract = await deployContract(contractArtifactName, constructorArgs);

     const wallets = getWallet();
     const provider = getProvider();

     await (
          await wallets.sendTransaction({
               to: contract.target,
               value: ethers.parseEther("0.0001"),
          })
     ).wait()

     let paymasterBalance = await provider.getBalance(contract.target.toString());

     console.log(`Paymaster EH balance: ${paymasterBalance.toString()}`);
}