import { Component, Input, OnInit } from '@angular/core';
import { RatesService } from './../services/rates.service';
import { IRates } from "./../models/rates";
import { IState } from "./../models/state";
import { ISymbolsResponse } from "./../models/symbolsResponse";
import { AppComponent } from "./../app.component";

@Component({
	selector: 'app-converter',
	templateUrl: './converter.component.html',
	styleUrls: ['./converter.component.scss']
})
export class ConverterComponent implements OnInit {
	constructor(private ratesService: RatesService, private app: AppComponent) { }

	@Input() rates: IRates | null;

	currencies: string[] = [];
	state: IState = {
		firstCurrency: '',
		secondCurrency: '',
		firstAmount: null,
		secondAmount: null
	};
	rateForOne: number | null = null;

	getRate(): number | undefined {
		type rateKey = keyof typeof this.rates;
		return this.rates?.[this.state.secondCurrency as rateKey];
	}

	updateCurrencyRate(): void {
		this.calculateRate(this.state.firstAmount);
		let rate: number = Number(this.getRate());
		this.rateForOne = this.app.modifyNumber(rate);
	}

	getAmount(event: Event): number | null {
		let value: number = +(event.target as HTMLInputElement).value;
		return value === 0 ? null : value;
	}

	calculateRate(field: number | null): void {
		let rate: number | undefined = this.getRate();
		let result: number | null = null;

		if (rate && field === this.state.firstAmount) {
			result = this.state.firstAmount && this.state.firstAmount * rate;
			this.state.secondAmount = result && Number(this.app.modifyNumber(result));
		}

		if (rate && field === this.state.secondAmount) {
			result = this.state.secondAmount && this.state.secondAmount / rate;
			this.state.firstAmount = result && Number(this.app.modifyNumber(result));
		}
	}

	onChangeFirst(value: string): void {
		this.ratesService.getRates(value).subscribe(response => {
			this.rates = response.rates;
			this.updateCurrencyRate();
		})
	}

	onChangeSecond(value: string): void {
		this.state.secondCurrency = value;
		this.updateCurrencyRate();
	}

	getValueFirst(event: Event): void {
		this.state.firstAmount = this.getAmount(event);
		this.calculateRate(this.state.firstAmount);
	}

	getValueSecond(event: Event): void {
		this.state.secondAmount = this.getAmount(event);
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
	}
}