import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";

let web3Modal: Web3Modal;
let web3ModalConnection: any;

/**
 * Initialize Web3Modal.
 *
 * @returns An initialized instance of Web3Modal.
 */
export async function initWeb3Modal() {
  if (web3Modal) {
    return web3Modal;
  }
  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        infuraId: import.meta.env.VITE_INFURA_API_KEY,
      },
    },
  };
  web3Modal = new Web3Modal({
    network: "mainnet",
    cacheProvider: true,
    providerOptions,
  });
  return web3Modal;
}

/**
 * Prompt the user to connect their wallet.
 *
 * @returns A connection to the web3 agent.
 */
export async function connectWeb3Modal() {
  if (!web3Modal) {
    initWeb3Modal();
  }
  if (web3ModalConnection) {
    web3ModalConnection.removeAllListeners();
  }
  web3ModalConnection = await web3Modal.connect();
  return web3ModalConnection;
}

/**
 * Disconnect to the web3 agent.
 */
export async function disconnectWeb3Modal() {
  if (web3Modal) {
    web3Modal.clearCachedProvider();
  }
  if (web3ModalConnection) {
    web3ModalConnection.removeAllListeners();
  }
}
