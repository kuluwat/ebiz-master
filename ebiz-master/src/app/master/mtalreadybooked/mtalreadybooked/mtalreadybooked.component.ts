import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, forwardRef, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { MainComponent } from 'src/app/components/main/main.component';
import { FileuploadserviceService } from 'src/app/master/ws/fileuploadservice/fileuploadservice.service';
import { AspxserviceService } from 'src/app/master/ws/httpx/aspxservice.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { MaintainComponent } from '../../maintain/maintain/maintain.component';

import { MasterComponent } from '../../master/master.component';
import { AlertServiceService } from 'src/app/services/AlertService/alert-service.service';
declare var $: any;
@Component({
  selector: 'app-mtalreadybooked',
  templateUrl: './mtalreadybooked.component.html',
  styleUrls: ['./mtalreadybooked.component.css'],
})
export class MtalreadybookedComponent implements OnInit {
  @ViewChild('closeModel', { static: true }) btnCloseX: ElementRef;
  action_stage = {
    action_save: 'SaveFeedback',
    action_load: 'LoadFeedback',
    master: 'LoadMasterData',
    master_save: 'SaveMasterData',
  };
  master_data = {
    already_booked: [],
  };

  model_all: any = { ...this.master_data };

  model_all_def: any = { ...this.master_data };
  action_delete = [];
  accept_true: boolean = false;
  doc_id: any;
  pagename = 'transportation';
  emp_id: any;
  selectfile: File;
  list_emp: string;
  select_user: any;
  totalgantotal: number = 0;
  car_selected_val = 'personal_car';
  checkall_selected: boolean = false;
  feedback_type_id_selected = '1';
  user_reject: boolean = false;
  user_display: string = '';
  tp_clone: TemplateRef<any>;
  modalRef: BsModalRef;
  obj_save: any;
  x_text: any;
  panel = {
    show: true,
    after: false,
  };
  ischeck = false;
  Already_Booked_type_selected = {
    name: null,
    status: '',
    id: null,
    action: false,
  };

  constructor(
    @Inject(forwardRef(() => MaintainComponent)) private Appmain: MaintainComponent,
    private modalService: BsModalService,
    private http: HttpClient,
    private ws: AspxserviceService,
    private fileuploadservice: FileuploadserviceService,
    private alerts: AlertServiceService
  ) {}

  ngOnInit() {
    this.doc_id = this.Appmain.DOC_ID;
    //console.log(this.doc_id)
    this.Onload();
    $('mat-tab-header.mat-tab-header').hide();
  }
  onResize(ev) {
    //console.log(ev)
    this.x_text = 2;
  }
  //#region get data form API
  get_data_master(): Observable<any> {
    var BodyX = {
      token_login: localStorage['token_login'],
      page_name: 'airticket',
      module_name: 'master already booked',
    };
    var already_type = this.ws.callWs(BodyX, this.action_stage.master);

    return forkJoin(already_type);
  }

  get_one_data(type): Observable<any> {
    if (type == 'master_type') {
      var BodyX = {
        token_login: localStorage['token_login'],
        page_name: 'feedback',
        module_name: 'master feedback type',
      };
      var feedback_type = this.ws.callWs(BodyX, this.action_stage.master);
      return forkJoin(feedback_type);
    }
    if (type == 'master_topic') {
      var BodyXx = {
        token_login: localStorage['token_login'],
        page_name: 'feedback',
        module_name: 'master feedback list',
      };
      var feedback_list = this.ws.callWs(BodyXx, this.action_stage.master);
      return forkJoin(feedback_list);
    }
    if (type == 'master_question') {
      var BodyXxx = {
        token_login: localStorage['token_login'],
        page_name: 'feedback',
        module_name: 'master feedback type',
      };
      BodyXxx.module_name = 'master feedback question';

      var feedback_detail = this.ws.callWs(BodyXxx, this.action_stage.master);
      return forkJoin(feedback_detail);
    }
  }
  convert_bool(data) {
    if (data.length > 0) {
      data.forEach((el) => {
        el['statusTF'] = el.status == '1' ? true : false;
      });
    }
  }
  async Onload() {
    this.Appmain.isLoading = true;
    await this.get_data_master().subscribe(
      (data) => {
        console.log(data);
        this.convert_bool(data[0].already_booked);
        this.obj_save = { ...data[0] };
        this.master_data.already_booked = data[0].already_booked;
      },
      (err) => {
        this.Appmain.isLoading = false;
        console.log(err);
      },
      () => {
        this.Appmain.isLoading = false;
        this.model_all_def = { ...this.master_data };
        this.model_all = this.master_data;
        // update_filde

        console.log(this.model_all);
      }
    );
  }
  //#endregion

  //#region  plungin

  swal_confrim(type_data = 'data', type_action = 'delete') {
    var txt = '';
    if (type_action == 'delete') {
      txt = 'Do you want to ' + type_action + ' ?';
    } else {
      txt = 'Do you want to ' + type_action + ' the ' + type_data + ' ?';
    }
    if (type_action == 'delete') {
      return this.alerts.swal_confrim_delete('');
    } else {
      return this.alerts.swal_confrim_changes('');
    }
  }
  Swalalert(msg, type) {
    //type = success,error,warning,info
    if (type == 'success') {
      this.alerts.swal_sucess(msg);
    }
    if (type == 'error') {
      this.alerts.swal_error(msg);
    }
    if (type == 'warning') {
      this.alerts.swal_warning(msg);
    }
    if (type == 'info') {
      this.alerts.swal_info(msg);
    }
  }
  openModal(template: TemplateRef<any>) {
    this.tp_clone = template;
    let config: object = {
      class: 'modal-md',
      animated: true,
      keyboard: false,
      ignoreBackdropClick: true,
    };

    this.modalRef = this.modalService.show(template, config);
  }
  //#endregion

  onKeyDown(event) {
    console.log(event);
    if (event.key == '9') {
      this.model_all.user_admin = !this.model_all.user_admin;
    }
    if (event.key == '8') {
      this.user_reject = !this.user_reject;
    }
  }
  swich_user(x) {
    this.model_all.user_admin = !this.model_all.user_admin;
  }

  //#region ACTION
  check_el(el) {
    //  && (el.dirty)|| el.touched
    // return (this.vaildator_save && !this.validator_check) && el.invalid
    return el.invalid && this.ischeck;
  }
  get_max_id(ds): number {
    if (ds.length > 0) {
      var dt = ds
        .map((res) => {
          if (res.action_type != 'delete') {
          }
          return parseInt(res.id);
        })
        .sort((a, b) => {
          return a - b;
        });

      return dt[dt.length == 1 ? 0 : dt.length - 1];
    }
  }

  change_status(type_checked, item) {
    this.swal_confrim('change', 'save').then((val) => {
      if (val.isConfirmed == true) {
        if (item.statusTF) {
          item.status = '1';
          item.action_change = 'true';
        } else {
          item.status = '0';
          item.action_change = 'true';
        }
        if (type_checked == 'type') {
          this.Onsave('saved');
        }
      } else {
        item.statusTF = !item.statusTF;
        if (item.statusTF) {
          item.status = '1';
        } else {
          item.status = '0';
        }
      }
    });
  }

  //Type
  new_row() {
    var obj = this.Already_Booked_type_selected;
    var dt = [];
    var ds_detail = this.model_all.already_booked;
    var max_id = (this.get_max_id(ds_detail) + 1).toString();
    var validator = obj.name == '' || obj.name == null;
    this.ischeck = true;
    console.log(max_id);

    if (validator) {
      return;
    }
    //ต่อท้าย row

    ds_detail.push({
      token_login: null,
      data_type: null,
      user_admin: false,
      id_main: null,
      id_sub: null,
      id: max_id,
      name: obj.name,
      description: null,
      status: obj.status,
      sort_by: '',
      page_name: 'airticket',
      module_name: 'master already booked',
      question_other: null,
      action_type: 'insert',
      action_change: 'true',
    });

    this.clear_type();
    console.log(ds_detail);
    this.modalRef.hide();
    this.ischeck = false;
    this.Onsave('saved', 'new_row');
    //run number sort_by
    // var irow = 1;
    // this.model_all.detail_feedback.forEach(el => {
    //   if(el.id_main ==  rowquestion.id_main && el.id_sub ==  rowquestion.id_sub){
    //     el.sort_by = irow;
    //     irow++;
    //   }
    // });
  }
  //delete_row_type
  delete_row(item) {
    this.swal_confrim().then((res) => {
      if (res.isConfirmed == true) {
        item.action_type = 'delete';
        item.action_change = 'true';
        this.Onsave('saved', 'delete');
      } else {
      }
    });
  }
  //clear feedback_type
  clear_type() {
    this.Already_Booked_type_selected = {
      name: null,
      status: '',
      id: null,
      action: false,
    };
  }
  //update selected_type_now
  selected_type_now(row_type, tem) {
    this.Already_Booked_type_selected = {
      name: row_type.name,
      status: row_type.status,
      id: row_type,
      action: true,
    };
    this.openModal(tem);
  }
  // update_row_type
  update_row() {
    var obj = this.Already_Booked_type_selected;
    var validator = obj.name == '' || obj.name == null;
    this.ischeck = true;
    if (validator) {
      return;
    }
    this.Already_Booked_type_selected.id.name = this.Already_Booked_type_selected.name;
    this.Already_Booked_type_selected.id.status = this.Already_Booked_type_selected.status;
    this.Already_Booked_type_selected.id.action_change = 'true';
    this.clear_type();
    this.modalRef.hide();
    this.Onsave('saved');
    this.ischeck = false;
  }
  Hide_modal() {
    var souces = this;
    window.setTimeout(function () {
      souces.clear_type();
    }, 1000);
    this.modalRef.hide();
  }

  //#endregion
  get_index_question(ds, row_type, row_question) {
    if (ds.length > 0) {
      return ds.findIndex((res) => {
        return res.id_main == row_question.id_main && res.id_sub == row_question.id_sub && res.id == row_question.id;
      });
    }
    return false;
  }

  def_data(data) {
    this.model_all = data;
    this.model_all_def = { ...data };
  }
  check_solution() {
    var width_solution = $(document).width();

    if (width_solution < 576) {
      return true;
    }
    return true;
  }
  Onsave(btn_type, type?) {
    if (btn_type == 'saved') {
      if (true) {
        this.Appmain.isLoading = true;
        const OnsaveSucecss = (data) => {
          this.Appmain.isLoading = false;
          console.log(data);
          if (data.after_trip.opt1 == 'true') {
            if (data.after_trip.opt2.status != 'Update data successfully.') {
              data.after_trip.opt2.status = 'Update data successfully.';
            }
            if (type == 'delete') {
              this.Swalalert('Delete data successfully', 'success');
            } else {
              if (type == 'new_row') {
              } else {
                this.Swalalert(data.after_trip.opt2.status, 'success');
              }
            }
            //data.data_type = null;
            this.convert_bool(data.already_booked);
            this.model_all.already_booked = data.already_booked;
            this.obj_save.data_type = null;
            this.obj_save.already_booked = [];
          } else {
            console.log(data);
            this.Swalalert(data.after_trip.opt2.status, 'error');
            this.Onload();
            //this.model_all.already_booked  = {...this.model_all_def.already_booked}
          }
        };

        this.obj_save.data_type = 'save';
        this.obj_save.already_booked = this.model_all.already_booked;
        this.obj_save.module_name = 'master already booked';

        var bodyX = this.obj_save;

        console.log(bodyX);
        this.Appmain.isLoading = false;

        this.ws.callWs(bodyX, this.action_stage.master_save).subscribe(
          (res) => OnsaveSucecss(res),
          (error) => {
            this.Appmain.isLoading = false;

            console.log(error);
          },
          () => {}
        );
      }
    } else {
      //submit
    }
  }

  clearselection(emp_id, ik) {
    this.model_all.emp_list.forEach((res, i) => {
      this.model_all.emp_list[i].isEdit = false;
      if (res.emp_id == emp_id) {
        this.model_all.emp_list[i].isEdit = true;
      }
    });
  }
  runnumber() {
    let feedback_type_id_checked = this.feedback_type_id_selected;
    var ir = 1;
    this.model_all.feedback_topic_list.forEach((res) => {
      this.model_all.feedback_detail.forEach((child) => {
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
  DataBYTYPEID(ds, topic_id, type?) {
    //this.runnumber();

    let dt = [];
    // console.log(this.emp_id)

    if (type == 'master_type') {
      dt = ds.filter((res) => res.action_type != 'delete');
    }

    return dt;
  }
  DataBYCARID(topic_id) {
    //this.runnumber();
    let feedback_type_id_checked = this.feedback_type_id_selected;

    // console.log(this.emp_id)
    let dt = this.model_all.detail_feedback.filter(
      (res) => res.id_sub == topic_id && res.id_main == feedback_type_id_checked && res.action_type != 'delete'
    );
    //console.log(this.model_all)
    //console.log(dt)
    return dt;
  }
  check_action(item) {
    if (item.action_type == 'delete') {
      return true;
    }
    if (item.filename == null || item.filename == '') {
      return true;
    }
    return false;
  }
}
