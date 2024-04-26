import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import { AlertServiceService } from '../../../../services/AlertService/alert-service.service';
import {map} from 'rxjs/operators';
import {startWith} from 'rxjs/operators';
import {ENTER, COMMA, SEMICOLON, D} from '@angular/cdk/keycodes';

import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  forwardRef,
  Inject,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {interval, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import { AppComponent } from '../../../../app.component';
import { MainComponent } from '../../../../components/main/main.component';
import { FileuploadserviceService } from '../../../../ws/fileuploadservice/fileuploadservice.service';
import { AspxserviceService } from '../../../../ws/httpx/aspxservice.service';
import {MasterComponent} from '../../master.component';
import {inject} from '@angular/core/testing';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {DatePipe, formatDate} from '@angular/common';
import {format, resolve} from 'url';
import {FormControl} from '@angular/forms';
import {Workbook} from 'exceljs';
// import * as fs from 'file-saver';
// import {Command} from 'protractor';
import { InitTrackStatus, TrackingStatus } from '../../../../model/localstorage.model';
import {getBoolean, useAuth} from '../../accommodation/accommodation/accommodation.component';
import {CloneDeep} from '../../transportation/transportation/transportation.component';
import * as internal from 'assert';

declare var $: any;
@Component({
  selector: 'app-allowance',
  templateUrl: './allowance.component.html',
  styleUrls: [ './allowance.component.css' ],
})
export class AllowanceComponent implements OnInit {
  @ViewChild('closeModel', {static: true}) btnCloseX: ElementRef;

  panel = {
    show: true,
    after: false,
  };

  AirC1 = {
    config: {
      displayKey: 'name',
      search: true,
      limitTo: 1000,
      height: '250px',
      position: 'fixed',
      clearOnSelection: false,
      /* placeholder: 'Select', */
      /* clearOnSelection: true,
      inputDirection: 'ltr' */
    },
  };

  AirC2 = {
    config: {
      displayKey: 'name',
      search: true,
      limitTo: 1000,
      height: '250px',
      position: 'fixed',
      clearOnSelection: false,
      /* placeholder: 'Select', */
      /* clearOnSelection: true,
      inputDirection: 'ltr' */
    },
  };

  testxx = [ {name: 'red'}, {name: 'blue'}, {name: 'green'}, {name: 'yellow'} ];
  barStatus = [
    {
      id: 'time',
      statusX: '',
    },
    {
      id: 'pencil',
      statusX: '',
    },
    {
      id: 'cog',
      statusX: '',
    },
    {
      id: 'check',
      statusX: '',
    },
  ];

  inputFormatInt = {
    prefix: '',
    thousands: ',',
    decimal: '.',
    precision: '2',
    suffix: '',
  };
  disgitEbiz = 2;
  m_empmail_list = [];
  data_excel_view = [];
  Email_sendX = [];
  Rowmodel;
  ModelData;
  myControl = new FormControl();
  mail_curent = '';
  doc_id = '';
  emp_idS = '';
  status = true;
  allowance_detail_raw = [];
  emp_list = [];
  arrX;
  arrXRaw;
  empname = '';
  name_user;
  sumx = 0;
  namex;
  m_allowance_type = [];
  travel;
  business_date;
  travel_date;
  country_city;
  allowance_detail = [];
  email_send = [];
  allowance_main = [];
  masterSetArr = [];
  mail_list = [];
  show_button = true;
  before_ChangUser = false;

  model = {
    email: {
      settingMulti_cc: {
        enableCheckAll: false,
        singleSelection: false,
        idField: 'emp_id',
        textField: 'email',
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        itemsShowLimit: 100,
        allowSearchFilter: true,
        closeDropDownOnSelection: true,
        defaultOpen: false,
      },
      settingMulti_to: {
        enableCheckAll: false,
        singleSelection: false,
        idField: 'userEmail',
        textField: 'userEmail',
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        itemsShowLimit: 100,
        allowSearchFilter: true,
        closeDropDownOnSelection: true,
        defaultOpen: false,
      },
      select_cc: [],
      select_to: '',
    },
  };
  Config_Mail = {
    mail_to_value: '',
    mail_cc_value: '',
    mail_cc_ds: [],
  };
  model_all_def = [];
  mo_m_empmail_list = [];
  data_ExcelA = [];
  tp_clone: TemplateRef<any>;
  modalRef: BsModalRef;
  modal_Ref_mail: BsModalRef;

  // for Search Emp
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = false;
  separatorKeysCodes: number[] = [ ENTER, COMMA, SEMICOLON ];

  fCtrl = new FormControl();
  fCtrlCC = new FormControl();

  filteredEmp: Observable<string[]>;
  filteredEmpCC: Observable<string[]>;

  MailList: any = [];
  allEmp: any = [];
  masterEmp: any[];
  MailListCC: any = [];

  inputText = '';
  inputTextCC = '';
  // for Search Emp
  TRAVEL_TYPE_OL = 'oversea';
  mall_remark;
  id_type;
  pathPhase1: any;
  userDetail: any;
  TrackingStatus: TrackingStatus = {...InitTrackStatus};
  TRAVEL_TYPE: string;
  profile: any;
  statusDetail: boolean = false;
  isCanceled: boolean = false;

  constructor(
    @Inject(forwardRef(() => MasterComponent)) private appMain: MasterComponent,
    private modalService: BsModalService,
    private http: HttpClient,
    public ws: AspxserviceService,
    private x: AppComponent,
    private fileuploadservice: FileuploadserviceService,
    private swl: AlertServiceService,
    private changeDetector: ChangeDetectorRef
  ) {
    // for Search Emp
    //this.TRAVEL_TYPE_OL = this.doc_id.substr(0, 2).toUpperCase() === "OB" ? "oversea" : this.doc_id.substr(0, 2).toUpperCase() === "OT" ? "oversea" : this.doc_id.substr(0, 2).toUpperCase() === "LB" ? "Local" : this.doc_id.substr(0, 2).toUpperCase() === "LT" ? "Local" : "" ;

    this.filteredEmp = this.fCtrl.valueChanges.pipe(
      startWith(null),
      map((x: string | null) => (x ? x.toLowerCase() : x)),
      map((x: string | null) => (x ? this._filter(x) : this.allEmp.slice()))
    );

    this.filteredEmpCC = this.fCtrlCC.valueChanges.pipe(
      startWith(null),
      map((x: string | null) => (x ? x.toLowerCase() : x)),
      map((x: string | null) => (this.CheckData(x) ? this._filter(x.toString().toLowerCase()) : []))
    );

    // for Search Emp
  }
  CheckData(value: any) {
    var bbcheck = true;
    if (value == '') {
      bbcheck = false;
    }
    if (value == null) {
      bbcheck = false;
    }
    if (typeof value == 'string') {
      if (value.length < 3) {
        bbcheck = false;
      }
    }
    return bbcheck;
  }

  functionLoadData() {
    const function1Oversea = (data) => {
      // คำสั่งโน่นนี่ของ oversea
    };

    const function2Local = (data) => {
      // คำสั่งโน่นนี่ของ local
    };

    /* this.partIIHttp.didFetch(this.app.id).subscribe(dao => { //บรรทัดนี้ call api
    
    if (app.id.search("OB") === 0 || app.id.search("OT") === 0) {
    
    function1Oversea(dao['dataOversea']); //ตัวแปล const จะต้องมีค่ามันถึงจะทำงานต่อ
    
    }
    else{
    
    function2Local(dao['dataLocal']);
    
    }
    }, error => alert(error)) */
  }

  ngOnInit() {
    console.clear();

    this.doc_id = this.appMain.DOC_ID;
    /* this.id_type = this.appMain.TRAVEL_TYPE;
    
    this.TRAVEL_TYPE_OL = this.doc_id.substr(0, 2).toUpperCase() === "OB" ? "oversea" : this.doc_id.substr(0, 2).toUpperCase() === "OT" ? "oversea" : this.doc_id.substr(0, 2).toUpperCase() === "LB" ? "Local" : this.doc_id.substr(0, 2).toUpperCase() === "LT" ? "Local" : "" ;


    console.log('---doc id---');
    console.log(this.doc_id); */
    this.appMain.isLoading = true;
    this.OnloadDoc();
    this.onloadX();

    //this.appMain.TRAVEL_TYPE
    //this.TestExcelData();
  }
  ngAfterViewChecked() {
    //your code to update the model // ใช้สำหรับ re-rendered กรณีไป update view แล้วเข้า lifecycle นี้จะ error
    this.changeDetector.detectChanges();
  }

  get passportValue() {
    let value = '';
    let ds = this.data_excel_view;
    try {
      value = ds[ 0 ].passport;
    } catch (ex) { }
    return value;
  }
  get passportDate() {
    let value = '';
    let ds = this.data_excel_view;
    try {
      value = ds[ 0 ].passport_date;
    } catch (ex) { }
    return value;
  }
  get luggage_clothing_date() {
    let value = '';
    let ds = this.data_excel_view;
    try {
      value = ds[ 0 ].luggage_clothing_date;
    } catch (ex) { }
    return value;
  }
  OnloadDoc() {
    // this.appMain.isLoading = true;
    var BodyX = {
      token_login: localStorage[ 'token' ],
      doc_id: this.doc_id,
    };

    const onSuccess = (data) => {
      const {tab_no} = data.up_coming_plan[ 0 ];
      this.pathPhase1 = tab_no ? tab_no : '1';
      console.log('loadDoc');
      console.log(data);
      console.log(this.pathPhase1);
    };
    this.ws.callWs(BodyX, 'LoadDoc').subscribe(
      onSuccess,
      (error) => console.log(error),
      () => { }
    );
  }
  get UserDetail() {
    return this.emp_list.filter((item) => item.emp_id === this.emp_idS);
  }
  get docStatus() {
    return (Status: number) => {
      // return this.TrackingStatus[Status];
      let emp_id = this.emp_idS;
      // console.log(emp_id);
      // return this.TrackingStatus[Status];
      let id: number = 1;
      if (this.emp_list.length > 0) {
        // TEST
        // this.emp_list.forEach((i) => (i.doc_status_id = '2'));
        let dt = this.emp_list.find((item) => item.emp_id === emp_id);
        if (dt) {
          // alert(1);
          id = Number(dt.doc_status_id);
          if (Status === id) {
            this.TrackingStatus[ Status ] = true;
          }
        }
      }
      // console.log(this.TrackingStatus);
      return this.TrackingStatus[ Status ];
    };
  }
  sum_max() {
    var sunxx = 0;
    for (var a = 0; a < this.allowance_detail.length; a++) {
      var numberx = 0;
      var xxs = this.allowance_detail[ a ].allowance_total;
      if (xxs == '-') {
        numberx = 0;
      } else {
        numberx = parseInt(xxs);
      }
      sunxx = sunxx + numberx;
    }
    this.sumx = sunxx;
  }

  load_kh_code = true;
  LoadKhcode() {
    // ## ใช้กรณีเป็น ADMIN เปลียน USER เพิ่อ เช็ค KH CODE => update_userByDOC
    // ## ใช้กรณีเป็น TARVELER เพิ่อ เช็ค KH CODE => onloadX
    let bodyX = {
      token_login: '4968724f-448f-4c93-bc30-d74467e397be',
      doc_id: '',
    };

    var emp_idS = this.emp_idS;
    var Khcode = false;
    const onSuccess = (data): void => {
      console.log('-- Load Kh code --');
      console.log(data);
      data.khcode_list.forEach((e) => {
        if (e.emp_id == emp_idS) {
          Khcode = true;
        }
      });

      this.load_kh_code = Khcode;
      console.log(this.load_kh_code);
    };

    this.ws.callWs(bodyX, 'LoadKHCode').subscribe(
      (data) => onSuccess(data),
      (error) => {
        console.log(error);
      }
    );
  }

  country_arr = [];

  Masterlocation() {
    let bodyX = {
      token_login: 'b8a27da5-c587-405d-8a45-20e39c98e5ce',
      page_name: 'mtvisacountries',
      module_name: 'master location',
    };

    const onSuccess = (data): void => {
      /* console.log(data); */
      //this.appMain.isLoading = false
      this.country_arr = data.master_country;
      //this.onloadX();
    };

    this.ws.callWs(bodyX, 'LoadMasterData').subscribe(
      (data) => onSuccess(data),
      (error) => {
        console.log(error);
      }
    );
  }

  airticket_country_arr = [];
  MasterAirticket() {
    let bodyX = {
      token_login: 'b8a27da5-c587-405d-8a45-20e39c98e5ce',
      page_name: 'airport',
      module_name: 'master airport',
    };

    this.appMain.isLoading = true;

    const onSuccess = (data): void => {
      /* console.log(data); */
      //this.appMain.isLoading = false
      this.airticket_country_arr = data.master_airport;
    };

    this.ws.callWs(bodyX, 'LoadMasterData').subscribe(
      (data) => onSuccess(data),
      (error) => {
        console.log(error);
      }
    );
  }
  AuthAdmin(data) {
    let userSelected = this.appMain.userSelected;
    if (userSelected) {
      this.emp_idS = userSelected;
      let findIndex = data.emp_list.findIndex(({emp_id}) => emp_id === userSelected);
      if (findIndex > -1) {
        this.emp_idS = this.emp_idS;
      }
    } else {
      this.emp_idS = data.emp_list[ 0 ].emp_id;
      this.appMain.userSelected = this.emp_idS;
    }
  }
  dailyallowance_Dx = [];

  TestExcelData() {
    //this.appMain.isLoading = true

    var str_get = {
      actionname: 'allowance',
      doc_id: this.doc_id,
      emp_id: this.emp_idS, //this.emp_idS
      filetype: 'review',
      pagename: 'allowance',
      token_login: localStorage[ 'token' ],
    };

    console.log('str_get str_get str_get');
    console.log(str_get);

    const onSuccess = (data): void => {
      console.log('---*---* Report *---*---');
      console.log(data);
      let LENGTH = data[ 'flightschedule' ].at(-1);
      // data['flightschedule'][LENGTH].airticket_route_to = 24;
      this.data_ExcelA = data;
      this.data_ExcelA[ 'dailyallowance' ].forEach((e) => {
        function formatDate(date) {
          var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

          if (month.length < 2) month = '0' + month;
          if (day.length < 2) day = '0' + day;

          return [ year, month, day ].join('-');
        }

        var xdate = formatDate(e.allowance_date);
        var montF = new DatePipe('en-US');
        //var dx = montF.transform(xdate,'dd-MMM-yyyy');
        var dx = montF.transform(xdate, 'dd-MMM-yyyy');
        e.allowance_date = dx;
      });
      this.dailyallowance_Dx = data.dailyallowance;
      this.data_excel_view = [
        {
          EX_rate: parseFloat(data.m_exchangerate_max[ 0 ].exchange_rate),
          gl_account: data.gl_account,
          arrival_date: data.arrival_date,
          last_update: data.last_update,
          title: data.title,
          total: data.total,
          unit: data.unit,
          employee_id: data.employee_id,
          employee_name: data.employee_name,
          total_thb: data.total_thb,
          country: data.country,
          functional: data.functional,
          business_date: data.business_date,
          departure_date: data.departure_date,
          io_number: data.io_number,
          cost_center: data.cost_center,
          luggage_clothing: data.luggage_clothing,
          luggage_clothing_date: data.luggage_clothing_date,
          remark: data.remark,
          important_note: data.important_note,
          passport: data.passport,
          passport_date: data.passport_date,
        },
      ];
      console.log(this.data_excel_view);
      this.no_data = this.detailAllawance;
    };

    this.ws.callWs(str_get, 'Report').subscribe(
      (data) => onSuccess(data),
      (error) => {
        //this.appMain.isLoading = false
        console.log(error);
      }
    );
  }
  async ExcelData() {
    return new Promise((resolve, reject) => {
      var str_get = {
        actionname: 'allowance',
        doc_id: this.doc_id,
        emp_id: this.emp_idS, //this.emp_idS
        filetype: 'review',
        pagename: 'allowance',
        token_login: localStorage[ 'token' ],
      };
      let statusPandding: boolean = false;
      console.log('str_get str_get str_get');
      console.log(str_get);

      const onSuccess = (data) => {
        console.log('---*---* Report *---*---');
        console.log(data);
        let LENGTH = data[ 'flightschedule' ].at(-1);
        // data['flightschedule'][LENGTH].airticket_route_to = 24;
        this.data_ExcelA = data;
        this.data_ExcelA[ 'dailyallowance' ].forEach((e) => {
          function formatDate(date) {
            var d = new Date(date),
              month = '' + (d.getMonth() + 1),
              day = '' + d.getDate(),
              year = d.getFullYear();

            if (month.length < 2) month = '0' + month;
            if (day.length < 2) day = '0' + day;

            return [ year, month, day ].join('-');
          }

          var xdate = formatDate(e.allowance_date);
          var montF = new DatePipe('en-US');
          //var dx = montF.transform(xdate,'dd-MMM-yyyy');
          var dx = montF.transform(xdate, 'dd-MMM-yyyy');
          e.allowance_date = dx;
        });
        this.dailyallowance_Dx = data.dailyallowance;
        this.data_excel_view = [
          {
            EX_rate: parseFloat(data.m_exchangerate_max[ 0 ].exchange_rate),
            gl_account: data.gl_account,
            arrival_date: data.arrival_date,
            last_update: data.last_update,
            title: data.title,
            total: data.total,
            unit: data.unit,
            employee_id: data.employee_id,
            employee_name: data.employee_name,
            total_thb: data.total_thb,
            country: data.country,
            functional: data.functional,
            business_date: data.business_date,
            departure_date: data.departure_date,
            io_number: data.io_number,
            cost_center: data.cost_center,
            luggage_clothing: data.luggage_clothing,
            luggage_clothing_date: data.luggage_clothing_date,
            remark: data.remark,
            important_note: data.important_note,
            passport: data.passport,
            passport_date: data.passport_date,
          },
        ];
        console.log(this.data_excel_view);
        this.no_data = this.detailAllawance;
        statusPandding = true;
        resolve(true);
      };

      this.ws.callWs(str_get, 'Report').subscribe(
        (data) => onSuccess(data),
        (error) => {
          //this.appMain.isLoading = false
          console.log(error);
        }
      );
    });

    // if (statusPandding) {
    //   return Promise.resolve(statusPandding);
    // } else {
    //   return Promise.reject(statusPandding);
    // }
  }

  showfromid(arr, empidX) {
    try {
      var re;
      re = arr.filter((word) => word.emp_id == empidX);
      return re;
    } catch (err) {
      return arr;
    }
  }

  update_userByDOC(empId) {
    var empxid = empId.toString();
    var show_button;
    let status_trip_cancelled = false;
    this.arrX[ 'emp_list' ].forEach(function (e) {
      if (e.emp_id == empxid) {
        show_button = e.show_button;
        if (e.status_trip_cancelled === 'true') {
          status_trip_cancelled = true;
        }
      }

      if (e.emp_id == empxid) {
        e.mail_status = 'true';
      } else {
        e.mail_status = 'false';
      }
    });

    // this.show_button = status_trip_cancelled === false && show_button;
    if (status_trip_cancelled) {
      this.show_button = false;
    }
    if (this.before_ChangUser) {
      this.swl.swal_confrim_changes('Do you want to save the document ?').then((val) => {
        if (val.isConfirmed) {
          localStorage.setItem('emp_idstor', empId);
          this.saveaction();
          this.loaddataOnselect(empId, 'if');
          //this.onloadX();
          this.emp_idS = localStorage[ 'emp_idstor' ];
          //this.Swalalert('Save Succesed.', 'success');
          //this.LoadKhcode() ;
        } else {
          localStorage.setItem('emp_idstor', empId);
          //this.onloadX();
          this.loaddataOnselect(empId, 'if');
          //this.emp_idS = localStorage["emp_idstor"];
        }
      });
    } else {
      localStorage.setItem('emp_idstor', empId);
      this.loaddataOnselect(empId, 'else');
    }

    this.before_ChangUser = false;
    this.appMain.userSelected = this.emp_idS;
    this.userDetail = this.UserDetail[ 0 ];
    this.TrackingStatus = {...InitTrackStatus};
    //this.LoadKhcode() ;
    // console.log(this.no_data, 'no_data', this.emp_idS, 'emp_idS');
    this.TestExcelData();
  }

  loaddataOnselect(empId, if_else) {
    this.appMain.isLoading = true;
    var bodyX = {
      token_login: localStorage[ 'token' ],
      doc_id: this.doc_id,
    };

    const onSuccess = (data): void => {
      this.setAllowance_detail(data.allowance_detail)
      var empidX = localStorage[ 'emp_idstor' ];
      console.log(this.allowance_detail_raw);
      this.allowance_detail = data.allowance_detail;
      // this.mail_list = data.mail_list;
      this.allowance_detail = this.allowance_detail.filter((word) => word.emp_id == empidX);
      var sunxx = 0;
      for (var a = 0; a < this.allowance_detail.length; a++) {
        var numberx = 0;
        var xxs = this.allowance_detail[ a ].allowance_total;
        if (xxs == '-') {
          numberx = 0;
        } else {
          numberx = parseInt(xxs);
        }
        sunxx = sunxx + numberx;
      }
      this.sumx = sunxx;
      this.allowance_detail.forEach(function (e) {
        if (typeof e === 'object') {
          function formatDate(date) {
            var d = new Date(date),
              month = '' + (d.getMonth() + 1),
              day = '' + (d.getDate() + 1),
              year = d.getFullYear();

            if (month.length < 2) month = '0' + month;
            if (day.length < 2) day = '0' + day;

            return [ year, month, day ].join('-');
          }
          try {
            var xdate = formatDate(e.allowance_date);
            var montF = new DatePipe('en-US');
            //var dx = montF.transform(xdate,'dd-MMM-yyyy');
            var dx = montF.transform(xdate, 'dd-MMM-yyyy');
          } catch (err) {
            var dx = '';
          }
          e[ 'DatePlus' ] = dx;
          var low =
            e.allowance_low == null
              ? 0
              : e.allowance_low == ''
                ? 0
                : e.allowance_low == 'undefined'
                  ? 0
                  : e.allowance_low;
          var mid =
            e.allowance_mid == null
              ? 0
              : e.allowance_mid == ''
                ? 0
                : e.allowance_mid == 'undefined'
                  ? 0
                  : e.allowance_mid;
          var height =
            e.allowance_hight == null
              ? 0
              : e.allowance_hight == ''
                ? 0
                : e.allowance_hight == 'undefined'
                  ? 0
                  : e.allowance_hight;

          e[ 'values_L' ] = low.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          e[ 'values_M' ] = mid.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          e[ 'values_H' ] = height.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          /* e['values_L'] = low.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          e['values_M'] = mid.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          e['values_H'] = height.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); */
          if (e.allowance_type_id == '' || e.allowance_type_id == null) {
            e.allowance_type_id = '2';
          }
        }
      });
      this.appMain.isLoading = false;
      this.no_data = this.detailAllawance;
    };

    this.ws.callWs(bodyX, 'LoadAllowance').subscribe(
      (data) => onSuccess(data),
      (error) => {
        //this.appMain.isLoading = false
        console.log(error);
      }
    );
  }

  masterSet() {
    let bodyX = {
      token_login: localStorage[ 'token' ],
      page_name: 'accommodation',
      module_name: 'master allowance type',
    };

    const onSuccess = (data): void => {
      console.log('-------------');
      console.log(data);
      this.masterSetArr = data;
    };

    this.ws.callWs(bodyX, 'LoadMasterData').subscribe(
      (data) => onSuccess(data),
      (error) => {
        console.log(error);
      }
    );
  }

  addmaster() {
    this.appMain.isLoading = true;

    var max = 0;
    this.masterSetArr[ 'data_type' ] = true;
    this.masterSetArr[ 'allowance_type' ].forEach((element) => {
      max = max <= parseInt(element.id) ? (max = parseInt(element.id)) : (max = max);
    });
    this.masterSetArr[ 'allowance_type' ].push({
      token_login: null,
      data_type: true,
      user_admin: false,
      id_main: null,
      id: max,
      name: this.ModelData,
      status: '1',
      sort_by: '1',
      page_name: 'accommodation',
      module_name: 'master allowance type',
      action_type: 'insert',
      action_change: true,
    });
    /* let bodyX = {
      "token_login": localStorage["token"],
      "doc_id": this.doc_id  
    } */

    let bodyX = {
      token_login: localStorage[ 'token' ],
      page_name: 'accommodation',
      module_name: 'master allowance type',
    };

    var bodyArr = this.masterSetArr;

    const onSuccess = (data): void => {
      console.log('-------------');
      console.log(data);
      this.masterSetArr = data;

      this.appMain.isLoading = false;
    };

    this.ws.callWs(bodyArr, 'SaveMasterData').subscribe(
      (data) => onSuccess(data),
      (error) => {
        this.appMain.isLoading = false;
        console.log(error);
      }
    );
  }
  OpenDocument(doc_id, part) {
    var states = 'i';
    switch (part) {
      case '1':
        states = 'i';
        break;
      case '2':
        states = 'ii';
        break;
      case '3':
        states = 'iii';
        break;
      case '4':
        states = 'cap';
        break;
      default:
        states = 'i';
        break;
    }
    //this.router.navigate(['/main/request/edit', doc_id, states]);
    let url = 'main/request/edit/' + doc_id + '/' + states;
    window.open(url, '_blank');
  }
  get detailAllawance(): boolean {
    let allaWanceDetail = this.allowance_detail;
    let emp_id = this.emp_idS;
    console.log(this.emp_idS, this.allowance_detail);
    if (allaWanceDetail.length > 0) {
      for (let i in allaWanceDetail) {
        if (emp_id === allaWanceDetail[ i ].emp_id) {
          return false;
          break;
        }
      }
    }
    return true;
  }
  no_data;
  status_save;
  async CheckLogin() {
    return new Promise((resolve, reject) => {
      var BodyX = {
        token_login: localStorage[ 'token' ],
      };
      const onSuccess = (data) => {
        console.log('loginProfile');
        console.log(data);
        resolve(data);
      };
      this.ws.callWs(BodyX, 'loginProfile').subscribe(
        onSuccess,
        (error) => (console.log(error), reject(error)),
        () => { }
      );
    });
  }
  get empCount(): boolean {
    const {emp_list} = this;
    const emp_id = this.emp_idS;
    const CheckData = emp_list.length === 1;
    return CheckData;
  }
  async onloadX() {
    this.profile = await this.CheckLogin();
    this.appMain.isLoading = true;
    this.TRAVEL_TYPE_OL = this.appMain.TRAVEL_TYPE;
    var bodyX = {
      token_login: localStorage[ 'token' ],
      doc_id: this.doc_id,
    };

    console.log('------ token ------- TYPE ------');
    console.log(this.TRAVEL_TYPE_OL);
    console.log(bodyX);
    this.status_save = false;
    const onSuccess = (data): void => {
      let TravelTypeDoc = /local/g.test(this.appMain.TRAVEL_TYPE);
      this.TRAVEL_TYPE = TravelTypeDoc ? 'Province/City/Location :' : 'Country / City  :';

      console.log('------------- DATA');
      console.log(data);
      this.doc_id = data.doc_id;
      this.TRAVEL_TYPE_OL =
        data.doc_id.substr(0, 2).toUpperCase() === 'OB'
          ? 'oversea'
          : data.doc_id.substr(0, 2).toUpperCase() === 'OT'
            ? 'oversea'
            : data.doc_id.substr(0, 2).toUpperCase() === 'LB'
              ? 'Local'
              : data.doc_id.substr(0, 2).toUpperCase() === 'LT'
                ? 'Local'
                : '';
      this.setAllowance_detail(data.allowance_detail);
      this.allowance_detail_raw = data.allowance_detail;
      this.model_all_def = data.mail_list;
      this.arrX = data;
      this.arrXRaw = data;
      this.name_user = data.user_display;
      this.emp_list = data.emp_list;
      this.allowance_main = data.allowance_main;
      this.m_allowance_type = data.m_allowance_type;
      this.mo_m_empmail_list = data.m_empmail_list;
      (this.namex = data.user_display),
        (this.travel = data.travel_topic),
        (this.business_date = data.business_date),
        (this.travel_date = data.travel_date),
        (this.country_city = data.country_city);
      this.emp_idS = data.emp_list[ 0 ].emp_id;
      try {
        this.emp_idS = data.emp_list[ 0 ].emp_id;
        this.email_send = data.mail_list;
        this.mail_list = data.mail_list;
        this.show_button = data.emp_list[ 0 ].show_button;
      } catch (err) { }

      this.allowance_detail = data.allowance_detail;
      debugger;
      var length_nodata = this.allowance_detail.length;
      var nodata = false;
      // if (length_nodata <= 1) {
      //   if (this.allowance_detail == []) {
      //     nodata = true;
      //   } else {
      //     this.allowance_detail.forEach(function (e) {
      //       if (e.emp_id == '') {
      //         nodata = true;
      //       }
      //     });
      //   }
      // }
      this.no_data = this.detailAllawance;

      console.log('-- NO DATA --');
      console.log(this.no_data);
      console.log(nodata);
      if (data.user_admin === false) {
        this.status = false;
        //@ts-ignore

        const profile = this.profile[ 0 ];
        console.log(profile);

        this.emp_idS = profile.empId;
        this.namex = profile.empName;
        let finduser = data.emp_list.find(({emp_id}) => emp_id === profile.empId);
        finduser && (this.show_button = getBoolean(finduser.status_trip_cancelled) ? false : true);
        !finduser && (this.show_button = false);
        //?? เช็คว่าเป็น requesterรึป่าว
        //todo finduser ถ้าไม่มีใน  emplist = undefined
        if ('user_request' in data && data.user_request === true) {
          let userSelected = this.appMain.userSelected;
          this.show_button = false;
          this.status = true;
          if (userSelected) {
            this.emp_idS = this.appMain.userSelected;
          } else {
            this.emp_idS = data.emp_list[ 0 ].emp_id;
            this.appMain.userSelected = data.emp_list[ 0 ].emp_id;
          }
        }
      } else {
        this.status = true;
        let userSelect = this.appMain.userSelected;
        const {emp_id, userSelected, status_trip_cancelled} = useAuth(data, userSelect);
        this.emp_idS = emp_id;
        this.appMain.userSelected = userSelected;
        this.show_button = getBoolean(status_trip_cancelled) ? false : true;
      }
      function formatDate(date) {
        var d = new Date(date),
          month = '' + (d.getMonth() + 1),
          day = '' + d.getDate(),
          year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [ year, month, day ].join('-');
      }
      this.allowance_detail.forEach(function (e) {
        if (typeof e === 'object') {
          var xdate1 = formatDate(e.allowance_date).toString();

          var montF = new DatePipe('en-US');
          try {
            var dx1 = montF.transform(xdate1, 'dd MMM y');
          } catch (err) {
            var dx1 = '';
          }
          // console.log(dx1);
          e[ 'DatePlus' ] = dx1;
        }
        /* if (e.certificates_total != "") {
            e.certificates_total = e.certificates_total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          } */
        var low =
          e.allowance_low == null
            ? 0
            : e.allowance_low == ''
              ? 0
              : e.allowance_low == 'undefined'
                ? 0
                : e.allowance_low;
        var mid =
          e.allowance_mid == null
            ? 0
            : e.allowance_mid == ''
              ? 0
              : e.allowance_mid == 'undefined'
                ? 0
                : e.allowance_mid;
        var height =
          e.allowance_hight == null
            ? 0
            : e.allowance_hight == ''
              ? 0
              : e.allowance_hight == 'undefined'
                ? 0
                : e.allowance_hight;

        e[ 'values_L' ] = low.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        e[ 'values_M' ] = mid.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        e[ 'values_H' ] = height.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        if (e.allowance_type_id == '' || e.allowance_type_id == null) {
          e.allowance_type_id = '2';
        }
      });

      this.sum_max();
      console.log('-----------------*------------------');
      console.log(this.allowance_detail);
      // !! ปิดไว้กรณีที่ไม่มี KHCODE USER จะกรอกข้อมูลเอง ยังไม่ชัว concept
      // this.LoadKhcode();
      // !! ปิดไว้กรณีที่ไม่มี KHCODE USER จะกรอกข้อมูลเอง  ยังไม่ชัว concept
      this.MasterAirticket();
      this.Masterlocation();
      this.loadEmpList();
      this.TestExcelData();
      this.masterSet();
      this.userDetail = this.UserDetail[ 0 ];
      if (this.isCanceled === true) {
        this.isCanceled = false;
        this.swl.swal_sucess('Successfully canceled');
      }
      this.appMain.isLoading = false;
    };

    this.ws.callWs(bodyX, 'LoadAllowance').subscribe(
      (data) => onSuccess(data),
      (error) => {
        //this.appMain.isLoading = false
        console.log(error);
      },

      () => {
        this.TrackingStatus = {...InitTrackStatus};
      }
    );
  }

  model_action_change_date(id) {
    this.model_action_change(id);
  }

  onFilterChange(txt) {
    let dt;
    if (txt.length >= 3) {
      if (txt == '') {
        this.mo_m_empmail_list = this.mo_m_empmail_list;
      } else {
        dt = this.transform(this.Config_Mail.mail_cc_ds, txt, [ 'email', 'emp_name' ]);

        this.mo_m_empmail_list = dt;
        if (this.mo_m_empmail_list.length == 0) {
          this.mo_m_empmail_list = this.Config_Mail.mail_cc_ds;
        }
      }
    } else {
      this.m_empmail_list = this.Config_Mail.mail_cc_ds;
    }
  }

  Dofilter() {
    console.log(this.model.email.select_to);
    let txt = this.model.email.select_to;
    let dt;
    if (txt.length >= 3) {
      if (txt.trim() == '') {
        this.emp_list = this.model_all_def;
      } else {
        dt = this.transform(this.model_all_def, txt, [ 'userEmail', 'emp_id' ]);
        //console.log(dt)
        this.emp_list = dt;
      }
    } else {
      this.emp_list = this.emp_list;
    }
  }

  addDaysX(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result.getDate() + ' ' + result.getMonth() + ' ' + result.getFullYear();
  }

  deleteRow(event) {
    this.Email_sendX.splice(event, 1);
  }

  add_emailx(event) {
    var irow = (parseInt(this.search_len_id(this.Email_sendX, this.emp_idS, this.doc_id)) + 1).toString();
    /*     this.email_send.push({
          doc_id: this.doc_id,
          emp_id: this.emp_idS,
          id: irow,
          mail_to: event,
          mail_cc: null,
          mail_bcc: null,
          mail_status: "",
          mail_remark: null,
          action_type: "insert",
          action_change: null,
        }) */

    this.Email_sendX.push({
      doc_id: this.doc_id,
      emp_id: this.emp_idS,
      id: irow,
      mail_to: event,
      mail_cc: null,
      mail_bcc: null,
      mail_status: '',
      mail_remark: null,
      action_type: 'insert',
      action_change: null,
    });
  }

  openmodal() {
    document.getElementById('openModalButton').click();
  }

  openModalx(template: TemplateRef<any>) {
    this.tp_clone = template;
    let config: object = {
      class: 'modal-md',
      animated: true,
      keyboard: false,
      ignoreBackdropClick: true,
    };
    this.modalRef = this.modalService.show(template, config);
    // var configx = $("#exampleModalCenter").closest('.modal-backdrop').addClass('z-index:1100');
    this.appMain.isLoading = false;
  }

  excelclick;
  openModalx2Test(template: TemplateRef<any>, arr) {
    this.tempx = template;
    this.temparr = arr;
    this.excelclick = true;
    // this.swl.toastr_sucess('Preview Excel');
    this.status_save = true;
    this.saveaction();
  }
  StatusSaveExoprt = false;
  tempx;
  temparr;
  openModalx2(template: TemplateRef<any>, arr) {
    console.log(this.data_ExcelA[ 'dailyallowance' ]);
    var i = 0;
    var allowance_detailX = this.allowance_detail;
    this.data_ExcelA[ 'dailyallowance' ].forEach((e) => {
      if (allowance_detailX[ i ].allowance_total) {
        e.allowance_total = allowance_detailX[ i ].allowance_total || 0;
      }
      i++;
    });

    this.tp_clone = template;
    let config: object = {
      class: 'modal-lg',
      animated: true,
      keyboard: false,
      ignoreBackdropClick: true,
    };
    this.modalRef = this.modalService.show(template, config);
  }

  functionRow() {
    var count = 0;
    this.email_send.forEach(function (e) {
      if (e.emp_id == this.emp_idS) {
        count++;
      }
    });
    this.Rowmodel = count;
  }

  savecheck() {
    // Do you want to save the changes?
    this.swl.swal_confrim_changes('Do you want to save the document ?').then((val) => {
      if (val.isConfirmed) {
        //this.status_save = true;
        this.saveaction();
      }
    });
  }
  convert_Int_data(ev?) {
    const disgitEbiz = this.disgitEbiz;
    var newvalue = ev.replace(/,/g, '');
    var x_num = Number(parseFloat(newvalue)).toLocaleString('en-GB', {minimumFractionDigits: disgitEbiz, maximumFractionDigits: disgitEbiz});
    if (x_num == 'NaN') {
      x_num = '2';
    }
    return x_num;
  }
  setAllowance_detail(data: any) {
    if (data && data.length > 0) {
      data.forEach((r, i) => {
        if (Number(r[ "allowance_low" ])) {
          r[ "allowance_low" ] = this.convert_Int_data(r[ "allowance_low" ]);
        }
        if (Number(r[ "allowance_mid" ])) {
          r[ "allowance_mid" ] = this.convert_Int_data(r[ "allowance_mid" ]);
        }
        if (Number(r[ "allowance_hight" ])) {
          r[ "allowance_hight" ] = this.convert_Int_data(r[ "allowance_hight" ]);
        }
      })

    }

  }
  saveaction() {
    this.appMain.isLoading = true;
    this.arrX.data_type = 'save';

    this.allowance_detail.forEach((e) => {
      function datePlusday4(values) {
        var montF = new DatePipe('en-US');
        var dx = montF.transform(values, 'dd MMM yyyy');
        console.log(dx);
        return dx;
      }
    });

    this.arrX[ 'allowance_detail' ] = this.allowance_detail;

    const onSuccess = (data): void => {
      // monmon
      this.StatusSaveExoprt = true;
      console.log('After save');
      console.log(data);
      this.arrX = data;
      this.setAllowance_detail(data.allowance_detail);

      this.allowance_detail = data.allowance_detail;
      this.allowance_detail_raw = data.allowance_detail;
      this.allowance_main = data.allowance_main;
      this.mail_list = data.mail_list;
      if (this.excelclick == true) {
        this.excelclick = false;
      } else {
        this.swl.swal_sucess('Successfully saved');
      }

      this.appMain.isLoading = false;
      this.TestExcelData();

      if (this.status_save == true) {
        this.status_save = false;
        this.openModalx2(this.tempx, this.temparr);
      }

      this.allowance_detail.forEach(function (e) {
        if (typeof e === 'object') {
          var low =
            e.allowance_low == null
              ? 0
              : e.allowance_low == ''
                ? 0
                : e.allowance_low == 'undefined'
                  ? 0
                  : e.allowance_low;
          var mid =
            e.allowance_mid == null
              ? 0
              : e.allowance_mid == ''
                ? 0
                : e.allowance_mid == 'undefined'
                  ? 0
                  : e.allowance_mid;
          var height =
            e.allowance_hight == null
              ? 0
              : e.allowance_hight == ''
                ? 0
                : e.allowance_hight == 'undefined'
                  ? 0
                  : e.allowance_hight;

          e[ 'values_L' ] = low.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          e[ 'values_M' ] = mid.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          e[ 'values_H' ] = height.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        }
      });
      this.onloadX();
    };

    console.log('before save');
    this.arrX[ 'allowance_detail' ] = this.allowance_detail;
    delete this.arrX.m_empmail_list;
    console.log(this.arrX);
    this.ws.callWs(this.arrX, 'SaveAllowance').subscribe(
      (data) => onSuccess(data),
      (error) => {
        this.appMain.isLoading = false;
        alert(`WSERROR: --> ${error.message.toString()}`);
        console.log(error);
      }
    );
  }
  saveactionSendMail() {
    return new Promise((resolve, reject) => {
      this.appMain.isLoading = true;
      this.arrX.data_type = 'save';

      this.allowance_detail.forEach((e) => {
        function datePlusday4(values) {
          var montF = new DatePipe('en-US');
          var dx = montF.transform(values, 'dd MMM yyyy');
          console.log(dx);
          return dx;
        }
      });

      this.arrX[ 'allowance_detail' ] = this.allowance_detail;

      const onSuccess = (data) => {
        // monmon
        this.StatusSaveExoprt = true;
        console.log('After save');
        console.log(data);
        this.setAllowance_detail(data.allowance_detail);
        this.arrX = data;
        this.allowance_detail = data.allowance_detail;
        this.allowance_detail_raw = data.allowance_detail;
        this.allowance_main = data.allowance_main;
        this.mail_list = data.mail_list;
        if (this.excelclick == true) {
          this.excelclick = false;
        }

        this.appMain.isLoading = false;
        // this.TestExcelData();

        if (this.status_save == true) {
          this.status_save = false;
          this.openModalx2(this.tempx, this.temparr);
        }

        this.allowance_detail.forEach(function (e) {
          if (typeof e === 'object') {
            var low =
              e.allowance_low == null
                ? 0
                : e.allowance_low == ''
                  ? 0
                  : e.allowance_low == 'undefined'
                    ? 0
                    : e.allowance_low;
            var mid =
              e.allowance_mid == null
                ? 0
                : e.allowance_mid == ''
                  ? 0
                  : e.allowance_mid == 'undefined'
                    ? 0
                    : e.allowance_mid;
            var height =
              e.allowance_hight == null
                ? 0
                : e.allowance_hight == ''
                  ? 0
                  : e.allowance_hight == 'undefined'
                    ? 0
                    : e.allowance_hight;

            e[ 'values_L' ] = low.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            e[ 'values_M' ] = mid.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            e[ 'values_H' ] = height.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          }
        });
        this.onloadX();
        resolve(true);
      };

      console.log('before save');
      this.arrX[ 'allowance_detail' ] = this.allowance_detail;
      console.log(CloneDeep(this.arrX), 'CloneDeep');
      delete this.arrX.m_empmail_list;
      this.ws.callWs(this.arrX, 'SaveAllowance').subscribe(
        (data) => onSuccess(data),
        (error) => {
          reject(false);
          this.appMain.isLoading = false;
          console.log(error);
        }
      );
    });
  }
  update_luggage_clothing(value: string) {
    return value.replace(/,|฿/g, '');
  }
  allowance_detailF(index, valuess) {
    var re = this.allowance_detail;
    if (index != '') {
      var xx = (this.allowance_detail[ index ].new_column = valuess);
      console.log(this.allowance_detail);
    }
    return re;
  }

  allowance_sumFunction(low, midle, height, unit, id) {
    if (low == '' || low == null) {
      low = 0;
    }
    if (midle == '' || midle == null) {
      midle = 0;
    }
    if (height == '' || height == null) {
      height = 0;
    }
    this.allowance_detail.forEach((e) => {
      if (e.id == id) {
        e.action_change = 'true';
        e.allowance_total = parseFloat(low) + parseFloat(midle) + parseFloat(height);
      }
    });
    return parseFloat(low) + parseFloat(midle) + parseFloat(height);
  }

  datePlusday(values, index) {
    var montF = new DatePipe('en-US');
    var dx = montF.transform(values, 'dd MMM y');
    this.allowance_detail[ index ].allowance_date = dx;
  }

  cancleEx() {
    this.swl.swal_confrim('Do you want to cancel the document ?', '', 'question').then((val) => {
      if (val.isConfirmed == true) {
        this.isCanceled = true;
        this.onloadX();
      } else {
      }
    });
  }

  CancelClick() {
    //alert();
    const xxx = this.allowance_detail_raw;
    console.log(xxx);
    const aa = xxx.filter((word) => word.emp_id == this.emp_idS);
    console.log(aa);
    var sunxx = 0;
    for (var a = 0; a < this.allowance_detail.length; a++) {
      var numberx = 0;
      var xxs = this.allowance_detail[ a ].allowance_total;
      if (xxs == '-') {
        numberx = 0;
      } else {
        numberx = parseInt(xxs);
      }
      sunxx = sunxx + numberx;
    }
    this.sumx = sunxx;

    this.allowance_detail.forEach(function (e) {
      if (typeof e === 'object') {
        function formatDate(date) {
          var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + (d.getDate() + 1),
            year = d.getFullYear();

          if (month.length < 2) month = '0' + month;
          if (day.length < 2) day = '0' + day;

          return [ year, month, day ].join('-');
        }
        var xdate = formatDate(e.allowance_date);
        var montF = new DatePipe('en-US');
        let dateString = e.allowance_date.split(' ');
        var varMontx = dateString[ 0 ] + '-' + dateString[ 1 ] + '-' + dateString[ 2 ];
        var dx = montF.transform(xdate, 'dd-MMM-yyyy');

        e[ 'DatePlus' ] = dx;
      }
    });
  }

  total_raw;
  sumfunction(id, emp) {
    var sum = 0;
    this.allowance_detail.filter((e) => { });
    var re = this.allowance_detail.filter((word) => word.emp_id == emp);
    re = re.filter((word) => word.allowance_date != '');

    if (re.length <= 0) {
      return '';
    }

    re.forEach(function (e) {
      var low, midle, height;
      low = e.allowance_low;
      midle = e.allowance_mid;
      height = e.allowance_hight;
      if (e.allowance_low == '') {
        low = 0;
      }
      if (e.allowance_mid == '') {
        midle = 0;
      }
      if (e.allowance_hight == '') {
        height = 0;
      }
      sum = sum + (parseFloat(low) + parseFloat(midle) + parseFloat(height));
    });

    this.allowance_main.forEach((e) => {
      if (e.id == id) {
        e.grand_total = sum;
        e.action_change = 'true';
      }
    });
    this.total_raw = sum;
    return sum;
  }

  model_action_change_and_check(id, str_name) {
    //alert();

    var TTFF = 0;
    var low, mid, highV;
    this.allowance_detail.forEach(function (e) {
      if (e.id == id) {
        low = parseInt(e.allowance_low);
        mid = parseInt(e.allowance_mid);
        highV = parseInt(e.allowance_hight);

        if (e.allowance_low == '') {
          low = 0;
          TTFF++;
        }
        if (e.allowance_mid == '') {
          mid = 0;
          TTFF++;
        }
        if (e.allowance_hight == '') {
          TTFF++;
          highV = 0;
        }
      }
    });

    console.log(TTFF);
    if (TTFF <= 1) {
      this.swl.swal_error('');
      this.allowance_detail.forEach(function (e) {
        if (e.id == id) {
          e[ str_name ] = '';
        }
      });
    }

    this.model_action_change(id);
    this.before_ChangUser = true;

    return low + mid + highV;
  }

  model_action_change(id) {
    //alert();
    var empX;
    this.allowance_detail.forEach(function (e) {
      if (e.id == id) {
        e.action_change = true;
        empX = e.emp_id;
      }
    });

    this.allowance_main.forEach(function (e) {
      if (e.emp_id == empX) {
        e.action_change = true;
      }
    });

    this.before_ChangUser = true;
    console.log(this.allowance_detail);
    console.log(this.allowance_main);
  }

  transformX(items, searchText) {
    searchText = searchText.toLocaleLowerCase();
    return items.filter((it) => {
      return it.mail_to.toLocaleLowerCase().includes(searchText);
    });
  }

  set_modal() {
    $('.modal-backdrop').css({'z-index': 700});
    $('.modal').css({'z-index': 800});
  }

  sendmail() {
    console.log(this.arrX);
    this.btnCloseX.nativeElement.click();

    const onSuccess = (data): void => {
      console.log(data);
      this.swl.swal_sucess('Send E-mail successfully.');
    };

    this.ws.callWs(this.arrX, 'SaveAllowance').subscribe(
      (data) => onSuccess(data),
      (error) => {
        this.appMain.isLoading = false;
        console.log(error);
      }
    );
  }

  add_email2(event) {
    var maxId = 0;
    var check_mail_dupicate = false;
    if (event == '') {
      return;
    }

    this.email_send.forEach(function (e) {
      if (maxId < parseInt(e.id)) {
        maxId = parseInt(e.id);
      }
    });

    this.Email_sendX.forEach(function (e) {
      if (event == e.mail_to) {
        check_mail_dupicate = true;
      }
    });

    if (check_mail_dupicate) {
      this.swl.swal_error('Mail Duplicate');
    } else {
      this.Email_sendX.push({
        doc_id: this.doc_id,
        emp_id: this.emp_idS,
        id: maxId,
        mail_to: event,
        mail_cc: null,
        mail_bcc: null,
        mail_status: '',
        mail_remark: null,
        action_type: 'insert',
        action_change: null,
      });
    }
  }

  add_email(event) {
    if (event == '') {
      return;
    }
    var emp_id = this.emp_idS;
    var doc_id = this.doc_id;
    console.log(emp_id);
    console.log(doc_id);
    //var emp_id = this.emp_id;
    var irow = (parseInt(this.search_len_id(this.Email_sendX, emp_id, doc_id)) + 1).toString();
    var check_mail_dupicate = this.Email_sendX.some(
      (res) => res.emp_id == emp_id && res.doc_id == doc_id && event == res.mail_to && res.action_type != 'delete'
    );
    if (check_mail_dupicate) {
      this.swl.swal_error('Mail Duplicate');
    } else {
      this.Email_sendX.push({
        doc_id: this.doc_id,
        emp_id: this.emp_idS,
        id: irow,
        mail_to: event,
        mail_cc: null,
        mail_bcc: null,
        mail_status: '',
        mail_remark: null,
        action_type: 'insert',
        action_change: null,
      });

      alert('yesss');
    }
  }

  search_len_id(ds, emp_id, doc_id) {
    var dt = ds.filter((res) => res.emp_id == emp_id && res.doc_id == doc_id);
    console.log(dt);
    dt = dt.sort((a, b) => {
      return a.id.localeCompare(b.id);
    });
    var len = dt.length < 1 ? 0 : dt.length - 1;
    return dt[ len ].id;
  }

  export() {
    // "doc_id": this.doc_id,
    var xxx = {
      token_login: '4d80b2c4-d278-407f-a65a-231225873503',
      doc_id: 'OB20120006',
      emp_id: this.emp_idS,
      path: '',
      filename: '',
      pagename: 'allowance',
      actionname: 'excle_test',
      filetype: 'excle',
      after_trip: {
        opt1: '',
        opt2: {
          status: '',
          remark: '',
        },
        opt3: {
          status: '',
          remark: '',
        },
      },
    };
    // doc_id: this.doc_id,
    var ee = {
      token_login: localStorage[ 'token' ],
      doc_id: 'OB20120006',
      emp_id: this.emp_idS,
      pagename: 'allowance',
      actionname: 'allowance',
      filetype: 'excel',
    };

    console.log(ee);
    //console.log(this.arrX);
    const onSuccess = (data): void => {
      console.log(data);
      this.swl.swal_sucess('Export data successfully.');
    };

    this.ws.callWs(ee, 'ExportFile').subscribe(
      (data) => onSuccess(data),
      (error) => {
        this.appMain.isLoading = false;
        console.log(error);
      }
    );
    //this.btnCloseX.nativeElement.click();
  }

  modelChanged(event) {
    var arrx = this.arrX[ 'emp_list"' ];
    this.email_send = this.transformX(arrx, event);
  }

  transform(items, searchText, filde) {
    searchText = searchText.toLowerCase();
    return items.filter((it) => {
      return (
        it[ filde[ 0 ] ].toLowerCase().includes(searchText) || it[ filde[ 1 ] ].toLowerCase().includes(searchText)
        // it.emp_name.includes(searchText)
      );
    });
  }

  exportX(Action_param) {
    this.appMain.isLoading = true;
    this.generateExcel(Action_param);
  }

  commaFunction(val) {
    // debugger;
    try {
      if (val == 0 && val == '0') {
        return 0;
      } else if (val == '') {
        return '';
      } else {
        val = val.toString();

        var newvalue = val.replace(/,/g, '');
        var x_num = Number(parseInt(newvalue)).toLocaleString('en-GB');
        if (x_num == 'NaN') {
          x_num = '0';
        }
        var recomma = x_num.replace(/,/g, '');
        var add_dot = newvalue.replace(recomma, '');

        return x_num + add_dot;
      }
    } catch (ex) {
      return '';
    }
  }

  async generateExcel(Action_param) {
    // Excel Title, Header, Data
    const title = 'Yearly Social Sharing Education For Betterment';
    const header = [ 'Day', 'DATE', '< 6 hr', '6-12 hr', 'TOTAL' ];
    const data = [
      [ 2019, 1, '50', '20', '25', '20' ],
      [ 2019, 2, '80', '20', '25', '20' ],
      [ 2019, 3, '120', '20', '25', '20' ],
      [ 2019, 4, '75', '20', '25', '20' ],
      [ 2019, 5, '60', '20', '25', '20' ],
      [ 2019, 6, '80', '20', '25', '20' ],
      [ 2019, 7, '95', '20', '25', '20' ],
      [ 2019, 8, '55', '20', '25', '20' ],
      [ 2019, 9, '45', '20', '25', '20' ],
      [ 2019, 10, '80', '20', '25', '20' ],
      [ 2019, 11, '90', '20', '25', '20' ],
      [ 2019, 12, '110', '20', '25', '20' ],
    ];

    // Create workbook and worksheet
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Sharing Data');
    worksheet.pageSetup.fitToPage = true;
    var ws = worksheet;
    /* var cell_A = [] ; 
    for(var x = 0 ; x <100 ;x++){ cell_A[x] = []} */
    /* var setBG = ws.getCell('A1');
    setBG.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF0000' }
    }; */
    var sum_row = this.data_ExcelA[ 'flightschedule' ].length + this.data_ExcelA[ 'dailyallowance' ].length;
    //alert(sum_row);
    var arr_Eng = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J' ];
    for (var x = 0; x < 10; x++) {
      for (var i = 0; i < 35 + sum_row; i++) {
        var str_row = arr_Eng[ x ] + i;
        ws.getCell(str_row).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: {argb: 'FFFFFF'},
        };
      }
    }

    worksheet.columns = [
      {width: 3},
      {width: 20},
      {width: 20},
      {width: 20},
      {width: 20},
      {width: 20},
      {width: 20},
      {width: 10},
      {width: 3},
      {width: 3},
    ];

    worksheet.mergeCells('A1:H1');
    worksheet.mergeCells('B14:H14');
    worksheet.mergeCells('A2:H2');
    worksheet.mergeCells('B3:F3');
    worksheet.mergeCells('G3:H3');
    worksheet.mergeCells('A3:A20');
    worksheet.mergeCells('G15:H15');
    ws.getRow(14).height = 20;

    ws.getCell('A1').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'FFFFFF'},
    };

    ws.getCell('A2').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'FFFFFF'},
    };
    ws.getCell('A2').alignment = {
      vertical: 'middle',
      horizontal: 'center',
    };
    ws.getRow(2).height = 24;
    ws.getCell('A2').font = {
      name: 'Franklin Gothic Book',
      family: 4,
      size: 18,
      bold: true,
      color: {argb: '595959'},
    };
    ws.getCell('A2').value = 'BUSINESS TRIP ALLOWANCE FORM';

    ws.getCell('A3').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'FFFFFF'},
    };
    ws.getCell('B3').value = `Document Number :${this.doc_id}`;
    ws.getRow(5).height = 2;
    ws.getRow(7).height = 2;
    ws.getRow(9).height = 2;
    ws.getRow(11).height = 2;
    ws.getRow(13).height = 2;

    ws.getCell('B3').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'FFFFFF'},
    };
    ws.getCell('B3').font = {name: 'Franklin Gothic Book', family: 4, size: 10, color: {argb: '595959'}};

    ws.getCell('H3').value = this.data_ExcelA[ 'last_update' ];
    ws.getCell('H3').alignment = {
      vertical: 'middle',
      horizontal: 'right',
    };
    ws.getCell('H3').font = {name: 'Franklin Gothic Book', family: 4, size: 10, color: {argb: '595959'}};

    var values_col_b = [ 'Title', 'Name', 'Country', 'Business Date', 'GL Account' ];
    var xx = 0;
    for (var i = 4; i <= 12; i++) {
      if (i != 5 && i != 7 && i != 9 && i != 11) {
        ws.getCell('B' + i).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: {argb: 'FFFFFF'},
        };
        ws.getCell('B' + i).alignment = {
          vertical: 'middle',
          horizontal: 'left',
        };
        //ws.getRow(2).height = 24;
        ws.getCell('B' + i).font = {
          name: 'Franklin Gothic Book',
          family: 4,
          size: 10,
          bold: true,
          color: {argb: '595959'},
        };
        ws.getCell('B' + i).value = '' + values_col_b[ xx ] + '';

        xx++;
      }
    }

    function add_bo_al(values, f1, f2, f3, f4, f5) {
      // color: { argb: '595959' }
      var colorx;
      if (f5 != 0) {
        colorx = '595959';
      } else {
        colorx = '000000';
      }

      if (f1 != 0) {
        var fontX = {name: 'Franklin Gothic Book', family: 4, size: 10, bold: true, color: {argb: colorx}};
        ws.getCell(values).font = fontX;
      }

      if (f2 != 0) {
        if (f2 == 1) {
          ws.getCell(values).alignment = {
            wrapText: true,
            vertical: 'middle',
          };
        }
        if (f2 == 2) {
          ws.getCell(values).alignment = {
            vertical: 'middle',
            horizontal: 'center',
          };
        }
        if (f2 == 3) {
          ws.getCell(values).alignment = {
            vertical: 'middle',
            horizontal: 'left',
          };
        }
        if (f2 == 4) {
          ws.getCell(values).alignment = {
            vertical: 'middle',
            horizontal: 'right',
          };
        }
      }

      if (f3 != 0) {
        ws.getCell(values).border = {
          top: {style: 'thin', color: {argb: 'B6B6B6'}},
          left: {style: 'thin', color: {argb: 'B6B6B6'}},
          bottom: {style: 'thin', color: {argb: 'B6B6B6'}},
          right: {style: 'thin', color: {argb: 'B6B6B6'}},
        };
      }

      if (f4 != '') {
        ws.getCell(values).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: {argb: f4},
        };
      }
    }

    ws.getRow(4).height = 30;
    ws.mergeCells('C4:E4');
    ws.getCell('C4').value = this.data_ExcelA[ 'title' ];
    add_bo_al('C4', 1, 1, 1, '', 0);
    const cancelled = false; //ยกเลิกการแสดงค่า total ในส่วนของ header
    if (cancelled) {
      if (this.TRAVEL_TYPE_OL.toLocaleLowerCase() != 'local') {
        ws.getCell('F4').value = 'TOTAL';
        add_bo_al('F4', 1, 2, 0, '', 0);
        // ws.getCell('G4').value = parseFloat(this.total_raw.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));
        const option: Intl.NumberFormatOptions = {minimumIntegerDigits: 2, maximumFractionDigits: 2};
        ws.getCell('G4').value = parseFloat(this.total_raw.toString() || '0').toLocaleString(undefined, option);
        add_bo_al('G4', 1, 4, 1, '', 0);
        ws.getCell('H4').value = this.data_ExcelA[ 'unit' ];
        add_bo_al('H4', 1, 2, 1, 'DDEBF7', 0);
      } else {
        ws.getCell('F4').value = 'TOTAL';
        add_bo_al('F4', 1, 2, 0, '', 0);
        var THB_C =
          '' + parseFloat(this.total_raw) * parseFloat(this.data_ExcelA[ 'm_exchangerate_max' ][ 0 ].exchange_rate) + '';
        ws.getCell('G4').value = this.commaFunction(this.data_ExcelA[ 'total' ]);
        add_bo_al('G4', 1, 4, 1, '', 0);
        ws.getCell('H4').value = 'THB';
        add_bo_al('H4', 1, 2, 1, 'DDEBF7', 0);
      }
    }
    //-------------------4---------------------

    ws.mergeCells('D6:E6');
    ws.getCell('C6').value = this.data_ExcelA[ 'employee_id' ];
    add_bo_al('C6', 1, 1, 1, '', 0);

    ws.getCell('D6').value = this.data_ExcelA[ 'employee_name' ];
    add_bo_al('D6', 1, 1, 1, '', 0);
    if (cancelled) {
      if (this.TRAVEL_TYPE_OL.toLocaleLowerCase() != 'local') {
        ws.getCell('F6').value = 'TOTAL';
        add_bo_al('F6', 1, 2, 0, '', 0);
        let THB_C = parseFloat(this.total_raw) * parseFloat(this.data_ExcelA[ 'm_exchangerate_max' ][ 0 ].exchange_rate);
        // ws.getCell('G6').value = this.commaFunction(this.data_ExcelA['total']);
        ws.getCell('G6').value = this.commaFunction(Number(THB_C).toFixed(2));
        add_bo_al('G6', 1, 4, 1, '', 0);
        ws.getCell('H6').value = 'THB';
        add_bo_al('H6', 1, 2, 1, 'DDEBF7', 0);
      }
    }

    //-------------------6---------------------

    ws.getCell('C8').value = this.data_ExcelA[ 'country' ];
    add_bo_al('C8', 1, 1, 1, '', 0);

    ws.getCell('D8').value = 'Sect./Dept.';
    add_bo_al('D8', 1, 1, 0, '', 1);

    ws.getCell('E8').value = this.data_ExcelA[ 'functional' ];
    add_bo_al('E8', 1, 1, 1, '', 0);

    ws.getCell('F8').value = '';
    add_bo_al('F8', 1, 1, 0, '', 0);

    ws.getCell('G8').value = '';
    add_bo_al('G8', 1, 1, 0, '', 0);

    ws.getCell('H8').value = '';
    add_bo_al('H8', 1, 1, 0, '', 0),
      //-------------------8---------------------

      (ws.getCell('C10').value = this.data_ExcelA[ 'business_date' ]);
    add_bo_al('C10', 1, 1, 1, '', 0);

    ws.getCell('D10').value = 'Departure Date';
    add_bo_al('D10', 1, 1, 0, '', 1);

    ws.getCell('E10').value = this.data_ExcelA[ 'departure_date' ];
    add_bo_al('E10', 1, 1, 1, '', 0);

    ws.getCell('F10').value = 'Arrival Date';
    add_bo_al('F10', 1, 2, 0, '', 1);

    ws.getCell('G10').alignment = {
      vertical: 'middle',
      horizontal: 'center',
    };
    ws.mergeCells('G10:H10');
    ws.getCell('G10').value = this.data_ExcelA[ 'arrival_date' ];
    add_bo_al('G10', 1, 1, 1, '', 0),
      //-------------------10---------------------

      (ws.getCell('C12').value = this.data_ExcelA[ 'gl_account' ]);
    add_bo_al('C12', 1, 1, 1, '', 0);

    ws.getCell('D12').value = 'Cost Center';
    add_bo_al('D12', 1, 1, 0, '', 1);

    ws.getCell('E12').value = this.data_ExcelA[ 'cost_center' ];
    add_bo_al('E12', 1, 1, 1, '', 0);

    ws.getCell('F12').value = 'i/O Number';
    add_bo_al('F12', 1, 2, 0, '', 1);

    ws.mergeCells('G12:H12');
    ws.getCell('G12').value = this.data_ExcelA[ 'io_number' ];
    add_bo_al('G12', 1, 1, 1, '', 0),
      //-------------------12---------------------

      (ws.getCell('B14').font = {
        name: 'Franklin Gothic Book',
        family: 4,
        size: 11,
        bold: true,
        color: {argb: 'FFC000'},
      });
    ws.getCell('B14').value = 'Daily allowance';
    ws.getCell('B14').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: '2F75B5'},
    };
    ws.getCell('B14').alignment = {
      vertical: 'middle',
      horizontal: 'center',
    };

    ws.getCell('B15').value = 'Days';
    add_bo_al('B15', 1, 1, 1, 'AEAAAA', 0);
    ws.getCell('B15').alignment = {
      vertical: 'middle',
      horizontal: 'center',
    };

    if (this.TRAVEL_TYPE_OL.toLocaleLowerCase() == 'local') {
      ws.mergeCells('C15:D15');
      ws.getCell('C15').value = 'Date';
      add_bo_al('C15', 1, 1, 1, 'AEAAAA', 0);
      ws.getCell('C15').alignment = {
        vertical: 'middle',
        horizontal: 'center',
      };
    } else {
      ws.getCell('C15').value = 'Date';
      add_bo_al('C15', 1, 1, 1, 'AEAAAA', 0);
      ws.getCell('C15').alignment = {
        vertical: 'middle',
        horizontal: 'center',
      };
    }

    if (this.TRAVEL_TYPE_OL.toLocaleLowerCase() == 'local') {
      ws.getCell('E15').value = 'ไม่ค้างคืน';
      add_bo_al('E15', 1, 1, 1, 'AEAAAA', 0);
      ws.getCell('E15').alignment = {
        vertical: 'middle',
        horizontal: 'center',
      };
    } else {
      ws.getCell('D15').value = '< 6 hr';
      add_bo_al('D15', 1, 1, 1, 'AEAAAA', 0);
      ws.getCell('D15').alignment = {
        vertical: 'middle',
        horizontal: 'center',
      };
    }

    if (this.TRAVEL_TYPE_OL.toLocaleLowerCase() != 'local') {
      ws.getCell('E15').value = '6-12 hr';
      add_bo_al('E15', 1, 1, 1, 'AEAAAA', 0);
      ws.getCell('E15').alignment = {
        vertical: 'middle',
        horizontal: 'center',
      };
    }

    if (this.TRAVEL_TYPE_OL.toLocaleLowerCase() == 'local') {
      ws.getCell('F15').value = 'ค้างคืน';
    } else {
      ws.getCell('F15').value = '> 12 hr';
    }
    add_bo_al('F15', 1, 1, 1, 'AEAAAA', 0);
    ws.getCell('F15').alignment = {
      vertical: 'middle',
      horizontal: 'center',
    };

    ws.getCell('G15').value = 'TOTAL';
    add_bo_al('G15', 1, 1, 1, 'AEAAAA', 0);
    ws.getCell('G15').alignment = {
      vertical: 'middle',
      horizontal: 'center',
    };

    var dailyallowanceXdata = this.data_ExcelA[ 'dailyallowance' ];
    var xl = 16;
    for (var i = 0; i < dailyallowanceXdata.length; i++) {
      if (i == 0) {
        ws.getCell('B' + xl).border = {
          left: {style: 'thin', color: {argb: 'B6B6B6'}},
        };
        ws.getCell('H' + xl).border = {
          right: {style: 'thin', color: {argb: 'B6B6B6'}},
        };
      }

      //worksheet.mergeCells('A1:H1');
      ws.getCell('B' + xl).value = dailyallowanceXdata[ i ][ 'allowance_days' ];
      ws.getCell('B' + xl).alignment = {
        vertical: 'middle',
        horizontal: 'center',
      };
      /* ws.getCell('B'+xl).border = {
        left: { style: "thin" },
      }; */
      if (this.TRAVEL_TYPE_OL.toLocaleLowerCase() == 'local') {
        ws.mergeCells('C' + xl + ':D' + xl);
        ws.getCell('C' + xl).value = dailyallowanceXdata[ i ][ 'allowance_date' ];
        ws.getCell('C' + xl).alignment = {
          vertical: 'middle',
          horizontal: 'center',
        };
      } else {
        ws.getCell('C' + xl).value = dailyallowanceXdata[ i ][ 'allowance_date' ];
        ws.getCell('C' + xl).alignment = {
          vertical: 'middle',
          horizontal: 'center',
        };
      }

      if (this.TRAVEL_TYPE_OL.toLocaleLowerCase() == 'local') {
        ws.getCell('E' + xl).value = this.commaFunction(dailyallowanceXdata[ i ][ 'allowance_low' ]);
        //ws.getCell('E' + xl).value = dailyallowanceXdata[i]['allowance_low'];
        ws.getCell('E' + xl).alignment = {
          vertical: 'middle',
          horizontal: 'right',
        };
      } else {
        ws.getCell('D' + xl).value = this.commaFunction(dailyallowanceXdata[ i ][ 'allowance_low' ]);
        //ws.getCell('D' + xl).value = dailyallowanceXdata[i]['allowance_low'];
        ws.getCell('D' + xl).alignment = {
          vertical: 'middle',
          horizontal: 'right',
        };
      }

      if (this.TRAVEL_TYPE_OL.toLocaleLowerCase() != 'local') {
        ws.getCell('E' + xl).value = this.commaFunction(dailyallowanceXdata[ i ][ 'allowance_mid' ]);
        //ws.getCell('E' + xl).value = dailyallowanceXdata[i]['allowance_mid'];
        ws.getCell('E' + xl).alignment = {
          vertical: 'middle',
          horizontal: 'right',
        };
      }
      ws.getCell('F' + xl).value = this.commaFunction(dailyallowanceXdata[ i ][ 'allowance_hight' ]);
      //ws.getCell('F' + xl).value = dailyallowanceXdata[i]['allowance_hight'];
      ws.getCell('F' + xl).alignment = {
        vertical: 'middle',
        horizontal: 'right',
      };

      if (this.TRAVEL_TYPE_OL.toLocaleLowerCase() == 'local') {
        ws.mergeCells('G' + xl + ':H' + xl);
        ws.getCell('G' + xl).value = this.commaFunction(dailyallowanceXdata[ i ][ 'allowance_total' ]) + ' THB';
        //ws.getCell('G' + xl).value = dailyallowanceXdata[i]['allowance_total'] + " THB";
        ws.getCell('G' + xl).alignment = {
          vertical: 'middle',
          horizontal: 'center',
        };
      } else {
        ws.getCell('G' + xl).value = this.commaFunction(dailyallowanceXdata[ i ][ 'allowance_total' ]);
        //ws.getCell('G' + xl).value = dailyallowanceXdata[i]['allowance_total'];
        ws.getCell('G' + xl).alignment = {
          vertical: 'middle',
          horizontal: 'right',
        };

        /*      <span *ngIf="TRAVEL_TYPE_OL == 'oversea' && dt.allowance_unit == '' "> 
        USD
    </span>
    <span *ngIf="TRAVEL_TYPE_OL == 'Local' ">
        THB
    </span> */
        if (this.TRAVEL_TYPE_OL.toLocaleLowerCase() == 'oversea' && dailyallowanceXdata[ i ][ 'allowance_unit' ] == '') {
          ws.getCell('H' + xl).value = dailyallowanceXdata[ i ][ 'allowance_unit' ];
          ws.getCell('H' + xl).alignment = {
            vertical: 'middle',
            horizontal: 'center',
          };
        } else {
          ws.getCell('H' + xl).value = dailyallowanceXdata[ i ][ 'allowance_unit' ];
          ws.getCell('H' + xl).alignment = {
            vertical: 'middle',
            horizontal: 'center',
          };
        }

        if (this.TRAVEL_TYPE_OL.toLocaleLowerCase() == 'local') {
          ws.getCell('H' + xl).value = 'THB';
          ws.getCell('H' + xl).alignment = {
            vertical: 'middle',
            horizontal: 'center',
          };
        }
      }
      /* ws.getCell('H'+xl).border = {
        right: { style: "thin" }
      }; */
      xl++;

      if (dailyallowanceXdata.length - 1 != i) {
        ws.getCell('B' + xl).border = {
          left: {style: 'thin', color: {argb: 'B6B6B6'}},
        };
        ws.getCell('H' + xl).border = {
          right: {style: 'thin', color: {argb: 'B6B6B6'}},
        };
      }

      if (dailyallowanceXdata.length - 2 == i) {
        ws.getCell('B' + xl).border = {
          left: {style: 'thin', color: {argb: 'B6B6B6'}},
          bottom: {style: 'thin', color: {argb: 'B6B6B6'}},
        };
        ws.getCell('C' + xl).border = {
          bottom: {style: 'thin', color: {argb: 'B6B6B6'}},
        };
        ws.getCell('D' + xl).border = {
          bottom: {style: 'thin', color: {argb: 'B6B6B6'}},
        };
        ws.getCell('E' + xl).border = {
          bottom: {style: 'thin', color: {argb: 'B6B6B6'}},
        };
        ws.getCell('F' + xl).border = {
          bottom: {style: 'thin', color: {argb: 'B6B6B6'}},
        };
        ws.getCell('G' + xl).border = {
          bottom: {style: 'thin', color: {argb: 'B6B6B6'}},
        };
        ws.getCell('H' + xl).border = {
          right: {style: 'thin', color: {argb: 'B6B6B6'}},
          bottom: {style: 'thin', color: {argb: 'B6B6B6'}},
        };
      }
    }

    worksheet.mergeCells('B' + xl + ':F' + xl + '');
    worksheet.mergeCells('G' + xl + ':H' + xl + '');

    var fontX = {name: 'Franklin Gothic Book', family: 4, size: 10, bold: true};
    ws.getCell('B' + xl).font = fontX;
    ws.getCell('G' + xl).font = fontX;
    ws.getCell('B' + xl).value = 'TOTAL ALLOWANCE';

    if (this.TRAVEL_TYPE_OL.toLocaleLowerCase() != 'local') {
      ws.getCell('G' + xl).value = '$' + this.commaFunction(this.data_ExcelA[ 'total' ]);
      //ws.getCell('G' + xl).value = '$' + this.data_ExcelA['total'];
    } else {
      ws.getCell('G' + xl).value = '฿' + this.commaFunction(this.data_ExcelA[ 'total' ]);
      //ws.getCell('G' + xl).value = '฿' + this.data_ExcelA['total'];
    }
    ws.getCell('B' + xl).border = {
      top: {style: 'thin', color: {argb: 'B6B6B6'}},
      left: {style: 'thin', color: {argb: 'B6B6B6'}},
      bottom: {style: 'thin', color: {argb: 'B6B6B6'}},
      right: {style: 'thin', color: {argb: 'B6B6B6'}},
    };
    ws.getCell('G' + xl).border = {
      top: {style: 'thin', color: {argb: 'B6B6B6'}},
      left: {style: 'thin', color: {argb: 'B6B6B6'}},
      bottom: {style: 'thin', color: {argb: 'B6B6B6'}},
      right: {style: 'thin', color: {argb: 'B6B6B6'}},
    };
    ws.getCell('B' + xl).alignment = {
      vertical: 'middle',
      horizontal: 'right',
    };
    ws.getCell('G' + xl).alignment = {
      vertical: 'middle',
      horizontal: 'center',
    };

    xl = xl + 1;
    worksheet.mergeCells('G' + (xl + 1) + ':H' + (xl + 1) + '');
    ws.getCell('B' + xl).value = 'FLIGHT SCHEDULE';
    add_bo_al('B' + xl, 1, 1, 0, '', 1);
    ws.getCell('B' + xl).alignment = {
      vertical: 'middle',
      horizontal: 'left',
    };

    ws.getCell('B' + (xl + 1)).value = 'Date';
    add_bo_al('B' + (xl + 1), 1, 1, 1, 'D0CECE', 0);
    ws.getCell('B' + (xl + 1)).alignment = {
      vertical: 'middle',
      horizontal: 'center',
    };
    ws.getCell('C' + (xl + 1)).value = 'From';
    add_bo_al('C' + (xl + 1), 1, 1, 1, 'D0CECE', 0);
    ws.getCell('C' + (xl + 1)).alignment = {
      vertical: 'middle',
      horizontal: 'center',
    };
    ws.getCell('D' + (xl + 1)).value = 'To';
    add_bo_al('D' + (xl + 1), 1, 1, 1, 'D0CECE', 0);
    ws.getCell('D' + (xl + 1)).alignment = {
      vertical: 'middle',
      horizontal: 'center',
    };
    ws.getCell('E' + (xl + 1)).value = 'Flight';
    add_bo_al('E' + (xl + 1), 1, 1, 1, 'D0CECE', 0);
    ws.getCell('E' + (xl + 1)).alignment = {
      vertical: 'middle',
      horizontal: 'center',
    };
    ws.getCell('F' + (xl + 1)).value = 'Depature Time';
    add_bo_al('F' + (xl + 1), 1, 1, 1, 'D0CECE', 0);
    ws.getCell('F' + (xl + 1)).alignment = {
      vertical: 'middle',
      horizontal: 'center',
    };

    ws.getCell('G' + (xl + 1)).value = 'Arrival Time';
    add_bo_al('G' + (xl + 1), 1, 1, 1, 'D0CECE', 0);
    ws.getCell('G' + (xl + 1)).alignment = {
      vertical: 'middle',
      horizontal: 'center',
    };

    var FlightXdata = this.data_ExcelA[ 'flightschedule' ];
    var xlx = xl + 2;

    for (var i = 0; i < FlightXdata.length; i++) {
      worksheet.mergeCells('G' + xlx + ':H' + xlx + '');

      ws.getCell('B' + xlx).value = FlightXdata[ i ][ 'airticket_date' ];
      add_bo_al('B' + xlx, 1, 1, 1, '', 0);
      ws.getCell('B' + xlx).alignment = {
        vertical: 'middle',
        horizontal: 'center',
      };

      ws.getCell('C' + xlx).value = this.filter_location(FlightXdata[ i ][ 'airticket_route_from' ]);
      add_bo_al('C' + xlx, 1, 1, 1, '', 0);
      ws.getCell('C' + xlx).alignment = {
        vertical: 'middle',
        horizontal: 'center',
      };
      ws.getCell('D' + xlx).value = this.filter_location(FlightXdata[ i ][ 'airticket_route_to' ]);
      add_bo_al('D' + xlx, 1, 1, 1, '', 0);
      ws.getCell('D' + xlx).alignment = {
        vertical: 'middle',
        horizontal: 'center',
      };
      ws.getCell('E' + xlx).value = FlightXdata[ i ][ 'airticket_flight' ];
      add_bo_al('E' + xlx, 1, 1, 1, '', 0);
      ws.getCell('E' + xlx).alignment = {
        vertical: 'middle',
        horizontal: 'center',
      };
      ws.getCell('F' + xlx).value = FlightXdata[ i ][ 'airticket_departure_time' ];
      add_bo_al('F' + xlx, 1, 1, 1, '', 0);
      ws.getCell('F' + xlx).alignment = {
        vertical: 'middle',
        horizontal: 'center',
      };
      ws.getCell('G' + xlx).value = FlightXdata[ i ][ 'airticket_arrival_time' ];
      add_bo_al('G' + xlx, 1, 1, 1, '', 0);
      ws.getCell('G' + xlx).alignment = {
        vertical: 'middle',
        horizontal: 'right',
      };

      xlx++;
    }

    xlx = xlx + 1;
    worksheet.mergeCells('B' + xlx + ':H' + xlx + '');
    //Accommodation
    // ws.getCell('B' + xlx).font = {
    //   name: 'Franklin Gothic Book',
    //   family: 4,
    //   size: 11,
    //   bold: true,
    //   color: { argb: 'FFC000' },
    // };
    // ws.getCell('B' + xlx).value = 'Accommodation';
    // ws.getCell('B' + xlx).fill = {
    //   type: 'pattern',
    //   pattern: 'solid',
    //   fgColor: { argb: '2F75B5' },
    // };
    // ws.getCell('B' + xlx).alignment = {
    //   vertical: 'middle',
    //   horizontal: 'center',
    // };

    // xlx = xlx + 1;
    // worksheet.mergeCells('B' + xlx + ':D' + xlx + '');
    // worksheet.mergeCells('E' + xlx + ':H' + xlx + '');
    // ws.getCell('B' + xlx).font = { name: 'Franklin Gothic Book', family: 4, size: 9 };
    // ws.getCell('B' + xlx).value = 'Booking by Travel Agent';
    // ws.getCell('B' + xlx).fill = {
    //   type: 'pattern',
    //   pattern: 'solid',
    //   fgColor: { argb: 'F2F2F2' },
    // };
    // ws.getCell('B' + xlx).alignment = {
    //   vertical: 'middle',
    //   horizontal: 'center',
    // };

    // ws.getCell('E' + xlx).font = { name: 'Franklin Gothic Book', family: 4, size: 9 };
    // ws.getCell('E' + xlx).value = 'Booking by others and reclaim after travelling';
    // ws.getCell('E' + xlx).fill = {
    //   type: 'pattern',
    //   pattern: 'solid',
    //   fgColor: { argb: 'F2F2F2' },
    // };
    // ws.getCell('E' + xlx).alignment = {
    //   vertical: 'middle',
    //   horizontal: 'center',
    // };
    //Accommodation
    if (this.TRAVEL_TYPE_OL.toLocaleLowerCase() != 'local') {
      xlx = xlx + 1;
      worksheet.mergeCells('B' + xlx + ':C' + xlx + '');
      ws.getCell('B' + xlx).font = {name: 'Franklin Gothic Book', family: 4, size: 9, color: {argb: '595959'}};
      ws.getCell('B' + xlx).value = 'RECORD OF OUTFIT ALLOWANCES';

      xlx = xlx + 1;
      worksheet.mergeCells('B' + xlx + ':C' + xlx + '');
      worksheet.mergeCells('D' + xlx + ':E' + xlx + '');
      worksheet.mergeCells('G' + xlx + ':H' + xlx + '');
      ws.getCell('B' + xlx).font = {name: 'Franklin Gothic Book', family: 4, size: 9, color: {argb: '595959'}};
      ws.getCell('B' + xlx).value = 'LUGGAGE & CLOTHING (THB)';

      ws.getCell('D' + xlx).font = {name: 'Franklin Gothic Book', family: 4, size: 9};
      ws.getCell('D' + xlx).value = this.data_ExcelA[ 'luggage_clothing' ]
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      ws.getCell('D' + xlx).alignment = {
        vertical: 'middle',
        horizontal: 'center',
      };
      ws.getCell('D' + xlx).border = {
        top: {style: 'thin', color: {argb: 'B6B6B6'}},
        left: {style: 'thin', color: {argb: 'B6B6B6'}},
        bottom: {style: 'thin', color: {argb: 'B6B6B6'}},
        right: {style: 'thin', color: {argb: 'B6B6B6'}},
      };

      ws.getCell('F' + xlx).font = {name: 'Valid Date', family: 4, size: 9, color: {argb: '595959'}};
      ws.getCell('F' + xlx).value = 'Valid Date';

      ws.getCell('G' + xlx).font = {name: 'Franklin Gothic Book', family: 4, size: 9};
      ws.getCell('G' + xlx).value = this.data_ExcelA[ 'luggage_clothing_date' ];
      ws.getCell('G' + xlx).alignment = {
        vertical: 'middle',
        horizontal: 'center',
      };
      ws.getCell('G' + xlx).border = {
        top: {style: 'thin', color: {argb: 'B6B6B6'}},
        left: {style: 'thin', color: {argb: 'B6B6B6'}},
        bottom: {style: 'thin', color: {argb: 'B6B6B6'}},
        right: {style: 'thin', color: {argb: 'B6B6B6'}},
      };
      ws.getRow(xlx + 1).height = 2;

      xlx = xlx + 2;

      worksheet.mergeCells('B' + xlx + ':C' + xlx + '');
      worksheet.mergeCells('D' + xlx + ':E' + xlx + '');
      worksheet.mergeCells('G' + xlx + ':H' + xlx + '');
      ws.getCell('B' + xlx).font = {name: 'Franklin Gothic Book', family: 4, size: 9, color: {argb: '595959'}};
      ws.getCell('B' + xlx).value = 'PASSPORT (THB)';

      ws.getCell('D' + xlx).font = {name: 'Franklin Gothic Book', family: 4, size: 9};
      ws.getCell('D' + xlx).value = this.commaFunction(this.data_ExcelA[ 'passport' ]);
      ws.getCell('D' + xlx).alignment = {
        vertical: 'middle',
        horizontal: 'center',
      };
      ws.getCell('D' + xlx).border = {
        top: {style: 'thin', color: {argb: 'B6B6B6'}},
        left: {style: 'thin', color: {argb: 'B6B6B6'}},
        bottom: {style: 'thin', color: {argb: 'B6B6B6'}},
        right: {style: 'thin', color: {argb: 'B6B6B6'}},
      };

      ws.getCell('F' + xlx).font = {name: 'Valid Date', family: 4, size: 9, color: {argb: '595959'}};
      ws.getCell('F' + xlx).value = 'Valid Date';

      ws.getCell('G' + xlx).font = {name: 'Franklin Gothic Book', family: 4, size: 9};
      ws.getCell('G' + xlx).value = this.data_ExcelA[ 'passport_date' ];
      ws.getCell('G' + xlx).alignment = {
        vertical: 'middle',
        horizontal: 'center',
      };
      ws.getCell('G' + xlx).border = {
        top: {style: 'thin', color: {argb: 'B6B6B6'}},
        left: {style: 'thin', color: {argb: 'B6B6B6'}},
        bottom: {style: 'thin', color: {argb: 'B6B6B6'}},
        right: {style: 'thin', color: {argb: 'B6B6B6'}},
      };

      xlx = xlx + 1;
    }
    /* worksheet.mergeCells('B' + xlx + ':H' + xlx + '');
    ws.getCell('B' + xlx).font = { name: 'Franklin Gothic Book', family: 4, size: 9, color: { argb: '595959' } };
    ws.getCell('B' + xlx).value = 'Remark : ' + this.data_ExcelA['remark']; */

    //
    let rowRemake: number = this.TRAVEL_TYPE_OL.toLocaleLowerCase() != 'local' ? 2 : 1;
    xlx = xlx + rowRemake;
    worksheet.mergeCells('C' + xlx + ':H' + (xlx + 1) + '');
    ws.getCell('B' + xlx).font = {name: 'Franklin Gothic Book', family: 4, size: 9, color: {argb: '595959'}};
    //ws.getCell('B' + xlx).value = 'Important Note';
    ws.getCell('B' + xlx).value = 'Remark';

    let dataa = this.showfromid(this.allowance_main, this.emp_idS);
    dataa = dataa.filter((word) => word.emp_id == this.emp_idS);
    ws.getCell('C' + xlx).font = {name: 'Franklin Gothic Book', family: 4, size: 9};
    //ws.getCell('C' + xlx).value = this.data_ExcelA['important_note'];
    ws.getCell('C' + xlx).value = this.data_ExcelA[ 'remark' ];
    ws.getCell('C' + xlx).border = {
      top: {style: 'thin', color: {argb: 'B6B6B6'}},
      left: {style: 'thin', color: {argb: 'B6B6B6'}},
      bottom: {style: 'thin', color: {argb: 'B6B6B6'}},
      right: {style: 'thin', color: {argb: 'B6B6B6'}},
    };

    workbook.xlsx.writeBuffer().then((data: any) => {
      var FileX = new Blob([ data ], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
      //fs.saveAs(blob, 'Allowance Payment.xlsx');
      //this.swl.toastr_sucess("Download File");
      function blobToFile(theBlob, fileName) {
        //A Blob() is almost a File() - it's just missing the two properties below which we will add
        theBlob.lastModifiedDate = new Date();
        theBlob.name = fileName;
        return <File>theBlob;
      }

      var today = new Date();
      let docId = this.doc_id;
      let emp_id = this.emp_idS;
      var today_str = this.convert_dateDMY(today, 'ddMMyyyy hhmmss');
      // var file_name = `Allowance Payment ${today_str}`;
      var file_name = `ALW_${docId}_${emp_id}`;
      if (Action_param == 'download') {
        // fs.saveAs(FileX, file_name + '.xlsx');
        this.swl.toastr_sucess('Download File');
        this.appMain.isLoading = false;
      } else {
        var reader = new FileReader();
        reader.readAsDataURL(FileX);
        reader.onloadend = function () {
          var base64data = reader.result;
          //console.log(base64data);
        };

        const myFileX = new File([ FileX ], file_name + '.xlsx', {
          type: FileX.type,
        });
        this.onUpload(myFileX);
      }
    });
  }

  convert_dateDMY(str, format?) {
    var dt = new Date(str);

    var montF = new DatePipe('en-US');

    return montF.transform(dt, format);
  }

  onFileSelect(event, id) {
    //this.id_uploadFile = id;
    this.selectedFile = <File>event.target.files[ 0 ];
    console.log(this.selectedFile);
    this.onUpload(this.selectedFile);
  }

  selectedFile;
  onUpload(objectX) {
    this.appMain.isLoading = true;

    const onSuccess = (res) => {
      this.appMain.isLoading = false;
      console.log('after upload');
      console.log(res);
      this.path_file1 = res.img_list.fullname;
      //?? ส่งเมล function นี้
      this.report();

      //this.saveaction();
    };
    /* objectX.lastModified = 1623655352304;
    objectX.webkitRelativePath = ''; */
    console.log('before upload');
    console.log(this.doc_id + ' - ' + this.emp_idS);
    console.log(<File>objectX);
    this.postFileX(objectX, this.doc_id, 'allowance', this.emp_idS, 'auto_generate').subscribe(
      (res) => onSuccess(res),
      (error) => {
        this.appMain.isLoading = false;
        console.log(error);
        alert('error!');
      }
    );
  }

  postFileX(
    fileToUpload: File,
    file_doc: string,
    file_page: string,
    file_emp: string,
    file_typename: string
  ): Observable<any> {
    const endpoint = 'UploadFile';

    const fd = new FormData();
    fd.append('file', fileToUpload);
    fd.append('file_doc', file_doc);
    fd.append('file_page', file_page);
    fd.append('file_emp', file_emp);
    fd.append('file_typename', file_typename);
    return this.http.post<any>(this.ws.baseUrl + endpoint, fd);
  }

  OpenModal_Mail(template: TemplateRef<any>) {
    let config: object = {
      class: 'modal-md',
      animated: true,
      keyboard: false,
      ignoreBackdropClick: true,
    };
    this.modal_Ref_mail = this.modalService.show(template, config);

    this.set_modal();

    setTimeout(function () {
      $('.multiselect-dropdown .dropdown-btn').css({border: '1px solid #ced4da', padding: '9px 12px'});
    }, 100);

    console.log(this.modal_Ref_mail);
  }
  // for Search Emp
  //#region  for Search Emp
  loadEmpList() {
    let bodyX = {
      token_login: localStorage[ 'token' ],
      filter_value: '',
    };

    //this.appMain.isLoading = true;
    const onSuccess = (data) => {
      console.log('---load success---');
      // console.log(data);
      if (data.after_trip.opt1 == 'true') {
        this.masterEmp = data.emp_list;
        //this.appMain.isLoading = false;
        this.allEmp = this.masterEmp;
      } else {
        //this.appMain.isLoading = false;
        console.log('---load Error---');
        // console.log(data);
        this.swl.swal_error(data.after_trip.opt2.status);
      }
    };
    this.ws.callWs(bodyX, 'LoadEmployeeList').subscribe(
      (data) => onSuccess(data),
      (error) => {
        //this.appMain.isLoading = false
        console.log(error);
        //alert('Can\'t call web api.' + ' : ' + error.message);
      }
    );
  }

  //ถ้าไม่เลือกที่ autocomplete จะเข้า fn นี้
  add(event: MatChipInputEvent, type: string): void {
    debugger;
    const input = event.input;
    const value = event.value;
    // Add our fruit

    if ((value || '').trim()) {
      if (type == 'to') {
        this.MailList.push({
          // id: Math.random(),
          // email: value.trim()
          id: '0',
          emp_id: '',
          titlename: '',
          firstname: '',
          lastname: '',
          email: value.trim(),
          displayname: value.trim(),
          idicator: '',
        });
      } else {
        this.MailListCC.push({
          // id: Math.random(),
          // email: value.trim()
          id: '0',
          emp_id: '',
          titlename: '',
          firstname: '',
          lastname: '',
          email: value.trim(),
          displayname: value.trim(),
          idicator: '',
        });
      }
    } else {
      if (this.fCtrl.value != '' && this.fCtrl.value != null) {
        if (type == 'to') {
          this.MailList.push({
            // id: Math.random(),
            // email: value.trim()
            id: '0',
            emp_id: '',
            titlename: '',
            firstname: '',
            lastname: '',
            email: value.trim(),
            displayname: value.trim(),
            idicator: '',
          });
        } else {
          this.MailListCC.push({
            // id: Math.random(),
            // email: value.trim()
            id: '0',
            emp_id: '',
            titlename: '',
            firstname: '',
            lastname: '',
            email: value.trim(),
            displayname: value.trim(),
            idicator: '',
          });
        }
      }
    }
    // Reset the input value
    if (input) {
      input.value = '';
    }
    this.fCtrl.setValue(null);
    this.fCtrlCC.setValue(null);
  }

  remove(emp, indx, type: string): void {
    if (type == 'to') {
      this.MailList.splice(indx, 1);
    } else {
      this.MailListCC.splice(indx, 1);
    }
  }

  //ถ้าเลือกที่ autocomplete จะเข้า fn นี้
  selected(event: MatAutocompleteSelectedEvent, type: string): void {
    if (type == 'to') {
      console.log(event.option.value);
      this.MailList.push(event.option.value);
      this.fCtrl.setValue(null);
    } else {
      this.MailListCC.push(event.option.value);
      console.log(this.fCtrlCC);
      this.fCtrlCC.setValue(null);
    }
  }
  addOnBlurInput(event: FocusEvent | null, inputName: HTMLInputElement, type: string) {
    const target: HTMLElement | null = event ? (event.relatedTarget as HTMLElement) : null;
    // console.log(target, 'target');
    // console.log(!target || target.tagName !== 'MAT-OPTION');
    // if (!target || target.tagName !== 'MAT-OPTION') {
    //   const matChipEvent: MatChipInputEvent = {
    //     input: inputName,
    //     value: inputName.value,
    //   };
    //   this.add(matChipEvent, type);
    // }
  }
  private _filter(value: any): any[] {
    return this.allEmp.filter(
      (x) =>
        x.displayname.toLowerCase().includes(value) ||
        x.emp_id.toLowerCase().includes(value) ||
        x.idicator.toLowerCase().includes(value)
    );
  }

  doFilter(type: string) {
    if (this[ type ] != null && this[ type ] != '' && this[ type ].length > 2) {
      //console.log(this.inputText);
      //this.allEmp = this.masterEmp;
    } else {
      //this.allEmp = [];
    }
  }
  //#endregion for Search Emp

  // for Search Emp
  displayName(EmpList) {
    return EmpList.displayname;
  }

  CheckTypeSaved(): boolean {
    console.log('checkSave');
    // check จาก table main ว่ามีการ save ไหม
    // allowance_detail
    // emp_id
    // action_type
    // allowance_main
    if (this.arrX.allowance_main) {
      const isSaved = this.arrX.allowance_main.filter(
        ({emp_id, action_type}) => emp_id === this.emp_idS && action_type === 'insert'
      );
      const isSavedDetail = this.arrX.allowance_detail.filter(
        ({emp_id, action_type}) => emp_id === this.emp_idS && action_type === 'insert'
      );
      if (isSaved.length > 0 || isSavedDetail.length > 0) {
        return true;
      }
    }

    return false;
  }
  onClearEmail(maillist) {
    if (maillist) {
      maillist.forEach((item) => {
        item.action_change = 'false';
        item.mail_status = 'false';
      });
    }
  }
  async Config_Email_Send(i, input: {fInput: HTMLInputElement; fInputcc: HTMLInputElement}) {
    const typeSave = this.CheckTypeSaved();
    if (typeSave) {
      this.modal_Ref_mail.hide();
      this.excelclick = true;
      await this.saveactionSendMail();
    }
    //clear mail
    this.onClearEmail(this.mail_list);

    if (i == 1) {
      this.mall_remark = 'Action1';
    } else {
      this.mall_remark = 'Action2';
    }

    let ds = this;
    if (ds.fCtrl.value) {
      const inputTO = input.fInput;
      this.addOnBlurInput(null, inputTO, 'to');
      // console.log(input);znitinai.p@thaioilgroup.com
      console.log(inputTO);
    }

    if (ds.fCtrlCC.value) {
      console.log(ds.fCtrlCC);
      const inputCC = input.fInputcc;
      this.addOnBlurInput(null, inputCC, 'cc');
      // inputCC.blur();
      // console.log(input);
    }

    let bcheck_mailtoo = false;
    let bcheck_mailcc = false;
    if (ds.MailList.length > 0) {
      bcheck_mailtoo = true;
    }
    if (ds.MailListCC.length > 0) {
      bcheck_mailcc = true;
    }

    if (bcheck_mailtoo) {
      let STRMailCC = '';
      let STRMailEMPIDCC = [];
      let STRMailTO = '';
      let STRMailEMPIDTO = [];
      let emp_all = '';
      let status_Send = false;
      if (bcheck_mailtoo) {
        STRMailTO = ds.MailList.map((res) => res.email.toLowerCase()).join(';');
        STRMailTO = STRMailTO + ';';
        STRMailEMPIDTO = ds.MailList.map((res) => res.emp_id.toLowerCase());
        //STRMailEMPID = STRMailEMPID + ";";
      }
      if (bcheck_mailcc) {
        STRMailCC = ds.MailListCC.map((res) => res.email.toLowerCase()).join(';');
        STRMailCC = STRMailCC + ';';
        STRMailEMPIDCC = ds.MailListCC.map((res) => res.emp_id.toLowerCase());

        //  console.log(STRMailEMPIDCC)
        //  console.log(STRMailEMPIDTO)
      }
      var irow = this.mail_list.findIndex((m_val) => m_val.emp_id == this.emp_idS);
      if (irow > -1) {
        // var irow = 0;
        emp_all = STRMailEMPIDTO.concat(STRMailEMPIDCC).join(';');
        emp_all = emp_all + ';';
        this.mail_list[ irow ].emp_id = this.emp_idS;
        this.mail_list[ irow ].action_change = 'true';
        this.mail_list[ irow ].mail_status = 'true';
        this.mail_list[ irow ].mail_cc = STRMailCC;
        this.mail_list[ irow ].mail_to = STRMailTO;
        this.mail_list[ irow ].mail_emp_id = emp_all;
        status_Send = true;
      }

      this.modal_Ref_mail.hide();
      debugger;
      ds.MailListCC = [];
      ds.MailList = [];
      if (status_Send) {
        const a = await this.ExcelData();
        console.log(this.data_excel_view, 'ExcelData');
        this.exportX('send_email');
      }
      console.log(this.mail_list);
    } else {
      this.swl.swal_error('Not Have Email List');
    }
  }

  path_file1;
  path_file2;
  Send_Email() {
    this.TrackingStatus = {...InitTrackStatus};
    this.mail_list.forEach((e) => {
      //e.module = this.mall_remark;
      //e.mail_remark = this.mall_remark ;
      e.module = 'allowance';
    });

    console.log('this.path_file1  -  this.path_file2');
    console.log(this.path_file1);
    console.log(this.path_file2);

    this.appMain.isLoading = true;
    const onSuccess = (data) => {
      console.log('sendmail');
      console.log(data);

      if (data.after_trip.opt1 == 'true') {
        if (data.after_trip.opt2.status != 'Send E-mail successfully.') {
          data.after_trip.opt2.status = 'Send E-mail successfully.';
        }
        this.swl.swal_sucess(data.after_trip.opt2.status);
      } else {
        if (data.after_trip.opt2.status == null) {
          data.after_trip.opt2.status = 'Error';
        }
        this.swl.swal_error(data.after_trip.opt2.status);
      }

      this.appMain.isLoading = false;
      this.TrackingStatus = {...InitTrackStatus};
      setTimeout(() => {
        this.onloadX();
      });
    };

    delete this.arrX.m_empmail_list;
    var BodyX = this.arrX;
    var empid_x = this.emp_idS;
    var path1x = this.path_file1, //ไฟล์หน้า allowance
      path2x = this.path_file2; //ไฟล์ approve จาก phase 1
    if (BodyX) {
      BodyX.allowance_main.forEach((e) => {
        if (e.emp_id == empid_x) {
          e.file_travel_report = path2x;
          e.file_report = path1x;
        }
      });
      BodyX.emp_list.forEach((e) => {
        if (e.emp_id == empid_x) {
          e.mail_status = 'true';
        } else {
          e.mail_status = 'false';
        }
      });
      // const oldMailist = [...BodyX.mail_list];
      // BodyX.mail_list = oldMailist.filter(
      //   ({ action_change, mail_status }) => mail_status === 'true' && action_change === 'true'
      // );
    }
    console.log('Send mail To CC Add file');
    console.log(this.mail_list);
    console.log(BodyX);
    this.ws.callWs(BodyX, 'SendMailAllowance').subscribe(
      (data) => onSuccess(data),
      (error) => (this.appMain.isLoading = false),
      () => {
        //this.check_user();
        this.TrackingStatus = {...InitTrackStatus};
      }
    );
  }

  countx_row(arr, empid) {
    arr.filter((word) => word.emp_id == empid);
    var cr_return = false;
    if (arr.length <= 0) {
      cr_return = true;
    } else {
      cr_return = false;
    }

    return cr_return;
  }

  picRate(total, cur) {
    //var re_total = total*cur ;
    // console.log((parseFloat(total) * parseFloat(cur) || 0).toFixed(2));
    return (parseFloat(total) * parseFloat(cur) || 0).toFixed(2);
  }

  filter_location(id) {
    //debugger;
    var re;
    if (id == '' || id == null) {
      re = '';
    } else {
      //re = this.country_arr.filter(e => e.id == id);
      re = this.airticket_country_arr.filter((e) => e.id == id);
      re = re[ 0 ].city_name;
    }

    return re;
  }

  report_x() {
    this.appMain.isLoading = true;
    // body ให้ส่ง parameter ต่างๆที่แสดงด้านบนของ excel
    let body = {
      token_login: localStorage[ 'token' ],
      doc_id: this.doc_id,
    };

    // ข้อมูลในตารางรูปแบบ json
    let jsondata = [
      {
        data: 'row1',
        doc_id: this.doc_id,
      },
      {
        data: 'row2',
        doc_id: 'xxxx',
      },
    ];

    const onSuccess = (data) => {
      console.log('***Call Asmx***');
      console.log(data);
      // console.log(data.d);

      var parsed = $.parseJSON(data.d);
      console.log(parsed);
      console.log(parsed.dtResult);

      if (parsed.dtResult[ 0 ].status === 'true') {
        this.path_file2 = parsed.dtResult[ 0 ].file_outbound_path;
        console.log(parsed.dtResult[ 0 ].file_system_path);
        console.log(parsed.dtResult[ 0 ].file_outbound_path);
        console.log(parsed.dtResult[ 0 ].file_outbound_name);
        this.Send_Email();
        //this.ws.downloadFile(parsed.dtResult[0].file_outbound_path, parsed.dtResult[0].file_outbound_name);
        this.appMain.isLoading = false;
      } else {
        this.appMain.isLoading = false;
        this.swl.swal_error(parsed.dtResult[ 0 ].status);
      }
    };

    //data, function name(ฝั่ง asmx), method name(phase1report, allowance, reimbursement)
    this.ws.excel_report(body, JSON.stringify(jsondata), 'TravelReport', 'phase1report').subscribe(
      (data) => onSuccess(data),
      (error) => {
        this.appMain.isLoading = false;
        this.swl.swal_error(error);
        console.log(error);
        alert("Can't call web api." + ' : ' + error.message);
      }
    );
  }

  stateX;
  report() {
    debugger;
    this.stateX =
      this.doc_id.substr(0, 2).toUpperCase() === 'OB'
        ? 'oversea'
        : this.doc_id.substr(0, 2).toUpperCase() === 'OT'
          ? 'overseatraining'
          : this.doc_id.substr(0, 2).toUpperCase() === 'LB'
            ? 'local'
            : this.doc_id.substr(0, 2).toUpperCase() === 'LT'
              ? 'localtraining'
              : '';

    this.appMain.isLoading = true;
    // body ให้ส่ง parameter ต่างๆที่แสดงด้านบนของ excel
    let body = {
      token_login: localStorage[ 'token' ],
      doc_id: this.doc_id,
      state: this.stateX, // OB = oversea, OT = overseatraining, LB = local, LT = localtraining
    };

    // ข้อมูลในตารางรูปแบบ json
    let jsondata = [
      {
        data: 'row1',
        doc_id: this.doc_id,
      },
      {
        data: 'row2',
        doc_id: this.doc_id,
      },
    ];

    const onSuccess = (data) => {
      console.log('***Call Asmx***');
      console.log(data);
      // console.log(data.d);

      var parsed = $.parseJSON(data.d);
      console.log(parsed);
      console.log(parsed.dtResult);
      // Sendmail(data);
      // return;
      if (parsed.dtResult[ 0 ].status === 'true') {
        this.path_file2 = parsed.dtResult[ 0 ].file_outbound_path;
        console.log(parsed.dtResult[ 0 ].file_system_path);
        console.log(parsed.dtResult[ 0 ].file_outbound_path);
        console.log(parsed.dtResult[ 0 ].file_outbound_name);
        this.Send_Email();
        this.appMain.isLoading = false;
      } else {
        this.appMain.isLoading = false;
        this.swl.swal_error(parsed.dtResult[ 0 ].status);
      }
      console.log('***SEND MAIL END***');
    };
    console.log('***Call Asmx body***');
    console.log(body);

    //data, function name(ฝั่ง asmx), method name(phase1report, allowance, reimbursement)
    this.ws.excel_report(body, JSON.stringify(jsondata), 'TravelReport', 'phase1report').subscribe(
      (data) => onSuccess(data),
      (error) => {
        this.appMain.isLoading = false;
        this.swl.swal_error(error);
        console.log(error);
        alert("Can't call web api." + ' : ' + error.message);
      }
    );
  }

  modelref(arr) {
    return arr;
  }

  convertInt2old(Fidle: string, item?, id?, ev?: any) {
    try {
      ev = ev.toString();
    } catch (ex) { }
    var newvalue = ev.replace(/,/g, '');
    var x_num = Number(parseInt(newvalue)).toLocaleString('en-GB');
    if (x_num == 'NaN') {
      x_num = '0';
    }
    var recomma = x_num.replace(/,/g, '');
    var add_dot = newvalue.replace(recomma, '');

    if (Fidle == 'l') {
      this.allowance_detail.forEach((e) => {
        if (e.id == id) {
          e.allowance_low = newvalue + add_dot;
          e.action_change = 'true';
          e.values_L = x_num + add_dot;
        }
      });
    }

    if (Fidle == 'm') {
      this.allowance_detail.forEach((e) => {
        if (e.id == id) {
          e.allowance_mid = newvalue + add_dot;
          e.action_change = 'true';
          e.values_M = x_num + add_dot;
        }
      });
    }

    if (Fidle == 'h') {
      this.allowance_detail.forEach((e) => {
        if (e.id == id) {
          e.allowance_hight = newvalue + add_dot;
          e.action_change = 'true';
          e.values_H = x_num + add_dot;
        }
      });
    }

    return x_num + add_dot;
  }
  convertInt2(Fidle: string, item?, id?, ev?: any, input?: any) {
    try {
      ev = ev.toString();
    } catch (ex) { }
    var newvalue = ev.replace(/,/g, '');
    const disgit = /[.]\d+/
    const test = newvalue.toString().match(disgit);
    const dgis2: boolean = (test && test.length > 0 && (test[ 0 ].length - 1) > 2)
    const dgis1: boolean = (test && test.length > 0 && (test[ 0 ].length - 1) > 0)
    let x_num: string = "0";
    if (dgis2) {
      x_num = Number(newvalue || 0).toLocaleString('en-GB', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    }
    else {
      if (dgis1) {
        x_num = Number(newvalue || 0).toLocaleString('en-GB', {minimumFractionDigits: 2});
      }
      else {
        x_num = Number(newvalue || 0).toLocaleString('en-GB');
      }


    }
    if (input) {
      if (dgis2) {
        input.value = x_num;
      }
      else { }

    }
    if (x_num == 'NaN') {
      x_num = '0';
    }
    var recomma = x_num.replace(/,/g, '');
    var add_dot = newvalue.replace(recomma, '');

    if (Fidle == 'l') {
      this.allowance_detail.forEach((e) => {
        if (e.id == id) {
          e.allowance_low = recomma;
          e.action_change = 'true';
          e.values_L = x_num;
        }
      });
    }

    if (Fidle == 'm') {
      this.allowance_detail.forEach((e) => {
        if (e.id == id) {
          e.allowance_mid = recomma;
          e.action_change = 'true';
          e.values_M = x_num;
        }
      });
    }

    if (Fidle == 'h') {
      this.allowance_detail.forEach((e) => {
        if (e.id == id) {
          e.allowance_hight = recomma;
          e.action_change = 'true';
          e.values_H = x_num;
        }
      });
    }

    return x_num;
  }


  onlyNumberKey(evt) {

    console.log(evt);
    const {value} = evt.srcElement;
    console.log(value);
    this.before_ChangUser = true;
    let Regexdot: RegExp = /(\.)/g;
    let testdot = Regexdot.test(evt.key);
    let RegexValue: RegExp = /((\d*\.)(\d*$))/g;
    let testRegexValue = RegexValue.test(value);
    let checklastdot = testRegexValue && evt.key === '.';
    let disgit3 = /[.]\d+/
    let disgit3Format = value.match(disgit3)
    // if (disgit3Format && disgit3Format.length > 0 && disgit3Format[ 0 ].length - 1 === 4) return false;
    // if (disgit3Format && disgit3Format.length > 0 && disgit3Format[ 0 ].length - 1 > 4) return false;
    if (checklastdot) return false;
    if (!value && testdot) {
      return false;
    }
    let Regex: RegExp = /\d|(\.)/g;
    let test = Regex.test(evt.key);
    if (test) {
      return true;
    }

    return false;
    // Only ASCII character in that range allowed
    var ASCIICode = evt.which ? evt.which : evt.keyCode;
    this.before_ChangUser = true;
    if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57)) {
      return false;
    } else {
      return ASCIICode;
    }

    //return ASCIICode;
  }
}

function datediff(end, str) {
  const dateOne = new Date(str); // 20th April 2021
  const dateTwo = new Date(end); // 28th April 2021
  return Math.abs(dateOne.getDate() - dateTwo.getDate()); // 8
}
