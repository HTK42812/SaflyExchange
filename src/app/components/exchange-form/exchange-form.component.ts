import { Component, OnInit } from '@angular/core';
import { ExchangeRateService } from '../../core/services/exchange-rate.service';
import { Currency } from '../../shared/models/currency.model';

@Component({
  selector: 'app-exchange-form',
  templateUrl: './exchange-form.component.html',
  styleUrls: ['./exchange-form.component.css']
})
export class ExchangeFormComponent implements OnInit {
  fromCurrency: string = 'RUB';
  toCurrency: string = 'USDT';
  fromAmount: number = 0;
  toAmount: number = 0;
  currencies: Currency[] = [
    { code: 'RUB' },
    { code: 'USDT' },
    { code: 'BTC' },
    { code: 'ETH' }
  ];
  showWarning: boolean = false;
  errorMessage: string = '';
  exchangeMessage: string = '';

  constructor(private exchangeRateService: ExchangeRateService) {}

  ngOnInit() {
    this.exchangeRateService.fetchRates().subscribe({
      next: ({ error }) => {
        this.errorMessage = error || '';
        this.calculateToAmount();
      }
    });
  }

  swapCurrencies() {
    const temp = this.fromCurrency;
    this.fromCurrency = this.toCurrency;
    this.toCurrency = temp;
    this.calculateToAmount();
  }

  calculateToAmount() {
    if (this.fromCurrency === 'RUB' && this.fromAmount > 0 && this.fromAmount < 1000) {
      this.showWarning = true;
      this.toAmount = 0;
      return;
    } else {
      this.showWarning = false;
    }

    if (this.fromAmount <= 0) {
      this.toAmount = 0;
      return;
    }

    const rates = this.exchangeRateService.getRates();
    let rate = 1;

    if (this.fromCurrency === 'RUB') {
      if (this.toCurrency === 'USDT') {
        rate = 1 / rates['USDT-RUB'];
      } else if (this.toCurrency === 'BTC') {
        rate = 1 / (rates['BTC-USDT'] * rates['USDT-RUB']);
      } else if (this.toCurrency === 'ETH') {
        rate = 1 / (rates['ETH-USDT'] * rates['USDT-RUB']);
      }
    } else if (this.fromCurrency === 'USDT') {
      if (this.toCurrency === 'RUB') {
        rate = rates['USDT-RUB'];
      } else if (this.toCurrency === 'BTC') {
        rate = 1 / rates['BTC-USDT'];
      } else if (this.toCurrency === 'ETH') {
        rate = 1 / rates['ETH-USDT'];
      }
    } else if (this.fromCurrency === 'BTC') {
      if (this.toCurrency === 'RUB') {
        rate = rates['BTC-USDT'] * rates['USDT-RUB'];
      } else if (this.toCurrency === 'USDT') {
        rate = rates['BTC-USDT'];
      } else if (this.toCurrency === 'ETH') {
        rate = rates['BTC-USDT'] / rates['ETH-USDT'];
      }
    } else if (this.fromCurrency === 'ETH') {
      if (this.toCurrency === 'RUB') {
        rate = rates['ETH-USDT'] * rates['USDT-RUB'];
      } else if (this.toCurrency === 'USDT') {
        rate = rates['ETH-USDT'];
      } else if (this.toCurrency === 'BTC') {
        rate = rates['ETH-USDT'] / rates['BTC-USDT'];
      }
    }

    // Apply 3.5% markup
    this.toAmount = this.fromAmount * rate * 1.035;
  }

  getExchangeRate(): string {
    if (this.fromCurrency === this.toCurrency) return '1:1';
    
    const rates = this.exchangeRateService.getRates();
    let rate = 1;

    if (this.fromCurrency === 'RUB') {
      if (this.toCurrency === 'USDT') rate = 1 / rates['USDT-RUB'];
      else if (this.toCurrency === 'BTC') rate = 1 / (rates['BTC-USDT'] * rates['USDT-RUB']);
      else if (this.toCurrency === 'ETH') rate = 1 / (rates['ETH-USDT'] * rates['USDT-RUB']);
    } else if (this.fromCurrency === 'USDT') {
      if (this.toCurrency === 'RUB') rate = rates['USDT-RUB'];
      else if (this.toCurrency === 'BTC') rate = 1 / rates['BTC-USDT'];
      else if (this.toCurrency === 'ETH') rate = 1 / rates['ETH-USDT'];
    } else if (this.fromCurrency === 'BTC') {
      if (this.toCurrency === 'RUB') rate = rates['BTC-USDT'] * rates['USDT-RUB'];
      else if (this.toCurrency === 'USDT') rate = rates['BTC-USDT'];
      else if (this.toCurrency === 'ETH') rate = rates['BTC-USDT'] / rates['ETH-USDT'];
    } else if (this.fromCurrency === 'ETH') {
      if (this.toCurrency === 'RUB') rate = rates['ETH-USDT'] * rates['USDT-RUB'];
      else if (this.toCurrency === 'USDT') rate = rates['ETH-USDT'];
      else if (this.toCurrency === 'BTC') rate = rates['ETH-USDT'] / rates['BTC-USDT'];
    }
    
    // Apply 3.5% markup to displayed rate
    return `1 ${this.fromCurrency} = ${(rate * 1.035).toFixed(4)} ${this.toCurrency}`;
  }

  proceedExchange() {
    if (this.fromCurrency === 'RUB' && this.fromAmount < 1000) {
      this.showWarning = true;
      this.exchangeMessage = '';
      return;
    }
    this.exchangeMessage = `Обмен ${this.fromAmount} ${this.fromCurrency} на ${this.toAmount} ${this.toCurrency}. (Демо-режим)`;
    console.log(this.exchangeMessage);
  }
}