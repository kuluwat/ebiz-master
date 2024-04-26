import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-button-to-top',
  templateUrl: './button-to-top.component.html',
  styleUrls: ['./button-to-top.component.css']
})
export class ButtonToTopComponent implements OnInit {

  mybutton = document.getElementById("myBtnX");

  //.scroll = new Subject<number>();

  constructor() { }

  ngOnInit() {

    //window.onscroll = function () { this.scrollFunction() };
    // this.scroll
    //   .pipe(debounceTime(200))
    //   .subscribe((y) => this.dealWithScroll(window.scrollY));
    //   window.addEventListener('scroll', this.scroll, true); //third parameter
  }

  //Get the button:


  // When the user scrolls down 20px from the top of the document, show the button


  // scrollFunction() {
  //   console.log(document.body.scrollTop);
  //   if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
  //     this.mybutton.style.display = "block";
  //   } else {
  //     this.mybutton.style.display = "none";
  //   }
  // }
  // When the user clicks on the button, scroll to the top of the document
  topFunction(): void {
    // document.body.scrollTop = 0; // For Safari
    // document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
