# boltswap

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


## Run BoltSwap interface

