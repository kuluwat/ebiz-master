import { AspxserviceService } from './../../ws/httpx/aspxservice.service';
import { Component, OnInit, ViewChild, ElementRef, TemplateRef, Inject, forwardRef } from '@angular/core';
import { MaintainComponent } from '../maintain/maintain.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import Swal from "sweetalert2/dist/sweetalert2.js";
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { AlertServiceService } from '../../services/AlertService/alert-service.service';

declare var $: any;
@Component({
  selector: 'app-mtdailyallowance',
  templateUrl: './mtdailyallowance.component.html',
  styleUrls: ['./mtdailyallowance.component.css']
})
export class MtdailyallowanceComponent implements OnInit {

  @ViewChild('cancel', { static: true }) btnCloseX: ElementRef;
  @ViewChild('model1', { static: true }) model1: ElementRef;
  @ViewChild('model2', { static: true }) model2: ElementRef;
  @ViewChild('model3', { static: true }) model3: ElementRef;
  @ViewChild('td_H', { static: true }) th1: ElementRef;
  @ViewChild('td_H', { static: true }) td1: ElementRef;



  arr_demo = [5, 5, 5, 5, 5, 5, 5];
  panel1 = {
    show: true,
    after: false
  }
  
  panel2 = {
    show: true,
    after: false
  }

  panel3 = {
    show: true,
    after: false
  }

  zone_list;
  county_list;
  step = true;
  Allwance_arr =
    {
      id:"",
      Category: "",
      type: "",
      khrate: "",
      kh_up_down: "",
      plan: "",
      sub_plan: "",
      price: "",
      currency: ""
    }
  TypeUpdate = false;
  TypeUpdate2 = false;
  Booking_Status1;
  Booking_Status2;
  Remark_value = "";

  allowance_list = [];
  arr_data = {
    allowance_list: [],
    allowance_type: []
  };
  arr_dataX1;
  arr_dataX2;

  Zone_modelDT = {
    config: {
      displayKey: 'name',
      search: true,
      limitTo: 1000,
      height: "250px",
      position: "fixed",
      placeholder: 'Select',
      customComparator: (function (a, b) {
        if (a.name < b.name) { return -1; }
        if (a.name > b.name) { return 1; }
        return 0;
      })

    }
  }

  country_modelDT = {
    config: {
      displayKey: 'name',
      search: true,
      limitTo: 1000,
      height: "250px",
      position: "fixed",
      clearOnSelection: false,
      customComparator: (function (a, b) {
        if (a.name < b.name) { return -1; }
        if (a.name > b.name) { return 1; }
        return 0;
      })
      /* placeholder: 'Select', */
      /* clearOnSelection: true,
      inputDirection: 'ltr' */
    }
  }

  dropdown_oversee =[
    /* {
      id:'',
      name:'Select'
    }, */
    {
      id:'0',
      name:'Continent'
    },
    {
      id:'1',
      name:'Country'
    },
    ]
  overnight_typeX = [
    {
      id:"",
      name:"ไม่แปลงค่า",
    },{
    id:"0",
    name:"ค้างคืน",
  },
  {
    id:"1",
    name:"ไม่ค้างคืน",
  }]

  ArrSaveMaster = [];
  tp_clone: TemplateRef<any>;
  modalRef: BsModalRef;
  constructor(

    @Inject(forwardRef(() => MaintainComponent)) private appMain: MaintainComponent,
    private modalService: BsModalService,
    private ws: AspxserviceService,
    private swl : AlertServiceService

  ) { }

  ngOnInit() {
    this.onloadX1();
    this.onloadX2();
    this.region_arr();
  }

  str_to_bool(param){
    var x;if(param == '1'){x = true}else{x = false} return x;
  }
  bool_to_str(param){
    var x;if(param == true){x = '1'}else{x = '0'} return x;
  }




  onloadX1() {

    this.appMain.isLoading = true;
    //this.appMain.TRAVEL_TYPE;
    /* let bodyX = {
      "token_login": localStorage["token"],
      "doc_id": this.doc_id
    } */
    let bodyX = {
      "token_login": "b8a27da5-c587-405d-8a45-20e39c98e5ce",
      "page_name": "allowance",
      "module_name": "config daily allowance",
    }

    const onSuccess = (data): void => {
      console.log("-------------");
      console.log(data);
      this.arr_data['allowance_list'] = data.allowance_list;
      this.arr_data['allowance_list'].forEach(e=> {
        if (typeof e === "object") {
          //if(e.status == '1'){e.status = true }else{ e.status = false }
          e.status = this.getBoolean(e.status);
          //try{e.status = this.str_to_bool(e.status);}catch(err){}
        }
      })
      this.arr_dataX1 = data;
      this.allowance_list = data.allowance_list

      this.appMain.isLoading = false
    }

    this.ws.callWs(bodyX, 'LoadMasterData').subscribe(data => onSuccess(data), error => {
      this.appMain.isLoading = false
      console.log(error);
    })

  }

  onloadX2() {

    this.appMain.isLoading = true;
    /* let bodyX = {
      "token_login": localStorage["token"],
      "doc_id": this.doc_id
    } */
    let bodyX = {
      "token_login": "b8a27da5-c587-405d-8a45-20e39c98e5ce",
      "page_name": "allowance",
      "module_name": "config daily allowance",
    }

    const onSuccess = (data): void => {
      console.log("-------------");
      console.log(data);
      this.arr_dataX2 = data;
      this.zone_list = data.master_zone;
      this.county_list = data.master_country;
      this.arr_data['allowance_type'] = data.allowance_type;
      this.arr_data['allowance_type'].forEach(function (e) {
        if (typeof e === "object") {
          //e.status = this.str_to_bool(e.status);
          //try{e.status = this.str_to_bool(e.status);}catch(err){}
          if(e.status == '1'){e.status = true }else{ e.status = false }
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
    this.tp_clone = template;
    let config: object = {
      class: "modal-md",
      animated: true,
      keyboard: false,
      ignoreBackdropClick: true,
    };

    this.modalRef = this.modalService.show(template, config);

  }

  openModalx2(template: TemplateRef<any>,typeBtn) {
    this.tp_clone = template;
    let config: object = {
      class: "modal-lg",
      animated: true,
      keyboard: false,
      ignoreBackdropClick: true,
    };
    if(typeBtn == 'over'){
      this.zone_new = '' 
    }else{
      this.zone_new = ''
    }
    this.modalRef = this.modalService.show(template, config);

  }

  travel_category_function(values) {
    var re;
    if (values == "overseas") { re = "ต่างประเทศ" }
    else { re = "ในประเทศ" }
    return re;
  }

  workplace_type_country(values) {
    var re;
    if (values == 1) { re = "country" }
    else { re = "Continent";  }
    return re;
  }

  workplace_thailand_name(id_name) {
    //this.thai_city = data.master_province ;
    var re;
    var thai_arr = this.dtregion['master_province'];
    re = "country"
    try {
      thai_arr = thai_arr.filter(word => word.id == id_name);
      re = thai_arr[0].name;
    } catch (err) { }
    return re;
  }

  workplace_type_country_name(val_type, id_name) {
    var re;
    var county = this.dtregion['master_country'];
    var zone = this.dtregion['master_zone'];

    try {
      if (val_type == 1) {
        re = "County"
        county = county.filter(word => word.id == id_name);
        re = county[0].name;
      }
      else {
        re = "Zone"
        zone = zone.filter(word => word.id == id_name);
        re = zone[0].name;
      
      }
    } catch (err) { }

    return re;
  }

  add_overseas() {
    var datax = [];

    var id_max = 0;
    var sort_by_max = 0;
    this.arr_data.allowance_list.forEach(function (e) {
      if (parseInt(e.id) >= id_max) { id_max = parseInt(e.id); }
      if (parseInt(e.sort_by) >= sort_by_max) { sort_by_max = parseInt(e.sort_by); }
    })

    var check_khcode = this.arr_data.allowance_list.filter(word => word.kh_code == this.Allwance_arr.khrate && word.workplace == this.Allwance_arr.plan) ;
    
    if(check_khcode.length > 0){
      this.swl.swal_warning('Kh Code Or Travel  Already');
      return ;
    }
    
    console.log('this.Allwance_arr console.log(this.Allwance_arr);');
    console.log(this.Allwance_arr);
    /* Allwance_arr =
    {
      Category: "",
      type: "",
      khrate: "",
      kh_up_down: "",
      plan: "",
      sub_plan: "",
      price: "",
      currency: ""
    } */
    this.arr_data.allowance_list.push({
      "token_login": "b8a27da5-c587-405d-8a45-20e39c98e5ce",
      "data_type": "",
      "user_admin": false,
      "id": id_max + 1,
      "travel_category": 'oversea',
      "overnight_type": null,
      "kh_code": this.Allwance_arr.khrate,
      "kh_type_up": null,
      "workplace": this.Allwance_arr.plan,
      "workplace_type_country": this.Allwance_arr.sub_plan,
      "allowance_rate": this.Allwance_arr.price,
      "currency": this.Allwance_arr.currency,
      "status": "1",
      "sort_by": sort_by_max + 1,
      "remark": null,
      "action_type": "insert",
      "action_change": "true"
    })

    this.Allwance_arr.id = "";
    this.Allwance_arr.Category = "";
    this.Allwance_arr.type = "";
    this.Allwance_arr.khrate = "";
    this.Allwance_arr.kh_up_down = "";
    this.Allwance_arr.plan = "";
    this.Allwance_arr.sub_plan = "";
    this.Allwance_arr.price = "";
    this.Allwance_arr.currency = "";
    this.btnCloseX.nativeElement.click();
    this.zone_new = '';
    this.zone_location = [];

    console.log(this.arr_data.allowance_list);
    this.Save_D2();
  }

  add_local() {
    debugger;
    var datax = [];
    var id_max = 0;
    var sort_by_max = 0;
    this.arr_data.allowance_list.forEach(function (e) {
      if (parseInt(e.id) >= id_max) { id_max = parseInt(e.id); }
      if (parseInt(e.sort_by) >= sort_by_max) { sort_by_max = parseInt(e.sort_by); }
    })
    var check_values ;
    if (typeof this.zone_new === "object") {
      this.zone_new = '';
    }
    var zone_check = this.zone_new;
    this.arr_data.allowance_list.forEach(function (e) {
      if (e.name == zone_check && e.kh_code == this.Allwance_arr.khrate) {
        check_values = false;
      }
    })

    var check_khcode = this.arr_data.allowance_list.filter(word => word.kh_code == this.Allwance_arr.khrate && word.workplace == this.Allwance_arr.plan) ;
    

    if(check_values == false){
      this.swl.swal_warning("Kh Code Or Travel  Already")
      return ;
    }else{
    this.arr_data.allowance_list.push({
      "token_login": "b8a27da5-c587-405d-8a45-20e39c98e5ce",
      "data_type": "",
      "user_admin": false,
      "id": id_max + 1,
      "travel_category": 'local',
      "overnight_type": this.zone_new,
      "kh_code": this.Allwance_arr.khrate,
      "kh_type_up": null,
      "workplace": 1,
      "workplace_type_country": 1,
      "allowance_rate": this.Allwance_arr.price,
      "currency": 'THB',
      "status": "1",
      "sort_by": sort_by_max + 1,
      "remark": null,
      "action_type": "insert",
      "action_change": "true"
    })
    }
    this.Allwance_arr.id = "";
    this.Allwance_arr.Category = "";
    this.Allwance_arr.type = "";
    this.Allwance_arr.khrate = "";
    this.Allwance_arr.kh_up_down = "";
    this.Allwance_arr.plan = "";
    this.Allwance_arr.sub_plan = "";
    this.Allwance_arr.price = "";
    this.Allwance_arr.currency = "";
    this.btnCloseX.nativeElement.click();
    this.zone_new = '';
    this.zone_location = [];

    console.log(this.arr_data.allowance_list);
    this.Save_D2();
  }

  AddMaster_price(typeX,ov_lo) {
    debugger
    var check_values;
    var errorText = "กรุณากรอกข้อมูลให้ครบ";
    var overnight_type_val ;
    if(ov_lo == "overseas"){
      overnight_type_val = ""
    }else{
      overnight_type_val = this.zone_new ;
      this.Allwance_arr.plan = '1' ;
      this.Allwance_arr.sub_plan ='1' ;
    }
    
    if (this.Allwance_arr.Category == "") { check_values = false; }
    if (this.Allwance_arr.type == "") { check_values = false; }
    if (this.Allwance_arr.khrate == "") { check_values = false; }
    if (this.Allwance_arr.kh_up_down == "") { check_values = false; }
    if (this.Allwance_arr.plan == "") { check_values = false; }
    if (this.Allwance_arr.sub_plan == "") { check_values = false; }
    if (this.Allwance_arr.price == "") { check_values = false; }
    if (this.Allwance_arr.currency == "") { check_values = false; }

    var Category = this.Allwance_arr.Category;
    var type = this.Allwance_arr.type;
    var khrate = this.Allwance_arr.khrate;
    /* var kh_up_down = this.Allwance_arr.kh_up_down; */
    var plan = this.Allwance_arr.plan;
    var sub_plan = this.Allwance_arr.sub_plan;
    var price = this.Allwance_arr.price;
    var currency = this.Allwance_arr.currency;

    console.log(this.Allwance_arr.khrate);
    var logx;
    var kh_rate = localStorage.getItem("kh_rate");
    var kh_type_up = localStorage.getItem("kh_type_up");
    console.log('------------------');
    console.log(kh_rate);
    console.log(kh_type_up);
    this.arr_data.allowance_list.forEach(function (e) {
      logx = "== YYYY";
      if (typeX == 'Update') {

        if (e.kh_code == kh_rate ) {
          logx = "== 1";
          check_values = true;
        }
        else if (e.kh_code == khrate ) {
          logx = "== 2";
          check_values = false;
          errorText = "Kh Rate Already";
        } else {
          logx = "== 3";
          check_values = true;
        }
      } else {
        if (e.kh_code == khrate) {
          errorText = "Kh Rate Already";
          check_values = false;
          logx = "== xxx";
        }
      }
      /* if(e.workplace == plan){
        errorText  = "Plan Travel Already";
        check_values = false;
      } */
      /* if(e.currency == currency){
        errorText  = "Currency Already";
        check_values = false;
      } */

    })
    console.log(logx);

    check_values = true ;
    if (check_values == false) {
      this.Swalalert(errorText, "error")
      return;
    } else {

      if (typeX != 'Update') {
        var id_max = 0;
        var sort_by_max = 0;
        this.arr_data.allowance_list.forEach(function (e) {
          if (parseInt(e.id) >= id_max) { id_max = parseInt(e.id); }
          if (parseInt(e.sort_by) >= sort_by_max) { sort_by_max = parseInt(e.sort_by); }
        })

        this.arr_data['allowance_list'].push({
          "token_login": "b8a27da5-c587-405d-8a45-20e39c98e5ce",
          "data_type": "",
          "user_admin": false,
          "id": id_max + 1,
          "travel_category": this.Allwance_arr.Category,
          "allowance_type_id": this.Allwance_arr.type,
          "kh_code": this.Allwance_arr.khrate,
          /* "kh_type_up": this.Allwance_arr.kh_up_down, */
          "workplace": this.Allwance_arr.plan,
          "workplace_type_country": this.Allwance_arr.sub_plan,
          "allowance_rate": this.Allwance_arr.price,
          "currency": this.Allwance_arr.currency,
          "overnight_type":overnight_type_val,
          "status": "1",
          "sort_by": sort_by_max + 1,
          "remark": null,
          "action_change": true,
          "action_type": "insert",
          "StatusTF": true
        });
      }
      else {

        var Booking_Status2X  ;
        Booking_Status2X = this.getBoolean(this.Booking_Status2);
        //if(Booking_Status2X == true){ Booking_Status2X = '0'}else{Booking_Status2X = false};
        this.arr_data.allowance_list.forEach(function (e) {

          var ids = localStorage.getItem("id");
          if (e.id == ids) {

            e.action_change = true;
            e.travel_category = Category;
            e.allowance_type_id = type;
            e.kh_code = khrate;
            //e.kh_type_up = kh_up_down;
            e.workplace = plan;
            e.workplace_type_country = sub_plan;
            e.allowance_rate = price;
            e.currency = currency;
            e.status = Booking_Status2X;
            e.overnight_type = overnight_type_val

          }

        })
        this.TypeUpdate2 = false;
        this.btnCloseX.nativeElement.click();

      }
      this.Save_D2();
      this.Allwance_arr.Category = "";
      this.Allwance_arr.type = "";
      this.Allwance_arr.khrate = "";
      this.Allwance_arr.kh_up_down = "";
      this.Allwance_arr.plan = "";
      this.Allwance_arr.sub_plan = "";
      this.Allwance_arr.price = "";
      this.Allwance_arr.currency = "";

    }

    //console.log(this.arr_data['allowance_list']);
    this.btnCloseX.nativeElement.click();
    /* console.log(this.arr_data['allowance_type']);
    this.btnCloseX.nativeElement.click();
    this.Swalalert('Update data successfully.', 'success') 

  }*/

  }

  Cancel_price() {
    
    this.Allwance_arr.id = "";
    this.Allwance_arr.Category = "";
    this.Allwance_arr.type = "";
    this.Allwance_arr.khrate = "";
    this.Allwance_arr.kh_up_down = "";
    this.Allwance_arr.plan = "";
    this.Allwance_arr.sub_plan = "";
    this.Allwance_arr.price = "";
    this.Allwance_arr.currency = "";
    this.btnCloseX.nativeElement.click();
    this.zone_new = '';
    this.zone_location = [];

    this.TypeUpdate = false;
    this.TypeUpdate2 = false;
  }

  AddMaster_remark(values) {

    this.TypeUpdate = false;
    console.log(values);
    var check_values;
    this.arr_data['allowance_type'].forEach(function (e) {
      if (e.name == values) {
        check_values = false;
      }
    })

    console.log(this.arr_data.allowance_type);
    if (check_values == false || values == "") {
      this.Swalalert("Reamrk Name Already", "error")
      return;
    } else {

      var id_max = 0;
      var sort_by_max = 0;
      this.arr_data.allowance_type.forEach(function (e) {
        if (parseInt(e.id) >= id_max) { id_max = parseInt(e.id); }
        if (parseInt(e.sort_by) >= sort_by_max) { sort_by_max = parseInt(e.sort_by); }
      })

      this.arr_data['allowance_type'].push({
        "token_login": null,
        "data_type": null,
        "user_admin": false,
        "id_main": null,
        "id_sub": null,
        "id": id_max + 1,
        "name": values,
        "status": "1",
        "sort_by": sort_by_max + 1,
        "page_name": "allowance",
        "module_name": "config daily allowance",
        "action_type": "insert",
        "action_change": true,
        "StatusTF": true
      });
      this.Save_D();
      console.log(this.arr_data['allowance_type']);
      this.btnCloseX.nativeElement.click();
      this.Swalalert('Update data successfully.', 'success')

    }

    this.Remark_value = "";

  }


  Cancel_remark() {
    this.TypeUpdate = false;
    this.TypeUpdate2 = false;
    this.Remark_value = "";
    this.btnCloseX.nativeElement.click();
  }


  Save_D() {

    //this.ArrSaveMaster =  data_type":"save",
    this.appMain.isLoading = true;

    this.arr_dataX1['data_type'] = "save";
    this.arr_dataX1['module_name'] = "master allowance type";
    this.arr_dataX1['allowance_type'] = this.arr_data.allowance_type;
    this.arr_dataX1['allowance_type'].forEach(function (e) {
      if (typeof e === "object") {
        //try{e.status = this.bool_to_str(e.status);}catch(err){}
        //e.status = this.bool_to_str(e.status);
        if(e.status == true){e.status = '1'}else{ e.status = '0' }
      }
    })
    //this.arr_dataX1['allowance_list'] = this.allowance_list; 

    console.log(this.arr_dataX1);
    //console.log(this.arr_dataX2);

    const onSuccess = (data): void => {
      console.log(data);
      if (data.after_trip.opt1 == "true") {
        this.Swalalert('Update data successfully.', 'success');
      } else {
        this.Swalalert('Error.', 'error');
      }
      this.arr_data.allowance_type = data.allowance_type;
      this.arr_data.allowance_type.forEach(function (e) {
        if (typeof e === "object") {
          if(e.status == '1'){e.status = true }else{ e.status = false }
          //try{e.status = this.str_to_bool(e.status);}catch(err){}
          //e.status = this.str_to_bool(e.status);
        }
      })
      this.arr_dataX1['allowance_type'] = data.allowance_type;
      this.arr_dataX1['allowance_type'].forEach(function (e) {
        if (typeof e === "object") {
          if(e.status == '1'){e.status = true }else{ e.status = false }
          //try{e.status = this.str_to_bool(e.status);}catch(err){}
          //e.status = this.str_to_bool(e.status);
        }
      })
      
      this.appMain.isLoading = false
    }

    this.ws.callWs(this.arr_dataX1, 'SaveMasterData').subscribe(data => onSuccess(data), error => {
      this.appMain.isLoading = false
      console.log(error);
    })

  }



  Save_D2() {

    //AddMaster_price
    //this.ArrSaveMaster =  data_type":"save",
    this.appMain.isLoading = true;
    debugger
    console.log(this.arr_dataX1);
    this.arr_dataX1['data_type'] = "save";
    this.arr_dataX1['module_name'] = "config daily allowance";
    //this.arr_dataX1['allowance_list'] = this.arr_data.allowance_list;
    this.arr_dataX1['allowance_list'] = this.arr_data.allowance_list;
    this.arr_dataX1['allowance_list'].forEach(function (e) {
      if (typeof e === "object") {
        if(e.status == true){e.status = '1'}else{ e.status = '0' }
        //try{e.status = this.bool_to_str(e.status);}catch(err){}
        //e.status = this.bool_to_str(e.status);
      }
    })
    console.log(this.arr_dataX1);
    //console.log(this.arr_dataX2);
    var listX = this.arr_dataX1['allowance_list'];
    /* for(var xi = 0;xi <= listX.length;xi++){
      if(typeof listX[xi]['workplace'] === 'object'){
        var planX = listX[xi].workplace.id
        listX[xi]['workplace'] = planX;
      }
      console.log(xi);
    } */
     listX.forEach(e => {
      if(typeof e.workplace === 'object'){
        var planX = e.workplace.id
        e.workplace = planX;
      }
    }); 

    this.arr_dataX1['allowance_list'] = listX;

    const onSuccess = (data): void => {
      console.log('after save -->');
      console.log(data);
      this.arr_data.allowance_list = data.allowance_list ;
      if (data.after_trip.opt1 == "true") {
        this.arr_dataX1['allowance_list'] = data.allowance_list;
        this.arr_dataX1['allowance_list'].forEach(function (e) {
          if (typeof e === "object") {
            if(e.status == '1'){e.status = true }else{ e.status = false }
            //e.status = this.str_to_bool(e.status);
          }
        })
        this.Swalalert('Update data successfully.', 'success');
      } else {
        this.Swalalert('Error.', 'error');
      }
      this.appMain.isLoading = false
    }
    console.log('before save -->');
    console.log(this.arr_dataX1);
     this.ws.callWs(this.arr_dataX1, 'SaveMasterData').subscribe(data => onSuccess(data), error => {
      this.appMain.isLoading = false
      console.log(error);
    })  



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


  ActiveEvent(id, typeText, textX, txbtn) {

    console.log(this.arr_data.allowance_type);
    var mes;
    //var mes = "Do you want to delete?";
    if (textX == 'active') {
      mes = "Do you want to save the changes?";
    }
    else {
      mes = "Do you want to delete?";
    }
    //var txbtn = "Delete";
    
    this.swal_confrim(mes, txbtn).then((val) => {

      debugger
      if (val.isConfirmed) {


        if(typeText == 'allowance_list'){

          this.arr_data.allowance_list.forEach(function (e) {
            if (e.id == id) {
              e.action_type = txbtn.toLowerCase();
              e.action_change = true;
            }
          })
          this.Save_D2();

        }else{

          this.arr_data.allowance_type.forEach(function (e) {
            if (e.id == id) {
              e.action_type = txbtn.toLowerCase();
              e.action_change = true;
            }
          })
          this.Save_D();

        }
      } else {


        if(typeText == 'allowance_list'){

          this.arr_data.allowance_list.forEach(function (e) {
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

        }else{

          this.arr_data.allowance_type.forEach(function (e) {
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

        }
        
      }

    })

    console.log(this.arr_data.allowance_type);

  }

  editType(id) {

    this.TypeUpdate = true;
    this.Booking_Status1;
    var Booking_Status1X;
    this.model1.nativeElement.click();
    var getvalues;
    localStorage.setItem("id", id);
    this.arr_data.allowance_type.forEach(function (e) {

      if (e.id == id) {
        getvalues = e.name;
        Booking_Status1X = e.status;
      }

    })

    this.Booking_Status1 = Booking_Status1X;
    this.Remark_value = getvalues;
    //this.Remark_value = "xxx";

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

  Remake_Update(value) {
    var Booking_Status1X = this.Booking_Status1;
    if(Booking_Status1X == 'true'){ Booking_Status1X = true}else{Booking_Status1X = false};
    debugger
    this.arr_data.allowance_type.forEach(function (e) {

      var ids = localStorage.getItem("id");
      if (e.id == ids) {
        e.name = value;
        e.action_change = true;
        e.status = Booking_Status1X;
        
      }

    })
    console.log(this.arr_data.allowance_type);
    this.btnCloseX.nativeElement.click();
    this.Save_D();
    this.TypeUpdate = false;
  }


  Allowance_editType(id,typeXX) {

    debugger;
    this.TypeUpdate2 = true;
    if(typeXX == 'Overseas'){
      this.model2.nativeElement.click();
    }else{
      this.model3.nativeElement.click();
    }
    
    var getvalues;
    localStorage.setItem("id", id);
    var Booking_Status2X;
    var travel_category,ddid, allowance_type_id, kh_code, 
    kh_type_up, workplace, workplace_type_country,
    allowance_rate, currency,overnight_typeX
    this.arr_data.allowance_list.forEach(function (e) {

      if (e.id == id) {
        ddid=e.id;
        getvalues = e.remark;
        travel_category = e.travel_category;
        allowance_type_id = e.allowance_type_id;
        kh_code = e.kh_code;
        kh_type_up = e.kh_type_up;
        workplace = e.workplace;
        workplace_type_country = e.workplace_type_country;
        allowance_rate = e.allowance_rate;
        currency = e.currency;
        Booking_Status2X = e.status;
        overnight_typeX = e.overnight_type;

      }
    })

    localStorage.setItem("kh_rate", kh_code);
    localStorage.setItem("kh_type_up", kh_type_up);
    
    this.Allwance_arr.id = ddid;
    this.Allwance_arr.Category = travel_category;
    this.Allwance_arr.type = allowance_type_id;
    this.Allwance_arr.khrate = kh_code;
    this.Allwance_arr.kh_up_down = kh_type_up;
    this.Allwance_arr.plan = workplace;
    var county = this.dtregion['master_country'];
    var zone = this.dtregion['master_zone'];
    var Thai = this.dtregion['master_province'];
    if(typeXX == 'Overseas'){
      if(workplace_type_country == 0 || workplace_type_country == '0'){
        this.zone_location = zone;
        var PlansX = zone.filter(word => word.id == workplace);
        this.zone_new = PlansX[0]
      }else{
        this.zone_location = county;
        var PlansX = county.filter(word => word.id == workplace);
        this.zone_new = PlansX[0]
      }
    }else{

        this.zone_location = Thai;
        var PlansX = Thai.filter(word => word.id == workplace);
        //this.zone_new = PlansX[0]
        this.zone_new = overnight_typeX;
    }
    
    this.Allwance_arr.sub_plan = workplace_type_country;
    this.Allwance_arr.price = allowance_rate;
    this.Allwance_arr.currency = currency;
    this.Booking_Status2 = Booking_Status2X;
    this.Remark_value = getvalues;
    this.numberWithCommas(allowance_rate);
    //this.Remark_value = "xxx";

  }

  check_el(values) {

    var re;
    if (values != "") {
      re = true;
    } else {
      re = false;
    }
    return re;

  }

  onResize() {

    var xxx = $('#rez').width();
    if (xxx > 450) {
      this.step = true;
    }
    else {
      this.step = false;
    }

  }

  zone_new = '';
  county_new_arr = [];
  county_new = '';
  zone_select = [];
  country_select = [];
  thai_city = [];
  dtregion = [];
  zone_location = [];

  dataLocation_chang(value) {
    if (value == 0) {
      this.zone_location = this.zone_select;
    } else {
      this.zone_location = this.country_select;
    }
    this.zone_new = "";
  }

  region_arr() {
    this.appMain.isLoading = true;
    let bodyX = {
      "token_login": "b8a27da5-c587-405d-8a45-20e39c98e5ce",
      "page_name": "allowance",
      "module_name": "master location",
    }

    const onSuccess = (data): void => {
      console.log("------------- load 3");
      console.log(data);
      this.dtregion = data;
      this.zone_select = data.master_zone;
      this.country_select = data.master_country;
      this.thai_city = data.master_province;
      this.appMain.isLoading = false
    }

    this.ws.callWs(bodyX, 'LoadMasterData').subscribe(data => onSuccess(data), error => {
      this.appMain.isLoading = false
      console.log(error);
    })

  }

  County_chang(zone,id) {
    debugger
    this.county_new = '';
    this.county_new_arr = [];
    /* master_country
    master_province
    master_zone */
    this.arr_data.allowance_list.forEach(function (e) {
      if (e.id == id) {
        //e.action_type = txbtn.toLowerCase();
        e.action_change = true;
      }
    })

    try {
      this.country_select
      var re = this.country_select.filter(word => word.id == zone.id);
      //console.log();
      this.county_new_arr = re;
      this.Allwance_arr.plan = re[0].id;
    } catch (err) {
      this.county_new_arr = [];
      this.county_new = '';
      
    }

  }

  type_chang(zone,id) {

  }

  data_oversea(){
    var re = this.arr_data.allowance_list.filter(word => word.travel_category == 'oversea');
    re.sort(function(a, b){
      if(a.kh_code < b.kh_code) { return -1; }
      if(a.kh_code > b.kh_code) { return 1; }
      return 0;
    })
    return re 
  }

  data_local(){
    var re = this.arr_data.allowance_list.filter(word => word.travel_category == 'local');
    re.sort(function(a, b){
      if(a.kh_code < b.kh_code) { return -1; }
      if(a.kh_code > b.kh_code) { return 1; }
      return 0;
    })
    return re
  }

  order_by_list(arr){
    var re = arr;
    re.sort(function(a, b){
      if(a.name < b.name) { return -1; }
      if(a.name > b.name) { return 1; }
      return 0;
    })
    return re
  }

  ovaesee_price_val ;
  local_price_val ;
  numberWithCommas(x) {
    debugger
    if(x == null || x == ''){
      this.ovaesee_price_val = '';
      this.Allwance_arr.price = '';
    }
    var str_return = x.replace(/,/g, "");
    var x_num = Number(parseInt(str_return)).toLocaleString("en-GB");
    this.Allwance_arr.price = ''+parseInt(str_return)+'' ;
    this.ovaesee_price_val = 'xx';
    //this.Exchange_value.Exchange_rate_selected = x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }


}
