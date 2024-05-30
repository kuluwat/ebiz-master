import { HttpClient } from '@angular/common/http';
import {
  AfterContentInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  forwardRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MainComponent } from '../../../main/main.component';
import { FileuploadserviceService } from '../../../ws/fileuploadservice/fileuploadservice.service';
import { AlertServiceService } from '../../../services/AlertService/alert-service.service';
import { AspxserviceService } from '../../../ws/httpx/aspxservice.service';
import { MasterComponent } from '../master.component';
import { InitTrackStatus, TrackingStatus, TrackingStatusNumber } from '../../../model/localstorage.model';
import { getBoolean, useAuth } from '../../../function/globalfunction.component';
declare var $: any;

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css'],
})
export class FeedbackComponent implements OnInit {
  @ViewChild('closeModel', { static: true }) btnCloseX?: ElementRef;
  action_stage = {
    action_save: 'SaveFeedback',
    action_load: 'LoadFeedback',
    action_load_doc: 'LoadDoc',
  };

  model_all : any = {
    token_login: 'ssssxx',
    doc_id: 'D001',
    data_type: '',
    id: '1',
    user_admin: false,
    feedback_detail: [],
    emp_list: [],
    feedback_type_master: [
      {
        id: '1',
        name: 'Business Trip',
        action_type: null,
      },
      {
        id: '2',
        name: 'Training/Development',
        action_type: null,
      },
    ],
    feedback_topic_list: [{
      id:'',
      show:'',
      name:''
    }],
    after_trip: {
      opt1: 'true',
      opt2: {
        status: 'Submit Succesed.',
        remark: '',
      },
      opt3: {
        status: null,
        remark: '',
      },
    },
  };

  CarType: any[] = [
    { name: 'Company Car', code: 'company_car' },
    { name: 'Personal Car', code: 'personal_car' },
  ];
  model_all_def = { ...this.model_all };
  action_delete = [];
  accept_true: boolean = false;
  doc_id: any;
  pagename = 'transportation';
  emp_id: any;
  selectfile: File = null!;
  list_emp: string = '';
  select_user: any;
  userDetail: any;
  pathPhase1: any;
  totalgantotal: number = 0;
  car_selected_val = 'personal_car';
  checkall_selected: boolean = false;
  feedback_type_id_selected = '1';
  user_reject: boolean = false;
  user_display: string = '';
  panel = {
    show: true,
    after: false,
  };
  TrackingStatus: TrackingStatus = { ...InitTrackStatus };
  addClass: boolean = false;
  Arr_emp_list : any;
  TRAVEL_TYPE: string = '';
  profile: any;
  user_admin = false;
  constructor(
    @Inject(forwardRef(() => MasterComponent)) private Appmain: MasterComponent,
    private http: HttpClient,
    private ws: AspxserviceService,
    private fileuploadservice: FileuploadserviceService,
    private alerts: AlertServiceService,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit() {
    console.clear();

    console.log(this.Appmain);
    this.doc_id = this.Appmain.DOC_ID;
    this.OnloadDoc();
    this.Onload();
    console.log(this.addClass);
    this.addClass = true;
  }

  ngAfterViewChecked() {
    //your code to update the model // ใช้สำหรับ re-rendered กรณีไป update view แล้วเข้า lifecycle นี้จะ error
    this.changeDetector.detectChanges();
  }
  // get UserDetail() {
  //   // const emp_list = this.model_all.emp_list.filter((item) => item.emp_id === this.emp_id);

  //   if (emp_list[0].hasOwnProperty('show_button')) {
  //     // this.user_reject = emp_list[0].show_button;
  //     if (emp_list[0].status_trip_cancelled === 'true') {
  //       this.user_reject = false;
  //     }
  //   } else {
  //     this.user_reject = false;
  //   }
  //   return emp_list;
  // }
  onKeyDown(event : any) {
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
  swich_user(x: any) {
    this.model_all.user_admin = !this.model_all.user_admin;
  }
  get_index_by_emp(ds: { emp_id: any }[], emp_id: any, id?: any) {
    if (ds.length > 0) {
      return ds.findIndex((res) => {
        return res.emp_id == emp_id;
      });
    }
    return false;
}
  async update_userByDOC(values : any, select : any) {
    var check_detail = this.model_all.feedback_detail.some(
      (res : any) => res.action_change == 'true' && res.emp_id == this.emp_id
    );
    //เมือเปลียน user และ มีการแก้ไขข้อมูล
    if (check_detail) {
      const { isConfirmed } = await this.alerts.swal_confirm_changes('Do you want to save the document ?');
      if (isConfirmed == true) {
        this.Onsave('saved');
        this.user_display = select.triggerValue;
        this.emp_id = this.list_emp;
      } else {
        // กรณี cancle ต้องดึงข้อมูลใหม่
        this.Onload();
        this.user_display = select.triggerValue;
        this.emp_id = this.list_emp;
      }
    } else {
      this.user_display = select.triggerValue;
      this.emp_id = this.list_emp;
    }
    //console.log(this.list_emp);
    var i = this.get_index_by_emp(this.model_all.emp_list, this.emp_id);
    // if (this.model_all.emp_list[i].hasOwnProperty('show_button')) {
    //   this.user_reject = this.model_all.emp_list[i].show_button;
    // } else {
    //   this.user_reject = false;
    // }

    this.Arr_emp_list.forEach((e : any) => {
      if (e.emp_id == values) {
        e.mail_status = 'true';
      } else {
        e.mail_status = 'false';
      }
    });
    console.log('x');
    this.Appmain.userSelected = this.emp_id;
    // this.userDetail = this.UserDetail[0];
    this.TrackingStatus = { ...InitTrackStatus };
  }
  // get docStatus() {
  //   return (Status: number) => {
  //     let emp_id = this.emp_id;
  //     let id:  = 1;
  //     if (this.model_all.emp_list.length > 0) {
  //       // TEST
  //       // this.emp_list.forEach((i) => (i.doc_status_id = '2'));
  //       let dt = this.model_all.emp_list.find((item) => item.emp_id === emp_id);
  //       if (dt) {
  //         id = Number(dt.doc_status_id);
  //         if (Status === id) {
  //           this.TrackingStatus[Status] = true;
  //         }
  //       }
  //     }
  //     return this.TrackingStatus[Status];
  //   };
  // }

  get docStatus() {
    return (Status: number) => {
      // return this.TrackingStatus[Status];
      let emp_id = this.emp_id;
      // console.log(emp_id);
      // return this.TrackingStatus[Status];
      let id: TrackingStatusNumber = 1;
      if (this.model_all.emp_list.length > 0) {
        // TEST
        // this.emp_list.forEach((i) => (i.doc_status_id = '2'));
        let dt : any = this.model_all.emp_list.find((item : any) => item.emp_id === emp_id);
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
  uploadFile(ev : any) {
    this.Appmain.isLoading = true;
    //File
    this.selectfile = <File>ev.files[0];
    let Jsond = {
      file: this.selectfile,
      doc_id: this.doc_id,
      pagename: this.pagename,
      emp_id: this.emp_id,
      file_token_login: localStorage['token'],
    };
    //console.log(Jsond);

    const onSuccess = (res : any) => {
      this.Appmain.isLoading = false;
      //console.log(res);
      let status_res = res.after_trip;

      if (status_res.opt1 == 'true') {
        alert(status_res.opt2.status);
      } else {
        alert(status_res.opt2.status);
      }
      this.selectfile = null!;
    };

    this.fileuploadservice
      .postFilePhase2(this.selectfile, this.doc_id, this.pagename, this.emp_id, Jsond.file_token_login)
      .subscribe(
        (res) => onSuccess(res),
        (error) => {
          this.Appmain.isLoading = false;
          console.log(error);
          alert('error!');
        },
        () => {
          if (this.checkall_selected) {
          }
        }
      );
  }
  async OnloadDoc() {
    this.profile = await this.CheckLogin();

    // this.Appmain.isLoading = true;
    var BodyX = {
      token_login: localStorage['token'],
      doc_id: this.doc_id,
    };

    const onSuccess = (data : any) => {
      let TravelTypeDoc = /local/g.test(this.Appmain.TRAVEL_TYPE);
      this.TRAVEL_TYPE = TravelTypeDoc ? 'Province/City/Location :' : 'Country / City  :';
      const { tab_no } = data.up_coming_plan[0];
      this.pathPhase1 = tab_no ? tab_no : '1';
      console.log('loadDoc');
      console.log(data);
      console.log(this.pathPhase1);
    };
    this.ws.callWs(BodyX, this.action_stage.action_load_doc).subscribe(
      onSuccess,
      (error) => console.log(error),
      () => {}
    );
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
  Onload() {
    this.Appmain.isLoading = true;
    const onSuccess = (data : any) => {
      this.Appmain.isLoading = false;
      const doc_type_text = data.doc_type_text;
      this.feedback_type_id_selected = data.feedback_for;
      console.log(' onload data ');
      console.log(data);
      data.feedback_topic_list.forEach((element : any) => {
        element['show'] = true;
      });

      console.log('onload');
      console.log(data);
      var user_cur = data.emp_list[0];
      this.model_all_def = { ...data };
      this.model_all = data;
      this.Arr_emp_list = data.emp_list;
      if (data.user_admin) {
        let userSelect = this.Appmain.userSelected;
        const { emp_id, userSelected, status_trip_cancelled } : any = useAuth(data, userSelect);
        this.list_emp = emp_id;
        if (this.emp_id) {
        } else {
          this.emp_id = emp_id;
        }

        this.Appmain.userSelected = userSelected;
        this.user_reject = getBoolean(status_trip_cancelled) ? false : true;
        this.user_admin = true;
      } else {
        //@ts-ignore
        // const { profile } = this.Appmain.appHeader;
        // this.list_emp = profile.emp_id;
        // user_cur = profile;
        // this.user_display = user_cur.username;
        this.user_admin = false;
        const { profile } = { profile: this.profile[0] };
        this.list_emp = profile.empId;
        this.emp_id = profile.empId;
        user_cur = profile;
        this.user_display = profile.empName;
        console.log(user_cur);
        console.log(this.list_emp);
        let finduser = data.emp_list.find(({ emp_id } : any) => emp_id === profile.empId);
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
            if (this.emp_id) {
            } else {
              this.emp_id = data.emp_list[0].emp_id;
            }
            this.Appmain.userSelected = data.emp_list[0].emp_id;
            this.list_emp = this.emp_id;
          }
        }
      }
      // this.user_display = data.emp_list[0].userDisplay;
      // if (data.emp_list[0].hasOwnProperty('show_button')) {
      //   this.user_reject = data.emp_list[0].show_button;
      // } else {
      //   this.user_reject = false;
      // }
      //this.user_reject = false;
      this.doc_id = data.doc_id;
      // this.emp_id = user_cur.empId;
      this.userDetail = this.userDetail[0];
    };

    var BodyX = {
      token_login: localStorage['token'],
      doc_id: this.doc_id,
    };
    console.log(' BodyX ');
    console.log(BodyX);
    this.ws.callWs(BodyX, this.action_stage.action_load).subscribe(
      (data) => onSuccess(data),
      (error) => (this.Appmain.isLoading = false),
      () => {
        if (this.model_all.feedback_topic_list.length < 1) {
          this.model_all.feedback_topic_list = [];
          let dt = this.model_all.feedback_detail
            .filter((res : any, i : any, ds : any) => {
              return (
                i ==
                ds.findIndex((ir : any) => {
                  return ir.topic_id === res.topic_id;
                })
              );
            })
            .map((v : any) => {
              return {
                id: v.topic_id,
                name: v.topic_name,
                action_type: null,
                sort_by: '',
                show: true,
              };
            });

          // this.model_all.feedback_topic_list = dt;
        }
        //console.log(dt)
      }
    );
  }
  setClass(evRefP : any, evRefSmall : any, evcontainer : any, ellength : any) {
    // const { clientWidth: Reftagp } = evRefP;
    // const { clientWidth: Reftagsmall } = evRefSmall;
    // const { clientWidth: Reftagcontainer } = evcontainer;
    if (!ellength) {
      return '';
    }
    let classname = '';
    let textWarp = false;
    if (!evRefP || !evRefSmall || !evcontainer) {
      return '';
    }
    if (evRefP + evRefSmall > evcontainer) {
      textWarp = true;
    } else {
      return '';
    }
    if (textWarp) {
      if (ellength > 1) {
        classname = 'px-4';
      } else if (ellength <= 1) {
        classname = 'px-3';
      } else {
        classname = '';
      }
    }

    return classname;

    // return classname;
  }
  async Onload_status_cancle() {
    const { isConfirmed } = await this.alerts.swal_confirm_changes('Do you want to cancel the document ?');
    if (isConfirmed) {
      this.Appmain.isLoading = true;
      const onSuccess = (data : any) => {
        this.Appmain.isLoading = false;

        data.feedback_topic_list.forEach((element : any) => {
          element['show'] = true;
        });

        console.log(data);
        //ขาด เช็ค  user emp_id
        //var user_cur = data.emp_list[0];
        this.model_all_def = { ...data };
        this.model_all = data;

        this.user_display = data.emp_list[0].userDisplay;
        // if (data.emp_list[0].hasOwnProperty('show_button')) {
        //   this.user_reject = data.emp_list[0].show_button;
        // } else {
        //   this.user_reject = false;
        // }
        //this.user_reject = false;
        this.doc_id = data.doc_id;
        //this.emp_id = user_cur.emp_id;
        this.alerts.swal_success('Successfully canceled');
      };

      var BodyX = {
        token_login: localStorage['token'],
        doc_id: this.doc_id,
      };

      this.ws.callWs(BodyX, this.action_stage.action_load).subscribe(
        (data) => onSuccess(data),
        (error) => (this.Appmain.isLoading = false),
        () => {
          //กรณีไม่มีข้อมูล ให้ สร้าง data def
          if (this.model_all.feedback_topic_list.length < 1) {
            this.model_all.feedback_topic_list = [];
            let dt = this.model_all.feedback_detail
              .filter((res : any, i : any, ds : any) => {
                return (
                  i ==
                  ds.findIndex((ir : any) => {
                    return ir.topic_id === res.topic_id;
                  })
                );
              })
              .map((v : any) => {
                return {
                  id: v.topic_id,
                  name: v.topic_name,
                  action_type: null,
                  sort_by: '',
                  show: true,
                };
              });

            // this.model_all.feedback_topic_list = dt;
          }
        }
      );
    }
  }
  update_data(update_answer : any, updae_action : any) {
    return true;
  }
  def_data(data : any) {
    this.model_all = data;
    this.model_all_def = { ...data };
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
      if (ex instanceof Error) {
        console.log(ex.message.toString());
      }
    }
  }
  async Onsave(btn_type : any) {
    let feedback_detail = this.model_all.feedback_detail;
    if (feedback_detail.length > 0) {
      for (let item of feedback_detail) {
        // item.action_change = 'true';
      }
    }

    if (btn_type == 'saved') {
      if (true) {
        this.Appmain.isLoading = true;
        const OnsaveSucecss = (data : any) => {
          this.Appmain.isLoading = false;
          console.log('before after');
          console.log(bodyX);
          if (data.after_trip.opt1 == 'true') {
            if (data.after_trip.opt2.status != 'Update data successfully.') {
              data.after_trip.opt2.status = 'Update data successfully.';
            }
            this.alerts.swal_success(data.after_trip.opt2.status);
            data.data_type = null;

            try {
              var i : any = this.get_index_by_emp(data.emp_list, this.emp_id);
              // if (this.model_all.emp_list[i].hasOwnProperty('show_button')) {
              //   this.user_reject = data.emp_list[i].show_button;
              // } else {
              //   this.user_reject = false;
              // }
            } catch (ex) {
              this.user_reject = false;
            }
            this.def_data(data);
            //console.log(this.model_all)
          } else {
            if (data.after_trip.opt2.status == null) {
              data.after_trip.opt2.status = 'Error';
            }
            this.alerts.swal_error(data.after_trip.opt2.status);
          }
        };
        var bodyX = this.model_all;
        bodyX.emp_list = this.Arr_emp_list;
        console.log('before save');
        console.log(bodyX);

        this.ws.callWs(bodyX, this.action_stage.action_save).subscribe(
          (res) => OnsaveSucecss(res),
          (error) => {
            this.Appmain.isLoading = false;
            console.log(error);
          },
          () => {
            if (this.model_all.feedback_topic_list.length < 1) {
              this.model_all.feedback_topic_list = [];
              let dt = this.model_all.feedback_detail
                .filter((res : any, i : any, ds : any) => {
                  return (
                    i ==
                    ds.findIndex((ir : any) => {
                      return ir.topic_id === res.topic_id;
                    })
                  );
                })
                .map((v : any) => {
                  return {
                    id: v.topic_id,
                    name: v.topic_name,
                    action_type: null,
                    sort_by: '',
                    show: true,
                  };
                });
              this.TrackingStatus = { ...InitTrackStatus };
              // this.model_all.feedback_topic_list = dt;
            }
          }
        );
      }
    } else {
      //submit
      //action_save: "SaveFeedback",
      const actionSave = await this.alerts.swal_confirm_changes('Do you want to submit the document ?');
      if (actionSave.isConfirmed) {
        this.Appmain.isLoading = true;
        const OnsaveSucecss = (data : any) => {
          this.Appmain.isLoading = false;
          console.log('after save');
          console.log(data);
          if (data.after_trip.opt1 == 'true') {
            if (data.after_trip.opt2.status != 'Successfully submit') {
              data.after_trip.opt2.status = 'Successfully submit';
            }
            this.alerts.swal_success(data.after_trip.opt2.status);
            data.data_type = null;

            try {
              var i : any = this.get_index_by_emp(data.emp_list, this.emp_id);
              // if (this.model_all.emp_list[i].hasOwnProperty('show_button')) {
              //   this.user_reject = data.emp_list[i].show_button;
              // } else {
              //   this.user_reject = false;
              // }
            } catch (ex) {
              this.user_reject = false;
            }
            this.def_data(data);
            //console.log(this.model_all)
          } else {
            if (data.after_trip.opt2.status == null) {
              data.after_trip.opt2.status = 'Error';
            }
            this.alerts.swal_error(data.after_trip.opt2.status);
          }
        };
        var bodyX = this.model_all;
        bodyX.data_type = 'submit';
        bodyX.emp_list = this.Arr_emp_list;
        //console.log(this.model_all);
        console.log('before save');
        console.log(bodyX);
        this.ws.callWs(bodyX, this.action_stage.action_save).subscribe(
          (res) => OnsaveSucecss(res),
          (error) => {
            this.Appmain.isLoading = false;
            console.log(error);
          },
          () => {
            if (this.model_all.feedback_topic_list.length < 1) {
              this.model_all.feedback_topic_list = [];
              let dt = this.model_all.feedback_detail
                .filter((res : any, i : any, ds : any) => {
                  return (
                    i ==
                    ds.findIndex((ir : any) => {
                      return ir.topic_id === res.topic_id;
                    })
                  );
                })
                .map((v : any) => {
                  return {
                    id: v.topic_id,
                    name: v.topic_name,
                    action_type: null,
                    sort_by: '',
                    show: true,
                  };
                });
              this.TrackingStatus = { ...InitTrackStatus };
              // this.model_all.feedback_topic_list = dt;
            }
          }
        );
      }
    }
  }

  check_user() {
    let dt = this.model_all;
    let dt_old = this.model_all_def;
  }
  clearselection(emp_id : any, ik : any) {
    this.model_all.emp_list.forEach((res : any, i : any) => {
      // this.model_all.emp_list[i].isEdit = false;
      if (res.emp_id == emp_id) {
        // this.model_all.emp_list[i].isEdit = true;
      }
    });
  }
  runnumber() {
    let feedback_type_id_checked = this.feedback_type_id_selected;
    var ir = 1;
    this.model_all.feedback_topic_list.forEach((res : any) => {
      this.model_all.feedback_detail.forEach((child : any) => {
        if (
          this.emp_id == child.emp_id &&
          child.feedback_type_id == feedback_type_id_checked &&
          res.id == child.topic_id
        ) {
          child.no = ir.toString();
          ir++;
        }
      });
    });
  }
  DataBYCARID(topic_id : any) {
    this.runnumber();
    let feedback_type_id_checked = this.feedback_type_id_selected;

    let dt = this.model_all.feedback_detail.filter(
      (res : any) => res.topic_id == topic_id && res.feedback_type_id == feedback_type_id_checked && res.emp_id == this.emp_id
    );
    return dt;
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

  OnCencel() {
    this.alerts.swal_confirm('Do you want to cancel the document ?', '', 'question').then((val) => {
      if (val.isConfirmed == true) {
        this.Onload();
      } else {
      }
    });
  }
}
