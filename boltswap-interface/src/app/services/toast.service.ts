import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
    providedIn: 'root'
})
export class ToastService {
    constructor(private _snackBar: MatSnackBar) {}

    success(message: string, action: string = null) {
        this._snackBar.open(message, action, {
            horizontalPosition: 'right',
            verticalPosition: 'top',
            duration: 3000, 
            panelClass: ['snackbar-success']
        });
    }

    error(message: string, action: string = null) {
      this._snackBar.open(message, action, {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          duration: 3000, 
          panelClass: ['snackbar-error']
      });
  }
}
