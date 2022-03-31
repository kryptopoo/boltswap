import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreatePoolComponent } from './liquidity/create-pool/create-pool.component';
import { LiquidityComponent } from './liquidity/liquidity.component';
import { SwapComponent } from './swap/swap.component';

const routes: Routes = [
    { path: '', component: SwapComponent },
    { path: 'swap', component: SwapComponent },
    { path: 'pool', component: LiquidityComponent },
    { path: 'pool/create', component: CreatePoolComponent },
    { path: 'add', component: LiquidityComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
