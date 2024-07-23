import { HttpClient } from '@angular/common/http'; // Змінено на HttpClient
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { CurrencyType } from '../types/currency';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  private apiUrl = '/api/p24api/pubinfo?json&exchange&coursid=5';

  constructor(private http: HttpClient) {
    this.getCurrency();
  }

  getCurrency() {
    return this.http.get(this.apiUrl).pipe(
      map((response: any) => response as CurrencyType[])
    );
  }
}
