import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import { Button, Alert, Popconfirm } from "antd";
import PhraseBox from "../components/PhraseBox";
import { useGlobalState } from "../context";
import { LoadingOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";

import * as Bip39 from "bip39";
import * as solanaWeb3 from '@solana/web3.js';

const Phrase: NextPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const { setAccount, mnemonic, setMnemonic } = useGlobalState();

  const router = useRouter();

  useEffect(() => {
    // Generate a Mnemonic phrase --
    const generatedMnemonic = Bip39.generateMnemonic();
    // Convert the generated Mnemonic phrase into 64 bit Unit8Array --
    let seed = Bip39.mnemonicToSeedSync(generatedMnemonic);
    console.log("Seed : ", seed);
    // Slice 64 bit Unit8Array as fromSeed method requires 32 bit Unit8Array --
    seed = seed.slice(0, 32);
    // Create account by calling fromSeed method --
    const newAccount = solanaWeb3.Keypair.fromSeed(seed);

    let keys = {
      "generatedMnemonic": generatedMnemonic,
      "publicKey": Array.from(newAccount.publicKey.toBytes()),
      "secretKey": Array.from(newAccount.secretKey)
    };
    console.log(keys);

    setMnemonic(generatedMnemonic);
    setAccount(newAccount);
  }, []);

  const showPopconfirm = () => {
    setVisible(true);
  };

  const handleOk = () => {
    setLoading(true);
    router.push("/wallet");
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const warning =
    "Keep this phrase secret and safe. This is the only way for you to access your digital assets. Moreover, anyone can access your assets with it! Think of it as the password to your online bank account.";

  return (
    <>
      <h1 className={"title"}>Secret Recovery Phrase</h1>

      <p>
        This recovery phrase is generated with your private keys and can be used
        to recover your account.
      </p>

      <Alert message={warning} type="warning" />

      <p>
        Once you have stored this phrase somewhere safe, click finish to go to
        your wallet.
      </p>

      <PhraseBox mnemonic={mnemonic}></PhraseBox>

      {!loading && (
        <Popconfirm
          title="Did you copy the phrase?"
          visible={visible}
          onConfirm={handleOk}
          okButtonProps={{ loading: loading }}
          onCancel={handleCancel}
          cancelText={"No"}
          okText={"Yes"}
        >
          <Button type="primary" onClick={showPopconfirm}>
            Finish
          </Button>
        </Popconfirm>
      )}

      {loading && <LoadingOutlined style={{ fontSize: 24 }} spin />}
    </>
  );
};

export default Phrase;
