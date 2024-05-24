import {map} from 'rxjs/operators';
import {startWith} from 'rxjs/operators';
import { AlertServiceService } from '../../../services/AlertService/alert-service.service';
import {Component, forwardRef, Inject, OnInit, TemplateRef, ViewChild, ElementRef} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { AppComponent } from '../../../app.component';
import { FileuploadserviceService } from '../../../ws/fileuploadservice/fileuploadservice.service';
import { AspxserviceService } from '../../../ws/httpx/aspxservice.service';
import { MasterComponent } from '../master.component';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {DatePipe} from '@angular/common';
// import * as fs from 'file-saver';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {COMMA, ENTER, SEMICOLON} from '@angular/cdk/keycodes';
import {Observable} from 'rxjs';
import {FormControl} from '@angular/forms';
import { InitTrackStatus, TrackingStatus, TrackingStatusNumber } from '../../../model/localstorage.model';
import { getBoolean, useAuth } from '../../../function/globalfunction.component';

declare var $: any;
@Component({
  selector: 'app-travelinsurance',
  templateUrl: './travelinsurance.component.html',
  styleUrls: [ './travelinsurance.component.css' ],
})
export class TravelinsuranceComponent implements OnInit {
  // for Search Emp
  @ViewChild('fInput', {static: true}) fInputx?: ElementRef;
  // for Search Emp
  @ViewChild('cardTag', {static: true}) cardTag?: ElementRef;
  @ViewChild('clickMe', {static: true}) clickMe?: ElementRef;
  @ViewChild('clickMe2', {static: true}) clickMe2?: ElementRef;

  detail: boolean = false;
  edit_input: boolean = true;
  pdpa_wording: string = '';
  status = false;
  show_button = true;
  empid = '';
  emp_list = [];
  arrX: any[] = [];
  empname = '';
  name_user = '';
  namex = '';
  travelInsurance_detail: any = [];
  travel : any;
  business_date :any = new Date();
  travel_date :any = new Date();
  country_city : any;
  img_list = [{}];
  img_list_cert = [];
  selectedFile: File = null!;
  doc_id = '';
  doc_idX = '';
  pagename : any;
  emp_id : any;
  varx = [];
  money_total = 579200;
  id_uploadFile = '';
  mall_remark : any;
  btnSendMail = false;
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
  mail_list = [];
  emplist = [];
  ms_plan = [];
  text_company =
    'Thai Oil Public Company Limited Branch 00001 Address: 42/1 Moo 1, Sukhumvit Road Km 124, Tungsukla,Sriracha, Cholburi 20230 Tax ID No.010-7547000-711';
  Email_sendX = [ {}];
  email_send : any;
  mail_curent = '';
  brokerDt = [];
  raw_dataX : any;
  Name_SetAll : any;
  tp_clone?: TemplateRef<any>;
  modalRef?: BsModalRef;
  before_ChangUser = false;
  panel2 = {
    show: true,
    after: false,
  };
  panel: any;
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
  masterEmp?: any[];
  MailListCC: any = [];

  inputText = '';
  inputTextCC = '';
  // for Search Emp
  pathPhase1: any;
  userDetail: any;
  TrackingStatus: TrackingStatus = {...InitTrackStatus};
  profile: unknown;
  constructor(
    @Inject(forwardRef(() => MasterComponent)) private appMain: MasterComponent,
    private modalService: BsModalService,
    private http: HttpClient,
    private ws: AspxserviceService,
    private x: AppComponent,
    private fileuploadservice: FileuploadserviceService,
    private swl: AlertServiceService
  ) {
    // for Search Emp
    this.filteredEmp = this.fCtrl.valueChanges.pipe(
      startWith(null),
      map((x: string | null) => (x ? x.toLowerCase() : x)),
      map((x: string | null) => (x ? this._filter(x) : this.allEmp.slice()))
    );

    this.filteredEmpCC = this.fCtrlCC.valueChanges.pipe(
      startWith(null),
      map((x: string | null) => (this.CheckData(x) ? this._filter(x?.toString().toLowerCase()) : []))
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

  ngOnInit() {
    console.clear();
    this.doc_idX = this.appMain.DOC_ID;
    localStorage.setItem('token_login', 'a731ced9-fbฟ');
    this.doc_id = this.appMain.DOC_ID;

    this.loadEmpList();
    this.load_broker();
    this.OnloadDoc();
    this.onloadX();
  }
  async CheckLogin() {
    return new Promise((resolve, reject) => {
      var BodyX = {
        token_login: localStorage[ 'token' ],
      };
      const onSuccess = (data : any) => {
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
  hide_modal(btn_cancle : any, update : any) {
    if (btn_cancle == 'Accept') {
      this.modalRef?.hide();
      // (click)="ConfrimSave()"
      // this.ConfrimSave();
      this.Save_Change();
    }
  }
  async OnloadDoc() {
    this.profile = await this.CheckLogin();
    // this.appMain.isLoading = true;
    var BodyX = {
      token_login: localStorage[ 'token' ],
      doc_id: this.doc_id,
    };

    const onSuccess = (data : any) => {
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
    return this.emplist.filter((item : any) => item.emp_id === this.empid);
  }
  get docStatus() {
    return (Status: number) => {
      // return this.TrackingStatus[Status];
      let emp_id = this.empid;
      // console.log(emp_id);
      // return this.TrackingStatus[Status];
      let id: TrackingStatusNumber = 1;
      if (this.emplist.length > 0) {
        // TEST
        // this.emplist.forEach((i) => (i.doc_status_id = '2'));
        let dt : any = this.emplist.find((item : any) => item.emp_id === emp_id);
        if (dt) {
          // alert(1);
          id = Number(dt.doc_status_id);
          if (Status === id) {
            this.TrackingStatus[ Status ] = true;
          }
        }
      }
      // console.log(this.TrackingStatus);
      // return this.TrackingStatus[ Status ];
    };
  }
  OpenDocument(doc_id : any, part : any) {
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
  clickMeXXX() {
    //this.clickMe.nativeElement.click();
    //this.clickMe2.nativeElement.click();
    $('#clickMe').trigger('click');
    $('#clickMe2').trigger('click');
  }

  load_broker() {
    var bodyX = {
      token_login: 'b8a27da5-c587-405d-8a45-20e39c98e5ce',
      page_name: 'broker',
      module_name: 'master insurance broker',
    };

    const onSuccess = (data : any): void => {
      this.brokerDt = data.master_insurancebroker.filter((word : any) => word.status == '1');
    };

    this.ws.callWs(bodyX, 'LoadMasterData').subscribe(
      (data) => onSuccess(data),
      (error) => {
        console.log(error);
      }
    );
  }

  Cal_Gran_Total(Total : any, Rate : any) {
    try {
      var newvalue = Total.replace(/,/g, '');
      var XRate = parseFloat(Rate);
      var XTotal = parseInt(newvalue);
      console.log(XRate * XTotal);
    } catch (ex) {
      return 0;
    }
    return this.convertInt('', '', (XRate * XTotal).toString());
  }

  convertInt(Fidle: string, item? : any, ev?: any) {
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
    /* if (Fidle == "certificates_total") {
      item.certificates_total = this.Cal_Gran_Total(item.total, item.exchange_rate);
      item.moneysecon = newvalue ;
    } */

    return x_num + add_dot;
  }

  convertInt2(Fidle: string, item? : any, ev?: any, id? : any) {
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
    this.travelInsurance_detail.forEach((e : any) => {
      if (e.id == id) {
        e.certificates_total = x_num + add_dot;
        e.action_change = 'true';
      }
    });
    /* if (Fidle == "certificates_total") {
      item.certificates_total = this.Cal_Gran_Total(item.total, item.exchange_rate);
      item.moneysecon = newvalue ;
    } */

    return x_num + add_dot;
  }

  TotalbathChang(v_out : any, id: any, index : any) {
    // this.travelInsurance_detail[ index ].certificates_total = v_out;

    this.model_action_change(id);

    var v_in;
    v_in = parseInt(v_out);
    if (v_out == '') {
      v_in = 0;
    }

    return v_in.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  map_emp() {
    this.img_list.forEach((e : any) => {
      this.travelInsurance_detail.forEach((x : any) => {
        if (e.emp_id == x.emp_id) {
          x.ins_emp_name = e.userDisplay;
          x.ins_emp_org = e.division;
          x.ins_emp_passport = e.passportno;
          //x.ins_emp_occupation = e.userDisplay ;
          x.ins_emp_age = e.age;
        }
      });
    });
  }
  wordingPDPA(value: any) {
    this.pdpa_wording = value.pdpa_wording ? value.pdpa_wording : this.pdpa_wording;
  }
  onloadX() {
    this.appMain.isLoading = true;

    var bodyX = {
      token_login: localStorage[ 'token' ],
      //doc_id: 'OB20100008',
      doc_id: this.doc_id,
    };
    console.log('bodyX');
    console.log(bodyX);

    const onSuccess = (data : any): void => {
      //this.status = false;
      console.log('first_load');
      console.log('this.brokerDt', this.brokerDt);
      let dtborker: any = {};
      if (this.brokerDt.length > 0) {
        dtborker = this.brokerDt.reduce((acc : any, cur : any) => {
          acc = {...acc, [ cur.id ]: cur.name};
          return acc;
        }, {});
      }
      console.log(data, dtborker);
      this.arrX = data;
      this.status = data.user_admin;
      this.status = true;
      data.data_type = 'save';
      this.name_user = data.user_display;
      this.emp_list = data.emp_list;
      this.empid = data.emp_list[ 0 ].emp_id;
      (this.namex = data.user_display),
        (this.travel = data.travel_topic),
        (this.business_date = data.business_date),
        (this.travel_date = data.travel_date),
        (this.country_city = data.country_city);
      this.emplist = data.emp_list;
      this.mail_list = data.mail_list;
      this.img_list = data.img_list;
      this.ms_plan = data.m_insurance_plan;
      this.travelInsurance_detail = data.travelInsurance_detail;
      this.img_list_cert = data.img_list_cert;
      const xax = data.travelInsurance_detail;

      this.varx = xax;
      this.Name_SetAll = data.emp_list[ 0 ].userDisplay;
      var panelArr : any = [];
      let scope = this;
      this.travelInsurance_detail.forEach(function (e : any) {
        if (typeof e === 'object') {
          if (e.certificates_total != '') {
            e.certificates_total = e.certificates_total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          }

          function formatDate(date : any) {
            var d = new Date(date),
              month = '' + (d.getMonth() + 1),
              day = '' + (d.getDate() + 1),
              year = d.getFullYear();

            if (month.length < 2) month = '0' + month;
            if (day.length < 2) day = '0' + day;

            return [ year, month, day ].join('-');
          }
          var xdate1 = formatDate(e.period_ins_from).toString();
          var xdate2 = formatDate(e.period_ins_to).toString();
          var xdate3 = formatDate(e.destination).toString();
          var montF = new DatePipe('en-US');
          try {
            var dx1 = montF.transform(xdate1, 'dd MMM y');
          } catch (err) {
            var dx1 : string | null = '';
          }

          try {
            var dx2 = montF.transform(xdate2, 'dd MMM y');
          } catch (err) {
            var dx2  : string | null = '';
          }

          try {
            var dx3 = montF.transform(xdate3, 'dd MMM y');
          } catch (err) {
            var dx3 : string | null = '';
          }

          if (e.ins_plan == '') {
            e.ins_plan = '1';
          }

          e[ 'submit_active' ] = '';
          e[ 'Datefrom' ] = dx1;
          e[ 'Dateto' ] = dx2;
          e[ 'Datedes' ] = dx3;
          //e["DatePlus"] = dateString[0] + "-" + dateString[1] + "-" + dateString[2] ;
          //e["DatePlus"] = e.allowance_date ;
          //e["DatePlus"] = this.check_date(e.allowance_date);
          e[ 'panelx' ] = true;
          if (scope.brokerDt.length > 0 && typeof dtborker === 'object') {
            try {
              dtborker[ e.ins_broker ] === undefined && (e.ins_broker = '');
            } catch (ex) {
              e.ins_broker = '';
            }
          }
          panelArr.push({
            show: true,
          });
        }
      });

      this.panel = panelArr;
      console.log('// this.panel //');
      console.log(this.panel);
      this.doc_id = data.emp_list[ 0 ].doc_id;
      this.pagename = 'travelinsurance';
      this.empid = data.emp_list[ 0 ].emp_id;

      if (data.user_admin === false) {
        this.status = false;
        //@ts-ignore
        // const { profile } = this.appMain.appHeader;
        // console.log(profile);
        // this.emp_id = profile.emp_id;
        // this.namex = profile.username;
        const {profile} = {profile: this.profile[ 0 ]};
        console.log('Getprofile');
        console.log(profile);
        this.empid = profile.empId;
        this.namex = profile.empName;

        let finduser = data.emp_list.find(({emp_id} : any) => emp_id === this.empid);
        if (finduser) {
          this.Name_SetAll = finduser.userDisplay;
          this.namex = finduser.userDisplay;
        }
        finduser && (this.show_button = getBoolean(finduser.status_trip_cancelled) ? false : true);
        !finduser && (this.show_button = false);
        //?? เช็คว่าเป็น requesterรึป่าว
        //todo finduser ถ้าไม่มีใน  emplist = undefined
        if (!finduser && 'user_request' in data && data.user_request === true) {
          let userSelected = this.appMain.userSelected;
          this.show_button = false;
          this.status = true;
          if (userSelected) {
            this.empid = this.appMain.userSelected;
          } else {
            this.empid = data.emp_list[ 0 ].emp_id;
            this.appMain.userSelected = data.emp_list[ 0 ].emp_id;
          }
        }
      } else {
        let userSelect = this.appMain.userSelected;
        const {emp_id, userSelected, status_trip_cancelled} : any = useAuth(data, userSelect);
        const {userDisplay = null} = data.emp_list.find(({emp_id: emp_idx} : any) => emp_idx === emp_id);
        if (userDisplay) {
          this.Name_SetAll = userDisplay;
        }
        this.empid = emp_id;
        this.appMain.userSelected = userSelected;
        this.show_button = getBoolean(status_trip_cancelled) ? false : true;
        this.status = true;
      }
      this.userDetail = this.UserDetail[ 0 ];
      console.log(this.travelInsurance_detail);
      this.appMain.isLoading = false;
      this.wordingPDPA(data);
    };

    this.ws.callWs(bodyX, 'LoadTravelInsurance').subscribe(
      (data) => onSuccess(data),
      (error) => {
        console.log(error);
      }
    );
  }

  ChangAllname(id : any, emp_id : any, name : any) {
    this.travelInsurance_detail.forEach(function (e : any) {
      if (e.emp_id == emp_id) {
        e.ins_emp_name = name;
        e.action_change = 'true';
      }
    });

    console.log(this.travelInsurance_detail);
  }

  loadnewdaa() {
    /* let bodyX =
    {
      "token_login": "b7a307a9-5d02-4553-b5d2-63c297cb3bcc0",
      "doc_id": "OB20100008",
    } */

    var bodyX = {
      token_login: localStorage[ 'token' ],
      doc_id: this.doc_id,
    };

    const onSuccess = (data : any): void => {
      this.travelInsurance_detail = data.travelInsurance_detail;
      this.travelInsurance_detail.forEach(function (e : any) {
        if (typeof e === 'object') {
          if (e.certificates_total != '') {
            e.certificates_total = e.certificates_total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          }

          function formatDate(date : any) {
            var d = new Date(date),
              month = '' + (d.getMonth() + 1),
              day = '' + (d.getDate() + 1),
              year = d.getFullYear();

            if (month.length < 2) month = '0' + month;
            if (day.length < 2) day = '0' + day;

            return [ year, month, day ].join('-');
          }
          var xdate1 = formatDate(e.period_ins_from).toString();
          var xdate2 = formatDate(e.period_ins_to).toString();
          var xdate3 = formatDate(e.destination).toString();
          var montF = new DatePipe('en-US');
          try {
            var dx1 = montF.transform(xdate1, 'dd MMM y');
          } catch (err) {
            var dx1 : string | null = '';
          }

          try {
            var dx2 = montF.transform(xdate2, 'dd MMM y');
          } catch (err) {
            var dx2 : string | null = '';
          }

          try {
            var dx3 = montF.transform(xdate3, 'dd MMM y');
          } catch (err) {
            var dx3 : string | null = '';
          }

          e[ 'Datefrom' ] = dx1;
          e[ 'Dateto' ] = dx2;
          e[ 'Datedes' ] = dx3;
          e[ 'ChoneName' ] = e.ins_emp_name;
          //e["DatePlus"] = dateString[0] + "-" + dateString[1] + "-" + dateString[2] ;
          //e["DatePlus"] = e.allowance_date ;
          //e["DatePlus"] = this.check_date(e.allowance_date);
        }
      });
    };

    this.ws.callWs(bodyX, 'LoadTravelInsurance').subscribe(
      (data) => onSuccess(data),
      (error) => {
        console.log(error);
      }
    );
  }

  data_retune(emp_id : any) {
    var datrf = this.travelInsurance_detail.filter((word : any) => word.emp_id == emp_id);
    var re = datrf.filter((word : any) => word.action_type != 'delete');
    var NewDataSort = re.sort(function (a : any, b : any) {
      return parseInt(b.sort_by) - parseInt(a.sort_by);
    });
    // console.log(NewDataSort);
    // return re;
    var idMax = parseInt(this.getMax(re, 'id').id);
    //console.log('NewDataSort ------');
    //console.log(NewDataSort);

    //return NewDataSort[0].id;
    return '' + idMax + '';
    //NewDataSort[0].id ;
  }

  data_retune_length(id : any, emp_id : any) {
    var datrf = this.travelInsurance_detail.filter((word : any) => word.emp_id == emp_id);
    var re = datrf.filter((word : any) => word.action_type != 'delete');
    var DataSet = this.travelInsurance_detail.filter((word : any) => word.id == id);
    console.log(re.length);

    if (re.length > 1) {
      this.swl.swal_confirm_delete('').then((val) => {
        if (val.isConfirmed == true) {
          this.travelInsurance_detail.forEach((e : any) => {
            if (e.id == id) {
              e.action_type = 'delete';
              e.action_change = 'true';
            }
          });

          this.img_list.forEach((e : any) => {
            if (e.id_level_1 == id) {
              e.action_type = 'delete';
              e.action_change = 'true';
            }
          });

          this.swl.toastr_warning('Delete');
        } else {
        }
      });
    } else {
      this.swl.swal_confirm_delete('').then((val) => {
        if (val.isConfirmed == true) {
          this.travelInsurance_detail.forEach((e : any) => {
            if (e.id == id) {
              // (e.ins_emp_id = DataSet[ 0 ].ins_emp_id),
                // (e.ins_emp_name = DataSet[ 0 ].ins_emp_name),
                // (e.ins_emp_org = DataSet[ 0 ].ins_emp_org),
                // (e.ins_emp_passport = DataSet[ 0 ].ins_emp_passport),
                // (e.ins_emp_occupation = DataSet[ 0 ].ins_emp_occupation),
                (e.ins_emp_address = ''),
                // (e.ins_emp_age = DataSet[ 0 ].ins_emp_age),
                (e.ins_emp_tel = ''),
                (e.ins_emp_fax = ''),
                (e.ins_plan = ''),
                (e.ins_broker = ''),
                (e.name_beneficiary = ''),
                (e.relationship = ''),
                (e.period_ins_dest = ''),
                (e.period_ins_from = ''),
                (e.period_ins_to = ''),
                (e.destination = ''),
                (e.date_expire = ''),
                (e.duration = ''),
                (e.billing_charge = ''),
                (e.certificates_no = ''),
                (e.certificates_total = ''),
                (e.remark = ''),
                (e.agent_type = 'false'),
                (e.broker_type = 'true'),
                (e.travel_agent_type = 'false'),
                (e.insurance_company = ''),
                (e.action_change = 'true');
            }
          });

          this.img_list.forEach((e) => {
            // if (e.id_level_1 == id) {
            //   e.action_type = 'delete';
            //   e.action_change = 'true';
            // }
          });

          this.swl.toastr_warning('Delete');
        } else {
          return;
        }
      });
      //rs = false ;
    }

    return;
  }

  Save_Change_all(emp_id : any) {
    this.travelInsurance_detail.forEach((e : any) => {
      if (e.emp_id == emp_id) {
        // e.action_change = true;
      }
    });

    this.submitClick();
  }

  addrow(emp_id : any) {
    console.log(this.travelInsurance_detail);

    var idMax = parseInt(this.getMax(this.travelInsurance_detail, 'id').id);
    var sort_byMax = parseInt(this.getMax(this.travelInsurance_detail, 'sort_by').sort_by);

    //console.log(idMax);

    debugger;
    var DataSet = this.travelInsurance_detail.filter((word : any) => word.emp_id == emp_id);

    this.travelInsurance_detail.forEach((e : any) => {
      e.panelx = false;
    });
    this.travelInsurance_detail.push({
      doc_id: this.doc_id,
      emp_id: emp_id,
      id: '' + (idMax + 1) + '',
      sort_by: '' + (sort_byMax + 1) + '',
      // ins_emp_id: DataSet[ 0 ].ins_emp_id,
      // ins_emp_name: DataSet[ 0 ].ins_emp_name,
      // ins_emp_org: DataSet[ 0 ].ins_emp_org,
      // ins_emp_passport: DataSet[ 0 ].ins_emp_passport,
      // ins_emp_occupation: DataSet[ 0 ].ins_emp_occupation,
      // ins_emp_address: DataSet[ 0 ].ins_emp_address,
      // ins_emp_age: DataSet[ 0 ].ins_emp_age,
      // ins_emp_tel: DataSet[ 0 ].ins_emp_tel,
      // ins_emp_fax: DataSet[ 0 ].ins_emp_fax,
      // ins_plan: DataSet[ 0 ].ins_plan,
      // ins_broker: DataSet[ 0 ].ins_broker,
      // name_beneficiary: DataSet[ 0 ].name_beneficiary,
      // relationship: DataSet[ 0 ].relationship,
      // period_ins_dest: DataSet[ 0 ].period_ins_dest,
      // period_ins_from: DataSet[ 0 ].period_ins_from,
      // Datefrom: DataSet[ 0 ].Datefrom,
      // Dateto: DataSet[ 0 ].Dateto,
      // period_ins_to: DataSet[ 0 ].period_ins_to,
      // destination: DataSet[ 0 ].destination,
      // date_expire: DataSet[ 0 ].date_expire,
      // duration: DataSet[ 0 ].duration,
      // billing_charge: DataSet[ 0 ].billing_charge,
      // certificates_no: DataSet[ 0 ].certificates_no,
      // certificates_total: DataSet[ 0 ].certificates_total,
      // remark: DataSet[ 0 ].remark,
      submit_active: 'false',
      agent_type: 'false',
      broker_type: 'true',
      travel_agent_type: 'false',
      // insurance_company: DataSet[ 0 ].insurance_company,
      action_type: 'insert',
      action_change: 'true',
      panelx: true,
    });

    this.XorderBy();
    console.log('Addrow -------------');
    console.log(this.travelInsurance_detail);
    this.swl.toastr_success('Add Insurance Plan');
    this.scalltag(DataSet.length);
    //console.log(this.travelInsurance_detail);
    // this.data_retune(emp_id);
  }

  changPlan(id : any) {
    debugger;
    this.travelInsurance_detail.forEach((e : any) => {
      if (e.id == id) {
        if (e.panelx == false) {
          e.panelx = false;
        } else {
          e.panelx = false;
        }
      }
    });
  }

  XorderBy() {
    //return this.visa_detail ;
    var NewDataSort = this.travelInsurance_detail.sort(function (a : any, b : any) {
      return parseInt(a.sort_by) - parseInt(b.sort_by);
    });
    //var NewDataSort = datax.sort(function (a, b) { return parseInt(a.id) - parseInt(b.id) });
    //console.log(NewDataSort);
    var empidX = this.empid;
    var NewDatafilter = this.travelInsurance_detail.filter((word : any) => word.emp_id == empidX);
    /* NewDatafilter.forEach(e => {
      e.panelx = false;
    })  */
    return NewDatafilter;
  }

  //index_page = 1;
  function_num_page() {
    var NewDataSort = this.travelInsurance_detail.sort(function (a : any, b : any) {
      return parseInt(a.sort_by) - parseInt(b.sort_by);
    });
    //var NewDataSort = datax.sort(function (a, b) { return parseInt(a.id) - parseInt(b.id) });
    //console.log(NewDataSort);
    var empidX = this.empid;
    var NewDatafilter = this.travelInsurance_detail.filter((word : any) => word.emp_id == empidX);
    return NewDataSort;
  }

  getMax(arr : any, prop : any) {
    var max;
    for (var i = 0; i < arr.length; i++) {
      if (max == null || parseInt(arr[ i ][ prop ]) > parseInt(max[ prop ])) max = arr[ i ];
    }
    //if ( max == "") { max = 0;}
    return max;
  }

  deleterow(id : any, emp_id : any) {
    console.log(this.arrX);

    /* this.AsubmitClick()  */
    this.data_retune_length(id, emp_id);
  }

  AsubmitClick() {
    console.log(this.arrX);

    /*     const onSuccess = (data): void => {
          console.log(data);
          this.Swalalert('Update data successfully.', 'success');
        }
    
        this.ws.callWs(this.arrX, 'SaveTravelInsurance').subscribe(data => onSuccess(data), error => {
          this.appMain.isLoading = false
          console.log(error);
        }) */
  }

  parseDate(str : any) {
    var mdy = str.split('-');
    return new Date(mdy[ 2 ], mdy[ 0 ] - 1, mdy[ 1 ]);
  }

  datediff(first : any, second : any) {
    // Take the difference between the dates and divide by milliseconds per day.
    // Round to nearest whole number to deal with DST.
    //alert(datediff(parseDate(first.value), parseDate(second.value)));
    return Math.round((second - first) / (1000 * 60 * 60 * 24));
  }

  formatDate(date : any) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + (d.getDate() + 1),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [ month, day, year ].join('-');
  }
  convert_dateYMD(val : any) {
    var montF = new DatePipe('en-US');
    var objdate = montF.transform(val, 'yyyy-MM-dd');
    return objdate;
  }

  duration(values1 : any, values2 : any, index : any) {
    var date1 = this.formatDate(values1);
    var date2 = this.formatDate(values2);

   

    var day_total = this.datediff(this.parseDate(date1), this.parseDate(date2));
    console.log(day_total)
    var numz;
    if (isNaN(day_total)) {
      numz = '';
    } else {
      numz = day_total + 1;
    }

    // this.travelInsurance_detail[ index ].duration = numz;
    // this.travelInsurance_detail[ index ].action_change = 'true';
    //console.log(day_total)

    if (isNaN(day_total)) {
      return '';
    } else {
      return day_total + 1;
    }
  }

  update_userByDOC() {
    var empxid = this.empid.toString();
    var ide;
    var show_button, nameZ;
    let status_trip_cancelled = false;

    // this.arrX[ 'emp_list' ].forEach(function (e) {
    //   if (e.emp_id == empxid) {
    //     show_button = e.show_button;
    //     nameZ = e.userDisplay;
    //     if (e.status_trip_cancelled === 'true') {
    //       status_trip_cancelled = true;
    //     }
    //   }

    //   if (e.emp_id == empxid) {
    //     ide = e.id;
    //     e.mail_status = 'true';
    //   } else {
    //     e.mail_status = 'false';
    //   }
    // });

    this.Name_SetAll = nameZ;
    //show_button = false;
    if (status_trip_cancelled) {
      this.show_button = false;
    }
    if (this.before_ChangUser) {
      this.swl.swal_confirm_changes('Do you want to save the document ?').then((val) => {
        if (val.isConfirmed) {
          //this.Save_Change(ide);
          this.submitClick();
        } else {
        }
      });
    }
    this.before_ChangUser = false;
    this.appMain.userSelected = this.empid;
    this.userDetail = this.UserDetail[ 0 ];
    this.TrackingStatus = {...InitTrackStatus};
  }

  Edit_function() {
    this.detail = false;
    this.edit_input = true;
  }

  Save_Change() {
    var id = '';
    this.btnSendMail = false;
    // this.model_action_change(id);

    console.log('save -------------');
    console.log(this.travelInsurance_detail);
    console.log(this.arrX);
    //this.travelInsurance_detail[i].action_change = "true";
    // this.arrX[ 'data_type' ] = 'save';
    this.submitClick();
  }

  Cancel_edit() {
    this.detail = true;
    this.edit_input = false;
  }

  async Cancel_editClick() {
    const actioncancel = await this.swl.swal_confirm_changes('Do you want to cancel the document ?');
    if (actioncancel.isConfirmed) {
      this.appMain.isLoading = true;
      var bodyX = {
        token_login: localStorage[ 'token' ],
        //doc_id: 'OB20100008',
        doc_id: this.doc_id,
      };
      console.log('bodyX cancel');
      console.log(bodyX);

      const onSuccess = (data : any): void => {
        //this.status = false;
        console.log('cancel_load');
        console.log(data);
        data.data_type = 'save';
        this.arrX = data;
        this.travelInsurance_detail = data.travelInsurance_detail;

        this.travelInsurance_detail.forEach(function (e : any) {
          if (typeof e === 'object') {
            if (e.certificates_total != '') {
              e.certificates_total = e.certificates_total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            }

            function formatDate(date : any) {
              var d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + (d.getDate() + 1),
                year = d.getFullYear();

              if (month.length < 2) month = '0' + month;
              if (day.length < 2) day = '0' + day;

              return [ year, month, day ].join('-');
            }
            var xdate1 = formatDate(e.period_ins_from).toString();
            var xdate2 = formatDate(e.period_ins_to).toString();
            var xdate3 = formatDate(e.destination).toString();
            var montF = new DatePipe('en-US');
            try {
              var dx1 = montF.transform(xdate1, 'dd MMM y');
            } catch (err) {
              var dx1 : string | null = '';
            }

            try {
              var dx2 = montF.transform(xdate2, 'dd MMM y');
            } catch (err) {
              var dx2 : string | null = '';
            }

            try {
              var dx3 = montF.transform(xdate3, 'dd MMM y');
            } catch (err) {
              var dx3 : string | null = '';
            }

            e[ 'submit_active' ] = '';
            e[ 'Datefrom' ] = dx1;
            e[ 'Dateto' ] = dx2;
            e[ 'Datedes' ] = dx3;
            e[ 'panelx' ] = true;
          }
        });
        this.swl.swal_success('Successfully canceled');
        this.appMain.isLoading = false;
      };

      this.ws.callWs(bodyX, 'LoadTravelInsurance').subscribe(
        (data) => onSuccess(data),
        (error) => {
          this.appMain.isLoading = false;
          console.log(error);
        }
      );
      this.detail = true;
      this.edit_input = false;
    } else {
      return;
    }
  }

  deletefile(index : any, id : any) {
    // this.img_list[ index ].action_type = 'delete';
    // this.img_list[ index ].action_change = 'true';
    //this.img_list.splice(id, 1)
  }

  onFileSelect2(event : any) {
    //event.target.files[0].name = "gxy1111.jpg"
    this.selectedFile = <File>event.target.files[ 0 ];
    console.log(event);
    console.log(this.selectedFile);
    //this.selectedFile[0]['name'] =

    console.log(this.selectedFile);
    //this.onUpload2();
  }

  onUpload2() {
    this.appMain.isLoading = true;
    const onSuccess = (res : any) => {
      this.appMain.isLoading = false;
      console.log(res);
    };
    this.fileuploadservice
      .postFilePhase2(this.selectedFile, this.doc_id, this.pagename, this.empid.toString(), localStorage[ 'token' ])
      .subscribe(
        (res) => onSuccess(res),
        (error) => {
          this.appMain.isLoading = false;
          console.log(error);
          alert('error!');
        }
      );
  }

  downloadFile(url : any, filename : any) {
    let Regex = /.[A-Za-z]{3}$/;
    let fullurl = url.match(Regex);
    //let fileType = fullurl[0];
    let file_name = filename;
    // fs.saveAs(url, file_name); 
    //const blob = new Blob([], { type: 'text/csv' });
    //const url= window.URL.createObjectURL("http://tbkc-dapps-05.thaioil.localnet/ebiz_ws/Image/D001/transportation/00000910/1606366192767.jpg");
    //window.open("http://tbkc-dapps-05.thaioil.localnet/ebiz_ws/Image/D001/transportation/00000910/1606366192767.jpg");
  }
  onFileSelect_2(event : any, id : any) { }
  onFileSelect(event : any, id : any) {
    this.id_uploadFile = id;
    this.selectedFile = <File>event.target.files[ 0 ];
    console.log(event);
    console.log(this.selectedFile);
    this.onUpload();
  }

  onUpload() {
    this.appMain.isLoading = true;
    const onSuccess = (res : any) => {
      this.appMain.isLoading = false;

      var idMax = parseInt(this.getMax(this.img_list, 'id').id);
      this.img_list.push({
        doc_id: res.img_list.doc_id,
        emp_id: res.img_list.emp_id,
        id: idMax + 1,
        path: res.img_list.path,
        filename: res.img_list.filename,
        fullname: res.img_list.fullname,
        pagename: res.img_list.pagename,
        id_level_1: this.id_uploadFile,
        id_level_2: '',
        actionname: res.img_list.doc_id,
        status: '',
        modified_date: res.img_list.modified_date,
        modified_by: res.img_list.modified_by,
        action_type: 'insert',
        action_change: 'true',
      });

      this.swl.toastr_warning('Please Save Data');
      this.id_uploadFile = '';
      console.log(this.img_list);
      $('#file_id').val('');
      console.log(res);
    };
    this.fileuploadservice
      .postFilePhase2(this.selectedFile, this.doc_id, this.pagename, this.empid.toString(), localStorage[ 'token' ])
      .subscribe(
        (res) => onSuccess(res),
        (error) => {
          this.appMain.isLoading = false;
          console.log(error);
          alert('error!');
        }
      );
  }

  submitClick() {
    debugger;
    this.appMain.isLoading = true;
    this.travelInsurance_detail.forEach(function (e : any) {
      function datePlusday4(values : any) {
        if (values == '' || values == null) {
          return '';
        }

        var montF = new DatePipe('en-US');
        var dx = montF.transform(values, 'dd MMM yyyy');
        console.log(dx);

        return dx;
      }
      let day1 = e.Datefrom;
      let day2 = e.Dateto;

      if (day1 != '') {
        if (typeof day1 === 'object') {
          e.period_ins_from = datePlusday4(day1);
        } else {
          e.period_ins_from = e.period_ins_from;
        }
      }

      if (day2 != '') {
        if (typeof day2 === 'object') {
          e.period_ins_to = datePlusday4(day2);
        } else {
          e.period_ins_to = e.period_ins_to;
        }
      }

      e.certificates_total = e.certificates_total.replace(/,/g, '');
    });

    console.log('Submith -------------');
    console.log(this.travelInsurance_detail);
    this.emp_list.forEach((item : any) => {
      item.mail_status = 'false';

      if (item.emp_id === this.empid) {
        item.mail_status = 'true';
      }
    });
    // this.arrX[ 'emp_list' ] = this.emp_list;
    // this.arrX[ 'img_list' ] = this.img_list;
    // this.arrX[ 'travelInsurance_detail' ] = this.travelInsurance_detail;
    var Swl_text = 'Successfully saved';
    // if (this.arrX[ 'data_type' ] == 'sendmail_to_traveler' || this.arrX[ 'data_type' ] == 'sendmail_to_insurance') {
    //   Swl_text = 'Send E-mail successfully.';
    // }

    console.log('PRSAVE');
    console.log(JSON.parse(JSON.stringify(this.arrX)));

    const onSuccess = (data : any): void => {
      console.log(data);

      if (data.after_trip.opt1 == 'true') {
        this.travelInsurance_detail = data.travelInsurance_detail;
        console.log('BFSAVE');
        console.log(JSON.parse(JSON.stringify(data)));
        this.img_list = data.img_list;
        this.emplist = data.emp_list;
        this.swl.swal_success(Swl_text);
        this.btnSendMail = false;
        this.travelInsurance_detail.forEach((e : any) => {
          e[ 'submit_active' ] = '';
          e.certificates_total = this.convertInt('certificates_total', e, e.certificates_total);
        });

        this.travelInsurance_detail.forEach(function (e : any) {
          if (typeof e === 'object') {
            if (e.certificates_total != '') {
              e.certificates_total = e.certificates_total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            }

            function formatDate(date : any) {
              var d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + (d.getDate() + 1),
                year = d.getFullYear();

              if (month.length < 2) month = '0' + month;
              if (day.length < 2) day = '0' + day;

              return [ year, month, day ].join('-');
            }
            var xdate1 = formatDate(e.period_ins_from).toString();
            var xdate2 = formatDate(e.period_ins_to).toString();
            var xdate3 = formatDate(e.destination).toString();
            var montF = new DatePipe('en-US');
            try {
              var dx1 = montF.transform(xdate1, 'dd MMM y');
            } catch (err) {
              var dx1 : string | null = '';
            }

            try {
              var dx2 = montF.transform(xdate2, 'dd MMM y');
            } catch (err) {
              var dx2 : string | null = '';
            }

            try {
              var dx3 = montF.transform(xdate3, 'dd MMM y');
            } catch (err) {
              var dx3 : string | null = '';
            }

            if (e.ins_plan == '') {
              e.ins_plan = '1';
            }

            e[ 'submit_active' ] = '';
            e[ 'Datefrom' ] = dx1;
            e[ 'Dateto' ] = dx2;
            e[ 'Datedes' ] = dx3;
            e[ 'panelx' ] = true;
          }
        });

        console.log(this.travelInsurance_detail);
        this.appMain.isLoading = false;
      } else {
        this.swl.swal_error('');
        this.appMain.isLoading = false;
      }
    };

    this.ws.callWs(this.arrX, 'SaveTravelInsurance').subscribe(
      (data) => onSuccess(data),
      (error) => {
        console.log(error);
      },
      () => {
        this.TrackingStatus = {...InitTrackStatus};
      }
    );
  }
  SaveFile() {
    this.appMain.isLoading = true;
    this.travelInsurance_detail.forEach(function (e : any) {
      e.action_change = 'false';
    });

    // this.arrX[ 'emp_list' ] = this.emp_list;
    // this.arrX[ 'img_list' ] = this.img_list;
    // this.arrX[ 'travelInsurance_detail' ] = this.travelInsurance_detail;

    console.log('PRSAVEFILE');
    console.log(JSON.parse(JSON.stringify(this.arrX)));

    const onSuccess = (data : any): void => {
      console.log(data);

      if (data.after_trip.opt1 == 'true') {
        console.log('BFSAVEFILE');
        console.log(JSON.parse(JSON.stringify(data)));
        this.img_list = data.img_list;
      }
    };

    this.ws.callWs(this.arrX, 'SaveTravelInsurance').subscribe(
      (data) => onSuccess(data),
      (error) => {
        console.log(error);
      },
      () => {
        this.TrackingStatus = {...InitTrackStatus};
      }
    );
  }

  ConvertTypeDate(value : any) {
    if (!value) {
      return '';
    }

    return new Date(value);
  }
  AddDateX() { }

  SaveClick() {
    this.btnSendMail = false;
    this.appMain.isLoading = true;
    this.travelInsurance_detail.forEach(function (e : any) {
      function datePlusday4(values : any) {
        if (values == '' || values == null) {
          return '';
        }

        var montF = new DatePipe('en-US');
        var dx = montF.transform(values, 'dd MMM yyyy');
        console.log(dx);

        return dx;
      }
      let day1 = e.Datefrom;
      let day2 = e.Dateto;

      if (day1 != '') {
        if (typeof day1 === 'object') {
          e.period_ins_from = datePlusday4(day1);
        } else {
          e.period_ins_from = e.period_ins_from;
        }
      }

      if (day2 != '') {
        if (typeof day2 === 'object') {
          e.period_ins_to = datePlusday4(day2);
        } else {
          e.period_ins_to = e.period_ins_to;
        }
      }

      e.certificates_total = e.certificates_total.replace(/,/g, '');
    });

    console.log('Submith -------------');
    console.log(this.travelInsurance_detail);
    // this.arrX[ 'emp_list' ] = this.emp_list;
    // this.arrX[ 'img_list' ] = this.img_list;
    // this.arrX[ 'travelInsurance_detail' ] = this.travelInsurance_detail;
    // this.arrX[ 'data_type' ] = 'save';
    var Swl_text = 'Send E-mail successfully.';

    console.log(this.arrX);

    const onSuccess = (data : any): void => {
      console.log('Claim form Requisition E-Mail');
      console.log(data);

      if (data.after_trip.opt1 == 'true') {
        this.travelInsurance_detail = data.travelInsurance_detail;
        this.img_list = data.img_list;
        this.emplist = data.emp_list;
        this.swl.swal_success(Swl_text);
        this.travelInsurance_detail.forEach((e : any) => {
          e[ 'submit_active' ] = '';
          e.certificates_total = this.convertInt('certificates_total', e, e.certificates_total);
        });

        this.travelInsurance_detail.forEach(function (e : any) {
          if (typeof e === 'object') {
            if (e.certificates_total != '') {
              e.certificates_total = e.certificates_total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            }

            function formatDate(date : any) {
              var d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + (d.getDate() + 1),
                year = d.getFullYear();

              if (month.length < 2) month = '0' + month;
              if (day.length < 2) day = '0' + day;

              return [ year, month, day ].join('-');
            }
            var xdate1 = formatDate(e.period_ins_from).toString();
            var xdate2 = formatDate(e.period_ins_to).toString();
            var xdate3 = formatDate(e.destination).toString();
            var montF = new DatePipe('en-US');
            try {
              var dx1 = montF.transform(xdate1, 'dd MMM y');
            } catch (err) {
              var dx1 : string | null = '';
            }

            try {
              var dx2 = montF.transform(xdate2, 'dd MMM y');
            } catch (err) {
              var dx2 : string | null = '';
            }

            try {
              var dx3 = montF.transform(xdate3, 'dd MMM y');
            } catch (err) {
              var dx3 : string | null = '';
            }

            if (e.ins_plan == '') {
              e.ins_plan = '1';
            }

            e[ 'submit_active' ] = '';
            e[ 'Datefrom' ] = dx1;
            e[ 'Dateto' ] = dx2;
            e[ 'Datedes' ] = dx3;
            e[ 'panelx' ] = true;
          }
        });

        console.log(this.travelInsurance_detail);
        this.appMain.isLoading = false;
      } else {
        this.swl.swal_error('');
        this.appMain.isLoading = false;
      }
    };
    // claim form requisition
    // SendMailTravelinsuranceClaim
    this.ws.callWs(this.arrX, 'SendMailTravelinsuranceClaim').subscribe(
      (data) => onSuccess(data),
      (error) => {
        console.log(error);
      }
    );
  }

  openModalx(template: TemplateRef<any>) {
    this.tp_clone = template;
    let config: object = {
      class: 'modal-lg',
      animated: true,
      keyboard: false,
      ignoreBackdropClick: true,
    };

    this.modalRef = this.modalService.show(template, config);
    // var configx = $("#exampleModalCenter").closest('.modal-backdrop').addClass('z-index:1100');
    this.set_modal();
    setTimeout(function () {
      $('.multiselect-dropdown .dropdown-btn').css({border: '1px solid #ced4da', padding: '9px 12px'});
    }, 100);
  }

  set_modal() {
    $('.modal-backdrop').css({'z-index': 700});
    $('.modal').css({'z-index': 800});
  }

  modelChanged(event : any) {
    // var arrx = this.arrX[ 'emp_list' ];
    // this.email_send = this.transformX(arrx, event);
  }

  transformX(items : any, searchText : any) {
    searchText = searchText.toLocaleLowerCase();
    return items.filter((it : any) => {
      return it.userEmail.toLocaleLowerCase().includes(searchText);
    });
  }

  addemail(textvalues : any) {
    var statusInfunction = true;
    // Duplicate Mail
    for (var i = 0; i < this.Email_sendX.length; i++) {
      // if (this.Email_sendX[ i ].userEmail == textvalues) {
      //   statusInfunction = false;
      //   this.swl.swal_error('Mail Duplicate');
      // }
      console.log(' + + + ' + i);
    }
    if (textvalues == '') {
      statusInfunction = false;
    }
    if (statusInfunction != false) {
      this.Email_sendX.push({
        userEmail: textvalues,
      });
    }
    this.mail_curent = '';
    // this.email_send = this.arrX[ 'emp_list' ];
  }

  deleteRowx(event : any) {
    this.Email_sendX.splice(event, 1);
    /*     this.travelInsurance_detail.forEach(e => {
          if (e.id == id) {
            e.action_type = "delete" ;
            e.action_change = "true" ;
          }
        }); */
  }

  model_action_change(id : any) {
    //console.log(this.travelInsurance_detail);
    this.travelInsurance_detail.forEach(function (e : any) {
      if (e.id == id) {
        e.action_change = 'true';
      }
    });
    //console.log(this.travelInsurance_detail);
    this.before_ChangUser = true;
  }

  datebind(value : any) {
    var dx1;

    this.travelInsurance_detail.forEach(function (e : any) {
      if (typeof e === 'object') {
        function formatDate(date : any) {
          var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + (d.getDate() + 1),
            year = d.getFullYear();

          if (month.length < 2) month = '0' + month;
          if (day.length < 2) day = '0' + day;

          return [ year, month, day ].join('-');
        }
        var xdate1 = formatDate(value).toString();
        var montF = new DatePipe('en-US');
        try {
          dx1 = montF.transform(xdate1, 'dd MMM y');
        } catch (err) {
          dx1 = '';
        }

        /* e.period_ins_dest
          e.period_ins_to */
      }
    });

    return dx1;
  }

  datePlusday3(values : any, index : any, text : any) {
    var montF = new DatePipe('en-US');
    var dx = montF.transform(values, 'dd MMM y');
    // this.travelInsurance_detail[ index ][ text ] = dx;
    index[ text ] = dx;
    console.log(this.travelInsurance_detail[ index ])
  }

  datePlusday2(values : any) {
    if (values == '' || values == null) {
      return '';
    }
    var montF = new DatePipe('en-US');
    var dx = montF.transform(values, 'dd MMM yyyy');
    console.log(dx);
    return dx;
  }

  datePlusday(values : any) {
    function formatDate(date : any) {
      var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + (d.getDate() + 1),
        year = d.getFullYear();

      if (month.length < 2) month = '0' + month;
      if (day.length < 2) day = '0' + day;

      return [ year, month, day ].join('-');
    }
    var xdate1 = formatDate(values).toString();
    var montF = new DatePipe('en-US');
    var dx;
    try {
      dx = montF.transform(xdate1, 'dd MMM y');
    } catch (err) {
      dx = '';
    }

    return dx;
  }

  CallEmail() {
    var demo_data = {
      token_login: 'b7a307a9-5d02-4553-b5d2-63c297cb3bcc0',
      emp_id: '08001089',
      doc_id: 'OB20010047',
      page_name: 'isos',
      action_name: 'NotiISOSNewListRuningNoName',
    };

    const onSuccess = (data : any): void => { };

    this.ws.callWs(demo_data, 'EmailConfig ').subscribe(
      (data) => onSuccess(data),
      (error) => {
        this.appMain.isLoading = false;
        console.log(error);
      }
    );
  }

  SendEmail() {
    var demo_data = {
      token_login: 'b7a307a9-5d02-4553-b5d2-63c297cb3bcc0',
      emp_id: '08001089',
      doc_id: 'OB20010047',
      page_name: 'isos',
      action_name: 'NotiTravelInsuranceForm',
    };

    const onSuccess = (data : any): void => { };

    this.ws.callWs(this.arrX, 'SaveTravelInsurance').subscribe(
      (data) => onSuccess(data),
      (error) => {
        this.appMain.isLoading = false;
        console.log(error);
      }
    );
  }

  // for Search Emp
  //#region  for Search Emp
  loadEmpList() {
    let bodyX = {
      token_login: localStorage[ 'token' ],
      filter_value: '',
    };

    this.appMain.isLoading = true;
    const onSuccess = (data : any) => {
      console.log('---load success---');
      // console.log(data);
      if (data.after_trip.opt1 == 'true') {
        this.masterEmp = data.emp_list;
        this.appMain.isLoading = false;
        this.allEmp = this.masterEmp;
      } else {
        this.appMain.isLoading = false;
        console.log('---load Error---');
        // console.log(data);
        this.swl.swal_error(data.after_trip.opt2.status);
      }
    };
    this.ws.callWs(bodyX, 'LoadEmployeeList').subscribe(
      (data) => onSuccess(data),
      (error) => {
        this.appMain.isLoading = false;
        console.log(error);
        //alert('Can\'t call web api.' + ' : ' + error.message);
      }
    );
  }

  //ถ้าไม่เลือกที่ autocomplete จะเข้า fn นี้
  add(event: MatChipInputEvent, type: string): void {
    // //debugger
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
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.fCtrl.setValue(null);
    this.fCtrlCC.setValue(null);
  }

  remove(emp : any, indx : any, type: string): void {
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

  private _filter(value: any): any[] {
    return this.allEmp.filter(
      (x : any) =>
        x.displayname.toLowerCase().includes(value) ||
        x.emp_id.toLowerCase().includes(value) ||
        x.idicator.toLowerCase().includes(value)
    );
  }

  doFilter(type: string) {
    // if (this[ type ] != null && this[ type ] != '' && this[ type ].length > 2) {
    //   //console.log(this.inputText);
    //   //this.allEmp = this.masterEmp;
    // } else {
    //   //this.allEmp = [];
    // }
  }
  //#endregion for Search Emp

  // for Search Emp
  displayName(EmpList : any) {
    return EmpList.displayname;
  }

  Config_Email_Send(i : any) {
    if (i == 1) {
      this.mall_remark = 'Action1';
    } else {
      this.mall_remark = 'Action2';
    }

    let ds = this;
    console.log(this.mail_list);
    console.log(ds);
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
        STRMailTO = ds.MailList.map((res : any) => res.email.toLowerCase()).join(';');
        STRMailTO = STRMailTO + ';';
        STRMailEMPIDTO = ds.MailList.map((res : any) => res.emp_id.toLowerCase());
        //STRMailEMPID = STRMailEMPID + ";";
      }
      if (bcheck_mailcc) {
        STRMailCC = ds.MailListCC.map((res : any) => res.email.toLowerCase()).join(';');
        STRMailCC = STRMailCC + ';';
        STRMailEMPIDCC = ds.MailListCC.map((res : any) => res.emp_id.toLowerCase());

        //  console.log(STRMailEMPIDCC)
        //  console.log(STRMailEMPIDTO)
      }

      var irow = this.mail_list.findIndex((m_val : any) => m_val.emp_id == this.emp_id);
      if (irow > -1) {
        emp_all = STRMailEMPIDTO.concat(STRMailEMPIDCC).join(';');
        emp_all = emp_all + ';';
        // this.mail_list[ irow ].action_change = 'true';
        // this.mail_list[ irow ].mail_cc = STRMailCC;
        // this.mail_list[ irow ].mail_to = STRMailTO;
        // this.mail_list[ irow ].mail_emp_id = emp_all;
        status_Send = true;
      }

      this.modalRef?.hide();

      ds.MailListCC = [];
      ds.MailList = [];
      if (status_Send) {
        this.Send_Email();
      }
      console.log(this.mail_list);
    } else {
      this.swl.swal_error('Not Have Email List');
    }
  }

  Send_Email() {
    this.mail_list.forEach((e : any) => {
      e.module = this.mall_remark;
      //e.mail_remark = this.mall_remark ;
    });

    this.appMain.isLoading = true;
    const onSuccess = (data : any) => {
      console.log(data);

      if (data.after_trip.opt1 == 'true') {
        if (data.after_trip.opt2.status != 'Send E-mail successfully.') {
          data.after_trip.opt2.status = 'Send E-mail successfully.';
        }
        this.swl.swal_success(data.after_trip.opt2.status);
      } else {
        if (data.after_trip.opt2.status == null) {
          data.after_trip.opt2.status = 'Error';
        }
        this.swl.swal_error(data.after_trip.opt2.status);
      }

      this.appMain.isLoading = false;
    };

    var BodyX = this.arrX;
    console.log(this.mail_list);
    console.log(BodyX);
    this.ws.callWs(BodyX, 'SendMailTravelinsurance').subscribe(
      (data) => onSuccess(data),
      (error) => (this.appMain.isLoading = false),
      () => {
        //this.check_user();
      }
    );
  }

  send_mail_Test(id : any) {
    this.travelInsurance_detail.forEach((e : any) => {
      if (e.id == id) {
        e.submit_active = 'active';
      } else {
        e.submit_active = '';
      }
    });

    //this.testCallAsmx(id,0);
    if (this.check_values_beforeSend(id)) {
      this.testCallAsmx(id, 0);
    } else {
      return;
    }
  }

  path_file_name : any;
  path_file_path : any;
  testCallAsmx(id : any, typex : any) {
    this.appMain.isLoading = true;
    //ถ้าไม่มีข้อมูลให้ใส่ขีด - แทนค่าว่างก่อนส่งไป
    var stebody = this.travelInsurance_detail.filter((word : any) => word.id == id);
    var date_from, date_to;
    var montF = new DatePipe('en-US');
    // date_from = montF.transform(stebody[ 0 ].period_ins_from, 'dd/MM/yyyy');
    // date_to = montF.transform(stebody[ 0 ].period_ins_to, 'dd/MM/yyyy');
    console.log(date_from);
    console.log(date_to);

    // var date1 = this.formatDate(stebody[ 0 ].period_ins_from);
    // var date2 = this.formatDate(stebody[ 0 ].period_ins_to);

    // var day_total = this.datediff(this.parseDate(date1), this.parseDate(date2));

    var numz;
    // if (isNaN(day_total)) {
    //   numz = '-';
    // } else {
    //   //ต้องนับจาก 1
    //   numz = day_total + 1;
    // }
    /* ,
    , */

    // var broker = this.brokerDt.filter((word) => word.id == stebody[ 0 ].ins_broker);
    // var plan = this.ms_plan.filter((word) => word.id == 4); /*  Classic Plan 4*/
    const {userTel} = this.userDetail;

    var countryXX = '-';
    // if (stebody[ 0 ].destination != '' || stebody[ 0 ].destination != null) {
    //   var str = stebody[ 0 ].destination;
    //   let strcomma = str.indexOf(',');
    //   var lengthx = str.length;
    //   if (strcomma > -1) {
    //     let strArr: any[] = str.split(',');
    //     let country = [];
    //     if (strArr.length > 0) {
    //       for (let i in strArr) {
    //         var n = strArr[ i ].indexOf('/');
    //         let countryStr = strArr[ i ].slice(0, n);
    //         country.push(countryStr);
    //       }
    //     }
    //     countryXX = country.length === 0 ? '-' : country.join('&');
    //   } else {
    //     var n = str.indexOf('/');
    //     countryXX = str.slice(0, n);
    //   }
    // }
    let bodyX = {
      token_login: localStorage[ 'token' ],
      // policyHolder: stebody[ 0 ].ins_emp_name,
      // passportNo: stebody[ 0 ].ins_emp_passport ? stebody[ 0 ].ins_emp_passport : '-',
      // companyName: stebody[ 0 ].insurance_company,
      // address: stebody[ 0 ].ins_emp_address,
      // occupation: stebody[ 0 ].ins_emp_occupation ? stebody[ 0 ].ins_emp_occupation : "-",
      // age: stebody[ 0 ].ins_emp_age ? stebody[ 0 ].ins_emp_age : '-',
      tel: userTel ? userTel : '-',
      // fax: stebody[ 0 ].ins_emp_fax ? stebody[ 0 ].ins_emp_fax : '-',
      // nameOfBeneficiary: stebody[ 0 ].name_beneficiary,
      // relationship: stebody[ 0 ].relationship,
      pdateFrom: date_from, //dd/MM/yyyy
      pdateTo: date_to, //dd/MM/yyyy
      duration: numz,
      // insPlan: plan[ 0 ].name, //plan[0].name
      destination: countryXX,
      // broker: broker[ 0 ].name, //broker[0].name
    }; /* stebody[0].destination, */

    /* let bodyX = {
      "token_login": localStorage["token"],
      "policyHolder": 'Mr Attaphon Sodsarn',
      "passportNo": 'A0012345',
      "companyName": 'Thai Oil Public Company Limited Branch 00001 Tax ID No.010-7547000-711',
      "address": '42/1 Moo 1, Sukhumvit Road Km 124, Tungsukla, Sriracha, Cholburi 20230',
      "occupation": 'Employee',
      "age": '34',
      "tel": '099-999-9999',
      "fax": '-',
      "nameOfBeneficiary": 'Mrs. Siripan  Siriwit',
      "relationship": 'Wife',
      "pdateFrom": '24/01/2019', //dd/MM/yyyy
      "pdateTo": '25/01/2019', //dd/MM/yyyy
      "duration": '2',
      "insPlan": 'Classic Plan 4',
      "destination": 'Netherlands',
      "broker": 'Multi Risk Consultants (Thailand) Ltd'
    } */

    console.log(' bodyX ');
    console.log(bodyX);
    const onSuccess = (data : any) => {
      console.log('***Call Asmx***');
      // console.log(data);
      // console.log(data.d);

      var parsed = $.parseJSON(data.d);
      console.log(parsed);
      console.log(parsed.dtResult);

      if (parsed.dtResult[ 0 ].status === 'true') {
        console.log(parsed.dtResult[ 0 ].file_system_path);
        console.log(parsed.dtResult[ 0 ].file_outbound_path);
        console.log(parsed.dtResult[ 0 ].file_outbound_name);

        //เอาไว้ทดลองว่า gen file ได้มั้ยโดยการลอง save as
        //this.ws.downloadFile(parsed.dtResult[0].file_outbound_path,parsed.dtResult[0].file_outbound_name);

        //this.appMain.isLoading = false;
        debugger;
        var pathx = parsed.dtResult[ 0 ].file_outbound_path;
        var namex = parsed.dtResult[ 0 ].file_outbound_name;
        this.travelInsurance_detail.forEach((e : any) => {
          if ((e.id = id)) {
            e.file_outbound_name = namex;
            e.file_outbound_path = pathx;
          }
        });
        if (typex == 0) {
          // this.arrX[ 'data_type' ] = 'sendmail_to_traveler';
        } else {
          // this.arrX[ 'data_type' ] = 'sendmail_to_insurance';
        }

        this.submitClick();
      } else {
        //this.appMain.isLoading = false;
        this.swl.swal_error(parsed.dtResult[ 0 ].status);
        this.appMain.isLoading = false;
      }
    };

    //data, function name(ฝั่ง asmx), method name
    this.ws.callWs_asmx(bodyX, 'Report', 'insurance').subscribe(
      (data) => onSuccess(data),
      (error) => {
        /* this.appMain.isFirstLoading = false */
        console.log(error);
        this.appMain.isLoading = false;
        alert("Can't call web api." + ' : ' + error.message);
      }
    );
  }

  send_mail_Test2(id : any, btnType? : any) {
    let isNotPassport = false;
    this.travelInsurance_detail.forEach((e : any) => {
      if (e.id == id) {
        //!! 1= Send E-mail To Insurance 0= Send E-mail To traveller
        if (btnType === 1) {
          const Bpassport_No = e.ins_emp_passport === '' || e.ins_emp_passport === null;
          if (Bpassport_No) isNotPassport = true;
        }
        if (isNotPassport === false) {
          e.submit_active = 'active';
        }
      } else {
        e.submit_active = '';
      }
    });
    if (isNotPassport) {
      this.swl.swal_warning('Please maintain passport');
      return;
    }
    this.btnSendMail = true;
    //this.testCallAsmx(id,1);
    // if (this.check_values_beforeSend(id)) {
    if (this.check_values_beforeSendmail(id, btnType)) {
      this.model_action_change(id);
      this.testCallAsmx(id, btnType);
    } else {
      return;
    }
  }

  active_id = '';
  checkModelZ = true;

  check_el(id : any, palam : any) {
    /* if(this.active_id = id){

    } */
    var re = true;
    if (palam == '' || palam == null) {
      re = true;
    } else {
      re = false;
    }

    return re;
  }

  check_values_beforeSend(id : any) {
    var SaveState = true;
    var StatusSave : any = [],
      indexx = 0;
    var result = this.travelInsurance_detail.filter((word : any) => word.id == id);
    result.forEach((e : any) => {
      var TextReWaring = '';

      /* if (e.ins_plan == '' || e.ins_plan == null) {
        TextReWaring = 'Insurance Plan Data Invalid';
      }  */
      if (e.ins_emp_name == '' || e.ins_emp_name == null) {
        TextReWaring = 'Policy Holder Data Invalid';
      }
      if (e.insurance_company == '' || e.insurance_company == null) {
        TextReWaring = 'Company Name / Billing to Data Invalid';
      }
      if (e.ins_emp_address == '' || e.ins_emp_address == null) {
        TextReWaring = 'Address Data Invalid';
      }
      if (e.name_beneficiary == '' || e.name_beneficiary == null) {
        TextReWaring = 'Name of Beneficiary Data Invalid';
      }

      if (e.relationship == '' || e.relationship == null) {
        TextReWaring = 'Relationship Data Invalid';
      }
      if (e.Datefrom == '' || e.Datefrom == null) {
        TextReWaring = 'Period of Insurance From Data Invalid';
      }
      if (e.Dateto == '' || e.Dateto == null) {
        TextReWaring = 'Period of Insurance To Data Invalid';
      }
      if (e.destination == '' || e.destination == null) {
        TextReWaring = 'Destination Data Invalid';
      }
      if (e.ins_broker == '' || e.ins_broker == null) {
        TextReWaring = 'Broker Data Invalid';
      }
      if (e.certificates_no == '' || e.certificates_no == null) {
        TextReWaring = 'Certificate of Insurance Data Invalid';
      }
      if (e.certificates_total == '' || e.certificates_total == null) {
        TextReWaring = 'Total (THB) Data Invalid';
      }

      StatusSave[ indexx ] = false;
      if (TextReWaring == '') {
        StatusSave[ indexx ] = true;
      } else {
        this.swl.swal_warning('Please check the ' + TextReWaring);
      }

      indexx++;
    });

    StatusSave.forEach((x : any) => {
      if (x == false) {
        SaveState = false;
      }
    });

    return SaveState;
  }
  check_values_beforeSendmail(id : any, btnType : any) {
    var SaveState = true;
    var StatusSave : any = [],
      indexx = 0;
    var result = this.travelInsurance_detail.filter((word : any) => word.id == id);
    result.forEach((e : any) => {
      var TextReWaring = '';

      /* if (e.ins_plan == '' || e.ins_plan == null) {
        TextReWaring = 'Insurance Plan Data Invalid';
      }  */
      if (e.ins_emp_name == '' || e.ins_emp_name == null) {
        TextReWaring = 'Policy Holder Data Invalid';
      }
      if (e.insurance_company == '' || e.insurance_company == null) {
        TextReWaring = 'Company Name / Billing to Data Invalid';
      }
      if (e.ins_emp_address == '' || e.ins_emp_address == null) {
        TextReWaring = 'Address Data Invalid';
      }
      if (btnType !== 0) {
        if (e.name_beneficiary == '' || e.name_beneficiary == null) {
          TextReWaring = 'Name of Beneficiary Data Invalid';
        }

        if (e.relationship == '' || e.relationship == null) {
          TextReWaring = 'Relationship Data Invalid';
        }
      }
      if (e.Datefrom == '' || e.Datefrom == null) {
        TextReWaring = 'Period of Insurance From Data Invalid';
      }
      if (e.Dateto == '' || e.Dateto == null) {
        TextReWaring = 'Period of Insurance To Data Invalid';
      }
      if (e.destination == '' || e.destination == null) {
        TextReWaring = 'Destination Data Invalid';
      }
      if (e.ins_broker == '' || e.ins_broker == null) {
        TextReWaring = 'Broker Data Invalid';
      }
      if (btnType !== 0 && btnType !== 1) {
        if (e.certificates_no == '' || e.certificates_no == null) {
          TextReWaring = 'Certificate of Insurance Data Invalid';
        }
        if (e.certificates_total == '' || e.certificates_total == null) {
          TextReWaring = 'Total (THB) Data Invalid';
        }
      }

      StatusSave[ indexx ] = false;
      if (TextReWaring == '') {
        StatusSave[ indexx ] = true;
      } else {
        this.swl.swal_warning('Please check the ' + TextReWaring);
      }

      indexx++;
    });

    StatusSave.forEach((x : any) => {
      if (x == false) {
        SaveState = false;
      }
    });

    return SaveState;
  }

  scalltag(row : any) {
    setTimeout(function () {
      var position = 480 + row * 1170;
      window.scroll(0, position);
    }, 500);

    /* this.cardTag.nativeElement.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    }); */
  }

  onlyNumberKey(evt : any) {
    // Only ASCII character in that range allowed
    var ASCIICode = evt.which ? evt.which : evt.keyCode;
    if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57)) {
      return false;
    } else {
      return ASCIICode;
    }
  }

  order_by_list(arr : any) {
    var re = arr;
    re.sort(function (a : any, b : any) {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });
    return re;
  }
}
