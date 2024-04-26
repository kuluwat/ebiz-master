import {HttpClient} from '@angular/common/http';
import {Component, OnInit, forwardRef, Inject, TemplateRef, ViewChild, ElementRef} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import { FileuploadserviceService } from '../../../../ws/fileuploadservice/fileuploadservice.service';
import { AspxserviceService } from '../../../../ws/httpx/aspxservice.service';
import {MasterComponent} from '../../master.component';
import {DatePipe} from '@angular/common';
import * as fs from 'file-saver';
import { AlertServiceService } from '../../../../services/AlertService/alert-service.service';
import {fromEvent, interval, Observable, of, pipe, Subscription} from 'rxjs';
import { InitTrackStatus, TrackingStatus } from '../../../../model/localstorage.model';
import {getBoolean, useAuth} from '../../accommodation/accommodation/accommodation.component';
import { MainComponent } from '../../../../components/main/main.component';
declare var $: any;
declare var toastr: any;
type IUserDetail = {
  token_login: string;
  doc_id: string;
  emp_id: string;
  id: string;
  doc_status_id: string;
  doc_status_text: string;
  user_admin: boolean;
  show_button: boolean;
  titlename: string;
  firstname: string;
  lastname: string;
  age?: any;
  org_unit?: any;
  userDisplay: string;
  userName: string;
  division: string;
  idNum: string;
  userEmail: string;
  userPhone: string;
  userTel: string;
  userCompany: string;
  userPosition: string;
  userGender: string;
  userJoinDate: string;
  dateOfDeparture: string;
  isEdit: boolean;
  imgpath: string;
  imgprofilename: string;
  passportno: string;
  dateofissue: string;
  dateofbirth: string;
  dateofexpire: string;
  passport_img: string;
  passport_img_name: string;
  travel_topic: string;
  travel_topic_sub: string;
  business_date: string;
  travel_date: string;
  country_city: string;
  continent_id: string;
  country_id: string;
  gl_account: string;
  cost_center: string;
  io_wbs: string;
  remark?: any;
  mail_status: string;
  mail_remark?: any;
  type_send_to_broker?: any;
  send_to_sap: string;
  traveler_emp?: any;
};

@Component({
  selector: 'app-passport',
  templateUrl: './passport.component.html',
  styleUrls: [ './passport.component.css' ],
})
export class PassportComponent implements OnInit {
  action_stage = {
    action_save: 'savepassport',
    action_load: 'loadpassport',
    action_load_doc: 'LoadDoc',
  };
  validator_check: boolean = false;
  vaildator_save: boolean = false;
  TrackingStatus: TrackingStatus = {...InitTrackStatus};
  model_all = {
    token_login: 'ssssxx',
    doc_id: 'D001',
    data_type: null,
    pdpa_wording: '',
    id: '1',
    user_admin: false,
    passport_detail: [],
    emp_list: [],
    img_list: [
      {
        doc_id: 'OB20120006',
        emp_id: '00000910',
        id: '15',
        path: 'http://TBKC-DAPPS-05.thaioil.localnet/ebiz_ws/Image/OB20110006/passport/00000910/',
        filename: 'foreignpassportrus.jpg',
        pagename: 'passport',
        actionname: '',
        status: null,
        modified_date: '',
        modified_by: '2eecea1d-16f8-4c25-b27b-40a2077ed116',
        action_type: 'update',
        active_type: 'false',
        action_change: 'false',
        id_level_1: '78',
        id_level_2: '',
      },
    ],
    after_trip: {
      opt1: null,
      opt2: {status: null, remark: null},
      opt3: {status: null, remark: null},
    },
  };

  pdpa_wording: string = `We may also oolleot information how the Servioe is aooessed and used ("Usage Data").
  This Usage Data may inolude information suoh as your oomputer's Internet Protoool
  address (e.g. IP address), browser type, browser version, the pages of our Servioe that you
  visit, the time and date of your visit, the time spent on those pages, unique devioe identifiers
  and other diagnostio data. We use oookies and similar traoking teohnologies to traok the
  aotivity on our Servioe and hold oertain information.
  Cookies are files with small amount of data whioh may inolude an anonymous unique
  identifier. Cookies are sent to your browser from a website and stored on your devioe.
  Traoking teohnologies also used are beaoons, tags, and soripts to oolleot and traok
  information and to improve and analyze our Servioe.`;

  pdpa_wordingtest: string = `I'm allow the company to collect, use, and process all the information filled in Business Service System. I have acknowledged that I could update the information on the system at anytime.

  I have already read, understand, and accept all of the conditions mentioned above
  
  
  ------------------------------------------
  
  ข้าพเจ้ายินยอมให้บริษัทเก็บรวบรวม ใช้ และประมวลผลข้อมูลทั้งหมดที่ได้กรอกในระบบ E-Business Travel Service โดยข้าพเจ้าทราบว่า ข้าพเจ้าสามารถแก้ไขข้อมูลของข้าพเจ้าได้ทุกเมื่อในระบบ
  
  ข้าพเจ้าได้อ่าน รับทราบ เข้าใจ และยอมรับเงื่อนไขข้างต้นทุกประการ`;
  model_all_def = {
    token_login: 'ssssxx',
    doc_id: 'D001',
    data_type: null,
    id: '1',
    passport_detail: [
      {
        doc_id: 'D001',
        emp_id: 'TO102155',
        id: '1',
        passport_no: 'AA5437854',
        passport_date_issue: '06 OCT 2015',
        passport_date_expire: '07 OCT 2020',
        passport_title: 'MISS',
        passport_name: 'JAIJAI',
        passport_surname: 'MATAMMAI',
        passport_date_birth: '06 OCT 1994',
        action_type: 'update',
        accept_type: false,
      },
    ],
    emp_list: [
      {
        token_login: 'ssssxx',
        doc_id: null,
        emp_id: null,
        id: '1',
        user_admin: false,
        titlename: 'Mr.',
        firstname: 'Attaphon',
        lastname: 'Sodsarn',
        userDisplay: 'Mr. Attaphon Sodsarn',
        userName: '',
        division: 'PMSV/PMVP/EVPO',
        idNum: 'D001',
        userEmail: 'zattaphonso@thaioilgroup.com',
        userPhone: '02-777-6666',
        userTel: '092-777-6666',
        isEdit: false,
        passportno: 'AA5437854',
        dateofissue: '06 OCT 2015',
        dateofbirth: '06 OCT 1994',
        imgpath: 'assets/filedata/profile/zattaphonso/',
        imgprofilename: 'avatar-m-1.png',
        travel_topic: null,
        travel_topic_sub: null,
        business_date: null,
        travel_date: null,
        country_city: null,
        traveler_emp: [],
        arrTraveler: [
          {
            doc_id: null,
            emp_id: null,
            id: null,
            seq: '1',
            country: 'Singapore',
            icon: 'plane',
            datefrom: '05/18',
            dateto: '24/20',
          },
          {
            doc_id: null,
            emp_id: null,
            id: null,
            seq: '2',
            country: 'USA',
            icon: 'plane',
            datefrom: '05/18',
            dateto: '24/20',
          },
        ],
      },
      {
        token_login: 'ssssxx',
        doc_id: null,
        emp_id: null,
        id: '2',
        user_admin: false,
        titlename: 'Mr.',
        firstname: 'Niti',
        lastname: 'ADB-Thailand',
        userDisplay: 'Mr. Niti ADB-Thailand',
        userName: '',
        division: 'PMSV/PMVP/EVPO',
        idNum: 'D001',
        userEmail: 'zNiti@thaioilgroup.com',
        userPhone: '02-777-6666',
        userTel: '092-777-6666',
        isEdit: false,
        passportno: 'AA5437854',
        dateofissue: '06 OCT 2015',
        dateofbirth: '06 OCT 1994',
        imgpath: 'assets/filedata/profile/zattaphonso/',
        imgprofilename: 'avatar-m-1.png',
        travel_topic: null,
        travel_topic_sub: null,
        business_date: null,
        travel_date: null,
        country_city: null,
        traveler_emp: [],
        arrTraveler: [
          {
            doc_id: null,
            emp_id: null,
            id: null,
            seq: '1',
            country: 'Singapore',
            icon: 'plane',
            datefrom: '05/18',
            dateto: '24/20',
          },
          {
            doc_id: null,
            emp_id: null,
            id: null,
            seq: '2',
            country: 'USA',
            icon: 'plane',
            datefrom: '05/18',
            dateto: '24/20',
          },
        ],
      },
    ],
    img_list: [
      {
        doc_id: 'OB20120006',
        emp_id: '00000910',
        id: '15',
        path: 'http://TBKC-DAPPS-05.thaioil.localnet/ebiz_ws/Image/OB20110006/passport/00000910/',
        filename: 'foreignpassportrus.jpg',
        pagename: 'passport',
        actionname: '',
        status: null,
        modified_date: '',
        modified_by: '2eecea1d-16f8-4c25-b27b-40a2077ed116',
        action_type: 'update',
        action_change: 'false',
      },
    ],
    after_trip: {
      opt1: null,
      opt2: {status: null, remark: null},
      opt3: {status: null, remark: null},
    },
  };
  accept_id: any = '';
  frmHandle = {
    IsEdit: 'insert',
    accept_type: false,
    action_change: 'false',
    action_type: 'insert',
    default_action_change: 'false',
    default_type: '',
    default_type_bool: false,
    passport_date_birth: '',
    passport_date_birth_type: null,
    passport_date_expire: '',
    passport_date_expire_type: null,
    passport_date_issue: '',
    passport_date_issue_type: null,
    passport_name: '',
    passport_no: '',
    passport_surname: '',
    passport_title: '',
    user_id: null,
    img_def: [],
  };
  afterNewpassport = {
    IsEdit: 'insert',
    accept_type: false,
    action_change: 'false',
    action_type: 'insert',
    default_action_change: 'false',
    default_type: '',
    default_type_bool: false,
    passport_date_birth: '',
    passport_date_birth_type: null,
    passport_date_expire: '',
    passport_date_expire_type: null,
    passport_date_issue: '',
    passport_date_issue_type: null,
    passport_name: '',
    passport_no: '',
    passport_surname: '',
    passport_title: '',
    user_id: null,
    img_def: [],
  };

  userDetail: IUserDetail | null = null;
  frmHandle_Edit = {};
  @ViewChild('btntopPage', {static: true}) btntopPage: ElementRef | null = null;
  accept_true: boolean = false;
  doc_id: any;
  pagename = 'passport';
  emp_id: any;
  selectfile: File | null = null;
  tp_clone: TemplateRef<any>;
  modalRef: BsModalRef;
  list_emp: string;
  isOpen: boolean = false;
  typeLoad: boolean = true;
  currentDate: Date = new Date();
  personer;
  personal_name;
  pathPhase1: any;
  TRAVEL_TYPE: string;
  profile: any;
  user_reject: boolean = true;
  user_admin: boolean;
  isCanceled: boolean;
  constructor(
    @Inject(forwardRef(() => MainComponent)) private appMain: MainComponent,
    @Inject(forwardRef(() => MasterComponent)) private Appmain: MasterComponent,
    private modalService: BsModalService,
    private http: HttpClient,
    private ws: AspxserviceService,
    private fileuploadservice: FileuploadserviceService,
    public alerts: AlertServiceService
  ) { }
  // template_Edit_passport
  @ViewChild('template_Edit_passport', {static: true}) template_Edit_passport: TemplateRef<any>;
  @ViewChild('templatePDPA', {static: true}) templatePDPA: TemplateRef<any>;
  ngOnInit() {
    console.clear();
    console.log(this.Appmain);
    this.personer = this.Appmain.DOC_ID;

    this.doc_id = this.Appmain.DOC_ID;
    this.OnloadDoc();
    this.Onload();
  }
  get docStatus() {
    return (Status: number) => {
      let emp_id = this.emp_id;
      let id: number = 1;
      if (this.model_all.emp_list.length > 0) {
        // TEST
        // this.emp_list.forEach((i) => (i.doc_status_id = '2'));
        let dt = this.model_all.emp_list.find((item) => item.emp_id === emp_id);
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
  get UserDetail() {
    const emp_list = this.model_all.emp_list.filter((item) => item.emp_id === this.emp_id);
    if (emp_list.length > 0 && emp_list[ 0 ].hasOwnProperty('show_button')) {
      // this.user_reject = emp_list[0].show_button;
      if (emp_list[ 0 ].status_trip_cancelled === 'true') {
        this.user_reject = false;
      }
    } else {
      this.user_reject = false;
    }

    return emp_list;
  }
  onKeyDown(event) {
    var check_user = this.Appmain.profile.username;
    var def_user = 'nitinai';

    if (check_user.toLowerCase().includes(def_user)) {
      if (event.key == '9') {
        this.model_all.user_admin = !this.model_all.user_admin;
      }
      if (event.key == '8') {
        //this.user_reject = !this.user_reject
      }
    }
  }
  downloadFile(url, filename) {
    let Regex = /.[A-Za-z]{3}$/;
    //let fullurl = url.match(Regex);
    //let fileType = fullurl[0];
    let file_name = filename;
    fs.saveAs(url, file_name);
  }

  openModal(template: TemplateRef<any>, type?, dr?, size = 'lg') {
    this.tp_clone = template;
    let config: object = {
      class: 'modal-lg',
      animated: true,
      keyboard: false,
      ignoreBackdropClick: true,
    };
    if (type == 'new_passport') {
      this.vaildator_save = false;
      let dsemp = this.model_all.passport_detail.filter((res) => {
        return res.emp_id == this.emp_id;
      })[ 0 ];
      this.frmHandle.passport_name = dsemp.passport_name;
      this.frmHandle.passport_surname = dsemp.passport_surname;
      this.frmHandle.passport_title = dsemp.passport_title;
    }
    if (type == 'edit_passport') {
      let dsemp_img = this.model_all.img_list.filter((res) => {
        return res.emp_id == this.emp_id && res[ 'id_level_1' ] == dr.id && res.action_type != 'delete';
      });
      this.frmHandle = {...dr};
      this.frmHandle[ 'img_def' ] = [];
      if (dsemp_img.length > 0) {
        this.frmHandle[ 'img_def' ][ 0 ] = dsemp_img[ 0 ];
      }
      this.frmHandle_Edit = dr;
      this.frmHandle.IsEdit = 'insert';
    }
    this.modalRef = this.modalService.show(template, config);

    // var configx = $('#modal-test').closest('.modal-content').addClass('rounded-20').addClass('border-blue border-2');
    var configx = $('#modal-test').closest('.modal-content');
  }

  topFunction() {
    document.body.scrollTop = 80;
    document.documentElement.scrollTop = 80;
  }

  get StatusPassport() {
    return (item: any) => {
      let bcheck = item.IsEdit === 'update' && this.user_reject;
      return !bcheck;
    };
  }
  actionInput(dr) {
    let check_no_passport = this.Check_Passport_number(dr, 'edit');
    if (check_no_passport) {
      dr.passport_no = '';
      return;
    }
  }
  uploadFile(ev, passport_detail_id, type?) {
    this.Appmain.isLoading = true;
    //File
    //console.log(this.selectfile, + '  /'+this.doc_id + '  /', this.pagename + '  /', this.emp_id);

    this.selectfile = <File>ev.target.files[ 0 ];
    let Jsond = {
      file: this.selectfile,
      doc_id: this.doc_id,
      pagename: this.pagename,
      emp_id: this.emp_id,
      file_token_login: localStorage[ 'token' ],
    };

    const onSuccess = (res) => {
      this.Appmain.isLoading = false;
      console.log(res);
      res.img_list.id_level_1 = passport_detail_id;
      let status_res = res.after_trip;

      if (status_res.opt1 == 'true') {
        // this.alerts.swal_sucess(status_res.opt2.status);

        // อัพเดตตีวเก่าก่อน -> push ตัวใหม่เข้าไปเพื่อให้อัพเดตตัวใหม่
        if (type == 'addpassport' || type == 'editpassport') {
          this.frmHandle.img_def[ 0 ] = res.img_list;
        } else {
          try {
            this.model_all.img_list.forEach((res) => {
              if (
                res.emp_id == this.emp_id &&
                res[ 'id_level_1' ] == passport_detail_id &&
                (res.action_type == 'insert' || res.action_type == 'update')
              ) {
                res[ 'action_change' ] = 'true';
                res.action_type = 'delete';
              }
            });
            console.log('res.img_list --');
            console.log(res.img_list);
            let idIMG = this.model_all.img_list.map(({id}) => +id);
            let maxID = Math.max(...idIMG);
            res.img_list.id = maxID + 1;
            res.img_list.actionname = '';
            if (!res.img_list.active_type) {
              res.img_list.active_type = "true";
            }

            if (res.img_list.doc_id === 'personal') {
              res.img_list.doc_id = this.doc_id;
            }
            this.model_all.img_list.push(res.img_list);
          } catch (ex) {
            console.log(ex.toString());
          }
          //กรณีที่ หลังบ้านแก้ยาก เปิด function นี้
          // this.OnsaveUpload();
          this.alerts.toastr_warning('Please Save Data');
        }
      } else {
        this.alerts.swal_error(status_res.opt2.status);
      }
      this.selectfile = null;
      ev.target.value = null;
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

  deleteimgallrow() {
    this.model_all.img_list.forEach((e) => {
      e.action_type = 'delete';
      e.action_change = 'true';
    });
  }

  Delete_Passport(item) {
    var obj = item;
    var empby_ds = this.model_all.passport_detail;
    this.alerts.swal_confrim_delete('').then((val) => {
      if (val.isConfirmed == true) {
        let bcheck = empby_ds.filter((res) => res.emp_id == this.emp_id && res.action_type != 'delete');
        if (bcheck.length == 1) {
          //item.action_type = "delete";
          item.passport_no = '';
          item.action_change = 'true';
          item.default_action_change = 'true';
          item.passport_date_expire_type = '';
          item.passport_date_expire = '';
          item.passport_date_issue_type = '';
          item.passport_date_issue = '';
          item.passport_date_birth_type = '';
          item.passport_date_birth = '';
          item.IsEdit = 'update';
        } else {
          item.action_type = 'delete';
          item.default_action_change = 'true';
          item.action_change = 'true';
        }

        this.model_all.img_list.forEach((res) => {
          if (res[ 'id_level_1' ] == item.id) {
            res[ 'action_change' ] = 'true';
            res[ 'action_type' ] = 'delete';
          }
        });

        if (bcheck.length == 0) {
          //add_passport
          //let dsemp =  this.get_data_by_emp(this.model_all.passport_detail)[0];
          let dsemp = this.model_all.passport_detail.filter((res) => {
            return res.emp_id == this.emp_id;
          })[ 0 ];

          this.frmHandle.passport_name = dsemp.passport_name;
          this.frmHandle.passport_surname = dsemp.passport_surname;
          this.frmHandle.passport_title = dsemp.passport_title;
          this.Add_Passport_NULL_DATA(this.frmHandle);
        }
      }
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
  async ConfrimSave() {
    try {
      // const actionSave = await this.alerts.swal_confrim_changes('Do you want to save the document ?');
      // if (actionSave.isConfirmed) {
      //   this.OnsaveAll('saved');
      //   // this.Onsave('saved','','');
      // } else {
      //   return;
      // }
      this.OnsaveAll('saved');
    } catch (ex) {
      console.log(ex);
    }
  }
  update_userByDOC(VLAUE, select) {
    // - ต้องแยก 2 กรณีเนื่องจาก admin สามารถทำได้หลายคนพร้อมกัน
    // EX เข้ามาทำรายการใหม่แล้ว เปลียน user แต่ยังไม่ save ข้อมูล กดกลับมาคนเดิมยังคงต้องเก็นข้อมูลเก่า
    var emp_old = this.emp_id;
    var newvalue = select.value;
    var status = this.model_all.passport_detail.filter((res) => {
      return this.emp_id == res.emp_id && res.action_change == 'true';
    });
    if (status.length > 0) {
      this.alerts.swal_confrim_changes('').then((val) => {
        //เช็คเมื่อ user  เปลียนข้อมูลโดยเมื่อมีการเปลียนแปลงข้อมูล
        if (val.isConfirmed == true) {
          var bcheck = false;
          var statusSAVE = true;
          // var status_save = this.Onsave('saved', '', '');
          var status_save = this.OnsaveAll('saved');
          this.model_all.passport_detail.forEach((res) => {
            if (res.emp_id === this.emp_id) {
              if (status_save != true) {
                //save sucess
                if (res.action_type == 'insert') {
                  res.IsEdit = res.action_type;
                } else if (res.action_type == 'update') {
                  res.IsEdit = res.action_type;
                }
              } else {
                // validator true
                bcheck = true;
              }
            }
          });

          if (bcheck) {
            this.vaildator_save = true;
            this.list_emp = this.emp_id;
          } else {
            this.emp_id = newvalue;
          }
        }
        // กรณี cancel
        else {
          this.Onload_def();
          this.emp_id = newvalue;
          this.vaildator_save = false;
          this.validator_check = false;
        }
      });
    }
    //กรณีไม่อัพเดตข้อมูล
    else {
      this.emp_id = newvalue;
      this.vaildator_save = false;
      this.validator_check = false;
    }

    this.Appmain.userSelected = this.emp_id;
    this.userDetail = this.UserDetail[ 0 ];
    this.TrackingStatus = {...InitTrackStatus};
  }

  updatedata(index, ev, fidle) {
    var emp_id = this.emp_id;
    var dt = this.model_all.passport_detail;
    var ikey = dt.findIndex((v) => {
      return v.emp_id == emp_id && v.id == index.id;
    });

    if (ikey > -1) {
      var parser = this.convert_dateDMY(ev, 'dd MMM yyyy');
      let hasProps = `${fidle}_type` in this.model_all.passport_detail[ ikey ];
      console.clear();
      if (hasProps) {
        // const IDate:Date = new Date(this.model_all.passport_detail[ikey][`${fidle}_type`])
        console.log(this.model_all.passport_detail[ ikey ][ `${fidle}_type` ]);
      }
      this.model_all.passport_detail[ ikey ][ fidle ] = parser;
      this.model_all.passport_detail[ ikey ][ 'action_change' ] = 'true';
    }
  }

  updatedatafrmhandle(index, ev, fidle) {
    var emp_id = this.emp_id;
    var dt = this.model_all.passport_detail;
    var ikey = dt.findIndex((v) => {
      return v.emp_id == emp_id;
    });

    if (ikey > -1) {
      var parser = this.convert_dateDMY(ev, 'dd MMM yyyy');
      this.frmHandle[ fidle ] = parser;
      //this.frmHandle["action_change"] = "true";
    }
  }

  def_detail() {
    this.model_all.emp_list.forEach((el) => {
      var search = this.model_all.passport_detail.findIndex((v) => {
        return v.emp_id == el.emp_id;
      });

      if (search < 0) {
        var empby_ds = this.model_all.passport_detail;
        var empby_id = empby_ds.filter((res) => {
          return res.emp_id === el.emp_id;
        });
        var max_id: any;
        if (empby_id.length < 1) {
          max_id = '1';
          //  (parseInt(max_id)+1).toString()
        } else {
          //empby_id = empby_id.sort((a,b) => {return a.id - b.id})
          var imax_row = empby_id.length <= 1 ? 0 : empby_id.length - 1;
          var max_id: any;
          var max_id_find: any = empby_id[ imax_row ];

          try {
            max_id = (parseInt(max_id_find.id) + 1).toString();
          } catch (ex) {
            console.log('error_id');
          }
        }

        var obj = {
          action_type: 'insert',
          accept_type: false,
          action_change: 'false',
          doc_id: this.doc_id,
          emp_id: el.emp_id,
          id: max_id,
          passport_date_birth: null,
          passport_date_expire: null,
          passport_date_issue: null,
          passport_name: el.firstname,
          passport_no: el.passportno,
          passport_surname: el.lastname,
          passport_title: el.titlename,
        };
        this.model_all.passport_detail.push(obj);
      }
    });
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
    this.ws.callWs(BodyX, this.action_stage.action_load_doc).subscribe(
      onSuccess,
      (error) => console.log(error),
      () => { }
    );
  }
  Onload() {
    this.Appmain.isLoading = true;
    const onSuccess = (data) => {
      this.Appmain.isLoading = false;
      //ขาด เช็ค  user emp_id
      var user_cur = data.emp_list[ 0 ];
      console.log('First Load Data');
      console.log(data);

      this.doc_id = data.doc_id;
      //this.emp_id = "TO102155";
      this.emp_id = user_cur.emp_id;
      this.personal_name = user_cur.userDisplay;
      // data.user_admin == true ? (this.list_emp = user_cur.emp_id) : '';
      if (data.user_admin) {
        let userSelect = this.Appmain.userSelected;
        const {emp_id, userSelected, status_trip_cancelled} = useAuth(data, userSelect);
        this.list_emp = emp_id;
        this.emp_id = emp_id;
        this.Appmain.userSelected = userSelected;
        this.user_reject = getBoolean(status_trip_cancelled) ? false : true;
        this.user_admin = true;
      } else {
        //@ts-ignore
        const {profile} = {profile: this.profile[ 0 ]};
        this.user_admin = false;
        this.user_reject = true;
        // console.log(profile);
        this.list_emp = profile.empId;
        user_cur = profile;
        this.emp_id = profile.empId;
        let finduser = data.emp_list.find(({emp_id}) => emp_id === profile.empId);
        finduser && (this.user_reject = getBoolean(finduser.status_trip_cancelled) ? false : true);
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
        console.log(user_cur);
        // this.model_all.user_display = user_cur.username;
      }
      //this.model_all.passport_detail = data.passport_detail.filter((res,i,ds) => { i == 0});
      this.def_data(data);
      this.userDetail = this.UserDetail[ 0 ];
      // this.openModal()
    };

    var BodyX = {
      token_login: localStorage[ 'token' ],
      doc_id: this.doc_id,
    };
    console.log({...BodyX});
    this.ws.callWs(BodyX, this.action_stage.action_load).subscribe(
      (data) => onSuccess(data),
      (error) => (this.Appmain.isLoading = false),
      () => {
        var dt = this.model_all.img_list;
        // this.model_all.img_list = dt.filter((res, i, ds) => {
        //   res.filename != null "";
        // });
        this.def_detail();
      }
    );
  }

  btnCencel_Onclick() {
    this.alerts.swal_confrim('Do you want to cancel the document ?', '', 'question').then((val) => {
      if (val.isConfirmed == true) {
        this.isCanceled = true;
        this.Onload_def();
      } else {
      }
    });
  }

  Onload_def(item?) {
    this.alerts;
    this.Appmain.isLoading = true;
    var BodyX = {
      token_login: localStorage[ 'token' ],
      doc_id: this.doc_id,
    };
    const onSuccess = (data) => {
      this.Appmain.isLoading = false;
      //ขาด เช็ค  user emp_id

      this.doc_id = data.doc_id;

      data.user_admin == true ? (this.list_emp = this.emp_id) : '';

      this.def_data(data);
      if (this.isCanceled === true) {
        this.isCanceled = false;
        this.alerts.swal_sucess('Successfully canceled');
      }
    };
    this.ws.callWs(BodyX, this.action_stage.action_load).subscribe(
      (data) => onSuccess(data),
      (error) => (this.Appmain.isLoading = false),
      () => {
        var dt = this.model_all.img_list;

        this.def_detail();
      }
    );
  }

  clone_data(item) {
    item.item_old = {...item};
    //console.log(item)
  }

  get_data_by_emp_user(ds) {
    if (ds.length < 1) {
      return [];
    }
    var dt = ds.filter((res) => {
      return res.emp_id == this.emp_id;
    });
    if (dt.length > 0) {
      return dt[ 0 ].userDisplay;
    } else {
      return '';
    }
  }

  get_data_by_emp(ds) {
    if (ds.length < 1) {
      return [];
    }

    var dt = ds.filter((res) => {
      return res.emp_id == this.emp_id && res.action_type != 'delete';
    });

    if (dt.length > 1) {
      dt = dt.sort((a, b) => a.sort_by - b.sort_by);
      return dt;
    } else {
      if (dt.length == 1) {
        dt = dt.sort((a, b) => a.sort_by - b.sort_by);
        dt[ 0 ].default_type_bool = true;
        dt[ 0 ].default_type = 'true';
        dt[ 0 ][ 'panel' ] = true;
      }
      //alert('1') ;
      return dt;
    }
  }

  get_data_by_passport_new() {
    let dsemp = this.model_all.emp_list.filter((res) => {
      return res.emp_id == this.emp_id;
    })[ 0 ];
    this.frmHandle.passport_name = dsemp.firstname;
    this.frmHandle.passport_surname = dsemp.lastname;
    this.frmHandle.passport_title = dsemp.titlename;
    return this.frmHandle;
  }

  get_data_passport_by_id(ds, id) {
    let ikey = ds.findIndex((res) => {
      return res.id == id && this.emp_id == res.emp_id && res.action_type != 'delete';
    });
    return ikey;
  }

  convert_dateDMY(str, format?) {
    var dt = new Date(str);

    var montF = new DatePipe('en-US');

    return montF.transform(dt, format);
  }

  hide_modal(btn_cancle, update) {
    if (btn_cancle != '' && btn_cancle != 'new_passport' && btn_cancle != 'Accept') {
      // btn_cancle.click();
      this.modalRef.hide();
    }

    if (this.model_all.user_admin) {
    }
    if (btn_cancle == 'new_passport') {
      this.vaildator_save = false;
      this.frmHandle = {...this.afterNewpassport};
      this.modalRef.hide();
    } else {
      if (btn_cancle == 'Accept') {
        this.modalRef.hide();
        // (click)="ConfrimSave()"
        this.ConfrimSave();
        // this.openModal(this.template_Edit_passport, 'edit_passport', update);
      }
      this.modalRef.hide();
    }
  }

  def_data(data, oldData?) {
    console.log(data);
    console.log(oldData);
    this.setActive(data);
    data.after_trip.opt1 = null;
    data.after_trip.opt2.status = null;
    data.after_trip.opt3.status = null;
    if (oldData) {
      for (let detail of data.passport_detail) {
        const {id: detailID, emp_id: detailemp} = detail;
        const findPanel = oldData.find(({id, emp_id}) => detailID == id && emp_id === detailemp);
        if (findPanel) {
          detail[ 'panel' ] = findPanel.panel;
        }
      }
    }
    this.add_column(data.passport_detail);
    this.model_all = data;

    this.model_all_def = {...data};
    this.pdpa_wording = data.pdpa_wording ? data.pdpa_wording : this.pdpa_wording;
    console.log(this.model_all);
    console.log('=>> def data old ');
    console.log(this.model_all_def);
  }

  setActive(ds) {
    const {passport_detail} = ds;
    const checkCountRow = passport_detail.some((item) => item.default_type === 'true');
    const findActive = passport_detail.filter((item) => item.default_type === 'true');
    const OtherActive = passport_detail.filter((item) => item.default_type !== 'true');
    if (checkCountRow) {
      ds.passport_detail = [ ...findActive, ...OtherActive ];
      ds.passport_detail.forEach((item, i) => {
        item.sort_by = i + 1;
      });
      ds.passport_detail.sort((a, b) => a.sort_by - b.sort_by);
    }
  }
  add_column(ds) {
    ds.forEach((el) => {
      if (el.hasOwnProperty('item_old')) {
        //el["Item_old"] = "";
      } else {
        el[ 'item_old' ] = {};
      }
      if (el.hasOwnProperty('panel')) {
        // el['panel'] = false;
      } else {
        el[ 'panel' ] = false;
      }

      if (el[ 'accept_type' ] == null || '') {
        el[ 'accept_type' ] = false;
      }
      if (el[ 'passport_date_issue' ] == null || el[ 'passport_date_issue' ] == '') {
        el[ 'passport_date_issue_type' ] = null;
      } else {
        el[ 'passport_date_issue_type' ] = new Date(this.convert_dateDMY(el[ 'passport_date_issue' ], 'yyyy-MM-dd'));
      }
      if (el[ 'passport_date_expire' ] == null || el[ 'passport_date_expire' ] == '') {
        el[ 'passport_date_expire_type' ] = null;
      } else {
        el[ 'passport_date_expire_type' ] = new Date(this.convert_dateDMY(el[ 'passport_date_expire' ], 'yyyy-MM-dd'));
      }
      if (el[ 'passport_date_birth' ] == null || el[ 'passport_date_birth' ] == '') {
        el[ 'passport_date_birth_type' ] = null;
      } else {
        el[ 'passport_date_birth_type' ] = new Date(this.convert_dateDMY(el[ 'passport_date_birth' ], 'yyyy-MM-dd'));
      }
      if (el.hasOwnProperty('action_type')) {
        if (el[ 'action_type' ] == null || el[ 'action_type' ] == '') {
        } else {
          if (el.hasOwnProperty('IsEdit')) {
            if (el[ 'IsEdit' ] == 'update') {
              //el["IsEdit"] = "update";
            }
          } else {
            if (el[ 'action_type' ] == 'insert') {
              // el["IsEdit"] = "insert";
              el[ 'IsEdit' ] = 'update';
            } else {
              el[ 'IsEdit' ] = 'update';
            }
          }
        }
      }
      if (el.hasOwnProperty('default_type')) {
        if (el[ 'default_type' ] == null || el[ 'default_type' ] == '') {
          el[ 'default_type_bool' ] = false;
        } else {
          if (el[ 'default_type' ] == 'true') {
            el[ 'default_type_bool' ] = true;
          } else {
            el[ 'default_type_bool' ] = false;
            // el['action_change'] = "false";
          }
        }
      }
    });

    console.log('X ROW TO ds');
    console.log(ds);
  }

  check_el(el) {
    return this.vaildator_save && !this.validator_check && el.invalid;
  }
  Change_Passport(dr) {
    if (this.frmValidator(dr, 'editpassport') == false) {
      this.vaildator_save = true;
      this.appMain.showMessage('Need to input value * ');
      return true;
    } else {
      var dt = this.model_all.passport_detail;

      if (dt.length == 0) {
        return;
      }
      let check_no_passport = this.Check_Passport_number(dr, 'edit');
      if (check_no_passport) {
        return;
      }
      var doc_id = this.doc_id;
      var emp_id = this.emp_id;
      if (this.frmHandle.img_def.length > 0) {
        this.Add_ImgDeatil(this.frmHandle.img_def, this.frmHandle_Edit[ 'id' ], 'edit');
      }
      delete this.frmHandle.img_def;

      let irow = this.get_data_passport_by_id(this.model_all.passport_detail, dr.id);
      this.frmHandle.IsEdit = 'update';
      this.frmHandle.action_change = 'true';
      this.frmHandle.default_action_change = 'true';
      this.model_all.passport_detail[ irow ] = this.frmHandle;

      console.log(this.model_all);
      this.frmHandle = {...this.afterNewpassport};
      this.hide_modal('new_passport', '');
    }
  }

  Add_Passport(dr) {
    debugger;
    this.model_all.passport_detail;

    if (this.frmValidator(dr, 'addpassport') == false) {
      this.vaildator_save = true;
      this.appMain.showMessage('Need to input value * ');
      return true;
    } else {
      this.vaildator_save = false;

      var dt = this.model_all.passport_detail;

      if (dt.length == 0) {
        return;
      }
      dt.forEach((e) => {
        if (e.emp_id == this.emp_id) {
          e.default_type = 'false';
          e.action_change = 'true';
          e.default_action_change = false;
        }
      });
      let check_no_passport = this.Check_Passport_number(dr, 'add');
      if (check_no_passport) {
        return;
      }
      var doc_id = this.doc_id;
      var emp_id = this.emp_id;
      var last_id = dt
        .map((mx) => parseInt(mx.id))
        .sort((a, b) => {
          return a - b;
        });

      var len = last_id.length <= 1 ? 0 : last_id.length - 1;
      let irows: number = parseInt(last_id[ len ].toString());
      var i = irows + 1;
      dt.push({
        IsEdit: 'update',
        panel: true,
        accept_type: false,
        action_change: 'true',
        action_type: 'insert',
        default_type: 'true',
        default_action_change: true,
        doc_id: doc_id,
        emp_id: emp_id,
        id: i,
        passport_date_birth: dr.passport_date_birth,
        passport_date_expire: dr.passport_date_expire,
        passport_date_issue: dr.passport_date_issue,
        passport_name: dr.passport_name,
        passport_no: dr.passport_no,
        passport_surname: dr.passport_surname,
        passport_title: dr.passport_title,
        sort_by: '1',
        user_id: null,
      });

      var xrow = 2;
      var xrowTrue = 1;
      for (let i in dt) {
        if (dt[ i ].default_type == 'true') {
          dt[ i ].sort_by = xrowTrue.toString();
        } else {
          dt[ i ].sort_by = xrow.toString();
        }
        xrow++;
      }
      console.log('X ROW');
      console.log(dt);
      console.log(this.model_all.passport_detail);
      this.Add_ImgDeatil(this.frmHandle.img_def, i);
      this.add_column(dt);
      console.log('X ROW ADDCOLUMN');
      console.log(dt);
      this.frmHandle = {...this.afterNewpassport};
      this.alerts.toastr_sucess('Add Passport');
      this.hide_modal('new_passport', '');
    }
  }

  Add_ImgDeatil(drimg, passport_detail_id, type?) {
    if (drimg.length > 0) {
      if (type == 'edit') {
        try {
          this.model_all.img_list.forEach((res) => {
            if (
              res.emp_id == this.emp_id &&
              res[ 'id_level_1' ] == passport_detail_id &&
              (res.action_type == 'insert' || res.action_type == 'update')
            ) {
              res[ 'action_change' ] = 'true';
              res.action_type = 'delete';
            }
          });
          drimg[ 0 ][ 'id_level_1' ] = passport_detail_id;
          this.model_all.img_list.push(drimg[ 0 ]);
          //console.log(this.model_all);
        } catch (ex) {
          console.log(ex.toString());
        }
        this.alerts.toastr_warning('Please Save Data');
      } else {
        drimg[ 0 ][ 'id_level_1' ] = passport_detail_id;
        this.model_all.img_list.push(drimg[ 0 ]);
      }
    }
  }
  CheckImg_Edit(drimg, passport_detail_id) {
    this.model_all.img_list.forEach((res) => {
      if (
        res.emp_id == this.emp_id &&
        res[ 'id_level_1' ] == passport_detail_id &&
        (res.action_type == 'insert' || res.action_type == 'update')
      ) {
        res[ 'action_change' ] = 'true';
        res.action_type = 'delete';
      }
    });
    drimg = [];
  }
  Check_Passport_number(dr, type?): boolean {
    let dt = this.model_all.passport_detail;
    let bheck = false;
    let current_detail = [];
    if (type == 'edit') {
      current_detail = dt.filter(
        (res) =>
          res.emp_id == this.emp_id &&
          dr.passport_no.trim().toLowerCase() == res.passport_no.trim().toLowerCase() &&
          res.action_type != 'delete' &&
          res.id != dr.id
      );
    } else {
      current_detail = dt.filter(
        (res) =>
          res.emp_id == this.emp_id &&
          dr.passport_no.trim().toLowerCase() == res.passport_no.trim().toLowerCase() &&
          res.action_type != 'delete'
      );
    }
    if (current_detail.length > 0) {
      bheck = true;
      this.appMain.showMessage('Passport No. Duplicate ');
    }
    return bheck;
  }
  //กรณีลบข้อมูลแล้วไม่มีข้อมูลอื่นที่เป็น insert,update
  Add_Passport_NULL_DATA(dr) {
    if (true) {
      this.vaildator_save = false;

      var dt = this.model_all.passport_detail;
      if (dt.length == 0) {
        return;
      }

      var doc_id = this.doc_id;
      var emp_id = this.emp_id;
      var last_id = dt
        .map((mx) => parseInt(mx.id))
        .sort((a, b) => {
          return a - b;
        });

      var len = last_id.length <= 1 ? 0 : last_id.length - 1;
      let irows: number = parseInt(last_id[ len ].toString());
      var i = irows + 1;
      dt.unshift({
        IsEdit: 'insert',
        accept_type: false,
        action_change: 'true',
        action_type: 'insert',
        default_type: '',
        doc_id: doc_id,
        emp_id: emp_id,
        id: i,
        passport_date_birth: dr.passport_date_birth,
        passport_date_expire: dr.passport_date_expire,
        passport_date_issue: dr.passport_date_issue,
        passport_name: dr.passport_name,
        passport_no: dr.passport_no,
        passport_surname: dr.passport_surname,
        passport_title: dr.passport_title,
        sort_by: '1',
        user_id: null,
      });
      var xrow = 1;
      for (let i in dt) {
        // if (dt[i].emp_id == this.emp_id) {

        // }
        dt[ i ].sort_by = xrow.toString();
        xrow++;
      }
      this.add_column(dt);
      this.frmHandle = {...this.afterNewpassport};
      // this.topFunction();
      this.alerts.toastr_sucess('New Passport');
    }
  }

  // function แบบ กด active แล้วขึ้นไปเป็นอันแรก
  Sort_by_passport2(ds, dr) {
    let i_index = ds.findIndex((res) => res.id == dr.id);
    let old_data = [ ds[ i_index ] ];
    let new_data = ds.filter((val, i) => i != i_index);
    let emp_id = this.emp_id;
    if (new_data.length > 0) {
      new_data.forEach((el) => {
        old_data.push(el);
      });
      let irow = 1;
      old_data.forEach((res) => {
        if (emp_id == res.emp_id) {
          if (res.id == dr.id) {
            if (res.default_type_bool == 'false' || res.default_type_bool == false) {
              res.default_type = 'false';
            } else {
              res.default_type = 'true';
            }
            res.default_action_change = 'true';
            res.action_change = 'true';
          } else {
            res.default_type = 'false';
            res.IsEdit = 'update';
            res.default_action_change = 'true';
            res.action_change = 'true';
          }
        }
        res.sort_by = irow.toString();
        irow++;
      });
      this.add_column(old_data);
      ds = old_data;
      // console.log(ds)
      // this.btntopPage
      this.btntopPage.nativeElement.click();
    }
    //ds.splice()
  }
  Sort_by_passport(ds, dr) {
    let old_data = ds;
    let emp_id = this.emp_id;
    if (old_data.length > 0) {
      // let irow = 1;
      old_data.forEach((res) => {
        if (emp_id == res.emp_id) {
          if (res.id == dr.id) {
            if (res.default_type_bool == 'false' || res.default_type_bool == false) {
              res.default_type = 'false';
            } else {
              res.default_type = 'true';
            }
            res.default_action_change = 'true';
            res.action_change = 'true';
          } else {
            res.default_type = 'false';
            res.IsEdit = 'update';
            res.default_action_change = 'true';
            res.action_change = 'true';
          }
        }
        // res.sort_by = irow.toString();
        // irow++;
      });
      this.add_column(old_data);
      ds = old_data;
      // console.log(ds)
      // this.btntopPage
      // this.btntopPage.nativeElement.click();
    }
    //ds.splice()
  }

  frmValidator(dr, action_stage) {
    const validator = function (dr): boolean {
      var bcheck = false;
      var objkey = Object.keys(dr);
      if (objkey.length > 0) {
        if (action_stage == 'addpassport' || action_stage == 'editpassport') {
          for (const el of objkey) {
            if (true) {
              if (
                el == 'passport_date_birth_type' ||
                el == 'passport_date_expire_type' ||
                el == 'passport_date_issue_type' ||
                el == 'passport_no'
              ) {
                let column = typeof dr[ el ] === 'string' ? dr[ el ].trim() : dr[ el ];
                if (column != '' && column != null && column != undefined) {
                  bcheck = true;
                } else {
                  bcheck = false;
                  break;
                }
              }
            }
          }
        } else {
          for (const el of objkey) {
            if (dr[ 'action_change' ] == 'true') {
              if (
                el == 'passport_date_birth_type' ||
                el == 'passport_date_expire_type' ||
                el == 'passport_date_issue_type' ||
                el == 'passport_no'
              ) {
                let column = typeof dr[ el ] === 'string' ? dr[ el ].trim() : dr[ el ];
                if (column != '' && column != null && column != undefined) {
                  bcheck = true;
                } else {
                  bcheck = false;
                  break;
                }
              }
            } else {
              bcheck = true;
              break;
            }
          }
        }
      }
      //bcheck = true;
      return bcheck;
    };
    return validator(dr);
  }

  Onsave(btn_type, tep?, dr?) {
    // this.validator_check = this.frmValidator(dr,'save');
    // this.validator_check = false;
    debugger;
    console.log('>> passport_detail');
    console.log(this.model_all.passport_detail);
    if (this.validator_check == false) {
      // this.vaildator_save = true;
      // this.validator_check = true;
      this.Onsave('saved', '', '');

      return;
      //clear vaidator
      this.vaildator_save = true;
      this.appMain.showMessage('Need to input value * ');
      return true;
    } else {
      if (btn_type == 'save') {
        var accept_true: boolean = false;
        if (dr != undefined || 'undefined') {
          accept_true = dr.accept_type;
        }
        if (accept_true) {
          this.alerts.swal_confrim_changes('Do you want to save the data?').then((val) => {
            if (val.isConfirmed) {
              this.Onsave('saved', tep, dr);
            }
          });
        } else {
          if (this.model_all.user_admin == true) {
            this.Onsave('saved', tep, dr);
          } else {
            // this.openModal(tep);
            this.Onsave('saved', tep, dr);
          }
        }
      } else if (btn_type == 'saved') {
        var bcheck = true;
        if (tep == 'modal') {
          bcheck = false;
        }
        if (bcheck) {
          this.Appmain.isLoading = true;
          this.model_all.data_type = 'save';
          var bodyX = this.model_all;
          bodyX.passport_detail.forEach((e) => {
            e.default_action_change = true;
          });
          let Panel_List = bodyX.passport_detail.map(({panel, id, emp_id}) => ({id, panel, emp_id}));
          const OnsaveSucecss = (data) => {
            this.typeLoad = false;
            console.log('>> after save');
            const dataServices = data;
            console.log(dataServices);
            if (data.after_trip.opt1 === 'true') {
              if (data.after_trip.opt2.status != 'Successfully saved') {
                data.after_trip.opt2.status = 'Successfully saved';
              }
              this.alerts.swal_sucess(data.after_trip.opt2.status);

              this.setActive(data);
              this.def_data(data, Panel_List);

              let index = this.model_all.passport_detail.findIndex((res) => {
                return res.emp_id === this.emp_id;
              });

              // ต้องมีฟิล เช็ค
              //this.model_all.passport_detail[index].action_type = "update";
              this.model_all.passport_detail[ index ].accept_type = false;
              const btnSwal = document.querySelector('.swal2-confirm.swal2-styled');
              const pagename: string = this.personer === 'personal' ? 'pagepassport' : 'time';
              const offset = $('#' + pagename).offset();
              if (btnSwal) {
                const ob2: Observable<Event> = fromEvent(btnSwal, 'click');
                ob2.subscribe((ev) => {
                  $('html, body').animate({scrollTop: offset.top}, 'slow');
                });
              } else {
                $('html, body').animate({scrollTop: offset.top}, 'slow');
              }
              this.TrackingStatus = {...InitTrackStatus};
            } else {
              this.alerts.swal_error(data.after_trip.opt2.status);
            }
            this.Appmain.isLoading = false;
            this.vaildator_save = false;
            this.validator_check = false;
            console.log('>> All model');
            console.log(this.model_all);
          };

          console.log('>> privious save');
          // console.log(bodyX);
          console.log(JSON.parse(JSON.stringify(bodyX)));
          this.Appmain.isLoading = false;
          this.ws.callWs(bodyX, this.action_stage.action_save).subscribe(
            (res) => OnsaveSucecss(res),

            (error) => (console.log(error), (this.Appmain.isLoading = false)),

            () => {
              this.Appmain.isLoading = false;
            }
          );
        } else {
          this.alerts.swal_confrim_changes('Do you want to save the data?').then((val) => {
            if (val.isConfirmed) {
              try {
                this.modalRef.hide();
              } catch (ex) {
                console.log('error modal');
              }
              this.Onsave('saved', '', dr);
            }
          });
        }
      } else {
        //this.model_all.passport_detail[0].action_type = "insert";
        //submit
      }
    }
  }

  OnsaveAll(btn_type) {
    let passportDetail = this.model_all.passport_detail;
    for (let item of passportDetail) {
      if (this.emp_id === item.emp_id && item.action_type !== 'delete') {
        this.validator_check = this.frmValidator(item, 'save');
        if (this.validator_check === false) {
          break;
        }
      }
    }
    console.log('>> passport_detail', this.validator_check);
    if (this.validator_check == false) {
      this.vaildator_save = true;
      this.appMain.showMessage('Need to input value * ');
      return true;
    } else {
      if (btn_type == 'saved') {
        var bcheck = true;
        if (bcheck) {
          this.Appmain.isLoading = true;
          this.model_all.data_type = 'save';
          var bodyX = this.model_all;
          let idActive = "";
          bodyX.passport_detail.forEach((e) => {
            if (this.emp_id === e.emp_id) {
              if (e.default_type === "true") {
                idActive = e.id
              }
              if (e.action_change === false || e.action_change === 'false') {
                e.action_change = "true";
              }
            }
            e.default_action_change = true;
          });
          bodyX.img_list.forEach((e) => {
            if (idActive) {
              if (this.emp_id === e.emp_id && e.action_type != 'delete') {
                if (e.id_level_1 === idActive) {
                  //@ts-ignore
                  e.active_type = "true";
                }
                else {
                  //@ts-ignore
                  e.active_type = "false";
                }
              }
            }

          })
          let Panel_List = bodyX.passport_detail.map(({panel, id, emp_id}) => ({id, panel, emp_id}));
          const OnsaveSucecss = (data) => {
            this.typeLoad = false;
            console.log('>> after save');
            const dataServices = data;
            console.log(dataServices);
            if (data.after_trip.opt1 === 'true') {
              if (data.after_trip.opt2.status != 'Successfully saved') {
                data.after_trip.opt2.status = 'Successfully saved';
              }
              this.alerts.swal_sucess(data.after_trip.opt2.status);
              this.setActive(data);
              this.def_data(data, Panel_List);
              let index = this.model_all.passport_detail.findIndex((res) => {
                return res.emp_id === this.emp_id;
              });

              // ต้องมีฟิล เช็ค
              //this.model_all.passport_detail[index].action_type = "update";
              this.model_all.passport_detail[ index ].accept_type = false;
              const btnSwal = document.querySelector('.swal2-confirm.swal2-styled');
              const pagename: string = this.personer === 'personal' ? 'pagepassport' : 'time';
              const offset = $('#' + pagename).offset();
              const ob2: Observable<Event> = fromEvent(btnSwal, 'click');
              ob2.subscribe((ev) => {
                $('html, body').animate({scrollTop: offset.top}, 'slow');
              });
              this.TrackingStatus = {...InitTrackStatus};
            } else {
              this.alerts.swal_error(data.after_trip.opt2.status);
            }
            this.Appmain.isLoading = false;
            this.vaildator_save = false;
            this.validator_check = false;
            console.log('>> All model');
            console.log(this.model_all);
          };

          console.log('>> privious save');
          // console.log(bodyX);
          console.log(JSON.parse(JSON.stringify(bodyX)));

          this.ws.callWs(bodyX, this.action_stage.action_save).subscribe(
            (res) => OnsaveSucecss(res),
            (error) => (console.log(error), (this.Appmain.isLoading = false)),

            () => {
              this.Appmain.isLoading = false;
            }
          );
        }
      }
    }
  }
  OnsaveUpload() {
    this.Appmain.isLoading = true;
    // this.typeLoad = false;

    var bodyX = this.model_all;
    bodyX.passport_detail.forEach((e) => {
      e.default_action_change = true;
    });
    let Panel_List: Array<any> | null = null;
    if (bodyX.passport_detail) {
      Panel_List = bodyX.passport_detail.map(({panel, id, emp_id}) => ({id, panel, emp_id}));
    }
    const OnsaveSucecss = (data) => {
      this.typeLoad = false;
      console.log('>> after save upload');
      console.log(data);
      if (data.after_trip.opt1 == 'true') {
        if (data.after_trip.opt2.status != 'Update data successfully.') {
          data.after_trip.opt2.status = 'Update data successfully.';
        }

        // this.setActive(data);
        this.def_data(data, Panel_List);
        let index = this.model_all.passport_detail.findIndex((res) => {
          return res.emp_id === this.emp_id;
        });

        this.TrackingStatus = {...InitTrackStatus};
      } else {
      }
      this.Appmain.isLoading = false;
      this.vaildator_save = false;
      this.validator_check = false;
      console.log('>> All model');
      console.log(this.model_all);
    };
    console.log('>> privious save upload');
    console.log(bodyX);
    this.ws.callWs(this.model_all, this.action_stage.action_save).subscribe(
      (res) => OnsaveSucecss(res),
      (error) => console.log(error),
      () => {
        this.Appmain.isLoading = false;
      }
    );
  }
  countFile(passport_id) {
    let dt = this.model_all.img_list.filter((res) => {
      return res.action_type != 'delete' && res.id_level_1 === passport_id && res.emp_id === this.emp_id;
    });
    if (dt.length === 0) {
      return false; //-false
    }

    return true; //-true
  }

  check_action(item, type: any) {
    // console.log(item)
    var bcheck = false;
    if (item.action_type == 'delete') {
      bcheck = true;
    }
    if (item.emp_id != this.emp_id || item.emp_id == 'personal') {
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

  Check_Passport_no(item) {
    var bcheck = this.Check_Passport_number(item);
    if (bcheck) {
    } else {
      item.IsEdit = 'update';
      item.action_change = 'true';
      item.default_action_change = 'true';
    }
  }

  CheckACTION(): boolean {
    var bcheck = false;
    var data_def = this.model_all.passport_detail;
    var emp_id = this.emp_id;
    if (data_def.length > 0) {
      bcheck = data_def.some((res) => res.emp_id == emp_id && res.action_change == 'true');
    }
    return bcheck;
  }
}
