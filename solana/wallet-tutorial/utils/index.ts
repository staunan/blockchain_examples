// Import any additional classes and/or functions needed from Solana's web3.js library as you go along:
import { Cluster, Keypair } from "@solana/web3.js";
import { message } from "antd";

import * as solanaWeb3 from '@solana/web3.js';

// Implement a function that gets an account's balance
const refreshBalance = async (network: Cluster | undefined, account: Keypair | null) => {
  if (!account) return 0;
  try {
    const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl(network), "confirmed");
    console.log(connection);
    const publicKey = account.publicKey;
    const balance = await connection.getBalance(publicKey);
    console.log("Balance : " + balance);
    return balance;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown Error";
    message.error(`Balance refresh failed: ${errorMessage}`);
    return 0;
  }
};

// Implement a function that airdrops SOL into devnet account
const handleAirdrop = async (network: Cluster, account: Keypair | null) => {
  if (!account) return;
  try {
    const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl(network), "confirmed");
    const publicKey = account.publicKey;

    const confirmation = await connection.requestAirdrop(
      publicKey,
      solanaWeb3.LAMPORTS_PER_SOL
    );
    await connection.confirmTransaction(confirmation, "confirmed");
    return await refreshBalance(network, account);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown Error";
    message.error(`Airdrop failed: ${errorMessage}`);
  }
};

export { refreshBalance, handleAirdrop };
