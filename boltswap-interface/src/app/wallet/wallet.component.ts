import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { WalletService } from '../services/wallet.service';
import { ToastService } from '../services/toast.service';

@Component({
    selector: 'app-wallet',
    templateUrl: './wallet.component.html',
    styleUrls: ['./wallet.component.scss']
})
export class WalletComponent implements OnInit {
    @ViewChild('walletDialogRef') walletDialogRef: TemplateRef<any>;
    @ViewChild('connectDialogRef') connectDialogRef: TemplateRef<any>;

    address: string = null;
    shortAddress: string = null;
    currency: string = 'ETH';
    network: string = 'Testnet';
    balance: number = 0;

    constructor(private _dialog: MatDialog, private _walletService: WalletService, private _toastService: ToastService) {}

    async ngOnInit(): Promise<void> {
        await this.loadWalletInfo();
    }

    async connect() {
        const isConnected = await this._walletService.connect();

        if (isConnected) {
            this.loadWalletInfo();
            this._toastService.success(`Connected wallet ${this.address}`);
        } else {
            this._toastService.error(`Cannot connect wallet`);
        }
    }

    async disconnect() {
        window.location.reload();
    }

    async loadWalletInfo() {
        const walletAddr = this._walletService.getAddress();
        if (walletAddr) {
            this.address = walletAddr;
            this.shortAddress = `${this.address.substring(0, 6)}...${this.address.substring(this.address.length - 6)}`;
            const walletBalance = await this._walletService.getBalance();
            this.balance = walletBalance.balance;
            this.currency = walletBalance.currency;
        }
    }

    openWalletDialog() {
        this._dialog.open(this.walletDialogRef);
    }

    openConnectDialog() {
        this._dialog.open(this.connectDialogRef);
    }
}
