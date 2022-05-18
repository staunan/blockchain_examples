import React, { useState } from "react";
import { Cluster, Keypair, Ed25519Keypair } from "@solana/web3.js";
import 'antd/dist/antd.css';
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { GlobalContext } from "../context";
import Layout from '../components/Layout';

import {accounts} from "../context/accounts";

function MyApp({ Component, pageProps }: AppProps) {

  let defaultAccount: Ed25519Keypair = {
    "publicKey": Uint8Array.from(accounts[2].publicKey),
    "secretKey": Uint8Array.from(accounts[2].secretKey)
  };

  const [network, setNetwork] = useState<Cluster | undefined>("devnet");
  const [account, setAccount] = useState<Keypair | null>(new Keypair(defaultAccount));
  const [mnemonic, setMnemonic] = useState<string | null>(null);
  const [balance, setBalance] = useState<number | null>(null);

  return (
    <GlobalContext.Provider value={{ network, setNetwork, account, setAccount, mnemonic, setMnemonic, balance, setBalance }}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </GlobalContext.Provider>
  )
}
export default MyApp
