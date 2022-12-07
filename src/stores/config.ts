type ContractsAddresses = {
  [key: string]: string;
};

export const contractsAddresses: ContractsAddresses =
  // @ts-ignore
  __VITE_CONTRACTS_ADDRESSES__;

export const infuraKey: string = import.meta.env.VITE_INFURA_API_KEY;
export const ethereumEndpoint: string = import.meta.env.VITE_ETHEREUM_ENDPOINT;
export const ethereumChainId: number = parseInt(
  import.meta.env.VITE_ETHEREUM_CHAIN_ID,
  10
);

export const projectId: string = import.meta.env.VITE_PROJECT_ID;

export const evmosChain = {
  mainnet: {
    id: 9001,
    name: "Evmos",
    network: "evmos",
    nativeCurrency: {
      decimals: 18,
      name: "EVMOS",
      symbol: "EVMOS",
    },
    rpcUrls: {
      default: "https://eth.bd.evmos.org:8545",
    },
    blockExplorers: {
      default: { name: "Evmos", url: "https://evm.evmos.org" },
    },
    testnet: false,
  },
  testnet: {
    id: 9000,
    name: "Evmos Testnet",
    network: "evmos",
    nativeCurrency: {
      decimals: 18,
      name: "tEVMOS",
      symbol: "tEVMOS",
    },
    rpcUrls: {
      default: "https://eth.bd.evmos.dev:8545",
    },
    blockExplorers: {
      default: { name: "Evmos", url: "https://evm.evmos.dev" },
    },
    testnet: true,
  },
};
