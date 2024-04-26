import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, forwardRef, Inject, OnInit, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { AppComponent } from 'src/app/app.component';
import { AlertServiceService } from 'src/app/services/AlertService/alert-service.service';
import { MaintainComponent } from '../maintain/maintain/maintain.component';
import { FileuploadserviceService } from '../ws/fileuploadservice/fileuploadservice.service';
import { AspxserviceService } from '../ws/httpx/aspxservice.service';

@Component({
  selector: 'app-mtvisadocument',
  templateUrl: './mtvisadocument.component.html',
  styleUrls: ['./mtvisadocument.component.css']
})
export class MtvisadocumentComponent implements OnInit {

  @ViewChild('cancel', { static: true }) btnCloseX: ElementRef;


  Preparingx:string;
  Descriptionx:string;
  selectedFile: File = null;
  tp_clone: TemplateRef<any>;
  modalRef: BsModalRef;
  ArrData = [];
  status_add_uodate = true;
  destC = 'พาสปอรตตัวจรงเลมปจจบันอายุไมตากวา 6 เดือน และตองมีหนาวางตั้งแต 2 หนาข้นไป';
  Preparing = "PMSV/Employee"
  visa_document ;
  id_update ;
  constructor(

    @Inject(forwardRef(() => MaintainComponent)) private appMain: MaintainComponent,
    private elem: ElementRef, private renderer: Renderer2,
    private modalService: BsModalService,
    private http: HttpClient,
    private ws: AspxserviceService,
    private x: AppComponent,
    private fileuploadservice: FileuploadserviceService,
    private swl : AlertServiceService
  ) { }

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
      "page_name": "visa",
      "module_name": "master visa document",
    }

    const onSuccess = (data): void => {
      console.log('--------------Load Data-----------------');
      console.log(data);
      this.ArrData = data;
      this.visa_document = data.visa_document;
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


  Status_Edit(template: TemplateRef<any>,id){

    this.openModalx(template);
    this.id_update = id ;
    this.status_add_uodate = false;
    var des,pre ;
    this.visa_document.forEach(function(e){
      if(e.id == id){
        des = e.description ;
        pre = e.preparing_by ;
        e.action_change = "true"
      }
    })
    this.Descriptionx = des ;
    this.Preparingx = pre ;


  }


  cancel_doc(){
    this.btnCloseX.nativeElement.click();
  }


  update_doc(){
    var id = this.id_update ;
    var pre = this.Preparingx ;
    var des = this.Descriptionx ;
    this.visa_document.forEach(function(e){
      if(e.id == id){
        e.preparing_by = pre;
        e.description = des ;
      }
    }) 

    this.Preparingx = '';
    this.Descriptionx = '';
    this.Save_D();
    this.btnCloseX.nativeElement.click();
  }

  edit_doc(id){
    this.visa_document.forEach(function(e){
      if(e.id == id){

      }
    })
    
  }
  

  add_doc(val1,val2){

    console.log(val1);
    console.log(val2);

    var data_max1 = this.getMax(this.visa_document, 'id');
    var data_max2 = this.getMax(this.visa_document, 'sort_by');

    this.visa_document.push({
      token_login: null,
      data_type: null,
      user_admin: false,
      id: parseInt(data_max1.id)+1,
      name: "",
      preparing_by: val2,
      description: val1,
      status: "1",
      sort_by: parseInt(data_max2.sort_by)+1,
      remark: null,
      action_type: "insert",
      action_change: "true",
      sub_data: "false"
    })

    this.Save_D();

    this.Preparingx = '';
    this.Descriptionx = '';
    this.modalRef.hide()
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

  Chang_Status_update(id){
    this.status_add_uodate = false;
  }

  Chang_Status_dlete(id){
    this.visa_document.forEach(function(e){
      if(e.id == id){
        e.action_type = "delete"
        e.action_change = "true"
      }
    })
    this.Save_D();
  }


  getMax(arr, prop) {
    var max;
    
    for (var i = 0; i < arr.length; i++) {
      if (max == null || parseInt(arr[i][prop]) > parseInt(max[prop]))
        max = arr[i];
    }
    //if ( max == "") { max = 0;}


    return max;
  }

  Save_D() {

    //this.ArrSaveMaster =  data_type":"save",
    this.appMain.isLoading = true;
    this.ArrData['data_type'] = "save";
    this.ArrData['page_name'] = "visadocument"
    this.ArrData['module_name'] = "master visa document";
    this.ArrData['visa_document'] = this.visa_document ;
    
    console.log(this.ArrData);
    const onSuccess = (data): void => {
      console.log(data);
      this.ArrData = data;
      this.visa_document = data.visa_document ;
      this.appMain.isLoading = false
    }

    this.ws.callWs(this.ArrData, 'SaveMasterData').subscribe(data => onSuccess(data), error => {
      this.appMain.isLoading = false
      console.log(error);
    })

  }

}
