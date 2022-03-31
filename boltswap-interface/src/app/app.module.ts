import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//Angular Material Components
import { MatButtonModule } from '@angular/material/button';
import { MatSliderModule } from '@angular/material/slider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';

// firebase
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from 'src/environments/environment';

// components
import { SwapComponent } from './swap/swap.component';
import { LiquidityComponent } from './liquidity/liquidity.component';
import { TokenSelectDialogComponent } from './dialogs/token-select-dialog/token-select-dialog.component';
import { CreatePoolComponent } from './liquidity/create-pool/create-pool.component';
import { ProgressDialogComponent } from './dialogs/progress-dialog/progress-dialog.component';
import { WalletComponent } from './wallet/wallet.component';
import { WalletService } from './services/wallet.service';

@NgModule({
  declarations: [
    AppComponent,
    SwapComponent,
    LiquidityComponent,
    TokenSelectDialogComponent,
    CreatePoolComponent,
    ProgressDialogComponent,
    WalletComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,

    MatButtonModule,
    MatListModule,
    MatSliderModule,
    MatIconModule,
    MatToolbarModule,
    MatCardModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatMenuModule,
    MatDialogModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSelectModule,

    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule
  ],
  providers: [WalletService],
  bootstrap: [AppComponent]
})
export class AppModule { }
