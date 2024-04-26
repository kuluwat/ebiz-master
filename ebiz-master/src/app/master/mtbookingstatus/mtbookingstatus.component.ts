import { FileuploadserviceService } from './../ws/fileuploadservice/fileuploadservice.service';
import { AppComponent } from './../../app.component';
import { AspxserviceService } from './../ws/httpx/aspxservice.service';
import { HttpClient } from '@angular/common/http';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { MaintainComponent } from './../maintain/maintain/maintain.component';
import { Component, OnInit, Inject, forwardRef, ElementRef, Renderer2, TemplateRef, ViewChild } from '@angular/core';

import Swal from "sweetalert2/dist/sweetalert2.js";
import { DatePipe } from '@angular/common';
declare var $: any;
@Component({
  selector: 'app-mtbookingstatus',
  templateUrl: './mtbookingstatus.component.html',
  styleUrls: ['./mtbookingstatus.component.css']
})
export class MtbookingstatusComponent implements OnInit {
  
  @ViewChild('cancel', { static: true }) btnCloseX: ElementRef;
  panel1 = {
    show: true,
    after: false
  }
  panel2 = {
    show: true,
    after: false
  }


  testCher;
  step;
  Booking_Status;
  Booking_name;
  TypeUpdate = false;
  ArrData = [];
  selectedFile: File = null;
  tp_clone: TemplateRef<any>;
  modalRef: BsModalRef;

  constructor(
    @Inject(forwardRef(() => MaintainComponent)) private appMain: MaintainComponent,
    private elem: ElementRef, private renderer: Renderer2,
    private modalService: BsModalService,
    private http: HttpClient,
    private ws: AspxserviceService,
    private x: AppComponent,
    private fileuploadservice: FileuploadserviceService,
  ) { }
  ngOnInit() {
    this.onloadX1();
  }

  onloadX1() {

    this.appMain.isLoading = true;
    /* let bodyX = {
      "token_login": localStorage["token"],
      "doc_id": this.doc_id
    } */
    
    let bodyX = {
      "token_login": "b8a27da5-c587-405d-8a45-20e39c98e5ce",
      "page_name": "bookingstatus",
      "module_name": "master list status",
    }

    const onSuccess = (data): void => {
      console.log("-------------");
      console.log(data);
      this.ArrData = data;
      this.ArrData['list_status'].forEach(function(e){
        if (typeof e === "object" ){
          var re ;
          if(e.status == '1'){ re = true;}
          else{ re = false;}
          e["StatusTF"] = re;
        }
      })
      this.appMain.isLoading = false
    }

    this.ws.callWs(bodyX, 'LoadMasterData').subscribe(data => onSuccess(data), error => {
      this.appMain.isLoading = false
      console.log(error);
    })

  }

  checkValue(event: any){
    var re ;
    if(event == '1'){ re = true;}
    else{ re = false;}
    console.log(re);
    return re;
 }



  Status_Update(){
    var id = localStorage["id"];
    var value = this.Booking_name ;
    var status = this.Booking_Status ;
    this.ArrData['list_status'].forEach(e => {
      if(e.id == id){

        e.name = value ;
        e.action_change = true;
        if(status == '1'){
          e.StatusTF = true;
        }else{ e.StatusTF = false; }
        e.status = status;

      }
    });
    
    this.Save_D();
    this.btnCloseX.nativeElement.click();
  }

  Status_Edit(template: TemplateRef<any>,id){

    this.TypeUpdate = true;
    this.openModalx(template);
    var text;
    var Booking_StatusX;
    this.ArrData['list_status'].forEach(e => {
      if(e.id == id){
        text = e.name ;
        Booking_StatusX = e.status ; 
      }
    });
    localStorage.setItem("id", id);
    this.Booking_name = text ;
    this.Booking_Status = Booking_StatusX ;
  }


  Chang_Status(id, textX, txbtn) {

    
    console.log(this.ArrData['list_status']);
    var mes;
    //var mes = "Do you want to delete?";
    if (textX == 'update') {
      mes = "Do you want to save the changes?";
    }
    else {
      mes = "Do you want to delete?";
    }
    //var txbtn = "Delete";
    this.swal_confrim(mes, txbtn).then((val) => {

      if (val.isConfirmed) {

        this.ArrData['list_status'].forEach(function (e) {
          if (e.id == id) {

            if (textX == 'update') {
                if(e.StatusTF == true){ e.status = "1"; }
                else{ e.status = "0"; }
            }
            e.action_type = textX.toLowerCase();;
            e.action_change = true;
            
          }
        })
        
        this.Save_D();
      } else {

        this.ArrData['list_status'].forEach(function (e) {
          if (e.id == id) {
            if (e.status == false) {
              e.status = true;
            }
            else {
              e.status = false;
            }
            e.action_change = true;
          }
        })
        return;
      }
    })

  }

  openModalx(template: TemplateRef<any>) {
    this.tp_clone = template;
    let config: object = {
      class: "modal-md",
      animated: true,
      keyboard: false,
      ignoreBackdropClick: true,
    };

    this.modalRef = this.modalService.show(template, config);

  }

  Add_Status(values) {

    this.TypeUpdate = false;
    console.log(values);
    var check_values;
    this.ArrData['list_status'].forEach(function (e) {
      if (e.name == values) {
        check_values = false;
      }
    })

    if (check_values == false || values == "") {
      this.Swalalert("Reamrk Name Already", "error")
      return;
    } else {

      var id_max = 0;
      var sort_by_max = 0;
      this.ArrData['list_status'].forEach(function (e) {
        if (parseInt(e.id) >= id_max) { id_max = parseInt(e.id); }
        if (parseInt(e.sort_by) >= sort_by_max) { sort_by_max = parseInt(e.sort_by); }
      })

      this.ArrData['list_status'].push({

        "token_login": null,
        "data_type": null,
        "user_admin": false,
        "id_main": null,
        "id_sub": null,
        "id": id_max + 1,
        "name": values,
        "description": null,
        "status": "1",
        "sort_by":sort_by_max + 1,
        "page_name": "bookingstatus",
        "module_name": "master list status",
        "question_other": null,
        "action_type": "insert",
        "action_change": true,
        "StatusTF":true

      });
      this.Save_D();
      console.log(this.ArrData['list_status']);
      this.btnCloseX.nativeElement.click();
      this.Swalalert('Update data successfully.', 'success')

    }

  

  }

  Save_D() {

    //this.ArrSaveMaster =  data_type":"save",
    this.appMain.isLoading = true;
    this.ArrData['data_type'] = "save";
    this.ArrData['page_name'] = "bookingstatus"
    this.ArrData['module_name'] = "master list status";


    console.log(this.ArrData);

    const onSuccess = (data): void => {
      console.log(data);
      if (data.after_trip.opt1 == "true") {
        this.Swalalert('Update data successfully.', 'success');
      } else {
        this.Swalalert('Error.', 'error');
      }

      this.appMain.isLoading = false
    }

    this.ws.callWs(this.ArrData, 'SaveMasterData').subscribe(data => onSuccess(data), error => {
      this.appMain.isLoading = false
      console.log(error);
    })

  }


  Cancel_status() {

    this.TypeUpdate = false;
    this.Booking_name = "";
    this.btnCloseX.nativeElement.click();

  }


  check_el(values){

    var re ;
    if(values != ""){
      re = true;
    }else{
      re = false;
    }
    return re ;
    
  }

  testTextX(event){
    //testTextX
    if(event == ""){
      $("#idchang").removeClass('borderfield2')
      $("#idchang").removeClass('borderfield2')
      $("#idchang").addClass('borderfield1')
      $("#idchang").addClass('borderfield1')
    }else{
      $("#idchang").removeClass('borderfield1')
      $("#idchang").removeClass('borderfield1')
      $("#idchang").addClass('borderfield2')
      $("#idchang").addClass('borderfield2')
    }

    console.log(event);
  }

  onResize(xxx){

    //var xxx  = $('#rez').width()
    //xxx = (xxx-100)
    var status;
    if(xxx > 450){
      this.step = true;
      status = true;
    }
    else{
      this.step = false;
      status = false;
    }
    
    console.log(status);
    console.log(xxx);
    return this.step ;
  }





  Swalalert(msg, type) {
    Swal.fire(msg, "", type);
  }

  swal_confrim(type_data, btntext) {
    return Swal.fire({
      //title: "Do you want to save the " + type_data + " ?",
      title: type_data,
      icon: "warning",
      showCancelButton: true,
      cancelButtonColor: "#d33",
      confirmButtonText: btntext,
    });
  }


  
}
