import { ethers, Signer, BigNumber } from "ethers";
import { derived, Readable, writable } from "svelte/store";
import {
  connectWeb3Modal,
  disconnectWeb3Modal,
  initWeb3Modal,
} from "./web3Modal";

export async function init() {
  const modal = await initWeb3Modal();
  if (modal.cachedProvider) {
    try {
      await connect();
    } catch (e) {
      console.log("Cannot autoconnect:", e);
      modal.clearCachedProvider();
    }
  } else {
    await connectReadOnly();
  }
}

export async function connect() {
  const connection = await connectWeb3Modal();
  provider.set(new ethers.providers.Web3Provider(connection));
  connection.on("accountsChanged", (accounts: string[]) => {
    console.log("User changed account", accounts);
    accountsChanged.set(Date.now());
  });
  connection.on("chainChanged", (chainId: number) => {
    console.log("User changed network", chainId);
    connect();
  });
  /*
  connection.on("connect", (info: { chainId: number }) => {
    console.log("connect", info);
  });
  connection.on("disconnect", (error: { code: number; message: string }) => {
    console.log("disconnect", error);
  });
  */
}

export async function connectReadOnly() {
  provider.set(ethers.getDefaultProvider(import.meta.env.VITE_DEFAULT_NETWORK));
}

export async function disconnect() {
  await disconnectWeb3Modal();
  provider.set(null);
}

export const provider = writable<
  ethers.providers.Web3Provider | ethers.providers.BaseProvider | null
>();

export const accountsChanged = writable(0);

export const signer: Readable<Signer | null> = derived(
  [provider, accountsChanged],
  ([$provider], set) => {
    if ($provider && $provider instanceof ethers.providers.Web3Provider) {
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
    if ($signer) {
      $signer.getBalance().then(set);
    } else {
      set(null);
    }
  }
);
