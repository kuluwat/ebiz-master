import { Component, OnInit, Input, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-mat-spinner-overlay',
  templateUrl: './mat-spinner-overlay.component.html',
  styleUrls: ['./mat-spinner-overlay.component.css']
})
export class MatSpinnerOverlayComponent implements OnInit {

  //overlay: boolean = false;
  @Input() overlay: boolean = true;

  constructor() { }

  ngOnInit() {
  }

}
