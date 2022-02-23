import { ethers } from "ethers";
import { derived, Readable, writable } from "svelte/store";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";

export async function connect() {
  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        infuraId: "INFURA ID",
      },
    },
  };

  const web3Modal = new Web3Modal({
    network: "mainnet",
    providerOptions,
  });

  const instance = await web3Modal.connect();
  provider.set(new ethers.providers.Web3Provider(instance));
  window.ethereum.on("accountsChanged", (accounts: string[]) => {
    accountsChanged.set(Date.now());
    console.log(accounts);
  });
  window.ethereum.on("chainChanged", (chainId: number) => {
    accountsChanged.set(Date.now());
    console.log(chainId);
  });
}

export const provider = writable<ethers.providers.Web3Provider | null>();
export const accountsChanged = writable(0);

derived(provider, ($provider) => {
  console.log("provider?");
  if ($provider) {
    console.log("provider");
    $provider.on("accountsChanged", (accounts: string[]) => {
      console.log(accounts);
    });
    return () => $provider.off("accountsChanged");
  }
});

export const signer: Readable<ethers.providers.JsonRpcSigner | null> = derived(
  [provider, accountsChanged],
  ([$provider], set) => {
    if ($provider) {
      set($provider.getSigner());
    } else {
      set(null);
    }
  }
);

export const address: Readable<string | null> = derived(
  signer,
  ($signer, set) => {
    if ($signer) {
      $signer.getAddress().then(set);
    } else {
      set(null);
    }
  }
);

export const chainId: Readable<number | null> = derived(
  signer,
  ($signer, set) => {
    if ($signer) {
      $signer.getChainId().then(set);
    } else {
      set(null);
    }
  }
);

export const network: Readable<string | null> = derived(
  provider,
  ($provider, set) => {
    if ($provider) {
      $provider.getNetwork().then((network) => set(network.name));
    } else {
      set(null);
    }
  }
);

export const balance: Readable<ethers.BigNumber | null> = derived(
  signer,
  ($signer, set) => {
    if ($signer) {
      $signer.getBalance().then(set);
    } else {
      set(null);
    }
  }
);
