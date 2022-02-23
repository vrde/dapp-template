import { ethers } from "ethers";
import { derived, Readable, writable } from "svelte/store";
import { connectWeb3Modal, initWeb3Modal } from "./web3Modal";

export async function init() {
  const modal = await initWeb3Modal();
  if (modal.cachedProvider) {
    await connect();
  }
}

export async function connect() {
  const connection = await connectWeb3Modal();
  provider.set(new ethers.providers.Web3Provider(connection));
  connection.on("accountsChanged", (accounts: string[]) => {
    accountsChanged.set(Date.now());
  });
  connection.on("chainChanged", (chainId: number) => {
    connect();
  });
}

export const provider = writable<ethers.providers.Web3Provider | null>();

export const accountsChanged = writable(0);

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
