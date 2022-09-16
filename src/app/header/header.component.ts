import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IRateForUah } from "./../models/rateForUah";

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
	constructor() { }

	@Input() ratesForUah: IRateForUah;

	ngOnInit(): void {
	}
}
