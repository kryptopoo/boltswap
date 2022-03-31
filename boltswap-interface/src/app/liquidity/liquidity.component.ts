
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Pool, Token } from '../app.constant';


@Component({
    selector: 'app-liquidity',
    templateUrl: './liquidity.component.html',
    styleUrls: ['./liquidity.component.scss']
})
export class LiquidityComponent implements OnInit {

    pools: Array<Pool> = [];

    constructor(private _firestore: AngularFirestore) {}

    ngOnInit(): void {
        this._firestore
            .collection(`pools`)
            .valueChanges()
            .subscribe((pools) => {
                this.pools = pools.sort((a: any, b: any) => (a.time > b.time ? -1 : 1)) as Array<Pool>;
            });
    }

    createPool(){
      
    }
}
