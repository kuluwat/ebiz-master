import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, forwardRef, Inject, OnInit, Renderer2, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AppComponent } from '../../app.component';
import { AlertServiceService } from '../../services/AlertService/alert-service.service';
import { MaintainComponent } from '../maintain/maintain.component';
import { AspxserviceService } from '../../ws/httpx/aspxservice.service';

@Component({
  selector: 'app-mtbroker',
  templateUrl: './mtbroker.component.html',
  styleUrls: ['./mtbroker.component.css']
})
export class MtbrokerComponent implements OnInit {

  tp_clone: TemplateRef<any>;
  modalRef: BsModalRef;
  ArrData = [];
  status_add_uodate = true;
  arr_mtbroker = [];
  TypeUpdate = false;
  inputText = {
    broker_name:'',
    email:'',
    isos:false,
    insurance:false
  }
  constructor(    @Inject(forwardRef(() => MaintainComponent)) private appMain: MaintainComponent,
  private elem: ElementRef, private renderer: Renderer2,
  private modalService: BsModalService,
  private http: HttpClient,
  private ws: AspxserviceService,
  private x: AppComponent,
  private swl : AlertServiceService) { }

  ngOnInit() {
    this.onloadX();
  }
  

  
  onloadX() {

    this.appMain.isLoading = true;
    /* let bodyX = {
      "token_login": localStorage["token"],
      "doc_id": this.doc_id
    } */
    let bodyX = {
      "token_login": "b8a27da5-c587-405d-8a45-20e39c98e5ce",
      "page_name": "broker",
      "module_name": "master insurance broker",
    }

    const onSuccess = (data): void => {
      console.log('--------------Load Data Insurance/ISOS List(Master Broker)-----------------');
      console.log(data);
      this.ArrData = data;
      this.arr_mtbroker = data.master_insurancebroker;
      this.appMain.isLoading = false;


      this.arr_mtbroker.sort((a, b) => parseFloat(a.id) - parseFloat(b.id));

      this.arr_mtbroker.forEach(e=>{
        e.status_isos = this.getBoolean(e.status_isos); 
        e.status_insurance = this.getBoolean(e.status_insurance); 
        e.status = this.getBoolean(e.status);
      })
    }

    this.ws.callWs(bodyX, 'LoadMasterData').subscribe(data => onSuccess(data), error => {
      this.appMain.isLoading = false
      console.log(error);
    })
  }

  getBoolean(value) {
    switch (value) {
      case true:
      case "true":
      case 1:
      case "1":
      case "on":
      case "yes":
        return true;
      default:
        return false;
    }
  }


  openModalx(template: TemplateRef<any>) {
    this.status_add_uodate = true;
    this.tp_clone = template;
    let config: object = {
      class: "modal-lg",
      animated: true,
      keyboard: false,
      ignoreBackdropClick: true,
    };

    this.modalRef = this.modalService.show(template, config);

  }

  check_el(val){

    var re = false ;
   
      if(val == ''){
        re = true ;
      }
    
    return re ;
  }

  addrow(){
    var id = this.id_update ;
    var re = false ;
    if(this.inputText.broker_name == '') {
      this.submit_active = true ;
      re = true ;
    }

    if(this.inputText.email == '')
    {
      this.submit_active = true ;
      re = true ;
    }

    if(re == false){

      this.arr_mtbroker.push({
        id: "1",
        name: this.inputText.broker_name,
        email: this.inputText.email,
        travelcompany_type: "Broker",
        statusT: true,
        status: "1",
        sort_by: "1",
        status_isos: this.inputText.isos,
        status_insurance : this.inputText.insurance,
        action_type: "insert",
        action_change: "true"
      })
      this.Save_D();
      this.modalRef.hide()
      this.submit_active = false ;
    }
  }

  Updatex(){

    var id = this.id_update ;
    var re = false ;
    if(this.inputText.broker_name == '') {
      this.submit_active = true ;
      re = true ;
    }

    if(this.inputText.email == '')
    {
      this.submit_active = true ;
      re = true ;
    }

    var name = this.inputText.broker_name;
    var email = this.inputText.email;
    var isos = this.inputText.isos ;
    var insurance = this.inputText.insurance ;

    debugger;
    if(re == false){
      //alert('xxx');
      this.submit_active = false ;
      this.arr_mtbroker.forEach(e=>{
        if(e.id == id){
          e.name = name;
          e.email = email;
          e.status_isos = isos ;
          e.status_insurance = insurance ;
        }
      })

      this.Save_D();
      
      this.modalRef.hide()
    }else{
      return ;
    }
  }

  Cancelx(){
    this.submit_active = false;
    this.inputText.broker_name = '' ;
    this.inputText.email = '' ;
    this.inputText.isos = false ;
    this.inputText.insurance = false ;
    this.TypeUpdate = true ;
    this.modalRef.hide()
  }

  Chang_Status_dlete(id){
    this.swl.swal_confrim_delete('').then((val) => {
      //this.getBoolean(
      if (val.isConfirmed) {
        this.arr_mtbroker.forEach(function(e){
          if(e.id == id){
            e.action_type = "delete"
            e.action_change = "true"
          }
        })
        this.Save_D();
      }
    })

  }

  CheckStatusSave(val,id,typeX){
    debugger;
    console.log(val);

    if(typeX == 0){
      if(val == false){
        this.swl.swal_error('Please select more than one');
        return ;
      }else{
        this.arr_mtbroker.forEach(e=>{
          e.action_change = "true";
          e.status_isos = false ;
        })
      }
    }

    this.arr_mtbroker.forEach(e=>{
      if(e.id == id){
        e.action_change = "true";

          if(typeX == 0){
            e.status_isos = val ;

          }else{
            e.status_insurance = val ;
          }

      }
    })
    console.log('first save');
    console.log(this.arr_mtbroker); 
    this.Save_D();
  }

  Save_D() {

    //this.ArrSaveMaster =  data_type":"save",
    //this.appMain.isLoading = true;
    this.ArrData['data_type'] = "save";
    this.ArrData['page_name'] = "broker"
    this.ArrData['module_name'] = "master insurance broker";

    console.log('first save');
    console.log(this.arr_mtbroker); 
    this.arr_mtbroker.forEach(e=>{

      if(e.status_isos == true){
        e.status_isos = "true" ;
      }else{
        e.status_isos = "false" ;
      }

      if(e.status_insurance == true){
        e.status_insurance = "true" ;
      }else{
        e.status_insurance = "false" ;
      }

      if(e.status == true){
        e.status = "1" ;
      }else{
        e.status = "0" ;
      }

    })
    this.ArrData['master_insurancebroker'] = this.arr_mtbroker ;
    
    console.log('before save');
    console.log(this.ArrData);
    const onSuccess = (data): void => {
      console.log('after save');
      console.log(data);
      if (data.after_trip.opt1 == "true") {
        this.swl.swal_sucess('');
      } else {
        this.swl.swal_error('');
      }
      this.ArrData = data;
      this.arr_mtbroker = data.master_insurancebroker ;
      this.arr_mtbroker.sort((a, b) => parseFloat(a.id) - parseFloat(b.id));
      this.appMain.isLoading = false;

      this.arr_mtbroker.forEach(e=>{
        e.status_isos = this.getBoolean(e.status_isos); 
        e.status_insurance = this.getBoolean(e.status_insurance); 
        e['statusT'] = this.getBoolean(e.status);
      })

      console.log('status convers');
      console.log(this.arr_mtbroker);
      this.inputText.broker_name = '' ;
      this.inputText.email = '' ;
      this.inputText.isos = false ;
      this.inputText.insurance = false ;
    }

    this.ws.callWs(this.ArrData, 'SaveMasterData').subscribe(data => onSuccess(data), error => {
      this.appMain.isLoading = false
      console.log(error);
    }) 

  }

  Chang_Status_update(id){
    this.swl.swal_confrim_changes('Do you want to changes Status').then((val) => {
      //this.getBoolean(
      debugger;
      if (val.isConfirmed) {

        this.arr_mtbroker.forEach(e=>{
          if(e.id == id){
            e.action_change = "true";
          }

        }) 
        console.log(this.arr_mtbroker);
        this.Save_D();
      }
    })
    this.status_add_uodate = false;
  }

  submit_active = false;
  id_update
  Status_Edit(template: TemplateRef<any>,id){

    this.TypeUpdate = true ;
    this.arr_mtbroker.forEach(e=>{
      if(e.id == id){
        this.inputText.broker_name = e.name ;
        this.inputText.email = e.email ;
        this.inputText.isos = e.status_isos;
        this.inputText.insurance = e.status_insurance;
      }
    })

    this.openModalx(template);
    this.id_update = id ;
    this.status_add_uodate = false;
    var des,pre ;
    this.arr_mtbroker.forEach(function(e){
      if(e.id == id){
        des = e.description ;
        pre = e.preparing_by ;
        e.action_change = "true"
      }
    })



  }


}
