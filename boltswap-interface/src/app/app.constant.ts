
export interface Token {
  chainId: number;
  address: string;
  name: string;
  symbol: string;
  decimals?: number;
  logoURI?: string;
  balance?: string;
  amount?: number;
}

export interface Pool {
  name: string,
  pairAddress: string,
  token1: Token,
  token2: Token,
  fee: number
}

export const UnknownToken: Token = {
  chainId: 0,
  address: null,
  name: 'Select a token',
  symbol: 'Select a token',
  logoURI: '/assets/images/unknown.jpg',
  amount: 0
};

export const Networks = [3,4,5,42,123, 1337, 31337, 444800, 444900, 868455272153094]

export const ChainId = {
  // MAINNET: 1,
  ROPSTEN: 3,
  RINKEBY: 4,
  GÖRLI: 5,
  KOVAN: 42,
  DEVNET: 444800,
  AUTONITY: 444900,
  PARASTATE: 123,
  GANCHE: 1337,
  HARDHAT: 31337,
  GODWOKEN_TESTNET:868455272153094
};



export const routerAddress = new Map();
// routerAddress.set(ChainId.MAINNET, "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D");
routerAddress.set(ChainId.ROPSTEN, "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D");
routerAddress.set(ChainId.RINKEBY, "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D");
routerAddress.set(ChainId.GÖRLI, "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D");
routerAddress.set(ChainId.KOVAN, "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D");
routerAddress.set(ChainId.DEVNET, "0x04e555283D37aE85F6eB311fe2578F3B3f3dFc52");
routerAddress.set(ChainId.AUTONITY, "0x04e555283D37aE85F6eB311fe2578F3B3f3dFc52");
routerAddress.set(ChainId.PARASTATE, "0x07a1905D44feeA439ceFAabd11a63bEf684abE11");
routerAddress.set(ChainId.GANCHE, "0x0F44AC51198D8F99847db6C431448dBC673428f1");
routerAddress.set(ChainId.HARDHAT, "0x0F44AC51198D8F99847db6C431448dBC673428f1");
routerAddress.set(ChainId.GODWOKEN_TESTNET, "0x2b66C5C682dB2A9301d9dfd39aeBcB3C87406c9e");


export const ContractAddresses = {
  pCKB: '0x86efaff75201Ed513c2c9061f2913eec850af56C',
  WETH: '0x59D5f8a51383A5af9c6AE4aa0502E15622b8f5b3',
  TKA: '0x9C803e7d15B9DEe007a692ec6BaceB7080d45776',
  TKB: '0x9E829617EC4458C744BA19fBeBB36d00eC7BB2CF', 
  TKX: '0x953675d96Eab740c87FD300cE638C0161Ad0e9B3',
  TKY: '0x26a9E61c83Be35d6f2BBE31F421c9aAd86E8e985', 
  UniswapV2Factory: '0x1de63B32A955C13043CA470ED84e5C8896538923',
  UniswapV2Router02: '0x2b66C5C682dB2A9301d9dfd39aeBcB3C87406c9e',
};

export const DefaultTokenList: Array<Token> = [
  {
    chainId: ChainId.GODWOKEN_TESTNET,
    name: "pCKB",
    address: ContractAddresses.pCKB,
    decimals: 8,
    symbol: 'pCKB',
    logoURI: '/assets/images/tokens/CKB.jpg'
  },
  {
    chainId: ChainId.GODWOKEN_TESTNET,
    name: "Wrapped ETH",
    address: ContractAddresses.WETH,
    decimals: 18,
    symbol: 'WETH',
    logoURI: '/assets/images/tokens/ETH.png'
  },
  {
    chainId: ChainId.GODWOKEN_TESTNET,
    name: "Token A",
    address: ContractAddresses.TKA,
    decimals: 18,
    symbol: 'TKA',
    logoURI: '/assets/images/tokens/A.svg'
  },
  {
    chainId: ChainId.GODWOKEN_TESTNET,
    name: "Token B",
    address: ContractAddresses.TKB,
    decimals: 18,
    symbol: 'TKB',
    logoURI: '/assets/images/tokens/B.svg'
  },
  {
    chainId: ChainId.GODWOKEN_TESTNET,
    name: "Token X",
    address: ContractAddresses.TKX,
    decimals: 18,
    symbol: 'TKX',
    logoURI: '/assets/images/tokens/X.svg'
  },
  {
    chainId: ChainId.GODWOKEN_TESTNET,
    name: "Token Y",
    address: ContractAddresses.TKY,
    decimals: 18,
    symbol: 'TKY',
    logoURI: '/assets/images/tokens/Y.svg'
  }
]


// reusing "UniswapV2Factory" at 0x1de63B32A955C13043CA470ED84e5C8896538923
// reusing "WETH9Mock" at 0x59D5f8a51383A5af9c6AE4aa0502E15622b8f5b3
// deploying "ERC20Mock" (tx: 0x0dc75068cd757b5260fafdde3f5e96a47ccba81f2ecc646664b0ea9b86377c8c)...: deployed at 0x9C803e7d15B9DEe007a692ec6BaceB7080d45776 with 108636 gas
// deploying "ERC20Mock" (tx: 0x83440fe304b367d040e067104c64b9e41a98e2a02565b46f88ef22fd56d6ac84)...: deployed at 0x9E829617EC4458C744BA19fBeBB36d00eC7BB2CF with 108636 gas
// deploying "UniswapV2Router02" (tx: 0xf8117a076f27e709427ffebe30784bce421b8c0bb496d2d95d0e2d26682ede7e)...: deployed at 0x2b66C5C682dB2A9301d9dfd39aeBcB3C87406c9e with 4657 gas
// deploying "SushiToken" (tx: 0x455899d9e671fb38f725670afb5625ce8e2018a1fcfe79db1dd239a503e6681f)...: deployed at 0x0C14ae62E97EFACb85588D89E72E4d5297163129 with 87075 gas
// deploying "MasterChef" (tx: 0x079bfb670f18633408a89d5baa320ab3366d8ee8d528bd73d53401568813c50c)...: deployed at 0x24DDc44e7689924A6D9a2588E9635A7A12Aa2A30 with 145840 gas
// Transfer Sushi Ownership to Chef
// Transfer ownership of MasterChef to dev
// deploying "MiniChefV2" (tx: 0xe0b233a79eb8227df165aa0608e9167580f51839029a39d35ea97d3746c5f141)...: deployed at 0xE9f44142fBb38724BDEe47B3f6c7F821E339a607 with 24990 gas
// Transfer ownership of MiniChef to dev
// deploying "SushiBar" (tx: 0x17bde5d0a13bb27990d3b2e134cbd7278bd322ddf158767911a58951d49521fb)...: deployed at 0x79629F401D209AeCE3f1efAf9D80833C7BDdFFb6 with 64217 gas
// deploying "SushiMaker" (tx: 0xf6627834ce0fa13fcfe16abee16d4f1907c8fa70d87668927c88ec4c4193f8bb)...: deployed at 0x1358d5CE067dDE5B7dEF07a114241e47e3a90d1B with 24081 gas
// Setting maker owner
// deploying "SushiRoll" (tx: 0x1d2c92c10db01a3dba9a2c8a7de4e618ce65d9c6c3e961b0888a168924d463d1)...: deployed at 0x32fB0B8803B15CF27FA55Ceb7968126C79c8f566 with 42697 gas