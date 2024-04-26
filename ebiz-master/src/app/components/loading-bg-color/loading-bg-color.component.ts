import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading-bg-color',
  templateUrl: './loading-bg-color.component.html',
  styleUrls: ['./loading-bg-color.component.css']
})
export class LoadingBgColorComponent implements OnInit {

  @Input() overlay: boolean = true;

  constructor() { }

  ngOnInit() {
  }

}
