# BoltSwap
A decentralized exchange forked from SushiSwap with minimum features.
- Swap
- Liquidity Pools 

### Video Demo
[![BoltSwap Demo](https://img.youtube.com/vi/Ja2OzfTQAF0/0.jpg)](https://www.youtube.com/watch?v=Ja2OzfTQAF0)

### Live Demo
https://boltswap.herokuapp.com/

### Screenshots
<img src="https://user-images.githubusercontent.com/44108463/161030181-6cde452b-58e1-49b2-a3d9-231c48e06795.PNG" width="800"/>


<img src="https://user-images.githubusercontent.com/44108463/161030206-3fc1b44f-8e05-4ec4-96bc-c4e1135b1fad.PNG" width="800"/>


<img src="https://user-images.githubusercontent.com/44108463/161030220-2feb2235-5f15-4f32-9d7c-b59b979a7a8b.PNG" width="800"/>


## Deploy BoltSwap contracts 
Locate to `boltswap` folder
1. Prepare accounts for deployment
L2 Godwoken Testnet Account Generator: https://dev.ckb.tools/create-layer2-account
or https://homura.github.io/light-godwoken/

2. Replace `acounts` private keys in `hardhat.config.ts`

3. Install all libraries
``` 
yarn install
```
4. Deploy mock addresses first
``` 
yarn hardhat --network godwoken-l2-testnet deploy --tags Mocks
```
5. Deploy all contracts in `deploy` folder
``` 
yarn hardhat --network godwoken-l2-testnet deploy
```


## Run BoltSwap interface (dev)
Locate to `boltswap-interface` folder
``` 
ng serve
```

## Testnet testing
Contracts were deployed on **Nervos Testnet GODWOKEN**

 - `pCKB`  0x86efaff75201Ed513c2c9061f2913eec850af56C 
 - `WETH` 0x59D5f8a51383A5af9c6AE4aa0502E15622b8f5b3 
 - `TKA` 0x9C803e7d15B9DEe007a692ec6BaceB7080d45776 
 - `TKB` 0x9E829617EC4458C744BA19fBeBB36d00eC7BB2CF 
 - `TKX` 0x953675d96Eab740c87FD300cE638C0161Ad0e9B3 
 - `TKY` 0x26a9E61c83Be35d6f2BBE31F421c9aAd86E8e985 
 - `UniswapV2Factory` 0x1de63B32A955C13043CA470ED84e5C8896538923
 - `UniswapV2Router02` 0x2b66C5C682dB2A9301d9dfd39aeBcB3C87406c9e

**Testing Account**: 
 - Address: 0xE98c30EE123665A3036b09857E40358F2b99D2C4
 - Private key: d6a9fc8677cc5bf8f24e2f9eeb5d2d475aa4eee3d04594b7d0fce354bcac202a
