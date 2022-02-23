import { ethers, Signer, BigNumber } from "ethers";
import { derived, Readable, writable } from "svelte/store";
import { connectWeb3Modal, initWeb3Modal } from "./web3Modal";

export async function init() {
  const modal = await initWeb3Modal();
  if (modal.cachedProvider) {
    try {
      await connect();
    } catch (e) {
      console.log("Cannot autoconnect:", e);
      modal.clearCachedProvider();
    }
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

export async function disconnect() {}

export const provider = writable<ethers.providers.Web3Provider | null>();

export const accountsChanged = writable(0);

export const signer: Readable<Signer | null> = derived(
  [provider, accountsChanged],
  ([$provider], set) => {
    if ($provider) {
      (async () => {
        const _signer = $provider.getSigner();
        let _address: string;
        // Check if signer has an address. A signer might not have any address
        // available if the user disconnects all accounts.
        try {
          _address = await _signer.getAddress();
        } catch (e) {
          set(null);
          address.set(null);
          return;
        }
        set(_signer);
        address.set(_address);
      })();
    } else {
      set(null);
      address.set(null);
    }
  }
);

export const address = writable<string | null>();

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

export const balance: Readable<BigNumber | null> = derived(
  signer,
  ($signer, set) => {
    console.log("balance", $signer);
    if ($signer) {
      $signer.getBalance().then(set);
    } else {
      set(null);
    }
  }
);
