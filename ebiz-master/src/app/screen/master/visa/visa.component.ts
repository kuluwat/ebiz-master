import { FileuploadserviceService } from '../../../ws/fileuploadservice/fileuploadservice.service';
import { AppComponent } from '../../../app.component';
import { AspxserviceService } from '../../../ws/httpx/aspxservice.service';
import {HttpClient} from '@angular/common/http';
import {BsModalService, BsModalRef} from 'ngx-bootstrap/modal';
import {MasterComponent} from '../master.component';
import {
  Component,
  OnInit,
  Inject,
  forwardRef,
  TemplateRef,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
} from '@angular/core';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import {DatePipe} from '@angular/common';
import { AlertServiceService } from '../../../services/AlertService/alert-service.service';
import {FormControl} from '@angular/forms';
import {forkJoin, Observable, Observer, ReplaySubject, Subject} from 'rxjs';
import { BANKS,Bank } from '../../../master/ebizhome/ebizhome.component';
import {map, startWith, takeUntil} from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import {COMMA, ENTER, SEMICOLON} from '@angular/cdk/keycodes';
// import * as fs from 'file-saver';
import { InitTrackStatus, TrackingStatus } from '../../../model/localstorage.model';
import {useAuth} from '../accommodation/accommodation.component';
import {CloneDeep} from '../transportation/transportation/transportation.component';
import {resolve} from 'url';
declare var $: any;
declare var moment: any;
@Component({
  selector: 'app-visa',
  templateUrl: './visa.component.html',
  styleUrls: [ './visa.component.css' ],
})
export class VisaComponent implements OnInit {
@ViewChild('btnCloseAA', {static: true}) closeModal?: ElementRef;
@ViewChild('checkall', {static: true}) checkall?: ElementRef;
@ViewChild('btnDownload', {static: true}) clickdownloadfile?: ElementRef;

valueTest = '';
detail = true;
edit_input = false;
default_type_bool = true;
status = false;
show_button = true;
empid = '';
emp_list: any[] = [];
arrX: any[] = [];
visa_detail: any[] = [];
name_user = '';
sumx = 0;
namex = '';
travel: any;
business_date: any;
travel_date: any;
country_city: any;
img_list: any[] = [];
img_list_cert: any[] = [];
selectedFile: File = null;
doc_id = '';
id_add_file = '';
pagename = 'visa';
emp_id: any = null;
varx: any[] = [];
id_uploadFile: any;
actiontype_name: any;
country_list: any[] = [];
country_list_All: any[] = [];
country_vla: any[] = [];
country_model = {
  config: {
    displayKey: 'name',
    search: true,
    limitTo: 1000,
    height: '200px',
    position: 'fixed',
    placeholder: 'Select',
  },
};
province = {
  value: [],
  config: {
    displayKey: 'name',
    search: true,
    limitTo: 1000,
    height: '500px',
    placeholder: 'Select',
  },
};
country = {
  list: [],
  select: [],
  settingSingle: {
    enableCheckAll: false,
    singleSelection: true,
    idField: 'id',
    textField: 'name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 100,
    allowSearchFilter: true,
    closeDropDownOnSelection: true,
  },
};

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

visa_detail_input = [
  {
    doc_id: 'OB20010047',
    emp_id: '08000480',
    id: '1',
    visa_place_issue: '',
    visa_valid_from: '',
    visa_valid_to: '',
    visa_valid_until: '',
    visa_type: '',
    visa_category: '',
    visa_entry: '',
    visa_name: '',
    visa_surname: '',
    visa_date_birth: '',
    visa_nationality: '',
    passport_no: '',
    visa_sex: '',
    visa_authorized_signature: '',
    visa_remark: '',
    visa_card_id: '',
    visa_serial: '',
    default_type: '',
    default_action_change: 'false',
    action_type: 'insert',
    action_change: 'false',
  },
];
EditStatus = true;
Email_sendX: any[] = [];
email_send: any;
mail_curent = '';

plan_mo = '';
valid_from = '';
valid_until = '';
type_visa = '';
catory_visa = '';
no_of_entery = '';
surname = '';
date_birth = '';
nationality = '';
passport_num = '';
sex = '';
authrized = '';
remark = '';
disble_inp = false;
tp_clone: TemplateRef<any> | undefined;
modalRef: BsModalRef | undefined;
before_ChangUser = false;
H_detail = {
  travel_topic: '',
  travel_date: '',
  business_date: '',
  country_city: '',
};
Modified_by: any;
numAutoRun: any;
myForm: any;
masterDoc: any;
visa_docountries: any[] = [];
visa_code_img: any;

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
masterEmp: any[] | undefined;
MailListCC: any = [];

inputText = '';
inputTextCC = '';

mail_list: any;
personer: any;
personal_name = '';
TrackingStatus: TrackingStatus = { ...InitTrackStatus };

protected banks: Bank[] = BANKS;
public bankCtrl: FormControl = new FormControl();
public bankFilterCtrl: FormControl = new FormControl();
public filteredBanks: ReplaySubject<Bank[]> = new ReplaySubject<Bank[]>(1);
protected _onDestroy = new Subject<void>();
pathPhase1: any;
public selectControl = new FormControl();
m_country: any[] = [];
profile: any;
countryInDoc: any = [];
PATHGROUP: any[] = [];
countrySelect: any[] = [];
pdpa_wording = '';
isCanceled = false;
  //#endregion  declare default
  constructor(
    @Inject(forwardRef(() => MasterComponent)) private appMain: MasterComponent,
    private modalService: BsModalService,
    private http: HttpClient,
    private ws: AspxserviceService,
    private x: AppComponent,
    private fileuploadservice: FileuploadserviceService,
    private alert: AlertServiceService,
    private changeDetector: ChangeDetectorRef
  ) {
    // for Search Emp
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
  async OnloadDoc() {
    this.profile = await this.CheckLogin();

    // this.appMain.isLoading = true;
    var BodyX = {
      token_login: localStorage[ 'token' ],
      doc_id: this.doc_id,
    };

    const onSuccess = (data) => {
      const {tab_no = '1'} = data.up_coming_plan[ 0 ];
      this.pathPhase1 = tab_no;
    };
    this.ws.callWs(BodyX, 'LoadDoc').subscribe(
      onSuccess,
      (error) => console.log(error),
      () => { }
    );
    console.log('loadDoc');
    console.log(this.pathPhase1);
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
    this.personer = this.appMain.DOC_ID;
    this.doc_id = this.appMain.DOC_ID;
    //!! แบบ callback
    this.loadEmpList();
    this.loadMasterDoc();
    //!! แบบ callback

    // ??ถ้ามีการ เรียกข้อมูลมากว่า 5 req อาจจะต้องเปลียนเป็นเรียกพร้อมกันแล้ว update ที่เดียว
    // this.assingData();
    // ??ถ้ามีการ เรียกข้อมูลมากว่า 5 req อาจจะต้องเปลียนเป็นเรียกพร้อมกันแล้ว update ที่เดียว

    // // http://TBKC-DAPPS-05.thaioil.localnet/ebiz_ws/api/LoadVisa
    // setTimeout(() => {
    //   this.selectControl.valueChanges.subscribe((subscriptionTypeId: number) => {
    //     const obj = this.country_list.find((item) => item.optionId === subscriptionTypeId);
    //     console.log('subscriptionTypeId', subscriptionTypeId, obj);
    //   });

    //   // set initial selection
    //   this.bankCtrl.setValue(this.banks[0]);
    //   //this.filteredBanks = this.country_list ;
    //   // load the initial bank list
    //   this.filteredBanks.next(this.country_list);
    //   console.log('----------------------------- Load Test1');
    //   console.log(this.banks);
    //   console.log('----------------------------- Load Test2');
    //   console.log(this.banks.slice());
    //   console.log('----------------------------- Load Test3');
    //   console.log(this.banks[0]);
    //   console.log('----------------------------- Load Test3');
    //   console.log(this.filteredBanks);
    //   // listen for search field value changes takeUntil
    //   this.bankFilterCtrl.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {
    //     this.filterBanks();
    //   });
    //   console.log('----------------------------- Load Test4');
    //   console.log(this.bankFilterCtrl);
    // }, 800);

    setTimeout(function () {
      $('.ngx-dropdown-button').css({});
    }, 1500);
  }
  hide_modal(btn_cancle, update) {
    if (btn_cancle == 'Accept') {
      this.modalRef.hide();
      // (click)="ConfrimSave()"
      this.ConfrimSave();
      // this.openModal(this.template_Edit_passport, 'edit_passport', update);
    }
  }
  ngAfterViewChecked() {
    //your code to update the model // ใช้สำหรับ re-rendered กรณีไป update view แล้วเข้า lifecycle นี้จะ error
    this.changeDetector.detectChanges();
  }
  protected filterBanks() {
    if (!this.country_list) {
      return;
    }
    // get the search keyword
    let search = this.bankFilterCtrl.value;
    if (!search) {
      this.filteredBanks.next(this.country_list.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks country_list
    this.filteredBanks.next(
      //this.banks.filter(bank => bank.name.toLowerCase().indexOf(search) > -1)
      this.country_list.filter((bank) => bank.name.toLowerCase().indexOf(search) > -1)
    );
    console.log('----------------------------- Load filteredBanks');
    console.log(this.filteredBanks);
  }

  async onFetchAll(): Promise<{
    LoadEmployeeList: any;
    LoadMasterDataDOC: any;
    LoadMasterDataCountry: any;
    LoadMasterDataLocation: any;
    LoadVisa: any;
  }> {
    let bodyX: any = {
      token_login: localStorage[ 'token' ],
      filter_value: '',
    };
    const LoadEmployeeList = this.ws.callWs(bodyX, 'LoadEmployeeList');
    bodyX = {
      token_login: 'b8a27da5-c587-405d-8a45-20e39c98e5ce',
      page_name: 'visa',
      module_name: 'master visa document',
    };
    const LoadMasterDataDOC = this.ws.callWs(bodyX, 'LoadMasterData');

    bodyX = {
      token_login: 'b8a27da5-c587-405d-8a45-20e39c98e5ce',
      page_name: 'mtvisacountries',
      module_name: 'master visa docountries',
    };
    const LoadMasterDataCountry = this.ws.callWs(bodyX, 'LoadMasterData');
    bodyX = {
      token_login: 'b8a27da5-c587-405d-8a45-20e39c98e5ce',
      page_name: 'mtvisacountries',
      module_name: 'master location',
    };
    const LoadMasterDataLocation = this.ws.callWs(bodyX, 'LoadMasterData');
    bodyX = {
      token_login: localStorage[ 'token' ],
      doc_id: this.doc_id,
    };
    const LoadVisa = this.ws.callWs(bodyX, 'LoadVisa');
    this.appMain.isLoading = true;

    return new Promise((resolve, reject) => {
      const observer: Observer<any> = {
        next: (data) => {
          let obj = {
            LoadEmployeeList: data[ 0 ],
            LoadMasterDataDOC: data[ 1 ],
            LoadMasterDataCountry: data[ 2 ],
            LoadMasterDataLocation: data[ 3 ],
            LoadVisa: data[ 4 ],
          };
          // console.log(obj);
          // return ค่าออกจาก obsavable
          resolve(obj);
        },
        error: (error) => {
          reject(error);
        },
        complete: () => {
          this.appMain.isLoading = false;
        },
      };
      forkJoin([
        LoadEmployeeList,
        LoadMasterDataDOC,
        LoadMasterDataCountry,
        LoadMasterDataLocation,
        LoadVisa,
      ]).subscribe(observer);
    });
  }

  update_userByDOC(event, empid, values) {
    $('#checkall').prop('checked', false);
    this.emp_list.forEach((e) => {
      if (e.emp_id == values) {
        e.mail_status = 'true';
      } else {
        e.mail_status = 'false';
      }
    });

    var empidd = this.visa_detail.filter((word) => word.emp_id == values);
    this.visa_code_img = empidd[ 0 ].id;

    this.visa_detail.forEach((e) => {
      if (e.id == empidd[ 0 ].id) {
        e.check_action = true;
      } else {
        e.check_action = false;
      }
    });
    this.appMain.userSelected = this.empid;
    this.TrackingStatus = {...InitTrackStatus};
    const Bcheck = this.UpdateDetailNull();
    const ChangeUser = this.empByDoc;
  }

  loadMasterDoc() {
    this.appMain.isLoading = true;

    let bodyX = {
      token_login: 'b8a27da5-c587-405d-8a45-20e39c98e5ce',
      page_name: 'visa',
      module_name: 'master visa document',
    };

    const onSuccess = async (data): Promise<void> => {
      console.log(data);
      this.masterDoc = data.visa_document;
      this.OnloadDoc();
      await this.loadMasterCountry();
      this.Masterlocation();
    };

    this.ws.callWs(bodyX, 'LoadMasterData').subscribe(
      (data) => onSuccess(data),
      (error) => {
        this.appMain.isLoading = false;
        console.log(error);
      }
    );
  }

  loadMasterCountry() {
    return new Promise((resolve, reject) => {
      let bodyX = {
        token_login: 'b8a27da5-c587-405d-8a45-20e39c98e5ce',
        page_name: 'mtvisacountries',
        module_name: 'master visa docountries',
      };

      const onSuccess = (data): void => {
        console.log(data);
        this.visa_docountries = data.visa_docountries;
        // this.appMain.isLoading = false;
        resolve(true);
      };

      this.ws.callWs(bodyX, 'LoadMasterData').subscribe(
        (data) => onSuccess(data),
        (error) => {
          console.log(error);
          reject(false);
        }
      );
    });
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
  UpdateDetailNull() {
    if (!this.visa_detail) {
      return [];
    }
    let bcheck = this.visa_detail.filter(
      (item) => this.getBoolean(item.visa_active_in_doc) && this.empid === item.emp_id && item.action_type != 'delete'
    );
    if (bcheck.length < 1) {
      this.addrow('system');
    }
    return !!bcheck;
  }
  getWeek(dateOfDeparture) {
    const travleDate = dateOfDeparture;
    const checkDATE = travleDate.includes('-') ? this.H_detail.travel_date.split('-') : null;
    if (checkDATE && checkDATE.length === 2) {
      const startDate = moment(checkDATE[ 0 ]);
      const endDate = moment(checkDATE[ 1 ]);
      const day = endDate.diff(startDate, 'day') / 7
      if (day <= 7) {return 1}
      else if (day > 7 && day <= 14) {return 2}
      else if (day > 14 && day <= 21) {return 3}
      else {return 4}
    }
    return "-"

  }
  VisaDetail(): Array<any> {
    const type = this.personer;
    let bcheck = [];
    if (this.CheckMtCounty) return bcheck;
    let dt = this.visa_detail;
    let country_group = this.country_group;
    if (dt.length < 1 || !this.empid) {
      return [];
    }
    // this.country_group
    if (type === 'personal') {
      bcheck = dt.filter(
        (item) => this.getBoolean(item.visa_active_in_doc) && this.empid === item.emp_id && item.action_type != 'delete'
      );
    } else {
      // this.country_group
      bcheck = dt.filter(
        (item) => this.getBoolean(item.visa_active_in_doc) && this.empid === item.emp_id && item.action_type != 'delete'
      );
    }
    if (bcheck.length < 1) {
      const NewRow = this.UpdateDetailNull();
    }
    if (bcheck.length > 0) {
      return bcheck;
    }
    return [];
  }
  get empByDoc() {
    const Filteremp = (item) => item.emp_id === this.empid;
    const countrygroup = this.country_doc.filter(Filteremp).map((item) => item.country_id);
    this.country_group = [ ...countrygroup ];
    let arr_filter = this.visa_docountries.filter((word) => countrygroup.includes(word.country_id));
    if (arr_filter.length <= 0) {
      // กรณีไม่มี ประเทศที่ maintain
      this.CheckMtCounty = true;
    } else {
      this.countryInDoc = arr_filter;
      this.CheckMtCounty = false;
    }

    return '';
  }
  getBoolean(value) {
    switch (value) {
      case true:
        return true;
      case 'true':
        return true;
      case 1:
        return true;
      case '1':
        return true;
      case 'on':
        return true;
      case 'yes':
        return true;
      default:
        return false;
    }
  }

  zone_select;
  country_select;
  county_new_arr;
  CheckMtCounty = false;
  Masterlocation() {
    let bodyX = {
      token_login: 'b8a27da5-c587-405d-8a45-20e39c98e5ce',
      page_name: 'mtvisacountries',
      module_name: 'master location',
    };

    const onSuccess = (data): void => {
      /* console.log(data); */
      //debugger;
      this.zone_select = data.master_zone;
      this.country_select = data.master_country;
      this.county_new_arr = data.master_country;
      this.country_list = data.master_country;
      this.country_list_All = [ ...data.master_country ];
      this.onloadX();
    };

    this.ws.callWs(bodyX, 'LoadMasterData').subscribe(
      (data) => onSuccess(data),
      (error) => {
        console.log(error);
      }
    );
  }
  country_group = [];
  country_doc;
  onloadX() {
    let bodyX = {
      token_login: localStorage[ 'token' ],
      doc_id: this.doc_id,
    };

    const onSuccess = (data): void => {
      //? ? โหลดข้อมูลครั้งแรก
      this.H_detail.business_date = data.business_date;
      this.H_detail.travel_date = data.travel_date;
      this.H_detail.country_city = data.country_city;
      this.H_detail.travel_topic = data.travel_topic;

      this.arrX = data;
      this.arrX[ 'data_type' ] = 'save';
      let arr_filter,
        StatusX = false;
      var countryXX = '-';
      this.m_country = data.country_doc;
      this.country_doc = data.country_doc;
      this.empid = data.emp_list[ 0 ].emp_id;

      //!!  หา group ประเทศที่จะไป
      const Filteremp = (item) => item.emp_id === this.empid;
      const countrygroup = data.country_doc.filter(Filteremp).map((item) => item.country_id);
      this.country_group = [ ...countrygroup ];
      //!!  หา group ประเทศที่จะไป
      //debugger;
      console.log(this.visa_docountries);
      arr_filter = this.visa_docountries.filter((word) => countrygroup.includes(word.country_id));
      // console.clear();
      this.countryInDoc = arr_filter;
      console.log(arr_filter);
      console.log('filter');
      if (arr_filter.length <= 0) {
        StatusX = true;
      }

      // !! check startus ว่าประเทศ มีใน master ไหม
      this.CheckMtCounty = StatusX ? true : false;
      if (this.personer === 'personal') {
        this.CheckMtCounty = false;
      }
      // !! check startus ว่าประเทศ มีใน master ไหม

      this.mail_list = data.mail_list;
      this.visa_detail = data.visa_detail;

      this.status = true;
      this.doc_id = data.doc_id;
      //this.empid = data.emp_id;
      this.img_list = data.img_list;
      this.emp_list = data.emp_list;
      this.personal_name = this.emp_list[ 0 ].userDisplay;

      function datenow() {
        //let dateFormat = require('dateformat');
        var montF = new DatePipe('en-US');
        let now = new Date();
        var montx = montF.transform(now, 'dd MMM yyyy');
        return montx;
      }

      this.img_list.forEach((e) => {
        if (e.path == 'path') {
          e.modified_date = datenow();
        }
        e.active_type = this.getBoolean(e.active_type);
        e[ 'statusTypexFile' ] = e.active_type;
        e[ 'fileStatus' ] = false;
      });
      var ii = 0;
      this.numAutoRun = ii;
      this.EditStatus = false;
      this.appMain.isLoading = false;

      function getMaxIn(arr, prop) {
        var max;
        for (var i = 0; i < arr.length; i++) {
          if (max == null || parseInt(arr[ i ][ prop ]) > parseInt(max[ prop ])) max = arr[ i ];
        }
        //if ( max == "") { max = 0;}
        return max;
      }
      var visa_detailx = this.visa_detail;
      function visamax() {
        var re;
        var data_max = getMaxIn(visa_detailx, 'visa_card_id');

        // if (parseInt(data_max.visa_card_id + 1) == NaN || isNaN(parseInt(data_max.visa_card_id) + 1) == true) {
        //   re = 1001;
        // } else {
        //   re = parseInt(data_max.visa_card_id) + 1;
        // }
        return '' + re + '';
      }

      var contryX = this.country_list;
      function filter_nationality(valueX, typeC) {
        //debugger;
        var visa;
        if (valueX != '' && valueX != 'undefined' && valueX != undefined) {
          if (typeC == 'id_name') {
            visa = contryX.filter((word) => word.id == valueX);
            return visa[ 0 ].name;
          } else {
            visa = contryX.filter((word) => word.name == valueX);
            return visa[ 0 ].id;
          }
        } else {
          return '';
        }
      }
      var empid_in_function = this.empid;
      var data_new = this.visa_detail.filter((word) => word.emp_id == empid_in_function);
      var id_first_check = data_new[ 0 ].id;
      this.visa_detail.forEach((e) => {
        if (e.id == id_first_check) {
          e[ 'check_action' ] = true;
        } else {
          e[ 'check_action' ] = false;
        }
        if (e.visa_card_id == '' || isNaN(e.visa_card_id) == true) {
          e.visa_card_id = visamax();
        }

        e[ 'visa_nationality_new' ] = filter_nationality(e.visa_nationality, 'id_name');

        function formatDate(date) {
          var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + (d.getDate() + 1),
            year = d.getFullYear();

          if (month.length < 2) month = '0' + month;
          if (day.length < 2) day = '0' + day;

          return [ year, month, day ].join('-');
        }
        var xdate1 = formatDate(e.visa_valid_until).toString();

        var montF = new DatePipe('en-US');
        try {
          var dx1 = montF.transform(xdate1, 'dd MMM yyyy');
        } catch (err) {
          var dx1 = '';
        }

        e[ 'Datefrom' ] = dx1;
      });

      var visa = this.visa_detail.filter((word) => word.check_action == true);
      this.visa_code_img = visa[ 0 ].id;

      // !! check startus ว่าเป็น admin หรือ user
      if (data.user_admin === false) {
        this.status = false;
        //@ts-ignore
        const {profile} = {profile: this.profile[ 0 ]};
        console.log('Getprofile');
        console.log(profile);
        this.empid = profile.empId;
        this.personal_name = profile.empName;
        let finduser = data.emp_list.find(({emp_id}) => emp_id === profile.empId);
        finduser && (this.show_button = this.getBoolean(finduser.status_trip_cancelled) ? false : true);
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
        const {emp_id, userSelected, status_trip_cancelled} = useAuth(data, userSelect);
        this.empid = emp_id;
        this.show_button = this.getBoolean(status_trip_cancelled) ? false : true;
        this.appMain.userSelected = userSelected;
        this.status = true;
      }
      // !! check startus ว่าเป็น admin หรือ user

      // !! ถ้า update VIEW  จังหวะ  afterviewจะ ERROR ต้องมาใส่ตอน oninit
      let bcheck = this.visa_detail.filter(
        (item) => this.getBoolean(item.visa_active_in_doc) && this.empid === item.emp_id && item.action_type != 'delete'
      );
      if (bcheck.length < 1) {
        // ถ้าไม่มีข้อมูลจะเข้า case นี้
        const NewRow = this.UpdateDetailNull();
      }
      // !! ถ้า update VIEW  จังหวะ  afterviewจะ ERROR ต้องมาใส่ตอน oninit
      console.log('END ONLOAD');
      console.log(this.arrX, 'alldata');
      console.log(this.visa_detail, 'visa_detail');
      this.pdpa_wording = data.pdpa_wording ? data.pdpa_wording : this.pdpa_wording;
      console.log('END ONLOAD');
      if (this.isCanceled === true) {
        this.isCanceled = false;
        this.alert.swal_sucess('Successfully canceled');
      }
      this.appMain.isLoading = false;
      // this.CheckMtCounty = true;
    };

    this.ws.callWs(bodyX, 'LoadVisa').subscribe(
      (data) => onSuccess(data),
      (error) => {
        this.appMain.isLoading = false;
        console.log(error);
      }
    );
  }
  async assingData() {
    const {LoadEmployeeList, LoadMasterDataCountry, LoadMasterDataDOC, LoadMasterDataLocation, LoadVisa} =
      await this.onFetchAll();
    await this.OnloadDoc();
    // console.log(this.profile);
    const $LoadEmployeeList = (data) => {
      console.log('---load success---', 'LoadEmployeeList');
      console.log(data);
      if (data.after_trip.opt1 == 'true') {
        this.masterEmp = data.emp_list;
        this.allEmp = this.masterEmp;
      } else {
      }
    };
    const $LoadMasterDataCountry = (data): void => {
      console.log('country');
      console.log(data);
      this.visa_docountries = data.visa_docountries;
      this.appMain.isLoading = false;
    };
    const $LoadMasterDataDOC = (data) => {
      this.masterDoc = data.visa_document;
    };
    const $LoadMasterDataLocation = (data): void => {
      this.zone_select = data.master_zone;
      this.country_select = data.master_country;
      this.county_new_arr = data.master_country;
      this.country_list = data.master_country;
      this.country_list_All = [ ...data.master_country ];
    };
    const $LoadVisa = (data): void => {
      //? ? โหลดข้อมูลครั้งแรก
      this.H_detail.business_date = data.business_date;
      this.H_detail.travel_date = data.travel_date;
      this.H_detail.country_city = data.country_city;
      this.H_detail.travel_topic = data.travel_topic;

      this.arrX = data;
      this.arrX[ 'data_type' ] = 'save';
      let arr_filter,
        StatusX = false;
      var countryXX = '-';
      this.m_country = data.country_doc;
      this.country_doc = data.country_doc;
      this.empid = data.emp_list[ 0 ].emp_id;

      //!!  หา group ประเทศที่จะไป
      const Filteremp = (item) => item.emp_id === this.empid;
      const countrygroup = data.country_doc.filter(Filteremp).map((item) => item.country_id);
      this.country_group = [ ...countrygroup ];
      //!!  หา group ประเทศที่จะไป
      //debugger;
      console.log(this.visa_docountries);
      arr_filter = this.visa_docountries.filter((word) => countrygroup.includes(word.country_id));
      // console.clear();
      console.log(arr_filter);
      console.log('filter');
      if (arr_filter.length <= 0) {
        StatusX = true;
      }

      // !! check startus ว่าประเทศ มีใน master ไหม
      this.CheckMtCounty = StatusX ? true : false;
      if (this.personer === 'personal') {
        this.CheckMtCounty = false;
      }
      // !! check startus ว่าประเทศ มีใน master ไหม

      this.mail_list = data.mail_list;
      this.visa_detail = data.visa_detail;

      this.status = true;
      this.doc_id = data.doc_id;
      //this.empid = data.emp_id;
      this.img_list = data.img_list;
      this.emp_list = data.emp_list;
      this.personal_name = this.emp_list[ 0 ].userDisplay;

      function datenow() {
        //let dateFormat = require('dateformat');
        var montF = new DatePipe('en-US');
        let now = new Date();
        var montx = montF.transform(now, 'dd MMM yyyy');
        return montx;
      }

      this.img_list.forEach((e) => {
        if (e.path == 'path') {
          e.modified_date = datenow();
        }
        e.active_type = this.getBoolean(e.active_type);
        e[ 'statusTypexFile' ] = e.active_type;
        e[ 'fileStatus' ] = false;
      });
      var ii = 0;
      this.numAutoRun = ii;
      this.EditStatus = false;
      this.appMain.isLoading = false;

      function getMaxIn(arr, prop) {
        var max;
        for (var i = 0; i < arr.length; i++) {
          if (max == null || parseInt(arr[ i ][ prop ]) > parseInt(max[ prop ])) max = arr[ i ];
        }
        //if ( max == "") { max = 0;}
        return max;
      }
      var visa_detailx = this.visa_detail;
      function visamax() {
        var re;
        var data_max = getMaxIn(visa_detailx, 'visa_card_id');

        // if (parseInt(data_max.visa_card_id + 1) == NaN || isNaN(parseInt(data_max.visa_card_id) + 1) == true) {
        //   re = 1001;
        // } else {
        //   re = parseInt(data_max.visa_card_id) + 1;
        // }
        return '' + re + '';
      }

      var contryX = this.country_list;
      function filter_nationality(valueX, typeC) {
        //debugger;
        var visa;
        if (valueX != '' && valueX != 'undefined' && valueX != undefined) {
          if (typeC == 'id_name') {
            visa = contryX.filter((word) => word.id == valueX);
            return visa[ 0 ].name;
          } else {
            visa = contryX.filter((word) => word.name == valueX);
            return visa[ 0 ].id;
          }
        } else {
          return '';
        }
      }
      var empid_in_function = this.empid;
      var data_new = this.visa_detail.filter((word) => word.emp_id == empid_in_function);
      var id_first_check = data_new[ 0 ].id;
      this.visa_detail.forEach((e) => {
        if (e.id == id_first_check) {
          e[ 'check_action' ] = true;
        } else {
          e[ 'check_action' ] = false;
        }
        if (e.visa_card_id == '' || isNaN(e.visa_card_id) == true) {
          e.visa_card_id = visamax();
        }

        e[ 'visa_nationality_new' ] = filter_nationality(e.visa_nationality, 'id_name');

        function formatDate(date) {
          var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + (d.getDate() + 1),
            year = d.getFullYear();

          if (month.length < 2) month = '0' + month;
          if (day.length < 2) day = '0' + day;

          return [ year, month, day ].join('-');
        }
        var xdate1 = formatDate(e.visa_valid_until).toString();

        var montF = new DatePipe('en-US');
        try {
          var dx1 = montF.transform(xdate1, 'dd MMM yyyy');
        } catch (err) {
          var dx1 = '';
        }

        e[ 'Datefrom' ] = dx1;
      });

      var visa = this.visa_detail.filter((word) => word.check_action == true);
      this.visa_code_img = visa[ 0 ].id;

      // !! check startus ว่าเป็น admin หรือ user
      if (data.user_admin === false) {
        this.status = false;
        //@ts-ignore
        const {profile} = {profile: this.profile[ 0 ]};
        console.log('Getprofile');
        console.log(profile);
        this.empid = profile.empId;
        this.personal_name = profile.empName;
      }
      // !! check startus ว่าเป็น admin หรือ user

      // !! ถ้า update VIEW  จังหวะ  afterviewจะ ERROR ต้องมาใส่ตอน oninit
      let bcheck = this.visa_detail.filter(
        (item) => this.getBoolean(item.visa_active_in_doc) && this.empid === item.emp_id && item.action_type != 'delete'
      );
      if (bcheck.length < 1) {
        // ถ้าไม่มีข้อมูลจะเข้า case นี้
        const NewRow = this.UpdateDetailNull();
      }
      // !! ถ้า update VIEW  จังหวะ  afterviewจะ ERROR ต้องมาใส่ตอน oninit
      console.log('END ONLOAD');
      console.log(this.arrX, 'alldata');
      console.log(this.visa_detail, 'visa_detail');
      console.log('END ONLOAD');
      this.appMain.isLoading = false;
    };
    console.log(LoadVisa);
    console.log(this.visa_docountries);
    $LoadEmployeeList(LoadEmployeeList);
    $LoadMasterDataDOC(LoadMasterDataDOC);
    $LoadMasterDataCountry(LoadMasterDataCountry);
    $LoadMasterDataLocation(LoadMasterDataLocation);
    $LoadVisa(LoadVisa);
  }
  get docStatus() {
    return (Status: number) => {
      let emp_id = this.empid;
      let id: number = 1;
      if (this.emp_list.length > 0) {
        // TEST
        // this.emp_list.forEach((i) => (i.doc_status_id = '2'));
        let dt = this.emp_list.find((item) => item.emp_id === emp_id);
        if (dt) {
          id = Number(dt.doc_status_id);
          if (Status === id) {
            this.TrackingStatus[ Status ] = true;
          }
        }
      }
      return this.TrackingStatus[ Status ];
    };
  }

  model_action_change(id) {
    this.visa_detail.forEach(function (e) {
      if (e.id == id) {
        e.action_change = 'true';
      }
    });
  }

  deleterow(id, visa_id) {
    if (this.CheckMtCounty != true) {
      this.alert.swal_confrim_delete('').then((val) => {
        if (val.isConfirmed) {
          this.visa_detail.forEach(function (e) {
            if (e.id == id) {
              e.action_type = 'delete';
              e.action_change = 'true';
            }
          });

          this.img_list.forEach(function (e) {
            if (e.id_level_1 == id && e.actionname !== '') {
              e.action_type = 'delete';
              e.action_change = 'true';
            }
          });

          var data_new = this.visa_detail.filter((word) => word.emp_id == this.empid);
          data_new = data_new.filter((word) => word.action_type != 'delete');
          if (data_new.length <= 0) {
            let becheck = this.UpdateDetailNull();
            // this.addrow();
          }

          //this.before_ChangUser = true;
        } else {
          return;
        }
      });
    } else {
      return;
    }
  }

  download_file_check(visa_id, empid) {
    if (this.CheckMtCounty != true) {
      function downloadFile_In_Function(url, filename) {
        let Regex = /.[A-Za-z]{3}$/;
        let fullurl = url.match(Regex);
        let file_name = filename;
        // fs.saveAs(url, file_name);
      }
      console.log(this.img_list);
      let download_file_status = false;
      var emp_listD = this.emp_list;
      let list_country = [];
      this.img_list.forEach((e) => {
        if (e.emp_id == empid && e.actionname != 'visa_page' && e.action_type != 'delete') {
          if (e.active_type == true || e.active_type == 'true') {
            let Regex: RegExp = /EMPLOYEE_LETTER/g;
            if (Regex && Regex.test(e.filename)) {
              list_country.push(e.filename.replace(/EMPLOYEE_LETTER_/g, '').replace(/\.docx/g, ''));
              var data_emp = emp_listD.filter((word) => word.emp_id == empid);
              download_file_status = true;
            } else {
              downloadFile_In_Function(e.path + e.filename, e.filename);
            }
          }
        }
      });
      if (download_file_status) {
        this.EmployeeLetter(list_country);
        download_file_status = false;
      }
    } else {
      return;
    }
  }

  deleterow_img_check() {
    if (this.CheckMtCounty != true) {
      var eempid = this.empid;
      console.log('this.img_list' + ' ' + ' Delete 1');
      console.log(this.img_list);
      var re_value = 'false';

      this.img_list.forEach((e) => {
        if (e.emp_id == eempid) {
          if (e.active_type == true || e.active_type == 'true') {
            if (/EMPLOYEE_LETTER/g.test(e.filename)) {
              re_value = 'true';
            }
          }
        }
      });

      if (re_value == 'true') {
        this.alert.swal_warning('Unable to delete the EMPLOYEE_LETTER.docx file.');
        return;
      } else {
        this.alert.swal_confrim_delete('').then((val) => {
          if (val.isConfirmed) {
            this.img_list.forEach((e) => {
              if (e.emp_id == eempid) {
                if (e.active_type == true || e.active_type == 'true') {
                  e.action_type = 'delete';
                  e.action_change = 'true';
                }
              }
            });
          } else {
            return;
          }
        });
      }

      console.log('this.img_list' + ' ' + ' Delete 2');
      console.log(this.img_list);
    } else {
      return;
    }
  }

  deleterow_img(id) {
    if (this.CheckMtCounty != true) {
      this.alert.swal_confrim_delete('').then((val) => {
        if (val.isConfirmed) {
          this.img_list.forEach(function (e) {
            let Regex: RegExp = /EMPLOYEE_LETTER/g; //return true/false
            if (e.id == id && !Regex.test(e.filename)) {
              e.action_type = 'delete';
              e.action_change = 'true';
            }
          });
          console.log(this.img_list);

          //this.before_ChangUser = true;
        } else {
          return;
        }
      });
    } else {
      return;
    }

    console.clear();
    console.log(id);
    console.log(this.img_list);
  }

  data_retune() {
    var datrf = this.visa_detail.filter((word) => word.emp_id == this.empid);
    var re = datrf.filter((word) => word.action_type != 'delete');
    console.log(re);
    var ds = re.sort(function (a, b) {
      return parseInt(a.id) - parseInt(b.id);
    });
    return re[ re.length - 1 ].id;
  }

  addrow(type?) {
    if (this.CheckMtCounty != true) {
      var data_max = this.getMax(this.visa_detail, 'id');
      var data_max2 = this.getMax(this.visa_detail, 'visa_card_id');
      //var visa_max = this.getMax(this.visa_detail, 'visa_card_id');
      this.visa_detail.push({
        doc_id: this.doc_id,
        emp_id: this.empid,
        id: parseInt(data_max.id) + 1,
        visa_place_issue: '',
        visa_valid_from: '',
        visa_valid_to: '',
        visa_valid_until: '',
        visa_type: '',
        visa_category: '',
        visa_entry: '',
        visa_name: '',
        visa_active_in_doc: 'true',
        visa_surname: '',
        visa_date_birth: '',
        visa_nationality: '',
        visa_nationality_new: '',
        passport_no: '',
        visa_sex: '',
        visa_authorized_signature: '',
        visa_remark: '',
        visa_card_id: '' + (parseInt(data_max2.visa_card_id) + 1) + '',
        visa_serial: '',
        default_type: 'false',
        default_action_change: 'false',
        action_type: 'insert',
        action_change: type ? 'false' : 'true',
        check_action: false,
      });
    } else {
      return;
    }
  }

  onFileSelect(event, id_visa, emp, type_name) {
    if (this.CheckMtCounty != true) {
      this.emp_list.forEach((x) => {
        if (x.emp_id == emp) {
          this.Modified_by = x.division;
        }
      });
      this.actiontype_name = type_name;
      this.id_uploadFile = id_visa;
      this.selectedFile = <File>event.target.files[ 0 ];
      console.log(' ///****/////****/// ');
      console.log(id_visa);
      console.log(event);
      console.log(this.selectedFile);
      this.onUpload();
    } else {
      return;
    }
  }

  onUpload() {
    this.appMain.isLoading = true;
    const onSuccess = (res) => {
      this.appMain.isLoading = false;

      var today = new Date();
      var dd = String(today.getDate()).padStart(2, '0');
      var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
      var yyyy = today.getFullYear();

      var todayStr = mm + '/' + dd + '/' + yyyy;
      var montF = new DatePipe('en-US');
      var dx = montF.transform(todayStr, 'dd MMM yyyy');
      console.log(dx);
      console.log('------------- Date Str --------------');
      console.log(todayStr);
      var idMax = parseInt(this.getMax(this.img_list, 'id').id);
      var emp = localStorage[ 'token' ];
      this.img_list.push({
        doc_id: res.img_list.doc_id,
        emp_id: this.empid,
        id: idMax + 1,
        path: res.img_list.path,
        filename: res.img_list.filename,
        pagename: res.img_list.pagename,
        id_level_1: this.id_uploadFile,
        id_level_2: '',
        actionname: this.actiontype_name,
        status: '',
        modified_date: dx.toUpperCase(),
        modified_by: res.img_list.modified_by,
        action_type: 'insert',
        action_change: 'true',
        statusTypexFile: false,
        fileStatus: false,
      });

      $('#file_id').val('');
      $('#file_id2').val('');
      //this.alert.toastr_sucess('');
      this.alert.toastr_warning('Please Save Data');
      this.actiontype_name = '';
      this.id_uploadFile = '';
      console.log(this.visa_detail);
      console.log(this.img_list);
      console.log(res);
    };
    //var login_token = localStorage["token"] ;
    // this.empid.toString()
    //console.log(login_token);
    //this.empid.toString()
    var emp = this.empid.toString();
    var token = localStorage[ 'token' ];
    this.postFile(this.selectedFile, this.doc_id, this.pagename, emp, token).subscribe(
      (res) => onSuccess(res),
      (error) => {
        this.appMain.isLoading = false;
      }
    );
  }

  file_emp: string;
  postFile(
    fileToUpload: File,
    file_doc: string,
    file_page: string,
    file_emp: string,
    file_token_login: string
  ): Observable<any> {
    const endpoint = 'UploadFile';
    const fd = new FormData();
    fd.append('file', fileToUpload);
    fd.append('file_doc', file_doc);
    fd.append('file_page', file_page);
    fd.append('file_emp', file_emp);
    fd.append('file_token_login', file_token_login);
    return this.http.post<any>(this.ws.baseUrl + endpoint, fd);
  }

  onSelectProvince(event, id) {
    console.log(event);
    this.model_action_change(id);
  }

  check_action_type(id) {
    this.img_list.forEach((e) => {
      if (e.id == id) {
        e.action_change = 'true';
      }
    });
    console.log(this.img_list);
  }

  check_action(item, type: any) {
    // console.log(item)
    var bcheck = false;
    if (item.action_type == 'delete') {
      bcheck = true;
    }
    if (item.emp_id != this.emp_id) {
      bcheck = true;
    }
    if (item.id_level_1 != type && item.id_level_1 != null) {
      return true;
    }
    if (type != 'photo') {
      if (item.filename == null || item.filename == '') {
        bcheck = true;
      }
    }
    return bcheck;
  }

  swal_confrim(type_data, btntext) {
    return Swal.fire({
      //title: "Do you want to save the " + type_data + " ?",
      title: type_data,
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      confirmButtonText: btntext,
    });
  }

  EditFunction() { }

  AddVisaFunction() {
    var data_max = this.getMax(this.visa_detail, 'id');
    var visa_max = this.getMax(this.visa_detail, 'visa_card_id');
    var num_visa_id;
    if (visa_max.visa_card_id == '') {
      num_visa_id = 1;
    } else {
      num_visa_id = parseInt(visa_max.visa_card_id) + 1;
    }
    this.visa_detail.push({
      doc_id: this.doc_id,
      emp_id: this.empid,
      id: parseInt(data_max.id) + 1,
      visa_place_issue: this.visa_detail_input[ 0 ].visa_place_issue,
      visa_valid_from: this.visa_detail_input[ 0 ].visa_valid_from,
      visa_valid_to: this.visa_detail_input[ 0 ].visa_valid_to,
      visa_valid_until: this.visa_detail_input[ 0 ].visa_valid_until,
      visa_type: this.visa_detail_input[ 0 ].visa_type,
      visa_category: this.visa_detail_input[ 0 ].visa_category,
      visa_entry: this.visa_detail_input[ 0 ].visa_entry,
      visa_name: this.visa_detail_input[ 0 ].visa_name,
      visa_surname: this.visa_detail_input[ 0 ].visa_surname,
      visa_date_birth: this.visa_detail_input[ 0 ].visa_date_birth,
      visa_nationality: this.visa_detail_input[ 0 ].visa_nationality,
      passport_no: this.visa_detail_input[ 0 ].passport_no,
      visa_sex: this.visa_detail_input[ 0 ].visa_sex,
      visa_authorized_signature: this.visa_detail_input[ 0 ].visa_authorized_signature,
      visa_remark: this.visa_detail_input[ 0 ].visa_remark,
      visa_card_id: parseInt(data_max.id) + 1 + 1000,
      visa_serial: this.visa_detail_input[ 0 ].visa_serial,
      default_type: '',
      default_action_change: 'true',
      action_type: 'insert',
      action_change: 'true',
    });

    this.arrX[ 'visa_detail' ] = this.visa_detail;
    console.log(this.arrX);

    const onSuccess = (data): void => {
      //this.visa_detail = data.visa_detail ;
      console.log(data);
      this.onloadX();
    };

    this.ws.callWs(this.arrX, 'SaveVisa').subscribe(
      (data) => onSuccess(data),
      (error) => {
        this.appMain.isLoading = false;
        console.log(error);
      }
    );

    // console.log(data_max);
    this.closeModal.nativeElement.click();
  }

  editFunction() {
    if (this.disble_inp == false) {
      this.disble_inp = true;
    } else {
      this.disble_inp = false;
    }
  }

  changemodel(id) {
    this.visa_detail.forEach((e) => {
      if (e.id == id) {
        e.action_change = 'true';
      }
    });

    this.editFunction();
  }

  Delete_visa(id) {
    this.visa_detail.forEach((e) => {
      if (e.id == id) {
        e.action_change = 'true';
        e.action_type = 'delete';
      }
    });
  }

  modeldelete() {
    this.visa_detail.forEach((e) => {
      if (e.doc_id == this.doc_id) {
        if (e.emp_id == this.empid) {
          e.action_type = 'delete';
          e.action_change = 'true';
        }
      }
    });
  }

  id_after;

  async ConfrimSave() {
    try {
      // const actionSave = await this.alert.swal_confrim_changes('Do you want to save the document ?');
      // if (actionSave.isConfirmed) {
      //   this.SaveFunction();
      // } else {
      //   return;
      // }
      this.SaveFunction();
    } catch (ex) {
      console.log(ex);
    }
  }
  async SaveFunction() {
    this.appMain.isLoading = true;
    //this.visa_detail[index].action_type = "insert";
    //this.visa_detail[index].default_type = "true",
    //this.visa_detail[index].action_type = "delete";
    /* try{ */
    let UpdateIMG = false;
    let UpdateVISA = false;
    var contryX = this.country_list_All;
    function filter_nationality(valueX, typeC) {
      var visa;
      if (valueX != '' && valueX != 'undefined') {
        if (typeC == 'id_name') {
          visa = contryX.filter((word) => word.id == valueX);
          return visa[ 0 ].name;
        } else {
          var set_val;
          if (typeof valueX == 'object') {
            set_val = valueX.name;
            visa = contryX.filter((word) => word.name == set_val);
          } else {
            set_val = valueX;
            visa = contryX.filter((word) => word.name == valueX);
          }
          return visa[ 0 ].id;
        }
      } else {
        return '';
      }
    }

    console.log('First xxx');
    console.log(this.arrX);

    this.visa_detail.forEach((e) => {
      if (e.check_action == true) {
        this.id_after = e.id;
      }
      if (e.emp_id === this.empid) {
        if (e.action_change === 'true') {
          UpdateVISA = true;
        }
      }
      function datePlusday4(values) {
        if (values == '' || values == null) {
          return '';
        }
        var montF = new DatePipe('en-US');
        var dx = montF.transform(values, 'dd MMM yyyy');
        console.log(dx);
        return dx;
      }

      let day1 = e.Datefrom;

      if (day1 != '') {
        if (typeof e.Datefrom === 'object') {
          e.visa_valid_until = datePlusday4(day1);
        } else {
          e.visa_valid_until = e.visa_valid_until;
        }
      }

      let nation = e.visa_nationality;
      // if (nation != '' || nation != []) {
      //   if (e.visa_nationality.id == 'undefined') {
      //     e.visa_nationality = e.visa_nationality;
      //   } else {
      //     e.visa_nationality = e.visa_nationality.id;
      //   }
      // } else {
      //   e.visa_nationality = '';
      // }

      e.visa_nationality = filter_nationality(e.visa_nationality_new, '');
    });
    await this.getPathNameEmployeeLetter();
    console.log(this.PATHGROUP, 'PATHGROUP');

    var eempid = this.empid;
    this.img_list.forEach((e) => {
      if (e.action_change === 'true') {
        UpdateIMG = true;
      }
      if (/EMPLOYEE_LETTER/g.test(e.filename)) {
        e.action_change = 'false';
        e.action_type = 'update';
      }
    });

    this.emp_list.forEach((item) => {
      item.mail_status = 'false';

      if (item.emp_id === this.empid) {
        item.mail_status = 'true';
      }
    });
    this.arrX[ 'mail_list' ].forEach((item) => {
      if (item.emp_id === this.empid) {
        if (this.PATHGROUP.length > 0) {
          if (UpdateVISA || UpdateIMG) {
            item.mail_attachments = this.PATHGROUP.join(';');
            item.action_change = 'true';
          }
        }
      }
    });
    this.arrX[ 'visa_detail' ] = this.visa_detail;
    this.arrX[ 'emp_list' ] = this.emp_list;
    this.arrX[ 'img_list' ] = this.img_list;
    this.arrX[ 'data_type' ] = 'save';
    // console.log(CloneDeep(this.arrX), 'CloneDeep');

    const onSuccess = (data): void => {
      console.log('load - after save');
      console.log(data);
      this.arrX[ 'mail_list' ].forEach((item) => {
        if (item.emp_id === this.emp_id) {
          item.mail_attachments = null;
          item.action_change = 'false';
        }
      });
      if (data.after_trip.opt1 == 'true') {
        if (data.after_trip.opt1 == 'true') {
          if (data.after_trip.opt2.status != 'Successfully saved') {
            data.after_trip.opt2.status = 'Successfully saved';
          }
        }
        // this.alert.swal_sucess(data.after_trip.opt2.status);
        var idd = this.id_after;

        console.log('x -- x - x -- x');
        console.log(idd);

        this.checkboxActive(idd);
        this.visa_detail = data.visa_detail;
        this.emp_list = data.emp_list;
        this.img_list = data.img_list;

        console.log('load - after this.img_list');
        console.log(this.img_list);

        this.visa_detail.forEach((e) => {
          function formatDate(date) {
            var d = new Date(date),
              month = '' + (d.getMonth() + 1),
              day = '' + (d.getDate() + 1),
              year = d.getFullYear();

            if (month.length < 2) month = '0' + month;
            if (day.length < 2) day = '0' + day;

            return [ year, month, day ].join('-');
          }
          var xdate1 = formatDate(e.visa_valid_until).toString();

          var montF = new DatePipe('en-US');
          try {
            var dx1 = montF.transform(xdate1, 'dd MMM yyyy');
          } catch (err) {
            var dx1 = '';
          }

          e[ 'Datefrom' ] = dx1;
        });

        function datenow() {
          //let dateFormat = require('dateformat');
          var montF = new DatePipe('en-US');
          let now = new Date();
          var montx = montF.transform(now, 'dd MMM yyyy');
          return montx;
        }

        this.img_list.forEach((e) => {
          if (e.path == 'path') {
            e.modified_date = datenow();
          }
          e.active_type = this.getBoolean(e.active_type);
          e[ 'statusTypexFile' ] = e.active_type;
          e[ 'fileStatus' ] = false;
        });

        function getMaxIn(arr, prop) {
          var max;
          for (var i = 0; i < arr.length; i++) {
            if (max == null || parseInt(arr[ i ][ prop ]) > parseInt(max[ prop ])) max = arr[ i ];
          }
          //if ( max == "") { max = 0;}
          return max;
        }
        var visa_detailx = this.visa_detail;
        function visamax() {
          var data_max = getMaxIn(visa_detailx, 'visa_card_id');
          return '' + (parseInt(data_max.visa_card_id) + 1) + '';
        }

        var empid_in_function = this.empid;
        var data_new = this.visa_detail.filter((word) => word.emp_id == empid_in_function);

        var visa_code = this.visa_code_img;
        this.visa_detail.forEach((e) => {
          if (e.id == visa_code) {
            e[ 'check_action' ] = true;
          } else {
            e[ 'check_action' ] = false;
          }
          if (e.visa_card_id == '') {
            e.visa_card_id = visamax();
          }

          e[ 'visa_nationality_new' ] = filter_nationality(e.visa_nationality, 'id_name');
        });

        // !! ถ้า update VIEW  จังหวะ  afterviewจะ ERROR ต้องมาใส่ตอน oninit
        let bcheck = this.visa_detail.filter(
          (item) =>
            this.getBoolean(item.visa_active_in_doc) && this.empid === item.emp_id && item.action_type != 'delete'
        );
        if (bcheck.length < 1) {
          // ถ้าไม่มีข้อมูลจะเข้า case นี้
          const NewRow = this.UpdateDetailNull();
        }
        // !! ถ้า update VIEW  จังหวะ  afterviewจะ ERROR ต้องมาใส่ตอน oninit
        // this.alert.swal_sucess('');
        this.alert.swal_sucess(data.after_trip.opt2.status);

        this.emp_list = data.emp_list;
        this.TrackingStatus = {...InitTrackStatus};
        this.pdpa_wording = data.pdpa_wording ? data.pdpa_wording : this.pdpa_wording;
      } else {
        this.alert.swal_error('');
      }
      this.PATHGROUP = [];
      this.appMain.isLoading = false;
    };

    console.log('before save');
    console.log(CloneDeep(this.arrX), 'CloneDeep');
    this.ws.callWs(this.arrX, 'SaveVisa').subscribe(
      (data) => onSuccess(data),
      (error) => {
        this.appMain.isLoading = false;
        console.log(error);
      }
    );
  }
  deepClone(obj) {
    if (typeof obj === 'object') {
      return JSON.parse(JSON.stringify(obj));
    }
    return null;
  }

  // ใช้สำหรับเส้น send mail
  Saveaction() {
    return new Promise((resolve, reject) => {
      this.appMain.isLoading = true;
      var contryX = this.country_list_All;
      function filter_nationality(valueX, typeC) {
        var visa;
        if (valueX != '' && valueX != 'undefined') {
          if (typeC == 'id_name') {
            visa = contryX.filter((word) => word.id == valueX);
            return visa[ 0 ].name;
          } else {
            var set_val;
            if (typeof valueX == 'object') {
              set_val = valueX.name;
              visa = contryX.filter((word) => word.name == set_val);
            } else {
              set_val = valueX;
              visa = contryX.filter((word) => word.name == valueX);
            }
            return visa[ 0 ].id;
          }
        } else {
          return '';
        }
      }

      this.visa_detail.forEach((e) => {
        if (e.check_action == true) {
          this.id_after = e.id;
        }

        function datePlusday4(values) {
          if (values == '' || values == null) {
            return '';
          }
          var montF = new DatePipe('en-US');
          var dx = montF.transform(values, 'dd MMM yyyy');
          console.log(dx);
          return dx;
        }

        let day1 = e.Datefrom;

        if (day1 != '') {
          if (typeof e.Datefrom === 'object') {
            e.visa_valid_until = datePlusday4(day1);
          } else {
            e.visa_valid_until = e.visa_valid_until;
          }
        }

        let nation = e.visa_nationality;
        // if (nation != '' || nation != []) {
        //   if (e.visa_nationality.id == 'undefined') {
        //     e.visa_nationality = e.visa_nationality;
        //   } else {
        //     e.visa_nationality = e.visa_nationality.id;
        //   }
        // } else {
        //   e.visa_nationality = '';
        // }

        e.visa_nationality = filter_nationality(e.visa_nationality_new, '');
      });

      this.img_list.forEach((e) => {
        if (/EMPLOYEE_LETTER/g.test(e.filename)) {
          e.action_change = 'false';
          e.action_type = 'update';
        }
      });
      this.emp_list.forEach((item) => {
        item.mail_status = 'false';

        if (item.emp_id === this.empid) {
          item.mail_status = 'true';
        }
      });
      this.getPathNameEmployeeLetter();
      this.arrX[ 'mail_list' ].forEach((item) => {
        if (item.emp_id === this.empid) {
          if (this.PATHGROUP.length > 0) {
            item.mail_attachments = this.PATHGROUP.join(';');
            item.action_change = 'true';
          }
        }
      });
      this.arrX[ 'data_type' ] = 'save';
      this.arrX[ 'visa_detail' ] = this.visa_detail;
      this.arrX[ 'emp_list' ] = this.emp_list;
      this.arrX[ 'img_list' ] = this.img_list;
      console.log('before save');
      console.log(CloneDeep(this.arrX));

      const onSuccess = (data): void => {
        console.log('load - after save');
        console.log(data);
        if (data.after_trip.opt1 == 'true') {
          if (data.after_trip.opt1 == 'true') {
            if (data.after_trip.opt2.status != 'Update data successfully.') {
              data.after_trip.opt2.status = 'Update data successfully.';
            }
          }
          var idd = this.id_after;

          console.log(idd);

          this.checkboxActive(idd);
          this.visa_detail = data.visa_detail;
          this.emp_list = data.emp_list;
          this.img_list = data.img_list;

          console.log('load - after this.img_list');
          console.log(this.img_list);

          this.visa_detail.forEach((e) => {
            function formatDate(date) {
              var d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + (d.getDate() + 1),
                year = d.getFullYear();

              if (month.length < 2) month = '0' + month;
              if (day.length < 2) day = '0' + day;

              return [ year, month, day ].join('-');
            }
            var xdate1 = formatDate(e.visa_valid_until).toString();

            var montF = new DatePipe('en-US');
            try {
              var dx1 = montF.transform(xdate1, 'dd MMM yyyy');
            } catch (err) {
              var dx1 = '';
            }

            e[ 'Datefrom' ] = dx1;
          });

          function datenow() {
            //let dateFormat = require('dateformat');
            var montF = new DatePipe('en-US');
            let now = new Date();
            var montx = montF.transform(now, 'dd MMM yyyy');
            return montx;
          }

          this.img_list.forEach((e) => {
            if (e.path == 'path') {
              e.modified_date = datenow();
            }
            e.active_type = this.getBoolean(e.active_type);
            e[ 'statusTypexFile' ] = e.active_type;
            e[ 'fileStatus' ] = false;
          });

          function getMaxIn(arr, prop) {
            var max;
            for (var i = 0; i < arr.length; i++) {
              if (max == null || parseInt(arr[ i ][ prop ]) > parseInt(max[ prop ])) max = arr[ i ];
            }
            //if ( max == "") { max = 0;}
            return max;
          }
          var visa_detailx = this.visa_detail;
          function visamax() {
            var data_max = getMaxIn(visa_detailx, 'visa_card_id');
            return '' + (parseInt(data_max.visa_card_id) + 1) + '';
          }

          var visa_code = this.visa_code_img;
          this.visa_detail.forEach((e) => {
            if (e.id == visa_code) {
              e[ 'check_action' ] = true;
            } else {
              e[ 'check_action' ] = false;
            }
            if (e.visa_card_id == '') {
              e.visa_card_id = visamax();
            }

            e[ 'visa_nationality_new' ] = filter_nationality(e.visa_nationality, 'id_name');
          });

          this.TrackingStatus = {...InitTrackStatus};
          this.pdpa_wording = data.pdpa_wording ? data.pdpa_wording : this.pdpa_wording;
        } else {
        }

        this.appMain.isLoading = false;
        resolve(true);
      };

      this.ws.callWs(this.arrX, 'SaveVisa').subscribe(
        (data) => onSuccess(data),
        (error) => {
          this.appMain.isLoading = false;
          console.log(error);
          reject(error);
        },
        () => {
          this.appMain.isLoading = false;
          resolve(true);
        }
      );
    });
  }

  ModelActiveChange(i) {
    // this.CheckAdd_visa(i);
    this.visa_detail.forEach((e) => {
      if (e.doc_id == this.doc_id) {
        if (e.emp_id == this.empid) {
          if (i == e.id) {
            e.action_change = true;
          }
        }
      }
    });
  }
  //this.emp_list

  getMax(arr, prop) {
    var max;
    for (var i = 0; i < arr.length; i++) {
      if (max == null || parseInt(arr[ i ][ prop ]) > parseInt(max[ prop ])) max = arr[ i ];
    }
    //if ( max == "") { max = 0;}
    return max;
  }

  XorderBy() {
    //return this.visa_detail ;
    var NewDataSort = this.visa_detail.sort(function (a, b) {
      return parseInt(b.id) - parseInt(a.id);
    });
    //var NewDataSort = datax.sort(function (a, b) { return parseInt(a.id) - parseInt(b.id) });
    //console.log(NewDataSort);
    return NewDataSort;
  }

  StrBoolean(value) {
    var re = true;
    /*if(Boolean(value)) {
      re = true;
      }
      if(!Boolean(value)) {
        re = false;
      } */
    if (value == 'true') {
      // this evaluates to true correctly, myString is true
      re = true;
    } else if (value == 'false') {
      // this evaluates to false, also correct, since myString doesn't equal false.
      re = false;
    } else if (value == '') {
      re = false;
    } else {
      re = value;
    }

    //console.log(re)
    return re;
  }

  new_save() {
    const onSuccess = (data): void => {
      console.log(data);
      this.onloadX();
    };

    console.log(this.arrX);

    this.ws.callWs(this.arrX, 'SaveVisa').subscribe(
      (data) => onSuccess(data),
      (error) => {
        this.appMain.isLoading = false;
        console.log(error);
      }
    );
  }

  check_row(arr, empid) {
    var re;
    var data_new = arr.filter((word) => word.emp_id == empid);
    data_new = data_new.filter((word) => word.action_type != 'delete');

    if (data_new.length <= 0) {
      re = true;
    } else {
      re = false;
    }
    return re;
  }

  check_img(arr, visa_id) {
    var dt_arr;
    var data_new = arr.filter((word) => word.id_level_1 == visa_id);

    data_new = data_new.filter((word) => word.actionname == 'visa_page');
    dt_arr = data_new.filter((word) => word.action_type != 'delete');
    return dt_arr;
  }

  CheckAdd_visa(id) {
    var data_max = this.getMax(this.visa_detail, 'visa_card_id');
    this.visa_detail.forEach((e) => {
      if (e.id == id) {
        if (e.visa_card_id == '' || e.visa_card_id == null) {
          e.visa_card_id = parseInt(data_max.visa_card_id) + 1;
        }
      }
      e.default_type = this.StrBoolean(e.default_type);
    });
  }

  checkboxActive(id) {
    try {
      this.visa_detail.forEach((e) => {
        if (e.id == id) {
          e.check_action = true;
        } else {
          e.check_action = false;
        }
      });

      var visa = this.visa_detail.filter((word) => word.check_action == true);
      this.visa_code_img = visa[ 0 ].id;
    } catch (ex) {
      console.log(ex);
    }
  }

  setcssWidth() {
    try {
      const $elem = $('.ngx-dropdown-container .ngx-dropdown-list-container');
      $elem[ 0 ].style.setProperty('min-width', '100%', 'important');
      $elem[ 1 ].style.setProperty('max-width', '450px', 'important');
    } catch (err) { }
  }
  downloadFile( url : String , filename : string) {
    if (this.CheckMtCounty != true ) {
      let Regex = /.[A-Za-z]{3}$/;
      let fullurl = url.match(Regex);
      let file_name = filename;
    } else {
      return;
    }
  }
  // downloadFile(url, filename) {
  //   if (this.CheckMtCounty != true) {
  //     let Regex = /.[A-Za-z]{3}$/;
  //     let fullurl = url.match(Regex);
  //     //let fileType = fullurl[0];
  //     let file_name = filename;
  //     // fs.saveAs(url, file_name);
  //     //const blob = new Blob([], { type: 'text/csv' });
  //     //const url= window.URL.createObjectURL("http://tbkc-dapps-05.thaioil.localnet/ebiz_ws/Image/D001/transportation/00000910/1606366192767.jpg");
  //     //window.open("http://tbkc-dapps-05.thaioil.localnet/ebiz_ws/Image/D001/transportation/00000910/1606366192767.jpg");
  //   } else {
  //     return;
  //   }
  }

  // for Search Emp
  //#region  for Search Emp
  loadEmpList() {
    let bodyX = {
      token_login: localStorage[ 'token' ],
      filter_value: '',
    };

    this.appMain.isLoading = true;
    const onSuccess = (data) => {
      console.log('---load success---');
      console.log(data);
      if (data.after_trip.opt1 == 'true') {
        this.masterEmp = data.emp_list;
        this.appMain.isLoading = false;
        this.allEmp = this.masterEmp;
      } else {
        this.appMain.isLoading = false;
        console.log('---load Error---');
        // console.log(data);
        this.alert.swal_error(data.after_trip.opt2.status);
      }
    };
    this.ws.callWs(bodyX, 'LoadEmployeeList').subscribe(
      (data) => onSuccess(data),
      (error) => {
        this.appMain.isLoading = false;
        console.log(error);
      }
    );
  }

  //ถ้าไม่เลือกที่ autocomplete จะเข้า fn นี้
  add(event: MatChipInputEvent, type: string): void {
    // ////debugger
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

    console.log(this.MailList);
    console.log(this.MailListCC);
  }

  private _filter(value: any): any[] {
    //console.log(value);
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

  onClearEmail(maillist) {
    if (maillist) {
      maillist.forEach((item) => {
        item.action_change = 'false';
        item.mail_status = 'false';
        item.mail_cc = '';
        item.mail_emp_id = '';
        item.mail_to = '';
        item.mail_attachments = '';
      });
    }
  }
  async Config_Email_Send(emp_id) {
    this.modalRef.hide();
    await this.Saveaction();
    this.onClearEmail(this.mail_list);
    /* if(i == 1){
      this.mall_remark = 'Action1'
    }else { this.mall_remark = 'Action2' } */
    console.log(this.MailList);
    console.log(this.MailListCC);

    let ds = this;
    console.log(this.mail_list);
    console.log(ds);
    let bcheck_mailtoo = false;
    let bcheck_mailcc = false;
    if (ds.MailList.length > 0) {
      bcheck_mailtoo = true;
    } /*  */
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

      emp_all = STRMailEMPIDTO.concat(STRMailEMPIDCC).join(';');
      emp_all = emp_all + ';';
      //?? ส่งจากคนที่กด
      this.mail_list.forEach((e) => {
        if (e.emp_id == emp_id) {
          e.action_change = 'true';
          e.mail_status = 'true';
          e.mail_cc = STRMailCC;
          e.mail_to = STRMailTO;
          e.mail_emp_id = emp_all;
          status_Send = true;
        }
      });
      //?? ส่งจากคนที่กด

      this.modalRef.hide();

      ds.MailListCC = [];
      ds.MailList = [];
      if (status_Send) {
        this.Send_Email();
      }
      console.log(this.mail_list);
    } else {
      this.alert.swal_error('Not Have Email List');
    }
  }

  Send_Email() {
    //debugger;
    console.log('---- send email first----');
    console.log(this.visa_detail);
    this.visa_detail.forEach((e) => {
      function datePlusday4(values) {
        if (values == '' || values == null) {
          return '';
        }
        var montF = new DatePipe('en-US');
        var dx = montF.transform(values, 'dd MMM yyyy');
        console.log(dx);
        return dx;
      }

      let day1 = e.Datefrom;

      if (day1 != '') {
        if (typeof e.Datefrom === 'object') {
          e.visa_valid_until = datePlusday4(day1);
        } else {
          e.visa_valid_until = e.visa_valid_until;
        }
      }

      let nation = e.visa_nationality;
      // if (nation != '' && nation != [] && nation != 'undefined' && nation != undefined) {
      //   if (nation) {
      //     e.visa_nationality = e.visa_nationality;
      //   } else {
      //     e.visa_nationality = '';
      //   }
      //   if (false) {
      //     if (e.visa_nationality.name == 'undefined') {
      //       e.visa_nationality = e.visa_nationality;
      //     } else if (nation == 'undefined' && nation == undefined) {
      //       e.visa_nationality = '';
      //     } else {
      //       e.visa_nationality = e.visa_nationality.name;
      //     }
      //   }
      // } else {
      //   e.visa_nationality = '';
      // }
    });
    console.log('after update');
    console.log(this.visa_detail);
    const countrySelect = this.countrySelect.filter((v) => v.active).map(({id}) => id);

    this.appMain.isLoading = true;

    const onSuccess = (data) => {
      console.log(data);

      console.log(' return Email');
      console.log(data);
      if (data.after_trip.opt1 == 'true') {
        this.alert.swal_sucess('Send E-mail successfully.');

        data.emp_list.forEach((element) => {
          if (this.empid === element.emp_id) {
            element.doc_status_id = '3';
          }
        });
        this.emp_list = data.emp_list;
        this.arrX[ 'country_doc' ].forEach((element) => {
          element.action_change = '';
        });
      } else {
        this.alert.swal_error(data.after_trip.opt2.status);
      }

      this.appMain.isLoading = false;
    };

    console.log('after return Email');
    this.arrX[ 'visa_detail' ] = this.visa_detail;
    this.arrX[ 'mail_list' ] = this.mail_list;
    this.arrX[ 'country_doc' ].forEach((element) => {
      if (countrySelect.includes(element.country_id) && element.emp_id === this.empid) {
        element.action_change = 'true';
      }
    });
    let BodyX = this.arrX;

    //@ts-ignore
    BodyX.data_type = 'submit';

    let BodyXBEFOR = {...BodyX};
    // console.log(this.mail_list);
    console.log('---- send email ----', 'BodyXBEFOR');
    console.log(this.deepClone(BodyXBEFOR));
    this.ws.callWs(BodyX, 'SendMailVisa').subscribe(
      (data) => onSuccess(data),
      (error) => ((this.appMain.isLoading = false), console.log(error)),
      () => {
        //this.check_user();
        this.TrackingStatus = {...InitTrackStatus};
      }
    );
  }

  disble_modalRef() {
    this.region_new1 = [];
    this.id_detail_modal = [];
    this.modalRef.hide();
  }

  add_region() {
    //visa_detail
    /* this.region_new1 = [];
    this.id_detail_modal = []; */
    //console.log(this.region_new1);
    var id_detail = this.id_detail_modal;
    var data = this.region_new1;
    var re, re_name;

    if (typeof this.region_new1 === 'object') {
      //var data_newx = this.country_list.filter(word => word.id_level_1 == visa_detailx[0].visa_nationality);
      //this.region_new1 = [] ;

      re = this.region_new1[ 'id' ];
      re_name = this.region_new1[ 'name' ];
    } else {
      //var data_newx = this.country_list.filter(word => word.id_level_1 == visa_detailx[0].visa_nationality);
      //this.region_new1 = [];
      re = '';
      re_name = '';
    }

    this.visa_detail.forEach((e) => {
      if (e.id == id_detail) {
        e.action_change = 'true';
        e.visa_nationality = re;
        e.visa_nationality_new = re_name;
      }
    });
    //var visa_detailx = this.visa_detail.filter(word => word.id == id_detail);
    this.modalRef.hide();
    console.log(re);
    console.log(this.visa_detail);
    //var idx = this.id_detail_modal ;
  }

  region_new1 = [];
  id_detail_modal = [];
  get UserDetail() {
    return this.emp_list.filter((item) => item.emp_id === this.empid);
  }
  get UserMaintain(): boolean {
    let VisaDetail = this.visa_detail;
    let emp_id_ob = this.empid;
    let typeCheck = false;
    // console.log(VisaDetail, emp_id_ob);
    const CheckDetail = VisaDetail.filter(({visa_active_in_doc, emp_id, action_type}) => {
      return this.getBoolean(visa_active_in_doc) && emp_id === emp_id_ob && action_type != 'delete';
    });
    if (CheckDetail.length === 0) {
      typeCheck = true;
    }
    return typeCheck;
  }
  get Countryindoc(): Array<string> {
    const groupCountry: string[] = this.countryInDoc.map(({country_id}) => country_id);
    return groupCountry;
  }
  openModalz(template: TemplateRef<any>, id_detail) {
    const Allconurty = this.country_list_All;
    const userDetil = this.UserDetail[ 0 ];
    this.id_detail_modal = id_detail;
    var visa_detailx = this.visa_detail.filter((word) => word.id == id_detail);
    if (visa_detailx[ 0 ].visa_nationality == '') {
      this.region_new1 = [];
    } else {
      var data_newx = this.country_list_All.filter((word) => word.id == visa_detailx[ 0 ].visa_nationality);
      this.region_new1 = data_newx;
    }
    console.clear();
    const ChangeUser = this.empByDoc;
    let groupCountry = this.Countryindoc;
    const callback = (item) => groupCountry.includes(item.id);
    this.country_list = Allconurty.filter(callback);
    if (this.doc_id === 'personal') {
      this.country_list = Allconurty;
    }
    this.tp_clone = template;
    let config: object = {
      class: 'modal-md',
      animated: true,
      keyboard: false,
      ignoreBackdropClick: true,
    };

    this.modalRef = this.modalService.show(template, config);
    this.set_modal();
    setTimeout(function () {
      $('.multiselect-dropdown .dropdown-btn').css({border: '1px solid #ced4da', padding: '9px 12px'});
    }, 100);
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
    // // var configx = $("#exampleModalCenter").closest('.modal-backdrop').addClass('z-index:1100');
    // this.set_modal();
    // setTimeout(function () {
    //   $('.multiselect-dropdown .dropdown-btn').css({ border: '1px solid #ced4da', padding: '9px 12px' });
    // }, 100);
  }

  set_modal() {
    $('.modal-backdrop').css({'z-index': 700});
    $('.modal').css({'z-index': 800});
  }

  cancelFunction() {
    this.alert.swal_confrim_changes('Do you want to cancel the document ?').then((val) => {
      if (val.isConfirmed) {
        this.isCanceled = true;
        this.onloadX();
      } else {
        return;
      }
    });
  }

  sendMailMaster() {
    this.alert.swal_sucess('');
  }

  checkboxAll(val, emp) {
    console.log(val.target.checked);

    this.img_list.forEach((e) => {
      if (e.emp_id == emp) {
        e.fileStatus = val.target.checked;
        e.active_type = val.target.checked;
      }
    });
  }

  test_viewChild() {
    this.checkall.nativeElement.checked = true;
  }

  test_viewChild1() {
    this.img_list.forEach((e) => {
      e.action_type = 'delete';
      e.action_change = 'true';
    });
    //this.checkall.nativeElement.checked = false;
  }

  //img.actionname != 'visa_page'
  showitem(arr, code, empid) {
    var data_new = arr.filter((word) => word.emp_id == empid);
    data_new = data_new.filter((word) => word.actionname != 'visa_page');
    return data_new.length;
  }

  test_submit(check_id) {
    var contryX = this.country_list;
    function filter_nationality(valueX, typeC) {
      ////debugger;
      var visa;
      if (valueX != '' && valueX != 'undefined') {
        if (typeC == 'id_name') {
          visa = contryX.filter((word) => word.id == valueX);
          return visa[ 0 ].name;
        } else {
          visa = contryX.filter((word) => word.name == valueX);
          return visa[ 0 ].id;
        }
      } else {
        return '';
      }
    }

    //debugger;
    var StatusSave = [],
      indexx = 0;
    var SaveState = true;
    var result_data = this.visa_detail.filter((word) => word.emp_id == check_id);
    result_data.forEach((e) => {
      e.visa_nationality = filter_nationality(e.visa_nationality_new, '');
      var TextReWaring = '';
      if (e.visa_nationality == '' || e.visa_nationality == null) {
        TextReWaring = 'Nationality Data Invalid';
      }
      if (e.Datefrom == '' || e.Datefrom == null) {
        TextReWaring = 'Valid Until Data Invalid';
      }
      if (e.visa_type == '' || e.visa_type == null) {
        TextReWaring = 'Type Of VISA Invalid';
      }
      if (e.visa_entry == '' || e.visa_entry == null) {
        TextReWaring = 'No. Of Entry Data Invalid';
      }

      StatusSave[ indexx ] = false;
      if (TextReWaring == '') {
        StatusSave[ indexx ] = true;
      } else {
        this.alert.swal_warning('Please check the ' + TextReWaring);
      }
      indexx++;
      return StatusSave;
    });

    StatusSave.forEach((x) => {
      if (x == false) {
        SaveState = false;
      }
    });

    if (SaveState) {
      this.alert.swal_confrim_changes('do you want to submit').then((val) => {
        if (val.isConfirmed) {
          this.arrX[ 'data_type' ] = 'submit';
          this.SaveFunction();
        }
      });
    }
  }

  test_submit2() {
    this.alert.swal_confrim_changes('do you want to submit').then((val) => {
      if (val.isConfirmed) {
        this.arrX[ 'data_type' ] = 'sendmail_visa_requisition';
        this.SaveFunction();
      }
    });
  }

  test_submit2x(template: TemplateRef<any>) {
    const Allconurty = this.country_list_All;
    let config: object = {
      class: 'modal-md',
      animated: true,
      keyboard: false,
      ignoreBackdropClick: true,
    };
    let check_usermaintain: boolean = this.UserMaintain;
    if (this.CheckMtCounty) {
      this.alert.swal_warning('Please maintain country');
    } else {
      if (check_usermaintain) {
        console.log(check_usermaintain);
        this.alert.swal_warning('Please maintain country');
        return;
      }
      const ChangeUser = this.empByDoc;
      let groupCountry = this.Countryindoc;
      let countrySort = this.getCountryBYemp(this.H_detail.country_city);
      const callback = (item) => groupCountry.includes(item.id);
      const callback2 =
        (valuePrarent) =>
          ({name}) =>
            name.toLowerCase().trim() === valuePrarent.country.toLowerCase().trim();
      let conutryGroup: any[] = CloneDeep(Allconurty.filter(callback));
      let newResult = [];
      if (countrySort.length > 0) {
        for (let [ i, valuePrarent ] of countrySort.entries()) {
          let selectedCountry = conutryGroup.find(callback2(valuePrarent));
          if (selectedCountry) {
            newResult.push(selectedCountry);
          }
        }
      }
      this.countrySelect = newResult;
      this.modalRef = this.modalService.show(template, config);
      // var configx = $("#exampleModalCenter").closest('.modal-backdrop').addClass('z-index:1100');
      this.set_modal();
      setTimeout(function () {
        $('.multiselect-dropdown .dropdown-btn').css({border: '1px solid #ced4da', padding: '9px 12px'});
      }, 100);
    }
  }
  getCountryBYemp(country_city) {
    let obj = [];
    let ikey = 0;
    if (country_city.indexOf(',') > -1) {
      let arr = country_city.split(',');
      for (let str of arr) {
        var lengthx = str.length;
        var n = str.indexOf('/');
        let country = str.slice(0, n).trim();
        let city = str.slice(n + 1, lengthx).trim();
        obj[ ikey ] = {country, city};
        ikey++;
      }
      return obj;
    } else {
      let str = country_city;
      var lengthx = str.length;
      var n = str.indexOf('/');
      let country = str.slice(0, n).trim();
      let city = str.slice(n + 1, lengthx).trim();
      obj[ ikey ] = {country, city};
      return obj;
    }
  }
  checkCountryAttach(countryList): boolean {
    let countryChecked = countryList.filter(({active}) => active);
    let statusbtn = true;
    if (countryChecked && countryChecked.length > 0) {
      statusbtn = false;
    }
    return statusbtn;
  }
  searchString(country_city) {
    let obj = [];
    console.log(country_city);
    if (country_city.indexOf(',') > -1) {
      let arr = country_city.split(',');
      let ikey = 0;
      for (let str of arr) {
        var lengthx = str.length;
        var n = str.indexOf('/');
        let country = str.slice(0, n).trim();
        let city = str.slice(n + 1, lengthx).trim();
        obj[ ikey ] = {country, city};
        ikey++;
      }
      return obj;
    } else {
      return false;
    }
  }
  async downloadEmployee_File(bodyX) {
    return new Promise((reslove, reject) => {
      const onSuccess = (data) => {
        console.log('***Call Asmx***');
        var parsed = $.parseJSON(data.d);
        console.log(parsed);
        console.log(parsed.dtResult);

        if (parsed.dtResult[ 0 ].status === 'true') {
          console.log(parsed.dtResult[ 0 ].file_system_path);
          console.log(parsed.dtResult[ 0 ].file_outbound_path);
          console.log(parsed.dtResult[ 0 ].file_outbound_name);

          //เอาไว้ทดลองว่า gen file ได้มั้ยโดยการลอง save as
          this.ws.downloadFile(parsed.dtResult[ 0 ].file_outbound_path, parsed.dtResult[ 0 ].file_outbound_name);

          this.appMain.isLoading = false;
        } else {
          this.appMain.isLoading = false;
          this.alert.swal_error(parsed.dtResult[ 0 ].status);
        }
      };
      this.ws.callWs_asmx(bodyX, 'Report', 'employee_letter').subscribe(
        (data) => onSuccess(data),
        (error) => {
          this.appMain.isLoading = false;
        },
        () => {
          reslove(true);
        }
      );
    });
  }
  async downloadEmployee_Path(bodyX) {
    return new Promise((reslove, reject) => {
      const onSuccess = (data) => {
        console.log('***Call Asmx***');
        var parsed = $.parseJSON(data.d);
        console.log(parsed.dtResult);
        if (parsed.dtResult[ 0 ].status === 'true') {
          console.log(parsed.dtResult[ 0 ].file_system_path);
          console.log(parsed.dtResult[ 0 ].file_outbound_path);
          console.log(parsed.dtResult[ 0 ].file_outbound_name);

          //เอาไว้ทดลองว่า gen file ได้มั้ยโดยการลอง save as
          reslove(parsed.dtResult[ 0 ].file_system_path);
        }
      };
      this.ws.callWs_asmx(bodyX, 'Report', 'employee_letter').subscribe(
        (data) => onSuccess(data),
        (error) => {
          this.appMain.isLoading = false;
          reject(error);
        },
        () => { }
      );
    });
  }
  dateParseFormat(datestr: string, format: string) {
    //let dateFormat = require('dateformat');
    var montF = new DatePipe('en-US');
    let now = new Date(datestr);
    var montx = montF.transform(now, format);
    return montx;
  }
  async EmployeeLetter(list_country) {
    var data_empxx = this.emp_list.filter((word) => word.emp_id == this.empid);
    //var data_empx = data_emp[0] ;
    this.appMain.isLoading = true;
    //ถ้าไม่มีข้อมูลให้ใส่ขีด - แทนค่าว่างก่อนส่งไป
    // console.clear();
    console.log('downloadfile');
    data_empxx = JSON.parse(JSON.stringify(data_empxx));
    console.log(JSON.parse(JSON.stringify(data_empxx)));
    console.log(data_empxx);
    let useColumn = [
      'titlename',
      'firstname',
      'lastname',
      'userGender',
      'userJoinDate',
      'userPosition',
      'travel_topic',
      'dateOfDeparture',
      'userCompany',
    ];
    data_empxx.forEach((item) => {
      for (let [ i, key ] of useColumn.entries()) {
        if (item[ key ] === '' || item[ key ] === null) {
          item[ key ] = '-';
        } else {
          if (item[ key ] === '-') {
          } else {
            let n = item[ key ].indexOf('-');
            (key === 'dateOfDeparture' || key === 'userJoinDate') &&
              n !== -1 &&
              (item[ key ] = this.dateParseFormat(item[ key ].slice(0, n), 'd MMMM yyyy'));
          }
        }
      }
    });
    console.log(this.country_doc);
    var country = '-',
      city = '-';
    var str = data_empxx[ 0 ].country_city;
    let check_country = this.searchString(str);
    if (check_country === false) {
      // ?? อาจจะต้องเช็คเพิ่มเพราะเช็คเงือนไขจาก string
      var lengthx = str.length;
      var n = str.indexOf('/');
      country = str.slice(0, n);
      city = str.slice(n + 1, lengthx);
      // alert(str)
      // ?? อาจจะต้องเช็คเพิ่มเพราะเช็คเงือนไขจาก string
    } else {
      this.appMain.isLoading = true;
      for (let ci of list_country) {
        let find = check_country.find((item) => {
          return item.country.toLowerCase() === ci.toLowerCase();
        });
        if (!find) {
          return;
        }
        const {country, city} = find;
        let bodyX = {
          token_login: localStorage[ 'token' ],
          nameOfEmbassy: country, //ชื่อประเทศ
          nameOfEmployee: data_empxx[ 0 ].titlename + ' ' + data_empxx[ 0 ].firstname + ' ' + data_empxx[ 0 ].lastname, //'Mr. Luck Saraya', //ชื่อพนักงาน
          gender: data_empxx[ 0 ].userGender, //เพศ [Mr. = Men, Mrs./ Ms./ Miss = Women]
          joinDate: data_empxx[ 0 ].userJoinDate, //วันที่เริ่มงาน (d MMMM yyyy)
          position: data_empxx[ 0 ].userPosition, //ชื่อตำแหน่งแบบเต็ม
          travelTopic: data_empxx[ 0 ].travel_topic,
          departureWeek: this.getWeek(data_empxx[ 0 ].travel_date), //WEEK
          cityCountry: city + ', ' + country, //ชื่อเมืองและประเทศ (ชื่อเมืองขึ้นก่อนประเทศ) ex : Berlin, Germany
          dateOfDeparture: data_empxx[ 0 ].dateOfDeparture, //วันที่ออกเดินทาง(Departure date บรรทัดแรกจากหน้า air ticket)(d MMMM yyyy)
          company: data_empxx[ 0 ].userCompany, // TOP / TES
        };
        await this.downloadEmployee_File(bodyX);
      }
      return;
    }
    let bodyX = {
      token_login: localStorage[ 'token' ],
      nameOfEmbassy: country, //ชื่อประเทศ
      nameOfEmployee: data_empxx[ 0 ].titlename + ' ' + data_empxx[ 0 ].firstname + ' ' + data_empxx[ 0 ].lastname, //'Mr. Luck Saraya', //ชื่อพนักงาน
      gender: data_empxx[ 0 ].userGender, //เพศ [Mr. = Men, Mrs./ Ms./ Miss = Women]
      joinDate: data_empxx[ 0 ].userJoinDate, //วันที่เริ่มงาน (d MMMM yyyy)
      position: data_empxx[ 0 ].userPosition, //ชื่อตำแหน่งแบบเต็ม
      travelTopic: data_empxx[ 0 ].travel_topic,
      cityCountry: city + ', ' + country, //ชื่อเมืองและประเทศ (ชื่อเมืองขึ้นก่อนประเทศ) ex : Berlin, Germany
      departureWeek: this.getWeek(data_empxx[ 0 ].travel_date), //WEEK
      dateOfDeparture: data_empxx[ 0 ].dateOfDeparture, //วันที่ออกเดินทาง(Departure date บรรทัดแรกจากหน้า air ticket)(d MMMM yyyy)
      company: data_empxx[ 0 ].userCompany, // TOP / TES
    };

    const onSuccess = (data) => {
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
        this.ws.downloadFile(parsed.dtResult[ 0 ].file_outbound_path, parsed.dtResult[ 0 ].file_outbound_name);

        this.appMain.isLoading = false;
      } else {
        this.appMain.isLoading = false;
        this.alert.swal_error(parsed.dtResult[ 0 ].status);
      }
    };

    //data, function name(ฝั่ง asmx), method name
    this.ws.callWs_asmx(bodyX, 'Report', 'employee_letter').subscribe(
      (data) => onSuccess(data),
      (error) => {
        this.appMain.isLoading = false;
      }
    );
  }

  async getPathNameEmployeeLetter() {
    let list_country = [];
    this.img_list.forEach((e) => {
      if (e.emp_id == this.empid && e.actionname != 'visa_page' && e.action_type != 'delete') {
        if (true) {
          let Regex: RegExp = /EMPLOYEE_LETTER/g;
          if (Regex && Regex.test(e.filename)) {
            list_country.push(e.filename.replace(/EMPLOYEE_LETTER_/g, '').replace(/\.docx/g, ''));
          }
        }
      }
    });
    var data_empxx = this.emp_list.filter((word) => word.emp_id == this.empid);
    this.appMain.isLoading = true;
    //ถ้าไม่มีข้อมูลให้ใส่ขีด - แทนค่าว่างก่อนส่งไป
    // console.clear();
    console.log('downloadfile');
    console.log(list_country, 'list_country');
    data_empxx = JSON.parse(JSON.stringify(data_empxx));
    console.log(JSON.parse(JSON.stringify(data_empxx)));
    console.log(data_empxx);
    let useColumn = [
      'titlename',
      'firstname',
      'lastname',
      'userGender',
      'userJoinDate',
      'userPosition',
      'travel_topic',
      'dateOfDeparture',
      'userCompany',
    ];
    data_empxx.forEach((item) => {
      for (let [ i, key ] of useColumn.entries()) {
        if (item[ key ] === '' || item[ key ] === null) {
          item[ key ] = '-';
        } else {
          if (item[ key ] === '-') {
          } else {
            let n = item[ key ].indexOf('-');
            (key === 'dateOfDeparture' || key === 'userJoinDate') &&
              n !== -1 &&
              (item[ key ] = this.dateParseFormat(item[ key ].slice(0, n), 'd MMMM yyyy'));
          }
        }
      }
    });
    console.log(this.country_doc);
    var country = '-',
      city = '-';
    var str = data_empxx[ 0 ].country_city;
    let check_country = this.searchString(str);
    if (check_country === false) {
      // ?? อาจจะต้องเช็คเพิ่มเพราะเช็คเงือนไขจาก string
      var lengthx = str.length;
      var n = str.indexOf('/');
      country = str.slice(0, n);
      city = str.slice(n + 1, lengthx);
      // ?? อาจจะต้องเช็คเพิ่มเพราะเช็คเงือนไขจาก string
      let bodyX = {
        token_login: localStorage[ 'token' ],
        nameOfEmbassy: country, //ชื่อประเทศ
        nameOfEmployee: data_empxx[ 0 ].titlename + ' ' + data_empxx[ 0 ].firstname + ' ' + data_empxx[ 0 ].lastname, //'Mr. Luck Saraya', //ชื่อพนักงาน
        gender: data_empxx[ 0 ].userGender, //เพศ [Mr. = Men, Mrs./ Ms./ Miss = Women]
        joinDate: data_empxx[ 0 ].userJoinDate, //วันที่เริ่มงาน (d MMMM yyyy)
        position: data_empxx[ 0 ].userPosition, //ชื่อตำแหน่งแบบเต็ม
        travelTopic: data_empxx[ 0 ].travel_topic,
        cityCountry: city + ', ' + country, //ชื่อเมืองและประเทศ (ชื่อเมืองขึ้นก่อนประเทศ) ex : Berlin, Germany
        dateOfDeparture: data_empxx[ 0 ].dateOfDeparture, //วันที่ออกเดินทาง(Departure date บรรทัดแรกจากหน้า air ticket)(d MMMM yyyy)
        company: data_empxx[ 0 ].userCompany, // TOP / TES
      };
      let PATHNAME = await this.downloadEmployee_Path(bodyX);
      // this.img_list.forEach()
      this.PATHGROUP.push(PATHNAME as string);
      return Promise.resolve(this.PATHGROUP);
    } else {
      this.appMain.isLoading = true;
      let irow = 0;
      for (let ci of list_country) {
        let find = check_country.find((item) => {
          return item.country.toLowerCase() === ci.toLowerCase();
        });
        if (!find) {
          return;
        }
        const {country, city} = find;

        let bodyX = {
          token_login: localStorage[ 'token' ],
          nameOfEmbassy: country, //ชื่อประเทศ
          nameOfEmployee: data_empxx[ 0 ].titlename + ' ' + data_empxx[ 0 ].firstname + ' ' + data_empxx[ 0 ].lastname, //'Mr. Luck Saraya', //ชื่อพนักงาน
          gender: data_empxx[ 0 ].userGender, //เพศ [Mr. = Men, Mrs./ Ms./ Miss = Women]
          joinDate: data_empxx[ 0 ].userJoinDate, //วันที่เริ่มงาน (d MMMM yyyy)
          position: data_empxx[ 0 ].userPosition, //ชื่อตำแหน่งแบบเต็ม
          travelTopic: data_empxx[ 0 ].travel_topic,
          cityCountry: city + ', ' + country, //ชื่อเมืองและประเทศ (ชื่อเมืองขึ้นก่อนประเทศ) ex : Berlin, Germany
          dateOfDeparture: data_empxx[ 0 ].dateOfDeparture, //วันที่ออกเดินทาง(Departure date บรรทัดแรกจากหน้า air ticket)(d MMMM yyyy)
          company: data_empxx[ 0 ].userCompany, // TOP / TES
        };
        let PATHNAME = await this.downloadEmployee_Path(bodyX);
        this.PATHGROUP.push(PATHNAME as string);
        if (list_country.length - 1 === irow) {
          return Promise.resolve(this.PATHGROUP);
        }
        irow = irow + 1;
      }
      console.log(this.PATHGROUP, 'PATHGROUP');

      return;
    }
  }
}
