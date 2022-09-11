import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ICurrencies } from "./../models/currencies";
import { IRatesResponse } from "./../models/ratesResponse";

@Injectable({
	providedIn: "root"
})
export class RatesService {
	constructor(
		private http: HttpClient,
	) { }

	getRates(base: string): Observable<IRatesResponse> {
		return this.http.get<IRatesResponse>(`https://api.exchangerate.host/latest?base=${base.toLowerCase()}`);
	}

	getSymbols(): Observable<ICurrencies> {
		return this.http.get<ICurrencies>('https://api.exchangerate.host/symbols');
	}
};