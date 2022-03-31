import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatDialog } from '@angular/material/dialog';
import { TokenSelectDialogComponent, TokenSelectDialogData } from 'src/app/dialogs/token-select-dialog/token-select-dialog.component';
import { ContractService } from 'src/app/services/contract.service';
import { ToastService } from 'src/app/services/toast.service';
import { Pool, DefaultTokenList, Token, UnknownToken } from '../../app.constant';

@Component({
    selector: 'app-create-pool',
    templateUrl: './create-pool.component.html',
    styleUrls: ['./create-pool.component.scss']
})
export class CreatePoolComponent implements OnInit {
    myTokens: Array<Token>;

    liquidityData: {
        token1: Token;
        token2: Token;
        progress: {
            approving: string[]; // symbol token
            approved: string[]; // symbol token confirmed
            supplying: boolean;
        };
    } = this.initData();

    constructor(
        private _firestore: AngularFirestore,
        private _dialog: MatDialog,
        private _contractService: ContractService,
        private _toastService: ToastService
    ) {}

    async ngOnInit() {
        await this.loadTokenBalances();
    }

    async loadTokenBalances() {
        this.myTokens = DefaultTokenList;
        this.myTokens.forEach(async (token) => {
            const balance = await this._contractService.getBalance(token);
            token.balance = Number(balance).toFixed(2);
        });
    }

    initData() {
        this.liquidityData = { token1: UnknownToken, token2: UnknownToken, progress: { approving: [], approved: [], supplying: false } };
        return this.liquidityData;
    }

    selectFromToken() {
        const dialogRef = this.openTokenSelectDialog();
        dialogRef.afterClosed().subscribe((selectedToken) => {
            if (selectedToken) this.liquidityData.token1 = selectedToken;
        });
    }

    selectToToken() {
        const dialogRef = this.openTokenSelectDialog();
        dialogRef.afterClosed().subscribe((selectedToken) => {
            if (selectedToken) this.liquidityData.token2 = selectedToken;
        });
    }

    openTokenSelectDialog() {
        const data: TokenSelectDialogData = { tokens: this.myTokens };
        const dialogRef = this._dialog.open(TokenSelectDialogComponent, {
            data,
            disableClose: true
        });
        return dialogRef;
    }

    async approveToken(token: Token) {
        const txApprove = await this._contractService.approveToken(token.address, token.amount.toString());
        console.log('txApprove', txApprove);

        // console.log('this.liquidityData.progress loading', this.liquidityData.progress);
        // this.liquidityData.progress.approving = token.symbol;
        // txApprove.wait(1).then((receipt) => {
        //     this.liquidityData.progress.approving = null;
        //     this.liquidityData.progress.approved.push(token.symbol);
        //     console.log('this.liquidityData.progress done', this.liquidityData.progress);
        // });

        this.liquidityData.progress.approving.push(token.symbol);
        // listen confirmations
        const _this = this;
        const provider = this._contractService.getProvider();
        const confirmationsWatch = setInterval(function () {
            provider.getTransaction(txApprove.hash).then((tx) => {
                if (tx.confirmations > 0) {
                    _this.liquidityData.progress.approving = _this.liquidityData.progress.approving.filter(v => v !== token.symbol); ;
                    _this.liquidityData.progress.approved.push(token.symbol);
                    clearInterval(confirmationsWatch);
                }
                console.log('confirmed', tx.confirmations);
            });
        }, 1000);
    }

    async addLiquidity() {
        // const dialogRef = this._dialog
        //     .open(ProgressDialogComponent, {
        //         data: {
        //             progressMsg: 'The upload process would be taken a little time. Please wait...',
        //             doneMsg: `Added liquidity to pool ${this.liquidityData.token1.symbol}-${this.liquidityData.token2.symbol} successfully!`,
        //             isProcessed: false,
        //             showDoneButton: false
        //         },
        //         // width: '400px',
        //         disableClose: true
        //     });

        console.log('liquidityData', this.liquidityData);
        
        const token1 = this.liquidityData.token1;
        const token2 = this.liquidityData.token2;

        const txLiquidity = await this._contractService.addLiquidity(
            token1.address,
            token2.address,
            token1.amount.toString(),
            token2.amount.toString()
        );
        console.log('txLiquidity', txLiquidity);

        // txLiquidity.wait(1).then(async (receipt) => {
        //     const pair = await this._contractService.getPair(token1.address, token2.address);
        //     var pool: Pool = {
        //         name: `${this.liquidityData.token1.symbol}-${this.liquidityData.token2.symbol}`,
        //         fee: 0.25,
        //         pairAddress: pair,
        //         token1: token1,
        //         token2: token2
        //     };
        //     // store pool info
        //     this._firestore
        //         .collection(`pools`, (ref) => ref.where('name', '==', pool.name))
        //         .get()
        //         .subscribe((pools) => {
        //             if (!pools[0]) {
        //                 this._firestore.collection(`pools`).add(pool);
        //             }
        //         });

        //     // dialogRef.close();
        //     this.liquidityData.progress.supplying = false;
        // });

        // listen confirmations
        this.liquidityData.progress.supplying = true;
        const _this = this;
        const provider = this._contractService.getProvider();
        const confirmationsWatch = setInterval(function () {
            provider.getTransaction(txLiquidity.hash).then(async (tx) => {
                if (tx.confirmations > 0) {
                    const pair = await _this._contractService.getPair(token1.address, token2.address);
                    var pool: Pool = {
                        name: `${_this.liquidityData.token1.symbol}-${_this.liquidityData.token2.symbol}`,
                        fee: 0.25,
                        pairAddress: pair,
                        token1: token1,
                        token2: token2
                    };
                    // store pool info
                    _this._firestore
                        .collection(`pools`, (ref) => ref.where('name', '==', pool.name))
                        .get()
                        .subscribe((pools) => {
                            if (!pools[0]) {
                                _this._firestore.collection(`pools`).add(pool);
                            }
                        });

                    // dialogRef.close();
                    _this.initData();

                    _this._toastService.success(
                        `Added liquidity to pool ${token1.symbol}-${token2.symbol} successfully!`
                    );

                    clearInterval(confirmationsWatch);
                }
                console.log('confirmed', tx.confirmations);
            });
        }, 1000);
    }
}
