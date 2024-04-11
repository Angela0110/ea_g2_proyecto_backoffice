import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // <-- NgModel lives here

import { HttpClientModule } from '@angular/common/http';
import {NgxPaginationModule} from 'ngx-pagination';
import { NgIf, UpperCasePipe, CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [
    ],
    providers: [],
    bootstrap: [],
    imports: [
        BrowserModule,
        RouterModule,
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        CommonModule,
        NgxPaginationModule  
    ]
})
export class AppModule { }
