import { Component, OnInit, Inject, forwardRef, TemplateRef } from '@angular/core';
import { RequestComponent } from '../request/request.component';
import { MainComponent } from '../main.component';
import { stateAction } from '../../components/state/stateAction';
import { Router } from '@angular/router';
import { PartIiiiService } from '../../http/part-iiii/part-iiii.service';
import { FileuploadserviceService } from '../../ws/fileuploadservice/fileuploadservice.service';
import { AlertServiceService } from '../../services/AlertService/alert-service.service';
import { AspxserviceService } from '../../ws/httpx/aspxservice.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-request-part-cap',
  templateUrl: './request-part-cap.component.html',
  styleUrls: ['./request-part-cap.component.css']
})
export class RequestPartCapComponent implements OnInit {
  stateGlobal
  model = {
    type: "oversea", // oversea, local
    topic: "",
    continent: "",
    travel_date: "",
    total_travel: "",
    country: "",
    province: "",
    business_date: "",
    grand: "",
    traveler_list: [{
      text:'',
    }],
    traveler_list_summary: [
      {
  
          no:'',
          take_action: '',
          appr_status: '',
          emp_name:'',
          emp_unit:'',
          approve_remark:'',
          appr_remark:'',
          remark_opt:'',
          approve_status:'',
          remark_cap:'',
          appr_name:'',
          business_date: Date(),
          traveler_date: Date(),
          total_expenses:'',
          country:'',
          province:''
        
      }
    ],
    bugget: false,
    shall: false,
    after: {
      ck1: false,
      ck2: {
        value: false,
        remark: ""
      },
      ck3: {
        value: false,
        remark: ""
      }
    },
    type_flow: "1",
    button_display: "Approve",
    docfile: [
      {
      DF_ID: '',
      DF_NAME: '',
      DF_PATH: '',
      DF_REMARK: '',
      DH_CODE: '',
      after_trip: {
        opt1: '',
        opt2: {
          remark:'',
          status:''
        },
  opt3: {
    remark:'',
    status:''
  }
      }
    }
  ]
  }

  messages = {
    "rule": "admin",
    "admin": {
      save: "Do you want to save the document?",
      cancel: "Do you want to cancel the document?",
      reject: "Do you want to reject the document?\nRevision for notification",
      revise: "Do you want to revise the document?\nRevision for notification",
      submit: "Do you want to submit the document? "
    }
  }

  buttons = {
    save: true,
    cancel: true,
    reject: true,
    revise: true,
    approve: true
  }

  panel = {
    summary: false,
    after: true,
    fileupload: false
  }

  dataSource: any = [];
  selectedFile: File = null!;
  modalRef: BsModalRef | any;
  lbInputFile: string = "Choose file";
  txtRemark: string = "";
  submitted: boolean = false;

  constructor(
    @Inject(forwardRef(() => MainComponent)) private appMain: MainComponent,
    @Inject(forwardRef(() => RequestComponent)) private app: RequestComponent,
    private router: Router,
    private part4Http: PartIiiiService,
    private fileuploadservice: FileuploadserviceService,
    private alerts: AlertServiceService,
    public ws: AspxserviceService,
    private modalService: BsModalService,
  ) {
    this.app.select = "cap"

    this.stateGlobal = stateAction;

    if (app.id.search("LB") === 0) {
      // Local
      this.model.type = "local";
      this.app.types = "Local Business";
    } else if (app.id.search("OB") === 0) {
      // Oversea
      this.model.type = "oversea";
      this.app.types = "Oversea Business"
    } else if (app.id.search("LT") === 0) {
      // Local Training
      this.model.type = "localtraining";
      this.app.types = "Local Training";
    } else if (app.id.search("OT") === 0) {
      // Oversea Training
      this.model.type = "overseatraining";
      this.app.types = "Oversea Training";
    }

    this.didFetchData()
    // if (app.id.search("OB") == -1) {
    //   // Local
    //   this.model.type = "local"
    //   this.app.types = "Local"
    // } else {
    //   // Oversea
    //   this.model.type = "oversea"
    //   this.app.types = "Overseas"
    // }
  }

  ngOnInit() {
  }

  didFetchData() {

    this.appMain.isLoading = true;
    this.part4Http.didFetch(this.app.id).subscribe(dao => {
      this.appMain.isLoading = false;
      console.log("***FetchData tab CAP approve***");
      console.log(dao)
      this.app.root_doc_id = this.app.id + ""
      this.app.root_doc_status = dao["document_status"]
      this.model.topic = dao["topic"]
      this.model.continent = dao["continent"]
      this.model.country = dao["country"]
      this.model.province = dao["province"]
      this.model.travel_date = dao["travel_date"]
      this.model.business_date = dao["business_date"]
      this.model.total_travel = dao["total_travel"]
      this.model.grand = dao["grand_total"]

      this.model.traveler_list = dao["traveler_list"]
      this.model.traveler_list_summary = dao["traveler_summary"]

      this.panel.summary = this.model.traveler_list_summary.length > 0 ? true : false;

      this.model.bugget = dao["checkbox_1"] == "true" ? true : false;
      this.model.shall = dao["checkbox_2"] == "true" ? true : false;

      this.model.after.ck1 = dao["after_trip"]["opt1"] == "true" ? true : false;
      this.model.after.ck2.value = dao["after_trip"]["opt2"]["status"] == "true" ? true : false;
      this.model.after.ck2.remark = dao["after_trip"]["opt2"]["remark"]
      this.model.after.ck3.value = dao["after_trip"]["opt3"]["status"] == "true" ? true : false;
      this.model.after.ck3.remark = dao["after_trip"]["opt3"]["remark"];

      // check ว่าเป็นในงานที่มี flow approve หรือไม่
      this.model.type_flow = dao["type_flow"];
      this.model.button_display = dao["type_flow"] === "1" ? "Approve" : "Submit";
      this.panel.fileupload = dao["type_flow"] === "1" ? false : true;

      this.dataSource = [];
      this.dataSource = dao["docfile"];
      this.model.docfile = dao["docfile"];
      // dao.docfile.forEach(m => {
      //   this.dataSource.push(
      //     {
      //       DF_ID: m.displayname,
      //       DF_NAME: m.email,
      //       DF_PATH: m.emp_id,
      //       DF_REMARK: m.DF_REMARK,
      //       DH_CODE: m.DH_CODE,
      //       pmsv_admin: m.pmsv_admin,
      //       super_admin: m.super_admin,
      //       contact_admin: m.contact_admin,
      //       username: m.username
      //     });
      // });

      this.app.buttons.PartI = dao["button"]["part_i"] == "true" ? true : false;
      this.app.buttons.PartII = dao["button"]["part_ii"] == "true" ? true : false;
      this.app.buttons.PartIII = dao["button"]["part_iii"] == "true" ? true : false;
      this.app.buttons.PartIIII = dao["button"]["part_iiii"] == "true" ? true : false;

      this.buttons.save = dao["button"]["save"] == "true" ? true : false;
      this.buttons.cancel = dao["button"]["cancel"] == "true" ? true : false;
      this.buttons.reject = dao["button"]["reject"] == "true" ? true : false;
      this.buttons.revise = dao["button"]["revise"] == "true" ? true : false;
      this.buttons.approve = dao["button"]["approve"] == "true" ? true : false;

    }, error => this.appMain.isLoading = false)
  }

  handleActionSummary(currentStatus: String, id: number) {
    if (this.model.traveler_list_summary[id]["take_action"] != "true") {
      this.appMain.showMessage("You don't change status.")
      return
    }
    console.log(this.model.traveler_list_summary)
    let msg = this.model.traveler_list_summary[id]["appr_status"] === "true" ? 'Do you want to cancel ' + this.model.traveler_list_summary[id]["emp_name"] + ' status?' : 'Do you want to approve ' + this.model.traveler_list_summary[id]["emp_name"] + ' status status?';
    this.appMain.showConfirm(msg, () => {
      // if (confirm("Do you want to toggle status?")) {
      if (currentStatus == "true") {
        // var remarks = prompt("Remark", "")
        this.appMain.showConfirmTextbox("Cancellation for notification", (remarks : any) => {
          if (remarks == "") {
            this.appMain.showMessage("Please tell me the reason");
            return;
          }
          this.model.traveler_list_summary[id]['appr_remark'] == remarks;
          //alert(remarks);
          //this.model.traveler_list_summary[id]["remark"] = remarks;
          //this.model.traveler_list_summary[id]["remark_cap"] = remarks;
          this.model.traveler_list_summary[id]["remark_opt"] == remarks;
          this.model.traveler_list_summary[id]["appr_status"] ==  "true" ? "false" : "true";

        })
      } else {
        //this.model.traveler_list_summary[id]["remark"] = "";
        this.model.traveler_list_summary[id]["appr_remark"] == "";
        this.model.traveler_list_summary[id]["remark_cap"] == "";
        this.model.traveler_list_summary[id]["remark_opt"] == "";

        this.model.traveler_list_summary[id]["appr_status"] == "true" ? "false" : "true";
      }
    })
  }

  handleActionPages(action: stateAction) {
    console.log(this.model)

    const convertParameter = (action: String, remark: String) => {
      var data = {
        "token_login": localStorage["token"],
        "doc_id": this.app.id + "",
        "action": {
          "type": action,
          "remark": remark
        },
        "checkbox_1": this.model.bugget ? "true" : "false",
        "checkbox_2": this.model.shall ? "true" : "false",
        "after_trip": {
          "opt1": this.model.after.ck1 ? "true" : "false",
          "opt2": {
            "status": this.model.after.ck2.value ? "true" : "false",
            "remark": this.model.after.ck2.remark
          },
          "opt3": {
            "status": this.model.after.ck3.value ? "true" : "false",
            "remark": this.model.after.ck3.remark
          }
        },
        "traveler_summary": [
          {}
        ],
        "docfile": this.model.docfile
      }

      this.model.traveler_list_summary.forEach((current : any) => {
        data.traveler_summary.push({
          "ref_id": current["ref_id"],
          "take_action": current["take_action"],
          "appr_status": current["appr_status"],
          "appr_remark": current["appr_remark"],
        })
      });

      return data
    }

    const requestData = (): Boolean => {


      return true
    }

    const checkDataforSubmit = (): string => {

      console.log('check Estimate Expenses of traveler');
      console.log(this.model.traveler_list_summary);

      let msg = "Do you want to approve the document?";
      let checkApprove: boolean = false;
      // this.model.traveler_list_summary.forEach(dr => {
      //   if (dr.take_action === "true" && dr.appr_status === "true") {
      //     checkApprove = true;
      //     msg += "\n - " + dr.emp_name;
      //   }
      //   else {
      //     //msg = "false";
      //   }
      // })
      let arr = [];
      this.model.traveler_list_summary.forEach((dr : any) => {

        arr.push({ emp_id: dr.emp_id });
        var x = arr.filter(emp => emp.emp_id === dr.emp_id);
        if (x.length <= 1) {
          if (dr.take_action === "true" && dr.appr_status === "true") {
            checkApprove = true;
            msg += "\n - " + dr.emp_name;
          }
          else {
            //msg = "false";
          }
        }
      })
      msg = checkApprove ? msg : "false";

      return msg;
    }

    const save = () => {
      if (this.buttons.save == false) {
        return
      }
      if (requestData()) {
        // if (confirm(this.messages[this.messages.rule].save)) {

        this.appMain.showConfirm(this.messages.admin['save'], () => {
          this.appMain.isLoading = true;
          console.log('>>>> Save page CAP <<<<');
          console.log(convertParameter("1", ""));
          this.part4Http.onSave(convertParameter("1", "")).subscribe(dao => {
            this.appMain.isLoading = false;
            console.log('>>>> Save page CAP success <<<<');
            console.log(dao);
            if (dao["status"] == "S") {
              this.appMain.showMessage("Done.");
              //// Save แล้วไม่ต้อง direct ไปหน้า tracking
              //this.router.navigate(["/main/request_list", this.model.type]);
            } else {
              this.appMain.showMessage(dao["message"]);
            }
          }, error => this.appMain.isLoading = false);
        })
      } else {
        this.appMain.showMessage("Please input value. * ")
      }
    }

    const cancel = () => {
      if (this.buttons.cancel == false) {
        return
      }
      // if (confirm(this.messages[this.messages.rule].cancel)) {
      this.appMain.showConfirm(this.messages.admin['cancel'], () => {
        this.appMain.isLoading = true
        this.part4Http.onSave(convertParameter("6", "")).subscribe(dao => {
          this.appMain.isLoading = false
          console.log(dao);
          if (dao["status"] == "S") {
            this.appMain.showMessage("Done.");
            this.router.navigate(["/main/request_list", this.model.type]);
          } else {
            this.appMain.showMessage(dao["message"]);
          }
        }, error => this.appMain.isLoading = false);
      })

    }

    const reject = () => {

      if (this.buttons.reject == false) {
        return
      }
      // var remarks = prompt(this.messages[this.messages.rule]["reject"], "")
      // if (remarks == null) {
      //   console.log("No value");
      // } else {
      this.appMain.showConfirmTextbox(this.messages.admin["reject"], (remarks : any) => {
        if (remarks == "") {
          this.appMain.showMessage("Please tell me the reason")
          return
        }
        this.appMain.isLoading = true
        this.part4Http.onSave(convertParameter("2", remarks)).subscribe(dao => {
          this.appMain.isLoading = false
          if (dao["status"] == "S") {
            this.appMain.showMessage("Done.");
            this.router.navigate(["/main/request_list", this.model.type]);
          } else {
            this.appMain.showMessage(dao["message"]);
          }
        }, error => this.appMain.isLoading = false);
      })
    }

    const revise = () => {
      if (this.buttons.revise == false) {
        return
      }
      // var remarks = prompt("Please specify the reason for revising. / Do you want to revise the document?", "")
      // if (remarks == null) {
      //   console.log("No value");
      // } else {
      this.appMain.showConfirmTextbox(this.messages.admin["revise"], (remarks : any) => {
        if (remarks == "") {
          this.appMain.showMessage("Please tell me the reason")
          return
        }
        this.appMain.isLoading = true
        this.part4Http.onSave(convertParameter("3", remarks)).subscribe(dao => {
          this.appMain.isLoading = false
          if (dao["status"] == "S") {
            this.appMain.showMessage("Done.");
            this.router.navigate(["/main/request_list", this.model.type]);
          } else {
            this.appMain.showMessage(dao["message"]);
          }
        }, error => this.appMain.isLoading = false);
      })
    }

    const approve = () => {
      if (this.buttons.approve == false) {
        return
      }
      let fileUpload = false;
      if (this.model.type_flow === "2" || this.model.type_flow === "3") {
        if (this.model.docfile.length === 0) {
          this.alerts.swal_warning('Please upload the approval document.')
          return;
        }
        else {
          fileUpload = true;
        }
      }
      else {
        fileUpload = true;
      }
      if (fileUpload) {
        // if (confirm("Do you want to approve the document?")) {
        if (checkDataforSubmit() != "false") {
          this.appMain.showConfirmInfo(checkDataforSubmit(), () => {
            this.appMain.isLoading = true
            this.part4Http.onSave(convertParameter("4", "")).subscribe(dao => {
              this.appMain.isLoading = false
              if (dao["status"] == "S") {
                this.appMain.showMessage("Done.");
                this.router.navigate(["/main/request_list", this.model.type]);
              } else {
                console.log('!Error CAP Approve ');
                console.log(dao);
                this.appMain.showMessage(dao["message"]);
              }
            }, error => this.appMain.isLoading = false);
          })
        }else{
          this.appMain.showMessage("No approved travelers.");
        }
      }
    }

    switch (action) {
      case this.stateGlobal.save: save(); break;
      case this.stateGlobal.cancel: cancel(); break;
      case this.stateGlobal.reject: reject(); break;
      case this.stateGlobal.revise: revise(); break;
      case this.stateGlobal.approve: approve(); break;
    }
  }

  openModalx(template: TemplateRef<any>, types: string) {

    let config: object = {
      class: "modal-lg",
      animated: true,
      keyboard: false,
      ignoreBackdropClick: true,

    };
    this.modalRef = this.modalService.show(template, config);
    // var configx = $("#exampleModalCenter").closest('.modal-backdrop').addClass('z-index:1100');

  }

  cancelUpload() {
    this.lbInputFile = "Choose file";
    this.txtRemark = "";
    this.selectedFile = null !;
    this.submitted = false;
    this.modalRef.hide();
  }

  removeItemOnce(arr : any, value : any) {
    var index = arr.indexOf(value);
    if (index > -1) {
      arr.splice(index, 1);
    }
    return arr;
  }

  uploadFile() {

    this.submitted = true;

    if (this.selectedFile != null) {
      this.onUpload();
    }
    else {

    }
    // var control = document.getElementById('importFile').children[0].children[0];
    // //if (request_type != ""){
    //   //control.classList.remove('border-red');
    // //}
    // //if(this.submitted && this.f.request_type.errors){
    //   control.classList.add('border-red');
    // //}

  }

  onFileSelect(event : any) {

    this.selectedFile = <File>event.target.files[0];
    this.lbInputFile = this.selectedFile.name;
    console.log(event)
    console.log(this.selectedFile)
    //this.onUpload();
  }
  onUpload() {

    this.appMain.isLoading = true;

    const onSuccess = (res : any) => {

      if (res.after_trip.opt1 == "true") {
        console.log("---Upload file page cap success---")
        console.log(res)
        //this.alerts.toastr_sucess('Update data complete.');

        this.model.docfile.push({
          DF_ID: res.DF_ID,
          DF_NAME: res.DF_NAME,
          DF_PATH: res.DF_PATH,
          DF_REMARK: this.txtRemark,
          DH_CODE: res.DH_CODE,
          after_trip: {
            opt1: res.after_trip.opt1,
            opt2: {
              remark: res.after_trip.opt2.remark,
              status: res.after_trip.opt2.status,
            },
            opt3: {
              remark: res.after_trip.opt3.remark,
              status: res.after_trip.opt3.status,
            }
          }
        });
        console.log("---Model Upload file page cap success---");
        console.log(this.model);

        //close modal & clear data
        this.cancelUpload();
        this.appMain.isLoading = false;
      }
      else {
        console.log('---error---');
        console.log(res)
        this.alerts.swal_error(res.after_trip.opt2.status);

        this.appMain.isLoading = false;
      }

    }

    this.fileuploadservice.postFile_Phase1(this.selectedFile, this.app.root_doc_id, "x", "x").subscribe(res => onSuccess(res), error => {
      this.appMain.isLoading = false;
      console.log(error);
      this.alerts.swal_error('error!');
      //alert('error!');
    })
  }
  deleteFileUpload(dr : any, rowIndex : any) {
    console.log('>>> Delete row attachment <<<');
    console.log(dr);
    this.model.docfile.splice(rowIndex, 1);
  }
  downloadFile(dr : any) {
    console.log(dr);
    //alert('xx')
    if (!this.ws.isEmpty(dr.DF_PATH) && !this.ws.isEmpty(dr.DF_NAME)) {
      let url = dr.DF_PATH + dr.DF_NAME;
      this.ws.downloadFile(url, dr.DF_NAME);
    }
    else {
      this.appMain.showMessage("URL has a problem.");
    }
  }

  showRemarkFlow(txt : any) {
    this.appMain.showMessage(txt);
  }
}
