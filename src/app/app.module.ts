import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { ExchangeFormComponent } from './components/exchange-form/exchange-form.component';
import { HowItWorksComponent } from './components/how-it-works/how-it-works.component';
import { AdvantagesComponent } from './components/advantages/advantages.component';

@NgModule({
  declarations: [
    AppComponent,
    ExchangeFormComponent,
    HowItWorksComponent,
    AdvantagesComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }