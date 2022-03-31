import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TokenSelectDialogComponent, TokenSelectDialogData } from '../dialogs/token-select-dialog/token-select-dialog.component';

@Injectable({
    providedIn: 'root'
})
export class DialogService {
    constructor(private dialog: MatDialog) {}

    openTokenSelectDialog(data: TokenSelectDialogData) {
        return this.dialog.open(TokenSelectDialogComponent, {
            data,
            width: '400px',
            disableClose: true
        });
    }
}
