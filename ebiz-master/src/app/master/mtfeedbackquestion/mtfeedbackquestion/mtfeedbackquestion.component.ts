import { HttpClient } from "@angular/common/http";
import {
  Component,
  ElementRef,
  forwardRef,
  Inject,
  OnInit,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { Observable, forkJoin } from "rxjs";
import { FileuploadserviceService } from "src/app/master/ws/fileuploadservice/fileuploadservice.service";
import { AspxserviceService } from "src/app/master/ws/httpx/aspxservice.service";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { MaintainComponent } from "../../maintain/maintain/maintain.component";
import { AlertServiceService } from "src/app/services/AlertService/alert-service.service";
declare var $: any;
declare var toastr: any;
@Component({
  selector: "app-mtfeedbackquestion",
  templateUrl: "./mtfeedbackquestion.component.html",
  styleUrls: ["./mtfeedbackquestion.component.css"],
})
export class MtfeedbackquestionComponent implements OnInit {
  @ViewChild("closeModel", { static: true }) btnCloseX: ElementRef;
  action_stage = {
    action_save: "SaveFeedback",
    action_load: "LoadFeedback",
    master: "LoadMasterData",
    master_save: "SaveMasterData",
  };
  master_data = {
    type_feedback: [
      {
        id: "1",
        name: "Business Trip",
        action_type: null,
      },
      {
        id: "2",
        name: "Training/Development",
        action_type: null,
      },
    ],
    list_feedback: [],
    detail_feedback: [],
  };

  model_all: any = { ...this.master_data };

  model_all_def: any = { ...this.master_data };
  action_delete = [];
  accept_true: boolean = false;
  doc_id: any;
  pagename = "transportation";
  emp_id: any;
  selectfile: File;
  list_emp: string;
  select_user: any;
  totalgantotal: number = 0;
  car_selected_val = "personal_car";
  checkall_selected: boolean = false;
  feedback_type_id_selected = "1";
  user_reject: boolean = false;
  user_display: string = "";
  tp_clone: TemplateRef<any>;
  modalRef: BsModalRef;
  obj_save: any;
  x_text: any;
  panel = {
    show: true,
    after: false,
  };

  Feedback_type_selected = {
    name: null,
    status: "",
    id: null,
    action: false,
  };

  Feedback_topic_selected = {
    name: null,
    status: "",
    id: null,
    action: false,
  };

  mat_tab_selected = {
    feedback_type: true,
    feedback_topic: false,
    feedback_question: false,
  };
  ischeck = false;
  constructor(
    @Inject(forwardRef(() => MaintainComponent))
    private Appmain: MaintainComponent,
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
    $("mat-tab-header.mat-tab-header").hide();
  }
  //#region get data form API
  get_data_master(): Observable<any> {
    var BodyX = {
      token_login: localStorage["token_login"],
      page_name: "feedback",
      module_name: "master feedback type",
    };
    var feedback_type = this.ws.callWs(BodyX, this.action_stage.master);

    var BodyXx = {
      token_login: localStorage["token_login"],
      page_name: "feedback",
      module_name: "master feedback list",
    };
    var feedback_list = this.ws.callWs(BodyXx, this.action_stage.master);

    var BodyXxx = {
      token_login: localStorage["token_login"],
      page_name: "feedback",
      module_name: "master feedback type",
    };
    BodyXxx.module_name = "master feedback question";

    var feedback_detail = this.ws.callWs(BodyXxx, this.action_stage.master);

    return forkJoin(feedback_type, feedback_list, feedback_detail);
  }

  get_one_data(type): Observable<any> {
    if (type == "master_type") {
      var BodyX = {
        token_login: localStorage["token_login"],
        page_name: "feedback",
        module_name: "master feedback type",
      };
      var feedback_type = this.ws.callWs(BodyX, this.action_stage.master);
      return forkJoin(feedback_type);
    }
    if (type == "master_topic") {
      var BodyXx = {
        token_login: localStorage["token_login"],
        page_name: "feedback",
        module_name: "master feedback list",
      };
      var feedback_list = this.ws.callWs(BodyXx, this.action_stage.master);
      return forkJoin(feedback_list);
    }
    if (type == "master_question") {
      var BodyXxx = {
        token_login: localStorage["token_login"],
        page_name: "feedback",
        module_name: "master feedback type",
      };
      BodyXxx.module_name = "master feedback question";

      var feedback_detail = this.ws.callWs(BodyXxx, this.action_stage.master);
      return forkJoin(feedback_detail);
    }
  }
  updata_for_api(type) {
    this.Appmain.isLoading = true;
    this.get_one_data(type).subscribe(
      (data) => {
        console.log(data);
        if (type == "master_question") {
          this.convert_bool(data[0].feedback_question);
          this.master_data.detail_feedback = data[0].feedback_question;
        }
        if (type == "master_type") {
          this.convert_bool(data[0].feedback_type);
          this.master_data.type_feedback = data[0].feedback_type;
        }
        if (type == "master_topic") {
          this.convert_bool(data[0].feedback_list);
          this.master_data.list_feedback = data[0].feedback_list;
        }
      },
      (err) => {},
      () => {
        this.Appmain.isLoading = false;
      }
    );
  }
  convert_bool(data) {
    if (data.length > 0) {
      data.forEach((el) => {
        el["statusTF"] = el.status == "1" ? true : false;
      });
    }
    //return data
  }
  async Onload() {
    this.Appmain.isLoading = true;
    await this.get_data_master().subscribe(
      (data) => {
        this.obj_save = { ...data[0] };
        this.master_data.detail_feedback = data[2].feedback_question;
        this.convert_bool(data[1].feedback_list);
        this.master_data.list_feedback = data[1].feedback_list;
        this.convert_bool(data[0].feedback_type);
        this.master_data.type_feedback = data[0].feedback_type;
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
        if (this.model_all.list_feedback.length > 0) {
          this.obj_save.allowance_type = [];
          this.model_all.list_feedback.forEach((el) => {
            el["show"] = true;
          });
        }
        console.log(this.model_all);
      }
    );
  }
  //#endregion

  //#region  plungin

  swal_confrim_main(
    type_data = "data",
    type_action = "delete",
    master_type = "topic"
  ) {
    var txt = "";
    var title_sub = "";
    if (type_action == "delete") {
      txt = "Do you want to " + type_action + " ";
      title_sub += "but has data " + master_type + " ? ";
    } else {
      txt = "Do you want to " + type_action + " the " + type_data + " ?";
    }

    if(type_action == "delete"){
      return this.alerts.swal_confrim_delete("");
      }
      else{   return this.alerts.swal_confrim_changes("");}
   
  }
  swal_confrim_topic(type_data = "data", type_action = "delete") {
    var txt = "";
    if (type_action == "delete") {
      txt = "Do you want to " + type_action + " ";
      txt += "but has data question ? ";
    } else {
      txt = "Do you want to " + type_action + " the " + type_data + " ?";
    }

    if(type_action == "delete"){
      return this.alerts.swal_confrim_delete("");
      }
      else{   return this.alerts.swal_confrim_changes("");}
  }
  swal_confrim(type_data = "data", type_action = "delete") {
    var txt = "";
    if (type_action == "delete") {
      txt = "Do you want to " + type_action + " ?";
    } else {
      txt = "Do you want to " + type_action + " the " + type_data + " ?";
    }
    if(type_action == "delete"){
    return this.alerts.swal_confrim_delete("");
    }
    else{   return this.alerts.swal_confrim_changes("");}
    // return Swal.fire({
    //   title: txt,
    //   icon: "warning",
    //   showCancelButton: true,
    //   confirmButtonColor: "#3085d6",
    //   cancelButtonColor: "#d33",
    //   confirmButtonText: "Yes, " + type_action + " it!",
    //   stopKeydownPropagation: false,
    //   allowOutsideClick: false,
    // });
  }
  Swalalert(msg, type) {
    //type = success,error,warning,info
    if(type == "success"){
      this.alerts.swal_sucess(msg)
    }
    if(type == "error"){
      this.alerts.swal_error(msg)
    }
    if(type == "warning"){
      this.alerts.swal_warning(msg)
    }
    if(type == "info"){
      this.alerts.swal_info(msg)
    }
   
  }
  openModal(template: TemplateRef<any>) {
    this.tp_clone = template;
    let config: object = {
      class: "modal-md",
      animated: true,
      keyboard: false,
      ignoreBackdropClick: true,
    };

    this.modalRef = this.modalService.show(template, config);
  }
  Toastr(type: string, desciption = "Update data complete.") {
    toastr[type](desciption, "Sucess!", {
      showMethod: "slideDown",
      hideMethod: "slideUp",
      timeOut: 3000,
    });
  }
  //#endregion

  onKeyDown(event) {
    console.log(event);
    if (event.key == "9") {
      this.model_all.user_admin = !this.model_all.user_admin;
    }
    if (event.key == "8") {
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
          if (res.action_type != "delete") {
          }
          return parseInt(res.id);
        })
        .sort((a, b) => {
          return a - b;
        });

      return dt[dt.length == 1 ? 0 : dt.length - 1];
    }
  }
  onResize(ev){
    console.log(ev)
  }
  //question
  new_row(rowquestion, rowtype) {
    var dt = [];
    var ds_detail = this.model_all.detail_feedback;
    var max_id = (this.get_max_id(ds_detail) + 1).toString();

    if (false) {
      var insrow = this.get_index_question(ds_detail, "", rowquestion) + 1;
      // แทรก row
      ds_detail.splice(insrow, 0, {
        token_login: null,
        data_type: null,
        user_admin: false,
        id_main: rowquestion.id_main,
        id_sub: rowquestion.id_sub,
        id: max_id,
        name: "",
        description: "",
        status: "",
        sort_by: "",
        page_name: "feedback",
        module_name: "master feedback question",
        question_other: null,
        action_type: "insert",
        action_change: "true",
      });
    }

    //ต่อท้าย row
    ds_detail.push({
      token_login: null,
      data_type: null,
      user_admin: false,
      id_main: rowquestion.id_main,
      id_sub: rowquestion.id_sub,
      id: max_id,
      name: "",
      description: "",
      status: "",
      sort_by: "",
      page_name: "feedback",
      module_name: "master feedback question",
      question_other: null,
      action_type: "insert",
      action_change: "true",
    });
    //run number sort_by
    // var irow = 1;
    // this.model_all.detail_feedback.forEach(el => {
    //   if(el.id_main ==  rowquestion.id_main && el.id_sub ==  rowquestion.id_sub){
    //     el.sort_by = irow;
    //     irow++;
    //   }
    // });
  }

  async tabChanged(previous_type, tabRef, curindex) {
    // 0 = Feedback Type // no check
    // 1 = Feedback Topic  // check type
    // 2 = Feedback Questions" // check type and check topic

    let dt = {
      type: null,
      topic: null,
    };

    //TYPE
    if (curindex == 0) {
      dt["type"] = this.model_all.type_feedback;
      var check_action_type = dt.type.some(
        (res) => res.action_change == "true"
      );

      if (check_action_type) {
        await this.swal_confrim("data", "save").then((res) => {
          if (res.isConfirmed == true) {
            //tabRef.selectedIndex = 1
            //call function save
            this.Onsave_type("saved");
          } else {
            this.get_one_data("master_type").subscribe(
              (data) => {
                console.log(data);
                this.master_data.type_feedback = data[0].feedback_type;
              },
              (err) => {},
              () => {}
            );
          }
        });
      }
    }
    // TOPIC
    else if (curindex == 1) {
      dt["topic"] = this.model_all.list_feedback;
      var check_action_topic = dt.topic.some(
        (res) => res.action_change == "true"
      );

      if (check_action_topic) {
        await this.swal_confrim("data", "save").then((res) => {
          if (res.isConfirmed == true) {
            //tabRef.selectedIndex = 1
            //call function save
            this.Onsave_topic("saved");
          } else {
            this.get_one_data("master_topic").subscribe(
              (data) => {
                console.log(data);
                this.master_data.list_feedback = data[0].feedback_list;
              },
              (err) => {},
              () => {}
            );
          }
        });
      }
    }
    // QUESTION
    else {
      dt["type"] = this.model_all.type_feedback;
      dt["topic"] = this.model_all.list_feedback;
      var check_action_type = dt.type.some(
        (res) => res.action_change == "true"
      );
      var check_action_topic = dt.type.some(
        (res) => res.action_change == "true"
      );
      // console.log(check_action_type)
      // console.log(check_action_topic)
      // console.log(this.model_all.list_feedback)
      if (check_action_type || check_action_topic) {
        await this.swal_confrim("data", "save").then((res) => {
          if (res.isConfirmed == true) {
            //call function save
            this.Onsave_Question("saved");
          } else {
            this.get_one_data("master_question").subscribe(
              (data) => {
                console.log(data);
                this.master_data.detail_feedback = data[0].feedback_question;
              },
              (err) => {},
              () => {}
            );
          }
        });
      }
    }
  }

  async update_mat_tab(for_of, tabRef) {
    // 0 = Feedback Type // no check
    // 1 = Feedback Topic  // check type
    // 2 = Feedback Questions" // check type and check topic
    // check_val
    var dr = this.mat_tab_selected;
    var selectedIndex = null;
    var previous = null;
    if (this.mat_tab_selected.feedback_type == true) {
      selectedIndex = 0;
      previous = "feedback_type";
    }
    if (this.mat_tab_selected.feedback_topic == true) {
      selectedIndex = 1;
      previous = "feedback_topic";
    }
    if (this.mat_tab_selected.feedback_question == true) {
      selectedIndex = 2;
      previous = "feedback_question";
    }

    if (for_of == "feedback_type") {
      await this.tabChanged(selectedIndex, tabRef, selectedIndex);

      //end
      this.mat_tab_selected = {
        feedback_type: false,
        feedback_topic: false,
        feedback_question: false,
      };
      this.mat_tab_selected.feedback_type = true;

      this.updata_for_api("master_type");
      tabRef.selectedIndex = 0;
    } 
    else if (for_of == "feedback_topic") {
      await this.tabChanged(selectedIndex, tabRef, selectedIndex);

      //end
      this.mat_tab_selected = {
        feedback_type: false,
        feedback_topic: false,
        feedback_question: false,
      };
      this.mat_tab_selected.feedback_topic = true;

      this.updata_for_api("master_topic");
      this.feedback_type_id_selected = "1";
      tabRef.selectedIndex = 1;
    } 
    else {
      await this.tabChanged(selectedIndex, tabRef, selectedIndex);

      //end
      this.mat_tab_selected = {
        feedback_type: false,
        feedback_topic: false,
        feedback_question: false,
      };
      this.mat_tab_selected.feedback_question = true;

      this.updata_for_api("master_question");
      this.feedback_type_id_selected = "1";
      tabRef.selectedIndex = 2;
    }
    //feedback_type_id_selected
  }
  //Type
  new_row_type() {
    var obj = this.Feedback_type_selected;
    var dt = [];
    var ds_detail = this.model_all.type_feedback;
    var max_id = (this.get_max_id(ds_detail) + 1).toString();
    var validator = obj.name == "" || obj.name == null;
    if (validator) {
      this.ischeck = true;
      return;
    }

    //ต่อท้าย row

    ds_detail.push({
      action_change: "true",
      action_type: "insert",
      data_type: null,
      description: null,
      id: max_id,
      id_main: null,
      id_sub: null,
      module_name: "master feedback type",
      name: obj.name,
      page_name: "feedback",
      question_other: null,
      sort_by: "",
      status: obj.status,
      sub_data: "false",
      statusTF: obj.status == "1" ? true : false,
      token_login: null,
      user_admin: false,
    });

    this.clear_type();
    console.log(ds_detail);
    this.modalRef.hide();
    this.Onsave_type("saved", "new_row");
    this.ischeck = false;
  }
  //delete_row_type
  delete_row_type(item) {
    var check_data = item.hasOwnProperty("sub_data");

    if (check_data == true) {
      if (item.sub_data == "true") {
        this.swal_confrim_main().then((res) => {
          if (res.isConfirmed == true) {
            item.action_type = "delete";
            item.action_change = "true";
            this.Onsave_type("saved", "delete");
          } else {
          }
        });
      } else {
        this.swal_confrim().then((res) => {
          if (res.isConfirmed == true) {
            item.action_type = "delete";
            item.action_change = "true";
            this.Onsave_type("saved", "delete");
          } else {
          }
        });
      }
    }
  }
  //clear feedback_type
  clear_type() {
    this.Feedback_type_selected = {
      name: null,
      status: "",
      id: null,
      action: false,
    };
  }
  //update selected_type_now
  selected_type_now(row_type, tem) {
    this.Feedback_type_selected = {
      name: row_type.name,
      status: row_type.status,
      id: row_type,
      action: true,
    };
    this.openModal(tem);
  }
  // update_row_type
  update_row_type() {
    var obj = this.Feedback_type_selected;
    var validator = obj.name == "" || obj.name == null;
    if (validator) {
      this.ischeck = true;
      return;
    }
    this.Feedback_type_selected.id.name = this.Feedback_type_selected.name;
    this.Feedback_type_selected.id.status = this.Feedback_type_selected.status;
    this.Feedback_type_selected.id.action_change = "true";
    this.clear_type();
    this.modalRef.hide();
    this.Onsave_type("saved");
    this.ischeck = false;
  }

  change_status(type_checked, item) {
    this.swal_confrim("change", "save").then((val) => {
      if (val.isConfirmed == true) {
        if (item.statusTF) {
          item.status = "1";
          item.action_change = "true";
        } else {
          item.status = "0";
          item.action_change = "true";
        }
        if (type_checked == "topic") {
          this.Onsave_topic("saved");
        }
        if (type_checked == "type") {
          this.Onsave_type("saved");
        }
      } else {
        item.statusTF = !item.statusTF;
        if (item.statusTF) {
          item.status = "1";
        } else {
          item.status = "0";
        }
      }
    });
  }
   Hide_modal() {
 
    this.modalRef.hide();
    var souces = this;
    window.setTimeout(function() {
      souces.clear_type();
    }, 1000);
   
    this.ischeck = false;
  }

  //topic
  new_row_topic() {
    var obj = this.Feedback_topic_selected;
    var id_type = this.feedback_type_id_selected;
    var dt = [];
    var ds_detail = this.model_all.list_feedback;
    var max_id = (this.get_max_id(ds_detail) + 1).toString();
    var validator = obj.name == "" || obj.name == null;
    if (validator) {
      this.ischeck = true;
      return;
    }

    //ต่อท้าย row

    ds_detail.push({
      action_change: "true",
      action_type: "insert",
      data_type: null,
      description: null,
      id: max_id,
      id_main: id_type,
      id_sub: null,
      module_name: "master feedback list",
      name: obj.name,
      page_name: "feedback",
      question_other: "false",
      sub_data: "false",
      sort_by: "",
      status: obj.status,
      statusTF: obj.status == "1" ? true : false,
      token_login: null,
      user_admin: false,
    });

    this.clear_topic();
    console.log(ds_detail);
    this.modalRef.hide();
    this.Onsave_topic("saved", "new_row");
    this.ischeck = false;
  }

  //delete_row_type
  delete_row_topic(item) {
    this.swal_confrim().then((res) => {
      if (res.isConfirmed == true) {
        item.action_type = "delete";
        item.action_change = "true";
        this.Onsave_topic("saved", "delete");
      } else {
      }
    });

    var check_data = item.hasOwnProperty("sub_data");

    if (check_data == true) {
      if (item.sub_data == "true") {
        this.swal_confrim_main("data", "delete", "questions").then((res) => {
          if (res.isConfirmed == true) {
            item.action_type = "delete";
            item.action_change = "true";
            this.Onsave_topic("saved", "delete");
          } else {
          }
        });
      } else {
        this.swal_confrim().then((res) => {
          if (res.isConfirmed == true) {
            item.action_type = "delete";
            item.action_change = "true";
            this.Onsave_topic("saved", "delete");
          } else {
          }
        });
      }
    }
  }
  //clear feedback_type
  clear_topic() {
    this.Feedback_topic_selected = {
      name: null,
      status: "",
      id: null,
      action: false,
    };
  }
  //update selected_type_now
  selected_topic_now(row_type, tem) {
    this.Feedback_topic_selected = {
      name: row_type.name,
      status: row_type.status,
      id: row_type,
      action: true,
    };
    this.openModal(tem);
  }
  // update_row_type
  update_row_topic() {
    var obj = this.Feedback_topic_selected;
    var validator = obj.name == "" || obj.name == null;
    if (validator) {
      this.ischeck = true;
      return;
    }
    this.Feedback_topic_selected.id.name = this.Feedback_topic_selected.name;
    this.Feedback_topic_selected.id.status = this.Feedback_topic_selected.status;
    this.Feedback_topic_selected.id.action_change = "true";
    this.modalRef.hide();
    this.Onsave_topic("saved");
    this.ischeck = false;
  }
  Hide_modal_topic() {

    this.modalRef.hide();
    // this.clear_topic();
    var souces = this;
    window.setTimeout(function() {
      souces.clear_type();
    }, 1000);
    this.ischeck = false;
  }
  //#endregion
  get_index_question(ds, row_type, row_question) {
    if (ds.length > 0) {
      return ds.findIndex((res) => {
        return (
          res.id_main == row_question.id_main &&
          res.id_sub == row_question.id_sub &&
          res.id == row_question.id
        );
      });
    }
    return false;
  }

  update_data(item, updae_action, row_type?) {
    this.swal_confrim().then((val) => {
      if (val.isConfirmed == true) {
        item.action_type = "delete";
        item.action_change = "true";
        var num_row_delete = this.model_all.detail_feedback.filter((res) => {
          return (
            res.id_main == item.id_main &&
            res.id_sub == item.id_sub &&
            res.action_type != "delete"
          );
        });
        if (num_row_delete.length == 0) {
          try {
            this.new_row(item, row_type);
          } catch (ex) {
            console.log("new_row");
          }
        }
      } else {
      }
    });

    return true;
  }
  def_data(data) {
    this.model_all = data;
    this.model_all_def = { ...data };
  }

  Onsave_type(btn_type, type?) {
    if (btn_type == "saved") {
      if (true) {
        this.Appmain.isLoading = true;
        const OnsaveSucecss = (data) => {
          this.Appmain.isLoading = false;

          if (data.after_trip.opt1 == "true") {
            if (data.after_trip.opt2.status != "Update data successfully.") {
              data.after_trip.opt2.status = "Update data successfully.";
            }
            if (type == "delete") {
              this.Swalalert("Delete data successfully", "success");
            } else {
              if (type == "new_row") {
              } else {
                this.Swalalert(data.after_trip.opt2.status, "success");
              }
            }
            //data.data_type = null;
            this.convert_bool(data.feedback_type);
            this.model_all.type_feedback = data.feedback_type;
            this.obj_save.data_type = null;
            this.obj_save.feedback_type = [];
          } else {
            this.Swalalert(data.after_trip.opt2.status, "error");
            this.Onload();
          }
        };

        this.obj_save.data_type = "save";
        this.obj_save.feedback_type = this.model_all.type_feedback;
        this.obj_save.module_name = "master feedback type";

        var bodyX = this.obj_save;

        console.log(bodyX);

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
  Onsave_topic(btn_type, type?) {
    if (btn_type == "saved") {
      if (true) {
        this.Appmain.isLoading = true;
        const OnsaveSucecss = (data) => {
          this.Appmain.isLoading = false;

          if (data.after_trip.opt1 == "true") {
            if (data.after_trip.opt2.status != "Update data successfully.") {
              data.after_trip.opt2.status = "Update data successfully.";
            }
            if (type == "delete") {
              this.Swalalert("Delete data successfully", "success");
            } else {
              if (type == "new_row") {
              } else {
                this.Swalalert(data.after_trip.opt2.status, "success");
              }
            }
            //data.data_type = null;
            this.convert_bool(data.feedback_list);
            this.model_all.list_feedback = data.feedback_list;
            this.obj_save.data_type = null;
            this.obj_save.feedback_list = [];
          } else {
            this.Swalalert(data.after_trip.opt2.status, "error");
            this.Onload();
          }
        };

        console.log(this.model_all);
        this.obj_save.data_type = "save";
        this.obj_save.feedback_list = this.model_all.list_feedback;
        this.obj_save.module_name = "master feedback list";

        var bodyX = this.obj_save;

        console.log(bodyX);

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
  Onsave_Question(btn_type) {
    if (btn_type == "saved") {
      if (true) {
        this.Appmain.isLoading = true;
        const OnsaveSucecss = (data) => {
          this.Appmain.isLoading = false;

          if (data.after_trip.opt1 == "true") {
            if (data.after_trip.opt2.status != "Update data successfully.") {
              data.after_trip.opt2.status = "Update data successfully.";
            }
            this.Swalalert(data.after_trip.opt2.status, "success");
            //data.data_type = null;
            this.model_all.detail_feedback = data.feedback_question;
            this.obj_save.data_type = null;
            this.obj_save.detail_feedback = [];
          } else {
            this.Swalalert(data.after_trip.opt2.status, "error");
            console.log(data);
            this.Onload();
          }
        };

        this.obj_save.data_type = "save";
        this.obj_save.feedback_question = this.model_all.detail_feedback;
        this.obj_save.module_name = "master feedback question";

        var bodyX = this.obj_save;

        console.log(bodyX);

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
    let feedback_type_id_checked = this.feedback_type_id_selected;
    let dt = [];
    // console.log(this.emp_id)
    if (type == "master") {
      dt = ds.filter(
        (res) =>
          res.id_main == feedback_type_id_checked &&
          res.name.toLowerCase() != "other" &&
          res.action_type != "delete"
      );
    } else if (type == "master_type") {
      dt = ds.filter((res) => res.action_type != "delete");
    } else {
      dt = ds.filter((res) => res.id_main == feedback_type_id_checked);
    }
    return dt;
  }
  DataBYCARID(topic_id) {
    //this.runnumber();
    let feedback_type_id_checked = this.feedback_type_id_selected;

    // console.log(this.emp_id)
    let dt = this.model_all.detail_feedback.filter(
      (res) =>
        res.id_sub == topic_id &&
        res.id_main == feedback_type_id_checked &&
        res.action_type != "delete"
    );
    if (dt.length < 1) {
      var obj = { id_main: feedback_type_id_checked, id_sub: topic_id };
      this.new_row(obj, "");
    }
    return dt;
  }
  check_action(item) {
    if (item.action_type == "delete") {
      return true;
    }
    if (item.filename == null || item.filename == "") {
      return true;
    }
    return false;
  }
}
