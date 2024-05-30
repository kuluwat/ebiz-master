import { Component, OnInit, Inject, forwardRef } from '@angular/core';
import { RequestComponent } from '../request/request.component';
import { Router } from '@angular/router';
import { PartIiService } from '../../http/part-ii/part-ii.service';
import { MainComponent } from '../main.component';
import { MasterService } from '../../http/master/master.service';
import { stateAction } from '../../components/state/stateAction';

@Component({
  selector: 'app-request-part-ii',
  templateUrl: './request-part-ii.component.html',
  styleUrls: ['./request-part-ii.component.css']
})
export class RequestPartIIComponent implements OnInit {

  statusValidate = false;
  statusValidateAdd = false;

  model : any = {
    type: "oversea", // oversea, local
    revice_add: {
      approval_line: "endorsed",   //endorsed, cap
      master_traveler: {
        value: [],
        config: {
          displayKey: 'name', // if objects array passed which key to be displayed defaults to description
          search: true,
          limitTo: 100,
          placeholder: 'Select'
        },
        list: [],
        mt: []
      },
      traveler_list: [],
      emp_id: {
        value: "",    // have string or object
        list: [],
        data: ""      // is data use to call api
      },
      emp_name: {
        value: "",    // have string or object
        list: [],
        data: ""      // is data use to call api
      },
      emp_org: "",
      approve_level: ""
    },
    emp: {
      emp_id: {
        data: "",
        value: "",
        list: []
      },
      emp_name: {
        data: "",
        value: "",
        list: []
      },
      org: "",
      ref_id: "",
      country: "",
      business_date: "",
      travel_date: ""
    },
    emp_mt: [],
    emp_id_mt: [],
    oversea: {
      add_travel: {
        index: 0,
        isAdd: true,
        air: undefined,
        accom: undefined,
        allow: undefined,
        visa_fee: undefined,
        travel_insur: undefined,
        trans: undefined,
        passport_valid: undefined,
        passport_expense: undefined,
        cloth_valid: undefined,
        cloth_expense: undefined,
        regis_fee: undefined,
        miscall: undefined,
        remark: undefined,
      },
      table_travel: []
    },
    local: {
      add_travel: {
        index: 0,
        isAdd: true,
        air: undefined,
        accom: undefined,
        allow_day: undefined,
        allow_night: undefined,
        regis_fee: undefined,
        trans: undefined,
        miscall: undefined,
        remark: undefined,
      },
      table_travel: []
    },
    table_approver: [],
    remark: "",
    bugget: false,
    shall: false,
    type_flow: "",
    ExchangeRates: [],
    ExchangeRatesDisplay: "",
    arrCheckUser: [],
    emp_id_edit: "",
    edit_table: false,
    edit_approver: false
  }

  inputFormat = {
    prefix: '',
    thousands: ',',
    precision: '2',
    suffix: ' THB'
  }

  inputFormatInt = {
    prefix: '',
    thousands: ',',
    precision: '0',
    suffix: ' THB'
  }

  inputFormatDay = {
    prefix: '',
    thousands: ',',
    precision: '0'
  }

  currentIndexEditApprover = []

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
    save: false,
    cancel: false,
    reject: false,
    revise: false,
    approve: false
  }

  daoGlobal: any;

  autoComplete = {
    value: "",
    list: [
      {
        id: 1,
        name: 'Usa'
      },
      {
        id: 2,
        name: 'England'
      }
    ]
  }

  dropdownSearch = {
    value: [],
    config: {
      displayKey: 'name', // if objects array passed which key to be displayed defaults to description
      search: true,
      limitTo: 3,
      placeholder: 'Select'
    },
    list: [
      {
        '_id': '5a66d6c31d5e4e36c7711b7a',
        'index': 10,
        'balance': '$2,806.37',
        'picture': 'http://placehold.it/32x32',
        'name': 'Burns Dalton'
      },
      {
        '_id': '5a66d6c3657e60c6073a2d22',
        'index': 1,
        'balance': '$2,984.98',
        'picture': 'http://placehold.it/32x32',
        'name': 'Mcintyre Lawson'
      },
      {
        '_id': '5a66d6c376be165a5a7fae33',
        'index': 2,
        'balance': '$2,794.16',
        'picture': 'http://placehold.it/32x32',
        'name': 'Amie Franklin'
      },
      {
        '_id': '5a66d6c3f7854b6b4d96333b',
        'index': 3,
        'balance': '$2,537.14',
        'picture': 'http://placehold.it/32x32',
        'name': 'Jocelyn Horton'
      },
      {
        '_id': '5a66d6c31f967d4f3e9d84e9',
        'index': 4,
        'balance': '$2,141.42',
        'picture': 'http://placehold.it/32x32',
        'name': 'Fischer Erickson'
      },
      {
        '_id': '5a66d6c34cfa8cddefb31602',
        'index': 5,
        'balance': '$1,398.60',
        'picture': 'http://placehold.it/32x32',
        'name': 'Medina Underwood'
      },
      {
        '_id': '5a66d6c3d727c450794226de',
        'index': 6,
        'balance': '$3,915.65',
        'picture': 'http://placehold.it/32x32',
        'name': 'Goldie Barber'
      }
    ]
  }

  panel = {
    summary: false,
    approval_list: false,
    summary_approval_list: false,
    sts_dropdown_for_travel: false,
    revise_button_add: true   // true is add, false is change

  }

  hide = {
    add_revice_approver: true
  }

  stateGlobal

  constructor(
    @Inject(forwardRef(() => MainComponent)) private appMain: MainComponent,
    @Inject(forwardRef(() => RequestComponent)) private app: RequestComponent,
    private masterHttp: MasterService,
    private partIIHttp: PartIiService,
    private router: Router) {
    this.app.select = "ii"
    //debugger;
    // console.log(app.id.search("OB") == -1);
    // console.log(app.id.search("OB"));
    // if (app.id.search("OB") == -1) {

    //   // Local
    //   this.model.type = "local"
    // } else {
    //   // Oversea
    //   this.model.type = "oversea"
    // }
    if (app.id.search("LB") === 0) {
      // Local
      this.model.type = "local"
    } else if (app.id.search("OB") === 0) {
      // Oversea
      this.model.type = "oversea"
    } else if (app.id.search("LT") === 0) {
      // Local Training
      this.model.type = "localtraining"
    } else if (app.id.search("OT") === 0) {
      // Oversea Training
      this.model.type = "overseatraining"
    }
    this.stateGlobal = stateAction;
    this.didFetchData()
  }

  currencyFormat(num : any) {
    debugger;
    let val = parseInt(num);
    let ret = '$' + val.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    this.model.oversea.add_travel.allow = ret;
    return ret;
  }

  reloadMasterForTravelerInReviseApprover() {
    // master for travel
    this.model.revice_add.master_traveler.list = [];
    // Aun Check type name and convert overseatraining to oversea , localtraining to local
    let typeX = this.model.type == "oversea" || this.model.type == "overseatraining" ? "oversea" : "local";
    // this.daoGlobal[this.model.type]["employee"].forEach(current => {
    this.daoGlobal[typeX]["employee"].forEach((current : any)=> {
      // master for travel
      this.model.revice_add.master_traveler.list.push({
        '_id': current["id"],
        'index': current["id"],
        'name': this.formatStringCutPipe(current["name"])
      })

    });
  }

  didFetchData() {

    this.app.root_doc_id = "" + this.app.id;

    this.model.arrCheckUser = [];

    const prepairEmp = (objc : any, arrTraveler: any) => {
      //debugger;
      this.model.revice_add.master_traveler.list = [];
      this.model.revice_add.master_traveler.mt = [];

      objc.forEach((current : any) => {
        // master id

        this.model.emp.emp_id.list.push({
          id: current["id"],
          name: current["id"],
          ref_id: current["ref_id"]
        })
        // master name
        this.model.emp.emp_name.list.push({
          id: current["id"],
          name: current["name"],
          remark: current["remark"],
          business_date: current["business_date"],
          travel_date: current["travel_date"],
          ref_id: current["ref_id"],
        })

        this.model.emp_id_mt.push({
          id: current["id"],
          name: current["id"],
          ref_id: current["ref_id"]
        })

        this.model.emp_mt.push({
          id: current["id"],
          name: current["name"],
          remark: current["remark"],
          business_date: current["business_date"],
          travel_date: current["travel_date"],
          ref_id: current["ref_id"],
        })


        // master for travel
        var hasMatch = Boolean(arrTraveler.find((a : any)=> { return a.emp_id === current["id"] }))
        if (hasMatch) {
          this.model.revice_add.master_traveler.list.push({
            '_id': current["id"],
            'index': current["id"],
            'name': this.formatStringCutPipe(current["name"]),
            'ref_id': current["ref_id"],
          })
        }

        this.model.revice_add.master_traveler.mt.push({
          '_id': current["id"],
          'index': current["id"],
          'name': this.formatStringCutPipe(current["name"]),
          'ref_id': current["ref_id"],
        })

      });

      // delete traveler in text search autocomplete
      arrTraveler.forEach((current : any) => {

        //debugger;
        // var foundIndex = this.model.emp.emp_id.list.findIndex(x => x.id == current.emp_id);
        var foundIndex = this.model.emp.emp_id.list.findIndex((x : any) => x.ref_id == current.ref_id);

        this.model.emp.emp_id.list.splice(foundIndex, 1);

        // var foundIndex2 = this.model.emp.emp_name.list.findIndex(x => x.id == current.emp_id);
        var foundIndex2 = this.model.emp.emp_name.list.findIndex((x : any) => x.ref_id == current.ref_id);

        this.model.emp.emp_name.list.splice(foundIndex2, 1);

      });


      this.checkUserInDropdownApprover();

      this.model.emp.emp_name.list.sort((a: any, b: any) => a.id.localeCompare(b.id));
      this.model.emp.emp_id.list.sort((a: any, b: any) => a.id.localeCompare(b.id));
    }

    const prepairApprover = (objc: any, arrTraveler: any) => {

      arrTraveler.forEach((current : any)=> {

        let chk = this.model.table_approver.filter((x : any) => x.emp_id === current["emp_id"]);
        if (chk.length <= 0) {

          var arr = objc.filter((emp : any) => emp.emp_id === current["emp_id"]);
          arr.sort((a: any, b: any) => a.approve_level.localeCompare(b.approve_level))

          arr.forEach((current : any) => {
            this.pushApprover(
              this.model.table_approver.length + 1,
              // current["line_id"],
              // current["type"],
              // current["emp_id"],
              // current["emp_name"],
              // current["emp_org"],
              // current["appr_id"],
              // current["appr_name"],
              // current["appr_org"],
              // current["remark"],
              // current["approve_status"],
              // current["approve_remark"],
              // current["approve_level"],
            )
          });

          // var foundIndex = this.model.revice_add.master_traveler.list.findIndex(x => x._id == current["emp_id"]);

          // this.model.revice_add.master_traveler.list.splice(foundIndex, 1);
        }
      })



      // objc.forEach(current => {
      //   this.pushApprover(
      //     this.model.table_approver.length + 1,
      //     current["line_id"],
      //     current["type"],
      //     current["emp_id"],
      //     current["emp_name"],
      //     current["emp_org"],
      //     current["appr_id"],
      //     current["appr_name"],
      //     current["appr_org"],
      //     current["remark"],
      //     current["approve_status"],
      //     current["approve_remark"],
      //     current["approve_level"],
      //   )
      // });
      //approve_level
      this.panel.summary_approval_list = this.model.table_approver.length > 0 ? true : false;

      if (this.daoGlobal["type"] === "oversea" || this.daoGlobal["type"] === "overseatraining") {
        this.panel.summary_approval_list = this.model.oversea.table_travel.length > 0 ? true : false;
      } else {
        this.panel.summary_approval_list = this.model.local.table_travel.length > 0 ? true : false;
      }
    }

    const prepairTravelerList = (datas : any) => {



      if (this.daoGlobal["type"] === "oversea" || this.daoGlobal["type"] === "overseatraining") {
        // oversea
        datas.forEach((ct : any) => {
          this.model.oversea.table_travel.push({
            no: this.model.oversea.table_travel.length + 1,
            emp_id: ct["emp_id"],
            emp_name: ct["emp_name"],
            emp_org: ct["org"],
            business: ct["business_date"],
            travel: ct["travel_date"],
            country: ct["country"],
            province: ct["province"],
            air: ct["air_ticket"],
            acc: ct["accommodation"],
            allow: ct["Allowance"],
            visa_fee: ct["visa_fee"],
            travel_insur: ct["travel_insurance"],
            trans: ct["transportation"],
            passport_valid: ct["passport_valid"] == null ? "" : new Date(ct["passport_valid"]),
            passport_expense: ct["passport_expense"],
            cloth_valid: ct["clothing_valid"] == null ? "" : new Date(ct["clothing_valid"]),
            cloth_expense: ct["clothing_expense"],
            regis_fee: ct["registration_fee"],
            miscall: ct["miscellaneous"],
            total: ct["total_expenses"],
            ref_id: ct["ref_id"],
            status_edit: ct["edit"] == "true" ? true : false,
            status_delete: ct["delete"] == "true" ? true : false,
            remark: ct["remark"],
            approve_status: ct["approve_status"],
            approve_remark: ct["approve_remark"] != null ? ct["approve_remark"] : "",
            approve_opt: ct["approve_opt"] === "true" ? true : false,
            remark_opt: ct["remark_opt"] != null ? ct["remark_opt"] : "",
            action: ""
          })
        });

        this.panel.summary = this.model.oversea.table_travel.length > 0 ? true : false;

        this.panel.summary_approval_list = this.model.oversea.table_travel.length > 0 ? true : false;
      } else {
        // local

        datas.forEach((ct : any) => {
          this.model.local.table_travel.push({
            no: this.model.local.table_travel.length + 1,
            emp_id: ct["emp_id"],
            emp_name: ct["emp_name"],
            emp_org: ct["org"],
            business: ct["business_date"],
            travel: ct["travel_date"],
            province: ct["province"],
            air: ct["air_ticket"],
            acc: ct["accommodation"],
            allow_day: ct["allowance_day"],
            allow_night: ct["allowance_night"],
            trans: ct["transportation"],
            regis_fee: ct["registration_fee"],
            miscall: ct["miscellaneous"],
            total: ct["total_expenses"],
            ref_id: ct["ref_id"],
            status_edit: ct["edit"] == "true" ? true : false,
            status_delete: ct["delete"] == "true" ? true : false,
            remark: ct["remark"],
            approve_status: ct["approve_status"],
            approve_remark: ct["approve_remark"] != null ? ct["approve_remark"] : "",
            approve_opt: ct["approve_opt"] === "true" ? true : false,
            remark_opt: ct["remark_opt"] != null ? ct["approve_remark"] : "",
            action: ""
          })
          if (ct["approve_status"] === '2' || ct["approve_status"] === '5') {
            this.model.arrCheckUser.push({
              emp_id: ct["emp_id"],
              approve_status: ct["approve_status"],
              approve_remark: ct["approve_remark"] != null ? ct["approve_remark"] : "",
              approve_opt: ct["approve_opt"] === "true" ? true : false,
              remark_opt: ct["remark_opt"] != null ? ct["remark_opt"] : "",
            })
          }
        });

        this.panel.summary = this.model.local.table_travel.length > 0 ? true : false;

        this.panel.summary_approval_list = this.model.local.table_travel.length > 0 ? true : false;

      }
    }

    this.appMain.isLoading = true;
    this.partIIHttp.didFetch(this.app.id).subscribe(dao => {
      this.appMain.isLoading = false
      console.log('***Load data part 2***');
      console.log(dao)
      this.daoGlobal = dao
      var obj
      this.app.root_doc_status = dao["document_status"]
      if (dao["type"] === "oversea" || dao["type"] === "overseatraining") {
        // restore data oversea
        this.app.types = dao["type"] == "oversea" ? "Oversea Business" : "Oversea Training";
        prepairEmp(dao["oversea"]["employee"], dao["oversea"]["traveler"])

        obj = dao["oversea"]
        prepairTravelerList(dao["oversea"]["traveler"])
        prepairApprover(dao["oversea"]["approver"], dao["oversea"]["traveler"])

        this.model.ExchangeRates = dao["ExchangeRates"];
        this.model.ExchangeRatesDisplay = "Exchange Rates as of " + dao["ExchangeRates"]["ex_date"] + " : " + dao["ExchangeRates"]["ex_value1"] + " /" + dao["ExchangeRates"]["ex_cur"]
      } else {
        // restore data local
        //this.app.types = "Local"
        this.app.types = dao["type"] == "local" ? "Local Business" : "Local Training";
        prepairEmp(dao["local"]["employee"], dao["local"]["traveler"])

        obj = dao["local"]
        prepairTravelerList(dao["local"]["traveler"])
        prepairApprover(dao["local"]["approver"], dao["local"]["traveler"])
      }

      this.model.bugget = obj["checkbox_1"] == "true" ? true : false
      this.model.shall = obj["checkbox_2"] == "true" ? true : false
      this.model.remark = obj["remark"]


      this.model.type_flow = dao["type_flow"];

      // all button
      this.app.buttons.PartI = dao["button"]["part_i"] == "true" ? true : false
      this.app.buttons.PartII = dao["button"]["part_ii"] == "true" ? true : false
      this.app.buttons.PartIII = dao["button"]["part_iii"] == "true" ? true : false
      this.app.buttons.PartIIII = dao["button"]["part_iiii"] == "true" ? true : false


      // Rule Button
      this.buttons.save = dao["button"]["save"] == "true" ? true : false
      this.buttons.cancel = dao["button"]["cancel"] == "false" ? false : true
      this.buttons.reject = dao["button"]["reject"] == "true" ? true : false
      this.buttons.revise = dao["button"]["revise"] == "false" ? false : true
      this.buttons.approve = dao["button"]["approve"] == "false" ? false : true

      console.log('***Load data part 2/2***');
      console.log(this.model)

    }, error => this.appMain.isLoading = false)
  }

  checkBtnApprove(empId : any) {

    // let ret = this.model.arrCheckUser.filter(function (item) {
    //   return item.emp_id === empId ? true : false; //activeIds.indexOf(item.emp_id) === -1;
    // });
    // var hasMatch = this.model.arrCheckUser.find(function (value) {return value.emp_id == empId });
    var hasMatch = Boolean(this.model.arrCheckUser.find((a : any) => { return a.emp_id === empId }))
    //console.log('checkBtnApprove : ' + hasMatch);
    return hasMatch;
  }

  formatStringCutPipe(str : any) {
    var result = "";
    for (var i = 0; i < str.length; i++) {
      if (str[i] == "|") {
        return result;
      } else {
        result += str[i]
      }
    }
    return str
  }
  pushApprover({ no, line_id , type, emp_id, emp_name, emp_org, appr_id, appr_name, appr_org, remark, approve_status, approve_remark, approve_level}: any) {
    this.model.table_approver.push({
      no: no,
      line_id: line_id,
      type: type,
      emp_id: emp_id,
      emp_name: emp_name,
      emp_org: emp_org,
      appr_id: appr_id,
      appr_name: appr_name,
      appr_org: appr_org,
      remark: remark,
      approve_status: approve_status,
      approve_remark: approve_remark,
      approve_level: approve_level
    })
  }

  isOversea(): Boolean {
    return this.model.type == "oversea" || this.model.type == "overseatraining"
  }

  handleActionTravelerListSummary(index: number, action: String) { // action is edit, trash
    const edit = () => {
      if (this.isOversea()) {
        var rowCurrent = this.model.oversea.table_travel[index]
        this.model.emp.emp_id.value = rowCurrent["emp_id"]
        this.model.emp.emp_id.data = rowCurrent["emp_id"]
        this.model.emp.emp_name.value = rowCurrent["emp_name"]
        this.model.emp.emp_name.data = rowCurrent["emp_name"]
        this.model.emp.org = rowCurrent["emp_org"]
        this.model.emp.ref_id = rowCurrent["ref_id"];

        this.model.oversea.add_travel.air = rowCurrent["air"]
        this.model.oversea.add_travel.accom = rowCurrent["acc"]
        this.model.oversea.add_travel.allow = rowCurrent["allow"]
        this.model.oversea.add_travel.visa_fee = rowCurrent["visa_fee"]
        this.model.oversea.add_travel.travel_insur = rowCurrent["travel_insur"]
        this.model.oversea.add_travel.trans = rowCurrent["trans"]
        this.model.oversea.add_travel.passport_valid = rowCurrent["passport_valid"]
        this.model.oversea.add_travel.passport_expense = rowCurrent["passport_expense"]
        this.model.oversea.add_travel.cloth_valid = rowCurrent["cloth_valid"]
        this.model.oversea.add_travel.cloth_expense = rowCurrent["cloth_expense"]
        this.model.oversea.add_travel.regis_fee = rowCurrent["regis_fee"]
        this.model.oversea.add_travel.miscall = rowCurrent["miscall"]
        this.model.oversea.add_travel.isAdd = false
        this.model.oversea.add_travel.index = index
        //เก็บ emp id คนที่ edit
        this.model.emp_id_edit = rowCurrent["emp_id"]
      } else {
        var rowCurrent = this.model.local.table_travel[index]
        this.model.emp.emp_id.value = rowCurrent["emp_id"]
        this.model.emp.emp_id.data = rowCurrent["emp_id"]
        this.model.emp.emp_name.value = rowCurrent["emp_name"]
        this.model.emp.emp_name.data = rowCurrent["emp_name"]
        this.model.emp.org = rowCurrent["emp_org"]

        this.model.local.add_travel.air = rowCurrent["air"]
        this.model.local.add_travel.accom = rowCurrent["acc"]
        this.model.local.add_travel.allow_day = rowCurrent["allow_day"]
        this.model.local.add_travel.allow_night = rowCurrent["allow_night"]
        this.model.local.add_travel.trans = rowCurrent["trans"]
        this.model.local.add_travel.regis_fee = rowCurrent["regis_fee"]
        this.model.local.add_travel.miscall = rowCurrent["miscall"]

        this.model.local.add_travel.isAdd = false
        this.model.oversea.add_travel.isAdd = false;
        this.model.local.add_travel.index = index
        //เก็บ emp id คนที่ edit
        this.model.emp_id_edit = rowCurrent["emp_id"]
      }

      this.model.edit_table = true;
    }

    const trash = () => {
      // if (confirm("Do you want to delete traveler?")) {
      this.appMain.showConfirm("Do you want to delete traveler?", () => {
        if (this.isOversea()) {
          //debugger;


          this.model.oversea.table_travel.splice(index, 1);

          let no = 0;
          this.model.oversea.table_travel.forEach((current : any) => {
            current.no = no += 1;
          })


        } else {

          // debugger;
          // let bk = this.model.local.table_travel;
          // this.model.local.table_travel = [];
          // bk.splice(index, 1);

          this.model.local.table_travel.splice(index, 1);


          let no = 0;
          this.model.local.table_travel.forEach((current : any) => {
            current.no = no += 1;
          })
          // for(let i=0;i<bk.length;i++){
          //   bk[i].no = i+1
          // }
          // this.model.local.table_travel = bk;
        }
        const sortApprove = () => {
          let bk_table_approver : any  = this.model.table_approver;

          //let check_user = "";

          this.model.table_approver = [];
          var tbl = this.model.type == "oversea" || this.model.type == "overseatraining" ? this.model.oversea.table_travel : this.model.local.table_travel;
          tbl.forEach((dr : any) => {
            // if (check_user != dr["emp_id"]) {
            //   check_user = dr["emp_id"];

            let chk = this.model.table_approver.filter((x : any) => x.emp_id === dr["emp_id"]);
            if (chk.length <= 0) {

              var arr = bk_table_approver.filter((emp : any) => emp.emp_id === dr["emp_id"]);
              arr.sort((a : any, b : any) => a.approve_level.localeCompare(b.approve_level))

              let empId = "";
              let approve_level = 0;
              arr.forEach((current : any ) => {

                if (empId != current["emp_id"] && current["remark"].toLocaleLowerCase() === "cap") {
                  approve_level++;
                }
                this.pushApprover(
                  bk_table_approver.length + 1,
                  // current["line_id"],
                  // current["type"],
                  // current["emp_id"],
                  // current["emp_name"],
                  // current["emp_org"],
                  // current["appr_id"],
                  // current["appr_name"],
                  // current["appr_org"],
                  // current["remark"],
                  // current["approve_status"],
                  // current["approve_remark"],
                  // "" + approve_level + ""
                  //current["approve_level"],
                )
              });
            }
            //}
          })
        }


        sortApprove();

        this.checkUserInDropdownApprover();
        //deleteTravelerInDdl();

        this.checkUserInTable("");
      })
    }
    if (action == "edit") {
      edit()
    } else {
      trash()
    }
  }

  ngOnInit() {

  }

  checkUserInTable(emp_id : any) {
    debugger;
    if (emp_id != "") {
      let idX = emp_id;
      console.log(idX);
      this.model.emp.emp_name.list.forEach(function (item: any, index: any, object: any) {
        //console.log(item);
        //if (item.id === idX) {
        if (item.ref_id === idX) {
          object.splice(index, 1);
        }
      });
      this.model.emp.emp_id.list.forEach(function (item: any, index: any, object: any) {
        //console.log(item);
        //if (item.id === idX) {
        if (item.ref_id === idX) {
          object.splice(index, 1);
        }
      });
    }
    else {
      //alert(this.model.type)
      if (this.model.type === "oversea" || this.model.type === "overseatraining") {

        this.model.emp.emp_name.list = [];
        this.model.emp.emp_id.list = [];

        if (this.model.oversea.table_travel.length > 0) {

          const loopX = () => {

            let arr : any = [];
            let noX = 0;
            this.model.emp_mt.forEach((element : any) => {
              // var idX = element.id;
              let idX = element.ref_id;
              this.model.oversea.table_travel.forEach((el : any) => {

                //el.no = noX++;
                //if (idX != el.emp_id) {
                if (idX != el.ref_id) {
                  arr.push({
                    id: element["id"],
                    name: element["name"],
                    remark: element["remark"],
                    business_date: element["business_date"],
                    travel_date: element["travel_date"],
                    ref_id: element["ref_id"]
                  })

                }

              })
            });

            return arr;
          }
          const loopId = () => {

            let arr : any = [];
            let noX = 0;
            this.model.emp_id_mt.forEach((element : any) => {
              // var idX = element.id;
              let idX = element.ref_id;
              this.model.oversea.table_travel.forEach((el : any) => {

                //el.no = noX++;
                //if (idX != el.emp_id) {
                if (idX != el.ref_id) {
                  arr.push({
                    id: element["id"],
                    name: element["id"],
                    ref_id: element["ref_id"]
                  })

                }
              })
            });

            return arr;
          }

          this.model.emp.emp_name.list = loopX();
          this.model.emp.emp_id.list = loopId();
        }
        else {
          // this.model.emp.emp_name.list = this.model.emp_mt;
          // this.model.emp.emp_id.list = this.model.emp_id_mt;
          const loopX = () => {

            let arr : any = [];
            let noX = 0;
            this.model.emp_mt.forEach((element : any) => {
              arr.push({
                id: element["id"],
                name: element["name"],
                remark: element["remark"],
                business_date: element["business_date"],
                travel_date: element["travel_date"],
                ref_id: element["ref_id"]
              })
            });

            return arr;
          }
          const loopId = () => {

            let arr : any = [];
            let noX = 0;
            this.model.emp_id_mt.forEach((element: any) => {
              arr.push({
                id: element["id"],
                name: element["id"],
                ref_id: element["ref_id"]
              })
            });

            return arr;
          }
          this.model.emp.emp_name.list = loopX();
          this.model.emp.emp_id.list = loopId();
        }


      }
      else {

        this.model.emp.emp_name.list = [];
        this.model.emp.emp_id.list = [];

        if (this.model.local.table_travel.length > 0) {

          const loopX = () => {

            let arr : any = [];
            let noX = 0;
            this.model.emp_mt.forEach((element : any) => {
              // var idX = element.id;
              let idX = element.ref_id;
              this.model.local.table_travel.forEach((el : any ) => {

                //el.no = noX++;
                if (idX != el.ref_id) {
                  arr.push({
                    id: element["id"],
                    name: element["name"],
                    remark: element["remark"],
                    business_date: element["business_date"],
                    travel_date: element["travel_date"],
                    ref_id: element["ref_id"],
                  })

                }
              })
            });

            return arr;
          }

          const loopId = () => {

            let arr : any = [];
            let noX = 0;
            this.model.emp_id_mt.forEach((element : any) => {
              // var idX = element.id;
              let idX = element.ref_id;
              this.model.local.table_travel.forEach((el : any) => {

                //el.no = noX++;
                if (idX != el.ref_id) {
                  arr.push({
                    id: element["id"],
                    name: element["id"],
                    ref_id: element["ref_id"]
                  })

                }
              })
            });

            return arr;
          }

          this.model.emp.emp_name.list = loopX();
          this.model.emp.emp_id.list = loopId();
        }
        else {
          //this.model.emp.emp_name.list = this.model.emp_mt;
          const loopX = () => {

            let arr : any = [];
            let noX = 0;
            this.model.emp_mt.forEach((element : any) => {
              arr.push({
                id: element["id"],
                name: element["name"],
                remark: element["remark"],
                business_date: element["business_date"],
                travel_date: element["travel_date"],
                ref_id: element["ref_id"]
              })
            });

            return arr;
          }
          const loopId = () => {

            let arr : any = [];
            let noX = 0;
            this.model.emp_id_mt.forEach((element : any) => {
              arr.push({
                id: element["id"],
                name: element["id"],
                ref_id: element["ref_id"]
              })
            });

            return arr;
          }
          this.model.emp.emp_name.list = loopX();
          this.model.emp.emp_id.list = loopId();
        }
      }
    }

    //let bk_emp_name = this.model.emp.emp_name.list;
    //var arr = bk_emp_name.filter(emp => emp.emp_id === current["emp_id"]);
    this.model.emp.emp_name.list.sort((a : any, b : any) => a.id.localeCompare(b.id));
    this.model.emp.emp_id.list.sort((a : any, b : any) => a.id.localeCompare(b.id));
  }

  handleAddTravel(status: string) {   // add, edit  = "add"
    //debugger;
    console.log(this.model.emp)
    const clear = () => {
      this.model.emp.emp_id.value = ""
      this.model.emp.emp_name.value = ""
      this.model.emp.org = ""
      this.model.oversea.add_travel.isAdd = true;
      this.model.local.add_travel.isAdd = true;

      if (this.model.type == "oversea" || this.model.type == "overseatraining") {
        this.model.oversea.add_travel.passport_valid = null;
        this.model.oversea.add_travel.cloth_valid = null;
        this.model.oversea.add_travel.passport_expense = "";
        this.model.oversea.add_travel.cloth_expense = "";
      }
    }

    const valid = () => {
      if (this.model.emp.emp_id.data == "" || this.model.emp.emp_name.data == "" || this.model.emp.emp_id.value == "" || this.model.emp.emp_name.value == "") {
        this.appMain.showMessage("Please input data * ")
        this.statusValidate = true
        return false
      }
      this.statusValidate = false
      return true
    }

    const oversea = () => {
      debugger;
      var bk = this.model.oversea.add_travel;
      // var emp = this.model.emp.emp_name.list.filter(emp => emp.id === this.model.emp.emp_id.data);
      var emp = this.model.emp.emp_name.list.filter((emp : any) => emp.ref_id === this.model.emp.ref_id);

      if (status == "add") {
        this.model.oversea.table_travel.push({
          no: this.model.oversea.table_travel.length + 1,
          emp_id: this.model.emp.emp_id.data,
          emp_name: this.model.emp.emp_name.data,
          emp_org: this.model.emp.org,
          business: this.model.emp.business_date,
          travel: this.model.emp.travel_date,
          country: this.model.emp.country,
          air: bk.air,
          acc: bk.accom,
          allow: bk.allow,
          visa_fee: bk.visa_fee,
          travel_insur: bk.travel_insur,
          trans: bk.trans,
          passport_valid: bk.passport_valid,
          passport_expense: bk.passport_expense,
          cloth_valid: bk.cloth_valid,
          cloth_expense: bk.cloth_expense,
          regis_fee: bk.regis_fee,
          miscall: bk.miscall,
          total: this.parseFloats(bk.air) + this.parseFloats(bk.accom) + this.parseFloats(bk.allow) + this.parseFloats(bk.visa_fee) + this.parseFloats(bk.travel_insur) + this.parseFloats(bk.trans) + this.parseFloats(bk.passport_expense) + this.parseFloats(bk.cloth_expense) + this.parseFloats(bk.regis_fee) + this.parseFloats(bk.miscall),
          ref_id: this.model.emp.ref_id,
          status_edit: true,
          status_delete: true,
          remark: emp[0].remark,
          approve_status: "",
          approve_remark: "",
          approve_opt: "",
          remark_opt: "",
          action: status
        })

        // var master = this.model.revice_add.master_traveler.mt.filter(emp => emp._id === this.model.emp.emp_id.data);
        // if (master.length > 0) {

        //   const ddlTraveler = () => {
        //     let bk_master = this.model.revice_add.master_traveler.list;
        //     this.model.revice_add.master_traveler.list = [];
        //     console.log('<<<<<<<<<<<<<<<<<< MASTER >>>>>>>>>>>>>>>>>>>>>')
        //     bk_master.forEach(dr => {
        //       this.model.revice_add.master_traveler.list.push({
        //         '_id': dr._id,
        //         'index': dr._id,
        //         'name': this.formatStringCutPipe(dr.name)
        //       })
        //     })

        //     return true;

        //   }

        //   if (ddlTraveler()) {
        //     this.model.revice_add.master_traveler.list.push({
        //       '_id': master[0]._id,
        //       'index': master[0]._id,
        //       'name': this.formatStringCutPipe(master[0].name)
        //     })
        //     console.log(this.model.revice_add.master_traveler.list);
        //   }
        // }
        // this.model.emp_id_edit = this.model.emp.emp_id.data;

      } else {
        // edit
        this.model.oversea.table_travel[this.model.oversea.add_travel.index]["emp_id"] = this.model.emp.emp_id.data
        this.model.oversea.table_travel[this.model.oversea.add_travel.index]["emp_name"] = this.model.emp.emp_name.data
        this.model.oversea.table_travel[this.model.oversea.add_travel.index]["org"] = this.model.emp.org
        this.model.oversea.table_travel[this.model.oversea.add_travel.index]["air"] = bk.air
        this.model.oversea.table_travel[this.model.oversea.add_travel.index]["acc"] = bk.accom
        this.model.oversea.table_travel[this.model.oversea.add_travel.index]["allow"] = bk.allow
        this.model.oversea.table_travel[this.model.oversea.add_travel.index]["visa_fee"] = bk.visa_fee
        this.model.oversea.table_travel[this.model.oversea.add_travel.index]["travel_insur"] = bk.travel_insur
        this.model.oversea.table_travel[this.model.oversea.add_travel.index]["trans"] = bk.trans
        this.model.oversea.table_travel[this.model.oversea.add_travel.index]["passport_valid"] = bk.passport_valid
        this.model.oversea.table_travel[this.model.oversea.add_travel.index]["passport_expense"] = bk.passport_expense
        this.model.oversea.table_travel[this.model.oversea.add_travel.index]["cloth_valid"] = bk.cloth_valid
        this.model.oversea.table_travel[this.model.oversea.add_travel.index]["cloth_expense"] = bk.cloth_expense
        this.model.oversea.table_travel[this.model.oversea.add_travel.index]["regis_fee"] = bk.regis_fee
        this.model.oversea.table_travel[this.model.oversea.add_travel.index]["miscall"] = bk.miscall
        this.model.oversea.table_travel[this.model.oversea.add_travel.index]["total"] = this.parseFloats(bk.air) + this.parseFloats(bk.accom) + this.parseFloats(bk.allow) + this.parseFloats(bk.visa_fee) + this.parseFloats(bk.travel_insur) + this.parseFloats(bk.trans) + this.parseFloats(bk.passport_expense) + this.parseFloats(bk.cloth_expense) + this.parseFloats(bk.regis_fee) + this.parseFloats(bk.miscall)

        this.model.oversea.add_travel.isAdd = true;
      }
      this.panel.summary = true;

      this.panel.summary_approval_list = this.model.oversea.table_travel.length > 0 ? true : false;

      //this.checkUserInTable(this.model.emp.emp_id.data);
      this.checkUserInTable(this.model.emp.ref_id);
      //this.model.emp.ref_id
      clear()

    }
    const local = () => {
      debugger;
      var bk = this.model.local.add_travel
      //var emp = this.model.emp.emp_name.list.filter(emp => emp.id === this.model.emp.emp_id.data);
      var emp = this.model.emp.emp_name.list.filter((emp : any) => emp.ref_id === this.model.emp.ref_id);
      // console.log('vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv');
      // console.log(x);
      if (status == "add") {
        this.model.local.table_travel.push({
          no: this.model.local.table_travel.length + 1,
          emp_id: this.model.emp.emp_id.data,
          emp_name: this.model.emp.emp_name.data,
          emp_org: this.model.emp.org,
          business: this.model.emp.business_date,
          travel: this.model.emp.travel_date,
          province: this.model.emp.country,
          air: bk.air,
          acc: bk.accom,
          allow_day: bk.allow_day,
          allow_night: bk.allow_night,
          trans: bk.trans,
          regis_fee: bk.regis_fee,
          miscall: bk.miscall,
          total: this.parseFloats(bk.air) + this.parseFloats(bk.accom) + this.parseFloats(bk.allow_day) + this.parseFloats(bk.regis_fee) + this.parseFloats(bk.trans) + this.parseFloats(bk.miscall),
          ref_id: this.model.emp.ref_id,
          status_edit: true,
          status_delete: true,
          remark: emp[0].remark,
          approve_status: "",
          approve_remark: "",
          approve_opt: "",
          remark_opt: "",
          action: status
        })


        this.model.emp_id_edit = this.model.emp.emp_id.data;

      } else {
        // edit
        this.model.local.table_travel[this.model.local.add_travel.index]["emp_id"] = this.model.emp.emp_id.data
        this.model.local.table_travel[this.model.local.add_travel.index]["emp_name"] = this.model.emp.emp_name.data
        this.model.local.table_travel[this.model.local.add_travel.index]["org"] = this.model.emp.org
        this.model.local.table_travel[this.model.local.add_travel.index]["air"] = bk.air
        this.model.local.table_travel[this.model.local.add_travel.index]["acc"] = bk.accom
        this.model.local.table_travel[this.model.local.add_travel.index]["allow_day"] = bk.allow_day
        this.model.local.table_travel[this.model.local.add_travel.index]["allow_night"] = bk.allow_night
        this.model.local.table_travel[this.model.local.add_travel.index]["trans"] = bk.trans
        this.model.local.table_travel[this.model.local.add_travel.index]["regis_fee"] = bk.regis_fee
        this.model.local.table_travel[this.model.local.add_travel.index]["miscall"] = bk.miscall
        this.model.local.table_travel[this.model.local.add_travel.index]["total"] = this.parseFloats(bk.air) + this.parseFloats(bk.accom) + this.parseFloats(bk.allow_day) + this.parseFloats(bk.regis_fee) + this.parseFloats(bk.trans) + this.parseFloats(bk.miscall)

        this.model.local.add_travel.isAdd = true;
        this.model.oversea.add_travel.isAdd = true;
      }
      this.panel.summary = true;
      this.panel.summary_approval_list = this.model.local.table_travel.length > 0 ? true : false;

      // delete user in summary table on array search user list
      //this.checkUserInTable(this.model.emp.emp_id.data);
      this.checkUserInTable(this.model.emp.ref_id);
      //this.model.emp.ref_id

      console.log('Add traveler Local')
      console.log(this.model.local.table_travel)
      clear()
    }

    if (status == "clear") {
      clear()
      return
    }

    if (valid()) {
      if (this.model.type == "oversea" || this.model.type == "overseatraining") {
        oversea()
        this.callApiUpdateApproverList("oversea")
      } else {
        local()
        this.callApiUpdateApproverList("local")
      }


    }


    this.model.edit_table = false;
    // console.log(this.model.oversea.table_travel)
  }

  callApiUpdateApproverList(type : any) {
    var lists : any = []
    if (type == "oversea" || type == "overseatraining") {
      this.model.oversea.table_travel.forEach((item : any ) => {
        lists.push({
          "emp_id": item.emp_id,
          "total_expen": "" + item.total,
          "emp_status": item.emp_id === this.model.emp_id_edit || item.action === 'add' ? "1" : "0"
        })
        item.action === '';
      })
    } else {
      this.model.local.table_travel.forEach((item : any) => {
        lists.push({
          "emp_id": item.emp_id,
          "total_expen": "" + item.total,
          "emp_status": item.emp_id === this.model.emp_id_edit || item.action === 'add' ? "1" : "0"
        })
        //item.action = '';
      })
    }
    console.log('List user for requestApproverCalculator')
    console.log(lists)
    this.partIIHttp.requestApproverCalculator(this.app.id, lists).subscribe(response => {
      console.log('data return requestApproverCalculator')
      console.log(response)
      //this.model.table_approver = []

      // response.forEach(item => {
      //   this.pushApprover(
      //     this.model.table_approver.length + 1,
      //     item["line_id"],
      //     item["type"],
      //     item["emp_id"],
      //     item["emp_name"],
      //     item["emp_org"],
      //     item["appr_id"],
      //     item["appr_name"],
      //     item["appr_org"],
      //     item["remark"],
      //     item["approve_status"],
      //     item["approve_remark"],
      //     item["approve_level"],
      //   )
      // });

      if (type == "oversea" || type == "overseatraining") {
        debugger;
        let bk_table_approver = response;//this.model.table_approver;
        let bt_approver_font = this.model.table_approver;

        this.model.table_approver = [];
        var tbl = this.model.type == "oversea" || this.model.type == "overseatraining" ? this.model.oversea.table_travel : this.model.local.table_travel;
        var emp_status_list = lists.filter((x : any) => x.emp_status === "1");
        tbl.forEach((current : any) => {
          debugger;
          let chk = this.model.table_approver.filter((x : any) => x.emp_id === current["emp_id"]);
          if (chk.length <= 0) {
            let checkStatus = lists.filter((x : any) => x.emp_status === "1" && x.emp_id === current["emp_id"]);
            //if (emp_status_list[0].emp_id === current["emp_id"]) {
            if (checkStatus.length > 0) {
              //if (1 == 1) {
              //เป็นคนที่แก้ไขให้ใช้ข้อมูล Approver ที่ได้จากการคำนวนจากหลังบ้าน

              let arr = bk_table_approver.filter((emp : any) => emp.emp_id === current["emp_id"]);
              arr.sort((a : any, b : any) => a.approve_level.localeCompare(b.approve_level))

              let empId = "";
              let approve_level = 0;

              //debugger;
              arr.forEach((dr : any) => {

                if (empId != dr["emp_id"] && (dr["remark"] != null ? dr["remark"].toLocaleLowerCase() === "cap" : false)) {
                  approve_level++;
                }
                this.pushApprover(
                  this.model.table_approver.length + 1,
                  // dr["line_id"],
                  // dr["type"],
                  // dr["emp_id"],
                  // dr["emp_name"],
                  // dr["emp_org"],
                  // dr["appr_id"],
                  // dr["appr_name"],
                  // dr["appr_org"],
                  // dr["remark"],
                  // dr["approve_status"],
                  // dr["approve_remark"],
                  // "" + approve_level + ""
                  //current["approve_level"],
                )

              });
            }
            else {
              //ถ้าไม่ใช่คนที่แก้ไขให้ใช้ข้อมูล Approver เดิมในตาราง

              let arr = bt_approver_font.filter((emp : any) => emp.emp_id === current["emp_id"]);
              arr.sort((a : any, b : any) => a.approve_level.localeCompare(b.approve_level))

              let empId = "";
              let approve_level = 0;

              //debugger;
              arr.forEach((dr : any) => {

                if (empId != dr["emp_id"] && (dr["remark"] != null ? dr["remark"].toLocaleLowerCase() === "cap" : false)) {
                  approve_level++;
                }
                this.pushApprover(
                  this.model.table_approver.length + 1,
                  // dr["line_id"],
                  // dr["type"],
                  // dr["emp_id"],
                  // dr["emp_name"],
                  // dr["emp_org"],
                  // dr["appr_id"],
                  // dr["appr_name"],
                  // dr["appr_org"],
                  // dr["remark"],
                  // dr["approve_status"],
                  // dr["approve_remark"],
                  // "" + approve_level + ""
                  //current["approve_level"],
                )

              });
            }
          }
        })

      }
      else {

        //debugger;
        let bk_table_approver = response;//this.model.table_approver;
        //let bt_approver_font = this.model.table_approver;

        this.model.table_approver = [];
        var tbl = this.model.type == "oversea" || this.model.type == "overseatraining" ? this.model.oversea.table_travel : this.model.local.table_travel;
        var emp_status_list = lists.filter((x : any) => x.emp_status === "1");
        tbl.forEach((current : any) => {

          let chk = this.model.table_approver.filter((x : any) => x.emp_id === current["emp_id"]);
          if (chk.length <= 0) {

            let arr = bk_table_approver.filter((emp : any) => emp.emp_id === current["emp_id"]);
            arr.sort((a : any, b : any) => a.approve_level.localeCompare(b.approve_level))

            let empId = "";
            let approve_level = 0;

            //debugger;
            arr.forEach((dr : any) => {

              if (empId != dr["emp_id"] && (dr["remark"] != null ? dr["remark"].toLocaleLowerCase() === "cap" : false)) {
                approve_level++;
              }

              this.pushApprover(
                this.model.table_approver.length + 1,
                // dr["line_id"],
                // dr["type"],
                // dr["emp_id"],
                // dr["emp_name"],
                // dr["emp_org"],
                // dr["appr_id"],
                // dr["appr_name"],
                // dr["appr_org"],
                // dr["remark"],
                // dr["approve_status"],
                // dr["approve_remark"],
                // "" + approve_level + ""
                //current["approve_level"],
              )

            });

          }
        })
      }
      console.log(this.model.table_approver);
      this.checkUserInDropdownApprover();
    })
  }

  dateStrings(date: Date) {
    var d = new Date(date)
    var m = (d.getMonth() + 1) + ""
    var mm = m.length == 1 ? "0" + m : m
    var day = (d.getDate()) + ""
    var dayS = day.length == 1 ? "0" + day : day
    var result = d.getFullYear() + "-" + mm + "-" + dayS
    if (result == "NaN-NaN-NaN") {
      return ""
    } else {
      return result
    }
  }

  parseFloats(data : any) {
    if (data == null || data == "" || data == undefined) {
      return 0
    } else {
      return parseFloat(data)
    }
  }

  onSelectEmp(type: String, event : any) {
    debugger;
    console.log(event)
    var oversea = (current : any) => {
      console.log(current)
      this.model.emp.emp_id.value = current["id"]
      this.model.emp.emp_id.data = current["id"]
      this.model.emp.emp_name.value = current["name"]
      this.model.emp.emp_name.data = current["name"]
      this.model.emp.org = current["org"]
      this.model.emp.business_date = current["business_date"]
      this.model.emp.travel_date = current["travel_date"]
      this.model.emp.country = current["country"]
      this.model.emp.ref_id = current["ref_id"]

      var sht = this.model.oversea
      sht.add_travel.passport_expense = current["passport_expense"]
      sht.add_travel.cloth_expense = current["clothing_expense"]
      //sht.add_travel.regis_fee = current["visa_fee"]
    }

    var local = (current : any) => {
      this.model.emp.emp_id.value = current["id"]
      this.model.emp.emp_id.data = current["id"]
      this.model.emp.emp_name.value = current["name"]
      this.model.emp.emp_name.data = current["name"]
      this.model.emp.org = current["org"]
      this.model.emp.business_date = current["business_date"]
      this.model.emp.travel_date = current["travel_date"]
      this.model.emp.country = current["province"]
      this.model.emp.ref_id = current["ref_id"]
    }

    // Aun Check type name and convert overseatraining to oversea , localtraining to local
    let typeX = this.model.type == "oversea" || this.model.type == "overseatraining" ? "oversea" : "local";

    // this.daoGlobal[this.model.type]["employee"].forEach(current => {
    this.daoGlobal[typeX]["employee"].forEach((current : any) => {
      if (type == "name") {
        if (current["ref_id"] == event["ref_id"]) {
          if (this.model.type == "oversea" || this.model.type == "overseatraining") {
            oversea(current)
          } else {
            local(current)
          }
        }
      } else {
        if (current["ref_id"] == event["ref_id"]) {
          if (this.model.type == "oversea" || this.model.type == "overseatraining") {
            oversea(current)
          } else {
            local(current)
          }
        }
      }
    });
    this.onAutoPassport()
  }

  onAutoPassport() {
    if (this.isOversea()) {
      this.partIIHttp.checkPassport(this.app.id, this.model.emp.emp_id.data).subscribe(value => {
        console.log(value)
        // new Date(dao["business_date"]["start"])
        this.model.oversea.add_travel.passport_valid = value["PassportDate"] == "" ? "" : new Date(value["PassportDate"])// value["PassportDate"]
        this.model.oversea.add_travel.passport_expense = value["PassportExpense"]
        this.model.oversea.add_travel.cloth_valid = value["CLDate"] == "" ? "" : new Date(value["CLDate"]) //value["CLDate"]
        this.model.oversea.add_travel.cloth_expense = value["CLExpense"]
      })
    }

  }

  onSearchBehalfEmpID() {
    if (this.model.revice_add.emp_id.value.length > 1) {
      var bucketNew : any = []
      this.masterHttp.onSearchEmployee(this.model.revice_add.emp_id.value, "").subscribe(dao => {
        this.model.revice_add.emp_id.list = [];
        dao.forEach((element : any) => {
          bucketNew.push({ id: "" + element["empId"], name: element["empId"], nameFull: element["empName"], dept: element["deptName"] });
        });
        this.model.revice_add.emp_id.list = bucketNew
      })
    }
  }

  onSelectedBehalfEmpID(event : any) {
    this.model.revice_add.emp_name.value = event["nameFull"];
    this.model.revice_add.emp_org = event["dept"];
    this.model.revice_add.emp_id.data = event["id"];
    this.model.revice_add.emp_name.data = event["nameFull"];
  }

  onSearchBehalfEmpName(event : any) {
    this.model.revice_add.emp_id.list = [];
    if (event.length > 1) {
      var bucketNew : any = []
      this.masterHttp.onSearchEmployee("", event).subscribe(dataNew => {
        dataNew.forEach((element : any) => {
          bucketNew.push({ id: "" + element["empId"], name: element["empName"], nameFull: element["empName"], dept: element["deptName"] });
        });
        this.model.revice_add.emp_name.list = bucketNew
      })
    }
  }

  onSelectedBehalfEmpName(event : any) {
    this.model.revice_add.emp_id.value = event["id"];
    this.model.revice_add.emp_org = event["dept"];
    this.model.revice_add.emp_name.data = event["name"];
    this.model.revice_add.emp_id.data = event["id"];
  }

  handleActionForTravelerList(status: String, index: number = 0) {    //add, trash
    console.log(status)
    if (status == "add") {
      // add
      if (this.model.revice_add.master_traveler.value == undefined) {
        return
      }
      this.pushReviseTraveler(
        this.model.revice_add.master_traveler.value["index"],
        this.model.revice_add.master_traveler.value["name"],
        this.searchEmpOrg(this.model.revice_add.master_traveler.value["index"])
      )
      this.model.revice_add.master_traveler.value = []
    } else {
      // trash
      this.appMain.showConfirm("Do you want to delete traveler?", () => {
        // if (confirm("Do you want to delete traveler?")) {

        this.model.revice_add.traveler_list.splice(index, 1);
      })
    }
    //this.reloadMasterForTravelerInReviseApprover()
  }

  searchEmpOrg(id: String) {
    var result = "No data";
    // Aun Check type name and convert overseatraining to oversea , localtraining to local
    let typeX = this.model.type == "oversea" || this.model.type == "overseatraining" ? "oversea" : "local";
    // this.daoGlobal[this.model.type]["employee"].forEach(current => {
    this.daoGlobal[typeX]["employee"].forEach((current : any)=> {
      if (id == current["id"]) {
        console.log(current["org"])
        result = current["org"]
        return current["org"]
      }
    });
    console.log("RE");
    return result
  }

  pushReviseTraveler(id: any, name: any, org: any) {
    this.model.revice_add.traveler_list.push({
      id: id,
      name: name,
      org: org,
      //ref_id: ref_id
    })
  }

  handleActionApprover(action: String) {

    if (
      this.model.revice_add.emp_id.value == "" ||
      this.model.revice_add.emp_id.data == "" ||
      this.model.revice_add.emp_name.value == "" ||
      this.model.revice_add.emp_name.data == "") {
      this.appMain.showMessage("Please input data * ");
      this.statusValidateAdd = true;
      return;
    }
    this.statusValidateAdd = false;

    const clear = () => {
      // this.model.revice_add.traveler_list = []
      // this.reloadMasterForTravelerInReviseApprover()
      // this.panel.revise_button_add = true

      this.handleClearFormRevise();
      this.hide.add_revice_approver = true;
    }

    const addNewData = () => {

      //this.model.revice_add.approval_line = this.model.table_approver[index]["type"] == "1" ? "endorsed" : "cap"
      let approve_level = "0";

      debugger;
      this.model.revice_add.traveler_list.forEach((current: any) => {
        console.log(current)
        console.log(current["id"])

        if (this.model.revice_add.approval_line === "cap") {
          // this.model.table_approver.push({
          //   no: no,
          //   line_id: line_id,
          //   type: type,
          //   emp_id: emp_id,
          //   emp_name: emp_name,
          //   emp_org: emp_org,
          //   appr_id: appr_id,
          //   appr_name: appr_name,
          //   appr_org: appr_org,
          //   remark: remark,
          //   approve_status: approve_status,
          //   approve_remark: approve_remark,
          //   approve_level: approve_level
          // })remark: "CAP"
          var emp = this.model.table_approver.filter((emp: any) => emp.emp_id === current["id"] && emp.remark.toLocaleLowerCase() === "cap");

          console.log('Check traveler in cap')
          console.log(emp);

          approve_level = "" + (emp.length + 1) + "";
        }

        this.pushApprover(
          (this.model.table_approver.length + 1) + "",
          // (this.model.table_approver.length + 1) + "",
          // this.model.revice_add.approval_line == "endorsed" ? "1" : "2",
          // current["id"],
          // current["name"],
          // current["org"],
          // this.model.revice_add.emp_id.data,
          // this.model.revice_add.emp_name.data,
          // this.model.revice_add.emp_org,
          // this.model.revice_add.approval_line == "endorsed" ? "Endorsed" : "CAP",
          // "",
          // "",
          // approve_level
        )

        let bk_table_approver = this.model.table_approver;

        let check_user = "";
        let check_user_arr : any = [];
        this.model.table_approver = [];
        var tbl = this.model.type == "oversea" || this.model.type == "overseatraining" ? this.model.oversea.table_travel : this.model.local.table_travel;

        tbl.forEach((dr : any) => {
          let arrX = check_user_arr.filter((x : any) => x.emp_id === dr["emp_id"]);
          if (arrX.length > 0) {

          }
          else {
            check_user_arr.push({
              emp_id: dr["emp_id"]
            });

            var arr = bk_table_approver.filter((emp : any) => emp.emp_id === dr["emp_id"]);
            arr.sort((a : any, b : any) => a.approve_level.localeCompare(b.approve_level))

            let empId = "";
            let approve_level = 0;
            arr.forEach((current : any) => {

              if (empId != current["emp_id"] && current["remark"].toLocaleLowerCase() === "cap") {
                approve_level++;
              }
              //var filter_tbl_approver = bk_table_approver.filter(x => x.approve_level === current["approve_level"] && x.appr_id === current["appr_id"]);
              //if (filter_tbl_approver.length <= 0) {
              this.pushApprover(
                bk_table_approver.length + 1,
                // current["line_id"],
                // current["type"],
                // current["emp_id"],
                // current["emp_name"],
                // current["emp_org"],
                // current["appr_id"],
                // current["appr_name"],
                // current["appr_org"],
                // current["remark"],
                // current["approve_status"],
                // current["approve_remark"],
                // "" + approve_level + ""
                //current["approve_level"],
              )
              //}
            });
          }
          if (check_user != dr["emp_id"]) {
            check_user = dr["emp_id"];



          }
        })

      })



      clear();
      console.log(this.model.table_approver);
      this.panel.approval_list = true;
    }
    if (this.model.revice_add.traveler_list.length == 0) {
      this.appMain.showMessage("Please add traveler or click button (+)")
      return
    }
    if (action == "add") {
      console.log("ADD")
      // add
      addNewData()
      clear()
    } else {
      // edit
      console.log('edit approver')
      console.log(this.currentIndexEditApprover)
      console.log(this.model.revice_add.traveler_list);

      this.model.table_approver.forEach((current : any) => {
        this.model.revice_add.traveler_list.forEach((dr : any) => {
          console.log(dr)
          console.log(current)
          //&& this.model.revice_add.approval_line.toLocaleLowerCase() === this.model.table_approver[i]["remark"].toLocaleLowerCase()
          if (current.emp_id === dr.id && this.model.revice_add.approval_line.toLocaleLowerCase() === current.remark.toLocaleLowerCase() && this.model.revice_add.approve_level === current.approve_level) {
            // current.no: no,
            // current.line_id: line_id,
            // current.type: type,
            // current.emp_id: emp_id,
            // current.emp_name: emp_name,
            // current.emp_org: emp_org,
            current.appr_id = this.model.revice_add.emp_id.data,
              current.appr_name = this.model.revice_add.emp_name.data,
              current.appr_org = this.model.revice_add.emp_org
            // current.remark: remark,
            // current.approve_status: approve_status,
            // current.approve_remark: approve_remark,
            // current.approve_level: approve_level
          }
        });
      });
      console.log(this.model.table_approver)
      // this.model.revice_add.emp_id.data,
      // this.model.revice_add.emp_name.data,
      // this.model.revice_add.emp_org,
      // clear all data

      // for (var i = (this.currentIndexEditApprover.length - 1); i >= 0; i--) {
      //   console.log(this.currentIndexEditApprover[i])
      //   this.model.table_approver.splice(this.currentIndexEditApprover[i], 1);
      // }

      //addNewData()

      clear()


      // add new data

      this.panel.approval_list = false;
    }
    this.cancelEditApprover();
    this.panel.summary_approval_list = true;
  }

  handleClearFormRevise() {

    this.model.revice_add.approval_line = "endorsed"
    this.model.revice_add.emp_id.value = ""
    this.model.revice_add.emp_id.data = ""
    this.model.revice_add.emp_name.value = ""
    this.model.revice_add.emp_name.data = ""
    this.model.revice_add.emp_org = ""
    this.model.revice_add.traveler_list = []
    this.reloadMasterForTravelerInReviseApprover()
    this.panel.revise_button_add = true
    this.currentIndexEditApprover = []

    this.selectTypeApprover('endorsed');
    return
  }

  cancelEditApprover() {
    this.model.revice_add.emp_id.value = "";
    this.model.revice_add.emp_org = "";
    this.model.revice_add.emp_name.value = "";
    this.model.revice_add.traveler_list = [];
    this.model.edit_approver = false;
  }

  handleActionApproverShowTextToEdit(action: String, index : any) {
    debugger;
    this.currentIndexEditApprover = []
    if (action == "edit") {
      //
      this.model.revice_add.approval_line = this.model.table_approver[index]["type"] == "1" ? "endorsed" : "cap";
      this.model.revice_add.approve_level = this.model.table_approver[index]["approve_level"];

      this.model.revice_add.traveler_list = []
      var appName = this.model.table_approver[index]["appr_id"];
      var empId = this.model.table_approver[index]["emp_id"];
      for (var i = 0; i < this.model.table_approver.length; i++) {
        if (this.model.table_approver[i]["appr_id"] == appName
          && this.model.table_approver[i]["emp_id"] == empId
          && this.model.revice_add.approval_line.toLocaleLowerCase() === this.model.table_approver[i]["remark"].toLocaleLowerCase()
          && this.model.revice_add.approve_level === this.model.table_approver[i]["approve_level"]) {
          this.model.revice_add.traveler_list.push({
            id: this.model.table_approver[i]["emp_id"],
            name: this.model.table_approver[i]["emp_name"],
            org: this.model.table_approver[i]["emp_org"]
          })
          this.currentIndexEditApprover.push()
        }
      }

      this.model.revice_add.emp_id.value = this.model.table_approver[index]["appr_id"]
      this.model.revice_add.emp_id.data = this.model.table_approver[index]["appr_id"]
      this.model.revice_add.emp_name.value = this.model.table_approver[index]["appr_name"]
      this.model.revice_add.emp_name.data = this.model.table_approver[index]["appr_name"]
      this.model.revice_add.emp_org = this.model.table_approver[index]["appr_org"]

      this.model.revice_add.approve_level = this.model.table_approver[index]["approve_level"]


      this.panel.approval_list = true
      this.hide.add_revice_approver = false
      this.panel.revise_button_add = false

      this.model.edit_approver = true;

    } else {
      this.appMain.showConfirm("Do you want to delete data?", () => {
        // if (confirm("Do you want to delete data?")) {
        this.model.table_approver.splice(index, 1);

        let bk_table_approver = this.model.table_approver;

        let check_user = "";
        let check_user_arr : any = [];
        this.model.table_approver = [];
        var tbl = this.model.type == "oversea" || this.model.type == "overseatraining" ? this.model.oversea.table_travel : this.model.local.table_travel;

        tbl.forEach((dr : any)=> {
          let arrX = check_user_arr.filter((x : any) => x.emp_id === dr["emp_id"]);
          if (arrX.length > 0) {

          }
          else {
            check_user_arr.push({
              emp_id: dr["emp_id"]
            });

            var arr = bk_table_approver.filter((emp : any)=> emp.emp_id === dr["emp_id"]);
            arr.sort((a : any, b : any) => a.approve_level.localeCompare(b.approve_level))

            let empId = "";
            let approve_level = 0;
            arr.forEach((current : any) => {

              if (empId != current["emp_id"] && current["remark"].toLocaleLowerCase() === "cap") {
                approve_level++;
              }
              //var filter_tbl_approver = bk_table_approver.filter(x => x.approve_level === current["approve_level"] && x.appr_id === current["appr_id"]);
              //if (filter_tbl_approver.length <= 0) {
              this.pushApprover(
                bk_table_approver.length + 1,
                // current["line_id"],
                // current["type"],
                // current["emp_id"],
                // current["emp_name"],
                // current["emp_org"],
                // current["appr_id"],
                // current["appr_name"],
                // current["appr_org"],
                // current["remark"],
                // current["approve_status"],
                // current["approve_remark"],
                // "" + approve_level + ""
                //current["approve_level"],
              )
              //}
            });
          }
          if (check_user != dr["emp_id"]) {
            check_user = dr["emp_id"];



          }
        })

        // let bk_table_approver = this.model.table_approver;
        // let check_user = "";
        // this.model.table_approver = [];
        // var tbl = this.model.type == "oversea" || this.model.type == "overseatraining" ? this.model.oversea.table_travel : this.model.local.table_travel;
        // tbl.forEach(dr => {

        //   if (check_user != dr["emp_id"]) {
        //     check_user = dr["emp_id"];

        //     var arr = bk_table_approver.filter(emp => emp.emp_id === dr["emp_id"]);
        //     arr.sort((a, b) => a.approve_level.localeCompare(b.approve_level))

        //     let empId = "";
        //     let approve_level = 0;
        //     arr.forEach(current => {

        //       if (empId != current["emp_id"] && current["remark"].toLocaleLowerCase() === "cap") {
        //         approve_level++;
        //       }
        //       this.pushApprover(
        //         bk_table_approver.length + 1,
        //         current["line_id"],
        //         current["type"],
        //         current["emp_id"],
        //         current["emp_name"],
        //         current["emp_org"],
        //         current["appr_id"],
        //         current["appr_name"],
        //         current["appr_org"],
        //         current["remark"],
        //         current["approve_status"],
        //         current["approve_remark"],
        //         "" + approve_level + ""
        //         //current["approve_level"],
        //       )
        //     });
        //   }
        // })

        console.log('Delete approver')
        console.log(this.model.table_approver);
        this.checkUserInDropdownApprover();
      })
    }
  }

  handleActionPages(action: stateAction) {
    const convertParameter = (action: String, remark: String) => {

      // table approver
      var table_approvers : any = []
      this.model.table_approver.forEach((ap : any) => {
        table_approvers.push({
          "line_id": ap["line_id"],
          "type": ap["type"], // 1:line, 2:cap
          "emp_id": ap["emp_id"],
          "emp_name": ap["emp_name"],
          "emp_org": ap["emp_org"],
          "appr_id": ap["appr_id"],
          "appr_name": ap["appr_name"],
          "appr_org": ap["appr_org"],
          "approve_level": ap["approve_level"],
          "remark": ((ap["remark"] == "CAP") || (ap["remark"] == "cap")) ? "CAP" : "Endorsed" // Endorsed, CAP
        })

        // table_approvers.push({
        //   "line_id": ap["line_id"],
        //   "type": ap["type"], // 1:line, 2:cap
        //   "emp_id": ap["appr_id"],
        //   "emp_name": ap["appr_name"],
        //   "emp_org": ap["appr_org"],
        //   "appr_id": ap["emp_id"],
        //   "appr_name": ap["emp_name"],
        //   "appr_org": ap["emp_org"],
        //   "remark": ((ap["remark"] == "CAP") || (ap["remark"] == "cap")) ? "CAP" : "Endorsed" // Endorsed, CAP
        // })

      })

      var data : any = {
        "token_login": localStorage["token"],
        "doc_id": this.app.id,
        "type": this.model.type,
        "action": {
          "type": action,
          "remark": remark
        },
        "oversea" : {},
        "local": {}
      }
      if (this.isOversea()) {
        data.oversea = {
          "traveler": [],
          "approver": table_approvers,
          "checkbox_1": this.model.bugget,
          "checkbox_2": this.model.shall,
          "remark": this.model.remark
        }

        // table traveler
        this.model.oversea.table_travel.forEach((tv : any) => {
          data.oversea["traveler"].push({
            "emp_id": tv.emp_id,
            "air_ticket": tv.air,
            "accommodation": tv.acc,
            "allowance": tv.allow,
            "clothing_valid": this.dateStrings(tv.cloth_valid),
            "clothing_expense": tv.cloth_expense,
            "passport_valid": this.dateStrings(tv.passport_valid),
            "passport_expense": tv.passport_expense,
            "visa_fee": tv.visa_fee,
            "travel_insurance": tv.travel_insur,
            "transportation": tv.trans,
            "registration_fee": tv.regis_fee,
            "miscellaneous": tv.miscall,
            "total_expenses": tv.total,
            "ref_id": tv.ref_id
          })
        })

      } else {
        data.local = {
          "traveler": [],
          "approver": table_approvers,
          "checkbox_1": this.model.bugget,
          "checkbox_2": this.model.shall,
          "remark": this.model.remark
        }

        // table traveler
        this.model.local.table_travel.forEach((tv : any) => {
          data.local["traveler"].push({
            "emp_id": tv.emp_id,
            "air_ticket": tv.air,
            "accommodation": tv.acc,
            "allowance_day": tv.allow_day,
            "allowance_night": tv.allow_night,
            "transportation": tv.trans,
            "registration_fee": tv.regis_fee,
            "miscellaneous": tv.miscall,
            "total_expenses": tv.total,
            "ref_id": tv.ref_id
          })
        })
      }
      return data
    }

    const requestData = (): Boolean => {
      // console.log(this.model)
      // // True: Success, False: Failed

      // // check on behalf
      // if (this.model.behalf.status) {
      //   // checked on Behalf of
      //   if (this.model.behalf.emp_id.data == "") {
      //     this.statusValidate = true
      //     return false
      //   }
      // }

      // if (
      //   this.model.company.value == [] ||
      //   this.model.company.value == undefined ||
      //   this.model.topic_of_travel == "" ||
      //   this.model.business_date.length < 2 ||
      //   this.model.business_date[0] == null ||
      //   this.model.travel_object_expected == ""
      // ) {
      //   this.statusValidate = true
      //   return false
      // }

      // // check Travel Type
      // if (this.model.type_of_travel.meeting != true &&
      //   this.model.type_of_travel.siteVisite != true &&
      //   this.model.type_of_travel.workshop != true &&
      //   this.model.type_of_travel.roadshow != true &&
      //   this.model.type_of_travel.conference != true &&
      //   this.model.type_of_travel.other != true) {
      //   this.statusValidate = true
      //   return false
      // }

      // if (this.type == "oversea") {
      //   if (this.model.country.select.length == 0) {
      //     this.statusValidate = true
      //     return false
      //   }
      // } else {
      //   if (this.model.province.select.length == 0) {
      //     this.statusValidate = true
      //     return false
      //   }
      // }


      // return true
      return true
    }

    const checkDataforSubmit = (): string => {

      console.log('check Estimate Expenses of traveler');
      console.log(this.model.emp.emp_name.list);

      let msg = "";
      if (this.model.emp.emp_name.list.length === 0) {
        msg = "true";
      } else {
        msg = "Estimate Expenses of traveler is not complete!";

        this.model.emp.emp_name.list.forEach((dr : any) => {
          msg += "\n - " + dr.name;

        })
      }

      return msg;
    }

    const save = () => {
      if (this.buttons.save == false) {
        return
      }
      if (requestData()) {
        // if (confirm(this.messages[this.messages.rule].save)) {

        this.appMain.showConfirm(this.messages.admin.save, () => {
          this.appMain.isLoading = true;
          this.partIIHttp.onSave(convertParameter("1", "")).subscribe(dao => {
            this.appMain.isLoading = false;
            console.log(dao);
            if (dao["status"] == "S") {
              this.appMain.showMessage("Done.");
              //// Save แล้วไม่ต้อง direct ไปหน้า tracking
              // if (this.model.type_flow === "1") {
              //   this.router.navigate(["/main/request_list", this.model.type]);
              // } else { }
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
      this.appMain.showConfirm(this.messages.admin.cancel, () => {
        //if (confirm(this.messages[this.messages.rule].cancel)) {
        this.appMain.isLoading = true
        this.partIIHttp.onSave(convertParameter("6", "")).subscribe(dao => {
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
        this.partIIHttp.onSave(convertParameter("2", remarks)).subscribe(dao => {
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
        this.partIIHttp.onSave(convertParameter("3", remarks)).subscribe(dao => {
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
      let msg = "";
      if (checkDataforSubmit() === "true") {
        // if (confirm("Do you want to submit the document?")) {
        this.appMain.showConfirm(this.messages.admin["submit"], () => {
          this.appMain.isLoading = true
          console.log('***Data tab expense to method : docFlow2***');
          console.log(convertParameter("5", ""));
          this.partIIHttp.onSave(convertParameter("5", "")).subscribe(dao => {
            this.appMain.isLoading = false
            if (dao["status"] == "S") {
              this.appMain.showMessage("Done.");
              if (this.model.type_flow === "1") {
                this.router.navigate(["/main/request_list", this.model.type]);
              } else {
                this.router.navigate(["/main/request", "edit", this.app.id, "iii"]);
              }
            } else {
              console.log('submit expense not success.');
              console.log(dao);
              this.appMain.showMessage(dao["message"]);
            }
          }, error => this.appMain.isLoading = false);
        })
      } else {
        this.appMain.showMessageInfo(checkDataforSubmit());
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

  showRemarkFlow(txt : any) {
    this.appMain.showMessage('Reason for Reject : ' + txt);
  }

  selectTypeApprover(type: string) {
    //alert('xx')
    //debugger;
    this.model.revice_add.approval_line = type;

    this.checkUserInDropdownApprover();
  }

  checkUserInDropdownApprover() {
    debugger;
    const CheckTravelerInTblTravel = () => {


      let bk_ = this.model.revice_add.master_traveler.mt;
      this.model.revice_add.master_traveler.list = [];
      let newArr : any = [];
      var tbl2 = this.model.type == "oversea" || this.model.type == "overseatraining" ? this.model.oversea.table_travel : this.model.local.table_travel;
      //let bkEmpId = "";
      tbl2.forEach((dr : any) => {
        var arr = bk_.filter((emp : any) => emp._id === dr["emp_id"]);

        arr.forEach((data : any) => {
          let chk = newArr.filter((emp : any) => emp._id === data._id);
          if (chk.length <= 0) {
            newArr.push({
              '_id': data._id,
              'index': data._id,
              'name': this.formatStringCutPipe(data.name)
            })
          }
          //bkEmpId = data._id;
        })
      })
      this.model.revice_add.master_traveler.list = newArr;
      // this.model.table_approver.forEach(dr => {
      //   var hasMatch = Boolean(arrTraveler.find(a => { return a.emp_id === current["id"] }))
      //   if (hasMatch) {
      //   }
      // })
    }

    const CheckEndorsedInTblApprover = () => {
      debugger;
      var chk = this.model.table_approver.filter((x : any) => x.remark.toLocaleLowerCase() === "endorsed");

      let bk_ = this.model.revice_add.master_traveler.list;
      if (chk.length > 0) {

        this.model.revice_add.master_traveler.list = [];

        chk.forEach((dr : any) => {

          var foundIndex = bk_.findIndex((x : any) => x._id == dr.emp_id);

          bk_.splice(foundIndex, 1);
        })

        this.model.revice_add.master_traveler.list = bk_;
      }
    }

    if (this.model.revice_add.approval_line === 'endorsed') {
      CheckTravelerInTblTravel();
      CheckEndorsedInTblApprover();
    }
    else {
      CheckTravelerInTblTravel();
    }

  }
}
