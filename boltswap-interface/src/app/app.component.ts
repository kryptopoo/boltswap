import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ContractAddresses, DefaultTokenList, Token } from './app.constant';
import { ContractService } from './services/contract.service';
import { TokenSelectDialogComponent, TokenSelectDialogData } from './dialogs/token-select-dialog/token-select-dialog.component';
import { DialogService } from './services/dialog.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    title = 'boltswap-interface';

    swapData: any = {
        fromToken: null,
        toToken: null
    };

    myTokens: Array<Token>;

    constructor(private _dialog: MatDialog, private _contractService: ContractService) {}

    async ngOnInit() {


        await this.loadTokenBalances();
    }

    async loadTokenBalances() {
        this.myTokens = DefaultTokenList;
        this.myTokens.forEach(async (token) => {
            const balance = await this._contractService.getBalance(token);
            token.balance = balance;
        });

        this.swapData.fromToken = this.myTokens[0];
        this.swapData.toToken = this.myTokens[1];
    }


    

  

    async connect() {
        const ethereum = (window as any)?.ethereum;

        if (!ethereum?.isMetaMask) return null;
        await ethereum.enable();

        try {
            // Will open the MetaMask UI
            // You should disable this button while the request is pending!
            await ethereum.request({ method: 'eth_requestAccounts' });
            const accounts = await ethereum.request({ method: 'eth_accounts' });

            if (accounts.length > 0) {
                localStorage.setItem('boltswap.wallet', accounts[0]);
                // return true;
            } else {
                // return false;
            }
        } catch (error) {
            console.error(error);
        }

        // return false;
    }

    async disconnect() {
        localStorage.removeItem('boltswap.wallet');
        window.location.reload();
    }
}
