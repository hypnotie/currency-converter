import { Component, OnInit } from '@angular/core';
import { RatesService } from './services/rates.service';
import { IRates } from "./models/rates";
import { IState } from "./models/state";
import { ISymbolsResponse } from "./models/symbolsResponse";

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
	constructor(private ratesService: RatesService) { }

	title = 'currency-converter';
	currencies: string[] = [];
	rates: IRates | null = null;
	state: IState = {
		firstCurrency: '',
		secondCurrency: '',
		firstAmount: null,
		secondAmount: null
	};
	rateForOne: number | null = 0;
	usdToUah: number | null = null;
	eurToUah: number | null = null;

	modifyNumber(number: number): number {
		return Number(number.toFixed(20).match(/^-?\d*\.?0*\d{0,2}/));
	}

	getRate(): number | undefined {
		type rateKey = keyof typeof this.rates;
		return this.rates?.[this.state.secondCurrency as rateKey];
	}

	calculateRate(field: number | null): void {
		let rate: number | undefined = this.getRate();
		let result: number | null = null;

		if (rate && field === this.state.firstAmount) {
			if (this.state.firstCurrency === this.state.secondCurrency) {
				this.state.secondAmount = this.state.firstAmount && +this.state.firstAmount.toFixed(2);
			} else {
				result = this.state.firstAmount && this.state.firstAmount * rate;
				this.state.secondAmount = result && Number(this.modifyNumber(result));
			}
		} else {
			if (this.state.firstCurrency === this.state.secondCurrency) {
				this.state.firstAmount = this.state.secondAmount && +this.state.secondAmount.toFixed(2);
			} else {
				result = this.state.secondAmount && this.state.secondAmount / rate!;
				this.state.firstAmount = result && Number(this.modifyNumber(result));
			}
		}
	}

	onChangeFirst(value: string): void {
		this.ratesService.getRates(value).subscribe(response => {
			this.rates = response.rates;
			this.calculateRate(this.state.firstAmount);
			let rate: number | undefined = Number(this.getRate());
			this.rateForOne = Number(this.modifyNumber(rate));
		})
	}

	onChangeSecond(value: string): void {
		this.state.secondCurrency = value;
		this.calculateRate(this.state.firstAmount);
		let rate: number | undefined = Number(this.getRate());
		this.rateForOne = Number(this.modifyNumber(rate));
	}

	getValueFirst(event: Event): void {
		let value: number | null = +(event.target as HTMLInputElement).value;
		this.state.firstAmount = (value === 0) ? null : value;
		this.calculateRate(this.state.firstAmount);
	}

	getValueSecond(event: Event): void {
		let value: number | null = +(event.target as HTMLInputElement).value;
		this.state.secondAmount = (value === 0) ? null : value;
		this.calculateRate(this.state.secondAmount);
	}

	ngOnInit(): void {
		this.ratesService.getSymbols().subscribe(response => {
			type rateKey = keyof typeof response.symbols;

			Object.keys(response.symbols).forEach((symbol) => {
				let code: ISymbolsResponse = response.symbols[symbol as rateKey];
				this.currencies.push(code.code);
			});

			this.state.firstCurrency = this.currencies.find((currency) => (
				currency == 'USD'
			)) || (this.currencies.length == 0 ? '' : this.currencies[0]);
		})

		this.ratesService.getRates('USD').subscribe(response => {
			this.rates = response.rates;
			type rateKey = keyof typeof this.rates;
			let rate: number = this.rates?.['UAH' as rateKey];
			if (rate) {
				this.usdToUah = Number(this.modifyNumber(rate));
			}
		})

		this.ratesService.getRates('EUR').subscribe(response => {
			type rateKey = keyof typeof response.rates;
			let rate: number = response.rates?.['UAH' as rateKey];
			if (rate) {
				this.eurToUah = Number(this.modifyNumber(rate));
			}
		})
	}
}