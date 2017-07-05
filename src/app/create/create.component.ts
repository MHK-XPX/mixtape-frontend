import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'create',
    templateUrl: './create.component.html',
    styleUrls: [ './create.component.css' ]
})

export class CreateComponent{
    constructor(private _router: Router){}
}