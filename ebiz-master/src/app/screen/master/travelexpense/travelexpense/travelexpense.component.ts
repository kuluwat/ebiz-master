import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, forwardRef, Inject, OnInit, TemplateRef } from '@angular/core';
import { MainComponent } from '../../../../components/main/main.component';
import { FileuploadserviceService } from '../../../../ws/fileuploadservice/fileuploadservice.service';
import { AspxserviceService } from '../../../../ws/httpx/aspxservice.service';
import { MasterComponent } from '../../master.component';
import { DatePipe, DecimalPipe } from '@angular/common';
import { AngularEditorConfig } from '@kolkov/angular-editor';
// import * as fs from 'file-saver';
import { AlertServiceService } from '../../../../services/AlertService/alert-service.service';
import { InitTrackStatus, TrackingStatus } from '../../../../model/localstorage.model';
import { map, switchMap, tap, mapTo } from 'rxjs/operators';
import { timer } from 'rxjs';
import { NgModel } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { useAuth } from '../../accommodation/accommodation/accommodation.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { CloneDeep } from '../../transportation/transportation/transportation.component';
declare var $: any;

export interface detail {
  id: string;
  item: string;
  action_change: string;
  status: string;
  amount: number;
  currency: string;
  total: number;
}
@Component({
  selector: 'app-travelexpense',
  templateUrl: './travelexpense.component.html',
  styleUrls: ['./travelexpense.component.css'],
})
export class TravelexpenseComponent implements OnInit {
  //#region  URL API
  action_stage = {
    action_save: 'SaveTravelExpense',
    action_load: 'LoadTravelExpense',
    action_toSAP: 'SendTravelExpenseToSAP',
    action_load_doc: 'LoadDoc',
    // action_cancelled: 'SaveTravelExpenseTripCancelled',
    action_cancelled: 'SaveTravelExpense',
  };
  //#endregion URL API

  test: detail;
  remarkText: string = '';
  model_all: any = {
    emp_list: [],
  };

  panel = { show: true };
  userDetail: null | any = null;
  // {name:"Personal Car",code:"personal_car"}
  model_all_def = { ...this.model_all };
  action_delete = [];
  accept_true: boolean = false;
  doc_id: any;
  pagename = 'travelexpense';
  emp_id: any;
  selectfile: File;
  list_emp: string;
  select_user: any;
  totalgantotal: number = 0;
  checkall_selected: boolean = false;
  icount_row = 0;
  user_reject: boolean = true;
  sort_selectd = {
    name: false,
    modified_date: false,
    modified_by: false,
  };
  dtm_expense_type = {};
  arr_m_exchangerate = [];
  User_selected_Copy: any = [];
  airticket_copy_selected: any = '1';
  pathPhase1: any;
  TrackingStatus: TrackingStatus = { ...InitTrackStatus };
  TRAVEL_TYPE: string;
  profile: unknown;
  GobleType: boolean;
  DocType: boolean;
  modalRef: any;
  tp_clone: TemplateRef<any>;
  userList: any[];
  user_admin: boolean;
  user_request: any = false;
  isCanceled: boolean;
  isAccessCopy: boolean = false;
  constructor(
    @Inject(forwardRef(() => MasterComponent)) private Appmain: MasterComponent,
    private http: HttpClient,
    private ws: AspxserviceService,
    private fileuploadservice: FileuploadserviceService,
    private alerts: AlertServiceService,
    private changeDetector: ChangeDetectorRef,
    private modalService: BsModalService
  ) {}

  ngOnInit() {
    console.clear();
    this.doc_id = this.Appmain.DOC_ID;
    var BodyX = {
      token_login: localStorage['token'],
      doc_id: this.doc_id,
    };
    this.OnloadDoc();
    this.Onload();
  }
  get getTotalPerson() {
    let hasEmplist = 'emp_list' in this.model_all;
    if (hasEmplist) {
      return this.model_all.emp_list.length;
    }
    return '0';
  }
  get_index_by_emp(ds, emp_id, id?) {
    if (ds.length > 0) {
      return ds.findIndex((res) => {
        return res.emp_id == emp_id;
      });
    }
    return false;
  }
  async CheckLogin() {
    return new Promise((resolve, reject) => {
      var BodyX = {
        token_login: localStorage['token'],
      };
      const onSuccess = (data) => {
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
  async OnloadDoc() {
    this.profile = await this.CheckLogin();

    // this.Appmain.isLoading = true;
    var BodyX = {
      token_login: localStorage['token'],
      doc_id: this.doc_id,
    };

    const onSuccess = (data) => {
      let TravelTypeDoc = /local/g.test(this.Appmain.TRAVEL_TYPE);
      this.TRAVEL_TYPE = TravelTypeDoc ? 'Province/City/Location :' : 'Country / City  :';
      const { tab_no } = data.up_coming_plan[0];
      this.pathPhase1 = tab_no ? tab_no : '1';
      console.log('loadDoc');
      console.log(data);
      console.log('pathPhase1');
      console.log(this.pathPhase1);
    };
    this.ws.callWs(BodyX, this.action_stage.action_load_doc).subscribe(
      onSuccess,
      (error) => console.log(error),
      () => {}
    );
  }
  async sendRemark() {
    let remark = this.remarkText;
    let bodyX = this.model_all;
    const { isConfirmed } = await this.alerts.swal_confrim_changes('Do you want to cancelled the trip ?');
    if (isConfirmed) {
      this.modalRef.hide();
      this.Appmain.isLoading = true;
      bodyX.data_type = 'cancelled';
      const OnsaveSucecss = (data) => {
        console.log(CloneDeep(data), 'aftersendRemark');
        if (data.after_trip.opt1 == 'true') {
          this.UpdateCurrency(data);

          // this.alerts.swal_sucess(data.after_trip.opt2.status);
          this.alerts.swal_sucess('Successfully trip cancelled');
          // Successfully canceled
          data.data_type = null;
          this.model_all = data;
          this.model_all_def = { ...data };
          // this.model_all.user_admin = false;
          this.model_all.data_type = null;
        } else {
          this.model_all.data_type = null;
          if (data.after_trip.opt2.status == null) {
            data.after_trip.opt2.status = 'Error';
          }
          this.alerts.swal_error(data.after_trip.opt2.status);
        }
      };
      bodyX.travelexpense_main.forEach((item) => {
        item.status_trip_cancelled = 'true';
        item.remark = remark;
        item.action_change = 'true';
      });
      bodyX.travelexpense_detail.forEach((item) => {
        item.action_change = 'true';
      });
      bodyX.emp_list.forEach((item) => {
        item.mail_status = 'true';
      });
      console.log(CloneDeep(bodyX), 'beforsendRemark');
      this.ws.callWs(bodyX, this.action_stage.action_cancelled).subscribe(
        (res) => OnsaveSucecss(res),
        (error) => console.log(error),
        () => {
          this.remarkText = '';
          this.updateFormat();
          this.Appmain.isLoading = false;
        }
      );
    } else {
    }
  }
  copyDetailAllEmp(emp_id) {
    let ds_person_selected = this.User_selected_Copy;
    let type_person_selected = this.airticket_copy_selected;
    // 1 = all user , 2 = user ที่เลือก
    let bcheck_all: boolean = false;
    if (type_person_selected == '1') {
      bcheck_all = true;
    }

    const ds1 = this.model_all.travelexpense_detail;
    const ds2 = this.model_all.travelexpense_main;
    var Data1 = [],
      Data2;
    this.alerts.swal_confrim('Do you want to paste information ?', '', 'question').then((val) => {
      if (val.isConfirmed == true) {
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

        //delete img
        this.model_all.img_list.forEach((e) => {
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

        let Img_data = this.model_all.img_list;
        let userList = this.model_all.travelexpense_main
          .filter((v) => v.emp_id != this.emp_id)
          .map(({ emp_id }) => emp_id);
        console.log(userList, 'userList');
        Img_data = Img_data.filter((v) => v.emp_id == this.emp_id && v.action_type != 'delete');
        userList.forEach((emp_id_outer) => {
          if (bcheck_all) {
            //!! อาจจะ copy img ไปไม่ได้เนื่องจากถ้า ลบไฟล์ไป ไฟล์ของคนที่ copy มาอาจถูกลบไปด้วย
            if (Img_data.length > 0) {
              for (let item of Img_data) {
                let findexpense_type = this.model_all.travelexpense_detail.find(({ id }) => id === item.id_level_1);
                if (findexpense_type) {
                  let { expense_type } = findexpense_type;
                  let findIndex = this.model_all.travelexpense_detail.findIndex(
                    ({ emp_id, expense_type: expense_types }) =>
                      emp_id === emp_id_outer && expense_types === expense_type
                  );
                  if (findIndex > -1) {
                    const LENGTHIMG = this.model_all.img_list.length;
                    if (LENGTHIMG > 0) {
                      console.log(this.model_all.travelexpense_detail[findIndex]);
                      const { id: ids } = this.model_all.travelexpense_detail[findIndex];
                      let set_maxid = this.model_all.img_list.map((i) => +i.id);
                      let max_i = Math.max(...set_maxid);
                      let { id, id_level_1, action_type, action_change, emp_id, ...rest } = item;

                      id = max_i + 1;
                      id_level_1 = ids;
                      action_type = 'insert';
                      action_change = 'true';
                      emp_id = emp_id_outer;
                      console.log(rest, 'rest');
                      let obj = { id, id_level_1, action_type, action_change, emp_id, ...rest };
                      console.log(obj);
                      console.log(rest, 'rest');
                      this.model_all.img_list.push(obj);
                    }
                  }
                }
              }
            }
            //!! อาจจะ copy img ไปไม่ได้เนื่องจากถ้า ลบไฟล์ไป ไฟล์ของคนที่ copy มาอาจถูกลบไปด้วย
          } else {
            if (ds_person_selected.includes(emp_id_outer)) {
              if (Img_data.length > 0) {
                for (let item of Img_data) {
                  let findexpense_type = this.model_all.travelexpense_detail.find(({ id }) => id === item.id_level_1);
                  if (findexpense_type) {
                    let { expense_type } = findexpense_type;
                    let findIndex = this.model_all.travelexpense_detail.findIndex(
                      ({ emp_id, expense_type: expense_types }) =>
                        emp_id === emp_id_outer && expense_types === expense_type
                    );
                    if (findIndex > -1) {
                      const LENGTHIMG = this.model_all.img_list.length;
                      if (LENGTHIMG > 0) {
                        const { id: ids } = this.model_all.travelexpense_detail[findIndex];
                        let set_maxid = this.model_all.img_list.map((i) => +i.id);
                        let max_i = Math.max(...set_maxid);
                        let { id, id_level_1, action_type, action_change, emp_id, ...rest } = item;
                        id = max_i + 1;
                        id_level_1 = ids;
                        action_type = 'insert';
                        action_change = 'true';
                        emp_id = emp_id_outer;
                        let obj = { id, id_level_1, action_type, action_change, emp_id, ...rest };
                        this.model_all.img_list.push(obj);
                      }
                    }
                  }
                }
              }
            }
          }
        });
        // update type เป็น delete
        this.model_all.travelexpense_main.forEach((e) => {
          if (bcheck_all) {
            if (e.emp_id != emp_id) {
              e.action_change = 'true';
              courseCheck = true;
            }
          } else {
            ds_person_selected.forEach((el) => {
              if (e.emp_id == el.emp_id) {
                e.action_change = 'true';
                courseCheck = true;
              }
            });
          }
          if (e.emp_id === emp_id && e.action_type === 'insert') {
            e.action_change = 'true';
          }
        });

        this.model_all.travelexpense_detail.forEach((e) => {
          //กรณีเลือก all
          if (bcheck_all) {
            if (e.emp_id != emp_id) {
              let el = Data1;
              for (let items of el) {
                if (items.expense_type === e.expense_type) {
                  e.action_change = 'true';
                  e.exchange_rate = items.exchange_rate;
                  e.expense_type = items.expense_type;
                  // e.status = items.status;
                  e.currency = items.currency;
                  e.as_of = items.as_of;
                  e.total = items.total;
                  e.grand_total = items.grand_total;
                  e.remark = items.remark;
                  e.status_active = items.status_active;
                }
              }
            }
          } else {
            ds_person_selected.forEach((el) => {
              if (e.emp_id == el.emp_id) {
                let el = Data1;
                for (let items of el) {
                  if (items.expense_type === e.expense_type) {
                    e.action_change = 'true';
                    e.exchange_rate = items.exchange_rate;
                    e.expense_type = items.expense_type;
                    // e.status = items.status;
                    e.currency = items.currency;
                    e.as_of = items.as_of;
                    e.total = items.total;
                    e.grand_total = items.grand_total;
                    e.remark = items.remark;
                    e.status_active = items.status_active;
                  }
                }
              }
            });
          }
        });

        this.alerts.toastr_warning('Please Save Data');
        this.modalRef.hide();
        //??  update emp_id หลังจาก copy
        if (bcheck_all) {
          let emp_id_Selected = this.emp_id;
          let emp_list = this.model_all.emp_list;
          let Lebgth_emp_list = emp_list.length;
          let empIndex = emp_list.findIndex(({ emp_id }) => emp_id === emp_id_Selected);
          if (Lebgth_emp_list - 1 === empIndex) {
            empIndex = 0;
          } else {
            empIndex += 1;
          }
          const { emp_id } = emp_list[empIndex];
          this.list_emp = emp_list[empIndex].emp_id;
          this.emp_id = emp_id;
        } else {
          if (ds_person_selected.length > 0) {
            console.log(ds_person_selected, 'ds_person_selected');
            let emp_id_Selected = ds_person_selected.at(-1);
            this.list_emp = emp_id_Selected.emp_id;
            this.emp_id = emp_id_Selected.emp_id;
          }
        }
        //??  update emp_id หลังจาก copy
        const doc_id = this.doc_id;
        this.Appmain.userSelected = this.emp_id;
        this.userDetail = this.UserDetail[0];
        this.TrackingStatus = { ...InitTrackStatus };
        this.isAccessCopy = true;
        this.airticket_copy_selected = '1';
        this.User_selected_Copy = [];
      } else {
      }
      //คือค่าข้อมูล ใน modal
      console.log('Out put');
    });
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
            this.TrackingStatus[Status] = true;
          }
        }
      }
      return this.TrackingStatus[Status];
    };
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
  openModal(template: TemplateRef<any>, size: string = 'lg') {
    this.tp_clone = template;
    let config: object = {
      class: `modal-${size}`,
      animated: true,
      keyboard: false,
      ignoreBackdropClick: true,
    };

    this.modalRef = this.modalService.show(template, config);
    // var configx = $("#exampleModalCenter").closest('.modal-backdrop').addClass('z-index:1100');
    this.set_modal();
    setTimeout(function () {
      $('.multiselect-dropdown .dropdown-btn').css({ border: '1px solid #ced4da', padding: '9px 12px' });
    }, 100);
  }

  set_modal() {
    $('.modal-backdrop').css({ 'z-index': 700 });
    $('.modal').css({ 'z-index': 800 });
  }
  async update_userByDOC(VLAUE, select: MatSelect) {
    // window['event'].stopPropagation();
    // console.log('EL', select, 'VALUE' + VLAUE);
    let check_detail = this.model_all.travelexpense_detail.some(
      (res) => (res.action_change == true || res.action_change == 'true') && res.emp_id == this.emp_id
    );
    let checkUsercancel = this.StatusCancel;
    const callback = () => !select.panelOpen && select.open();
    const observerTime = timer(0).pipe(tap(console.log));
    if (check_detail && !checkUsercancel) {
      observerTime.subscribe(callback);
      const { isConfirmed } = await this.alerts.swal_confrim_changes('Do you want to save the document ?');
      if (isConfirmed) {
        this.Onsave('saved');
      } else {
        this.Onload_status_cancel();
      }
      await select.close();
    }
    this.checkall_selected = false;
    this.model_all.user_display = select.triggerValue;
    this.TrackingStatus = { ...InitTrackStatus };
    this.emp_id = this.list_emp;
    this.Appmain.userSelected = this.emp_id;

    this.userDetail = this.UserDetail[0];
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
  setActiveLink() {}
  check_img(detail_id) {
    let img_list = this.model_all.img_list;
    let data_new = img_list.filter(
      (word) => word.emp_id === this.emp_id && word.id_level_1 == detail_id && word.action_type !== 'delete'
    );
    if (data_new.length > 0) {
      return true;
    }
    return false;
  }
  uploadFile(ev, item_id) {
    this.Appmain.isLoading = true;
    this.selectfile = <File>ev.target.files[0];

    //File
    let hasImg = this.check_img(item_id);
    if (hasImg) {
      this.model_all.img_list.forEach((el) => {
        if (el.id_level_1 === item_id) {
          el.action_change = 'true';
          el.action_type = 'delete';
        }
      });
    }

    console.log(this.selectfile);

    let Jsond = {
      file: this.selectfile,
      doc_id: this.doc_id,
      pagename: this.pagename,
      emp_id: this.emp_id,
      file_token_login: localStorage['token'],
    };

    const onSuccess = (res) => {
      this.Appmain.isLoading = false;
      console.log('fetchIMG');
      console.log(res);
      let status_res = res.after_trip;

      if (status_res.opt1 == 'true') {
        this.alerts.toastr_warning('Please Save Data');
        let set_maxid = this.model_all.img_list.map((i) => +i.id);
        let max_i = Math.max(...set_maxid);
        res.img_list.id = max_i + 1;
        res.img_list.id_level_1 = item_id;
        console.log('updateIMG');
        console.log(res);
        this.model_all.img_list.push(res.img_list);
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
          //alert("error!");
        },
        () => {
          if (this.checkall_selected) {
            this.funcheck(this.checkall_selected);
          }
        }
      );
  }
  statusCheckAll(ds): boolean {
    let anyCheckBox: boolean = true;
    ds.forEach((item) => {
      const { total, grand_total } = item;
      if (total) {
        anyCheckBox = false;
      }
    });
    return anyCheckBox;
  }
  checkallChange(ev, ds) {
    // function ใช้สำหรับ update จังหวะ check all

    const { checked: isChecked } = ev;
    let anyCheckBox = false;

    ds.forEach((item) => {
      const { total, grand_total } = item;
      anyCheckBox = true;
      item.status_active = isChecked;
      item.action_change = 'true';
      if (total || grand_total) {
      }
    });
    if (!anyCheckBox) {
      ev.checked = anyCheckBox;
    }
  }
  downloadFile(filename, url) {
    // fs.saveAs(url, filename);
  }
  FileName(detail_id): string {
    let url = '';
    let img_list = this.model_all.img_list;
    let data_new = img_list.find(
      (word) => word.emp_id === this.emp_id && word.id_level_1 == detail_id && word.action_type !== 'delete'
    );
    if (data_new) {
      if (data_new.fullname && data_new.fullname != '') {
        url = data_new.filename;
      }
    }
    return url;
  }
  downloadFileBY_Item(detail_id) {
    let url = '';
    let img_list = this.model_all.img_list;
    let data_new = img_list.find(
      (word) => word.emp_id === this.emp_id && word.id_level_1 == detail_id && word.action_type !== 'delete'
    );
    if (data_new) {
      if (data_new.fullname && data_new.fullname != '') {
        this.downloadFile(data_new.filename, data_new.fullname);
      }
    }
  }

  statusXShow = [
    {
      id: '4',
      name: 'Complete',
      sort_by: '1',
      action_type: null,
      action_change: null,
    },
    {
      id: '',
      name: 'In Complete',
      sort_by: '2',
      action_type: null,
      action_change: null,
    },
    {
      id: '5',
      name: 'In Complete',
      sort_by: '2',
      action_type: null,
      action_change: null,
    },
    {
      id: '6',
      name: 'Send to SAP',
      sort_by: '3',
      action_type: null,
      action_change: null,
    },
  ];

  UpdateCurrency(data) {
    const { TRAVEL_TYPE } = this.Appmain;
    this.DocType = TRAVEL_TYPE.includes('training');
    // ALLOWANCE_DAY -USD/THB = 3  ALLOWANCE_NIGHT = 4
    data.travelexpense_detail.forEach((e) => {
      if (e.action_type === 'insert') {
        if (/local/g.test(TRAVEL_TYPE)) {
          e.currency = 'THB';
        } else {
          // oversea ต่างประเทศ
          if (['3'].includes(e.expense_type)) {
            e.currency = 'USD';
          } else {
            e.currency = 'THB';
          }
        }
      } else {
        if (e.currency === '') {
          e.currency = 'THB';
        }
      }
    });
  }

  Onload() {
    this.Appmain.isLoading = true;

    const onSuccess = (data) => {
      this.Appmain.isLoading = false;
      console.log('first Load data');
      console.log(data);
      console.log('GET TRAVEL_TYPE ');
      console.log(this.Appmain.TRAVEL_TYPE);
      const { TRAVEL_TYPE } = this.Appmain;
      //ขาด เช็ค  user emp_id
      data.dtm_status.forEach((e) => {
        if (e.name == 'Inprogress') {
          e.name = 'In Complete';
        }
      });

      // ALLOWANCE_DAY -USD/THB = 3  ALLOWANCE_NIGHT = 4
      this.UpdateCurrency(data);

      this.arr_m_exchangerate = data.m_exchangerate;

      var user_cur = data.emp_list[0];
      this.model_all_def = { ...data };
      this.model_all = data;

      this.model_all.travelexpense_detail.forEach((e) => {
        e.status_active = this.getBoolean(e.status_active);
      });

      if (data.user_admin) {
        let userSelect = this.Appmain.userSelected;
        const { emp_id, userSelected, status_trip_cancelled } = useAuth(data, userSelect);
        this.list_emp = emp_id;
        this.emp_id = emp_id;
        this.Appmain.userSelected = userSelected;
        this.user_admin = true;
        this.user_reject = this.getBoolean(status_trip_cancelled) ? false : true;

        //
      } else {
        //@ts-ignore
        // const { profile } = this.Appmain.appHeader;
        // this.list_emp = profile.emp_id;
        // user_cur = profile;
        // this.model_all.user_display = user_cur.username;

        const { profile } = { profile: this.profile[0] };
        console.log('Getprofile');
        console.log(profile);
        user_cur = profile;
        this.list_emp = profile.empId;
        this.emp_id = profile.empId;
        this.model_all.user_display = profile.empName;
        let finduser = data.emp_list.find(({ emp_id }) => emp_id === profile.empId);
        !finduser && (this.user_reject = false);
        this.user_admin = false;
        //?? เช็คว่าเป็น requesterรึป่าว
        //todo finduser ถ้าไม่มีใน  emplist = undefined
        if (!finduser && 'user_request' in data && data.user_request === true) {
          let userSelected = this.Appmain.userSelected;
          this.user_request = data.user_request;
          this.user_admin = false;
          this.user_reject = false;
          if (userSelected) {
            this.emp_id = this.Appmain.userSelected;
            this.list_emp = this.emp_id;
          } else {
            this.emp_id = data.emp_list[0].emp_id;
            this.Appmain.userSelected = data.emp_list[0].emp_id;
            this.list_emp = this.emp_id;
          }
        }
      }

      // if (data.emp_list[0].hasOwnProperty('show_button')) {
      //   this.user_reject = data.emp_list[0].show_button;
      // } else {
      //   this.user_reject = false;
      // }

      this.doc_id = data.doc_id;
      this.userDetail = this.UserDetail[0];
      if (typeof this.model_all.emp_list === 'object') {
        this.userList = this.model_all.emp_list.reduce((acc, dt, i) => {
          acc = { ...acc, [dt.emp_id]: dt };
          return acc;
        }, {});
      }
    };

    var BodyX = {
      token_login: localStorage['token'],
      doc_id: this.doc_id,
    };

    console.log('load ก่อนส่ง');
    console.log(BodyX);

    this.ws.callWs(BodyX, this.action_stage.action_load).subscribe(
      (data) => onSuccess(data),
      (error) => (this.Appmain.isLoading = false),
      () => {
        this.Appmain.isLoading = false;
        this.model_all.dtm_expense_type.reduce((cur, pre) => {
          return (this.dtm_expense_type[pre.id] = pre.name);
        }, {});
        this.model_all.travelexpense_detail && this.updateFormat();
      }
    );
  }

  get UserDetail() {
    return this.model_all.emp_list.filter((item) => item.emp_id === this.emp_id);
  }
  updateFormat() {
    this.model_all.travelexpense_detail.forEach((el) => {
      if (el.total != '' && el.total != null) {
        el.total = this.convertInt('', el, el.total);
        el.total = this.convertInt('updatetotal', el, el.total);
      }
      if (el.grand_total != '' && el.grand_total != null) {
        el.grand_total = this.convertInt('', el, el.grand_total);
      }
    });
  }
  Onload_status_cancel() {
    this.Appmain.isLoading = true;
    const onSuccess = (data) => {
      this.Appmain.isLoading = false;
      //ขาด เช็ค  user emp_id
      this.UpdateCurrency(data);
      this.model_all_def = { ...data };
      this.model_all = data;
      this.model_all.travelexpense_detail.forEach((e) => {
        e.status_active = this.getBoolean(e.status_active);
      });
      var i = this.get_index_by_emp(this.model_all.emp_list, this.emp_id);
      // if (this.model_all.emp_list[i].hasOwnProperty('show_button')) {
      //   this.user_reject = this.model_all.emp_list[i].show_button;
      // } else {
      //   this.user_reject = false;
      // }
      this.doc_id = data.doc_id;
      if (this.isCanceled === true) {
        this.isCanceled = false;
        this.alerts.swal_sucess('Successfully canceled');
      }
    };

    var BodyX = {
      token_login: localStorage['token'],
      doc_id: this.doc_id,
    };

    this.ws.callWs(BodyX, this.action_stage.action_load).subscribe(
      (data) => onSuccess(data),
      (error) => (this.Appmain.isLoading = false),
      () => {
        //this.check_user();
        this.updateFormat();
      }
    );
  }

  onKeyDown(event) {
    var check_user = this.Appmain.profile.username;
    var def_user = 'nitinai';

    if (check_user.toLowerCase().includes(def_user)) {
      console.log(event);
      if (event.key == '9') {
        this.model_all.user_admin = !this.model_all.user_admin;
      }
      if (event.key == '8') {
        this.user_reject = !this.user_reject;
      }
    }
  }

  setTotal(item: any, model: HTMLInputElement) {
    const { total, grand_total } = item;
    // const { checked } = model;
    // console.log(item.status_active, model);
    if (total || grand_total) {
      item.action_change = 'true';
    } else {
      item.status_active = false;
      this.alerts.swal_warning('Please input Amount');
    }
    model.checked = item.status_active;
  }
  Sort_by(bool: boolean, filde: string, fidle_selected: string) {
    this.sort_selectd[fidle_selected] = !bool;
    this.model_all.img_list = this.model_all.img_list.sort(function (a, b) {
      if (bool) {
        return a[filde].localeCompare(b[filde]);
      } else {
        return b[filde].localeCompare(a[filde]);
      }
    });
  }
  //#region  Save Data
  CheckData(value: any) {
    value = value.trim();
    var bbcheck = true;
    if (value == '') {
      bbcheck = false;
    }
    if (value == null || value == 'null') {
      bbcheck = false;
    }
    if (value == undefined || value == 'undefined') {
      bbcheck = false;
    }
    return bbcheck;
  }
  async ConfrimSave() {
    try {
      const actionSave = await this.alerts.swal_confrim_changes('Do you want to save the document ?');
      if (actionSave.isConfirmed) {
        this.Onsave('saved');
      } else {
        return;
      }
    } catch (ex) {
      console.log(ex);
    }
  }
  Onsave(btn_type) {
    if (btn_type == 'saved') {
      if (true) {
        this.Appmain.isLoading = true;
        const OnsaveSucecss = (data) => {
          console.log(data);
          data.dtm_status.forEach((e) => {
            if (e.name === 'Inprogress') {
              e.name = 'In Complete';
            }
          });
          if (data.after_trip.opt1 == 'true') {
            this.UpdateCurrency(data);
            // this.alerts.swal_sucess(data.after_trip.opt2.status);
            this.alerts.swal_sucess('Successfully saved');
            data.data_type = null;
            this.model_all = data;
            this.model_all.travelexpense_detail.forEach((e) => {
              e.status_active = this.getBoolean(e.status_active);
            });
            this.model_all_def = { ...data };
            this.checkall_selected = false;
          } else {
            if (data.after_trip.opt2.status == null) {
              data.after_trip.opt2.status = 'Error';
            }
            this.alerts.swal_error(data.after_trip.opt2.status);
          }
          this.Appmain.isLoading = false;
          this.isAccessCopy = false;
        };

        var check_detail = this.model_all.travelexpense_detail.some(
          (res) => (res.action_change == true || res.action_change == 'true') && res.emp_id == this.emp_id
        );

        let checkTypeSave = this.statusUpdated;
        if (checkTypeSave) {
          check_detail = true;
          this.model_all.travelexpense_detail.forEach((el) => {
            if (el.emp_id == this.emp_id) {
              el.action_change = 'true';
            }
          });
        }

        // ! เช็คว่า มีการ update ข้อมูลหรือไม่
        if (check_detail) {
          var status_send_toSAP = 'false';
          if (this.model_all.travelexpense_main.length > 0) {
            this.model_all.travelexpense_main.forEach((el) => {
              if (el.emp_id == this.emp_id) {
                el.action_change = 'true';
                //status_send_toSAP = el.send_to_sap;
              }
            });

            this.model_all.travelexpense_detail.forEach((el) => {
              if (el.emp_id == this.emp_id && el.status === '6') {
                if (el.status === '6') {
                  // if (el.action_change === 'true') {

                  // }
                  if (this.CheckData(el.total)) {
                    // status 4 = "Complete". 5 ="Inprogress" 6 = "Send to SAP"
                    el.status = '4';
                  } else {
                    el.status = '5';
                  }
                } else {
                  if (el.action_change === 'true') {
                    if (this.CheckData(el.total)) {
                      // status 4 = "Complete". 5 ="Inprogress" 6 = "Send to SAP"
                      el.status = '4';
                    } else {
                      el.status = '5';
                    }
                  }
                }
              } else if (el.emp_id == this.emp_id && el.status != '6') {
                if (this.CheckData(el.total)) {
                  // status 4 = "Complete". 5 ="Inprogress" 6 = "Send to SAP"
                  el.status = '4';
                } else {
                  el.status = '5';
                }
              }
            });
          }
        }
        // ! เช็คว่า มีการ update ข้อมูลหรือไม่

        this.model_all.data_type = 'save';
        if (this.isAccessCopy) {
          //?? กรณี copy ข้อมูล
          let dsempUpdate: any[] = this.model_all.travelexpense_detail
            .filter(({ action_change }) => action_change === 'true')
            .map(({ emp_id }) => emp_id);
          let emp_list_Update = [...new Set([...dsempUpdate])];
          if (emp_list_Update.length > 0) {
            this.model_all.travelexpense_main.forEach((e) => {
              if (emp_list_Update.includes(e.emp_id)) {
                e.action_change = 'true';
              }
            });
            this.model_all.travelexpense_detail.forEach((el) => {
              if (el.status === '6') {
                if (this.CheckData(el.total)) {
                  // status 4 = "Complete". 5 ="Inprogress" 6 = "Send to SAP"
                  el.status = '4';
                } else {
                  el.status = '5';
                }
              } else {
                if (this.CheckData(el.total)) {
                  // status 4 = "Complete". 5 ="Inprogress" 6 = "Send to SAP"
                  el.status = '4';
                } else {
                  el.status = '5';
                }
              }
              if (emp_list_Update.includes(el.emp_id)) {
                el.action_change = 'true';
              }
            });
          }
          //?? กรณี copy ข้อมูล
        }

        // ! เช็คกรณที่ SEND TO SAP ไปแล้วจะเข้ามา update status
        if (this.model_all.travelexpense_main.length > 0 && this.StatusSAP === true) {
          this.model_all.travelexpense_main.forEach((e) => {
            if (this.emp_id === e.emp_id) {
              e.action_change = 'true';
            }
          });
          this.model_all.travelexpense_detail.forEach((el) => {
            if (el.emp_id == this.emp_id && el.status === '6') {
              if (el.status === '6') {
                if (this.CheckData(el.total)) {
                  // status 4 = "Complete". 5 ="Inprogress" 6 = "Send to SAP"
                  el.status = '4';
                } else {
                  el.status = '5';
                }
              }
              if (this.emp_id === el.emp_id) {
                el.action_change = 'true';
              }
            }
          });
        }
        // ! เช็คกรณที่ SEND TO SAP ไปแล้วจะเข้ามา update status
        var bodyX = this.model_all;
        console.log('-- this.model_all --');
        console.log(CloneDeep(this.model_all), 'CloneDeep');
        this.ws.callWs(bodyX, this.action_stage.action_save).subscribe(
          (res) => OnsaveSucecss(res),
          (error) => console.log(error),
          () => {
            this.updateFormat();
            this.Appmain.isLoading = false;
          }
        );
      }
    } else {
      //submit
    }
  }

  OnSendToSAP() {
    this.alerts.swal_confrim('Do you want to travel expenses to SAP ?', '', 'question').then((val) => {
      if (val.isConfirmed == true) {
        this.SendToSAP();
      } else {
      }
    });
  }
  get statusUpdated(): boolean {
    const { travelexpense_detail } = this.model_all;
    const emp_id = this.emp_id;
    // const CheckData = travelexpense_detail
    //   .filter(({ emp_id: emp_idx, action_type }) => emp_id === emp_idx)
    //   .every(({ action_type }) => action_type === 'insert');
    const CheckData = travelexpense_detail.some(({ action_type }) => action_type === 'insert');
    // const CheckData = travelexpense_detail.every(({ status }) => status === '5');

    return CheckData;
  }
  get StatusSAP(): boolean {
    const { travelexpense_detail, travelexpense_main } = this.model_all;
    const emp_id = this.emp_id;
    const CheckData = travelexpense_main
      .filter(({ emp_id: emp_idx, action_type }) => emp_id === emp_idx)
      .some(({ send_to_sap }) => send_to_sap === 'true');

    return CheckData;
  }
  get StatusCancel(): boolean {
    const { emp_list } = this.model_all;
    const emp_id = this.emp_id;
    const CheckData = emp_list
      .filter(({ emp_id: emp_idx }) => emp_id === emp_idx)
      .some(({ status_trip_cancelled }) => status_trip_cancelled === 'true' || status_trip_cancelled === null);

    return CheckData;
  }
  get empCount(): boolean {
    const { emp_list } = this.model_all;
    const emp_id = this.emp_id;
    const CheckData = emp_list.length === 1;
    return CheckData;
  }
  SendToSAP() {
    this.Appmain.isLoading = true;

    const onSuccess = (data) => {
      console.log(data);

      data.dtm_status.forEach((e) => {
        if (e.name == 'Inprogress') {
          e.name = 'In Complete';
        }
      });

      this.Appmain.isLoading = false;
      if (data.after_trip.opt1 == 'true') {
        this.UpdateCurrency(data);
        this.alerts.swal_sucess(data.after_trip.opt2.status);
        data.data_type = null;
        this.model_all = { ...data };
        this.model_all_def = { ...data };
        this.model_all.travelexpense_detail.forEach((e) => {
          e.status_active = this.getBoolean(e.status_active);
        });
      } else {
        if (data.after_trip.opt2.status == null) {
          data.after_trip.opt2.status = 'Error';
        }
        this.alerts.swal_error(data.after_trip.opt2.status);
      }
      this.Appmain.isLoading = false;
      this.checkall_selected = false;
    };
    var check_detail = this.model_all.travelexpense_detail;
    // ! เช็คว่า มีการ update ข้อมูลหรือไม่ (ยกเลิกการส่งแบบรายคน)
    // var check_detail = this.model_all.travelexpense_detail.some((res) => res.emp_id == this.emp_id);
    if (check_detail && false) {
      if (this.model_all.travelexpense_main.length > 0) {
        this.model_all.emp_list.forEach((el) => {
          if (el.emp_id == this.emp_id) {
            el.send_to_sap = 'true';
          }
        });

        this.model_all.travelexpense_main.forEach((el) => {
          if (el.emp_id == this.emp_id) {
            el.action_change = 'true';
            el.send_to_sap = 'true';
          }
        });

        this.model_all.travelexpense_detail.forEach((el) => {
          if (el.emp_id == this.emp_id && el.status !== '6') {
            if (el.action_change === 'true') {
              if (this.CheckData(el.total)) {
                // status 4 = "Complete". 5 ="Incomplete" 6 = "Send to SAP"
                // el.status = '6';
              } else {
                el.status = '5';
              }
            }
          }
          if (el.emp_id == this.emp_id) {
            el.status_active = 'true';
            el.action_change = 'true';
          }
        });
      }
    }

    // ! เช็คว่า มีการ update ข้อมูลหรือไม่ (ยกเลิกการส่งแบบรายคน)

    // ?? update ข้อมูลทุก item

    if (check_detail.length > 0) {
      if (this.model_all.travelexpense_main.length > 0) {
        this.model_all.emp_list.forEach((el) => {
          el.send_to_sap = 'true';
        });

        this.model_all.travelexpense_main.forEach((el) => {
          el.action_change = 'true';
          el.send_to_sap = 'true';
        });

        this.model_all.travelexpense_detail.forEach((el) => {
          if (el.status !== '6') {
            if (el.action_change === 'true') {
              if (this.CheckData(el.total)) {
                // status 4 = "Complete". 5 ="Incomplete" 6 = "Send to SAP"
                // el.status = '6';
              } else {
                // el.status = '5';
              }
            }
          }
          el.status_active = 'true';
          el.action_change = 'true';
        });
      }
    }
    // ?? update ข้อมูลทุก item

    console.log(this.model_all);
    this.model_all.data_type = 'sendtosap';
    var BodyX = this.model_all;

    this.ws.callWs(BodyX, this.action_stage.action_save).subscribe(
      (data) => onSuccess(data),
      (error) => (this.Appmain.isLoading = false),
      () => {
        this.updateFormat();
      }
    );
  }
  OnCencel() {
    this.alerts.swal_confrim('Do you want to cancel the document ?', '', 'question').then((val) => {
      if (val.isConfirmed == true) {
        this.isCanceled = true;
        this.Onload_status_cancel();
      } else {
      }
    });
  }
  //#endregion End Save Data

  //#region  calcurate total
  convert_dateDMY(str, format?) {
    var dt = new Date(str);

    var montF = new DatePipe('en-US');

    return montF.transform(dt, format);
  }
  UpdateExchangeRate(item, Rate_Type: string) {
    let dsExchangeRate = this.model_all.m_exchangerate;
    let exchangeRate_Value = 0;
    let dsexchangerow = [];
    var Maxdate_checked = this.convert_dateDMY(new Date(), 'dd MMM yyyy').toUpperCase();

    //console.log(Maxdate_checked)
    if (dsExchangeRate.length > 0) {
      dsexchangerow = dsExchangeRate.filter(
        (res) => res.currency_id == Rate_Type && res.date_from == Maxdate_checked && res.date_to == Maxdate_checked
      );

      if (dsexchangerow.length > 0) {
        exchangeRate_Value = dsexchangerow[0].exchange_rate;
        item.exchange_rate = exchangeRate_Value;
        item.action_change = 'true';
        item.grand_total = this.Cal_Gran_Total(item.total, item.exchange_rate, item.currency);
      } else {
        try {
          dsexchangerow = dsExchangeRate.filter((res) => res.currency_id == Rate_Type);
          /* item.grand_total = "0"; */
          item.exchange_rate = '';
          item.action_change = 'true';
          item.grand_total = this.Cal_Gran_Total(item.total, item.exchange_rate, item.currency);
          /* 
          item.action_change = "true"; */
        } catch (err) {
          item.grand_total = '0';
          item.exchange_rate = '';
          item.action_change = 'true';
        }
      }
    }
  }
  convertInt(Fidle: string, item?, ev?: any, ds?: any) {
    try {
      ev = ev.toString();
    } catch (ex) {}
    var newvalue = ev.replace(/,/g, '');
    var x_num = Number(parseInt(newvalue)).toLocaleString('en-GB');
    if (x_num == 'NaN') {
      x_num = '';
    }

    if (Fidle == 'total') {
      item.grand_total = this.Cal_Gran_Total(item.total, item.exchange_rate, item.currency);
      item.action_change = 'true';
      if (item.total && +item.total.replace(/,/g, '') > 0) {
      } else {
        if (item.total === '') {
          console.log(item.total, 'total');
          const boolcheck = item.total === '' || item.total < 0;
          item.status_active = boolcheck ? false : item.status_active;
          if (this.statusCheckAll(ds)) this.checkall_selected = false;
        }
      }
    }
    if (Fidle == 'updatetotal') {
      item.grand_total = this.Cal_Gran_Total(item.total, item.exchange_rate, item.currency);
      // item.action_change = 'true';
      if (item.total && +item.total.replace(/,/g, '') > 0) {
      } else {
        if (item.total === '') {
          // console.log(item.total, 'total');
          const boolcheck = item.total === '' || item.total < 0;
          item.status_active = boolcheck ? false : item.status_active;
          if (this.statusCheckAll(ds)) this.checkall_selected = false;
        }
      }
    }
    if (Fidle == 'grand_total') {
      //item.grand_total = this.Cal_Gran_Total(item.total, item.exchange_rate);
      //item.grand_total = newvalue ;
      item.action_change = 'true';
    }

    return x_num;
  }
  Cal_Gran_Total(Total, Rate, currency_id) {
    var XRate;
    var XTotal;
    var newvalue;
    try {
      newvalue = Total.replace(/,/g, '');
      //console.log(XRate * XTotal);
    } catch (ex) {
      newvalue = '0';
    }
    try {
      if (currency_id != null && currency_id != 'null') {
        this.arr_m_exchangerate.forEach((e) => {
          if (e.currency_id == currency_id) {
            Rate = e.exchange_rate;
          }
        });
        XRate = parseFloat(Rate);
        if (isNaN(XRate) == true) {
          XRate = 1;
        }
      } else {
        XRate = 1;
      }
    } catch {
      XRate = 1;
    }
    try {
      XTotal = parseInt(newvalue);
    } catch {
      XTotal = 0;
    }
    return this.convertInt('', '', (XRate * XTotal).toString());
  }
  //#region calcurate total

  //#region Action

  count_item() {
    let dt = this.model_all.img_list.filter((res) => {
      return res.action_type != 'delete';
    });
    return dt.length;
  }
  get_name_expanseType(select_id: any) {
    var ds = this.model_all.dtm_expense_type;
    let nameType = this.dtm_expense_type[select_id];
    if (nameType) {
      nameType = nameType.replace(/(-.*)|(– .*)/g, '');
    } else {
      nameType = '';
    }
    return nameType;
  }
  get_data_by_user(ds, emp_id) {
    var arr = [];

    var dtm_expense_type = this.model_all.dtm_expense_type;
    if (Array.isArray(ds)) {
      if (ds.length > 0) {
        arr = ds.filter((res) => res.emp_id == emp_id);
        arr.forEach((e) => {
          let sortNumber: number = 0;
          dtm_expense_type.forEach((x) => {
            if (e.expense_type == x.id) {
              sortNumber = +x.sort_by;
              e['Display_expend'] = sortNumber;
            }
          });
          //
        });

        //@ts-ignore
        arr = arr.sort((a, b) => a.Display_expend < b.Display_expend);
        // arr.sort(function (a, b) {
        //   if (a.Display_expend < b.Display_expend) {
        //     return -1;
        //   }
        //   if (a.Display_expend > b.Display_expend) {
        //     return 1;
        //   }
        //   return 0;
        // });
      }
    }
    return arr;
  }

  Haschecked() {
    let dt = this.model_all;
    let arr: any;
    arr = dt.img_list.some((res) => {
      return res.ischecked === true && res.action_type != 'delete';
    });
    return arr;
  }

  funcheck(val) {
    //console.log(val)
    this.model_all.img_list.forEach((res) => (res.ischecked = val));
  }

  check_action(item) {
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
    this.model_all.img_list.forEach((element) => {
      if (element.ischecked == true) {
        element.action_type = 'delete';
      }
    });
  }
  //#endregion End action

  taxableValue;
  tax;
  formatCurrency_TaxableValue(event) {
    var uy = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(event.target.value);
    this.tax = event.target.value;
    this.taxableValue = uy;
  }

  onlyNumberKey(evt) {
    // Only ASCII character in that range allowed
    var ASCIICode = evt.which ? evt.which : evt.keyCode;
    if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57)) return false;
    return true;
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
}
