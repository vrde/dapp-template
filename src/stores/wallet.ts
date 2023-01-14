import { walletconnectProjectId, infuraKey, ethereumChainId } from "./config";
import { ethers, BigNumber } from "ethers";
import type { Signer } from "ethers";
import { derived, writable, type Readable } from "svelte/store";
import {
  configureChains,
  createClient,
  fetchSigner,
  goerli,
  mainnet,
  type Chain,
} from "@wagmi/core";
import { infuraProvider } from "@wagmi/core/providers/infura";
import { asyncDerived } from "./utils";

import {
  EthereumClient,
  modalConnectors,
  walletConnectProvider,
} from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/html";

const defaultChains: Chain[] = [];

if (ethereumChainId === 1) {
  defaultChains.push(mainnet);
} else if (ethereumChainId === 5) {
  defaultChains.push(goerli);
}

// Configure wagmi client
const { provider } = configureChains(defaultChains, [
  infuraProvider({ apiKey: infuraKey }),
  walletConnectProvider({ projectId: walletconnectProjectId }),
]);

const wagmiClient = createClient({
  autoConnect: true,
  connectors: modalConnectors({ appName: "web3Modal", chains: defaultChains }),
  provider,
});

// Create ethereum and modal clients
const ethClient = new EthereumClient(wagmiClient, defaultChains);
export const web3Modal = new Web3Modal(
  { projectId: walletconnectProjectId },
  ethClient
);

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
    signer.set(await fetchSigner({ chainId }));
  } else {
    signer.set(null);
  }
  networkName.set(network?.chain?.name);
});

export const signer = writable<Signer | null>(null);
export const networkName = writable<string | undefined>();
export const networkError = writable<{ got: string; want: string } | null>();

export const address: Readable<string | null> = asyncDerived(
  signer,
  async ($signer, set) =>
    $signer ? set(await $signer.getAddress()) : set(null)
);

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
