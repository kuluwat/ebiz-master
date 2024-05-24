import { Component, OnInit, Inject, forwardRef } from '@angular/core';
import { RequestComponent } from '../request/request.component';
import { MainComponent } from '../main.component';
import { PartIiiService } from '../../http/part-iii/part-iii.service';
import { stateAction } from '../../components/state/stateAction';
import { Router } from '@angular/router';

@Component({
  selector: 'app-request-part-iii',
  templateUrl: './request-part-iii.html',
  styleUrls: ['./request-part-iii.component.css']
})
export class RequestPartIIIComponent implements OnInit {
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
    traveler_list: [],
    traveler_list_summary: [],
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
    button_display: "Approve"
  }

  messages = {
    "rule": "admin",
    "admin": {
      save: "Do you want to save the document?",
      cancel: "Do you want to cancel the document?",
      reject: "Do you want to reject the document?\nRejection for notification",
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
    after: true
  }
  constructor(
    @Inject(forwardRef(() => MainComponent)) private appMain: MainComponent,
    @Inject(forwardRef(() => RequestComponent)) private app: RequestComponent,
    private router: Router,
    private part3Http: PartIiiService) {
    this.app.select = "iii"

    this.stateGlobal = stateAction;

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
  }

  ngOnInit() {
  }

  didFetchData() {
    //debugger;
    this.appMain.isLoading = true;
    this.part3Http.didFetch(this.app.id).subscribe(dao => {
      this.appMain.isLoading = false;
      console.log("***FetchData tab Line approve***");
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

        this.appMain.showConfirmTextbox("Cancellation for notification *", (remarks : any) => {
          if (remarks == "") {
            this.appMain.showMessage("Please tell me the reason");
            return;
          }
          //this.model.traveler_list_summary[id]["appr_remark"] = remarks
          // this.model.traveler_list_summary[id]["appr_remark"] = remarks;
          // this.model.traveler_list_summary[id]["remark_opt"] = remarks;
          // this.model.traveler_list_summary[id]["appr_status"] = this.model.traveler_list_summary[id]["appr_status"] == "true" ? "false" : "true";
        })
      } else {
        //this.model.traveler_list_summary[id]["appr_remark"] = ""
        // this.model.traveler_list_summary[id]["appr_remark"] = "";
        // this.model.traveler_list_summary[id]["remark_cap"] = "";
        // this.model.traveler_list_summary[id]["remark_opt"] = "";
        // this.model.traveler_list_summary[id]["appr_status"] = this.model.traveler_list_summary[id]["appr_status"] == "true" ? "false" : "true";
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
        "traveler_summary": []
      }

      this.model.traveler_list_summary.forEach(current => {
        // data.traveler_summary.push({
        //   "ref_id": current["ref_id"],
        //   "take_action": current["take_action"],
        //   "appr_status": current["appr_status"],
        //   "appr_remark": current["appr_remark"],
        // })
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
      let checkApprove: boolean;
      let arr = [];
      // this.model.traveler_list_summary.forEach(dr => {

      //   arr.push({ emp_id: dr.emp_id });
      //   var x = arr.filter(emp => emp.emp_id === dr.emp_id);
      //   if (x.length <= 1) {
      //     if (dr.take_action === "true" && dr.appr_status === "true") {
      //       checkApprove = true;
      //       msg += "\n - " + dr.emp_name;
      //     }
      //     else {
      //       //msg = "false";
      //     }
      //   }
      // })
      // msg = checkApprove === true ? msg : "false";

      return msg;
    }

    const save = () => {
      if (this.buttons.save == false) {
        return
      }
      if (requestData()) {
        // if (confirm(this.messages[this.messages.rule].save)) {
        // this.appMain.showConfirm(this.messages[this.messages.rule].save, () => {
        //   this.appMain.isLoading = true;
        //   this.part3Http.onSave(convertParameter("1", "")).subscribe(dao => {
        //     this.appMain.isLoading = false;
        //     console.log(dao);
        //     if (dao["status"] == "S") {
        //       this.appMain.showMessage("Done.");
        //       //// Save แล้วไม่ต้อง direct ไปหน้า tracking
        //       // if (this.model.type_flow === "1") {
        //       //   this.router.navigate(["/main/request_list", this.model.type]);
        //       // }
        //     } else {
        //       this.appMain.showMessage(dao["message"]);
        //     }
        //   }, error => this.appMain.isLoading = false);
        // })
      } else {
        this.appMain.showMessage("Please input value. * ")
      }
    }

    const cancel = () => {
      if (this.buttons.cancel == false) {
        return
      }
      // if (confirm(this.messages[this.messages.rule].cancel)) {
      // this.appMain.showConfirm(this.messages[this.messages.rule].cancel, () => {
      //   this.appMain.isLoading = true
      //   this.part3Http.onSave(convertParameter("6", "")).subscribe(dao => {
      //     this.appMain.isLoading = false
      //     console.log(dao);
      //     if (dao["status"] == "S") {
      //       this.appMain.showMessage("Done.");
      //       this.router.navigate(["/main/request_list", this.model.type]);
      //     } else {
      //       this.appMain.showMessage(dao["message"]);
      //     }
      //   }, error => this.appMain.isLoading = false);
      // })

    }

    const reject = () => {

      if (this.buttons.reject == false) {
        return
      }
      // var remarks = prompt(this.messages[this.messages.rule]["reject"], "")
      // if (remarks == null) {
      //   console.log("No value");
      // } else {
      // this.appMain.showConfirmTextbox(this.messages[this.messages.rule]["reject"], (remarks) => {
      //   if (remarks == "") {
      //     this.appMain.showMessage("Please tell me the reason")
      //     return
      //   }
      //   this.appMain.isLoading = true
      //   this.part3Http.onSave(convertParameter("2", remarks)).subscribe(dao => {
      //     this.appMain.isLoading = false
      //     if (dao["status"] == "S") {
      //       this.appMain.showMessage("Done.");
      //       this.router.navigate(["/main/request_list", this.model.type]);
      //     } else {
      //       this.appMain.showMessage(dao["message"]);
      //     }
      //   }, error => this.appMain.isLoading = false);
      // })
    }

    const revise = () => {
      if (this.buttons.revise == false) {
        return
      }
      // var remarks = prompt("Please specify the reason for revising. / Do you want to revise the document?", "")
      // if (remarks == null) {
      //   console.log("No value");
      // } else {
      // this.appMain.showConfirmTextbox(this.messages[this.messages.rule]["revise"], (remarks) => {
      //   if (remarks == "") {
      //     this.appMain.showMessage("Please tell me the reason")
      //     return
      //   }
      //   this.appMain.isLoading = true
      //   this.part3Http.onSave(convertParameter("3", remarks)).subscribe(dao => {
      //     this.appMain.isLoading = false
      //     if (dao["status"] == "S") {
      //       this.appMain.showMessage("Done.");
      //       this.router.navigate(["/main/request_list", this.model.type]);
      //     } else {
      //       this.appMain.showMessage(dao["message"]);
      //     }
      //   }, error => this.appMain.isLoading = false);
      // })
    }

    const approve = () => {
      if (this.buttons.approve == false) {
        return
      }
      // if (confirm("Do you want to approve the document?")) {
      if (checkDataforSubmit() != "false") {
        let action = this.model.button_display.toLowerCase();
        this.appMain.showConfirmInfo(checkDataforSubmit(), () => {
          this.appMain.isLoading = true
          this.part3Http.onSave(convertParameter("4", "")).subscribe(dao => {
            this.appMain.isLoading = false
            if (dao["status"] == "S") {
              this.appMain.showMessage("Done.");
              if (this.model.type_flow === "1") {
                this.router.navigate(["/main/request_list", this.model.type]);
              } else {
                this.router.navigate(["/main/request", "edit", this.app.id, "cap"]);
              }
            } else {
              console.log('approve not completed')
              console.log(dao)
              this.appMain.showMessage(dao["message"]);
            }
          }, error => this.appMain.isLoading = false);
        })
      } else {
        this.appMain.showMessage("No approved travelers.");
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

  showRemarkFlow(txt : string) {
    this.appMain.showMessage(txt);
  }
}
