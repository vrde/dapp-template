import {
  walletconnectProjectId,
  infuraKey,
  evmosChain,
  ethereumChainId,
} from "./config";
import { ethers, Signer, BigNumber } from "ethers";
import { derived, writable, type Readable } from "svelte/store";
import { chain, configureChains, createClient } from "@wagmi/core";
import { infuraProvider } from "@wagmi/core/providers/infura";

import {
  EthereumClient,
  modalConnectors,
  walletConnectProvider,
} from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/html";

if (!walletconnectProjectId) {
  throw new Error("You need to provide VITE_PROJECT_ID env variable");
}

const defaultChains = [chain.mainnet, evmosChain.mainnet, evmosChain.testnet];

// Configure wagmi client
const { chains, provider } = configureChains(defaultChains, [
  infuraProvider({ apiKey: infuraKey }),
  walletConnectProvider({ projectId: walletconnectProjectId }),
]);

const wagmiClient = createClient({
  autoConnect: true,
  connectors: modalConnectors({ appName: "web3Modal", chains }),
  provider,
});

// Create ethereum and modal clients
const ethClient = new EthereumClient(wagmiClient, chains);
export const web3Modal = new Web3Modal(
  { projectId: walletconnectProjectId },
  ethClient
);

ethClient.watchAccount((account) => {
  address.set(account.address);
});

ethClient.watchNetwork(async (network) => {
  const chainId = network?.chain?.id;
  if (chainId) {
    if (chainId !== ethereumChainId) {
      const currentChainName = network?.chain?.name || "unknown";
      const ethereumChainName =
        ethers.providers.getNetwork(ethereumChainId)?.name || "unknown";
      networkError.set({
        got: `${currentChainName}:${chainId}`,
        want: `${ethereumChainName}:${ethereumChainId}`,
      });
      return;
    }
    signer.set(await wagmiClient.connector?.getSigner({ chainId }));
  } else {
    signer.set(null);
  }
  networkName.set(network?.chain?.name);
});

export const signer = writable<Signer | null>(null);
export const networkName = writable<string | undefined>();
export const networkError = writable<{ got: string; want: string } | null>();
export const address = writable<string | undefined>();
export const shortAddress = derived(address, ($address) =>
  $address ? $address.substring(0, 6) + "…" + $address.substring(38) : null
);

export const balance: Readable<BigNumber | null> = derived(
  signer,
  ($signer, set) => {
    if ($signer) {
      $signer
        .getBalance()
        .then(set)
        .catch((e) => {
          console.log("Error getting balance", e);
        });
    } else {
      set(null);
    }
  }
);

export async function connect() {
  web3Modal.openModal();
}

export async function disconnect() {
  ethClient.disconnect();
}
