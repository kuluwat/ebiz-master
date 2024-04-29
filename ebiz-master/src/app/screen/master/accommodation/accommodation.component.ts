import { AlertServiceService } from '../../../services/AlertService/alert-service.service';
import {
  Component,
  ElementRef,
  forwardRef,
  Inject,
  OnInit,
  Renderer2,
  TemplateRef,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AppComponent } from '../../../app.component';
import { MainComponent } from '../../../components/main/main.component';
import { FileuploadserviceService } from '../../../ws/fileuploadservice/fileuploadservice.service';
import { AspxserviceService } from '../../../ws/httpx/aspxservice.service';
import { MasterComponent } from '../master.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
// import { viewClassName } from '@angular/compiler/';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { DatePipe } from '@angular/common';
import { count } from 'console';
// import * as fs from 'file-saver';
import { isObject } from 'ngx-bootstrap/chronos/utils/type-checks';
import { E } from '@angular/cdk/keycodes';
import { InitTrackStatus, TrackingStatus } from '../../../model/localstorage.model';
import { NgModel } from '@angular/forms';
/* import { Workbook } from 'exceljs';
import * as fs from 'file-saver'; */
type AuthAdmin = { emp_id: string; userSelected: string; status_trip_cancelled: string | null | undefined };
// export const useAuth = (data: any, userSelected: string): AuthAdmin => {
//   let obj: AuthAdmin;
//   const emp_list = data.emp_list;
//   if (userSelected) {
//     let findIndex = data.emp_list.findIndex(({ emp_id }) => emp_id === userSelected);
//     if (findIndex > -1) {
//       let status_trip_cancelled = emp_list[findIndex].status_trip_cancelled;
//       obj = { emp_id: userSelected, userSelected, status_trip_cancelled };
//     }
//   } else {
//     let status_trip_cancelled = emp_list[0].status_trip_cancelled === null ? true : emp_list[0].status_trip_cancelled;
//     obj = { emp_id: emp_list[0].emp_id, userSelected: emp_list[0].emp_id, status_trip_cancelled };
//   }
//   return { ...obj };
// };

export const useAuth = (data: any, userSelected: string): AuthAdmin => {
  let obj: AuthAdmin = {
    emp_id: '',
    userSelected: '',
    status_trip_cancelled: undefined
  }; // Initialize obj with an empty object
  const emp_list: any[] = data.emp_list; // Explicitly annotate the type of emp_list

  if (userSelected) {
    const findIndex = emp_list.findIndex(({ emp_id }: { emp_id: string }) => emp_id === userSelected); // Explicitly annotate the type of emp_id
    if (findIndex > -1) {
      const status_trip_cancelled = emp_list[findIndex].status_trip_cancelled;
      obj = { emp_id: userSelected, userSelected, status_trip_cancelled };
    }
  } else {
    const status_trip_cancelled = emp_list[0].status_trip_cancelled === null ? true : emp_list[0].status_trip_cancelled;
    obj = { emp_id: emp_list[0].emp_id, userSelected: emp_list[0].emp_id, status_trip_cancelled };
  }
  return { ...obj };
};

export const getBoolean = (value: any) => {
  let converBoolSet : { [key: string]: boolean } = {
    true: true,
    false: false,
    on: true,
    yes: true,
  };
  let boolcheck: boolean | null ;
  try {
    boolcheck = converBoolSet[value];
    !boolcheck && (boolcheck = false);
  } catch (ex) {
    boolcheck = false;
  }
  return boolcheck;
};
declare var $: any;

@Component({
  selector: 'app-accommodation',
  templateUrl: './accommodation.component.html',
  styleUrls: ['./accommodation.component.css'],
})
export class AccommodationComponent implements OnInit {
  @ViewChild('btnCloseAA', { static: true }) closeModal?: ElementRef;
  @ViewChild('btnCloseX', { static: true }) btnCloseX?: ElementRef;

  /*   private _jsonURL = '../../../../../assets/assets/cities.json';
  private _jsonURL2 = '../../../../../assets/assets/Cotree.json';
  private _jsonURL3 = '../../../../../assets/assets/City_raw.json'; */

  panel = {
    show: true,
    after: false,
  };

  goble_modal_index = null;
  id_uploadFile = '';
  requi = false;
  edit_status = false;
  index_from_edit : any;
  country_C = '';
  ho_name = '';
  ch_in = '';
  ch_out = '';
  roomType = '';
  add_request = '';
  book_status = '';
  place_name = '';
  map_url = '';
  Arr_m_book_type = [];
  m_book_type : any;

  emp_list = [];
  emp_doc = '';
  before_ChangUser = false;
  accommodation_detail = [];
  accommodation_booking = [];
  accommodation_detail_raw = [];
  accommodation_booking_raw = [];
  accommodation_booking_detail = [];
  img_list = [];
  booking_master = [];
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

  CheckSearch = false;
  travel : any;
  business_date : any;
  travel_date : any;
  country_city : any;

  data_city = [];
  countries_data = [];
  countries_data_filter = [];
  arrayX = [];
  status = true;

  input_Arr = [];

  show_button = true;
  booking = true;
  search = false;
  recommend = false;
  already_booked = false;

  empname = '';
  emp_select: string | null = null;
  doc_id : any;
  pagename = 'accommodation';
  emp_id : any;
  testdetail1 = [];
  testdetail2 = [];
  selectedFile: File = null!;
  tp_clone: TemplateRef<any>;
  modalRef: BsModalRef;
  masterSetArr = [];
  accommodation_emp_list = [];
  MT_room_type = [];
  pathPhase1: any;
  userDetail: any;
  TrackingStatus: TrackingStatus = { ...InitTrackStatus };
  Final = true;
  TRAVEL_TYPE: string | null = null;
  profile: unknown;
  user_request: boolean = false;
  isCancelled: boolean = false;

  constructor(
    @Inject(forwardRef(() => MasterComponent)) private appMain: MasterComponent,
    private elem: ElementRef,
    private renderer: Renderer2,
    private modalService: BsModalService,
    private http: HttpClient,
    private ws: AspxserviceService,
    private x: AppComponent,
    private fileuploadservice: FileuploadserviceService,
    private alert: AlertServiceService
  ) {
    /* this.getJSON(this._jsonURL).subscribe(data => {
      console.log(data);

      this.data_city = data;
    });

    this.getJSON(this._jsonURL2).subscribe(data => {

      this.countries_data_filter = data


    }); */
  }

  downloadFile(url : String, filename : String) {
    let Regex = /.[A-Za-z]{3}$/;
    let fullurl = url.match(Regex);
    //let fileType = fullurl[0];
    let file_name = filename;
    // fs.saveAs(url, file_name);
    //const blob = new Blob([], { type: 'text/csv' });
    //const url= window.URL.createObjectURL("http://tbkc-dapps-05.thaioil.localnet/ebiz_ws/Image/D001/transportation/00000910/1606366192767.jpg");
    //window.open("http://tbkc-dapps-05.thaioil.localnet/ebiz_ws/Image/D001/transportation/00000910/1606366192767.jpg");
  }

  ngOnInit() {
    //this.testCallWs();
    this.doc_id = this.appMain.DOC_ID;
    this.masterSet();
    this.OnloadDoc();
    this.onloadX();
  }

  CancelData() {
    this.alert.swal_confrim_changes('Do you want to cancel the document ?').then((val) => {
      if (val.isConfirmed) {
        this.isCancelled = true;
        this.onloadX();
      } else {
        return;
      }
    });
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
  async CheckLogin() {
    return new Promise((resolve, reject) => {
      var BodyX = {
        token_login: localStorage['token'],
      };
      const onSuccess = (data : any) => {
        console.log('loginProfile');
        console.log(data);
        resolve(data);
      };
      this.ws.callWs(BodyX, 'loginProfile').subscribe(
        onSuccess,
        (error) => (console.log(error), reject(error)),
        () => {}
      );
    });
  }
  get empCount(): boolean {
    const { emp_list } = this;
    const CheckData = emp_list.length === 1;
    return CheckData;
  }
  async OnloadDoc() {
    this.profile = await this.CheckLogin();
    // this.appMain.isLoading = true;
    var BodyX = {
      token_login: localStorage['token'],
      doc_id: this.doc_id,
    };

    const onSuccess = (data : any) => {
      const { tab_no } = data.up_coming_plan[0];
      this.pathPhase1 = tab_no ? tab_no : '1';
      console.log('loadDoc');
      console.log(data);
      console.log(this.pathPhase1, 'pathPhase1');
      let TravelTypeDoc = /local/g.test(this.appMain.TRAVEL_TYPE);
      this.TRAVEL_TYPE = TravelTypeDoc ? 'Province/City/Location :' : 'Country / City  :';
    };
    this.ws.callWs(BodyX, 'LoadDoc').subscribe(
      onSuccess,
      (error) => console.log(error),
      () => {}
    );
  }
  get UserDetail() {
    return this.emp_list.filter((item : any) => item.emp_id === this.emp_id);
  }
  get docStatus() {
    return (Status: number) => {
      // return this.TrackingStatus[Status];
      let emp_id = this.emp_id;
      let id: number = 1;
      if (this.emp_list.length > 0) {
        // TEST
        // this.emp_list.forEach((i) => (i.doc_status_id = '2'));
        let dt = this.emp_list.find((item : any ) => item.emp_id === emp_id);
        if (dt) {
          // alert(1);
          id = Number(dt.doc_status_id : );
          if (Status === id) {
            this.TrackingStatus[Status] = true;
          }
        }
      }
      // console.log(this.TrackingStatus);
      return this.TrackingStatus[Status];
    };
  }

  masterSet() {
    this.appMain.isLoading = true;

    /* let bodyX = {
      "token_login": localStorage["token"],
      "doc_id": this.doc_id
    } */
    let bodyX = {
      token_login: 'b8a27da5-c587-405d-8a45-20e39c98e5ce',
      page_name: 'accommodation',
      module_name: 'master book status',
    };

    const onSuccess = (data): void => {
      console.log('-------------');
      console.log(data);
      this.masterSetArr = data;

      // this.appMain.isLoading = false;
    };

    this.ws.callWs(bodyX, 'LoadMasterData').subscribe(
      (data) => onSuccess(data),
      (error) => {
        this.appMain.isLoading = false;
        console.log(error);
      }
    );
  }

  public getJSON(path): Observable<any> {
    return this.http.get(path);
  }

  transform(items, searchText) {
    searchText = searchText.toLocaleLowerCase();
    return items.filter((it) => {
      return it.name.toLocaleLowerCase().includes(searchText);
    });
  }

  convert_bool(val) {
    if (val == 'true') {
      return !!val;
    } else {
      return !val;
    }
  }

  CheckData() {
    console.log(this.accommodation_detail);
    console.log(this.accommodation_booking);
  }

  onloadX() {
    this.appMain.isLoading = true;
    var bodyX = {
      token_login: localStorage['token'],
      doc_id: this.doc_id,
    };

    console.log('------ bodyX -------');
    console.log(bodyX);

    const onSuccess = (data): void => {
      this.TrackingStatus = { ...InitTrackStatus };
      console.log('-------------');
      console.log(data);
      this.arrayX = data;
      this.accommodation_detail = data.accommodation_detail;
      this.accommodation_booking = data.accommodation_booking;
      this.img_list = data.img_list;
      this.status = data.user_admin;
      //this.status = false ;
      this.MT_room_type = data.m_room_type;
      this.show_button = data.emp_list[0].show_button;
      this.Arr_m_book_type = data.m_book_type;
      this.m_book_type = data.m_book_type[0].id;
      //this.status = false;
      this.accommodation_emp_list = data.emp_list;
      data.data_type = 'save';
      this.empname = data.user_display;
      //this.emp_doc = data.emp_list;
      this.travel = data.travel_topic;
      this.business_date = data.business_date;
      this.travel_date = data.travel_date;
      this.country_city = data.country_city;
      this.emp_select = data.emp_list[0].emp_id;
      this.emp_id = this.emp_select;
      this.doc_id = data.doc_id;
      this.emp_list = data.emp_list;
      this.input_Arr = data.accommodation_detail;
      //this.accommodation_detail = this.arrayX["accommodation_detail"].filter(word => word.emp_id == this.emp_select);
      //this.accommodation_booking = this.arrayX["accommodation_booking"].filter(word => word.emp_id == this.emp_select);
      //this.update_userByDOC(this.emp_select);
      data.accommodation_booking;
      this.booking_master = data.m_book_status;

      this.accommodation_booking.forEach((e) => {
        e.booking = this.getBoolean(e.booking);
        e.search = this.getBoolean(e.search);
        e.recommend = this.getBoolean(e.recommend);
        e.already_booked = this.getBoolean(e.already_booked);
        e.action_change = true;
      });

      this.accommodation_detail.forEach(function (e) {
        if (typeof e === 'object') {
          var d1, d2;
          if (e.check_in == '' || e.check_in == null) {
            d1 = '';
          } else {
            d1 = new Date(e.check_in);
            d1.setHours(12);
          }
          if (e.check_out == '' || e.check_out == null) {
            d2 = '';
          } else {
            d2 = new Date(e.check_out);
            d2.setHours(12);
          }

          function formatDate(date) {
            var d = new Date(date),
              month = '' + (d.getMonth() + 1),
              day = '' + (d.getDate() + 1),
              year = d.getFullYear();

            if (month.length < 2) month = '0' + month;
            if (day.length < 2) day = '0' + day;

            return [year, month, day].join('-');
          }
          var xdate1 = formatDate(e.check_in).toString();
          var xdate2 = formatDate(e.check_out).toString();

          var montF = new DatePipe('en-US');
          try {
            var dx1 = montF.transform(xdate1, 'dd MMM yyyy');
          } catch (err) {
            var dx1 = '';
          }

          try {
            var dx2 = montF.transform(xdate2, 'dd MMM yyyy');
          } catch (err) {
            var dx2 = '';
          }

          e['Datefrom'] = d1;
          e['Dateto'] = d2;
        }
      });
      if (data.user_admin === false) {
        this.status = false;
        //@ts-ignore
        const profile = this.profile[0];
        this.emp_id = profile.empId;
        this.emp_select = profile.empId;
        this.empname = profile.empName;
        let finduser = data.emp_list.find(({ emp_id }) => emp_id === profile.empId);
        if (finduser) {
          this.show_button = finduser.show_button;
          this.show_button = this.getBoolean(finduser.status_trip_cancelled) ? false : true;
        } else {
          this.show_button = false;
          //?? เช็คว่าเป็น requesterรึป่าว
          //todo finduser ถ้าไม่มีใน  emplist = undefined
          if ('user_request' in data && data.user_request === true) {
            let userSelected = this.appMain.userSelected;
            this.user_request = true;
            this.show_button = false;
            this.status = true;
            if (userSelected) {
              this.emp_id = this.appMain.userSelected;
              this.emp_select = this.emp_id;
            } else {
              this.emp_id = data.emp_list[0].emp_id;
              this.appMain.userSelected = data.emp_list[0].emp_id;
              this.emp_select = this.emp_id;
            }
          }
        }
      } else {
        let userSelect = this.appMain.userSelected;
        const { emp_id, userSelected, status_trip_cancelled } = useAuth(data, userSelect);
        this.emp_select = emp_id;
        this.emp_id = emp_id;
        this.show_button = this.getBoolean(status_trip_cancelled) ? false : true;
        this.appMain.userSelected = userSelected;
        // this.AuthAdmin(data);
      }
      this.userDetail = this.UserDetail[0];
      if (this.isCancelled === true) {
        this.isCancelled = false;
        this.alert.swal_sucess('Successfully canceled');
      }
      setTimeout(() => {
        this.appMain.isLoading = false;
        this.Final = false;
      }, 500);
    };

    this.ws.callWs(bodyX, 'LoadAccommodation').subscribe(
      (data) => onSuccess(data),
      (error) => {
        this.appMain.isLoading = false;
        console.log(error);
      }
    );
  }

  getBoolean(value) {
    switch (value) {
      case true:
      case 'true':
      case 1:
      case '1':
      case 'on':
      case 'yes':
        return true;
      default:
        return false;
    }
  }
  AuthAdmin(data) {
    let userSelected = this.appMain.userSelected;
    if (userSelected) {
      this.emp_id = userSelected;
      let findIndex = data.emp_list.findIndex(({ emp_id }) => emp_id === userSelected);
      if (findIndex > -1) {
        this.emp_select = this.emp_id;
      }
    } else {
      this.emp_select = data.emp_list[0].emp_id;
      this.emp_id = this.emp_select;
      this.appMain.userSelected = this.emp_id;
    }
  }
  loadonClick() {
    this.appMain.isLoading = true;

    /*     let bodyX =
    {
      token_login: "b8a27da5-c587-405d-8a45-20e39c98e5ce"
      , doc_id: "OB20120006"
    }
 */
    var bodyX = {
      token_login: localStorage['token'],
      doc_id: this.doc_id,
    };

    const onSuccess = (data): void => {
      console.log('-------------');
      console.log(data);
      this.arrayX = data;
      this.accommodation_detail = data.accommodation_detail;
      this.accommodation_booking = data.accommodation_booking;

      this.appMain.isLoading = false;
    };

    this.ws.callWs(bodyX, 'LoadAccommodation').subscribe(
      (data) => onSuccess(data),
      (error) => {
        this.appMain.isLoading = false;
        console.log(error);
      }
    );
  }

  update_userByDOCchang(values) {
    var empxid = this.emp_select.toString();
    //console.log(empxid);
    var show_button;
    // = this.arrayX['emp_list'][0].show_button;
    console.log('select . val');
    console.log(values);
    this.emp_list.forEach((e) => {
      if (e.emp_id == values) {
        e.mail_status = 'true';
      } else {
        e.mail_status = 'false';
      }
    });
    let status_trip_cancelled = false;
    this.arrayX['emp_list'].forEach(function (e) {
      if (e.emp_id == empxid) {
        show_button = e.show_button;
        if (e.status_trip_cancelled === 'true') {
          status_trip_cancelled = true;
        }
      }
    });
    //show_button = false;
    if (status_trip_cancelled) {
      this.show_button = false;
    }
    //console.log(show_button);
    var mes = 'Do you want to save the changes?';
    var txbtn = 'Save';
    /* if (this.before_ChangUser) {

      this.alert.swal_confrim_changes('').then((val) => {

        if (val.isConfirmed) {
          const onSuccess = (data): void => {
            console.log(data);
            this.arrayX = data;
            this.select_newdata();
            this.alert.swal_sucess('');
          }

          this.ws.callWs(this.arrayX, 'SaveAccommodation').subscribe(data => onSuccess(data), error => {
            this.appMain.isLoading = false
            console.log(error);
          })
        }else{
          this.select_newdata();
        }
      })
    } */
    if (this.model_selectX == true) {
      this.saveaction();
    }

    this.model_selectX = false;
    this.before_ChangUser = false;
    this.emp_select = empxid as any;
    this.emp_id = empxid;
    const emp_id = this.emp_id;
    const doc_id = this.doc_id;
    this.appMain.userSelected = this.emp_id;
    this.userDetail = this.UserDetail[0];
    this.TrackingStatus = { ...InitTrackStatus };

    //this.select_newdata();
  }

  select_newdata() {
    var empId = '' + this.emp_select + '';
    localStorage.setItem('emp_idstor', empId);
    // this.loadonClick();
    var emp_selectX = localStorage['emp_idstor'];
    this.emp_select = localStorage['emp_idstor'];

    this.accommodation_booking.forEach(function (e) {
      function getBoolean(value) {
        switch (value) {
          case true:
          case 'true':
          case 1:
          case '1':
          case 'on':
          case 'yes':
            return true;
          default:
            return false;
        }
      }

      e.booking = getBoolean(e.booking);
      e.search = getBoolean(e.search);
      e.recommend = getBoolean(e.recommend);
      e.already_booked = getBoolean(e.already_booked);
    });

    console.log(this.accommodation_booking);
    /*     this.booking = booking;
    this.search = search;
    this.recommend = recommend;
    this.already_booked = already_booked; */
  }

  onFileSelect(event, id) {
    this.id_uploadFile = id;
    this.selectedFile = <File>event.target.files[0];
    console.log(this.selectedFile);
    this.onUpload();
  }

  onUpload() {
    this.appMain.isLoading = true;
    const onSuccess = (res) => {
      this.appMain.isLoading = false;
      console.log(res);

      var idMax = parseInt(this.getMax(this.img_list, 'id').id);
      this.img_list.push({
        action_change: res.img_list.action_change,
        action_type: res.img_list.action_type,
        actionname: res.img_list.actionname,
        doc_id: res.img_list.doc_id,
        emp_id: res.img_list.emp_id,
        filename: res.img_list.filename,
        fullname: res.img_list.fullname,
        id: idMax + 1,
        id_level_1: this.id_uploadFile,
        id_level_2: res.img_list.id_level_2,
        modified_by: res.img_list.modified_by,
        modified_date: res.img_list.modified_date,
        pagename: res.img_list.pagename,
        path: res.img_list.path,
        status: res.img_list.status,
      });
      this.arrayX['img_list'] = this.img_list;
      console.log(' -     -- -- - - - - ');
      console.log(this.img_list);
      console.log(this.arrayX);
      $('#file_id').val('');
      this.alert.toastr_warning('Please Save Data');
    };
    //this.fileuploadservice.postFile(this.selectedFile, this.doc_id, this.pagename, this.emp_select.toString()).subscribe(res => onSuccess(res), error => {
    this.fileuploadservice
      .postFilePhase2(this.selectedFile, this.doc_id, this.pagename, this.emp_select.toString(), localStorage['token'])
      .subscribe(
        (res) => onSuccess(res),
        (error) => {
          this.appMain.isLoading = false;
          console.log(error);
          alert('error!');
        }
      );
  }

  Openmodal() {
    $('#exampleModalCenter')
      .modal({
        keyboard: false,
      })
      .modal('show');

    $('.cdk-overlay-container').css({ position: 'fixed' });
    $('.cdk-overlay-container').css({ 'z-index': 1070 });
  }

  modelChanged(event) {
    if (event.length >= 3) {
      $('.cdk-overlay-container').css({ position: 'fixed' });
      $('.cdk-overlay-container').css({ 'z-index': 1070 });

      var resultx = this.countries_data_filter;
      this.countries_data = this.transform(this.data_city, event);

      this.countries_data.forEach(function (e, resultx) {
        if (typeof e === 'object') {
          console.log(resultx);
          e['new_column'] = '';
        }
      });
      console.log(this.countries_data_filter);
    }
  }

  selected_employee1: any;
  selected_employee2: any;
  openbowser_text: any;
  cityFilterX;

  firstselectionChanged() {
    var cityF = this.data_city.filter(function (c) {
      return c.country == 'UK';
    });
    this.cityFilterX = cityF;
  }

  getMax(arr, prop) {
    var max;
    for (var i = 0; i < arr.length; i++) {
      if (max == null || parseInt(arr[i][prop]) > parseInt(max[prop])) max = arr[i];
    }
    return max;
  }

  addrow() {
    this.accommodation_detail.push({
      action_type: 'insert',
      action_change: true,
      check_in: null,
      check_out: null,
      Datefrom: null,
      Dateto: null,
      country: '',
      doc_id: this.doc_id,
      emp_id: this.emp_select,
      hotel_name: '',
      id: '' + (parseInt(this.getMax(this.accommodation_detail, 'id').id) + 1) + '',
      roomtype: '',
    });

    /* 

    this.accommodation_detail.forEach(
      function (e) {
        if (typeof e === "object") {
                 
          var d1,d2;
          if(e.check_in == ""){
            d1 = "";
          }else{
             d1 = new Date(e.check_in);
             d1.setHours(12);
          }
          if(e.check_out == ""){
            d2 = "";
          }else{
             d2 = new Date(e.check_out);
             d2.setHours(12);
          }

          function formatDate(date) {
            var d = new Date(date),
              month = '' + (d.getMonth() + 1),
              day = '' + (d.getDate() + 1),
              year = d.getFullYear();

            if (month.length < 2) month = '0' + month;
            if (day.length < 2) day = '0' + day;

            return [year, month, day].join('-');
          }

          e["Datefrom"] = d1;
          e["Dateto"] = d2;

        }
    })
 */

    this.alert.toastr_sucess('Add Accommodation');
    this.before_ChangUser = true;
  }

  sortbyFX(emp_select) {
    var ds = this.accommodation_detail.sort(function (a, b) {
      return parseInt(b.id) - parseInt(a.id);
    });
    console.log(ds);
    return ds;
  }

  saveaction() {
    this.appMain.isLoading = true;
    this.accommodation_detail.forEach(function (e) {
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
      let day2 = e.Dateto;

      if (day1 != '') {
        if (typeof e.Datefrom === 'object') {
          e.check_in = datePlusday4(day1);
        } else {
          e.check_in = e.check_in;
        }
      }

      if (day2 != '') {
        if (typeof e.Dateto === 'object') {
          e.check_out = datePlusday4(day2);
        } else {
          e.check_out = e.check_out;
        }
      }
    });
    var result_data = this.arrayX['accommodation_detail'].filter((word) => word.emp_id == this.emp_select);
    var result_booking = this.arrayX['accommodation_booking'].filter((word) => word.emp_id == this.emp_select);
    result_booking = result_booking.filter((word) => word.action_type != 'delete');
    result_data = result_data.filter((word) => word.action_type != 'delete');
    var btn_type = this.arrayX['data_type'];
    console.log('result_data');
    console.log(result_data);
    console.log(result_booking);
    var SaveState = true;
    var StatusSave = [],
      indexx = 0;
    var StatusSave2 = [],
      indexx2 = 0;
    let checkAlreadyB = false;
    var status_Test = 'Do you want to save the document?';
    if (btn_type == 'submit') {
      if (result_booking.length > 0) {
        const { ask_booking, already_booked } = result_booking[0];
        checkAlreadyB = already_booked === 'false' || already_booked === false || already_booked === '';
      }
      let userTraveler = this.status === false;
      // if (userTraveler && checkAlreadyB) {
      if (checkAlreadyB) {
      } else {
        status_Test = 'Do you want to submit the document ?';

        result_data.forEach((e) => {
          var TextReWaring = '';

          if (e.country == '' || e.country == null) {
            TextReWaring = 'Country Data Invalid';
          }
          if (e.hotel_name == '' || e.hotel_name == null) {
            TextReWaring = 'Hotel Name Data Invalid';
          }
          if (e.Datefrom == '' || e.check_in == null) {
            TextReWaring = 'Check In Data Invalid';
          }
          if (e.Dateto == '' || e.check_out == null) {
            TextReWaring = 'Check Out Data Invalid';
          }
          if (e.roomtype == '' || e.roomtype == null) {
            TextReWaring = 'Roomtype Time Data Invalid';
          }

          StatusSave[indexx] = false;
          if (TextReWaring == '') {
            StatusSave[indexx] = true;
          } else {
            this.appMain.isLoading = false;
            this.alert.swal_warning('Please check the ' + TextReWaring);
          }

          indexx++;
          return StatusSave;
        });

        result_booking.forEach((e) => {
          debugger;
          if (e.emp_id == this.emp_select) {
            var TextReWaring = '';
            if (e.already_booked == true || e.already_booked == 'true') {
              // !!ไม่จำเป็นต้องกรอก
              // if (e.place_name == '' || e.place_name == null) {
              //   TextReWaring = 'Map Data Invalid';
              // }
              // !!ไม่จำเป็นต้องกรอก
            }
            if (e.booking_status == '' || e.booking_status == null) {
              TextReWaring = 'Booking Status Data Invalid';
            }

            StatusSave2[indexx2] = false;
            if (TextReWaring == '') {
              StatusSave2[indexx2] = true;
            } else {
              this.appMain.isLoading = false;
              this.alert.swal_warning('Please check the ' + TextReWaring);
            }

            indexx++;
            return StatusSave2;
          }
        });

        StatusSave.forEach((x) => {
          if (x == false) {
            SaveState = false;
          }
        });

        if (SaveState == true) {
          StatusSave2.forEach((x) => {
            if (x == false) {
              SaveState = false;
            }
          });
        }
      }
    } else {
      SaveState = true;
    }

    if (SaveState) {
      this.alert.swal_confrim_changes('Do you want to save the document ?').then((val) => {
        if (val.isConfirmed) {
          this.accommodation_detail.forEach(function (e) {
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
            let day2 = e.Dateto;

            if (day1 != '') {
              if (typeof e.Datefrom === 'object') {
                e.check_in = datePlusday4(day1);
              } else {
                e.check_in = e.check_in;
              }
            }

            if (day2 != '') {
              if (typeof e.Dateto === 'object') {
                e.check_out = datePlusday4(day2);
              } else {
                e.check_out = e.check_out;
              }
            }

            /* if(day1 != "" ){
                e.check_in = datePlusday4(day1);
              }

              if(day2 != ""  ){
                e.check_out = datePlusday4(day2);
              } */
          });
          const imgList = [...this.img_list];
          this.img_list = imgList.filter(({ filename, path }) => filename !== '' && path);
          this.arrayX['img_list'] = this.img_list;
          this.arrayX['accommodation_detail'] = this.accommodation_detail;
          this.arrayX['accommodation_booking'] = this.accommodation_booking;
          this.arrayX['emp_list'] = this.emp_list;
          this.arrayX['emp_list'].forEach((e) => {
            if (e.emp_id == this.emp_id) {
              e.mail_status = 'true';
            } else {
              e.mail_status = 'false';
            }
          });
          console.log('aftersave');
          console.log(JSON.parse(JSON.stringify(this.arrayX)));

          const onSuccess = (data): void => {
            this.arrayX = data;
            console.log('original data');
            console.log(JSON.parse(JSON.stringify(data)));
            console.log('data');
            console.log(data);
            this.img_list = data.img_list;
            this.accommodation_detail = data.accommodation_detail;
            this.accommodation_booking = data.accommodation_booking;
            this.accommodation_detail.forEach(function (e) {
              if (typeof e === 'object') {
                var d1, d2;
                if (e.check_in == '') {
                  d1 = '';
                } else {
                  d1 = new Date(e.check_in);
                  d1.setHours(12);
                }
                if (e.check_out == '') {
                  d2 = '';
                } else {
                  d2 = new Date(e.check_out);
                  d2.setHours(12);
                }
                function formatDate(date) {
                  var d = new Date(date),
                    month = '' + (d.getMonth() + 1),
                    day = '' + (d.getDate() + 1),
                    year = d.getFullYear();

                  if (month.length < 2) month = '0' + month;
                  if (day.length < 2) day = '0' + day;

                  return [year, month, day].join('-');
                }
                var xdate1 = formatDate(e.check_in).toString();
                var xdate2 = formatDate(e.check_out).toString();

                var montF = new DatePipe('en-US');
                try {
                  var dx1 = montF.transform(xdate1, 'dd MMM yyyy');
                } catch (err) {
                  var dx1 = '';
                }

                try {
                  var dx2 = montF.transform(xdate2, 'dd MMM yyyy');
                } catch (err) {
                  var dx2 = '';
                }

                e['Datefrom'] = d1;
                e['Dateto'] = d2;
              }
            });
            this.accommodation_booking.forEach((e) => {
              e.booking = this.getBoolean(e.booking);
              e.search = this.getBoolean(e.search);
              e.recommend = this.getBoolean(e.recommend);
              e.already_booked = this.getBoolean(e.already_booked);
              e.action_change = true;
            });
            this.model_selectX = false;
            console.log(data);
            // this.emp_list = data.
            // this.appMain.isLoading = false;
            if (btn_type === 'saved') {
              data.after_trip.opt2.status = 'Successfully saved';
            }
            if (btn_type === 'submit') {
              data.after_trip.opt2.status = 'Successfully submit';
            }
            this.alert.swal_sucess(data.after_trip.opt2.status);

            this.onloadX();

            //this.Swalalert('Update data successfully.', 'success');
          };

          this.ws.callWs(this.arrayX, 'SaveAccommodation').subscribe(
            (data) => onSuccess(data),
            (error) => {
              this.appMain.isLoading = false;
              console.log(error);
            }
          );
        } else {
          this.appMain.isLoading = false;
          return;
        }
      });
    } else {
      return;
    }
  }

  deleterow(id, emp_idd) {
    this.alert.swal_confrim_delete('').then((val) => {
      if (val.isConfirmed) {
        this.accommodation_detail.forEach(function (e) {
          if (e.id == id) {
            e.action_type = 'delete';
          }
        });
        //this.emp_select ;
        var filter_delete = this.accommodation_detail.filter((word) => word.action_type != 'delete');
        filter_delete = filter_delete.filter((word) => word.emp_id == this.emp_select);
        console.log(filter_delete.length);
        if (filter_delete.length == 0) {
          this.addrow();
        }
        this.before_ChangUser = true;
      } else {
        return;
      }
    });
    //('Delete Accommodation');
  }

  deletefile(id) {
    this.alert.swal_confrim_delete('').then((val) => {
      if (val.isConfirmed == true) {
        // booking.action_change = 'true';
        this.img_list[id].action_change = 'true';
        this.img_list[id].action_type = 'delete';
        //this.img_list.splice(id, 1)
      } else {
        return;
      }
    });

    console.log(this.img_list);
  }

  topping;
  update_userByDOC(empId) {
    this.accommodation_detail.forEach(function (e) {
      if (typeof e === 'object') {
        function formatDate(date) {
          var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + (d.getDate() + 1),
            year = d.getFullYear();

          if (month.length < 2) month = '0' + month;
          if (day.length < 2) day = '0' + day;

          return [year, month, day].join('-');
        }
        try {
          var xdate1 = formatDate(e.check_in);
          var xdate2 = formatDate(e.check_out);
          var montF = new DatePipe('en-US');
          var dx1 = montF.transform(xdate1, 'dd-MMM-yyyy');
          var dx2 = montF.transform(xdate2, 'dd-MMM-yyyy');
          e['DatePlusCin'] = dx1;
          e['DatePlusCout'] = dx2;
        } catch (err) {
          e['DatePlusCin'] = dx1;
          e['DatePlusCout'] = dx2;
        }
      }
    });
  }

  datePlusday(values, index, textname) {
    var montF = new DatePipe('en-US');
    var dx = montF.transform(values, 'dd MMM y');

    this.accommodation_detail[index][textname] = dx;
  }

  openModalx(template: TemplateRef<any>, text, index) {
    this.tp_clone = template;
    let config: object = {
      class: 'modal-md',
      animated: true,
      keyboard: false,
      ignoreBackdropClick: true,
    };
    //alert(template);
    console.log(template);
    console.log(this.search);
    this.goble_modal_index = index;
    if (text == 'template1') {
      if (this.search == true) {
        this.modalRef = this.modalService.show(template, config);
      }
    } else {
      this.modalRef = this.modalService.show(template, config);
    }
  }

  openModalx2(template: TemplateRef<any>, text, index) {
    this.tp_clone = template;
    let config: object = {
      class: 'modal-md',
      animated: true,
      keyboard: false,
      ignoreBackdropClick: true,
    };
    //alert(template);
    this.modalRef = this.modalService.show(template, config);
  }

  saveaction_S() {
    this.arrayX['data_type'] = 'save';
    this.saveaction();
  }

  submithx() {
    this.arrayX['data_type'] = 'submit';
    this.saveaction();
    //this.btnCloseX.nativeElement.click();
  }

  check_el(text: NgModel) {
    // console.log(text);
    const { invalid, touched } = text;

    let state = false;
    try {
      //console.log(text);

      if (text.control.value) {
        state = false;
      } else {
        state = touched && invalid ? true : false;
      }
    } catch (err) {
      state = false;
    }

    return state;
  }

  Edit_BookingTable(id, index) {
    this.edit_status = true;
    this.booking = true;
    this.country_C = this.accommodation_detail[index].country;
    this.ho_name = this.accommodation_detail[index].hotel_name;
    this.ch_in = this.accommodation_detail[index].check_in;
    this.ch_out = this.accommodation_detail[index].check_out;
    this.roomType = this.accommodation_detail[index].roomtype;
    this.add_request = this.accommodation_detail[index].additional_request;
    this.book_status = this.accommodation_detail[index].booking_status;
    this.map_url = this.accommodation_detail[index].map_url;
    this.place_name = this.accommodation_detail[index].place_name;
    this.index_from_edit = index;
  }

  Click_boolstatus(index) {
    //alert(index)
    /* this.edit_status = false;
    this.booking = false; */
    //input_Arr
    this.input_Arr = [];
    this.input_Arr[index].country;
    this.input_Arr[index].hotel_name;
    this.input_Arr[index].check_in;
    this.input_Arr[index].check_out;
    this.input_Arr[index].roomtype;
    this.input_Arr[index].additional_request;
    this.input_Arr[index].booking_status;
    this.input_Arr[index].map_url;
    this.input_Arr[index].place_name;

    this.country_C = this.accommodation_detail[index].country;
    this.ho_name = this.accommodation_detail[index].hotel_name;
    this.ch_in = this.accommodation_detail[index].check_in;
    this.ch_out = this.accommodation_detail[index].check_out;
    this.roomType = this.accommodation_detail[index].roomtype;
    this.add_request = this.accommodation_detail[index].additional_request;
    this.book_status = this.accommodation_detail[index].booking_status;
    this.map_url = this.accommodation_detail[index].map_url;
    this.place_name = this.accommodation_detail[index].place_name;
  }

  convert_dateYMD(val) {
    try {
      var montF = new DatePipe('en-US');
      var objdate = montF.transform(val, 'yyyy-MM-dd');
      objdate = objdate;
    } catch (err) {
      var objdate = '';
    }
    return objdate;
  }

  dateinput_Arr(values, index, textname) {
    let datestr = new Date(this.convert_dateYMD(values));
    this.input_Arr[index][textname] = datestr;
    console.log(this.input_Arr);
  }

  ModelChang(index) {
    this.accommodation_booking[index].action_change = 'true';
  }

  disblebox(status, index) {
    this.accommodation_booking[index].action_change = 'true';
    console.log(status);
    if (status == true) {
      this.accommodation_booking[index].booking = false;
      this.accommodation_booking[index].search = false;
      this.accommodation_booking[index].recommend = false;
      /* this.booking = false;
      this.search = false;
      this.recommend = false; */
    }
  }

  disblebox_booking(index, status) {
    this.accommodation_booking[index].action_change = 'true';
    console.log(status);
    if (status == true) {
      this.accommodation_booking[index].already_booked = false;
      // this.accommodation_booking[index].recommend = false;
      // this.accommodation_booking[index].search = false;
    } else {
      if (!status) {
        this.accommodation_booking[index].recommend = false;
        this.accommodation_booking[index].search = false;
      }
    }
  }

  addmap(empid) {
    // planname mapx
    var planname = $('#plan_namex').val();
    var mapx = $('#mapx').val();
    //console.log(planname,mapx);
    this.accommodation_booking.forEach(function (e) {
      if (e.emp_id == empid) {
        e.action_change = true;
        e.place_name = planname;
        e.map_url = mapx;
      }
    });
    this.closeModal.nativeElement.click();
    //console.log(this.accommodation_booking);
  }

  data_retune() {
    var datrf = this.accommodation_detail.filter((word) => word.emp_id == this.emp_select);
    var re = datrf.filter((word) => word.action_type != 'delete');
    var ds = re.sort(function (a, b) {
      return parseInt(a.id) - parseInt(b.id);
    });
    //console.log(re);
    return ds;
  }

  values_search = '';
  openbowser(index, x?) {
    if (x == false) {
      return;
    }
    //console.log(this.selected_employee2.name);
    //this.closeModal.nativeElement.click();
    if (this.accommodation_booking[index].search == true) {
      var url = 'https://www.google.com/travel/hotels';
      window.open(url);
    }
  }

  model_selectX = false;
  model_action_change(id) {
    this.accommodation_detail.forEach(function (e) {
      if (e.id == id) {
        e.action_change = true;
      }
    });
    this.before_ChangUser = true;
    console.log(this.accommodation_detail);
    this.model_selectX = true;
  }

  model_action_change_book(emp_id) {
    //alert();
    this.accommodation_booking.forEach(function (e) {
      if (e.emp_id == emp_id) {
        e.action_change = true;
      }
    });
    console.log(this.accommodation_booking);
  }

  //

  statusChange() {
    if (this.status == true) {
      this.status = false;
    } else {
      this.status = true;
    }
  }

  copyDetailAllEmp(emp_id) {
    const ds1 = this.arrayX['accommodation_detail'];
    const ds2 = this.arrayX['accommodation_booking'];
    var Data1, Data2;

    var Data1 = ds1.filter(function (el) {
      return el.emp_id == emp_id;
    });
    var Data2 = ds2.filter(function (el) {
      return el.emp_id == emp_id;
    });

    console.log('accommodation_detail');
    console.log(Data1);
    console.log('accommodation_booking');
    console.log(Data2);

    //this.getMax();

    /* this.accommodation_detail.forEach(e => {

        e.action_change =  "true";
        e.action_type = Data1.action_type ;
        e.check_in = Data1.check_in ;
        e.check_out = Data1.check_out ;
        e.country = Data1.country ;
        e.hotel_name = Data1.hotel_name ;
        e.roomtype = Data1.roomtype ;

      }); */

    /* this.accommodation_booking.forEach(e => {

        e.booking =  Data2.booking ;
        e.search =  Data2.search ;
        e.recommend =  Data2.recommend ;
        e.already_booked =  Data2.already_booked;
        e.already_booked_other =  Data2.already_booked_other;
        e.already_booked_id =  Data2.already_booked_id;
        e.additional_request =  Data2.additional_request;
        e.booking_status =  Data2.booking_status;
        e.place_name =  Data2.place_name;
        e.map_url =  Data2.map_url;
        e.action_type =  Data2.action_type;
        e.action_change =  "true";

      }) */

    /*     console.log('accommodation_detail');
    console.log(this.accommodation_detail);
    console.log('accommodation_booking');
    console.log(this.accommodation_booking); */
  }

  search_recommend(type, index) {
    this.accommodation_booking[index].action_change = 'true';
    if (type == 'search') {
      if (this.accommodation_booking[index].search == true) {
        this.accommodation_booking[index].recommend = false;
      } else {
        // this.accommodation_booking[index].recommend = true;
      }
    } else {
      if (this.accommodation_booking[index].recommend == true) {
        this.accommodation_booking[index].search = false;
      } else {
        // this.accommodation_booking[index].search = true;
      }
    }
  }

  //Set CopyAll
  openModalCopy(template: TemplateRef<any>) {
    this.tp_clone = template;
    let config: object = {
      class: 'modal-lg',
      animated: true,
      keyboard: false,
      ignoreBackdropClick: true,
    };
    this.modalRef = this.modalService.show(template, config);
    $('.modal-backdrop').css({ 'z-index': 700 });
    $('.modal').css({ 'z-index': 800 });
  }
  User_selected_Copy: any = [];
  airticket_copy_selected: any = '1';

  copyDetailAllEmp2(emp_id) {
    this.alert.swal_confrim('Do you want to paste information?', '', 'question').then((val) => {
      if (val.isConfirmed == true) {
        this.before_ChangUser = true;
        let ds_person_selected = this.User_selected_Copy;
        let type_person_selected = this.airticket_copy_selected;
        // 1 = all user , 2 = user ที่เลือก
        let bcheck_all: boolean = false;
        if (type_person_selected == '1') {
          bcheck_all = true;
        }

        const ds1 = this.accommodation_detail;
        const ds2 = this.accommodation_booking;
        var Data1 = [],
          Data2;

        var irow = 0;
        for (var i = 0; i < ds1.length; i++) {
          if (ds1[i].emp_id == emp_id && ds1[i].action_type != 'delete') {
            Data1[irow] = ds1[i];
            irow++;
          }
        }

        Data2 = ds2.filter(function (el) {
          return el.emp_id == emp_id;
        });
        let courseCheck = false;
        // update type เป็น delete
        this.accommodation_detail.forEach((e) => {
          if (bcheck_all) {
            if (e.emp_id != emp_id) {
              e.action_change = 'true';
              e.action_type = 'delete';
              courseCheck = true;
            }
          } else {
            ds_person_selected.forEach((el) => {
              if (e.emp_id == el.emp_id) {
                e.action_change = 'true';
                e.action_type = 'delete';
                courseCheck = true;
              }
            });
          }
        });

        var Img_data = this.img_list.filter((v) => v.action_type != 'delete');
        Img_data = Img_data.filter((v) => v.emp_id == emp_id);
        this.img_list.forEach((e) => {
          if (bcheck_all) {
            if (e.emp_id != emp_id) {
              e.action_change = 'true';
              e.action_type = 'delete';
              courseCheck = true;
            }
          } else {
            ds_person_selected.forEach((el) => {
              if (e.emp_id == el.emp_id) {
                e.action_change = 'true';
                e.action_type = 'delete';
                courseCheck = true;
              }
            });
          }
        });

        //console.log(Data2[0])
        this.accommodation_booking.forEach((e) => {
          //กรณีเลือก all
          if (bcheck_all) {
            if (e.emp_id != emp_id) {
              // add detail
              if (courseCheck) {
                this.New_row_byEmp(e.emp_id, Data1, Img_data);
              }
              var el = Data2[0];
              e.action_change = 'true';
              e.accommodation_booking = el.accommodation_booking;
              e.booking = el.booking;
              e.search = el.search;
              e.recommend = el.recommend;
              e.already_booked = el.already_booked;
              e.already_booked_other = el.already_booked_other;
              e.already_booked_id = el.already_booked_id;
              e.additional_request = el.additional_request;
              e.booking_status = el.booking_status;
              e.place_name = el.place_name;
              e.map_url = el.map_url;
            }
          } else {
            ds_person_selected.forEach((el) => {
              if (e.emp_id == el.emp_id) {
                if (courseCheck) {
                  this.New_row_byEmp(e.emp_id, Data1, Img_data);
                }
                var el = Data2[0];
                e.action_change = 'true';
                e.accommodation_booking = el.accommodation_booking;
                e.booking = el.booking;
                e.search = el.search;
                e.recommend = el.recommend;
                e.already_booked = el.already_booked;
                e.already_booked_other = el.already_booked_other;
                e.already_booked_id = el.already_booked_id;
                e.additional_request = el.additional_request;
                e.booking_status = el.booking_status;
                e.place_name = el.place_name;
                e.map_url = el.map_url;
              }
            });
          }
        });

        this.alert.toastr_warning('Please Save Data');
        this.modalRef.hide();
        //??  update emp_id หลังจาก copy
        if (bcheck_all) {
          let emp_id_Selected = this.emp_id;
          let emp_list = this.emp_list;
          let Lebgth_emp_list = this.emp_list.length;
          let empIndex = emp_list.findIndex((item) => item.emp_id === emp_id_Selected);
          if (Lebgth_emp_list - 1 === empIndex) {
            empIndex = 0;
          } else {
            empIndex += 1;
          }
          const { emp_id } = emp_list[empIndex];
          console.log(this.emp_select);
          this.emp_select = emp_id;
          this.emp_id = emp_id;
        } else {
          if (ds_person_selected.length > 0) {
            let emp_id_Selected = ds_person_selected.at(-1);
            const { emp_id } = emp_id_Selected;
            this.emp_select = emp_id;
            this.emp_id = emp_id;
          }
        }
        //??  update emp_id หลังจาก copy
        const doc_id = this.doc_id;
        this.appMain.userSelected = this.emp_id;
        this.airticket_copy_selected = '1';
        this.User_selected_Copy = [];
      } else {
        console.log('Out put');
        console.log(this.accommodation_detail);
        console.log(this.accommodation_booking);
        console.log(this.img_list);
      }
    });
    console.log('Out put');
    console.log(this.accommodation_detail);
    console.log(this.accommodation_booking);
    console.log(this.img_list);
    //this.alert.toastr_warning('Please Save Data');
  }

  New_row_byEmp(emp_id, dsCopy, Img_data) {
    var last_id = this.accommodation_detail
      .filter((v) => {
        return v.emp_id == emp_id;
      })
      .sort((a, b) => {
        return a.id - b.id;
      });

    var max_i = parseInt(this.getMax(this.accommodation_detail, 'id').id);
    var max_img = parseInt(this.getMax(this.img_list, 'id').id);
    //parseInt(this.getMax(this.accommodation_detail,'id'))
    max_img = max_img + 1;
    var len = last_id.length <= 1 ? 0 : last_id.length - 1;
    //let irows: number = parseInt(last_id[len].id);
    let irows: number = parseInt(last_id[len].id);
    //var i = irows + 1;

    // debugger;
    var i = max_i + 1;
    var dx1 = '';
    var dx2 = '';
    dsCopy.forEach((el) => {
      var dateFromX = dx1;
      var datetoX = dx2;

      this.accommodation_detail.push({
        doc_id: this.doc_id,
        emp_id: emp_id,
        id: i.toString(),
        country: el.country,
        hotel_name: el.hotel_name,
        /* check_in: el.check_in,
        check_out: el.check_out, */
        Datefrom: el.Datefrom,
        Dateto: el.Dateto,
        check_in: el.Datefrom,
        check_out: el.Dateto,
        roomtype: el.roomtype,
        action_type: 'insert',
        action_change: 'true',
      });
      i++;
    });

    if (Img_data.length > 0) {
      Img_data.forEach((el) => {
        this.img_list.push({
          doc_id: this.doc_id,
          emp_id: emp_id,
          id: max_img,
          id_level_1: el.id_level_1,
          id_level_2: el.id_level_2,
          path: el.path,
          filename: el.filename,
          fullname: el.fullname,
          pagename: 'accommodation',
          actionname: '',
          status: null,
          active_type: 'false',
          modified_date: el.modified_date,
          modified_by: '',
          action_type: 'insert',
          action_change: 'true',
          remark: null,
        });
        max_img++;
      });
    }

    console.log('ds - copy');
    console.log(this.img_list);
    console.log(dsCopy);
    console.log('Out put');

    this.testdetail1 = this.accommodation_detail;
    //this.maindata_all.airticket_detail = this.air_ticket_body;
  }

  /*  order_by_list(arr){
    var re = arr;
    re.sort(function(a, b){
      if(a.name < b.name) { return -1; }
      if(a.name > b.name) { return 1; }
      return 0;
    })
    return arr
  } */
}
