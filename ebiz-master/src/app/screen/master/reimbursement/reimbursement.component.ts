import {HttpClient} from '@angular/common/http';
import {
  Component,
  OnInit,
  forwardRef,
  Inject,
  TemplateRef,
  ViewContainerRef,
  ViewChild,
  ElementRef,
  ContentChild,
  AfterViewInit,
} from '@angular/core';
// import { MainComponent } from '../../../components/main/main.component';
import { FileuploadserviceService } from '../../../ws/fileuploadservice/fileuploadservice.service';
import { AspxserviceService } from '../../../ws/httpx/aspxservice.service';
import { MasterComponent } from '../master.component';
import {MatSelect} from '@angular/material/select';
import {FormGroup, Validators, FormBuilder} from '@angular/forms';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import {DatePipe, DecimalPipe} from '@angular/common';
import {Workbook} from 'exceljs';
import * as fs from 'file-saver';
import {timeInterval} from 'rxjs/operators';
import { AlertServiceService } from '../../../services/AlertService/alert-service.service';
import { InitTrackStatus, TrackingStatus, TrackingStatusNumber } from '../../../model/localstorage.model';
import * as XLSX from 'xlsx';
// for Search Emp
import {A, B, COMMA, ENTER, SEMICOLON} from '@angular/cdk/keycodes';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {MatChipInput, MatChipInputEvent} from '@angular/material/chips';
import {Observable, of} from 'rxjs';
import {tap, startWith, debounceTime, distinctUntilChanged, switchMap, map} from 'rxjs/operators';
import {FormControl} from '@angular/forms';
import { getBoolean, useAuth } from '../../../function/globalfunction.component';
import { CloneDeep } from '../../../function/globalfunction.component';
// for Search Emp

declare var toastr: any;
declare var $: any;

@Component({
  selector: 'app-reimbursement',
  templateUrl: './reimbursement.component.html',
  styleUrls: [ './reimbursement.component.css' ],
})
export class ReimbursementComponent implements OnInit {
  action_stage = {
    action_save: 'SaveReimbursement',
    action_load: 'LoadReimbursement',
    action_send_email: 'SendMailReimbursement',
    action_load_doc: 'LoadDoc',
  };
  TrackingStatus: TrackingStatus = {...InitTrackStatus};
  mail_curent: string = '';
  reimbursement_t_header: any = [
    {
      col: 'Date',
    },
    {
      col: 'Details',
    },
    {
      col: 'Exchange Rate',
    },
    {
      col: 'Total',
    },
    {
      col: 'Grand Total(THB)',
    },
    {
      col: 'Noted',
    },
    {
      col: '',
    },
  ];
  maildata = [];
  config = {
    displayKey: 'mail_to', // if objects array passed which key to be displayed defaults to description
    search: true,
    limitTo: 1000,
    placeholder: 'Select',
  };
  public disgitEbiz: number = 2;
  model_all : any = {
    token_login: 'ssssxx',
    m_currency: [],
    m_exchangerate: [],
    doc_id: 'D001',
    data_type: null,
    id: '1',
    user_admin: false,
    user_display: 'Mr. Jeerawat Pattanasomsit ',
    travel_topic: 'Participate HAZOP/SIL Reviewwith EPC & PMC.',
    business_date: '1 Nov 2019 - 4 Nov 2019',
    travel_date: '1 Nov 2019 - 4 Nov 2019',
    country_city: 'Europe Italy / Milan',
    sendmail_to_traveler: false,
    reimbursement_detail: [],
    reimbursement_main: [],
    m_empmail_list: [],
    emp_list: [],
    mail_list: [],
    img_list: [],
    after_trip: {
      opt1: null,
      opt2: {
        status: null,
        remark: null,
      },
      opt3: {
        status: null,
        remark: null,
      },
    },
  };
  //user_reject:boolean = false;
  data_export: any[] = [];
  model_all_def = {
    m_currency: [],
    m_exchangerate: [],
    token_login: 'ssssxx',
    doc_id: 'D001',
    data_type: null,
    id: '1',
    user_admin: true,
    user_display: 'Mr. Jeerawat Pattanasomsit ',
    travel_topic: 'Participate HAZOP/SIL Reviewwith EPC & PMC.',
    business_date: '1 Nov 2019 - 4 Nov 2019',
    travel_date: '1 Nov 2019 - 4 Nov 2019',
    country_city: 'Europe Italy / Milan',
    sendmail_to_traveler: false,
    reimbursement_detail: [],
    emp_list: [],
    mail_list: [],
    img_list: [],
    after_trip: {
      opt1: null,
      opt2: {
        status: null,
        remark: null,
      },
      opt3: {
        status: null,
        remark: null,
      },
    },
  };

  action_delete = [];
  accept_true: boolean = false;
  doc_id: any;
  pagename = 'reimbursement';
  emp_id: any;
  selectfile!: File;
  Exportfile!: File;
  list_emp: string = '';
  select_user: any;
  totalgantotal: number = 0;
  tp_clone!: TemplateRef<any>;
  modalRef!: BsModalRef;
  modal_Ref_mail!: BsModalRef;
  modal_Ref_Export!: BsModalRef;
  today: Date = new Date();
  Exchange_value : any = {
    currency_id: null,
    as_of: null,
    as_of_type: null,
    Exchange_rate_selected: null,
  };
  Config_Mail = {
    mail_to_value: '',
    mail_cc_value: '',
    mail_cc_ds: [],
  };
  Config_Export: any = {
    dtexport: [],
  };
  user_reject: boolean = false;
  bsconfig: object = {};
  minDate: any;
  maxDate: any;
  Isexchange_rate: any;
  user_display: string = '';
  panel = {
    show: false,
    after: false,
  };

  status_Filter: boolean = false;
  // filteredOptions: Observable<string[]>;
  fileName = 'ExcelSheet.xlsx';
  EmailSend = [];

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
  MailListCC: any = [];
  allEmp: any = [];
  masterEmp: any[] = [];
  pathPhase1: any = null;

  inputText = '';
  inputTextCC = '';
  // for Search Emp

  @ViewChild('controlmail_cc', {static: true}) controlmail_cc?: ElementRef;

  // for Search Emp
  @ViewChild('fInput', {static: true}) fInput?: ElementRef;
  @ViewChild('fInputcc', {static: true}) fInputcc?: ElementRef;
  TRAVEL_TYPE: string = '';
  TRAVEL_LOCAL: boolean = false;
  fInputccx?: ElementRef;
  profile: any;
  user_admin: boolean = false;
  isCanceled: boolean = false;
  showContent: boolean = false;
  // for Search Emp
  constructor(
    @Inject(forwardRef(() => MasterComponent)) private Appmain: MasterComponent,
    private modalService: BsModalService,
    private http: HttpClient,
    private ws: AspxserviceService,
    private fileuploadservice: FileuploadserviceService,
    private alerts: AlertServiceService
  ) {
    // for Search Emp
    this.filteredEmp = this.fCtrl.valueChanges.pipe(
      startWith(null),
      map((x: string | null) => (this.CheckData(x) ? this._filter(x?.toString().toLowerCase()) : []))
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
    this.today = new Date();
    this.minDate = new Date();
    this.minDate.setDate(1);
    this.minDate.setMonth(this.minDate.getMonth() - 1);
    this.minDate.setFullYear(this.minDate.getFullYear());
    this.maxDate = new Date(this.today.getFullYear(), this.today.getMonth() + 1, 1);
    this.doc_id = this.Appmain.DOC_ID;
    this.OnloadDoc();
    this.Onload();
  }
  addOnBlurInput(event: FocusEvent, inputName: HTMLInputElement, type: string) {
    const target: HTMLElement = event.relatedTarget as HTMLElement;
    // console.log(target, 'target');
    // console.log(!target || target.tagName !== 'MAT-OPTION');
    if (!target || target.tagName !== 'MAT-OPTION') {
      // const matChipEvent: MatChipInputEvent = {
      //     input: inputName,
      //     value: inputName.value,
      //     chipInput: undefined
      //     // chipInput : null // Include the chipInput property with a value
      // };
      // this.add(matChipEvent, type);
  }
  
  }
  get docStatus() {
    return (Status: number) => {
      let emp_id = this.emp_id;
      let id: TrackingStatusNumber = TrackingStatusNumber.statusnum0;
      if (this.model_all.emp_list.length > 0) {
        // TEST
        // this.emp_list.forEach((i) => (i.doc_status_id = '2'));
        let dt : any = this.model_all.emp_list.find((item : any) => item.emp_id === emp_id);
        if (dt) {
          id = Number(dt.doc_status_id);
          if (Status === id) {
            this.TrackingStatus[ Status ] = true;
          }
        }
      }
      // return this.TrackingStatus[ Status ];
    };
  }
  
  // get docStatus() {
  //   return (Status: number) => {
  //     let emp_id = this.emp_id;
  //     let id: number = 1;
  //     if (this.model_all.emp_list.length > 0) {
  //       // TEST
  //       // this.emp_list.forEach((i) => (i.doc_status_id = '2'));
  //       let dt = this.model_all.emp_list.find((item : any) => item.emp_id === emp_id);
  //       if (dt) {
  //         id = Number(dt.doc_status_id);
  //         if (Status === id) {
  //           this.TrackingStatus[ Status ] = true;
  //         }
  //       }
  //     }
  //     return this.TrackingStatus[ Status ];
  //   };
  // }
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
  onFileChange(ev : any) {
    let workBook: any;
    let jsonData = null;
    const reader = new FileReader();
    const file = ev.target.files[ 0 ];
    reader.onload = (event) => {
      const data = reader.result;
      workBook = XLSX.read(data, {type: 'binary'});
      jsonData = workBook.SheetNames.reduce((initial : any, name: any) => {
        const sheet = workBook.Sheets[ name ];
        initial[ name ] = XLSX.utils.sheet_to_json(sheet);
        return initial;
      }, {});
      const dataString = JSON.stringify(jsonData);
      console.log(jsonData);
      // this.setDownload(dataString);
    };
    reader.readAsBinaryString(file);
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
  async OnloadDoc() {
    this.profile = await this.CheckLogin();

    // this.Appmain.isLoading = true;
    var BodyX = {
      token_login: localStorage[ 'token' ],
      doc_id: this.doc_id,
    };

    const onSuccess = (data : any) => {
      let TravelTypeDoc = /local/g.test(this.Appmain.TRAVEL_TYPE);
      this.TRAVEL_TYPE = TravelTypeDoc ? 'Province/City/Location :' : 'Country / City  :';
      this.TRAVEL_LOCAL = TravelTypeDoc;
      const {tab_no} = data.up_coming_plan[ 0 ];
      this.pathPhase1 = tab_no ? tab_no : '1';
      console.log('loadDoc');
      console.log(data);
      console.log(this.pathPhase1);
    };
    this.ws.callWs(BodyX, this.action_stage.action_load_doc).subscribe(
      onSuccess,
      (error) => console.log(error),
      () => { }
    );
  }
  //#region  for Search Emp
  loadEmpList() {
    let bodyX = {
      token_login: localStorage[ 'token' ],
      filter_value: '',
    };

    this.Appmain.isLoading = true;
    const onSuccess = (data : any) => {
      console.log('---load success---');
      // console.log(data);
      if (data.after_trip.opt1 == 'true') {
        this.masterEmp = data.emp_list;
        this.Appmain.isLoading = false;
        this.allEmp = this.masterEmp;
      } else {
        this.Appmain.isLoading = false;
        console.log('---load Error---');
        // console.log(data);
        this.alerts.swal_error(data.after_trip.opt2.status);
      }
      this.showContent = true;
    };
    this.ws.callWs(bodyX, 'LoadEmployeeList').subscribe(
      (data) => onSuccess(data),
      (error) => {
        this.Appmain.isLoading = false;
        console.log(error);
        //alert('Can\'t call web api.' + ' : ' + error.message);
      }
    );
  }

  //ถ้าไม่เลือกที่ autocomplete จะเข้า fn นี้
  add(event: MatChipInputEvent, type: string): void {
    // //debugger
    console.log(event);
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
      (x: any) =>
        x.displayname.toLowerCase().includes(value) ||
        x.emp_id.toLowerCase().includes(value) ||
        x.idicator.toLowerCase().includes(value)
    );
  }

  doFilter(type : any) {
    if (type  != null && type != '' && type.length > 2) {
      // console.log(this.inputText);
      //this.allEmp = this.masterEmp;
    } else {
      //this.allEmp = [];
    }
  }
  //#endregion for Search Emp

  displayName(EmpList: any) {
    return EmpList.displayname;
  }

  transform(items: any, searchText: any, filde: any) {
    searchText = searchText.toLowerCase();
    return items.filter((it: any) => {
      return (
        it[ filde[ 0 ] ].toLowerCase().includes(searchText) ||
        it[ filde[ 1 ] ].toLowerCase().includes(searchText) ||
        it[ filde[ 2 ] ].toLowerCase().includes(searchText)
      );
    });
  }

  exportexcel(action_status : any): void {
    //call API
    //this.OnExport();
    if (action_status == 'send_mail') {
      //let haschange = this.model_all.reimbursement_detail.filter(res => res.action_change == 'true' && res.emp_id == this.emp_id)
      let haschange = this.model_all.reimbursement_detail.filter(
        (res : any) => res.reimbursement_date_type != '' && res.emp_id == this.emp_id
      );
      console.log(this.model_all.reimbursement_detail);
      if (haschange.length > 0) {

        let dt = haschange.map((res: any) => {
          if (res['reimbursement_date_type'] != '' && res['reimbursement_date_type'] != null) {
            return {
              Date: res['reimbursement_date_type']
                ? this.convert_dateDMY(res['reimbursement_date_type'], 'MM/dd/yyyy')
                : '-',
              Particulars: res.details == '' ? '-' : res.details,
              Total: res.total.replace(/,/g, '') == '' ? '-' : res.total.replace(/,/g, ''),
              Rate: res.exchange_rate == '' ? '-' : res.exchange_rate,
              'Total (THB)': res.grand_total.replace(/,/g, '') == '' ? '-' : res.grand_total.replace(/,/g, ''),
              Currency: res.currency,
            };
          }
          return null; // Return null if condition is not met
        }) // Filter out null values
        
        this.data_export = dt;
      } else {
        //กรณีไม่ save ข้อมูล
        let def_data = JSON.parse(this.Config_Export.dtexport);
        let haschange = def_data.filter(
          (res : any) =>
            res.emp_id == this.emp_id && res[ 'reimbursement_date_type' ] != '' && res[ 'reimbursement_date_type' ] != null
        );
        let dt = haschange.map((res: any) => {
          if (res['reimbursement_date_type'] != '' && res['reimbursement_date_type'] != null) {
            return {
              Date: res['reimbursement_date_type']
                ? this.convert_dateDMY(res['reimbursement_date_type'], 'MM/dd/yyyy')
                : '-',
              Particulars: res.details == '' ? '-' : res.details,
              Total: res.total.replace(/,/g, '') == '' ? '-' : res.total.replace(/,/g, ''),
              Rate: res.exchange_rate == '' ? '-' : res.exchange_rate,
              'Total (THB)': res.grand_total.replace(/,/g, '') == '' ? '-' : res.grand_total.replace(/,/g, ''),
              Currency: res.currency,
            };
          }
          return null; // Return null if condition is not met
        }).filter((item : any) => item !== null); // Filter out null values
        
        this.data_export = dt;
      }
    }

    var data = this.data_export;
    var code_header = Object.keys(data[ 0 ]);
    // code_header.splice(5, 1);
    const header_text = code_header;
    let data_cell = data.map((res) => {
      var arr = [];
      for (const i in header_text) {
        var val = res[ header_text[ i ] ];
        if (header_text[ i ].includes('Total') || header_text[ i ].includes('Rate')) {
          if (val == '-') {
          } else {
            val = +val;
          }
          arr.push(val);
        } else {
          arr.push(val);
        }
      }
      return arr;
    });
    // console.log(header_text);
    // console.log(data_cell);
    this.generateExcel(header_text, data_cell, action_status);
  }

  //excel js
  async generateExcel(header_data : any , data_cell: any, action_status: any) {
    // Excel Title, Header, Data
    const title = 'Reimbursement Form';
    const header = header_data;

    const data = data_cell;
    var filter_last_row = data_cell.filter((e : any) => e[ 4 ] != '-');
    const last_row_total = filter_last_row.reduce((a : any, b : any) => a + +b[ 4 ], 0);
    var displayarr = this.model_all.emp_list.filter((e : any) => e.emp_id == this.list_emp);
    var displayname = displayarr[ 0 ].userDisplay;
    // Create workbook and worksheet
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Reimbursement Form');

    // Add Row and formatting
    // worksheet.addRow([title]);
    const titleRow = worksheet.addRow([ title ]);
    titleRow.font = {
      name: 'Browallia New',
      family: 4,
      size: 20,
      underline: 'single',
      bold: true,
    };
    titleRow.alignment = {vertical: 'middle', horizontal: 'center'};
    // ws.getCell('B1').alignment = { vertical: 'middle', horizontal: 'center' };
    // worksheet.addRow([]);
    worksheet.mergeCells('A1:E2');
    worksheet.addRow([]);

    let obj = {
      BSN_TITLE: 'Participate P&ID Review with EPC & PMC',
      DURATION: '31 Mar - 6 Apr 2019',
      COUNTRY: 'Italy',
      NAME: 'Mr. Nilesh Vrajlal Modi',
    };
    const Business_Title = worksheet.addRow([
      'Business Title :',
      this.model_all.travel_topic,
      //obj.BSN_TITLE,
    ]);
    Business_Title.getCell(1).font = {
      name: 'Browallia New',
      family: 4,
      size: 16,
      bold: true,
    };
    Business_Title.getCell(2).font = {
      name: 'Browallia New',
      family: 4,
      size: 16,
    };

    const Duration = worksheet.addRow([ 'Duration :', this.model_all.travel_date ]);
    Duration.getCell(1).font = {
      name: 'Browallia New',
      family: 4,
      size: 16,
      bold: true,
    };
    Duration.getCell(2).font = {name: 'Browallia New', family: 4, size: 16};
    const Country = worksheet.addRow([ 'Country : ', this.model_all.country_city ]);
    Country.getCell(1).font = {
      name: 'Browallia New',
      family: 4,
      size: 16,
      bold: true,
    };
    Country.getCell(2).font = {name: 'Browallia New', family: 4, size: 16};

    const Name = worksheet.addRow([ 'Name : ', displayname ]);
    Name.getCell(1).font = {
      name: 'Browallia New',
      family: 4,
      size: 16,
      bold: true,
    };
    Name.getCell(2).font = {name: 'Browallia New', family: 4, size: 16};

    worksheet.mergeCells('B3:E3');
    worksheet.mergeCells('B4:E4');
    worksheet.mergeCells('B5:E5');
    worksheet.mergeCells('B6:E6');
    worksheet.mergeCells('B7:E7');

    // Blank Row
    worksheet.addRow([]);

    // Add Header Row
    header.splice(5, 1);

    const headerRow = worksheet.addRow(header);
    headerRow.alignment = {vertical: 'middle', horizontal: 'center'};
    // Cell Style : Fill and Border
    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {},
        bgColor: {argb: '#fff'},
      };

      cell.font = {name: 'Browallia New', family: 4, size: 16, bold: true};
      cell.border = {
        top: {style: 'thin'},
        left: {style: 'thin'},
        bottom: {style: 'thin'},
        right: {style: 'thin'},
      };
    });

    // Add Data and Conditional Formatting
    var imax_length = data.length;
    console.log(data);

    data.forEach((d : any, i : any) => {
      const row : any = worksheet.addRow(d);
      console.log(d);
      const LENGTH = d.length - 1;
      const currency = d[ LENGTH ];
      let irow = row[ '_number' ];
      var _cells = row[ '_cells' ].length - 1;
      row.eachCell((cell : any, number : any) => {
        cell.font = {name: 'Browallia New', family: 4, size: 14};
        if (number > 2) {
          if (number === 3) {
            cell.value != '-' ? (cell.numFmt = '_(#,##0.00_) "' + currency + '"') : '';
          }
          else if (number === 4) {
            cell.value != '-' ? (cell.numFmt = '#,##0.0000') : '';
          }
          else if (number === 6) {
            cell.value = '';
          } else {
            cell.value != '-' ? (cell.numFmt = '#,##0.00') : '';
          }
        }
        if (number == 5) {
          console.log(cell);
          if (cell.value != '-') {
            var cell_name = cell[ '_address' ];
            //แบบใช้ formula = (sum(a1,e3))
            //  if(worksheet.getCell('C'+irow).value == "-" || worksheet.getCell('D'+irow).value == "-"){}
            //  else{
            //   worksheet.getCell(cell_name).value = { formula:`C${irow}*D${irow}`,date1904:false};
            //  }
          }
        }
        if (number == 1 || cell.value === '-') {
          cell.alignment = {horizontal: 'center'};
        }
        if (number !== 6) {
          cell.border = {
            top: {style: 'dotted'},
            left: {style: 'thin'},
            bottom: {style: 'dotted'},
            right: {style: 'thin'},
          };
        }
      });
      if (i == imax_length - 1) {
        const row : any = worksheet.addRow([ ' ', ' ', ' ', ' ', ' ' ]);
        data[ 0 ].forEach((d : any, i : any) => {
          var _cells = row[ '_cells' ].length - 1;
          row.eachCell((cell : any, number : any) => {
            cell.font = {name: 'Browallia New', family: 4, size: 16};
            if (number == 1) {
              cell.alignment = {horizontal: 'center'};
            }
            cell.border = {
              top: {style: 'dotted'},
              left: {style: 'thin'},
              bottom: {style: 'thin'},
              right: {style: 'thin'},
            };
          });
        });
      }
    });
    worksheet.getColumn(1).width = 20;
    worksheet.getColumn(2).width = 40;
    worksheet.getColumn(3).width = 15;
    worksheet.getColumn(4).width = 15;
    worksheet.getColumn(5).width = 20;
    var row_total : any = worksheet.addRow([ '', '', '', 'Total', last_row_total ]);
    let LENGTH_ROW_TOTAL: any = 0;
    data[ 0 ].forEach((d : any, i : any) => {
      var _cells  = row_total[ '_cells' ].length - 1;
      row_total.eachCell((cell : any, number : any) => {
        cell.alignment = {horizontal: 'center'};
        cell.font = {name: 'Browallia New', family: 4, size: 16, bold: true};
        if (number > 4) {
          cell.font = {name: 'Browallia New', family: 4, size: 16};
          cell.border = {
            top: {style: 'dotted'},
            left: {style: 'thin'},
            bottom: {style: 'double'},
            right: {style: 'thin'},
          };
          cell.numFmt = '_(#,##0.00_) "THB"';
          LENGTH_ROW_TOTAL = cell.value;
        }
      });
    });
    // if (LENGTH_ROW_TOTAL) worksheet.getColumn(5).width = LENGTH_ROW_TOTAL.length > 15 ? LENGTH_ROW_TOTAL.length : 15;
    // alert(LENGTH_ROW_TOTAL);

    // Generate Excel File with given name
    workbook.xlsx.writeBuffer().then((data: any) => {
      const blob = new Blob([ data ], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      //console.log(blob);
      var today = this.convert_dateDMY(this.today, 'ddMMyyyy hhmmss');
      var file_name = `Reimbursement Form ${today}`;
      //upload file หลัง upload
      // this.Exportfile = new File([blob], "ReimbursementForm" + ".xlsx")
      // this.uploadFile_Export(this.Exportfile)
      if (action_status == 'send_mail') {
        const myFileX = new File([ blob ], file_name + '.xlsx', {
          type: blob.type,
        });
        this.onUploadX(myFileX);
      } else {
        fs.saveAs(blob, file_name + '.xlsx');
        this.alerts.toastr_success('Download File');
      }
    });
  }

  onUploadX(objectX : any) {
    this.Appmain.isLoading = true;

    const onSuccess = (res : any) => {
      this.Appmain.isLoading = false;
      console.log('after upload');
      console.log(res);
      console.log(this.list_emp);
      this.path_file1 = res.img_list.fullname;
      this.report();

      //this.saveaction();
    };
    /* objectX.lastModified = 1623655352304;
      objectX.webkitRelativePath = ''; */
    console.log('before upload');
    console.log(this.doc_id + ' - ' + this.list_emp);
    console.log(<File>objectX);
    this.postFileX(objectX, this.doc_id, 'allowance', this.list_emp, 'auto_generate').subscribe(
      (res) => onSuccess(res),
      (error) => {
        this.Appmain.isLoading = false;
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

  Cal_Gran_Total(Total : any, Rate : any) {
    try {
      var newvalue = Total.replace(/,/g, '');
      var XRate = parseFloat(Rate);
      var XTotal = parseFloat(newvalue);
      console.log(XRate * XTotal);
    } catch (ex) {
      return 0;
    }
    return this.convertInt('', '', (XRate * XTotal).toString());
  }

  get userDisplay(): string {
    let emp_id_current = this.emp_id;
    let find = this.model_all.emp_list.find(({emp_id} : any) => emp_id === emp_id_current);
    if (find) {
      return find.userDisplay;
    }
    return '';
  }
  update_userByDOC(VLAUE : any, select : any) {
    var bcheck = false;
    var check_detail = this.model_all.reimbursement_detail.some(
      (res : any) => (res.action_change == true || res.action_change == 'true') && res.emp_id == this.emp_id
    );

    this.model_all.emp_list.forEach((e: any) => {
      if (e.emp_id == VLAUE) {
        e.mail_status = 'true';
      } else {
        e.mail_status = 'false';
      }
    });

    if (check_detail) {
      this.alerts.swal_confirm_changes('Do you want to save the document ?').then((val) => {
        if (val.isConfirmed) {
          this.Onsave('saved');
          bcheck = true;
        } else {
          this.Onload_status_cancel();
          bcheck = true;
        }
      });
    }
    this.model_all.user_display = select.triggerValue;
    this.emp_id = this.list_emp;
    this.user_display = select.triggerValue;

    var i = this.get_index_by_emp(this.model_all.emp_list, this.emp_id);
    if (this.model_all.emp_list[ i ].hasOwnProperty('show_button')) {
      // this.user_reject = this.model_all.emp_list[i].show_button;
      if (this.model_all.emp_list[ i ].status_trip_cancelled === 'true') {
        this.user_reject = false;
      }
    } else {
      this.user_reject = false;
    }
    this.Exchange_value = {
      currency_id: null,
      as_of: null,
      as_of_type: null,
      Exchange_rate_selected: null,
    };
    this.Appmain.userSelected = this.emp_id;
    this.TrackingStatus = {...InitTrackStatus};
  }

  get_index_exchange_rate(ds: any, emp_id: any, id: any) {
    if (ds.length > 0) {
      return ds.findIndex((res: any) => {
        return res.emp_id == emp_id && id == res.id;
      });
    }
    return -1;
  }

  modal_hide() {
    this.Exchange_value = {
      currency_id: null,
      as_of: null,
      as_of_type: null,
      Exchange_rate_selected: null,
    };
    this.modalRef.hide();
  }

  check_obj_error(val: any) {
    var bcheck = true;
    if (val == '') {
      bcheck = false;
    }
    if (val == null) {
      bcheck = false;
    }
    if (val == undefined) {
      bcheck = false;
    }
    if (val == 'undefined') {
      bcheck = false;
    }

    return bcheck;
  }

  RateChang(val : any) {
    this.arr_m_exchangerate;
    var exchangeRate, dsexchangerow;
    dsexchangerow = this.arr_m_exchangerate.filter((res : any) => res.currency_id == val);
    exchangeRate = dsexchangerow[ 0 ].exchange_rate;
    this.Exchange_value.Exchange_rate_selected = exchangeRate;
    const dateS = new Date(dsexchangerow[ 0 ].date_from);
    dateS.setHours(12)
    this.Exchange_value.as_of_type = dateS;
  }
  ChangeASOF(inputDate: any) {
    this.arr_m_exchangerate;
    var exchangeRate, dsexchangerow;
    const currencyS = this.Exchange_value.currency_id;
    if (currencyS && inputDate.value) {
      var as_of_str = this.convert_dateDMY(inputDate.value, 'dd MMM yyyy');
      dsexchangerow = this.arr_m_exchangerate.filter((res: any) => res.currency_id == currencyS && res.date_from.toLowerCase() === as_of_str.toLowerCase());
      if (dsexchangerow && dsexchangerow.length > 0) {
        exchangeRate = dsexchangerow[ 0 ].exchange_rate;
        this.Exchange_value.Exchange_rate_selected = exchangeRate;
      }
      else {
        this.Exchange_value.Exchange_rate_selected = "0.00";
      }

    }

    const dateS = new Date(inputDate.value);
    dateS.setHours(12)
    this.Exchange_value.as_of_type = dateS;
  }
  Search_Exchange_rate(val: any) {
    //console.log(this.Exchange_value);
    if (this.check_obj_error(this.Exchange_value.as_of_type) && this.check_obj_error(this.Exchange_value.currency_id)) {
    } else {
      //type error
      return;
    }

    var exchangeselected: any = {};
    var i = this.Isexchange_rate;
    var exchangeDs = this.model_all.m_exchangerate;
    var exchangeRate: string = '0';
    var as_of_str = this.convert_dateDMY(this.Exchange_value.as_of_type, 'dd MMM yyyy');
    // this.model_all.reimbursement_detail[i].as_of = as_of_str;
    // this.model_all.reimbursement_detail[i].currency = this.Exchange_value.currency_id;
    // this.model_all.reimbursement_detail[i].action_change = 'true';

    var date_checked = new Date(this.convert_dateDMY(as_of_str, 'yyyy-MM-dd'));
    var date_check: boolean = false;
    if (exchangeDs.length > 0) {
      for (const item of exchangeDs) {
        if (item.currency_id == this.Exchange_value.currency_id) {
          let date_form = new Date(this.convert_dateDMY(item.date_from, 'yyyy-MM-dd'));
          let date_to = new Date(this.convert_dateDMY(item.date_to, 'yyyy-MM-dd'));

          // if (date_checked.valueOf() >= date_form.valueOf()) {
          //   date_check = true;
          //   exchangeselected = item;
          //   break;
          // }
          if (date_checked.valueOf() == date_form.valueOf()) {
            date_check = true;
            exchangeselected = item;
            break;
          }
        }
      }

      if (date_check) {
        try {
          exchangeRate = parseFloat(exchangeselected.exchange_rate).toFixed(2);
        } catch (ex) {
          this.arr_m_exchangerate;
          var exchangeRateX, dsexchangerow;
          dsexchangerow = this.arr_m_exchangerate.filter((res: any) => res.currency_id == val);
          exchangeRate = dsexchangerow[ 0 ].exchange_rate;
          //this.Exchange_value.Exchange_rate_selected = exchangeRateX;
        }
        //this.Exchange_value.Exchange_rate_selected = exchangeRate;
      }
    }
    this.Exchange_value.Exchange_rate_selected = exchangeRate;

    // console.log(this.Exchange_value)
  }
  add_ExchangeRate(asofstr: any, exchange_value: any) {
    var exchangeDs = this.model_all.m_exchangerate;
    var bcheck = exchangeDs.findIndex((res: any) => {
      return res.currency_id == this.Exchange_value.currency_id && res.date_from.toLowerCase() == asofstr.toLowerCase() && res.date_to.toLowerCase() == asofstr.toLowerCase();
    });
    if (bcheck == -1) {
      //ไม่มี rate นั่น ใน ds
      this.model_all.m_exchangerate.push({
        action_change: null,
        action_type: null,
        currency_id: this.Exchange_value.currency_id,
        date_from: asofstr,
        date_to: asofstr,
        exchange_rate: exchange_value,
        id: '',
      });
    } else {
      //กรณี update
      this.model_all.m_exchangerate[ bcheck ].currency_id = this.Exchange_value.currency_id;
      this.model_all.m_exchangerate[ bcheck ].date_from = asofstr;
      this.model_all.m_exchangerate[ bcheck ].date_to = asofstr;
      this.model_all.m_exchangerate[ bcheck ].exchange_rate = exchange_value;
    }
  }
  Update_Exchange_rate(template: any) {
    var exchangeselected: any;
    var i = this.Isexchange_rate;
    var exchangeDs = this.model_all.m_exchangerate;
    var as_of_str = this.convert_dateDMY(this.Exchange_value.as_of_type, 'dd MMM yyyy');
    this.model_all.reimbursement_detail[ i ].as_of = as_of_str;

    this.model_all.reimbursement_detail[ i ].currency = this.Exchange_value.currency_id;

    this.model_all.reimbursement_detail[ i ].exchange_rate = this.Exchange_value.Exchange_rate_selected;

    this.model_all.reimbursement_detail[ i ].action_change = 'true';

    this.add_ExchangeRate(as_of_str, this.Exchange_value.Exchange_rate_selected);
    try {
      var Grantotal =
        parseFloat(this.model_all.reimbursement_detail[ i ].exchange_rate) *
        parseFloat(this.model_all.reimbursement_detail[ i ].total.replace(/,/g, ''));
      this.model_all.reimbursement_detail[ i ].grand_total = this.convertInt('', '', Grantotal.toString());
    } catch (ex) {
      this.model_all.reimbursement_detail[ i ].grand_total = '0';
    }

    this.modalRef.hide();
    this.alerts.toastr_success('Update Exchange Rate');
    return;
    var date_checked = new Date(this.convert_dateDMY(as_of_str, 'yyyy-MM-dd'));
    var date_check: boolean = false;
    if (exchangeDs.length > 0) {
      for (const item of exchangeDs) {
        if (item.currency_id == this.Exchange_value.currency_id) {
          let date_form = new Date(this.convert_dateDMY(item.date_from, 'yyyy-MM-dd'));
          let date_to = new Date(this.convert_dateDMY(item.date_to, 'yyyy-MM-dd'));
          if (date_checked.valueOf() >= date_form.valueOf()) {
            date_check = true;
            exchangeselected = item;
            break;
          }
        }
      }

      if (date_check) {
        this.model_all.reimbursement_detail[ i ].exchange_rate = exchangeselected.exchange_rate;
      }

      try {
        var Grantotal =
          parseFloat(exchangeselected.exchange_rate) *
          parseInt(this.model_all.reimbursement_detail[ i ].total.replace(/,/g, ''));

        this.model_all.reimbursement_detail[ i ].grand_total = this.convertInt('', '', Grantotal.toString());
      } catch (ex) {
        this.model_all.reimbursement_detail[ i ].grand_total = '0';
      }
    }
  }
  openModal(template: TemplateRef<any>, emp_id : any, row_id : any) {
    this.tp_clone = template;
    let config: object = {
      class: 'modal-lg',
      animated: true,
      keyboard: false,
      ignoreBackdropClick: true,
    };
    this.modalRef = this.modalService.show(template, config);
    this.Isexchange_rate = this.get_index_exchange_rate(this.model_all.reimbursement_detail, emp_id, row_id);

    this.Exchange_value.currency_id = this.model_all.reimbursement_detail[ this.Isexchange_rate ].currency;

    this.Exchange_value.Exchange_rate_selected =
      this.model_all.reimbursement_detail[ this.Isexchange_rate ].exchange_rate;

    try {
      this.Exchange_value.as_of_type = new Date(
        this.convert_dateDMY(this.model_all.reimbursement_detail[ this.Isexchange_rate ].as_of, 'yyyy-MM-dd')
      );
    } catch (ex) {
      this.Exchange_value.as_of_type = null;
    }

    var configx = $('#modal-test').closest('.modal-content').addClass('rounded-20');
  }
  OpenModal_Mail(template: TemplateRef<any>) {
    let config: object = {
      class: 'modal-md',
      animated: true,
      keyboard: false,
      ignoreBackdropClick: true,
    };
    this.modal_Ref_mail = this.modalService.show(template, config);
    if (this.model_all.mail_list.length > 0) {
      this.model_all.mail_list.forEach((res : any) => {
        res.action_change = 'false';
        res.mail_cc = '';
        res.mail_emp_id = '';
        res.mail_to = '';
      });
    }
    console.log(this);
    this.set_modal();

    setTimeout(function () {
      $('.multiselect-dropdown .dropdown-btn').css({border: '1px solid #ced4da', padding: '9px 12px'});
    }, 100);
  }
  caltotal(ds: any[], filde: string) {
    var sum_total = ds.reduce((a, b) => {
      var previous = isNaN(b[ filde ]) ? 0 : +b[ filde ];
      return a + previous;
    }, 0);
    return sum_total || 0;
  }
  OpenModal_Export(template: TemplateRef<any>) {
    let config: object = {
      class: 'modal-lg',
      animated: true,
      keyboard: false,
      ignoreBackdropClick: true,
    };
    const sortBy = (a : any, b: any) => (+a.id) - (+b.id)

    let haschange = this.model_all.reimbursement_detail.filter(
      (res: any) => res.reimbursement_date_type != '' && res.emp_id == this.emp_id
    );
    console.log(this.model_all.reimbursement_detail);
    if (haschange.length > 0) {
      haschange = haschange.sort(sortBy)
      this.modal_Ref_Export = this.modalService.show(template, config);
      let dt = haschange.map((res: any) => {
        if (
          res['reimbursement_date_type'] != '' &&
          res['reimbursement_date_type'] != null &&
          res['reimbursement_date'] != null &&
          res['reimbursement_date'] != ''
        ) {
          return {
            Date: res['reimbursement_date_type']
              ? this.convert_dateDMY(res['reimbursement_date_type'], 'MM/dd/yyyy')
              : '-',
            Particulars: res.details === '' ? '-' : res.details,
            Total: res.total.replace(/,/g, '') === '' ? '-' : res.total.replace(/,/g, ''),
            Rate: res.exchange_rate === '' ? '-' : res.exchange_rate,
            'Total (THB)': res.grand_total.replace(/,/g, '') === '' ? '-' : res.grand_total.replace(/,/g, ''),
            Currency: res.currency,
          };
        }
        return null; // or some default value
      }).filter((item : any) => item !== null); // Optional: Remove any null values
      
      this.data_export = dt;
      /* this.alerts.swal_warning("Please Save Data");
    return ; */
    } else {
      //กรณีไม่ save ข้อมูล
      this.modal_Ref_Export = this.modalService.show(template, config);
      let def_data = JSON.parse(this.Config_Export.dtexport);
      let haschange = def_data.filter(
        (res: any) =>
          res.emp_id == this.emp_id && res[ 'reimbursement_date_type' ] != '' && res[ 'reimbursement_date_type' ] != null
      );
      if (haschange && haschange.length > 0) {
        haschange = haschange.sort(sortBy)
      }

      let dt = haschange.map((res: any) => {
  if (res['reimbursement_date_type'] != '' && res['reimbursement_date_type'] != null) {
    return {
      Date: res['reimbursement_date_type']
        ? this.convert_dateDMY(res['reimbursement_date_type'], 'MM/dd/yyyy')
        : '-',
      Particulars: res.details == '' ? '-' : res.details,
      Total: res.total.replace(/,/g, '') == '' ? '-' : res.total.replace(/,/g, ''),
      Rate: res.exchange_rate == '' ? '-' : res.exchange_rate,
      'Total (THB)': res.grand_total.replace(/,/g, '') == '' ? '-' : res.grand_total.replace(/,/g, ''),
      Currency: res.currency,
    };
  }
  return null; // Return null if condition is not met
})
      this.data_export = dt;
    }
    console.log(this.data_export);
  }

  downloadFile(url: any, filename: any) {
    let Regex = /.[A-Za-z]{3}$/;
    let fullurl = url.match(Regex);
    //let fileType = fullurl[0];
    let file_name = filename;
    fs.saveAs(url, file_name);
    if (url != '') {
      this.alerts.toastr_success('Download File');
    } else {
      this.alerts.toastr_error('Download File');
    }
  }

  onFileSelect(event: any) {
    debugger;
    this.selectfile = <File>event.target.files[ 0 ];
    console.log(this.selectfile);
    if (this.selectfile == undefined) {
      this.selectfile;
      $('#file_id').val('');
      return;
    } else {
      this.uploadFile(event);
    }
  }

  uploadFile(ev: any) {
    this.Appmain.isLoading = true;
    //File
    this.selectfile = <File>ev.target.files[ 0 ];
    let Jsond = {
      file: this.selectfile,
      doc_id: this.doc_id,
      pagename: this.pagename,
      emp_id: this.emp_id,
      file_token_login: localStorage[ 'token' ],
    };

    const onSuccess = (res: any) => {
      this.Appmain.isLoading = false;
      console.log(res);
      let status_res = res.after_trip;

      if (status_res.opt1 == 'true') {
        // this.alerts.swal_sucess(status_res.opt2.status);
        this.model_all.img_list.push(res.img_list);
        this.alerts.toastr_warning('Please Save Data');
      } else {
        this.alerts.swal_error(status_res.opt2.status);
      }
      $('#file_id').val('');
      this.selectfile;
    };

    this.fileuploadservice
      .postFilePhase2(this.selectfile, this.doc_id, this.pagename, this.emp_id, Jsond.file_token_login)
      .subscribe(
        (res) => onSuccess(res),
        (error) => {
          this.Appmain.isLoading = false;
          console.log(error);
          alert('error!');
        }
      );
  }

  uploadFile_Export(ev: any) {
    this.Appmain.isLoading = true;
    //File
    this.selectfile = ev;
    console.log(ev);

    let Jsond = {
      file: this.selectfile,
      doc_id: this.doc_id,
      pagename: this.pagename,
      emp_id: this.emp_id,
      action_name: 'report',
      file_token_login: localStorage[ 'token' ],
    };
    console.log(Jsond);

    const onSuccess = (res: any) => {
      this.Appmain.isLoading = false;
      console.log(res);
      let status_res = res.after_trip;

      if (status_res.opt1 == 'true') {
        //this.Swalalert(status_res.opt2.status, "success");
        this.model_all.img_list.push(res.img_list);
        this.alerts.toastr_warning('Please Save Data');
      } else {
        this.alerts.swal_error(status_res.opt2.status);
      }
      this.selectfile ;
    };

    this.fileuploadservice
      .postFilePhase2(this.selectfile, this.doc_id, this.pagename, this.emp_id, Jsond.file_token_login)
      .subscribe(
        (res) => onSuccess(res),
        (error) => {
          this.Appmain.isLoading = false;
          console.log(error);
          alert('error!');
        }
      );
  }
  onClearEmail(maillist: any) {
    if (maillist) {
      maillist.forEach((item: any) => {
        item.action_change = 'false';
        item.mail_status = 'false';
        item.mail_cc = '';
        item.mail_emp_id = '';
        item.mail_to = '';
        item.mail_attachments = '';
      });
    }
  }
  async Config_Email_Send() {
    let ds = this;

    this.onClearEmail(this.model_all.mail_list);
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
        STRMailEMPIDTO = ds.MailList.map((res: any) => res.emp_id.toLowerCase());
        //STRMailEMPID = STRMailEMPID + ";";
      }
      if (bcheck_mailcc) {
        STRMailCC = ds.MailListCC.map((res: any) => res.email.toLowerCase()).join(';');
        STRMailCC = STRMailCC + ';';
        STRMailEMPIDCC = ds.MailListCC.map((res: any) => res.emp_id.toLowerCase());

        //  console.log(STRMailEMPIDCC)
        //  console.log(STRMailEMPIDTO)
      }

      var irow = this.model_all.mail_list.findIndex((m_val : any) => m_val.emp_id == this.emp_id);
      if (irow > -1) {
        emp_all = STRMailEMPIDTO.concat(STRMailEMPIDCC).join(';');
        emp_all = emp_all + ';';
        this.model_all.mail_list[ irow ].action_change = 'true';
        this.model_all.mail_list[ irow ].mail_cc = STRMailCC;
        this.model_all.mail_list[ irow ].mail_to = STRMailTO;
        this.model_all.mail_list[ irow ].mail_emp_id = emp_all;
        status_Send = true;
      }

      this.modal_Ref_mail.hide();

      ds.MailListCC = [];
      ds.MailList = [];
      if (status_Send) {
        await this.OnsaveSendEmail('saved');
        this.exportexcel('send_mail');
      }
      console.log(this.model_all.mail_list);
    } else {
      this.alerts.swal_error('Not Have Email List');
    }
  }

  Send_Email() {
    this.Appmain.isLoading = true;
    const onSuccess = (data : any) => {
      this.TrackingStatus = {...InitTrackStatus};
      console.log('after send email');
      console.log(data);

      if (data.after_trip.opt1 == 'true') {
        if (data.after_trip.opt2.status != 'Send E-mail successfully.') {
          data.after_trip.opt2.status = 'Send E-mail successfully.';
          // this.model_all.emp_list = data.emp_list;
        }
        this.alerts.swal_success(data.after_trip.opt2.status);
      } else {
        if (data.after_trip.opt2.status == null) {
          data.after_trip.opt2.status = 'Error';
        }
        this.alerts.swal_error(data.after_trip.opt2.status);
      }
      this.Onload_status_cancel();
      // this.TrackingStatus = { ...InitTrackStatus };

      this.Appmain.isLoading = false;
    };

    var BodyX = this.model_all;
    var empid_x = this.list_emp;
    var path1x = this.path_file1,
      path2x = this.path_file2;
    BodyX.reimbursement_main.forEach((e : any) => {
      if (e.emp_id == empid_x) {
        e.file_travel_report = path2x;
        e.file_report = path1x;
      }
    });
    console.log('before send email');
    console.log(CloneDeep(BodyX), 'CloneDeep');
    this.ws.callWs(BodyX, this.action_stage.action_send_email).subscribe(
      (data) => onSuccess(data),
      (error) => (this.Appmain.isLoading = false),
      () => {
        //this.check_user();
      }
    );
  }

  set_modal() {
    $('.modal-backdrop').css({'z-index': 700});
    $('.modal').css({'z-index': 800});
  }

  deleteRow(event : any) {
    this.model_all.mail_list.splice(event, 1);
  }

  search_len_id(ds : any, emp_id : any, doc_id : any) {
    var dt = ds.filter((res : any) => this.emp_id == emp_id && doc_id == this.doc_id);

    dt = dt.sort((a : any, b : any) => {
      return a.id.localeCompare(b.id);
    });
    var len = dt.length < 1 ? 0 : dt.length - 1;
    return dt[ len ].id;
  }

  convert_dateDMY(str : any, format? : any) {
    var dt = new Date(str);

    var montF : any = new DatePipe('en-US');

    return montF.transform(dt, format);
  }

  onKeyDown(event : any) {
    var check_user = this.Appmain.profile.username;
    var def_user = 'nitinai';

    if (check_user.toLowerCase().includes(def_user)) {
      //console.log(event);
      if (event.key == '9') {
        this.model_all.user_admin = !this.model_all.user_admin;
      }
      if (event.key == '8') {
        //this.user_reject = !this.user_reject;
      }
    }
  }

  OnExport() {
    this.Appmain.isLoading = true;
    var BodyX = {
      token_login: localStorage[ 'token' ],
      doc_id: this.doc_id,
      emp_id: this.emp_id,
      pagename: this.pagename,
      actionname: this.pagename,
      filetype: 'excel',
    };
    console.log(' ExportFile ');
    console.log(BodyX);
    const onSuccess = (data : any) => {
      this.Appmain.isLoading = false;
      //ขาด เช็ค  user emp_id
      //data.user_admin = false;
      console.log(data);
      // var url = data.path + data.filename;
      // window.open(url);
    };
    this.ws.callWs(BodyX, 'ExportFile').subscribe(
      (data) => onSuccess(data),
      (error) => (this.Appmain.isLoading = false),
      () => { }
    );
  }

  arr_m_exchangerate : any;
  Onload() {
    this.Appmain.isLoading = true;
    const onSuccess = (data : any) => {
      this.Appmain.isLoading = false;
      //ขาด เช็ค  user emp_id
      //data.user_admin = false;

      var user_cur = data.emp_list[ 0 ];
      console.log(data);
      this.model_all_def = {...data};
      this.model_all = data;
      this.arr_m_exchangerate = data.m_exchangerate;
      this.model_all.reimbursement_detail.forEach((e : any) => {
        e[ 'Remark_X' ] = e.remark;
      });

      if (data.emp_list[ 0 ].hasOwnProperty('show_button')) {
        this.user_reject = data.emp_list[ 0 ].show_button;
      } else {
        this.user_reject = false;
      }

      if (data.user_admin) {
        let userSelect = this.Appmain.userSelected;
        const {emp_id, userSelected, status_trip_cancelled} : any = useAuth(data, userSelect);
        this.list_emp = emp_id;
        this.emp_id = emp_id;
        this.Appmain.userSelected = userSelected;
        this.user_reject = getBoolean(status_trip_cancelled) ? false : true;
        this.user_admin = true;
      } else {
        //@ts-ignore
        // const { profile } = this.Appmain.appHeader;
        // this.list_emp = profile.emp_id;
        this.user_admin = false;
        const {profile} = {profile: this.profile[ 0 ]};
        console.log('Getprofile');
        console.log(profile);
        this.list_emp = profile.empId;
        this.user_display = profile.empName;
        this.emp_id = this.list_emp;
        let finduser = data.emp_list.find(({emp_id} : any) => emp_id === profile.empId);
        finduser && (this.user_reject = getBoolean(finduser.status_trip_cancelled) ? false : true);
        !finduser && (this.user_reject = false);
        //?? เช็คว่าเป็น requesterรึป่าว
        //todo finduser ถ้าไม่มีใน  emplist = undefined
        if (!finduser && 'user_request' in data && data.user_request === true) {
          let userSelected = this.Appmain.userSelected;
          this.user_admin = true;
          this.user_reject = false;
          if (userSelected) {
            this.emp_id = this.Appmain.userSelected;
            this.list_emp = this.emp_id;
          } else {
            this.emp_id = data.emp_list[ 0 ].emp_id;
            this.Appmain.userSelected = data.emp_list[ 0 ].emp_id;
            this.list_emp = this.emp_id;
          }
        }
      }
      // this.user_display = data.emp_list[0].userDisplay;
      this.doc_id = data.doc_id;
      // this.emp_id = user_cur.emp_id;
      this.loadEmpList();
    };

    var BodyX = {
      token_login: localStorage[ 'token' ],
      doc_id: this.doc_id,
    };

    this.ws.callWs(BodyX, this.action_stage.action_load).subscribe(
      (data) => onSuccess(data),
      (error) => (this.Appmain.isLoading = false),
      () => {
        //this.check_user();
        if (this.model_all.reimbursement_detail.length > 0) {
          try {
            this.model_all.reimbursement_detail.forEach((el : any, i : any, ds : any) => {
              if (el[ 'reimbursement_date' ] == '' || el[ 'reimbursement_date' ] == null) {
                el[ 'reimbursement_date_type' ] = null;
              } else {
                el[ 'reimbursement_date_type' ] = new Date(this.convert_dateDMY(el[ 'reimbursement_date' ], 'yyyy-MM-dd'));
              }
              if (el[ 'total' ] != '') {
                el[ 'total' ] = this.convert_Int_data('total', i, el[ 'total' ]);
              }
              if (el[ 'grand_total' ] != '') {
                el[ 'grand_total' ] = this.convert_Int_data('grand_total', i, el[ 'grand_total' ]);
              }
            });
            this.Config_Export.dtexport = JSON.stringify(this.model_all.reimbursement_detail);
          } catch (ex) {
            console.log(ex);
          }
        }
      }
    );
  }
  Onload_status_cancel() {
    this.Appmain.isLoading = true;
    const onSuccess = (data: any) => {
      this.Appmain.isLoading = false;
      //ขาด เช็ค  user emp_id

      this.model_all_def = {...data};
      this.model_all = data;
      this.model_all.reimbursement_detail.forEach((e: any) => {
        e[ 'Remark_X' ] = e.remark;
      });
      var i = this.get_index_by_emp(this.model_all.emp_list, this.emp_id);
      if (this.model_all.emp_list[ i ].hasOwnProperty('show_button')) {
        this.user_reject = this.model_all.emp_list[ i ].show_button;
      } else {
        this.user_reject = false;
      }
      this.doc_id = data.doc_id;
      if (this.isCanceled === true) {
        this.isCanceled = false;
        this.alerts.swal_success('Successfully canceled');
      }
      this.TrackingStatus = {...InitTrackStatus};
    };

    var BodyX = {
      token_login: localStorage[ 'token' ],
      doc_id: this.doc_id,
    };

    this.ws.callWs(BodyX, this.action_stage.action_load).subscribe(
      (data) => onSuccess(data),
      (error) => (this.Appmain.isLoading = false),
      () => {
        //this.check_user();

        if (this.model_all.reimbursement_detail.length > 0) {
          try {
            this.model_all.reimbursement_detail.forEach((el : any, i : any , ds : any) => {
              if (el[ 'reimbursement_date' ] == '' || el[ 'reimbursement_date' ] == null) {
                el[ 'reimbursement_date_type' ] = null;
              } else {
                el[ 'reimbursement_date_type' ] = new Date(this.convert_dateDMY(el[ 'reimbursement_date' ], 'yyyy-MM-dd'));
              }
              if (el[ 'total' ] != '') {
                el[ 'total' ] = this.convert_Int_data('total', i, el[ 'total' ]);
              }
              if (el[ 'grand_total' ] != '') {
                el[ 'grand_total' ] = this.convert_Int_data('grand_total', i, el[ 'grand_total' ]);
              }
            });
          } catch (ex) {
            console.log(ex);
          }
        }
      }
    );
  }
  check_user() {
    if (this.model_all.user_admin == true || true) {
      const sortBy = (a: any, b: any) => (+a.id) - (+b.id)
      const dt = this.model_all.reimbursement_detail.filter((res : any, i : any, ds : any) => {
        return res.emp_id == this.emp_id && res.action_type != 'delete';
      }).sort(sortBy);

      return dt
    }
  }
  get_index_by_emp(ds : any, emp_id : any, id? : any) {
    if (ds.length > 0) {
      return ds.findIndex((res : any) => {
        return res.emp_id == emp_id;
      });
    }
    return false;
  }
  test_valuesX(id : any, values : any) {
    this.model_all.reimbursement_detail.forEach((e : any) => {
      if (e.id == id) {
        e.remark = values;
      }
    });
    console.log(this.model_all);
  }

  async ConfrimSave() {
    try {
      const actionSave = await this.alerts.swal_confirm_changes('Do you want to save the document ?');
      if (actionSave.isConfirmed) {
        this.Onsave('saved');
      } else {
        return;
      }
    } catch (ex) {
      console.log(ex);
    }
  }
  OnsaveSendEmail(btn_type : any, template? : any) {
    return new Promise((resolve, reject) => {
      if (btn_type == 'saved') {
        let EmailList = CloneDeep(this.model_all.mail_list);
        if (true) {
          // this.Appmain.isLoading = true;
          const OnsaveSucecss = (data : any) => {
            console.log('After save');
            console.log(CloneDeep(data));
            if (data.after_trip.opt1 == 'true') {
              data.mail_list = EmailList;
              this.model_all_def = {...data};
              this.model_all = data;

              data.data_type = null;
              try {
                var find_index = this.get_index_by_emp(data.emp_list, this.emp_id);
                if (data.emp_list[ find_index ].hasOwnProperty('show_button')) {
                  this.user_reject = data.emp_list[ find_index ].show_button;
                } else {
                  this.user_reject = false;
                }
              } catch (err) {
                console.log(err);
              }

              this.model_all.reimbursement_detail.forEach((el : any) => {
                el[ 'Remark_X' ] = el.remark;

                if (el[ 'reimbursement_date' ] == '' || el[ 'reimbursement_date' ] == null) {
                  el[ 'reimbursement_date_type' ] = null;
                } else {
                  el[ 'reimbursement_date_type' ] = new Date(
                    this.convert_dateDMY(el[ 'reimbursement_date' ], 'yyyy-MM-dd')
                  );
                }
              });
              this.model_all_def = {...data};
            } else {
              // this.alerts.swal_error(data.after_trip.opt2.status);
            }
            this.TrackingStatus = {...InitTrackStatus};
            this.Appmain.isLoading = false;
            this.model_all.emp_list.forEach((item : any) => {
              item.mail_status = 'false';

              if (item.emp_id === this.emp_id) {
                item.mail_status = 'true';
              }
            });
          };

          this.model_all.data_type = 'save';
          if (this.model_all.reimbursement_main.length > 0) {
            this.model_all.reimbursement_main.forEach((el : any) => {
              if (el.emp_id == this.emp_id) {
                el.action_change = 'true';
              }
            });
          }
          this.model_all.emp_list.forEach((item : any) => {
            item.mail_status = 'false';

            if (item.emp_id === this.emp_id) {
              item.mail_status = 'true';
            }
          });
          var bodyX = this.model_all;

          bodyX.reimbursement_detail.forEach((e : any) => {
            if (e.reimbursement_date_type == null || e.reimbursement_date_type == '') {
              e.reimbursement_date_type = null;
            } else {
              var montF = new DatePipe('en-US');
              // var dx2 = montF.transform(e.reimbursement_date_type, 'dd MMM yyyy');
              // e.reimbursement_date_type = dx2;
            }
          });
          console.log('before save');
          console.log(CloneDeep(bodyX));
          this.ws.callWs(bodyX, this.action_stage.action_save).subscribe(
            (res) => OnsaveSucecss(res),
            (error) => {
              console.log(error);
              this.Appmain.isLoading = false;
              reject(error);
            },
            () => {
              try {
                //model_all.reimbursement_detail
                if (this.model_all.reimbursement_detail.length > 0) {
                  this.model_all.reimbursement_detail.forEach((el : any, i : any, ds : any) => {
                    if (el[ 'total' ] != '') {
                      el[ 'total' ] = this.convert_Int_data('total', i, el[ 'total' ]);
                    }
                    if (el[ 'grand_total' ] != '') {
                      el[ 'grand_total' ] = this.convert_Int_data('grand_total', i, el[ 'grand_total' ]);
                    }
                  });
                }
              } catch (ex) {
                console.log(ex);
              }
              this.Exchange_value = {
                currency_id: null,
                as_of: null,
                as_of_type: null,
                Exchange_rate_selected: null,
              };
              resolve(true);
            }
          );
        }
      } else {
        //submit
      }
    });
  }
  Onsave(btn_type : any, template? : any) {
    if (btn_type == 'saved') {
      if (true) {
        this.Appmain.isLoading = true;
        const OnsaveSucecss = (data : any) => {
          console.log('After save');
          console.log(CloneDeep(data));
          if (data.after_trip.opt1 == 'true') {
            this.model_all_def = {...data};
            this.model_all = data;
            if (data.after_trip.opt2.status != 'Successfully saved') {
              data.after_trip.opt2.status = 'Successfully saved';
            }
            this.alerts.swal_success(data.after_trip.opt2.status);
            data.data_type = null;
            try {
              var find_index = this.get_index_by_emp(data.emp_list, this.emp_id);
              if (data.emp_list[ find_index ].hasOwnProperty('show_button')) {
                this.user_reject = data.emp_list[ find_index ].show_button;
              } else {
                this.user_reject = false;
              }
            } catch (err) {
              console.log(err);
            }

            this.model_all.reimbursement_detail.forEach((el : any) => {
              el[ 'Remark_X' ] = el.remark;

              if (el[ 'reimbursement_date' ] == '' || el[ 'reimbursement_date' ] == null) {
                el[ 'reimbursement_date_type' ] = null;
              } else {
                el[ 'reimbursement_date_type' ] = new Date(this.convert_dateDMY(el[ 'reimbursement_date' ], 'yyyy-MM-dd'));
              }
            });

            this.model_all_def = {...data};
          } else {
            this.alerts.swal_error(data.after_trip.opt2.status);
          }
          this.TrackingStatus = {...InitTrackStatus};
          this.Appmain.isLoading = false;
        };

        this.model_all.data_type = 'save';
        if (this.model_all.reimbursement_main.length > 0) {
          this.model_all.reimbursement_main.forEach((el : any) => {
            if (el.emp_id == this.emp_id) {
              el.action_change = 'true';
            }
          });
        }
        this.model_all.emp_list.forEach((item : any) => {
          item.mail_status = 'false';

          if (item.emp_id === this.emp_id) {
            item.mail_status = 'true';
          }
        });
        var bodyX = this.model_all;

        debugger;
        bodyX.reimbursement_detail.forEach((e: any) => {
          if (e.reimbursement_date_type == null || e.reimbursement_date_type == '') {
            e.reimbursement_date_type = null;
          } else {
            var montF = new DatePipe('en-US');
            // var dx2 = montF.transform(e.reimbursement_date_type, 'dd MMM yyyy');
            // e.reimbursement_date_type = dx2;
          }
        });
        console.log('before save');
        console.log(CloneDeep(bodyX));
        this.ws.callWs(bodyX, this.action_stage.action_save).subscribe(
          (res) => OnsaveSucecss(res),
          (error) => {
            console.log(error);
            this.Appmain.isLoading = false;
          },
          () => {
            try {
              //model_all.reimbursement_detail
              if (this.model_all.reimbursement_detail.length > 0) {
                this.model_all.reimbursement_detail.forEach((el: any, i: any, ds: any) => {
                  if (el[ 'total' ]) {
                    el[ 'total' ] = this.convert_Int_data('total', i, el[ 'total' ]);
                  }
                  if (el[ 'grand_total' ]) {
                    el[ 'grand_total' ] = this.convert_Int_data('grand_total', i, el[ 'grand_total' ]);
                  }
                });
              }
            } catch (ex) {
              console.log(ex);
            }
            this.Exchange_value = {
              currency_id: null,
              as_of: null,
              as_of_type: null,
              Exchange_rate_selected: null,
            };
          }
        );
      }
    } else {
      //submit
    }
  }
  countFile() {
    let dt = this.model_all.img_list.filter((res: any) => {
      return res.action_type != 'delete';
    });
    if (dt.length > 0) {
      return false; //-false
    }
    return true; //-true
  }
  convert_Int_data(Fidle: string, index?: any, ev?: any) {
    const disgitEbiz = this.disgitEbiz;
    var newvalue = ev.replace(/,/g, '');
    var x_num = Number(parseFloat(newvalue)).toLocaleString('en-GB', {minimumFractionDigits: disgitEbiz, maximumFractionDigits: disgitEbiz});
    if (x_num == 'NaN') {
      x_num = '2';
    }
    return x_num;
  }
  convert_format(newvalue: any) {
    const disgitEbiz = this.disgitEbiz;
    var x_num = Number(parseFloat(newvalue)).toLocaleString('en-GB', {minimumFractionDigits: disgitEbiz, maximumFractionDigits: disgitEbiz});
    if (x_num == 'NaN') {
      return newvalue;
    }
    return x_num;
  }
  convertInt(Fidle: string, item?: any, ev?: any, input?: any) {
    try {
      ev = ev.toString();
    } catch (ex) { }
    var newvalue = ev.replace(/,/g, '');
    const disgit = /[.]\d+/
    const test = newvalue.toString().match(disgit);
    const dgis2: boolean = (test && test.length > 0 && (test[ 0 ].length - 1) > 2)
    let x_num: string = "0";
    if (dgis2) {
      x_num = Number(newvalue || 0).toLocaleString('en-GB', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    }
    else {
      x_num = Number(newvalue || 0).toLocaleString('en-GB');

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
    if (Fidle == 'total') {
      if (this.TRAVEL_LOCAL) {
        item.grand_total = this.convertInt('', '', item.total.toString());
      } else {
        item.grand_total = this.Cal_Gran_Total(item.total, item.exchange_rate);
      }
    }
    return x_num;
  }

  convertInt2(ev?: any) {
    try {
      ev = ev.toString();
    } catch (ex) { }
    var newvalue = ev.replace(/,/g, '');
    var x_num = Number(parseInt(newvalue)).toLocaleString('en-GB');
    if (x_num == 'NaN') {
      x_num = '0';
    }

    //this.Exchange_value.Exchange_rate_selected = parseInt(newvalue);

    return newvalue;
  }

  numberWithCommas(value: any, input: any) {
    var str_return = value.replace(/,/g, '');
    let disgit3 = /[.]\d+/
    let disgit3Format = value.match(disgit3)
    if (disgit3Format && disgit3Format.length > 0 && disgit3Format[ 0 ].length - 1 > 4) {
      value = Number(str_return || 0).toLocaleString('en-GB');
      input.value = value;
    }
    else {
      input.value = value;
    }
    this.Exchange_value.Exchange_rate_selected = value;
    // return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  calTotal() {
    var total = 0;

    this.model_all.reimbursement_detail.forEach((v: any) => {
      let parse: number;
      if (v.grand_total != '' && v.grand_total != null) {
        parse = parseInt(v.grand_total.replace(/,/g, ''));
      } else {
        parse = 0;
      }
      total += parse;
    });

    return total;
  }
  Openmodal() {
    $('#exampleModalCenter')
      .modal({
        keyboard: false,
      })
      .modal('show');
    // cdk-overlay-container
  }
  public get_data() {
    return this.check_user();
  }
  btnCencel_Onclick() {
    this.alerts.swal_confirm('Do you want to cancel the document ?', '', 'question').then((val) => {
      if (val.isConfirmed == true) {
        this.isCanceled = true;
        this.Onload_status_cancel();
      } else {
      }
    });
  }
  Delete_file(item: any) {
    this.alerts.swal_confirm_delete('Do you want to delete the file ?').then((val) => {
      if (val.isConfirmed) {
        item.action_type = 'delete';
        item.action_change = 'true';
        //console.log(this.model_all.img_list);
        this.alerts.toastr_warning('Please Save Data');
      } else {
        return;
      }
    });
  }
  new_row(id : any, doc_id : any) {
    var dt = this.model_all.reimbursement_detail;

    var emp_id = this.emp_id;

    var last_id = this.model_all.reimbursement_detail
      .filter((v : any) => {
        return v.emp_id == emp_id;
      })
      .sort((a : any, b : any) => {
        return a.id - b.id;
      });

    var len = last_id.length <= 1 ? 0 : last_id.length - 1;
    let irows: number = 0;
    try {
      irows = parseInt(last_id[ len ].id);
    } catch (ex) {
      irows = 0;
    }

    var i: string = (irows + 1).toString();
    var obj = {
      doc_id: doc_id,
      emp_id: emp_id,
      id: i,
      reimbursement_date: '',
      reimbursement_date_type: '',
      details: '',
      exchange_rate: '',
      currency: '',
      as_of: '',
      total: '',
      grand_total: '',
      remark: '',
      Remark_X: '',
      action_type: 'insert',
      action_change: 'true',
    };

    this.model_all.reimbursement_detail.push(obj);
    this.alerts.toastr_success('Add Reimbursement');
  }
  del_row(seq: any, doc_id: any) {
    var dt : any = this.model_all.reimbursement_detail;
    var bcheck = false;

    this.alerts.swal_confirm_delete('').then((val) => {
      if (val.isConfirmed) {
        bcheck = true;
        if (bcheck) {
          var index = dt.findIndex((i : any) => {
            return i.id == seq && i.emp_id == this.emp_id && i.doc_id == doc_id;
          });
          dt[ index ].action_type = 'delete';
          dt[ index ].action_change = 'true';
          // this.action_delete.push(dt[ index ]);

          this.model_all.reimbursement_detail = dt;
          var icheck = dt.filter((i : any) => {
            return i.emp_id == this.emp_id && i.doc_id == doc_id && i.action_type != 'delete';
          });
          if (icheck.length < 1) {
            this.new_row(seq, doc_id);
          }
        }
      } else {
        return;
      }
    });
    console.log(dt);

    //this.check_user();
  }
  get_data_img() {
    return this.model_all.img_list.filter((res : any) => res.emp_id == this.emp_id);
  }
  check_action(item : any) {
    if (item.action_type == 'delete') {
      return true;
    }
    if (item.filename == null || item.filename == '') {
      return true;
    }
    return false;
  }
  reportx() {
    this.Appmain.isLoading = true;
    // body ให้ส่ง parameter ต่างๆที่แสดงด้านบนของ excel
    let body = {
      token_login: localStorage[ 'token' ],
      doc_id: this.doc_id,
    };

    // ข้อมูลในตารางรูปแบบ json
    let jsondata = [
      {
        data: 'row1',
        doc_id: 'xxxx',
      },
      {
        data: 'row2',
        doc_id: 'xxxx',
      },
    ];

    const onSuccess = (data : any) => {
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
        this.Appmain.isLoading = false;
      } else {
        this.Appmain.isLoading = false;
        this.alerts.swal_error(parsed.dtResult[ 0 ].status);
      }
    };

    //data, function name(ฝั่ง asmx), method name(phase1report, allowance, reimbursement)
    this.ws.excel_report(body, JSON.stringify(jsondata), 'TravelReport', 'phase1report').subscribe(
      (data) => onSuccess(data),
      (error) => {
        this.Appmain.isLoading = false;
        this.alerts.swal_error(error);
        console.log(error);
        alert("Can't call web api." + ' : ' + error.message);
      }
    );
  }

  path_file1 : any;
  path_file2 : any;
  stateX : any;
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

    this.Appmain.isLoading = true;
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

    const onSuccess = (data : any) => {
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
        this.Appmain.isLoading = false;
      } else {
        this.Appmain.isLoading = false;
        this.alerts.swal_error(parsed.dtResult[ 0 ].status);
      }
    };
    console.log('***Call Asmx body***');
    console.log(body);

    //data, function name(ฝั่ง asmx), method name(phase1report, allowance, reimbursement)
    this.ws.excel_report(body, JSON.stringify(jsondata), 'TravelReport', 'phase1report').subscribe(
      (data) => onSuccess(data),
      (error) => {
        this.Appmain.isLoading = false;
        this.alerts.swal_error(error);
        console.log(error);
        alert("Can't call web api." + ' : ' + error.message);
      }
    );
  }

  onlyNumberKey(evt : any) {
    console.log(evt);
    const {value} = evt.srcElement;
    console.log(value);
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
    // Only ASCII character in that range allowedR
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
