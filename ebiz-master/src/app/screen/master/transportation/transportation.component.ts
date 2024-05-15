import {HttpClient} from '@angular/common/http';
import {Component, forwardRef, Inject, OnInit} from '@angular/core';
// import { MainComponent } from '../../../../components/main/main.component';
import { FileuploadserviceService } from '../../../ws/fileuploadservice/fileuploadservice.service';
import { AspxserviceService } from '../../../ws/httpx/aspxservice.service';
import { MasterComponent } from '../master.component';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import {AngularEditorConfig} from '@kolkov/angular-editor';
import * as fs from 'file-saver';
import { InitTrackStatus, TrackingStatus, TrackingStatusNumber } from '../../../model/localstorage.model';
import {from, of} from 'rxjs';
import {distinct, toArray} from 'rxjs/operators';
import { AlertServiceService } from '../../../services/AlertService/alert-service.service';
import { ConfigUrl } from '../../../ws/configUrl/config-url';
import { CloneDeep, getBoolean, useAuth } from '../../../function/globalfunction.component';


declare var $: any;

@Component({
  selector: 'app-transportation',
  templateUrl: './transportation.component.html',
  styleUrls: [ './transportation.component.css' ],
})
export class TransportationComponent implements OnInit {
  action_stage = {
    action_save: 'SaveTransportation',
    action_load: 'LoadTransportation',
    action_submit: 'SaveTransportation',
    action_load_doc: 'LoadDoc',
    action_send_status: 'OpenWebCarService',
  };

  model_all = {
    token_login: '',
    cars_doc_no: '',
    t_car_id: '',
    doc_id: '',
    data_type: '',
    id: '1',
    user_admin: false,
    user_display: '',
    transportation_type: '',
    url_personal_car_document: '',
    html_content: '',
    transportation_car : [
      { telephone_no: '' ,
      car_registration_no : '',
      company_name : '',
      driver_name : '',
      car_model: '',
      car_color: '',
      t_car_id: ''
      } 
    ],
    transportation_detail: [
      {
        place_to : '',
        place_to_url: '',
        emp_tel : '',
        place_from : '',
        place_type: '',
        travel_date: '',
        place_from_url: '',
        transport_desc: '',
        emp_display: '',
        travel_time: '',
        car_type : []
      }
    ],
    emp_list: [
      {
        emp_id: '',
        userDisplay: ''
      }
    ],
    img_list: [],
    after_trip: {},
  };

  CarType: any[] = [
    {name: 'Company Car', code: 'company_car'},
    {name: 'Personal Car', code: 'personal_car'},
  ];
  panel = {show: true, showTS: true};
  Transport_wording: string = `We may also oolleot information how the Servioe is aooessed and used ("Usage Data").
  This Usage Data may inolude information suoh as your oomputer's Internet Protoool
  address (e.g. IP address), browser type, browser version, the pages of our Servioe that you
  visit, the time and date of your visit, the time spent on those pages, unique devioe identifiers
  and other diagnostio data. We use oookies and similar traoking teohnologies to traok the
  aotivity on our Servioe and hold oertain information.
  Cookies are files with small amount of data whioh may inolude an anonymous unique
  identifier. Cookies are sent to your browser from a website and stored on your devioe.
  Traoking teohnologies also used are beaoons, tags, and soripts to oolleot and traok
  information and to improve and analyze our Servioe.`;
  // {name:"Personal Car",code:"personal_car"}
  model_all_def = {...this.model_all};
  action_delete = [];
  accept_true: boolean = false;
  doc_id: any;
  pagename = 'transportation';
  emp_id: any;
  selectfile: File | undefined;
  list_emp: string = '';
  select_user: any;
  totalgantotal: number = 0;
  car_selected_val = 'company_car';
  checkall_selected: boolean = false;
  icount_row = 0;
  user_reject: boolean = true;
  sort_selectd = {
    name: false,
    modified_date: false,
    modified_by: false,
  };
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
    ],
  };
  transportation_car_length : any;
  transportation_detail_length : any;
  userDetail: any | null = null;
  pathPhase1: any | null = null;
  htmlContent: string = ``;
  htmlContentWithoutStyles: string = '';
  displayPreview: boolean = true;
  oldStr: string = '';
  checkCaseCar = {
    hasPersonal: false,
    hasaddCar: false,
  };
  TrackingStatus: TrackingStatus = {...InitTrackStatus};
  TRAVEL_TYPE: string = '';
  profile: unknown;
  transportation_car_byemp: boolean = false;
  user_admin: boolean = false;
  constructor(
    // private appmain: MasterComponent,
    // private http: HttpClient,
    // public alerts: AlertServiceService,
    // private ws: AspxserviceService,
    // private fileuploadservice: FileuploadserviceService,
    // public urlWs: ConfigUrl
  ) { }
  

  ngOnInit() {
    console.clear();
    // this.doc_id = this.appmain.DOC_ID;
    this.Onload();
    this.OnloadDoc();
  }

  icount_row_func() {
    return (this.icount_row += 1);
  }
  get_index_by_emp(ds:any, emp_id: string, id?: string) {
    if (ds.length > 0) {
        return ds.findIndex((res : any) => {
            return res.emp_id === emp_id && (id ? res.id === id : true);
        });
    }
    return false;
}
showHTML() {
  const htmlDiv = document.getElementById('htmlDiv');
  if (htmlDiv) {
      this.htmlContentWithoutStyles = htmlDiv.innerHTML;
  }
}

  OpenDocument(doc_id : string, part : string) {
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
    let url = 'main/request/edit/' + doc_id + '/' + states;
    window.open(url, '_blank');
  }
  update_userByDOC(list_emp: any ,select : any) {
    this.model_all.user_display = select.triggerValue;
    if (this.list_emp == undefined) {
      this.list_emp = '';
    }
    if (this.list_emp != '') {
      this.emp_id = this.list_emp;
    }
    console.log(this.emp_id);
    console.log(this.list_emp);
    // this.Appmain.userSelected = this.list_emp;
    this.userDetail = this.UserDetail[ 0 ];
    this.TrackingStatus = {...InitTrackStatus};
    this.check_user();
  }
  async OnloadDoc() {
    this.profile = await this.CheckLogin();
    // this.Appmain.isLoading = true;
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
    // ws.callWs(BodyX, this.action_stage.action_load_doc).subscribe(
    //   onSuccess,
    //   (error) => console.log(error),
    //   () => { }
    // );
  }
  ngDoCheck() {
    if (this.displayPreview) {
      try {
        setTimeout(() => {
          const con = document.querySelector("#container-mat-transport");
          const width : any = con?.clientWidth;
          const findImg = document.querySelectorAll(`#bindHtml div img`)
          if (findImg && findImg.length > 0) {
            findImg.forEach(el => {
              if (width < el.clientWidth) {
                el.setAttribute("width", "100%")
              }
            })
          }
        }, 100)

      }
      catch (err) { }
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
  uploadFile(ev : any) {
    // this.Appmain.isLoading = true;
    //File
    this.selectfile = <File>ev.files[ 0 ];
    let Jsond = {
      file: this.selectfile,
      doc_id: this.doc_id,
      pagename: this.pagename,
      emp_id: this.emp_id,
      file_token_login: localStorage[ 'token' ],
    };
    console.log(Jsond);

    const onSuccess = (res : any) => {
      // this.Appmain.isLoading = false;
      console.log(res);
      let status_res = res.after_trip;

      if (status_res.opt1 == 'true') {
        this.Swalalert(status_res.opt2.status, 'success');
        // this.model_all.img_list.push(res.img_list);
        // this.model_all_def.img_list.push(res.img_list);
      } else {
        this.Swalalert(status_res.opt2.status, 'error');
      }
      this.selectfile != null;
    };

    // this.fileuploadservice
    //   .postFilePhase2(this.selectfile, this.doc_id, this.pagename, this.emp_id, Jsond.file_token_login)
    //   .subscribe(
    //     (res) => onSuccess(res),
    //     (error) => {
    //       // this.Appmain.isLoading = false;
    //       console.log(error);
    //       //alert("error!");
    //     },
    //     () => {
    //       if (this.checkall_selected) {
    //         this.funcheck(this.checkall_selected);
    //       }
    //     }
    //   );
  }

  Swalalert(msg : any, type : any) {
    //if(msg == null){ msg = "Error";}
    Swal.fire(msg, '', type);
  }

  downloadFile(url : any) {
    let Regex = /.[A-Za-z]{3}$/;
    let fullurl = url.match(Regex);
    let fileType = fullurl[ 0 ];
    let file_name = 'แบบขอใช้รถยนต์ส่วนตัวเพื่อการเดินทางธุรกิจบริษัท';
    // fs.saveAs(url, file_name);
    // fs.saveAs(url, file_name + fileType);
    // this.Appmain.isLoading = false;
  }
  get UserDetail() {
    const emp_list: any[] = this.model_all.emp_list.filter((item : any) => item.emp_id === this.emp_id);
  
    if (emp_list.length > 0) {
      const user = emp_list[0];
  
      // Check if 'show_button' property exists
      if (user.hasOwnProperty('show_button')) {
        // Check if 'status_trip_cancelled' is 'true'
        if (user.status_trip_cancelled === 'true') {
          this.user_reject = false;
        }
      } else {
        this.user_reject = false;
      }
    } else {
      // Handle case where emp_list is empty
      this.user_reject = false;
    }
  
    return emp_list;
  }
  
  Arrx = [];
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
      // this.ws.callWs(BodyX, 'loginProfile').subscribe(
      //   onSuccess,
      //   (error) => (console.log(error), reject(error)),
      //   () => { }
      // );
    });
  }
  ngAfterViewChecked() {
    if (this.car_selected_val == 'personal_car') {
      try {
        let screenWidth = screen.width;
        let widthIMG = screenWidth < 576 ? '100%' : 'auto';
        let img = document.querySelectorAll('app-transportation  img');
        img.forEach((imgx) => {
          //@ts-ignore
          imgx.style.width = widthIMG;
        });
      } catch (ex) { }
    }
    //your code to update the model // ใช้สำหรับ re-rendered กรณีไป update view แล้วเข้า lifecycle นี้จะ error
    // this.changeDetector.detectChanges();
  }
  Onload() {
    // this.Appmain.isLoading = true;
    const onSuccess = (data : any) => {
      console.log(data, 'LOADDATA');
      // let TravelTypeDoc = /local/g.test(this.Appmain.TRAVEL_TYPE);
      // this.TRAVEL_TYPE = TravelTypeDoc ? 'Province/City/Location :' : 'Country / City  :';
      //data.user_admin = false;
      // this.Appmain.isLoading = false;
      data.img_list.forEach((element : any) => {
        element[ 'ischecked' ] = false;
      });
      // url_personal_car_document
      //ขาด เช็ค  user emp_id
      // OB21080156 >> ยังไม่เคยจอง
      // OB21080157 >> จองแล้วแต่ยังไม่มีการจัดรถ
      // OB21080140 >> จองแล้วแต่ยังไม่มีการจัดร
      this.transportation_car_length = true;
      this.transportation_car_byemp = true;
      const caseNoManageCar = data.transportation_car.some(
        (item : any) => item.company_name === null && item.doc_id === null
      );
      const caseNoaddCar = data.transportation_detail.some((item : any) => item.emp_name === null && item.doc_id === null);
      this.checkCaseCar.hasPersonal = !caseNoManageCar;
      if (caseNoManageCar && caseNoaddCar) {
        //case ที่ไมีมีข้อมูลคนขับและคนของปิดการแสดงข้อมูลจาก transport
        this.transportation_car_length = false;
      } else if (
        (caseNoManageCar === true && caseNoaddCar === false) ||
        (caseNoManageCar === false && caseNoaddCar === true)
      ) {
        //case ที่มีข้อมูล คนขับ หรือ มีการจองต้องแสดงข้อมูลจาก TRANSPORT
        this.transportation_car_length = true;
      }

      var user_cur = data.emp_list[ 0 ];
      this.model_all_def = {...data};
      this.model_all = data;
      this.Arrx = data;
      if (data.user_admin) {
        // this.list_emp = '';
        // let userSelect = this.Appmain.userSelected;
        // const { emp_id , userSelected, status_trip_cancelled } = useAuth(data, userSelect) ?? { emp_id: '', userSelected: '', status_trip_cancelled: '' };
        // this.list_emp = emp_id;
        // this.emp_id = emp_id;
        // this.Appmain.userSelected = userSelected;
        // this.user_reject = getBoolean(status_trip_cancelled) ? false : true;
        this.user_admin = true;
        //
      } else {
        // this.list_emp = data.emp_list[0].emp_id;
        //@ts-ignore
        // const { profile } = this.Appmain.appHeader;
        // this.list_emp = profile.emp_id;
        // user_cur = profile;
        // this.model_all.user_display = user_cur.username;
        this.user_admin = false;
        const { profile } = { profile: (this.profile as any[])[0] };
        console.log('Getprofile');
        console.log(profile);
        this.list_emp = profile.empId;
        this.emp_id = profile.empId;
        this.model_all.user_display = profile.empName;
        let finduser = data.emp_list.find((emp_id : any) => emp_id === profile.empId);
        this.user_reject = true;
        !finduser && (this.user_reject = false);
        finduser && (this.user_reject = getBoolean(finduser.status_trip_cancelled) ? false : true);
        //?? เช็คว่าเป็น requesterรึป่าว
        //todo finduser ถ้าไม่มีใน  emplist = undefined
        if (!finduser && 'user_request' in data && data.user_request === true) {
          // let userSelected = this.Appmain.userSelected;
          this.user_admin = true;
          this.user_reject = false;
          // if (userSelected) {
          //   this.emp_id = this.Appmain.userSelected;
          //   this.list_emp = this.emp_id;
          // } else {
          //   this.emp_id = data.emp_list[ 0 ].emp_id;
          //   this.Appmain.userSelected = data.emp_list[ 0 ].emp_id;
          //   this.list_emp = this.emp_id;
          // }
        }
      }
      this.doc_id = data.doc_id;
      // this.emp_id = user_cur.emp_id;
      this.htmlContent = data.html_content;
      this.oldStr = this.htmlContent;
      this.userDetail = this.UserDetail[ 0 ];
    };

    var BodyX = {
      token_login: localStorage[ 'token' ],
      doc_id: this.doc_id,
    };

    // this.ws.callWs(BodyX, this.action_stage.action_load).subscribe(
    //   (data) => onSuccess(data),
    //   // (error) => (this.Appmain.isLoading = false),
    //   () => {
    //     console.log(this.model_all_def);
    //     this.check_user();
    //   }
    // );
  }

  onKeyDown(event : any) {
    // var check_user = this.Appmain.profile.username;
    var def_user = 'nitinai';

    // if (check_user.toLowerCase().includes(def_user)) {
    //   console.log(event);
    //   if (event.key == '9') {
    //     this.model_all.user_admin = !this.model_all.user_admin;
    //   }
    //   if (event.key == '8') {
    //     this.user_reject = !this.user_reject;
    //   }
    // }
  }
//   Sort_by(bool: boolean, field: string, field_selected: string): void {
//     this.sort_selectd[field_selected] = !bool;
//     this.model_all.img_list = this.model_all.img_list.sort((a, b) => {
//         if (bool) {
//             return a[field].localeCompare(b[field]);
//         } else {
//             return b[field].localeCompare(a[field]);
//         }
//     });
// }


  //#region  Email

  CheckRole_Section(): boolean {
    let emp_id = this.list_emp;
    let def_data = this.model_all;
    let result = false;
    // check ว่าเป็น all หรือ เป็นรายคน
    if (def_data.emp_list.length > 0) {
      if (emp_id == '') {
        if (def_data.user_admin) {
          def_data.emp_list.forEach((res : any) => {
            res.mail_status = 'true';
            result = true;
          });
        } else {
        }
      } else {
        def_data.emp_list.forEach((res : any) => {
          if (emp_id == res.emp_id) {
            res.mail_status = 'true';
            result = true;
          }
        });
      }
    }
    this.model_all.emp_list = def_data.emp_list;
    return result;
  }

  OnSendmail() {
    //let bcheck = this.CheckRole_Section();
    //if (bcheck) {
    // this.Appmain.isLoading = true;
    const OnsaveSucecss = (data : any) => {
      console.log(data);
      if (data.after_trip.opt1 == 'true') {
        // this.alerts.swal_sucess('Send E-mail successfully');
        data.data_type = null;
        let def_data = this.model_all;
      } else {
        if (data.after_trip.opt2.status == null) {
          data.after_trip.opt2.status = 'Error';
        }
        // this.alerts.swal_error(data.after_trip.opt2.status);
      }
      let def_data = this.model_all;
      //หลังจากส่งเมล์ update mail status = false
      if (def_data.hasOwnProperty('emp_list')) {
        def_data.emp_list.forEach((el : any) => {
          if (el.mail_status == 'true') {
            el.mail_status = 'false';
          }
        });
        console.log(this.model_all);
      }
      this.model_all.emp_list = data.emp_list;
      // this.Appmain.isLoading = false;
    };
    debugger;
    var bodyX = this.model_all;
    // console.log(this.action_stage.action_submit)
    let emp_id = this.list_emp;
    // check ว่าเป็น all หรือ เป็นรายคน
    var bodyXx = this.Arrx;
    (bodyXx?['emp_list'] as any[]:[]).forEach((e: any) => {
      if (emp_id === '') {
        e.mail_status = 'true';
      } else {
        if (e.emp_id === emp_id) {
          e.mail_status = 'true';
        } else {
          e.mail_status = 'false';
        }
      }
    });
    
    bodyX.emp_list = (bodyXx as any)['emp_list'];
    bodyX.data_type = 'submit';
    console.log('--- send mail all ---');
    console.log(bodyX);
    // this.ws.callWs(bodyXx, this.action_stage.action_submit).subscribe(
    //   (res) => OnsaveSucecss(res),
    //   (error) => console.log(error),
    //   () => {
    //     this.TrackingStatus = {...InitTrackStatus};
    //   }
    // );
    //} else {
    // this.Swalalert(data.after_trip.opt2.status,'success');
    //}
  }
  //#endregion End Email

  downloadFileTraveler(url: string): void {
    if (url != '') {
      // this.Appmain.isLoading = true;
      //window.open(url);
      this.downloadFile(url);
    }
  }
  detailRedirect() {
    var obj = {
      transportation_type: this.model_all.transportation_type,
      token_login: '',
      doc_id: this.model_all.doc_id,
      id: this.model_all.id,
    };
    let url;
    // id=0 เสมอ
    // t= type ที่พี่กุลส่งมาให้
    // eb= เลข doc no
    //http://tbkc-dapps-05.thaioil.localnet/Transport/web/Login/index.aspx?carservice_requestform.aspx?id=0&t=b&eb=OB20120006

    // url = 'http://tbkc-dapps-05.thaioil.localnet/Transport/web/Login/index.aspx?carservice_requestform.aspx?';
    // url = this.urlWs.url_carservice();
    // url += 'id=' + '0';
    // url += '&t=' + obj.transportation_type;
    // url += '&eb=' + obj.doc_id;

    if (this.model_all.t_car_id != '' && !!this.model_all.t_car_id) {
      if (!!this.model_all.t_car_id) {
        // url = 'http://tbkc-dapps-05.thaioil.localnet/Transport/web/carservice_requestform.aspx?';
        // url = this.urlWs.url_carservice();
        // url += 'id=' + this.model_all.t_car_id;
      }
    }
    // alert(url);
    window.open(url);
  }
  Send_Data_Transport() {
    // this.detailRedirect();
    //?? รอ services เส้นใหม่
    this.OnSendStatusCarServices();
  }
  //#region  Save Data
  OnSendStatusCarServices() {
    if (true) {
      // this.Appmain.isLoading = true;
      const OnsaveSucecss = (data : any) => {
        this.model_all.emp_list = data.emp_list;
        console.log(data);
        console.log(this.model_all, 'model_all');
        // this.Appmain.isLoading = false;
      };
      this.model_all.emp_list.forEach((item : any) => {
        item.mail_status = 'false';

        if (item.emp_id === this.emp_id) {
          item.mail_status = 'true';
        }
      });
      var bodyX = this.model_all;
      console.log(CloneDeep(this.model_all), 'OnSendStatusCarServices');
      // this.ws.callWs(bodyX, this.action_stage.action_send_status).subscribe(
      //   (res) => OnsaveSucecss(res),
      //   // (error) => (this.Appmain.isLoading = false),
      //   () => (this.detailRedirect(), (this.TrackingStatus = {...InitTrackStatus}))
      // );
    }
  }
  Onsave(btn_type : any) {
    if (btn_type == 'saved') {
      if (true) {
        // this.Appmain.isLoading = false;
        const OnsaveSucecss = (data : any) => {
          console.log(data);
          if (data.after_trip.opt1 == 'true') {
            // this.Swalalert(data.after_trip.opt2.status, 'success');
            data.data_type = null;
          } else {
            // this.Swalalert(data.after_trip.opt2.status, 'error');
          }
          // this.Appmain.isLoading = false;
        };
        this.model_all.emp_list.forEach((item : any) => {
          item.mail_status = 'false';

          if (item.emp_id === this.emp_id) {
            item.mail_status = 'true';
          }
        });
        var bodyX = this.model_all;
        console.log(this.model_all);

        // this.ws.callWs(bodyX, this.action_stage.action_save).subscribe(
        //   (res) => OnsaveSucecss(res),
        //   (error) => console.log(error)
        // );
      }
    } else {
      //submit
    }
  }

  saveTextEditor() {
    // this.alerts.swal_confrim_changes('Do you want to save the document ?').then((val) => {
    //   if (val.isConfirmed) {
    //     // this.Appmain.isLoading = true;
    //     this.oldStr = this.htmlContent;
    //     this.model_all.data_type = 'save';
    //     this.model_all.html_content = this.oldStr;
    //     console.log(this.model_all);
    //     // this.Appmain.isLoading = false;

    //     const onSuccess = (data : any) => {
    //       console.log('---Save success---');
    //       console.log(data);
    //       if (data.after_trip.opt1 == 'true') {
    //         //this.model_all = [];
    //         this.model_all = data;

    //         this.htmlContent = data.html_content;
    //         this.oldStr = this.htmlContent;
    //         // this.Appmain.isLoading = false;
    //         // this.alerts.swal_sucess(data.after_trip.opt2.status);
    //         this.alerts.swal_sucess('Successfully saved');

    //         this.displayPreview = true;
    //       } else {
    //         // this.Appmain.isLoading = false;
    //         this.TrackingStatus = {...InitTrackStatus};
    //         console.log(data);
    //         this.alerts.swal_error(data.after_trip.opt2.status);
    //       }
    //     };
    //     this.ws.callWs(this.model_all, this.action_stage.action_save).subscribe(
    //       (data) => onSuccess(data),
    //       (error) => {
    //         // this.Appmain.isLoading = false;
    //         console.log(error);
    //       }
    //     );
    //   }
    // });
  }
  //#endregion End Save Data

  //#region Action
  BtnCancelTextEditor_Onclick() {
    this.displayPreview = !this.displayPreview;
    this.htmlContent = this.oldStr;
  }
  BtnEditTextEditor_Onclick() {
    this.displayPreview = !this.displayPreview;
  }
  BtnPreviewTextEditor_Onclick() {
    this.displayPreview = !this.displayPreview;
  }
  count_item() {
    let dt = this.model_all.img_list.filter((res : any) => {
      return res.action_type != 'delete';
    });
    return dt.length;
  }

  check_user() {
    let dt = this.model_all;
    let dt_old = this.model_all_def;
    const {hasPersonal} = this.checkCaseCar;
    //** user admin */
    if (dt.user_admin) {
      //กรณีเลือก all
      if (this.list_emp != '') {
        this.model_all.img_list = dt_old.img_list.filter((res : any ) => {
          return res.emp_id == this.emp_id;
        });
        //?? กรณีที่ มีการจองแต่ยังไม่มีคนขับ
        if (!hasPersonal) {
          this.model_all.transportation_car = dt_old.transportation_car.filter((res : any) => {
            return res.emp_id == this.emp_id || res.emp_id === null;
          });
        } else {
          let car_id = 0;
          let hasCar = dt_old.transportation_car.some((res : any) => {
            return res.emp_id == this.emp_id;
          });
          let hasTraveler = dt_old.transportation_detail.some((res : any) => {
            if (res.emp_id == this.emp_id) {
              car_id = res.t_car_id;
            }
            return res.emp_id == this.emp_id;
          });
          // case มีการจองไว้แต่ยังไม่มีคนขับ
          if (hasTraveler && hasCar === false) {
            this.model_all.transportation_car = dt_old.transportation_car.filter((res : any) => {
              return res.emp_id == this.emp_id;
            });
            if (this.model_all.transportation_car.length < 1) {
              const CarDriver = dt_old.transportation_car.filter((res : any) => {
                return res.t_car_id == car_id;
              });
              // case กรณีที่คนขับซ้ำกันต้อง distinct ออก
              const callback = (data : any) => (this.model_all.transportation_car = data ? data : []);
              of(...CarDriver)
                .pipe(
                  distinct(({t_car_id}) => t_car_id),
                  toArray()
                )
                .subscribe(callback);
//               // case กรณีที่ยังไม่มีคนขับ ต้อง newrow
              if (this.model_all.transportation_car.length < 1) {
                let column_list = dt_old.transportation_car[0];
let key = Object.keys(column_list);
let obj: Object = key.reduce((acc: any, item: any) => {
  acc[item] = null;
  return acc;
}, {});
// this.model_all.transportation_car = [obj];
              }
            }
          } else {
            this.model_all.transportation_car = dt_old.transportation_car.filter((res : any) => {
              return res.emp_id == this.emp_id;
            });
          }
        }
      } else {
        // caseปกติ
        this.model_all.transportation_car = dt_old.transportation_car;
      }
    } else {
      //** user Traveler */
      this.model_all.img_list = dt.img_list.filter((res : any) => {
        return res.emp_id == this.emp_id;
      });

      //?? กรณีที่ มีการจองแต่ยังไม่มีคนขับ
      if (!hasPersonal) {
        this.model_all.transportation_car = dt_old.transportation_car.filter((res : any) => {
          return res.emp_id == this.emp_id || res.emp_id === null;
        });
      } else {
        let car_id = 0;
        // check ข้อมูลว่ามีรถไหม
        let hasCar = dt_old.transportation_car.some((res : any) => {
          return res.emp_id == this.emp_id;
        });
        // check ข้อมูลว่ามีการจองรถไหม
        let hasTraveler = dt_old.transportation_detail.some((res : any) => {
          if (res.emp_id == this.emp_id) {
            car_id = res.t_car_id;
          }
          return res.emp_id == this.emp_id;
        });

        // case มีการจองไว้แต่ยังไม่มีคนขับ กรณีนี้จะไม่มี row ในtable car
        if (hasTraveler && hasCar === false) {
          this.model_all.transportation_car = dt_old.transportation_car.filter((res : any) => {
            return res.emp_id == this.emp_id;
          });

          if (this.model_all.transportation_car.length < 1) {
            const CarDriver = dt_old.transportation_car.filter((res : any) => {
              return res.t_car_id == car_id;
            });
            // case กรณีที่คนขับซ้ำกันต้อง distinct ออก
            const callback = (data : any) => (this.model_all.transportation_car = data ? data : []);
            of(...CarDriver)
              .pipe(
                distinct(({t_car_id}) => t_car_id),
                toArray()
              )
              .subscribe(callback);
          }
          // case กรณีที่ยังไม่มีคนขับ ต้อง newrow
          if (this.model_all.transportation_car.length < 1) {
            // Assuming dt_old is defined and has a transportation_car property of type Array<any>
let column_list = dt_old.transportation_car[0];
let key = Object.keys(column_list);
let obj: Object = key.reduce((acc: any, item: any) => {
  acc[item] = null;
  return acc;
}, {});
// this.model_all.transportation_car = [obj];
          }
        } else {
          // caseปกติ
          this.model_all.transportation_car = dt_old.transportation_car.filter((res : any) => {
            return res.emp_id == this.emp_id;
          });
        }

        // console.clear();
        console.log(this.model_all.transportation_car);
      }
    }

    this.transportation_car_length = this.StatusEmpty;
  }

  

  get StatusEmpty() {
    let dt_old = this.model_all_def;
    let bcheck = true;

    if (this.list_emp === '' || this.list_emp === null) {
      const caseNoManageCar = dt_old.transportation_car.some(
        (item : any) => item.company_name === null && item.doc_id === null
      );
      const caseNoaddCar = dt_old.transportation_detail.some((item : any) => item.emp_name === null && item.doc_id === null);
      if (caseNoManageCar && caseNoaddCar) {
        //case ที่ไมีมีข้อมูลคนขับและคนของปิดการแสดงข้อมูลจาก transport
        bcheck = false;
      } else if (
        (caseNoManageCar === true && caseNoaddCar === false) ||
        (caseNoManageCar === false && caseNoaddCar === true)
      ) {
        //case ที่มีข้อมูล คนขับ หรือ มีการจองต้องแสดงข้อมูลจาก TRANSPORT
        bcheck = true;
      }
    } else {
      let hasCar = dt_old.transportation_car.some((res : any) => {
        return res.emp_id == this.emp_id;
      });
      let hasTraveler = dt_old.transportation_detail.some((res : any) => {
        return res.emp_id == this.emp_id;
      });
      if (hasCar && hasTraveler) {
        bcheck = true;
      } else if (!hasCar && !hasTraveler) {
        bcheck = false;
      } else if ((hasCar && !hasTraveler) || (!hasCar && hasTraveler)) {
        bcheck = true;
      }
    }
    return bcheck;
  }

  Haschecked() {
    let dt = this.model_all;
    let arr: any;
    arr = dt.img_list.some((res : any) => {
      return res.ischecked === true && res.action_type != 'delete';
    });
    return arr;
  }

  funcheck(val : any) {
    //console.log(val)
    this.model_all.img_list.forEach((res : any) => (res.ischecked = val));
  }

  runnumber() {
    var ir = 1;
    if (this.checkCaseCar.hasaddCar) {
      this.model_all.transportation_detail.forEach((child : any) => {
        child.id = ir.toString();
        ir++;
      });
    } else {
      this.model_all.transportation_car.forEach((res : any) => {
        this.model_all.transportation_detail.forEach((child : any) => {
          if (res.t_car_id == child.t_car_id) {
            child.id = ir.toString();
            ir++;
          }
        });
      });
    }
  }

  DataBYCARID(car_id : any) {
    // console.log('car_id', car_id);
    // console.log('list_emp', this.list_emp);
    let dt = [];
    if (this.list_emp == '') {
      // this.runnumber();
      if (car_id) {
        dt = this.model_all.transportation_detail.filter((res : any) => res.t_car_id == car_id);
      } else {
        //!!case กรณีเลือก all และมีการจองแต่ไม่มีคนขับ
        dt = [ ...this.model_all.transportation_detail ];
      }
    } else {
      if (car_id) {
        dt = this.model_all.transportation_detail.filter((res : any) => res.t_car_id == car_id && res.emp_id == this.emp_id);
      } else {
        //!!case กรณีเลือก all และมีการจองแต่ไม่มีคนขับ
        dt = this.model_all.transportation_detail.filter((res : any) => res.emp_id == this.emp_id);
      }
    }
    return dt;
  }
  icount = 0;
  getRowNumber(id : any, irow : any) {
    if (this.list_emp === '') {
      // console.log(this.list_emp);
      // console.log(this.checkCaseCar);
      if (this.checkCaseCar.hasPersonal === false && this.checkCaseCar.hasaddCar === false) {
        return irow + 1;
      } else {
        return id;
      }
    } else {
      return irow + 1;
    }
  }
  check_action(item : any) {
    if (item.action_type == 'delete') {
      return true;
    }
    if (item.filename == null || item.filename == '') {
      return false;
    }
    return false;
  }

  Del_file() {
    let dt = this.model_all;
    this.model_all.img_list.forEach((element : any) => {
      if (element.ischecked == true) {
        element.action_type = 'delete';
      }
    });
  }
  // #endregion End action

}


