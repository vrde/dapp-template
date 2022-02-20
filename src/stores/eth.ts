import { ethers } from "ethers";
import { writable } from "svelte/store";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";

export async function connect() {
  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider, // required
      options: {
        infuraId: "INFURA_ID", // required
      },
    },
  };

  const web3Modal = new Web3Modal({
    network: "mainnet",
    providerOptions,
  });

  let instance;
  try {
    instance = await web3Modal.connect();
  } catch (e) {
    console.log("User rejected the request", e);
    return;
  }
  const provider = new ethers.providers.Web3Provider(instance);
  signer.set(provider.getSigner());
}

export const signer = writable<ethers.providers.JsonRpcSigner>();
