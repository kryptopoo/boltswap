import { Injectable } from '@angular/core';
import { Contract, ethers } from 'ethers';
import { ContractAddresses, Networks, Token } from '../app.constant';

const ROUTER = require('../../contracts/UniswapV2Router02.json');
const FACTORY = require('../../contracts/UniswapV2Factory.json');
const ERC20 = require('../../contracts/ERC20Mock.json');
const WETH9 = require('../../contracts/WETH9Mock.json');
const PAIR = require('../../contracts/IUniswapV2Pair.json');

@Injectable({
    providedIn: 'root'
})
export class ContractService {
    constructor() {}

    getProvider() {
        //  return new ethers.providers.JsonRpcProvider('https://godwoken-testnet-web3-v1-rpc.ckbapp.dev');
        return new ethers.providers.Web3Provider((window as any).ethereum);
    }

    getSigner() {
        const provider = this.getProvider();
        return provider.getSigner();
    }

    getRouterContract() {
        return new Contract(ContractAddresses.UniswapV2Router02, ROUTER.abi, this.getSigner());
    }

    getFactoryContract() {
        return new Contract(ContractAddresses.UniswapV2Factory, FACTORY.abi, this.getSigner());
    }

    async getAccount() {
        const accounts = await this.getProvider().listAccounts();
        return accounts[0];
    }

    async getDecimals(token) {
        const decimals = await token
            .decimals()
            .then((result) => {
                return result;
            })
            .catch((error) => {
                console.log('No tokenDecimals function for this token, set to 0');
                return 0;
            });
        return decimals;
    }

    async getBalance(token: Token): Promise<string> {
        const signer = this.getSigner();
        const accountAddress = await this.getAccount();
        try {
            // if (token.address === ContractAddresses.WETH) {
            //     const balanceRaw = await provider.getBalance(accountAddress);
            //     const balance = ethers.utils.formatEther(balanceRaw);

            //     return balance;
            // }
            const tokenContract = new Contract(token.address, ERC20.abi, signer);
            const balanceRaw = await tokenContract.balanceOf(accountAddress);
            const symbol = await tokenContract.symbol();
            const decimals = await tokenContract.decimals();
            const balance = ethers.utils.formatUnits(balanceRaw, decimals);
            return balance;
        } catch (error) {
            console.log(error);
            return '0';
        }
    }

    async createPair(address1: string, address2: string) {
        const factoryContract = this.getFactoryContract();
        return await factoryContract.createPair(address1, address2);
    }

    async getPair(address1: string, address2: string) {
        const pairAddress = await this.getFactoryContract().getPair(address1, address2);
        return pairAddress.toString();
    }

    async getAmountOut(address1: string, address2: string, amountIn: string) {
        const values = await this.getRouterContract().getAmountsOut(ethers.utils.parseEther(amountIn).toString(), [address1, address2]);
        const amountOut = ethers.utils.formatEther(values[1]);
        return Number(amountOut);
    }

    async getAmountIn(address1: string, address2: string, amountOut: string) {
        const values = await this.getRouterContract().getAmountsIn(ethers.utils.parseEther(amountOut).toString(), [address1, address2]);
        const amountIn = ethers.utils.formatEther(values[1]);
        return Number(amountIn);
    }

    async getReserves(address1: string, address2: string) {
        try {
            const accountAddress = await this.getAccount();
            const pairAddress = await this.getFactoryContract().getPair(address1, address2);
            const pair = new Contract(pairAddress, PAIR.abi, this.getSigner());

            // get reserves of tokens
            const reservesRaw = await this.fetchReserves(address1, address2, pair);

            // get liquidity token
            const liquidityTokensBalance = await pair.balanceOf(accountAddress); // units
            const liquidityTokens = Number(ethers.utils.formatEther(liquidityTokensBalance)).toFixed(2);

            return {
                [address1]: reservesRaw[0].toFixed(2),
                [address2]: reservesRaw[1].toFixed(2),
                liquidity: liquidityTokens
            };
        } catch (err) {
            console.log('getReserves error', err);
            return {
                [address1]: '0',
                [address2]: '0',
                liquidity: '0'
            };
        }
    }

    async swapTokens(address1: string, address2: string, amount: string) {
        const accountAddress = this.getAccount();
        const routerContract = this.getRouterContract();

        const tokens = [address1, address2];
        const time = Math.floor(Date.now() / 1000) + 200000;
        const deadline = ethers.BigNumber.from(time);

        const token1 = new Contract(address1, ERC20.abi, this.getSigner());
        const tokenDecimals = await this.getDecimals(token1);

        const amountIn = ethers.utils.parseUnits(amount, tokenDecimals);
        const amountOut = await routerContract.callStatic.getAmountsOut(amountIn, tokens);

        const txApprove = await token1.approve(routerContract.address, amountIn);
        // const txApprove = await this.approveToken(routerContract.address, amountIn);
        console.log('approve token', txApprove);

        // wait approve completed
        const receipt = await txApprove.wait(1);
        console.log('approve receipt', receipt);

        const wethAddress = await routerContract.WETH();
        if (address1 === wethAddress) {
            // Eth -> Token
            return await routerContract.swapExactETHForTokens(amountOut[1], tokens, accountAddress, deadline, { value: amountIn, gasLimit: 1000000 });
        } else if (address2 === wethAddress) {
            // Token -> Eth
            return await routerContract.swapExactTokensForETH(amountIn, amountOut[1], tokens, accountAddress, deadline, { gasLimit: 1000000 });
        } else {
            return await routerContract.swapExactTokensForTokens(amountIn, amountOut[1], tokens, accountAddress, deadline, { gasLimit: 1000000 });
        }
    }

    async approveToken(address: string, amount: string) {
        const signer = this.getSigner();
        const routerContract = this.getRouterContract();

        const token = new Contract(address, ERC20.abi, signer);
        const tokenDecimals = await this.getDecimals(token);
        const amountIn = ethers.utils.parseUnits(amount, tokenDecimals);
        return await token.approve(routerContract.address, amountIn);
    }

    async addLiquidity(address1: string, address2: string, amount1: string, amount2: string) {
        const accountAddress = this.getAccount();
        const routerContract = this.getRouterContract();

        const token1 = new Contract(address1, ERC20.abi, this.getSigner());
        const token2 = new Contract(address2, ERC20.abi, this.getSigner());

        const token1Decimals = await this.getDecimals(token1);
        const token2Decimals = await this.getDecimals(token2);

        const amountIn1 = ethers.utils.parseUnits(amount1, token1Decimals);
        const amountIn2 = ethers.utils.parseUnits(amount2, token2Decimals);

        const amount1Min = ethers.utils.parseUnits('1', token1Decimals);
        const amount2Min = ethers.utils.parseUnits('1', token2Decimals);

        const time = Math.floor(Date.now() / 1000) + 200000;
        const deadline = ethers.BigNumber.from(time);

        // await token1.approve(routerContract.address, amountIn1);
        // await token2.approve(routerContract.address, amountIn2);

        const wethAddress = await routerContract.WETH();

        if (address1 === wethAddress) {
            // Eth + Token
            return await routerContract.addLiquidityETH(address2, amountIn2, amount2Min, amount1Min, accountAddress, deadline, {
                value: amountIn1,
                gasLimit: 1000000
            });
        } else if (address2 === wethAddress) {
            // Token + Eth
            return await routerContract.addLiquidityETH(address1, amountIn1, amount1Min, amount2Min, accountAddress, deadline, {
                value: amountIn2,
                gasLimit: 1000000
            });
        } else {
            // Token + Token
            return await routerContract.addLiquidity(address1, address2, amountIn1, amountIn2, amount1Min, amount2Min, accountAddress, deadline, {
                gasLimit: 1000000
            });
        }
    }

    private async fetchReserves(address1: string, address2: string, pair: Contract) {
        try {
            // Get decimals for each coin
            const coin1 = new Contract(address1, ERC20.abi, this.getSigner());
            const coin2 = new Contract(address2, ERC20.abi, this.getSigner());

            const coin1Decimals = await this.getDecimals(coin1);
            const coin2Decimals = await this.getDecimals(coin2);

            // Get reserves
            const reservesRaw = await pair.getReserves();

            // Put the results in the right order
            const results = [
                (await pair.token0()) === address1 ? reservesRaw[0] : reservesRaw[1],
                (await pair.token1()) === address2 ? reservesRaw[1] : reservesRaw[0]
            ];

            // Scale each to the right decimal place
            return [results[0] * 10 ** -coin1Decimals, results[1] * 10 ** -coin2Decimals];
        } catch (err) {
            console.log('error!');
            console.log(err);
            return [0, 0];
        }
    }
}
