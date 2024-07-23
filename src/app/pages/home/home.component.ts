import { Component } from '@angular/core';
import { CurrencyService } from '../../core/services/currency.service';
import { CurrencyType } from '../../core/types/currency';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private subs: Subscription[] = [];
  currencies: CurrencyType[] = [];
  exchangeForm: FormGroup;
  aviableCurrencies: ['USD', 'EUR', 'UAH'] = ['USD', 'EUR', 'UAH'];

  constructor(
    private currencyService: CurrencyService,
    private fb: FormBuilder
  ) {
    this.currencyService.getCurrency().subscribe((data) => {
      this.currencies = data;
    });

    this.exchangeForm = this.fb.group({
      from: [''],
      select_from: [this.aviableCurrencies[0], Validators.required],
      to: [''],
      select_to: [this.aviableCurrencies[1], Validators.required],
    });
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
  }

  exchange(field: string): void {
    const fromCurrency = this.exchangeForm.get('select_from')?.value;
    const toCurrency = this.exchangeForm.get('select_to')?.value;
    const fromAmount = this.exchangeForm.get('from')?.value;
    const toAmount = this.exchangeForm.get('to')?.value;

    if (!fromCurrency || !toCurrency) return;

    const USD = parseFloat(this.currencies.find(c => c.ccy === 'USD')?.sale || '0');
    const EUR = parseFloat(this.currencies.find(c => c.ccy === 'EUR')?.sale || '0');
    const USDtoEUR = USD / EUR;
    const USDtoUAH = USD;
    const UAHtoEUR = EUR;

    const rates: { [key: string]: number } = {
      'USD_EUR': USDtoEUR,
      'USD_UAH': USDtoUAH,
      'UAH_EUR': 1 / UAHtoEUR,
      'UAH_USD': 1 / USDtoUAH,
      'EUR_USD': USDtoEUR,
      'EUR_UAH': UAHtoEUR
    };

    const key = `${fromCurrency}_${toCurrency}`;
    const rate = rates[key];

    if (field === 'from') {
      this.exchangeForm.get('to')?.setValue((fromAmount * rate || 0).toFixed(2));
    } else if (field === 'to') {
      this.exchangeForm.get('from')?.setValue((toAmount / rate || 0).toFixed(2));
    }
  }
}
