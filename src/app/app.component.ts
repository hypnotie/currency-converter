import { Component, OnInit } from '@angular/core';
import { IRateForUah } from './models/rateForUah';
import { IRates } from './models/rates';
import { RatesService } from './services/rates.service';
import { IRatesResponse } from "./models/ratesResponse";

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
	constructor(private ratesService: RatesService) { }

	rates: IRates | null = null;
	ratesForUah: IRateForUah = {
		usdToUah: null,
		eurToUah: null
	}

	modifyNumber(number: number): number {
		let roundedNumber = number.toString().match(/^-?\d*\.?0*\d{0,2}/);
		return Number(roundedNumber);
	}

	getRate(response: IRatesResponse) {
		type rateKey = keyof typeof response.rates;
		let rate: number = response.rates?.['UAH' as rateKey];
	  return rate ? this.modifyNumber(rate) : null;
	}
	
	ngOnInit(): void {
		this.ratesService.getRates('USD').subscribe(response => {
			this.rates = response.rates;
			this.ratesForUah.usdToUah = this.getRate(response);
		})

		this.ratesService.getRates('EUR').subscribe(response => {
			this.ratesForUah.eurToUah = this.getRate(response);
		})
	}
}