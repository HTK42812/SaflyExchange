import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ExchangeRateService {
  private rates: any = {
    'BTC-USDT': 60000,
    'ETH-USDT': 2500,
    'USDT-RUB': 100
  };

  constructor(private http: HttpClient) {}

  fetchRates(): Observable<{ rates: any, error: string | null }> {
    const observables = [
      this.http.get('/api/market/ticker?instId=BTC-USDT').pipe(
        map((data: any) => {
          if (data?.data?.[0]?.last) {
            this.rates['BTC-USDT'] = parseFloat(data.data[0].last);
            return null;
          }
          return 'Не удалось получить курс BTC-USDT. Используется запасной вариант.';
        }),
        catchError(() => of('Не удалось получить курс BTC-USDT. Используется запасной вариант.'))
      ),
      this.http.get('/api/market/ticker?instId=ETH-USDT').pipe(
        map((data: any) => {
          if (data?.data?.[0]?.last) {
            this.rates['ETH-USDT'] = parseFloat(data.data[0].last);
            return null;
          }
          return 'Не удалось получить курс ETH-USDT. Используется запасной вариант.';
        }),
        catchError(() => of('Не удалось получить курс ETH-USDT. Используется запасной вариант.'))
      ),
      this.http.get('/coingecko/simple/price?ids=tether&vs_currencies=rub').pipe(
        map((data: any) => {
          if (data?.tether?.rub) {
            this.rates['USDT-RUB'] = data.tether.rub;
            return null;
          }
          return 'Не удалось получить курс USDT-RUB. Используется запасной вариант.';
        }),
        catchError(() => of('Не удалось получить курс USDT-RUB. Используется запасной вариант.'))
      )
    ];

    return new Observable(observer => {
      let errorMessage = '';
      Promise.all(observables.map(obs => obs.toPromise())).then(errors => {
        errorMessage = errors.filter(e => e).join(' ');
        observer.next({ rates: this.rates, error: errorMessage || null });
        observer.complete();
      });
    });
  }

  getRates() {
    return this.rates;
  }
}