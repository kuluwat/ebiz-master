import {HttpClient} from '@angular/common/http';
import {
  Component,
  OnInit,
  forwardRef,
  Inject,
  TemplateRef,
  ViewChild,
  ElementRef,
  QueryList,
  NgZone,
  ChangeDetectorRef,
} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {BsLocaleService} from 'ngx-bootstrap/datepicker';
import {isAfter} from 'ngx-bootstrap/chronos';

import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { MainComponent } from '../../../components/main/main.component';
import { FileuploadserviceService } from '../../../ws/fileuploadservice/fileuploadservice.service';
import { AspxserviceService } from '../../../ws/httpx/aspxservice.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { MasterComponent } from '../master.component';
import {DatePipe} from '@angular/common';
import * as fs from 'file-saver';
import { AlertServiceService } from '../../../services/AlertService/alert-service.service';
import { InitTrackStatus, TrackingStatus } from '../../../model/localstorage.model';
import {resolve} from 'url';
import { CloneDeep } from '../transportation/transportation/transportation.component';

declare var $: any;
declare var toastr: any;

@Component({
  selector: 'app-airticket',
  templateUrl: './airticket.component.html',
  styleUrls: [ './airticket.component.css' ],
})
export class AirticketComponent implements OnInit {
  TRAVEL_TYPE: string;
  profile: any;
  transform(items : any, searchText: String) {
    searchText = searchText.toLocaleLowerCase();
    return items.filter((it) => {
      return (
        it.name.toLocaleLowerCase().includes(searchText) ||
        it.city.toLocaleLowerCase().includes(searchText) ||
        it.country.toLocaleLowerCase().includes(searchText)
      );
    });
  }
  //defeat DATA

  pagename = 'airticket';
  doc_id = null;
  emp_id = null;
  selectedFile: File = null!;
  //DOC
  DOC_DETAIL = {
    action_type: '',
    additional_request: '',
    after_trip: '',
    airticket_detail: '',
    already_booked: false,
    as_company_recommend: false,
    ask_booking: false,
    booking_ref: '',
    booking_status: '',
    business_date: '',
    country_city: '',
    doc_id: '',
    emp_list: [],
    AIRTICKET_TYPE_ID: '',
    id: '',
    img_list: [],
    search_air_ticket: false,
    token_login: false,
    travel_date: '',
    travel_topic: '',
    user_admin: '',
    user_display: '',
    data_type: null,
  };

  keyword = 'name';
  dataxx = [
    {
      id: 1,
      name: 'Usa',
    },
    {
      id: 2,
      name: 'England',
    },
  ];

  user_reject: boolean = true;
  master_airport = {
    value_from: [],
    value_to: [],
    config: {
      displayKey: 'display_name', // if objects array passed which key to be displayed defaults to description
      search: true,
      limitTo: 1000,
      placeholder: 'Select',
      height: '300px',
      // searchOnKey:"name"
    },
    data: [],
    data_old: [],
  };

  maindata_all = {
    action_type: '',
    airticket_root: '',
    additional_request: '',
    after_trip: '',
    airticket_detail: [],
    airticket_booking: [],
    already_booked: false,
    as_company_recommend: false,
    ask_booking: false,
    AIRTICKET_TYPE_ID: '',
    booking_ref: '',
    booking_status: '',
    business_date: '',
    country_city: '',
    doc_id: '',
    emp_list: [],
    id: '',
    img_list: [],
    airticket_type_id: '',
    search_air_ticket: false,
    token_login: false,
    travel_date: '',
    travel_topic: '',
    user_admin: '',
    user_display: '',
    data_type: null,
    check_my_trip: null,
    root: null,
    m_book_status: null,
    m_book_type: null,
  };
  TrackingStatus: TrackingStatus = {...InitTrackStatus};
  air_ticket_header = [
    /* {
      col: "Date",
      width_th: 15
    }, */
    {col: 'Route', width_th: 30},
    {col: 'Flight', width_th: 15},
    {col: 'Departure Date', width_th: 15, width_min: '110px'},
    {col: 'Departure Time', width_th: 15},
    {col: 'Arrival Date', width_th: 15, width_min: '110px'},
    {col: 'Arrival Time', width_th: 15},
    {col: '', width_th: 5},
  ];

  airticket_copy_selected: any = '1';
  air_ticket_header_admin = [
    {
      col: 'Employee ID',
    },
    {col: 'Employee Name'},
    {col: 'Booking ref'},
    {col: 'Booking Status'},
    {col: 'Date '},
  ];
  booking_detail: any = [];
  air_ticket_body = [];
  DATAMONTH: any = [
    {name: 'JAN', code: '1'},
    {name: 'FEB', code: '2'},
    {name: 'MAR', code: '3'},
    {name: 'APR', code: '4'},
    {name: 'MAY', code: '5'},
    {name: 'JUN', code: '6'},
    {name: 'JUL', code: '7'},
    {name: 'AUG', code: '8'},
    {name: 'SEP', code: '9'},
    {name: 'OCT', code: '10'},
    {name: 'NOV', code: '11'},
    {name: 'DEC', code: '12'},
  ];
  air_ticket_all: any;
  topping = [ {userDisplay: ''} ];
  air_ticket_emplist: any = [];
  air_ticket_status_delete = [];
  Already_status: boolean = false;
  arrayX = [];
  modal_open = false;
  user_admin: boolean = false;
  tp_clone: TemplateRef<any>;
  modalRef: BsModalRef;
  modalRef_Copy: BsModalRef;
  private _jsonURL = '../../../../../assets/assets/data/airports.json';
  checkKeycode: any;
  obj_master: any;
  topping_selected: any;
  User_selected_Copy: any = [];
  panel = {
    show: false,
    after: false,
  };
  booking_by: object = [
    {
      _id: '1',
      name: 'Traveler',
      val: 'traveler',
    },
    {
      _id: '2',
      name: 'Organizer',
      val: 'organizer',
    },
    {
      _id: '3',
      name: 'Customer',
      val: 'customer',
    },
    {
      _id: '4',
      name: 'Supplier',
      val: 'supplier',
    },
    {
      _id: '4',
      name: 'Others Text',
      val: 'others_text',
    },
  ];
  booking_detail_data: boolean = false;

  model = {
    request_type: {
      value: [],
      config: {
        displayKey: 'name', // if objects array passed which key to be displayed defaults to description
        search: true,
        limitTo: 1000,
        placeholder: 'Select',
      },
      list: null,
    },
    business_date: [],
  };
  stage = {
    isshow: false,
    type: false,
    emp_id: '',
    row_id: '',
  };
  selected_key_booking: number = 0;
  def_data_old: any;
  selected_bookdetail: any;
  select_row_airticket: any = 0;
  locale = 'th';
  usertest: string = '';
  TRAVEL_TYPE_OL;
  TRAVEL_TYPE_DROPDOWN;
  modal_Ref_mail: BsModalRef;
  pathPhase1: any;
  userDetail: any;
  @ViewChild('closeModel', {static: true}) btnCloseX: ElementRef;
  constructor(
    @Inject(forwardRef(() => MasterComponent)) private Appmain: MasterComponent,
    private modalService: BsModalService,
    private http: HttpClient,
    private ws: AspxserviceService,
    private fileuploadservice: FileuploadserviceService,
    private localeService: BsLocaleService,
    private alerts: AlertServiceService,
    private changeDetector: ChangeDetectorRef
  ) { }

  public getJSON(url: string): Observable<any> {
    return this.http.get(url);
  }
  filteredOptions: Observable<string[]>;

  ngOnInit() {
    console.clear();
    this.TRAVEL_TYPE_OL = this.Appmain.TRAVEL_TYPE;
    this.doc_id = this.Appmain.DOC_ID;

    this.Warpperfunc();
  }

  async CheckLogin() {
    this.Appmain.isLoading = true;

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
  async Warpperfunc() {
    this.profile = await this.CheckLogin();
    this.OnloadDoc();
    this.loadMasterAir();
  }
  OnloadDoc() {
    // this.Appmain.isLoading = true;
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
    return this.maindata_all.emp_list.filter((item) => item.emp_id === this.emp_id);
  }
  get docStatus() {
    return (Status: number) => {
      // return this.TrackingStatus[Status];
      let emp_id = this.emp_id;
      // console.log(emp_id);
      // return this.TrackingStatus[Status];
      let id: number = 1;
      if (this.maindata_all.emp_list.length > 0) {
        // TEST
        // this.emp_list.forEach((i) => (i.doc_status_id = '2'));
        let dt = this.maindata_all.emp_list.find((item) => item.emp_id === emp_id);
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
  get fileByUser(): boolean {
    let fileCheck: boolean = true;
    let emp_id_selected = this.emp_id;
    let selected_key_bookingKEY = this.selected_key_booking;
    let booking_status = this.booking_detail[ selected_key_bookingKEY ].booking_status;
    let callback1 = ({fullname, path, filename}) => fullname && path && filename;
    let callback2 = ({action_type, emp_id}) => action_type !== 'delete' && emp_id === emp_id_selected;
    let imgList = this.DOC_DETAIL.img_list.filter(callback1).filter(callback2);
    // booking_status -> confrimed
    if (imgList.length === 0 && booking_status === '2') {
      fileCheck = false;
    }
    return fileCheck;
  }
  bookingX = [];
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
  onloadOld_data() {
    this.Appmain.isLoading = true;
    //this.def_data_old
    var bodyX = {
      token_login: localStorage[ 'token' ],
      doc_id: this.doc_id,
    };

    const onSuccess = (data) => {
      console.log('onloadOld_data');
      console.log(data);
      this.def_data_old = data;
      this.air_ticket_body = data.airticket_detail;
      this.booking_detail = data.airticket_booking;
      this.bookingX = data.airticket_booking;
      this.air_ticket_body.forEach(function (e) {
        if (typeof e === 'object') {
          var d1, d2;
          if (e.airticket_departure_date == '') {
            d1 = '';
          } else {
            d1 = new Date(e.airticket_departure_date);
            d1.setHours(12);
          }
          if (e.airticket_arrival_date == '') {
            d2 = '';
          } else {
            d2 = new Date(e.airticket_arrival_date);
            d2.setHours(12);
          }

          function formatDate(date) {
            var d = new Date(date),
              month = '' + (d.getMonth() + 1),
              day = '' + (d.getDate() + 1),
              year = d.getFullYear();

            if (month.length < 2) month = '0' + month;
            if (day.length < 2) day = '0' + day;

            return [ year, month, day ].join('-');
          }
          var xdate1 = formatDate(e.airticket_departure_date).toString();
          var xdate2 = formatDate(e.airticket_arrival_date).toString();

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

          e[ 'Datefrom' ] = d1;
          e[ 'Dateto' ] = d2;
        }
      });
      if (data.user_admin === false && false) {
        //@ts-ignore
        // const { profile } = this.Appmain.appHeader;
        console.log('profile');
        const profile = this.profile[ 0 ];
        console.log(profile);
        let finduser = data.emp_list.find(({emp_id}) => emp_id === profile.empId);
        this.topping_selected = finduser ? finduser : data.emp_list[ 0 ];
        this.emp_id = profile.empId;
        this.user_display = profile.empName;
        this.user_admin = false;
        if (finduser) {
          this.user_reject = finduser.show_button;
          if (finduser.status_trip_cancelled === 'true') {
            this.user_reject = false;
          }
        } else {
          this.user_reject = false;
          //?? เช็คว่าเป็น requesterรึป่าว
          if ('user_request' in data && data.user_request === true) {
            let userSelected = this.Appmain.userSelected;
            this.user_reject = false;
            this.user_admin = true;
            if (userSelected) {
            } else {
              this.emp_id = data.emp_list[ 0 ].emp_id;
              this.Appmain.userSelected = data.emp_list[ 0 ].emp_id;
            }
          }
        }
      }
      this.userDetail = this.UserDetail[ 0 ];
      console.log(' first_data ');
      console.log(this.air_ticket_body);
    };

    this.ws.callWs(bodyX, 'LoadAirTicket').subscribe(
      (data) => onSuccess(data),
      (error) => (this.Appmain.isLoading = false),
      () => {
        this.Appmain.isLoading = false;

        if (typeof this.air_ticket_body == 'object') {
          this.air_ticket_body.forEach((val) => {
            if (val[ 'airticket_date' ] != '' && val[ 'airticket_date' ] != null) {
              let datestr = this.convert_dateYMD(val[ 'airticket_date' ]);
              const date = new Date(datestr);
              val[ 'airticket_date_type' ] = date;
            }

            var d1, d2;
            // null = false,undifind = false, ""= false
            if (!val.airticket_departure_date) {
              d1 = '';
            } else {
              d1 = new Date(val.airticket_departure_date);
              d1.setHours(12);
            }
            if (!val.airticket_arrival_date) {
              d2 = '';
            } else {
              d2 = new Date(val.airticket_arrival_date);
              d2.setHours(12);
            }

            function formatDate(date) {
              var d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + (d.getDate() + 1),
                year = d.getFullYear();

              if (month.length < 2) month = '0' + month;
              if (day.length < 2) day = '0' + day;

              return [ year, month, day ].join('-');
            }
            var xdate1 = formatDate(val.airticket_departure_date).toString();
            var xdate2 = formatDate(val.airticket_arrival_date).toString();

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

            val[ 'Datefrom' ] = d1;
            val[ 'Dateto' ] = d2;
          });
          this.def_data_old.airticket_booking.forEach((el) => {
            el.search_air_ticket = this.convert_bool(el.search_air_ticket);
            el.ask_booking = this.convert_bool(el.ask_booking);
            el.as_company_recommend = this.convert_bool(el.as_company_recommend);
            el.already_booked = this.convert_bool(el.already_booked);
          });

          this.booking_detail_data = true;
          //  this.select_row_airticket =
        }
      }
    );
  }
  convert_textbooking(id_booking) {
    var dt = this.maindata_all.m_book_status;
    var result: any;
    for (const res of dt) {
      if (id_booking == '' || id_booking == null) {
        result = null;
        break;
      }
      if (res.id == id_booking) {
        result = res.name;

        break;
      }
    }

    return result;
  }
  downloadFile(url, filename) {
    let Regex = /.[A-Za-z]{3}$/;
    let fullurl = url.match(Regex);
    //let fileType = fullurl[0];
    let file_name = filename;
    // fs.saveAs(url, file_name);
  }

  openModal(template: TemplateRef<any>) {
    this.tp_clone = template;
    let config: object = {
      class: 'modal-lg',
      animated: true,
      keyboard: false,
      ignoreBackdropClick: true,
    };
    this.modalRef = this.modalService.show(template, config);
    $('.modal-backdrop').css({'z-index': 700});
    $('.modal').css({'z-index': 800});
  }

  async wait_data() {
    await this.Onsave('saved');
  }

  update_userByDOC(VLAUE) {
    this.Log(VLAUE);
    // some = || every = &&
    //debugger;
    var check_detail = this.air_ticket_body.some(
      (res) => (res.action_change == true || res.action_change == 'true') && res.emp_id == this.emp_id
    );
    var check_booking = this.booking_detail.some(
      (res) => (res.action_change == true || res.action_change == 'true') && res.emp_id == this.emp_id
    );

    if (check_detail == true || check_booking == true) {
      // title:string, msg: string, action: string
      // this.maindata_all.airticket_detail = this.air_ticket_body;
      this.alerts.swal_confrim_changes('Do you want to save the document ?').then((val) => {
        if (val.isConfirmed == true) {
          this.wait_data();
          this.select_row_airticket = null;
          this.selected_bookdetail = null;
          this.stage.emp_id = '';
          this.stage.row_id = '';
          this.DOC_DETAIL.user_display = VLAUE.userDisplay;
          this.emp_id = VLAUE.emp_id;
          try {
            if (VLAUE.hasOwnProperty('show_button')) {
              this.user_reject = VLAUE.show_button;
            } else {
              this.user_reject = false;
            }
          } catch (err) {
            console.log(err);
          }
        } else {
          //debugger;
          console.log(this.maindata_all.airticket_detail);
          console.log(this.air_ticket_body);
          this.emp_id = VLAUE.emp_id;

          //this.onloadOld_data();
          //alert('cancel');

          this.DOC_DETAIL.user_display = VLAUE.userDisplay;

          if (VLAUE.hasOwnProperty('show_button')) {
            this.user_reject = VLAUE.show_button;
          } else {
            this.user_reject = false;
          }
          this.TrackingStatus = {...InitTrackStatus};
        }
      });
    } else {
      this.emp_id = VLAUE.emp_id;
      /* debugger
      console.log(this.maindata_all.airticket_detail);
      console.log(this.air_ticket_body);
      console.log(this.air_ticket_emplist);
      this.select_row_airticket = null;
      this.selected_bookdetail = null;
      this.stage.emp_id = "";
      this.stage.row_id = "";
      this.DOC_DETAIL.user_display = VLAUE.userDisplay;
      
      if (VLAUE.hasOwnProperty("show_button")) {
        this.user_reject = VLAUE.show_button;
      } else {
        this.user_reject = false;
      } */
    }

    console.log(this.maindata_all.airticket_detail);
    console.log(this.air_ticket_body);
    this.air_ticket_emplist.forEach((e) => {
      if (e.emp_id == VLAUE.emp_id) {
        e.mail_status = 'true';
      } else {
        e.mail_status = 'false';
      }
    });
    this.userDetail = this.UserDetail[ 0 ];
    const emp_id = this.emp_id;
    const doc_id = this.doc_id;
    this.Appmain.userSelected = emp_id;
    this.TrackingStatus = {...InitTrackStatus};
  }
  get_index_airticket(ds, emp_id, id?) {
    if (ds.length > 0) {
      var i = ds.findIndex((res) => {
        return res.emp_id == emp_id;
      });

      return i;
    }
    return 0;
  }
  get_index_airticket_by_row(ds, emp_id, id?) {
    if (ds.length > 0) {
      return ds.findIndex((res) => {
        return res.emp_id == emp_id && res.id == id;
      });
    }
    return false;
  }
  convert_dateDMY(str) {
    var dt = new Date(str);

    var montF = new DatePipe('en-US');

    return montF.transform(dt, 'dd MMM yyyy');
  }
  convert_dateYMD(val) {
    var montF = new DatePipe('en-US');
    var objdate = montF.transform(val, 'yyyy-MM-dd');
    return objdate;
  }
  setformat(val, item) {
    // YYYY-MM-DD
    let datestr = new Date(this.convert_dateYMD(val));
    let i = this.get_index_airticket_by_row(this.air_ticket_body, item.emp_id, item.id);

    this.air_ticket_body[ i ].airticket_date = val;
    this.air_ticket_body[ i ].action_change = true;
    this.air_ticket_body[ i ].airticket_date_type = datestr;
  }

  stage_check(type, emp_id, id) {
    this.Log(type);
    this.Log(emp_id);
    this.stage.type = type;
    this.stage.emp_id = emp_id;
    this.stage.row_id = id;
    this.fileterbookdetail();
  }

  getMax(arr, prop) {
    var max;
    for (var i = 0; i < arr.length; i++) {
      if (max == null || parseInt(arr[ i ][ prop ]) > parseInt(max[ prop ])) max = arr[ i ];
    }
    return max;
  }

  New_row_byEmp(emp_id, dsCopy, ImgList) {

    var last_id = (this.air_ticket_body)
      .filter((v) => {
        return v.emp_id == emp_id;
      })
      .sort((a, b) => {
        return (+a.id) - (+b.id);
      });
    const sortby = (a, b) => (+a.id) - (+b.id);
    if (dsCopy && dsCopy.length > 0) {
      const ds = dsCopy[ 0 ];
      if ("id" in ds) {
        dsCopy = dsCopy.sort(sortby)

      }

    }

    var max_i = parseInt(this.getMax(this.DOC_DETAIL.img_list, 'id').id);
    max_i = max_i + 1;
    var len = last_id.length <= 1 ? 0 : last_id.length - 1;
    let irows: number = parseInt(last_id[ len ].id);
    var i = irows + 1;
    dsCopy.forEach((el) => {
      this.air_ticket_body.push({
        doc_id: this.doc_id,
        emp_id: emp_id,
        id: i.toString(),
        Datefrom: el.Datefrom ? el.Datefrom : "",
        Dateto: el.Dateto ? el.Dateto : "",
        airticket_date: el.airticket_date,
        airticket_date_type: el.airticket_date_type,
        airticket_route: el.airticket_route,
        airticket_route_from: el.airticket_route_from,
        airticket_route_to: el.airticket_route_to,
        airticket_flight: el.airticket_flight,
        airticket_departure_time: el.airticket_departure_time,
        airticket_arrival_time: el.airticket_arrival_time,
        airticket_departure_date: el.airticket_departure_date,
        airticket_arrival_date: el.airticket_arrival_date,
        action_type: 'insert',
        action_change: 'true',
      });
      i++;
    });

    if (ImgList.length > 0) {
      ImgList.forEach((el) => {
        this.DOC_DETAIL.img_list.push({
          doc_id: this.doc_id,
          emp_id: emp_id,
          id: max_i,
          id_level_1: el.id_level_1,
          id_level_2: el.id_level_2,
          path: el.path,
          filename: el.filename,
          fullname: el.fullname,
          pagename: 'airticket',
          actionname: '',
          status: null,
          active_type: 'false',
          modified_date: el.modified_date,
          modified_by: '',
          action_type: 'insert',
          action_change: 'true',
          remark: '',
        });
        max_i++;
      });
    }

    this.air_ticket_body.forEach((e) => {
      var d1, d2;
      if (e.Datefrom == '') {
        d1 = '';
      } else {
        d1 = new Date(e.Datefrom);
        d1.setHours(12);
      }
      if (e.Datefrom == '') {
        d2 = '';
      } else {
        d2 = new Date(e.Dateto);
        d2.setHours(12);
      }

      e.Datefrom = d1;
      e.Dateto = d2;
    });

    this.maindata_all.airticket_detail = this.air_ticket_body;
  } /*  */
  copyDetailAllEmp(emp_id) {
    let ds_person_selected = this.User_selected_Copy;
    let type_person_selected = this.airticket_copy_selected;
    // 1 = all user , 2 = user ที่เลือก
    let bcheck_all: boolean = false;
    if (type_person_selected == '1') {
      bcheck_all = true;
    }

    console.log('Copy All Detail');
    console.log(this.air_ticket_body);
    console.log(this.booking_detail);

    const ds1 = this.air_ticket_body;
    const ds2 = this.booking_detail;
    console.log('1');
    console.log(ds_person_selected);
    console.log('2');
    console.log(type_person_selected);
    console.log('3');
    console.log(this.air_ticket_body);
    console.log('4');
    console.log(this.booking_detail);
    var Data1 = [],
      Data2;
    this.alerts.swal_confrim('Do you want to paste information?', '', 'question').then((val) => {
      if (val.isConfirmed == true) {
        var irow = 0;
        for (var i = 0; i < ds1.length; i++) {
          if (ds1[ i ].emp_id == emp_id && ds1[ i ].action_type != 'delete') {
            Data1[ irow ] = ds1[ i ];
            irow++;
          }
        }

        Data2 = ds2.filter(function (el) {
          return el.emp_id == emp_id;
        });
        let courseCheck = false;

        //delete img
        this.DOC_DETAIL.img_list.forEach((e) => {
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

        var Img_data = this.DOC_DETAIL.img_list.filter((v) => v.action_type != 'delete');
        Img_data = Img_data.filter((v) => v.emp_id == this.emp_id);
        // update type เป็น delete
        this.air_ticket_body.forEach((e) => {
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

        this.booking_detail.forEach((e) => {
          //กรณีเลือก all
          if (bcheck_all) {
            if (e.emp_id != emp_id) {
              // add detail
              if (courseCheck) {
                this.New_row_byEmp(e.emp_id, Data1, Img_data);
              }
              var el = Data2[ 0 ];
              e.action_change = 'true';
              e.search_air_ticket = el.search_air_ticket;
              e.ask_booking = el.ask_booking;
              e.as_company_recommend = el.as_company_recommend;
              e.already_booked = el.already_booked;
              e.additional_request = el.additional_request;
              e.already_booked_id = el.already_booked_id;
              e.already_booked_other = el.already_booked_other;
              e.booking_ref = el.booking_ref;
              e.booking_status = el.booking_status;
            }
          } else {
            ds_person_selected.forEach((el) => {
              if (e.emp_id == el.emp_id) {
                if (courseCheck) {
                  this.New_row_byEmp(e.emp_id, Data1, Img_data);
                }
                var el = Data2[ 0 ];
                e.action_change = 'true';
                e.search_air_ticket = el.search_air_ticket;
                e.ask_booking = el.ask_booking;
                e.as_company_recommend = el.as_company_recommend;
                e.already_booked = el.already_booked;
                e.additional_request = el.additional_request;
                e.already_booked_id = el.already_booked_id;
                e.already_booked_other = el.already_booked_other;
                e.booking_ref = el.booking_ref;
                e.booking_status = el.booking_status;
              }
            });
          }
        });

        this.alerts.toastr_warning('Please Save Data');
        this.modalRef.hide();
        //??  update emp_id หลังจาก copy
        if (bcheck_all) {
          let emp_id_Selected = this.emp_id;
          let emp_list = this.air_ticket_emplist;
          let Lebgth_emp_list = this.air_ticket_emplist.length;
          let empIndex = this.air_ticket_emplist.findIndex(({emp_id}) => emp_id === emp_id_Selected);
          if (Lebgth_emp_list - 1 === empIndex) {
            empIndex = 0;
          } else {
            empIndex += 1;
          }
          const {emp_id} = emp_list[ empIndex ];
          this.topping_selected = emp_list[ empIndex ];
          this.emp_id = emp_id;
        } else {
          if (ds_person_selected.length > 0) {
            let emp_id_Selected = ds_person_selected.at(-1);
            this.topping_selected = emp_id_Selected;
            const {emp_id} = emp_id_Selected;
            this.emp_id = emp_id;
          }
        }
        //??  update emp_id หลังจาก copy
        const doc_id = this.doc_id;
        this.Appmain.userSelected = this.emp_id;
        this.userDetail = this.UserDetail[ 0 ];
        this.TrackingStatus = {...InitTrackStatus};
        this.airticket_copy_selected = '1';
        this.User_selected_Copy = [];
      } else {
      }
      //คือค่าข้อมูล ใน modal
      console.log('Out put');
      console.log(this.air_ticket_body);
      console.log(this.booking_detail);
    });
  }

  AuthAdmin(data) {
    let userSelected = this.Appmain.userSelected;
    const emp_list = data.emp_list;
    if (userSelected) {
      let findIndex = data.emp_list.findIndex(({emp_id}) => emp_id === userSelected);
      if (findIndex > -1) {
        this.emp_id = userSelected;
        this.topping_selected = emp_list[ findIndex ];
      }
    } else {
      this.topping_selected = emp_list[ 0 ];
      this.emp_id = data.emp_list[ 0 ].emp_id;
      this.Appmain.userSelected = this.emp_id;
    }
    if ('show_button' in this.topping_selected) {
      this.user_reject = this.topping_selected.show_button;
      if (this.topping_selected.status_trip_cancelled === 'true') {
        this.user_reject = false;
      }
    } else {
      // this.user_reject = false;
    }
    // this.user_reject = true;
  }
  fileterbookdetail() {
    var obj = this.stage;
    var dt = this.air_ticket_body;
    var ds = this.booking_detail;
    if (dt.length < 1) {
      return [];
    }
    this.Log(obj);
    this.select_row_airticket = dt.findIndex((v) => {
      return v.id == obj.row_id && v.emp_id == obj.emp_id;
    });
    this.selected_bookdetail = ds.findIndex((v) => {
      return v.emp_id == obj.emp_id;
    });
  }
  clearselect(name, i) {
    // console.log(name)
    // let select_data = this.maindata_all;
    let select_data = this.booking_detail[ i ];
    if (select_data.already_booked) {
      select_data.ask_booking = false;
      select_data.search_air_ticket = false;
      select_data.as_company_recommend = false;
    } else {
      if (name != '' && name != undefined) {
        if (name == 'search_air_ticket') {
          if (select_data.search_air_ticket) {
            this.search_flights();
            // $('#opmodal').click()
            select_data.as_company_recommend = false;
          }
        } else {
          if (select_data.as_company_recommend) {
            select_data.search_air_ticket = false;
          }

          //this.maindata_all.as_company_recommend = true;
        }
      }
    }
  }
  convert_bool(val) {
    if (val === 'true') {
      return true;
    } else {
      if (val === '') {
        return false;
      } else {
        return false;
      }
    }
  }
  def_data(data, action) {
    data.after_trip.opt1 = null;
    data.after_trip.opt2.status = null;
    data.after_trip.opt3.status = null;

    this.booking_detail = data.airticket_booking;
    this.maindata_all = data;
    if (action === 0 || action === 1) {
      data.airticket_booking.forEach((el) => {
        el.search_air_ticket = this.convert_bool(el.search_air_ticket);
        el.ask_booking = this.convert_bool(el.ask_booking);
        el.as_company_recommend = this.convert_bool(el.as_company_recommend);
        el.already_booked = this.convert_bool(el.already_booked);
      });
      if (this.air_ticket_emplist.length < 1) {
        this.air_ticket_emplist = data.emp_list;
      }
    } else {
    }
    if (this.air_ticket_emplist) {
      this.air_ticket_emplist.forEach((e) => {
        if (e.mail_status == 'true') {
          // this.topping_selected = e;
        }
      });
    }

    this.DOC_DETAIL = {...data};
    //this.air_ticket_body = data.airticket_detail;
    this.Log(this.DOC_DETAIL);
    console.log(data.airticket_booking);
    this.bookingX = data.airticket_booking;
    this.userDetail = this.UserDetail[ 0 ];
  }

  seleced_index_booking() {
    const ik = this.get_index_airticket(this.booking_detail, this.emp_id);

    if (ik > -1) {
      this.selected_key_booking = ik;
      return true;
    }
    return false;
  }
  setbackdrop() {
    $('.modal-backdrop').css({'z-index': 700});
  }
  onKeyDown(event) {
    var check_user = this.Appmain.profile.username;
    var def_user = 'nitinai';

    if (check_user.toLowerCase().includes(def_user)) {
      // console.log(event)
      if (event.key == '9') {
        this.user_admin = !this.user_admin;

        //this.alerts.toastr_sucess("Upload file complete.");
      }
      if (event.key == '8') {
        this.user_reject = !this.user_reject;
      }
    }
  }

  user_display;
  Onload(bool, useradd?) {
    this.Appmain.isLoading = true;

    const onSuccess = (data) => {
      console.log('--- Load Data ---');
      // Province / City / Location :
      // Country / City  :
      console.log(this.Appmain);
      let TravelTypeDoc = /local/g.test(this.Appmain.TRAVEL_TYPE);
      this.TRAVEL_TYPE = TravelTypeDoc ? 'Province/City/Location :' : 'Country / City  :';
      console.log(data);
      this.Appmain.userSelected;
      this.air_ticket_body = data.airticket_detail;
      let userSelected = this.Appmain.userSelected;

      if (bool == undefined) {
        if (data.user_admin == true) {
          this.user_admin = true;
          this.AuthAdmin(data);
        }
      }
      //this.user_admin = false;
      this.doc_id = data.doc_id;

      //ใช้เช็ค  user status= reject
      if (data.emp_list[ 0 ].hasOwnProperty('show_button')) {
        // this.user_reject = data.emp_list[0].show_button;
      } else {
        this.user_reject = false;
      }

      this.model.request_type.list = data.m_book_type;
      this.def_data(data, 0);
      this.onloadOld_data();
      if (data.user_admin === false) {
        //@ts-ignore
        // const { profile } = this.Appmain.appHeader;
        console.log('profile');
        const profile = this.profile[ 0 ];
        console.log(profile);
        let finduser = data.emp_list.find(({emp_id}) => emp_id === profile.empId);
        this.topping_selected = finduser ? finduser : data.emp_list[ 0 ];
        this.emp_id = profile.empId;
        this.user_display = profile.empName;
        this.user_admin = false;
        if (finduser) {
          this.user_reject = finduser.show_button;
          if (finduser.status_trip_cancelled === 'true') {
            this.user_reject = false;
          }
        } else {
          this.user_reject = false; //ปืด fnc การกรอกข้อมูล
          //?? เช็คว่าเป็น requesterรึป่าว
          //todo finduser ถ้าไม่มีใน  emplist = undefined
          if ('user_request' in data && data.user_request === true) {
            let userSelected = this.Appmain.userSelected;
            this.user_reject = false;
            this.user_admin = true;
            if (userSelected) {
              this.emp_id = this.Appmain.userSelected;
              let finduser = data.emp_list.find(({emp_id}) => emp_id === this.emp_id);
              this.topping_selected = finduser ? finduser : data.emp_list[ 0 ];
            } else {
              this.emp_id = data.emp_list[ 0 ].emp_id;
              this.Appmain.userSelected = data.emp_list[ 0 ].emp_id;
            }
          }
        }
      }
      this.Appmain.isLoading = false;
      if (bool === '') {
        this.alerts.swal_sucess('Successfully canceled');
      }
    };

    var bodyX = {
      token_login: localStorage[ 'token' ],
      doc_id: this.doc_id,
    };

    this.Log(bodyX);
    this.ws.callWs(bodyX, 'LoadAirTicket').subscribe(
      (data) => onSuccess(data),
      (error) => (this.Appmain.isLoading = false),
      () => {
        if (typeof this.air_ticket_body == 'object') {
          this.air_ticket_body.forEach((val) => {
            val[ 'airticket_route' ] = val[ 'airticket_route_from' ] + ' - ' + val[ 'airticket_route_to' ];
            if (val[ 'airticket_date' ] != '' && val[ 'airticket_date' ] != null) {
              let datestr = this.convert_dateYMD(val[ 'airticket_date' ]);
              const date = new Date(datestr);
              val[ 'airticket_date_type' ] = date;
            }
          });
          this.booking_detail_data = true;
        }
      }
    );
  }
  get empCount(): boolean {
    const {air_ticket_emplist: emp_list} = this;
    const emp_id = this.emp_id;
    const CheckData = emp_list.length === 1;
    return CheckData;
  }
  btnCencel_Onclick() {
    this.alerts.swal_confrim('Do you want to cancel the document ?', '', 'question').then((val) => {
      if (val.isConfirmed == true) {
        this.Onload('', '');
      } else {
      }
    });
  }

  get_data_img(ds) {
    if (ds.length < 1) {
      return [];
    }

    var dt = ds.filter((v) => v.emp_id == this.emp_id);
    return dt;
  }
  Log(txt: any) {
    console.log(txt);
  }

  s_condition(action_type, emp_id_ds, item?) {
    if (action_type == 'delete') {
      return true;
    }
    if (item.filename == '' || item.filename == null) {
      return true;
    }

    return false;
  }

  get_data() {
    var dt = this.air_ticket_body;
    let findemp = null;
    try {
      findemp = this.air_ticket_emplist.find(({emp_id}) => emp_id === this.emp_id);
    } catch (ex) { }
    if (dt.length == 0 || !findemp) {
      return [];
    }

    dt = this.air_ticket_body.filter((val) => {
      return val.action_type != 'delete' && val.emp_id == this.emp_id;
    });

    if (dt.length < 1) {
      this.new_row('', this.doc_id, false);
    }
    const sortby = (a, b) => (+a.id) - (+b.id);
    if (dt && dt.length > 0) {
      const ds = dt[ 0 ];
      if ("id" in ds) {
        dt = dt.sort(sortby)

      }
    }
    return dt;
  }

  search_flights() {
    /*  */
    window.open('https://www.google.com/flights');
  }
  border_table(index: any) {
    var irow = this.air_ticket_header.length - 1;
    if (irow == index) {
      return true;
    } else {
      return false;
    }
  }
  get_emp_cur(token?): string {
    return this.emp_id;
  }

  new_row(id, doc_id, type_check?) {
    var dt = this.air_ticket_body;
    if (dt.length == 0) {
      return;
    }
    var token_cur = this.maindata_all.token_login;
    var emp_id = this.get_emp_cur(token_cur);
    var last_id = this.air_ticket_body
      .filter((v) => {
        return v.emp_id == emp_id;
      })
      .sort((a, b) => {
        return a.id - b.id;
      });

    var len = last_id.length <= 1 ? 0 : last_id.length - 1;
    let irows: number = parseInt(last_id[ len ].id);
    var i = irows + 1;
    dt.push({
      doc_id: doc_id,
      emp_id: emp_id,
      id: i.toString(),
      airticket_date: null,
      airticket_date_type: null,
      airticket_route: null,
      airticket_route_from: null,
      airticket_route_to: null,
      airticket_flight: null,
      airticket_departure_time: null,
      airticket_arrival_time: null,
      airticket_departure_date: '',
      airticket_arrival_date: '',
      action_type: 'insert',
      action_change: 'true',
    });
    this.air_ticket_body = dt;
    if (type_check != false) {
      this.alerts.toastr_sucess('Add Airticket');
    }
  }

  del_row(seq, doc_id) {
    this.alerts.swal_confrim_delete('').then((val) => {
      if (val.isConfirmed == true) {
        var dt = this.air_ticket_body;
        var emp_id = this.get_emp_cur('xxx');
        var index = dt.findIndex((i) => {
          return i.id == seq && i.emp_id == emp_id;
        });
        dt[ index ].action_type = 'delete';
        dt[ index ].action_change = 'true';
        this.air_ticket_status_delete.push(dt[ index ]);
        this.Log(this.air_ticket_body);

        var icheck = dt.filter((val) => {
          return val.action_type != 'delete' && val.emp_id == emp_id;
        });
        if (icheck.length < 1) {
          this.new_row(seq, doc_id, false);
        }
      } else {
        return;
      }
    });
  }

  displayop(action_type, type_button, index) {
    var dt = this.air_ticket_body;
    dt.filter((val) => {
      return val.action_type != 'delete';
    });
    if (type_button == 'add') {
      if (index == dt.length - 1) {
        return;
      } else {
        return 'd-none';
      }
    } else {
    }
  }

  Delete_File(item) {
    //debugger;
    console.log(this.DOC_DETAIL.img_list);
    this.alerts.swal_confrim_delete('Do you want to delete the file?').then((val) => {
      if (val.isConfirmed) {
        //debugger;
        var i = this.get_index_airticket_by_row(this.DOC_DETAIL.img_list, item.emp_id, item.id);
        this.DOC_DETAIL.img_list[ i ].action_type = 'delete';
        this.DOC_DETAIL.img_list[ i ].action_change = 'true';
        this.alerts.toastr_warning('Please Save Data');
      } else {
        return;
      }
    });
  }

  files: any[];
  onFileSelect(event) {
    //debugger;
    this.selectedFile = <File>event.target.files[ 0 ];
    console.log(this.selectedFile);
    if (this.selectedFile == undefined) {
      this.selectedFile = null;
      $('#file_id').val('');
      this.files = [];
      return;
      //console.log(this.selectedFile);
      //$("#file_id").val('');
    } else {
      this.files = [];
      this.uploadFile();
      //console.log(this.selectedFile);
    }
  }

  uploadFile() {
    //debugger;
    this.Appmain.isLoading = true;

    const onSuccess = (res) => {
      this.Appmain.isLoading = false;
      this.Log(res);
      //let status_res = res.after_trip;

      //if (status_res.opt1 == "true") {
      //debugger;
      this.alerts.toastr_warning('Please Save Data');
      var max_i = parseInt(this.getMax(this.DOC_DETAIL.img_list, 'id').id);
      res.img_list.id = max_i + 1;
      this.DOC_DETAIL.img_list.push(res.img_list);
      console.log(res);
      console.log(this.DOC_DETAIL.img_list);
      //this.Log(this.DOC_DETAIL);
      //} else {
      //  this.alerts.swal_error(status_res.opt2.status);
      //}
      this.selectedFile = null;
      $('#file_id').val('');
    };

    this.fileuploadservice
      .postFilePhase2(this.selectedFile, this.doc_id, this.pagename, this.emp_id, localStorage[ 'token' ])
      .subscribe(
        (res) => onSuccess(res),
        (error) => {
          this.Appmain.isLoading = false;
          this.Log(error);
          alert('error!');
        }
      );
  }

  msgSAVE(item) {
    let msg = '';
    if (item) {
      if (
        item.airticket_route_from === '' ||
        (typeof item.airticket_route_from === 'object' && item.airticket_route_from.length === 0)
      ) {
        msg = 'Route Data Invalid';
      } else if (
        item.airticket_route_to === '' ||
        (typeof item.airticket_route_to === 'object' && item.airticket_route_to.length === 0)
      ) {
        msg = 'Route Data Invalid';
      } else if (item.airticket_flight === '') {
        msg = 'Flight Data Invalid';
      } else if (item.Datefrom === '') {
        msg = 'Departure date Invalid';
      } else if (item.Dateto === '') {
        msg = 'Departure date Invalid';
      } else if (item.airticket_departure_time === '') {
        msg = 'Departure Time Data Invalid';
      } else if (item.airticket_arrival_time === '') {
        msg = 'Departure Time Data Invalid';
      }
    }
    return msg;
  }

  Onsave(btn_type) {
    //debugger
    this.Appmain.isLoading = true;
    const convert_dateYMD = function (val) {
      var montF = new DatePipe('en-US');
      var objdate = montF.transform(val, 'yyyy-MM-dd');
      return objdate;
    };

    if (btn_type == 'saved') {
      btn_type = 'save';
    }
    if (btn_type == 'save' || btn_type == 'submit') {
      let data_d: any;

      var dt = this.air_ticket_body;
      var dt_status_del = this.air_ticket_status_delete;
      data_d = dt;

      var x = {...data_d};
      this.maindata_all.airticket_detail = dt;
      this.maindata_all.data_type = btn_type;
      console.log('air_ticket_body');
      console.log(dt);
      this.Log(x);

      this.maindata_all.airticket_booking = this.booking_detail;
      var bodyX = this.maindata_all;
      console.log('bodyX');
      console.log(bodyX);

      var check_id = this.topping_selected.emp_id;
      var StatusSave = [],
        irow = 0;

      console.log('bodyXxxLlL');
      console.log(bodyX.airticket_detail);

      var result_data = bodyX.airticket_detail.filter((word) => word.emp_id == check_id);
      var result_booking: any[] = bodyX.airticket_booking.filter(
        (word) => word.emp_id == check_id && word.action_type != 'delete'
      );

      result_data = result_data.filter((word) => word.action_type != 'delete');
      // "ask_booking": "false",
      // "search_air_ticket": "false",
      // "as_company_recommend": "false",
      let checkAlreadyB = false;
      if (result_booking.length > 0) {
        const {ask_booking, already_booked} = result_booking[ 0 ];
        checkAlreadyB = already_booked === 'false' || already_booked === false || already_booked === '';
      }
      let userTraveler = this.user_admin === false;
      console.log(result_data, 'result_data');
      let SaveState = true;
      if (btn_type == 'submit') {
        // if (userTraveler && checkAlreadyB) {
        if (checkAlreadyB) {
        } else {
          //?? check detail
          for (let [ i, e ] of result_data.entries()) {
            let TextReWaring = this.msgSAVE(e);
            StatusSave[ 0 ] = false;
            if (TextReWaring == '') {
              StatusSave[ 0 ] = true;
            } else {
              this.Appmain.isLoading = false;
              SaveState = false;
              this.alerts.swal_warning('Please check the ' + TextReWaring);
              break;
            }
          }
          //?? check detail
          //@ts-ignore
          if (SaveState === false) {
            return;
          }
          //?? check Booking
          result_booking.forEach((e) => {
            if (e.emp_id == check_id) {
              if (e.already_booked == true || e.already_booked == 'true' || !e.already_booked) {
                var TextReWaring = '';
                if (e.booking_status == '' || e.booking_status == null) {
                  TextReWaring = 'Booking Status Data Invalid';
                }

                StatusSave[ irow ] = false;
                if (TextReWaring == '') {
                  StatusSave[ irow ] = true;
                } else {
                  this.Appmain.isLoading = false;
                  this.alerts.swal_warning('Please check the ' + TextReWaring);
                }

                irow++;
                return StatusSave;
              }
            }
          });
          //?? check Booking

          StatusSave.forEach((x) => {
            if (x == false) {
              SaveState = false;
            }
          });
          //@ts-ignore
          if (SaveState === false) {
            return;
          }
        }
      } else {
        SaveState = true;
      }

      var emp_idX = this.emp_id;
      var ConfremSubmit = '';
      if (btn_type == 'submit') {
        //?? รอ user confrime เมื่อ bookingstatus : confrimed แล้วจะต้องมีไฟล์แนบเสมอถึงจะ submit ได้
        // let checkFile = this.fileByUser;
        // !checkFile && this.alerts.swal_warning(`Please upload E-Ticket`);
        // if (!checkFile) {
        //   this.Appmain.isLoading = false;
        //   return;
        // }
        //?? รอ user confrime เมื่อ bookingstatus : confrimed แล้วจะต้องมีไฟล์แนบเสมอถึงจะ submit ได้

        this.booking_detail.forEach((e) => {
          if (e.emp_id == this.emp_id) {
            if (e.data_type_allowance == 'true') {
              ConfremSubmit = 'If the data is submitted, the allowance page will be reset';
            } else {
              ConfremSubmit = 'Do you want to submit the document ?';
            }
          }
        });
      } else {
        ConfremSubmit = 'Do you want to save the document ?';
      }

      if (SaveState) {
        this.alerts.swal_confrim_changes(ConfremSubmit).then((val) => {
          if (val.isConfirmed == true) {
            //debugger;
            const OnsaveSucecss = (data) => {
              this.TrackingStatus = {...InitTrackStatus};

              console.log('save');
              console.log(data);

              if (data.after_trip.opt1 == 'true') {
                if (data.after_trip.opt2.status != '') {
                  if (btn_type === 'saved') {
                    data.after_trip.opt2.status = 'Successfully saved';
                  }
                  if (btn_type === 'submit') {
                    data.after_trip.opt2.status = 'Successfully submit';
                  }
                }
                this.alerts.swal_sucess(data.after_trip.opt2.status);

                data.data_type = null;
                this.maindata_all = data;
                this.air_ticket_body = this.maindata_all.airticket_detail;
                this.air_ticket_body.forEach(function (e) {
                  if (typeof e === 'object') {
                    var d1, d2;
                    if (e.airticket_departure_date == '') {
                      d1 = '';
                    } else {
                      d1 = new Date(e.airticket_departure_date);
                      d1.setHours(12);
                    }
                    if (e.airticket_arrival_date == '') {
                      d2 = '';
                    } else {
                      d2 = new Date(e.airticket_arrival_date);
                      d2.setHours(12);
                    }

                    function formatDate(date) {
                      var d = new Date(date),
                        month = '' + (d.getMonth() + 1),
                        day = '' + (d.getDate() + 1),
                        year = d.getFullYear();

                      if (month.length < 2) month = '0' + month;
                      if (day.length < 2) day = '0' + day;

                      return [ year, month, day ].join('-');
                    }
                    var xdate1 = formatDate(e.airticket_departure_date).toString();
                    var xdate2 = formatDate(e.airticket_arrival_date).toString();

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

                    e[ 'Datefrom' ] = d1;
                    e[ 'Dateto' ] = d2;
                  }
                });

                try {
                  var find_index = this.get_index_airticket(data.emp_list, this.emp_id);
                  if (data.emp_list[ find_index ].hasOwnProperty('show_button')) {
                    this.user_reject = data.emp_list[ find_index ].show_button;
                  } else {
                    this.user_reject = false;
                  }
                } catch (err) {
                  console.log(err);
                }

                this.def_data(data, 1);
              } else {
                this.alerts.swal_error(data.after_trip.opt2.status);
              }

              console.log(this.air_ticket_emplist);
              this.Appmain.isLoading = false;
            };

            bodyX.airticket_detail.forEach((e) => {
              if (typeof e.airticket_route_from === 'object') {
                e.airticket_route_from = '';
              }
              if (typeof e.airticket_route_to === 'object') {
                e.airticket_route_to = '';
              }
            });

            var already_bookedX;
            let bookingS = this.bookingX;
            bookingS.forEach((e) => {
              if (emp_idX == e.emp_id) {
                if (e.already_booked == true || e.already_booked == 'true') {
                  if (e.booking_status == '' || e.booking_status == null) {
                    already_bookedX = true;
                  } else {
                    already_bookedX = false;
                  }
                } else {
                  already_bookedX = false;
                }
              }
              e.action_change = 'true';
              /* e.already_booked = e.already_booked.toString();
              e.as_company_recommend = e.as_company_recommend.toString();
              e.ask_booking = e.ask_booking.toString();
              e.search_air_ticket = e.search_air_ticket.toString(); */

              if (btn_type == 'submit') {
                if (e.emp_id == emp_idX) {
                  e.data_type = 'submit';
                } else {
                  e.data_type = 'save';
                }
              }
            });

            if (already_bookedX == true) {
              this.Appmain.isLoading = false;
              this.alerts.swal_warning('Please Select Booking Status');
              return;
            }

            //!! update MAILSTATUS
            this.air_ticket_emplist.forEach((item) => {
              if (this.emp_id === item.emp_id) {
                item.mail_status = 'true';
              } else {
                item.mail_status = 'false';
              }
            });
            //!!update MAILSTATUS
            bodyX.airticket_booking = bookingS;
            bodyX.emp_list = this.air_ticket_emplist;

            bodyX.airticket_detail.forEach((e) => {
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
              let day3 = e.airticket_date;
              let day4 = e.airticket_date_type;

              if (day1 != '') {
                if (typeof e.Datefrom === 'object') {
                  e.airticket_departure_date = datePlusday4(day1);
                } else {
                  e.airticket_departure_date = e.airticket_departure_date;
                }
              }

              if (day2 != '') {
                if (typeof e.Dateto === 'object') {
                  e.airticket_arrival_date = datePlusday4(day2);
                } else {
                  e.airticket_arrival_date = e.airticket_arrival_date;
                }
              }

              if (day3 != '') {
                if (typeof e.airticket_date === 'object') {
                  e.airticket_date = datePlusday4(day3);
                } else {
                  e.airticket_date = e.airticket_date;
                }
              }

              if (day3 != '') {
                if (typeof e.airticket_date_type === 'object') {
                  e.airticket_date_type = datePlusday4(day4);
                } else {
                  e.airticket_date_type = e.airticket_date_type;
                }
              }
            });
            const imgList = [ ...this.DOC_DETAIL.img_list ];
            console.log(CloneDeep(imgList), 'CloneDeep');

            bodyX.img_list = imgList.filter(({filename, path}) => filename !== '' && path);
            console.log('bodyX before save');
            console.log(CloneDeep(bodyX), 'CloneDeep');
            // console.log(CloneDeep(this.DOC_DETAIL.img_list), 'CloneDeep');
            this.ws.callWs(bodyX, 'SaveAirTicket').subscribe(
              (res) => OnsaveSucecss(res),
              (error) => console.log(error)
            );
          } else {
            this.Appmain.isLoading = false;
            return;
          }
        });
      } else {
        this.Appmain.isLoading = false;
        return;
      }
    }
  }

  set_modal() {
    $('.modal-backdrop').css({'z-index': 700});
    $('.modal').css({'z-index': 800});
  }
  openModalx(template: TemplateRef<any>, modal_id) {
    var dataAir = this.air_ticket_body.filter((word) => word.id == modal_id);

    var drop1 = dataAir[ 0 ].airticket_route_from;
    var drop2 = dataAir[ 0 ].airticket_route_to;

    var xairport_new1 = this.TestAirnewMt.filter((word) => word.id == drop1);
    var xairport_new2 = this.TestAirnewMt.filter((word) => word.id == drop2);
    this.airport_new1 = xairport_new1[ 0 ];
    this.airport_new2 = xairport_new2[ 0 ];
    this.tp_clone = template;
    let config: object = {
      class: 'modal-lg',
      animated: true,
      keyboard: false,
      ignoreBackdropClick: true,
    };
    this.modalRef = this.modalService.show(template, config);
    this.open_modal_id = modal_id;
    $('.modal-backdrop').css({'z-index': 700});
    $('.modal').css({'z-index': 800});
  }

  country_modelDT1 = {
    config: {
      displayFn: (item: any) => {
        return '';
      },
      displayKey: 'new_display',
      search: true,
      //limitTo: 10,
      //moreText: 'more',
      height: '250px',
      width: '250px',
      clearOnSelection: false,
    },
  };

  country_modelDT2 = {
    config: {
      displayKey: 'new_display',
      search: true,
      //limitTo: 1000,
      height: '250px',
      width: '250px',
      clearOnSelection: false,
    },
  };

  province_modelDT1 = {
    config: {
      displayKey: 'name',
      search: true,
      //limitTo: 1000,
      height: '250px',
      width: '250px',
      clearOnSelection: false,
    },
  };

  province_modelDT2 = {
    config: {
      displayKey: 'name',
      search: true,
      //limitTo: 1000,
      height: '250px',
      width: '250px',
      clearOnSelection: false,
    },
  };

  open_modal_id = '';
  airport_new1 = [];
  airport_new2 = [];
  master_airport_new_arr = [];
  master_airport_new_arrXX = [];
  TestAirnewMt = [];
  TitleFromx = 'Oversea';
  loadMasterAir() {
    this.Appmain.isLoading = true;
    let bodyX = {
      token_login: 'b8a27da5-c587-405d-8a45-20e39c98e5ce',
      page_name: 'airport',
      module_name: 'master airport',
    };

    const onSuccess = (data): void => {
      console.log(' --- // loadMasterAir // ---');
      console.log(data);
      console.log(' --- // Travel Type // ---');
      console.log(this.TRAVEL_TYPE_OL);

      this.TRAVEL_TYPE_DROPDOWN = true;
      this.master_airport_new_arr = data.master_airport;
      console.log(data);
      this.TestAirnewMt = data.master_airport;
      var ThaiCounty = this.TestAirnewMt.filter((word) => word.city_name == 'Thailand');
      if (this.TRAVEL_TYPE_OL != 'oversea' && this.TRAVEL_TYPE_OL != 'overseatraining') {
        this.TestAirnewMt = ThaiCounty;
        this.TitleFromx = 'Local';
      }
      this.TestAirnewMt.forEach((e) => {
        e[ 'new_display' ] = e.city_name + ', ' + e.county_name + ' - ' + e.name + ' - ' + e.airport_code;
      });

      this.TestAirnewMt.sort(function (a, b) {
        if (a.city_name < b.city_name) {
          return -1;
        }
        if (a.city_name > b.city_name) {
          return 1;
        }
        return 0;
      });

      console.log(this.TestAirnewMt);
      this.Onload(undefined, undefined);
      //this.onloadOld_data();
      //this.Masterlocation();
    };

    this.ws.callWs(bodyX, 'LoadMasterData').subscribe(
      (data) => onSuccess(data),
      (error) => {
        console.log(error);
      }
    );
  }

  Masterlocation() {
    this.Appmain.isLoading = true;
    let bodyX = {
      token_login: 'b8a27da5-c587-405d-8a45-20e39c98e5ce',
      page_name: 'mtvisacountries',
      module_name: 'master location',
    };

    const onSuccess = (data): void => {
      console.log(' // Master location // ');
      console.log(data);
      this.Appmain.isLoading = false;
      if (this.TRAVEL_TYPE_OL != 'oversea') {
        this.TestAirnewMt = data.master_province;
      }
      console.log(this.TestAirnewMt);
      /* this.zone_select = data.master_zone;
      this.country_select = data.master_country;
      this.county_new_arr  = data.master_country; */
    };

    this.ws.callWs(bodyX, 'LoadMasterData').subscribe(
      (data) => onSuccess(data),
      (error) => {
        this.Appmain.isLoading = false;
        console.log(error);
      }
    );
  }

  datax(data) {
    return data;
  }

  filterF(event) {
    console.log(event);
  }

  filter_transform(items, searchText) {
    searchText = searchText.toLocaleLowerCase();
    return items.filter((it) => {
      return (
        it.name.toLocaleLowerCase().includes(searchText) || it.description.toLocaleLowerCase().includes(searchText)
      );
    });
  }

  selectionChanged(event) {
    console.log(event);
  }

  destroyedChanged(event, typee) {
    console.log(event);
  }

  add_route() {
    console.log(this.maindata_all.airticket_detail);
    var eid = this.open_modal_id;

    var drop1 = this.airport_new1;
    var drop2 = this.airport_new2;

    try {
      var air1, air2;
      if (drop1 === undefined) {
        air1 = [];
      } else {
        air1 = this.airport_new1[ 'id' ];
        if (air1 == '' || air1 == 'undefined' || air1 == null) {
          air1 = [];
        }
      }
      if (drop2 === undefined) {
        air2 = [];
      } else {
        air2 = this.airport_new2[ 'id' ];
        if (air2 == '' || air2 == 'undefined' || air2 == null) {
          air2 = [];
        }
      }

      this.maindata_all.airticket_detail.forEach((e) => {
        if (e.id == eid) {
          e.action_change = 'true';
          e.airticket_route_from = air1;
          e.airticket_route_to = air2;
        }
      });

      this.alerts.toastr_sucess('Add Route Sucess');
      this.airport_new1 = [];
      this.airport_new2 = [];
      this.modalRef.hide();
    } catch (err) { }

    this.modalRef.hide();
  }

  disble_modalRef() {
    this.airport_new1 = [];
    this.airport_new2 = [];
    this.modalRef.hide();
  }

  show_rout(i_id, typeX) {
    try {
      this.maindata_all.airticket_detail = this.air_ticket_body;
      //var dt = this.maindata_all.airticket_detail.filter(word => word.id == i_id);
      var re, tx1, tx2;

      /* if (typeX == "0") {
        re = this.TestAirnewMt.filter(word => word.id == dt[0].airticket_route_from);
      } else {
        re = this.TestAirnewMt.filter(word => word.id == dt[0].airticket_route_to);
      } */

      re = this.TestAirnewMt.filter((word) => word.id == i_id);

      if (this.TRAVEL_TYPE_DROPDOWN == true) {
        return re[ 0 ].county_name + ', ' + re[ 0 ].name;
      } else {
        return re[ 0 ].name;
      }
    } catch (err) {
      return '';
    }

    //return i_id;
  }

  setcssWidth() {
    /* try {
      const $elemft = $(".ngx-dropdown-container .ngx-dropdown-button");
      $elemft[0].style.setProperty('color','yellow','!important');
      $elemft[1].style.setProperty('background-color','yellow','!important');
 
    } catch (err) {
 
    }  */

    try {
      const $elem = $('.ngx-dropdown-container .ngx-dropdown-list-container');
      //$elem[0].style.setProperty('color','yellow', '!important');
      $elem[ 0 ].style.setProperty('min-width', '100%', 'important');
      $elem[ 1 ].style.setProperty('max-width', '450px', 'important');
      //$elem[1].style.setProperty('max-height', '20px', 'important');
      //$elem[2].style.setProperty('color','yellow', '!important');
    } catch (err) { }
  }

  checkValues(val) {
    console.log(val);
  }

  changModelXTime(id, val, typeX) {
    console.log('Select Time');
    var now = new Date();
    var hr = now.getHours();
    var min = now.getMinutes();

    var minstr = min.toString();
    if (parseInt(minstr) < 10) {
      minstr = '0' + minstr;
    }
    var hr_str;
    if (parseInt(hr.toString()) < 10) {
      hr_str = '0' + hr;
    } else {
      hr_str = hr;
    }

    console.log('values');
    console.log(val);
    console.log(hr_str + ':' + min);

    if (val == null || val == '') {
      this.air_ticket_body.forEach((e) => {
        if (e.id == id) {
          e.action_change = 'true';
          if (typeX == '0') {
            e.airticket_departure_time = hr_str + ':' + minstr;
          } else {
            e.airticket_arrival_time = hr_str + ':' + minstr;
          }
        }
      });
    }
  }

  functionX(values) {
    console.log(values);
  }

  order_by_list(arr) {
    var re = arr;
    re.sort(function (a, b) {
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

  displayX(arr_display) {
    try {
      return arr_display.new_display;
    } catch (err) {
      return '';
    }
  }

  min_max_date(index, type_date, val_date) {
    var dt = this.air_ticket_body;

    if (dt.length == 0) {
      return [];
    }

    dt = this.air_ticket_body.filter((val) => {
      return val.action_type != 'delete' && val.emp_id == this.emp_id;
    });

    //debugger;
    if (type_date == 'from') {
      if (index == 0) {
        return;
      }
      {
        return dt[ index - 1 ].Dateto;
      }
    } else {
      if (index == 0) {
        return val_date;
      } else {
        if (val_date != null && val_date != '') {
          return val_date;
        } else {
          return dt[ index - 1 ].Dateto;
        }
      }
    }
  }
}
