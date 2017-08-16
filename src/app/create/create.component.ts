import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'create-entity',
    templateUrl: './create.component.html',
    styleUrls: [ './create.component.css' ]
})

export class CreateEntityComponent{
    constructor(private _router: Router){}
}