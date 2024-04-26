import { Component, OnInit, ViewChild, Inject, forwardRef } from '@angular/core';
import { MainComponent } from '../main.component';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit {
  
  constructor(
    @Inject(forwardRef(() => MainComponent)) private appMain: MainComponent
    ){
     if(localStorage["login_show_message"] == "true"){
      //appMain.showMessage("Login done")
      
      localStorage["login_show_message"] = "false"
    }
  }

  ngOnInit() {
    
  }


}
