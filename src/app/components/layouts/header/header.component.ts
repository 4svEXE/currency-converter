import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { CurrencyType } from '../../../core/types/currency';
import { CurrencyService } from '../../../core/services/currency.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  private subs: Subscription[] = [];
  currencies: CurrencyType[] = [];

  constructor(private currencyService: CurrencyService) {
    this.currencyService.getCurrency().subscribe((data) => {
      this.currencies = data
    });
  }
  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
  }

  getCurrency(currency: string): string | undefined {
    if (!this.currencies) return undefined;

    const curr = this.currencies.find((item) => item.ccy === currency);
    return curr ? curr.buy : undefined;
  }
}
