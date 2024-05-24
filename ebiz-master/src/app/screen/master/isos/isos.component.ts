import {Component, OnInit, Inject, forwardRef, TemplateRef, ViewChild, ElementRef} from '@angular/core';
import {BsModalService,BsModalRef,} from 'ngx-bootstrap/modal';
import { isArray } from 'ngx-bootstrap/chronos';
import { FileuploadserviceService } from '../../../ws/fileuploadservice/fileuploadservice.service';
import { AppComponent } from '../../../app.component';
import { AspxserviceService } from '../../../ws/httpx/aspxservice.service';
import {HttpClient} from '@angular/common/http';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { MasterComponent } from '../master.component';

import {AngularEditorConfig} from '@kolkov/angular-editor';
import { SafePipe } from '../../../safe.pipe';
import { AlertServiceService } from '../../../services/AlertService/alert-service.service';

// for Search Emp
import {COMMA, ENTER, SEMICOLON} from '@angular/cdk/keycodes';
import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {Observable, of} from 'rxjs';
import {tap, startWith, debounceTime, distinctUntilChanged, switchMap, map} from 'rxjs/operators';
import {FormControl} from '@angular/forms';
import { InitTrackStatus, TrackingStatus, TrackingStatusNumber } from '../../../model/localstorage.model';
import { getBoolean, useAuth } from '../../../function/globalfunction.component';
// for Search Emp

declare var $: any;
declare const toastr: any;

export interface Fruit {
  name: string;
}

@Component({
  selector: 'app-isos',
  templateUrl: './isos.component.html',
  styleUrls: [ './isos.component.css' ],
})
export class IsosComponent implements OnInit {
  htmlContent = '';
  htmlContentWithoutStyles = '';
  videoSource = ''; //"http://tbkc-dapps-05.thaioil.localnet/ebiz_ws/Image/isos/example_video_1080p.mp4"

  @ViewChild('closeModel', {static: true}) btnCloseX?: ElementRef;

  @ViewChild('videoPlayer', {static: true}) videoplayer?: ElementRef;

  // for Search Emp
  @ViewChild('fInput', {static: true}) fInput?: ElementRef;
  // for Search Emp

  detail: boolean = true;
  edit_input: boolean = false;

  pathPhase1: any = null;

  panel = {
    show: true,
    after: false,
  };
  status = false;
  show_button = true;
  doc_idS = '';
  empid = '';
  emp_idS = '';
  emp_list : any = [];
  arrX: any[] = [];
  empname = '';
  name_user = '';
  sumx = 0;
  namex = '';
  travelInsurance_detail = [];
  travel : any;
  business_date : any;
  travel_date : any;
  country_city : any;
  img_list = [];
  img_list_cert = [];
  selectedFile: File = null!;
  doc_id : any;
  pagename = 'isos';
  emp_id : any;
  isos_detailX = [];
  varx = [];
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
  business_type_listX : any = [];
  Email_sendX : any = [];
  email_send : any;
  mail_curent = '';
  tp_clone?: TemplateRef<any>;
  modalRef?: BsModalRef;

  array_result: any = [];
  displayPreview = true;
  oldStr = '';
  model_all: any = {
    emp_list: [],
  };
  // for Search Emp
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = false;
  separatorKeysCodes: number[] = [ ENTER, COMMA, SEMICOLON ];
  fCtrl = new FormControl();
  filteredEmp: Observable<string[]>;
  MailList: any = [];
  allEmp: any = [];
  masterEmp: any[] = [];
  BrokerArr: any[] = [];
  inputText = '';
  // for Search Emp
  TrackingStatus: TrackingStatus = {...InitTrackStatus};
  TRAVEL_TYPE: string = '';
  profile: unknown;

  constructor(
    @Inject(forwardRef(() => MasterComponent)) private appMain: MasterComponent,
    private modalService: BsModalService,
    private http: HttpClient,
    public ws: AspxserviceService,
    // private x: AppComponent,
    private fileuploadservice: FileuploadserviceService,
    private alerts: AlertServiceService
  ) {
    this.status = false;

    // for Search Emp
    this.filteredEmp = this.fCtrl.valueChanges.pipe(
      startWith(null),
      map((x: string | null) => (x ? x.toLowerCase() : x)),
      map((x: string | null) => (x ? this._filter(x) : this.allEmp.slice()))
    );
    // for Search Emp
  }

  ngOnInit() {
    console.clear();
    this.doc_id = this.appMain.DOC_ID;
    // for Search Emp
    this.loadEmpList();
    // for Search Emp
    this.OnloadDoc();
    this.onloadX();
  }
  ngDoCheck() {
    if (this.displayPreview) {
      try {
        setTimeout(() => {
          const con = document.querySelector("#container-mat-isos");
          const width = con?.clientWidth;
          const findImg = document.querySelectorAll(`#displayPreview div img`)
          if (findImg && findImg.length > 0) {
            findImg.forEach(el => {
              // if (width < el.clientWidth) {
              //   el.setAttribute("width", "100%")
              // }

            })
          }
        }, 100)
      }
      catch (err) { }
    }
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
  get getTotalPerson() {
    let hasEmplist = 'emp_list' in this.model_all;
    if (hasEmplist) {
      return this.model_all.emp_list.length;
    }
    return '0';
  }
  // get docStatus() {
  //   // return (Status: number) => {
  //   //   let emp_id = this.emp_idS;
  //   //   let id: number = 1;
  //   //   if (isArray(this.emp_listx) === false) return '';
  //   //   if (this.emp_listx.length > 0) {
  //   //     // TEST
  //   //     // this.emp_list.forEach((i) => (i.doc_status_id = '2'));
  //   //     // let dt = this.emp_listx.find((item) => item.emp_id === emp_id);
  //   //     // if (dt) {
  //   //     //   id = Number(dt.doc_status_id);
  //   //     //   if (Status === id) {
  //   //     //     this.TrackingStatus[ Status ] = true;
  //   //     //   }
  //   //     // }
  //   //   }
  //   //   // return this.TrackingStatus[ Status ];
  //   // };
  // }
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
  async OnloadDoc() {
    this.profile = await this.CheckLogin();
    // this.appMain.isLoading = true;
    var BodyX = {
      token_login: localStorage[ 'token' ],
      doc_id: this.doc_id,
    };

    const onSuccess = (data : any) => {
      let TravelTypeDoc = /local/g.test(this.appMain.TRAVEL_TYPE);
      this.TRAVEL_TYPE = TravelTypeDoc ? 'Province/City/Location :' : 'Country / City  :';
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
  fnMockup() {
    let str =
      '<div style="text-align: center;"><b style="background-color: transparent;"><i><u>ทดสอบ</u></i></b></div><div><br></div><div style="text-align: center;"><img src="data:image/jpeg;base64,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">&nbsp;<br></div><div><br></div><div><hr id="null"><div _ngcontent-ghi-c11="" class="angular-editor-wrapper">If you need Emergency Assistance while you are in Thailand, please call the Bangkok Assistance Centre on +662 205 7777.</div><div _ngcontent-ghi-c11="" class="angular-editor-wrapper"><br></div><div _ngcontent-ghi-c11="" class="angular-editor-wrapper">We first opened our office in Bangkok in 1986, and five years later we upgraded it to a full-scale Assistance Centre. We now serve more than three million members in Thailand. As the leading provider of enhancement services, we serve insurance, banking and credit card, telecommunications and other companies seeking to enhance their products and services. In addition, we also serve individual members and corporations.&nbsp;</div><div _ngcontent-ghi-c11="" class="angular-editor-wrapper"><br></div><div _ngcontent-ghi-c11="" class="angular-editor-wrapper">Our range of services includes:</div></div><blockquote style="margin: 0 0 0 40px; border: none; padding: 0px;"><div><div _ngcontent-ghi-c11="" class="angular-editor-wrapper">- Medical advice and assistance</div></div><div><div _ngcontent-ghi-c11="" class="angular-editor-wrapper"><span style="background-color: transparent;">-</span><span style="background-color: transparent;">&nbsp;</span>Healthcare management</div></div><div><div _ngcontent-ghi-c11="" class="angular-editor-wrapper"><span style="background-color: transparent;">-</span><span style="background-color: transparent;">&nbsp;</span>Security advice and assistance&nbsp;</div></div><div><div _ngcontent-ghi-c11="" class="angular-editor-wrapper"><span style="background-color: transparent;">-</span><span style="background-color: transparent;">&nbsp;</span>Concierge and lifestyle</div></div><div><div _ngcontent-ghi-c11="" class="angular-editor-wrapper"><span style="background-color: transparent;">-</span><span style="background-color: transparent;">&nbsp;</span>Roadside assistance</div></div><div><div _ngcontent-ghi-c11="" class="angular-editor-wrapper"><span style="background-color: transparent;">-</span><span style="background-color: transparent;">&nbsp;</span>Home assistance</div></div></blockquote><div><div _ngcontent-ghi-c11="" class="angular-editor-wrapper">In particular, we are recognised as the major medical services provider to the oil and gas industry in Thailand. Services we provide to this sector include:</div></div><blockquote style="margin: 0 0 0 40px; border: none; padding: 0px;"><div><div _ngcontent-ghi-c11="" class="angular-editor-wrapper"><span style="background-color: transparent;">-</span><span style="background-color: transparent;">&nbsp;</span>First-aid training</div></div><div><div _ngcontent-ghi-c11="" class="angular-editor-wrapper"><span style="background-color: transparent;">-</span><span style="background-color: transparent;">&nbsp;</span>Paramedic and doctor staffing</div></div><div><div _ngcontent-ghi-c11="" class="angular-editor-wrapper"><span style="background-color: transparent;">-</span><span style="background-color: transparent;">&nbsp;</span>Site surveys</div></div><div><div _ngcontent-ghi-c11="" class="angular-editor-wrapper"><span style="background-color: transparent;">-</span><span style="background-color: transparent;">&nbsp;</span>Medical check-up, consultation and assessment.</div></div></blockquote><div><div _ngcontent-ghi-c11="" class="angular-editor-wrapper">Due to the high standards of medical care available in Bangkok, our Assistance Centre is now a centre of medical excellence for the Indochina region, Bangladesh and South-East China. We have access to charter aircraft and helicopters throughout Thailand to provide immediate response to emergency situations, domestically and internationally, including secured helicopter-landing rights at major hospitals in Bangkok. All our services are available in English, German, Thai, Japanese and French.&nbsp;</div><div _ngcontent-ghi-c11="" class="angular-editor-wrapper"><br></div><div _ngcontent-ghi-c11="" class="angular-editor-wrapper">For more information, please call or email us.</div><div _ngcontent-ghi-c11="" class="angular-editor-wrapper"><br></div><div _ngcontent-ghi-c11="" class="angular-editor-wrapper">Click here for directions to the&nbsp;<a href="https://www.google.com" target="_blank">Bangkok Assistance Centre.</a></div></div>';
    return str;
  }

  setcssWidth() {
    try {
      const $elem = $('.ngx-dropdown-container .ngx-dropdown-list-container');
      $elem[ 0 ].style.setProperty('min-width', '100%', 'important');
      $elem[ 1 ].style.setProperty('max-width', '650px', 'important');
    } catch (err) { }
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
  getBoolean(value : any) {
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

  emp_listx : any;
  BrokerArrModel: any;
  onloadX() {
    this.appMain.isLoading = true;

    let bodyX = {
      token_login: localStorage[ 'token' ],
      doc_id: this.doc_id,
    };
    console.log(bodyX);

    const onSuccess = (data : any): void => {
      console.log('---Load data isos sucess---');
      console.log(data);
      this.model_all = data;
      this.arrX = data;
      this.array_result = data;
      this.namex = data.user_display;
      this.travel = data.travel_topic;
      this.business_date = data.business_date;
      this.country_city = data.country_city;
      this.travel_date = data.travel_date;
      this.isos_detailX = data.isos_detail;
      this.business_type_listX = data.business_type_list;
      this.emp_list = data.emp_list;
      this.emp_idS = data.emp_list[ 0 ].emp_id;
      // this.emp_list[ 0 ].mail_status = 'true';
      this.email_send = data.emp_list;
      this.status = true;
      this.BrokerArr = data.m_broker;
      this.emp_listx = data.emp_list;
      this.BrokerArrModel = this.BrokerArr[ 0 ];
      // this.emp_listx.forEach((e) => {
      //   e[ 'Check_status' ] = false;
      //   e.type_send_to_broker = this.getBoolean(e.type_send_to_broker);
      // });

      // this.arrX[ 'emp_list' ].forEach(function (e) {
      //   e.mail_status = 'true';
      // });

      this.htmlContent = data.html_content;
      this.oldStr = this.htmlContent;
      this.videoSource = data.video_url === null ? '' : data.video_url;

      //if(this.htmlContent === '' this.fnMockup())

      this.htmlContent = this.htmlContent === '' ? '' : this.htmlContent;
      // this.htmlContent = this.htmlContent === '' ? this.fnMockup() : this.htmlContent;

      this.appMain.isLoading = false;
      console.log('data isos');
      console.log(data);
      if (data.user_admin === false) {
        this.status = false;
        // const { profile } = this.appMain.appHeader;
        // console.log(profile);
        // this.emp_id = profile.emp_id;
        // this.namex = profile.username;

        //@ts-ignore
        const profile = this.profile[ 0 ];
        this.emp_idS = profile.empId;
        this.namex = profile.empName;
        let finduser = data.emp_list.find(({emp_id} : any) => emp_id === profile.empId);
        finduser && (this.show_button = getBoolean(finduser.status_trip_cancelled) ? false : true);
        !finduser && (this.show_button = false);
        //?? เช็คว่าเป็น requesterรึป่าว
        //todo finduser ถ้าไม่มีใน  emplist = undefined
        if (!finduser && 'user_request' in data && data.user_request === true) {
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
        let userSelect = this.appMain.userSelected;
        const {emp_id, userSelected, status_trip_cancelled}: any = useAuth(data, userSelect);
        this.emp_idS = emp_id;
        this.appMain.userSelected = userSelected;
        this.show_button = getBoolean(status_trip_cancelled) ? false : true;
      }
    };

    this.ws.callWs(bodyX, 'LoadISOS').subscribe(
      (data) => onSuccess(data),
      (error) => {
        console.log(error);
      }
    );
  }

  send_mail_to_insurance() {
    let Check_status = false;
    this.emp_listx.forEach((e : any) => {
      if (e.Check_status === true) {
        Check_status = true;
      }
    });
    if (Check_status === false) {
      this.alerts.swal_warning('Please select traveller');
      return;
    }
    this.appMain.isLoading = true;
    this.oldStr = this.htmlContent;

    this.array_result.data_type = 'save';
    this.array_result.html_content = this.htmlContent;
    // this.array_result.img_list.name = this.videoSource;

    if (this.videoSource === '') {
      this.array_result.img_list[ 0 ].action_change = 'true';
      this.array_result.img_list[ 0 ].action_type = 'delete';
    }

    const onSuccess = (data : any) => {
      console.log('---Save success---');
      console.log(data);
      if (data.after_trip.opt1 == 'true') {
        this.array_result = [];
        this.array_result = data;
        this.emp_listx = data.emp_list;
        this.emp_listx.forEach((e : any) => {
          e.mail_status = 'false';
          e.Check_status = false;
          e.type_send_to_broker = this.getBoolean(e.type_send_to_broker);
        });

        this.videoSource = data.video_url === null ? '' : data.video_url;
        this.htmlContent = data.html_content;
        this.oldStr = this.htmlContent;
        this.appMain.isLoading = false;
        this.alerts.swal_success('The information has been updated');
        this.displayPreview = true;
      } else {
        this.appMain.isLoading = false;
        console.log('---error---');
        console.log(data);
        this.alerts.swal_error(data.after_trip.opt2.status);
      }
    };
    console.log('--- BrokerArrModel ---');
    console.log(this.BrokerArrModel);
    var brokerData = this.BrokerArrModel;
// brokerData == []
    if (brokerData == '' || brokerData == 'undefined' || brokerData == null ) {
      this.appMain.isLoading = true;
      this.alerts.swal_warning('Please check data ');
      return;
    } else {
      this.modalRef?.hide();
      this.array_result.m_broker.forEach((e: any) => {
        if (brokerData.id == e.id) {
          e.status = 'true';
          e.action_type = 'update';
          e.action_change = 'true';
        }
      });
    }

    debugger;
    this.emp_listx.forEach(function (e : any) {
      if (e.Check_status == true) {
        e.mail_status = 'true';
      } else {
        e.mail_status = 'false';
      }
    });

    //this.array_result.emp_list = this.arrX['emp_list'] ;
    this.array_result.emp_list = this.emp_listx;
    console.log('---Save---');
    console.log(this.array_result);
    this.ws.callWs(this.array_result, 'SendMailISOSRecord').subscribe(
      (data) => onSuccess(data),
      (error) => {
        this.appMain.isLoading = false;
        console.log(error);
        alert("Can't call web api." + ' : ' + error.message);
      }
    );
  }
  get EmpallhasISOSRECORD(): boolean {
    const emp_list = this.emp_listx;
    let showmsg = true;
    if (emp_list.length > 0) {
      showmsg = emp_list.every(({type_send_to_broker} : any) => this.getBoolean(type_send_to_broker) === true);
    }
    return showmsg;
  }
  update_userByDOC(empId : any) {
    var show_button, doc_idS;
    var empxid = this.emp_idS.toString();
    let status_trip_cancelled = false;

    // this.arrX[ 'emp_list' ].forEach(function (e : any) {
    //   if (e.emp_id == empId) {
    //     show_button = e.show_button;
    //     doc_idS = e.doc_id;
    //     if (e.status_trip_cancelled === 'true') {
    //       status_trip_cancelled = true;
    //     }
    //   }
    // });

    // this.doc_idS  = doc_idS;
    if (status_trip_cancelled) {
      this.show_button = false;
    }
    this.appMain.userSelected = this.emp_idS;
    this.TrackingStatus = {...InitTrackStatus};
  }

  transformX(items : any, searchText : any) {
    searchText = searchText.toLocaleLowerCase();
    return items.filter((it : any) => {
      return it.userEmail.toLocaleLowerCase().includes(searchText);
    });
  }

  modelChanged(event : any) {
    // var arrx = this.arrX[ 'emp_list' ];
    // this.email_send = this.transformX(arrx, event);
  }

  set_modal() {
    $('.modal-backdrop').css({'z-index': 700});
    $('.modal').css({'z-index': 800});

    // return this.transformX(this.email_send,text);
  }
  addemail(textvalues : any) {
    var statusInfunction = true;
    // Duplicate Mail
    for (var i = 0; i < this.Email_sendX.length; i++) {
      // if (this.Email_sendX[ i ].userEmail == textvalues) {
      //   statusInfunction = false;
      //   this.Swalalert('Mail Duplicate', 'error');
      // }

      console.log(' + + + ' + i);
    }

    if (textvalues == '') {
      statusInfunction = false;
    }

    //alert(statusInfunction) ;

    if (statusInfunction != false) {
      this.Email_sendX.push({
        userEmail: textvalues,
      });
    }

    this.mail_curent = '';
    // this.email_send = this.arrX[ 'emp_list' ];
  }

  deleteRow(event : any) {
    this.Email_sendX.splice(event, 1);
  }

  SendEmail() {
    if (this.Email_sendX.length == 0) {
      this.Swalalert('Not Have Email List', 'error');
    }
    ///alert();
    // not have email list
    this.doc_idS = '08001089';
    var bodyX = {
      token_login: 'b7a307a9-5d02-4553-b5d2-63c297cb3bcc0',
      emp_id: this.emp_idS,
      doc_id: this.doc_idS,
      page_name: 'isos',
      action_name: 'NotiISOSNewListRuningNoName',
    };

    const onSuccess = (data : any): void => {
      console.log(data);
      this.Email_sendX = [];
    };

    this.ws.callWs(bodyX, 'EmailConfig').subscribe(
      (data) => onSuccess(data),
      (error) => {
        this.appMain.isLoading = false;
        console.log(error);
      }
    );
  }

  CancelModel() {
    this.btnCloseX?.nativeElement.click();
  }

  swal_confrim(type_data : any, btntext : any) {
    return Swal.fire({
      //title: "Do you want to save the " + type_data + " ?",
      title: type_data,
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      confirmButtonText: btntext,
    });
  }

  Swalalert(msg: any, type: any) {
    Swal.fire(msg, '', type);
  }

  business_name(bussEvent: any) {
    var res;
    this.business_type_listX.forEach(function (e : any) {
      if (e.id == bussEvent) {
        res = e.name;
      } else {
        res = '-';
      }
    });

    return res;
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
  }

  onFileSelect(event : any) {
    this.selectedFile = <File>event.target.files[ 0 ];
    if (this.selectedFile.size / 1024 / 1024 <= 50) {
      console.log(event);
      console.log(this.selectedFile);
      this.onUpload();
      //this.videoSource = "https://vjs.zencdn.net/v/oceans.mp4"
    } else {
      console.log(this.selectedFile);
      this.alerts.swal_warning('Maximum upload file size 50 mb.');
    }
  }

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

  onUpload() {
    this.appMain.isLoading = true;

    const onSuccess = (res : any) => {
      this.appMain.isLoading = false;

      if (res.after_trip.opt1 == 'true') {
        console.log('---Upload image success---');
        console.log(res);
        this.videoSource = res.img_list.path + res.img_list.filename;

        //this.array_result.img_list = res.img_list;
        this.array_result.img_list[ 0 ].action_change = 'true';
        //this.array_result.img_list[0].action_type = res.img_list.action_type;
        this.array_result.img_list[ 0 ].filename = res.img_list.filename;
        this.array_result.img_list[ 0 ].path = res.img_list.path;

        console.log(this.videoSource);
        console.log(this.array_result);
        // toastr.success('Upload file complete.', 'Sucess!', { "positionClass": "toast-bottom-right", "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 3000 });
        this.alerts.toastr_success('Upload file complete.');

        // Swal.fire(
        //   'Success!',
        //   res.after_trip.opt2.status,
        //   'success'
        // )
      } else {
        console.log('---error---');
        console.log(res);
        Swal.fire('Error!', 'Error : ' + res.after_trip.opt2.status, 'error');
      }
    };

    let Jsond = {
      file: this.selectedFile,
      doc_id: this.doc_id,
      pagename: this.pagename,
      emp_id: this.emp_id,
      file_token_login: localStorage[ 'token' ],
    };
    this.fileuploadservice.postFilePhase2(this.selectedFile, '0', 'isos', '0', Jsond.file_token_login).subscribe(
      (res) => onSuccess(res),
      (error) => {
        this.appMain.isLoading = false;
        console.log(error);
        //alert('error!');
        Swal.fire('Error!', 'Error : ' + error.error, 'error');
      }
    );
  }

  // Text Editor config
  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '30rem',
    minHeight: '15rem',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      {class: 'arial', name: 'Arial'},
      {class: 'times-new-roman', name: 'Times New Roman'},
      {class: 'calibri', name: 'Calibri'},
      {class: 'comic-sans-ms', name: 'Comic Sans MS'},
    ],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText',
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    //uploadUrl: 'https://api.exapple.com/v1/image/upload',
    //upload: (file: File) => { ... }

    uploadWithCredentials: false,
    sanitize: false,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      [ 'fontName', 'subscript', 'superscript' ],
      [ 'customClasses', 'insertVideo', 'toggleEditorMode' ],
      // ['bold', 'italic'],
      // ['fontSize']
    ],

    // editable: true,
    // spellcheck: true,
    // height: '15rem',
    // minHeight: '5rem',
    // placeholder: 'Enter text here...',
    // translate: 'no',
    // defaultParagraphSeparator: 'p',
    // defaultFontName: 'Arial',
    // toolbarHiddenButtons: [

    //   ],
    // customClasses: [
    //   {
    //     name: "quote",
    //     class: "quote",
    //   },
    //   {
    //     name: 'redText',
    //     class: 'redText'
    //   },
    //   {
    //     name: "titleText",
    //     class: "titleText",
    //     tag: "h1",
    //   },
    // ]
  };

  showHTML() {
    // this.htmlContentWithoutStyles = document.getElementById('htmlDiv').innerHTML;
  }

  deleteVideo() {
    this.videoSource = '';
    this.array_result.img_list[ 0 ].action_change = 'true'; //action_type
    this.array_result.img_list[ 0 ].filename = '';
  }

  async ConfrimSave() {
    try {
      const actionSave = await this.alerts.swal_confirm_changes('Do you want to save the document ?');
      if (actionSave.isConfirmed) {
        this.saveTextEditor('save');
      } else {
        return;
      }
    } catch (ex) {
      if (ex instanceof Error) {
        console.log(ex.message.toString());
      }
    }
  }
  saveTextEditor(datatype : any) {
    //console.log(this.htmlContentWithoutStyles);
    //console.log(this.htmlContent);
    //console.log(JSON.stringify(this.htmlContent));

    this.appMain.isLoading = true;
    this.oldStr = this.htmlContent;

    this.array_result.data_type = datatype;
    this.array_result.html_content = this.htmlContent;
    // this.array_result.img_list.name = this.videoSource;

    if (this.videoSource === '') {
      this.array_result.img_list[ 0 ].action_change = 'true';
      this.array_result.img_list[ 0 ].action_type = 'delete';
    }

    console.log('---Save---');
    console.log(this.array_result);

    const onSuccess = (data : any) => {
      console.log('---Save success---');
      console.log(data);
      if (data.after_trip.opt1 == 'true') {
        this.array_result = [];
        this.array_result = data;

        this.videoSource = data.video_url === null ? '' : data.video_url;
        this.htmlContent = data.html_content;
        this.oldStr = this.htmlContent;
        this.appMain.isLoading = false;
        // this.alerts.swal_sucess(data.after_trip.opt2.status);
        this.alerts.swal_success('Successfully saved');

        this.displayPreview = true;
      } else {
        this.appMain.isLoading = false;
        console.log('---error---');
        console.log(data);
        this.alerts.swal_error(data.after_trip.opt2.status);
      }
    };
    // this.array_result.emp_list = this.arrX[ 'emp_list' ];
    this.ws.callWs(this.array_result, 'SaveISOS').subscribe(
      (data) => onSuccess(data),
      (error) => {
        this.appMain.isLoading = false;
        console.log(error);
        alert("Can't call web api." + ' : ' + error.message);
      }
    );
  }

  preview() {
    this.displayPreview = true;
  }

  edit() {
    this.displayPreview = false;

    console.log(this.displayPreview);
  }

  cancel() {
    this.htmlContent = this.oldStr;
    console.log('cancel');
    this.displayPreview = true;
  }

  test_swal() {
    // this.alerts.swal_confrim_delete('').then((val) => {

    //   if (val.isConfirmed) {
    //     //alert(`You typed: ${val.isConfirmed}`);
    //     this.alerts.swal_sucess('');
    //   } else {

    //   }

    // });

    this.alerts.swal_confirm('Test', 'Do you want to delete the data?', 'error').then((val) => {
      if (val.isConfirmed) {
        //alert(`You typed: ${val.isConfirmed}`);
        this.alerts.swal_success('');
      } else {
      }
    });
  }

  test_Toastr() {
    this.alerts.toastr_success('save data sucess.');
  }

  // for Search Emp
  loadEmpList() {
    let bodyX = {
      token_login: localStorage[ 'token' ],
      filter_value: '',
    };

    this.appMain.isLoading = true;
    const onSuccess = (data : any) => {
      console.log('---load success---');
      console.log(data);
      if (data.after_trip.opt1 == 'true') {
        this.masterEmp = data.emp_list;
        //console.log(this.masterEmp);
        this.appMain.isLoading = false;
      } else {
        this.appMain.isLoading = false;
        console.log('---error---');
        console.log(data);
        Swal.fire('Error!', 'Error : ' + data.after_trip.opt2.status, 'error');
      }
    };
    this.ws.callWs(bodyX, 'LoadEmployeeList').subscribe(
      (data) => onSuccess(data),
      (error) => {
        this.appMain.isLoading = false;
        console.log(error);
        alert("Can't call web api." + ' : ' + error.message);
      }
    );
  }

  //ถ้าไม่เลือกที่ autocomplete จะเข้า fn นี้
  add(event: MatChipInputEvent): void {
    // //debugger
    const input = event.input;
    const value = event.value;
    // Add our fruit
    if ((value || '').trim()) {
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
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.fCtrl.setValue(null);
  }

  remove(emp : any, indx : any): void {
    this.MailList.splice(indx, 1);
  }

  //ถ้าเลือกที่ autocomplete จะเข้า fn นี้
  selected(event: MatAutocompleteSelectedEvent): void {
    this.MailList.push(event.option.value);
    // this.fInput.nativeElement.value = '';
    this.fCtrl.setValue(null);
  }

  private _filter(value: any): any[] {
    //console.log(this.allEmp.filter(x => x.displayname.toLowerCase().includes(value)));
    return this.allEmp.filter((x : any) => x.displayname.toLowerCase().includes(value));
    //return this.allEmp.filter(o => compare_set.includes(o[0]));
  }

  doFilter() {
    if (this.inputText != null && this.inputText != '' && this.inputText.length > 2) {
      //console.log(this.inputText);
      this.allEmp = this.masterEmp;
    } else {
      this.allEmp = [];
    }
  }

  Send_Email() {
    this.EmailSend('SendMailISOS');
  }

  EmailSend(datatype : any) {
    //console.log(this.htmlContentWithoutStyles);
    //console.log(this.htmlContent);
    //console.log(JSON.stringify(this.htmlContent));

    this.appMain.isLoading = true;
    this.array_result.data_type = 'submit';

    const onSuccess = (data : any) => {
      console.log('---Save E-mail success---');
      console.log(data);
      this.emp_listx = data.emp_list;
      this.emp_listx.forEach((e : any) => {
        e.type_send_to_broker = this.getBoolean(e.type_send_to_broker);
      });
      if (data.after_trip.opt1 == 'true') {
        this.appMain.isLoading = false;
        // this.alerts.swal_sucess(data.after_trip.opt2.status);
        this.alerts.swal_success('The information has been updated');
      } else {
        this.appMain.isLoading = false;
        this.alerts.swal_error(data.after_trip.opt2.status);
      }
    };

    console.log('-- SendMailISOS --');
    console.log(this.array_result);
    this.ws.callWs(this.array_result, 'SendMailISOS').subscribe(
      (data) => onSuccess(data),
      (error) => {
        this.appMain.isLoading = false;
        console.log(error);
        alert("Can't call web api." + ' : ' + error.message);
      }
    );
  }

  displayName(EmpList : any) {
    return EmpList.displayname;
  }
  // for Search Emp

  ConverstNum(str : any) {
    //console.log(str);
    var re;
    if (str == '' || str == null) {
      re = 0;
    } else {
      re = parseInt(str);
    }
    return re;
  }
}
