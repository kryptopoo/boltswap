import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Token } from './../../app.constant';

export interface TokenSelectDialogData {
    // title: string;
    // message: string;
    tokens: Array<Token>;
}

@Component({
    selector: 'app-token-select-dialog',
    templateUrl: './token-select-dialog.component.html',
    styleUrls: ['./token-select-dialog.component.scss']
})
export class TokenSelectDialogComponent implements OnInit {
    constructor(private dialogRef: MatDialogRef<TokenSelectDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: TokenSelectDialogData) {}

    ngOnInit(): void {}

    selectToken(token) {
        this.dialogRef.close(token);
    }
}
