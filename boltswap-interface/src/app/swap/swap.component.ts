import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ContractAddresses, DefaultTokenList, Token, UnknownToken } from './../app.constant';
import { ContractService } from '../services/contract.service';
import { TokenSelectDialogComponent, TokenSelectDialogData } from '../dialogs/token-select-dialog/token-select-dialog.component';
import { ProgressDialogComponent } from '../dialogs/progress-dialog/progress-dialog.component';
import { ToastService } from '../services/toast.service';
@Component({
    selector: 'app-swap',
    templateUrl: './swap.component.html',
    styleUrls: ['./swap.component.scss']
})
export class SwapComponent implements OnInit {
    swapData: any = {
        fromToken: UnknownToken,
        toToken: UnknownToken,
        reserves: null,
        tokensRate: 0,
        canSwap: false,
        swapText: 'Enter an amount',
        processing: false
    };

    myTokens: Array<Token>;

    constructor(private _dialog: MatDialog, private _contractService: ContractService, private _toastService: ToastService) {}

    async ngOnInit() {
        await this.loadTokenBalances();
    }

    async loadTokenBalances() {
        this.myTokens = DefaultTokenList;
        this.myTokens.forEach(async (token) => {
            const balance = await this._contractService.getBalance(token);
            token.balance = Number(balance).toFixed(2);
        });

        // this.swapData.fromToken = this.myTokens[0];
        // this.swapData.toToken = this.myTokens[1];
    }

    selectFromToken() {
        const dialogRef = this.openTokenSelectDialog();
        dialogRef.afterClosed().subscribe(async (selectedToken) => {
            if (selectedToken) {
                this.swapData.fromToken = selectedToken;
                if (this.swapData.fromToken && this.swapData.toToken) {
                    this.swapData.reserves = await this._contractService.getReserves(this.swapData.fromToken.address, this.swapData.toToken.address);
                }
                console.log('swapData', this.swapData);
            }
        });
    }

    selectToToken() {
        const dialogRef = this.openTokenSelectDialog();
        dialogRef.afterClosed().subscribe(async (selectedToken) => {
            if (selectedToken) {
                this.swapData.toToken = selectedToken;
                if (this.swapData.fromToken && this.swapData.toToken) {
                    this.swapData.reserves = await this._contractService.getReserves(this.swapData.fromToken.address, this.swapData.toToken.address);
                }
                console.log('swapData', this.swapData);
            }
        });
    }

    openTokenSelectDialog() {
        const data: TokenSelectDialogData = { tokens: this.myTokens };
        const dialogRef = this._dialog.open(TokenSelectDialogComponent, {
            data,
            // width: '400px',
            disableClose: true
        });
        return dialogRef;
    }

    async swap() {
        var txSwap = await this._contractService.swapTokens(
            this.swapData.fromToken.address,
            this.swapData.toToken.address,
            this.swapData.fromToken.amount
        );
        console.log('txSwap', txSwap);

        // // show dialog
        // const dialogRef = this._dialog.open(ProgressDialogComponent, {
        //     data: {
        //         progressMsg: 'The process would be taken a little time. Please wait...',
        //         doneMsg: `Swapped ${this.swapData.fromToken.symbol}-${this.swapData.toToken.symbol} successfully!`,
        //         isProcessed: true,
        //         progressIcon: 'swap_vertical_circle'
        //     }
        // });

        const _this = this;
        this.swapData.processing = true;

        const provider = this._contractService.getProvider();
        const confirmationsWatch = setInterval(function () {
            provider.getTransaction(txSwap.hash).then((tx) => {
                if (tx.confirmations > 0) {

                    _this.swapData.processing = false;
                    clearInterval(confirmationsWatch);
                    _this._toastService.success(`Swapped ${_this.swapData.fromToken.amount} ${_this.swapData.fromToken.symbol}-${_this.swapData.toToken.symbol} successfully`)

                    // // close dialog
                    // dialogRef.componentInstance.data.isProcessed = false;
                    // setTimeout(() => {
                    //     dialogRef.close();
                    //     clearInterval(confirmationsWatch);
                    // }, 1000);
                }
                console.log('confirmed', tx.confirmations);
            });
        }, 1000);
    }

    async addLiquidity() {
        // const account = await this._contractService.getAccount();
        // const provider = this._contractService.getProvider();
        // const signer = this._contractService.getSigner(provider);
        // var addLiquidity = await this._contractService.addLiquidity(
        //     ContractAddresses.WETH,
        //     ContractAddresses.TKA,
        //     '10',
        //     '10',
        //     account,
        //     signer
        // );
        // console.log('addLiquidity', addLiquidity);
    }

    async changeFromToKenAmount($event) {
        const fromToken = this.swapData.fromToken;
        const toToken = this.swapData.toToken;
        if (fromToken.amount != '') {
            const calculatedAmount = await this._contractService.getAmountOut(fromToken.address, toToken.address, fromToken.amount);

            toToken.amount = calculatedAmount.toFixed(4);
            this.swapData.tokensRate = Number(fromToken.amount) / Number(toToken.amount);

            const reserves = await this._contractService.getReserves(fromToken.address, toToken.address);
            console.log('reserves', reserves);
            this.changeSwapButtonText();
        }
    }

    async changeToTokenAmount($event) {
        console.log('change', this.swapData);

        const fromToken = this.swapData.fromToken;
        const toToken = this.swapData.toToken;
        if (toToken.amount != '') {
            const calculatedAmount = await this._contractService.getAmountIn(fromToken.address, toToken.address, toToken.amount);
            console.log('cal', calculatedAmount);
            fromToken.amount = calculatedAmount.toFixed(4);
            this.swapData.tokensRate = Number(fromToken.amount) / Number(toToken.amount);

            // const reserves = await this._contractService.getReserves(fromToken.address, toToken.address);
            // console.log('reserves', reserves);
            this.changeSwapButtonText();
        }
    }

    changeSwapButtonText() {
        const fromTokenAmount = Number(this.swapData.fromToken.amount);
        const toTokenAmount = Number(this.swapData.toToken.amount);
        const fromTokenBalance = Number(this.swapData.fromToken.balance);

        console.log('fromTokenAmount', fromTokenAmount, 'balance', fromTokenBalance);
        if (fromTokenAmount > 0 && fromTokenAmount > fromTokenBalance) {
            this.swapData.swapText = 'Insufficient Balance';
            this.swapData.canSwap = false;
        } else if (fromTokenAmount > 0 && toTokenAmount > 0) {
            this.swapData.swapText = 'Swap';
            this.swapData.canSwap = true;
        }
    }

    // async calculateTokensRate() {
    //     const fromToken = this.swapData.fromToken;
    //     const toToken = this.swapData.toToken;
    //     toToken.amount = await this._contractService.getAmountOut(fromToken.address, toToken.address, fromToken.amount);
    //     this.swapData.tokensRate = fromToken.amount / toToken.amount;
    // }
}
