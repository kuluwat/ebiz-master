// import {Component, OnInit, Inject, forwardRef, ɵConsole} from '@angular/core';
// import { RequestComponent } from '../../../main/request/request.component';
// import {ActivatedRoute, Router} from '@angular/router';
// import { stateAction } from '../../../components/state/stateAction';
// import { MasterService } from '../../../http/master/master.service';
// import { PartIService } from '../../../http/part-i/part-i.service';
// import { MainComponent } from '../../../main/main.component';
// import { AspxserviceService } from '../../../ws/httpx/aspxservice.service';

// @Component({
//   selector: 'app-request-part-i',
//   templateUrl: './request-part-i.component.html',
//   styleUrls: [ './request-part-i.component.css' ]
// })
// export class RequestPartIComponent implements OnInit {
//   type: string = ""
//   stateGlobal = null
//   displayedColumns = [ 'No.', 'Employee Name', 'Organization Unit', 'Country', 'Business Day', 'GL Account', 'Cost Center', 'Order / WRS', 'Remark', 'Option' ];
//   inputFormat = {
//     prefix: '',
//     thousands: ',',
//     precision: '2',
//     suffix: ' THB'
//   }

//   inputFormatInt = {
//     prefix: '',
//     thousands: ',',
//     precision: '0',
//     suffix: ' THB'
//   }

//   inputFormatIntOnly = {
//     prefix: '',
//     thousands: '',
//     precision: '0',
//     suffix: ''
//   }

//   inputFormatDay = {
//     prefix: '',
//     thousands: ',',
//     precision: '0'
//   }

//   model = {
//     document_id: "",
//     doc_status: "",
//     approved: {
//       status: false
//     },
//     behalf: {
//       status: false,
//       emp_id: {
//         value: "",    // have string or object
//         list: [],
//         data: ""      // is data use to call api
//       },
//       emp_title: "",
//       emp_name: {
//         value: "",    // have string or object
//         list: [],
//         data: ""      // is data use to call api
//       },
//       emp_org: ""
//     },
//     company: {
//       value: [],
//       config: {
//         displayKey: 'name', // if objects array passed which key to be displayed defaults to description
//         search: true,
//         limitTo: 0,
//         placeholder: ' '
//       },
//       list: []
//     },
//     type_of_travel: {
//       meeting: false,
//       siteVisite: false,
//       workshop: false,
//       roadshow: false,
//       conference: false,
//       other: false,
//       training: false,
//       value: "",
//       remark: "",

//     },
//     topic_of_travel: "",
//     type_radio: "single",  // single / multi
//     continent: {
//       data_id: "",  // TODO :: Deleted
//       value: [],
//       config: {
//         height: "500px",
//         displayKey: 'name', // if objects array passed which key to be displayed defaults to description
//         search: true,
//         limitTo: 0,
//         placeholder: ' '
//       }, // TODO :: Deleted
//       list: [],
//       select: [],
//       settingMulti: {
//         enableCheckAll: false,
//         singleSelection: false,
//         idField: 'item_id',
//         textField: 'item_text',
//         selectAllText: 'Select All',
//         unSelectAllText: 'UnSelect All',
//         itemsShowLimit: 100,
//         allowSearchFilter: true,
//         closeDropDownOnSelection: true
//       }
//     },
//     country: {
//       list: [],
//       select: [],
//       settingSingle: {
//         enableCheckAll: false,
//         singleSelection: true,
//         idField: 'item_id',
//         textField: 'item_text',
//         selectAllText: 'Select All',
//         unSelectAllText: 'UnSelect All',
//         itemsShowLimit: 100,
//         allowSearchFilter: true,
//         closeDropDownOnSelection: true
//       },
//       settingMulti: {
//         enableCheckAll: false,
//         singleSelection: false,
//         idField: 'item_id',
//         textField: 'item_text',
//         selectAllText: 'Select All',
//         unSelectAllText: 'UnSelect All',
//         itemsShowLimit: 100,
//         allowSearchFilter: true,
//         closeDropDownOnSelection: true
//       }
//     },
//     province: {
//       list: [],
//       select: [],
//       settingSingle: {
//         enableCheckAll: false,
//         singleSelection: true,
//         idField: 'item_id',
//         textField: 'item_text',
//         selectAllText: 'Select All',
//         unSelectAllText: 'UnSelect All',
//         itemsShowLimit: 100,
//         allowSearchFilter: true,
//         closeDropDownOnSelection: true
//       },
//       settingMulti: {
//         enableCheckAll: false,
//         singleSelection: false,
//         idField: 'item_id',
//         textField: 'item_text',
//         selectAllText: 'Select All',
//         unSelectAllText: 'UnSelect All',
//         itemsShowLimit: 100,
//         allowSearchFilter: true,
//         closeDropDownOnSelection: true
//       }
//     },
//     city: "",
//     business_date: [],
//     travel_date: [],
//     duration: "",
//     travel_object_expected: "",
//     add_travel: {
//       continent: "",
//       continent_id: "",
//       gl_auto: {
//         list: []
//       },
//       cost_center_master: {
//         list: []
//       },
//       wbs: {
//         list: []
//       },
//       country: {
//         value: [],
//         config: {
//           displayKey: 'name', // if objects array passed which key to be displayed defaults to description
//           search: true,
//           limitTo: 99,
//           itemsShowLimit: 0,
//           clearOnSelection: true,
//           placeholder: ' ',
//           customComparator: (function (a : any, b : any) {
//             if (a.name < b.name) {return -1;}
//             if (a.name > b.name) {return 1;}
//             return 0;
//           })
//         },
//         list: []
//       },
//       city: "",
//       business_date: [],
//       travel_date: [],
//       duration: "",
//       emp_id: {
//         value: "",
//         list: [],
//         data: ""
//       },
//       emp_title: "",
//       emp_name: {
//         value: "",
//         list: [],
//         data: ""
//       },
//       emp_org: "",
//       gl: "",
//       cost: "",
//       order_wrs: "",
//       note: "",
//       traveler_ref_id: ""
//     },
//     summary_table: [],
//     initiator: {
//       status: false,
//       emp_id: {
//         value: "",    // have string or object
//         list: [],
//         data: ""      // is data use to call api
//       },
//       emp_title: "",
//       emp_name: {
//         value: "",    // have string or object
//         list: [],
//         data: ""      // is data use to call api
//       },
//       emp_org: "",
//       remark: ""
//     },
//     after: {
//       ref1: {
//         value: false,
//         remark: ""
//       },
//       ref2: {
//         value: false,
//         remark: ""
//       },
//       ref3: {
//         value: false,
//         remark: ""
//       }
//     },
//     remark: "",
//     user_type: "",
//     requestr_user_type: "",
//     requester_emp_name: ""
//   }

//   buttons = {
//     save: true,
//     submit: true,
//     cancel: true
//   }

//   states = {
//     add_travel_type: "add", // add / edit
//     add_travel_indexpath: 0
//   }

//   config = {
//     validate: "Please input data. *"
//   }

//   daoCountry = [];

//   selected = 'option2';
//   panelOpenState = false;

//   panel = {
//     travel: false,
//     table: false,
//     initiator: false,
//     after: true
//   }

//   messages = {
//     "rule": "request",
//     "request": {
//       save: "Do you want to save the document?",
//       cancel: "Do you want to cancel the document?",
//       submitInitiator: "Do you want to submit the document? \nThe document will send to Initiator",
//       submit: "Do you want to submit the document? "
//     },
//     "initator": {
//       save: "Do you want to save the document?",
//       cancel: "Do you want to cancel the document?",
//       submitInitiator: "Do you want to submit the document? \nThe document will send to Initiator",
//       submit: "Do you want to submit the document? "
//     },
//     "super_admin": {
//       save: "Do you want to save the document?",
//       cancel: "Do you want to cancel the document?",
//       submitInitiator: "Do you want to submit the document? \nThe document will send to Initiator",
//       submit: "Do you want to submit the document? "
//     }
//   }

//   profile = {
//     username: "",
//     images: "",
//     user_admin: null,
//     emp_id: "",
//     user_type: ""
//   }

//   statusValidate = false
//   statusValidateAddTravel = false

//   arrayOfValues: any;
//   isParams: boolean = false;
//   disCheckApproved: boolean = false;
//   disCheckEmp: boolean = false;

//   constructor(
//     @Inject(forwardRef(() => MainComponent)) private appMain: MainComponent,
//     @Inject(forwardRef(() => RequestComponent)) private app: RequestComponent,
//     private masterHttp: MasterService,
//     private partIHttp: PartIService,
//     private router: Router,
//     private activatedRoute: ActivatedRoute,
//     public ws: AspxserviceService,
//   ) {
//     //this.appMain.isLoading = true;
//     // this.app.select = "i"
//     // console.log(app.id);
//     // console.log(app.type);
//     // if (app.type == "create") {
//     //   // MARK :: Create Document
//     //   ////debugger;
//     //   this.type = app.id;

//     //   const myArray = this.router.getCurrentNavigation().extras.state;
//     //   if (myArray === null || myArray === undefined) {
//     //     this.arrayOfValues = new Array<string>();
//     //   } else {



//     //     this.isParams = true;
//     //     console.log('----- Param value-----');
//     //     console.log(myArray.requestDetails);
//     //     //console.log(myArray.requestDetails.queryParams.dateFrom);
//     //     const checkParam = () => {
//     //       let ret = false;
//     //       this.arrayOfValues = myArray.requestDetails.queryParams;
//     //       console.log(this.arrayOfValues);
//     //       if (myArray.requestDetails.queryParams.dateFrom != "" && myArray.requestDetails.queryParams.dateFrom != undefined && myArray.requestDetails.queryParams.dateFrom != null
//     //         && myArray.requestDetails.queryParams.dateTo != "" && myArray.requestDetails.queryParams.dateTo != undefined && myArray.requestDetails.queryParams.dateTo != null) {
//     //         this.model.business_date = [ myArray.requestDetails.queryParams.dateFrom, myArray.requestDetails.queryParams.dateTo ];
//     //         //this.changeBisinessDate();
//     //         ret = true;
//     //       }
//     //       else if ((myArray.requestDetails.queryParams.dateFrom != "" && myArray.requestDetails.queryParams.dateFrom != undefined && myArray.requestDetails.queryParams.dateFrom != null)
//     //         && (myArray.requestDetails.queryParams.dateTo === "" || myArray.requestDetails.queryParams.dateTo != undefined || myArray.requestDetails.queryParams.dateTo != null)) {
//     //         this.model.business_date = [ myArray.requestDetails.queryParams.dateFrom, myArray.requestDetails.queryParams.dateFrom ];
//     //         //this.changeBisinessDate();
//     //         ret = true;
//     //       }
//     //       else if ((myArray.requestDetails.queryParams.dateTo != "" && myArray.requestDetails.queryParams.dateTo != undefined && myArray.requestDetails.queryParams.dateTo != null)
//     //         && (myArray.requestDetails.queryParams.dateFrom === "" || myArray.requestDetails.queryParams.dateFrom != undefined || myArray.requestDetails.queryParams.dateFrom != null)) {
//     //         this.model.business_date = [ myArray.requestDetails.queryParams.dateTo, myArray.requestDetails.queryParams.dateTo ];
//     //         //this.changeBisinessDate();
//     //         ret = true;
//     //       }
//     //       // this.arrayOfValues = JSON.parse(myArray);
//     //       return ret;
//     //     }

//     //     if (checkParam()) {
//     //       if ((this.model.business_date != null) || (this.model.business_date != []) || (this.model.business_date.length === 2)) {
//     //         this.changeBisinessDate();
//     //       }
//     //     }
//     //   }


//     //   if (this.type === "oversea") {
//     //     this.app.types = "Oversea Business";
//     //     this.generateDocumentID("oversea");
//     //     this.onLoadMasterCountry();
//     //     this.disCheckApproved = false;
//     //   } else if (this.type === "local") {
//     //     this.app.types = "Local Business";
//     //     this.generateDocumentID("local");
//     //     this.disCheckApproved = false;
//     //   }
//     //   else if (this.type === "localtraining") {
//     //     this.app.types = "Local Training";
//     //     this.generateDocumentID("localtraining");
//     //     this.model.approved.status = true;
//     //     this.disCheckApproved = true;
//     //   }
//     //   else if (this.type === "overseatraining") {
//     //     this.app.types = "Oversea Training";
//     //     this.generateDocumentID("overseatraining");
//     //     this.onLoadMasterCountry();
//     //     this.model.approved.status = true;
//     //     this.disCheckApproved = true;
//     //   }



//     //   this.didFetchProfile();

//     // } else {

//     //   // MARK :: Load Data -> UPDATE this.app.types / this.type
//     //   this.model.document_id = "" + app.id
//     //   this.didFetchData();
//     // }
//     // this.stateGlobal = stateAction;
//   }

//   didFetchData() {
//     // this.appMain.isLoading = true;
//     // const onSuccess = (dao) => {
//     //   this.appMain.isLoading = false;
//     //   console.log('***Request i LoadDocDetail***');
//     //   console.log(dao)

//     //   // Document has been approved.
//     //   this.model.approved.status = dao[ "type_flow" ] === "1" ? false : true;

//     //   this.type = dao[ "type" ]
//     //   //this.app.types = dao["type"] == "oversea" ? "Overseas" : "Local"
//     //   this.app.types = dao[ "type" ] == "oversea" ? "Oversea Business" : dao[ "type" ] == "overseatraining" ? "Oversea Training" : dao[ "type" ] == "local" ? "Local Business" : dao[ "type" ] == "localtraining" ? "Local Training" : "!!! ERROR TYPE !!!"
//     //   this.app.root_doc_id = this.model.document_id
//     //   this.app.root_doc_status = dao[ "document_status" ]

//     //   // BEHALF
//     //   this.model.behalf.status = dao[ "behalf" ][ "status" ] === "true" ? true : false
//     //   this.model.behalf.emp_id.value = dao[ "behalf" ][ "emp_id" ]
//     //   this.model.behalf.emp_id.data = dao[ "behalf" ][ "emp_id" ]
//     //   this.model.behalf.emp_name.data = dao[ "behalf" ][ "emp_name" ]
//     //   this.model.behalf.emp_name.value = dao[ "behalf" ][ "emp_name" ]
//     //   this.model.behalf.emp_org = dao[ "behalf" ][ "emp_organization" ]

//     //   this.model.requester_emp_name = dao[ "requester_emp_name" ];

//     //   this.model.company.value = [ {
//     //     '_id': '' + dao[ "id_company" ],
//     //     'index': dao[ "id_company" ],
//     //     'name': dao[ "company_name" ]
//     //   } ]

//     //   // Travel Type
//     //   this.model.type_of_travel.meeting = dao[ "type_of_travel" ][ "meeting" ] == "true" ? true : false
//     //   this.model.type_of_travel.siteVisite = dao[ "type_of_travel" ][ "siteVisite" ] == "true" ? true : false
//     //   this.model.type_of_travel.workshop = dao[ "type_of_travel" ][ "workshop" ] == "true" ? true : false
//     //   this.model.type_of_travel.roadshow = dao[ "type_of_travel" ][ "roadshow" ] == "true" ? true : false
//     //   this.model.type_of_travel.conference = dao[ "type_of_travel" ][ "conference" ] == "true" ? true : false
//     //   this.model.type_of_travel.training = dao[ "type_of_travel" ][ "training" ] == "true" ? true : false
//     //   this.model.type_of_travel.other = dao[ "type_of_travel" ][ "other" ] == "true" ? true : false
//     //   this.model.type_of_travel.remark = dao[ "type_of_travel" ][ "other_detail" ]

//     //   this.model.topic_of_travel = dao[ "topic_of_travel" ]

//     //   // Single Multiple Travel
//     //   this.model.type_radio = (dao[ "travel" ] == "2") ? "multi" : "single"

//     //   // this.model.continent.data_id = dao["contient_id"]


//     //   // Continent Dropdown Search
//     //   this.model.continent.select = []
//     //   dao[ "continent" ].forEach(current => {
//     //     this.model.continent.select.push({
//     //       item_id: current[ "id" ],
//     //       item_text: current[ "name" ]
//     //     })
//     //   });
//     //   this.model.continent.value = [ {
//     //     '_id': '' + dao[ "contient_id" ],
//     //     'index': dao[ "contient_id" ],
//     //     'name': dao[ "contient_name" ]
//     //   } ]

//     //   // Province Multi Select
//     //   var bucketProvince = []
//     //   dao[ "province" ].forEach(current => {
//     //     bucketProvince.push({
//     //       'item_id': current[ "province_id" ],
//     //       'item_text': current[ "province_name" ]
//     //     })
//     //   });
//     //   this.model.province.select = bucketProvince

//     //   // Country Multi Select
//     //   var bucketCountry = []
//     //   dao[ "country" ].forEach(current => {
//     //     bucketCountry.push({
//     //       'item_id': current[ "country_id" ],
//     //       'item_text': current[ "country_name" ]
//     //     })
//     //   })
//     //   this.model.country.select = bucketCountry

//     //   this.model.city = dao[ "city" ]

//     //   // business date  / travel date
//     //   this.model.business_date = dao[ "business_date" ][ "start" ] == null ? [] : [ new Date(dao[ "business_date" ][ "start" ]), new Date(dao[ "business_date" ][ "stop" ]) ]
//     //   this.model.travel_date = dao[ "travel_date" ][ "start" ] == null ? [] : [ new Date(dao[ "travel_date" ][ "start" ]), new Date(dao[ "travel_date" ][ "stop" ]) ]

//     //   this.model.travel_object_expected = dao[ "travel_objective_expected" ]

//     //   // update master country in add traveler
//     //   this.model.add_travel.country.list = [];
//     //   this.model.country.select.forEach(current => {
//     //     this.model.add_travel.country.list.push({
//     //       '_id': '' + current[ "item_id" ],
//     //       'index': current[ "item_id" ],
//     //       'name': current[ "item_text" ]
//     //     });
//     //   })

//     //   // summary table
//     //   dao[ "summary_table" ].forEach(ct => {
//     //     this.model.summary_table.push({
//     //       no: "" + (this.model.summary_table.length + 1),
//     //       continent: ct[ "continent" ],
//     //       continent_id: ct[ "continent_id" ],
//     //       country_id: dao[ "type" ] == "local" || dao[ "type" ] == "localtraining" ? ct[ "province_id" ] : ct[ "country_id" ],
//     //       country_name: dao[ "type" ] == "local" || dao[ "type" ] == "localtraining" ? ct[ "province_name" ] : ct[ "country_name" ],
//     //       city: ct[ "city" ],
//     //       business: "xx",
//     //       business_date: ct[ "business_date" ][ "start" ] == null ? [] : [ new Date(ct[ "business_date" ][ "start" ]), new Date(ct[ "business_date" ][ "stop" ]) ],
//     //       travel: "xxx",
//     //       travel_date: ct[ "travel_date" ][ "start" ] == null ? [] : [ new Date(ct[ "travel_date" ][ "start" ]), new Date(ct[ "travel_date" ][ "stop" ]) ],
//     //       duration: ct[ "travel_duration" ],
//     //       emp_id: ct[ "emp_id" ],
//     //       emp_title: "",    // not use deprecate
//     //       emp_name: ct[ "emp_name" ],
//     //       emp_org: ct[ "emp_organization" ],
//     //       gl: ct[ "gl_account" ],
//     //       cost: ct[ "cost" ],
//     //       order_wrs: ct[ "order" ],
//     //       note: ct[ "remark" ],
//     //       approve_status: ct[ "approve_status" ],
//     //       approve_remark: ct[ "approve_remark" ],
//     //       approve_opt: ct[ "approve_opt" ],
//     //       remark_opt: ct[ "remark_opt" ],
//     //     })
//     //   });

//     //   this.panel.table = this.model.summary_table.length > 0 ? true : false;

//     //   this.model.initiator.status = dao[ "initiator" ][ "status" ] == "true" ? true : false
//     //   this.model.initiator.emp_id.value = dao[ "initiator" ][ "emp_id" ]
//     //   this.model.initiator.emp_id.data = dao[ "initiator" ][ "emp_id" ]
//     //   this.model.initiator.emp_name.value = dao[ "initiator" ][ "emp_name" ]
//     //   this.model.initiator.emp_org = dao[ "initiator" ][ "emp_organization" ]
//     //   this.model.initiator.remark = dao[ "initiator" ][ "remark" ]
//     //   this.panel.initiator = dao[ "initiator" ][ "status" ] == "true" ? true : false

//     //   // 0	Cancel
//     //   // 5	Submit by Super Admin
//     //   // 10	Cancel by Requester
//     //   // 11	Save Draft by Requester
//     //   // 20	Cancel by Admin
//     //   // 21	Pending by Super Admin
//     //   // 22	Pending by initiator
//     //   // 23	Revise by Super Admin
//     //   // 30	Cancel by Line Approver
//     //   // 31	Pending by Line Approver
//     //   // 32	Approve by Line Approver
//     //   // 40	Cancel by CAP
//     //   // 41	Pending by CAP
//     //   // 42	Approved
//     //   // 50	Completed

//     //   this.model.doc_status = dao[ "doc_status" ];

//     //   this.model.after.ref1.value = dao[ "after_trip" ][ "opt1" ] == "true" ? true : false

//     //   this.model.after.ref2.value = dao[ "after_trip" ][ "opt2" ][ "status" ] == "true" ? true : false
//     //   this.model.after.ref2.remark = dao[ "after_trip" ][ "opt2" ][ "remark" ]

//     //   this.model.after.ref3.value = dao[ "after_trip" ][ "opt3" ][ "status" ] == "true" ? true : false
//     //   this.model.after.ref3.remark = dao[ "after_trip" ][ "opt3" ][ "remark" ]

//     //   this.model.remark = dao[ "remark" ]

//     //   ////debugger;
//     //   // AUN : Check user request type
//     //   this.model.user_type = dao[ "user_type" ];
//     //   this.model.requestr_user_type = dao[ "request_user_type" ];

//     //   // if (this.model.requestr_user_type === "2" && dao["behalf"]["status"] === "true") {
//     //   if (this.model.requestr_user_type === "2") {
//     //     this.model.behalf.status = dao[ "behalf" ][ "status" ] === "true" ? true : false;
//     //     this.model.behalf.status = true;
//     //     this.disCheckEmp = true;
//     //   } else {

//     //     this.model.behalf.status = dao[ "behalf" ][ "status" ] === "true" ? true : false;
//     //     //this.model.behalf.status = false;
//     //     this.disCheckEmp = false;
//     //   }

//     //   // Rule Menu
//     //   this.app.buttons.PartII = dao[ "button" ][ "part_ii" ] == "true" ? true : false
//     //   this.app.buttons.PartIII = dao[ "button" ][ "part_iii" ] == "true" ? true : false
//     //   this.app.buttons.PartIIII = dao[ "button" ][ "part_iiii" ] == "true" ? true : false

//     //   // Rule Button
//     //   this.buttons.save = dao[ "button" ][ "save" ] == "true" ? true : false
//     //   this.buttons.submit = dao[ "button" ][ "submit" ] == "true" ? true : false
//     //   this.buttons.cancel = dao[ "button" ][ "cancel" ] == "false" ? false : true

//     //   //this.disCheckApproved = !this.buttons.save;
//     //   //this.disCheckEmp = !this.buttons.save;

//     //   this.onLoadMasterCountry();

//     //   // master province in local
//     //   if (this.type == "local" || this.type == "localtraining") {
//     //     this.model.add_travel.country.list = []
//     //     dao[ "province" ].forEach(current => {
//     //       this.model.add_travel.country.list.push({
//     //         '_id': '' + current[ "province_id" ],
//     //         'index': current[ "province_id" ],
//     //         'name': current[ "province_name" ]
//     //       })
//     //     });
//     //   }

//     //   if (this.model.type_radio == "single") {
//     //     this.model.add_travel.continent = dao[ "continent" ].length == 1 ? dao[ "continent" ][ 0 ][ "name" ] : ""
//     //     if (this.type == "oversea" || this.type == "overseatraining") {
//     //       if (dao[ "country" ].length == 1) {
//     //         this.model.add_travel.country.value = [ {
//     //           index: "" + dao[ "country" ][ 0 ][ "contry_id" ],
//     //           name: dao[ "country" ][ 0 ][ "country_name" ],
//     //           _id: "" + dao[ "country" ][ 0 ][ "contry_id" ]
//     //         } ]
//     //       }
//     //       this.model.add_travel.city = this.model.city
//     //     } else {
//     //       if (dao[ "province" ].length == 1) {
//     //         this.model.add_travel.country.value = [ {
//     //           index: "" + dao[ "province" ][ 0 ][ "province_id" ],
//     //           name: dao[ "province" ][ 0 ][ "province_name" ],
//     //           _id: "" + dao[ "province" ][ 0 ][ "province_id" ]
//     //         } ]
//     //       }
//     //       this.model.add_travel.city = this.model.city
//     //     }
//     //   }

//     //   if (this.type === "localtraining" || this.type === "overseatraining") {
//     //     this.model.approved.status = true;
//     //     this.disCheckApproved = true;
//     //   }

//     //   // duration
//     //   this.updateTravelDate("root")
//     //   console.log(this.model)
//     // }
//     // this.partIHttp.didFetch(this.model.document_id).subscribe(dao => onSuccess(dao), error => this.appMain.isLoading = false)
//   }

//   // MARK :: Generate Document id in first document
//   generateDocumentID(state: String) {
//     const onSuccess = (dao : any) => {
//       console.log(">>> generateDocumentID <<<");
//       console.log(state);
//       console.log(dao);
//       if (dao[ "status" ] == "S") {
//         // this.app.root_doc_id = dao[ "value" ]
//         // this.app.root_doc_status = "Draft"
//         this.model.document_id = dao[ "value" ]
//       } else {
//         // this.appMain.showMessage(dao[ "message" ]);
//       }
//     }
//     // this.partIHttp.didGenerateDocument(state).subscribe(dao => onSuccess(dao))
//   }

//   // onSelectedContinent(event) {
//   //   const idConitnent: string = "" + event["value"]["index"]
//   //   this.model.continent.data_id = idConitnent;
//   //   this.onLoadMasterCountry(idConitnent);
//   //   this.model.country.select = [];
//   // }

//   ngOnInit() {

//     // Fetch Master Company Start
//     this.onLoadMasterCompany();

//     // Fetch Master Continent Start
//     this.onLoadMasterContinent();

//     // Fetch Master Country Start
//     // this.onLoadMasterCountry();

//     // Fetch Master Province
//     this.didFetchProvince();

//     if (this.isParams) {
//     //   this.appMain.isLoading = true;
//       setTimeout(() => {
//         //debugger;
//         if (this.arrayOfValues.country_id != "") {
//           let event = {
//             isDisabled: undefined,
//             item_id: this.arrayOfValues.country_id,
//             item_text: "",
//           }

//           if (event) {
//             if (this.arrayOfValues.requestType === "oversea" || this.arrayOfValues.requestType === "overseatraining") {
//               this.model.country.select = [ event ];
//               this.onSelectCountry(event);
//             }
//             else {
//               this.model.province.select = [ event ];
//               this.onSelectProvince(event);
//             }
//           }
//         }


//         this.appMain.isLoading = false;

//       }, 1000);
//     }
//   }

//   changeApprovedStatus() {
//     if (this.model.approved.status) {
//       this.model.initiator.status = false;
//       this.model.initiator.emp_id.value = "";
//       this.model.initiator.emp_name.value = "";
//       this.model.initiator.emp_org = "";
//       this.model.initiator.remark = "";
//     }
//   }

//   // MARK :: check object empty
//   isEmpty(obj : any) {
//     return Object.keys(obj).length === 0;
//   }

//   didFetchProvince() {
//     const onSuccess = (dao : any) => {
//       console.log(dao)
//       this.model.province.list = [];
//       dao.forEach(current => {
//         this.model.province.list.push({
//           item_id: current[ "id" ],
//           item_text: current[ "province" ],
//           // isDisabled: true
//         })
//       });
//     }
//     this.masterHttp.onFetchProvince().subscribe(dao => onSuccess(dao))
//   }

//   // MARK :: Summary manage event edit, trash item
//   handleActionSummary(state: String, indexPath: number) {
//     if (this.buttons.save && this.buttons.submit) {
//       const trash = (indexPath) => {
//         // if (confirm("Do you want to delete data?")) {
//         this.appMain.showConfirm("Do you want to delete data?", () => {
//           this.model.summary_table.splice(indexPath, 1);
//         })
//       }

//       const edit = (indexPath : any) => {

//         this.model.add_travel.gl_auto.list = []
//         this.model.add_travel.cost_center_master.list = []
//         this.model.add_travel.wbs.list = []

//         this.states.add_travel_type = "edit";
//         this.panel.travel = true;
//         const crt = this.model.summary_table[ indexPath ]


//         this.model.add_travel.country.value = [ {
//           index: "" + crt.country_id,
//           name: crt.country_name,
//           _id: "" + crt.country_id
//         } ]

//         this.model.add_travel.city = crt.city;
//         this.model.add_travel.business_date = crt.business_date;
//         this.model.add_travel.travel_date = crt.travel_date;
//         this.model.add_travel.duration = crt.duration;
//         this.model.add_travel.emp_id.value = crt.emp_id;
//         this.model.add_travel.emp_id.data = crt.emp_id;
//         this.model.add_travel.emp_title = crt.emp_title;
//         this.model.add_travel.emp_name.value = crt.emp_name;
//         this.model.add_travel.emp_name.data = crt.emp_name;
//         this.model.add_travel.emp_org = crt.emp_org;
//         this.model.add_travel.gl = crt.gl;
//         this.model.add_travel.cost = crt.cost;
//         this.model.add_travel.order_wrs = crt.order_wrs;
//         this.model.add_travel.note = crt.note;
//         this.states.add_travel_indexpath = indexPath;
//         this.model.add_travel.continent = crt.continent;
//         this.model.add_travel.traveler_ref_id = crt.traveler_ref_id;
//       }

//       if (state == "trash") {
//         trash(indexPath)
//       } else {
//         edit(indexPath)
//       }
//       //console.log('action in ta')
//     }
//   }

//   changeBisinessDate() {
//     //alert('xx')//this.model.type_radio == "single"
//     //if (this.type == "local" || this.type == "localtraining") {
//     if (this.model.business_date != null ||
//       this.model.business_date != [] ||
//       this.model.business_date.length != 2) {

//       this.model.travel_date = null;

//       if (this.model.business_date != null) {

//         var xd = new Date(this.model.business_date[ 0 ].setHours(20, 21, 22))
//         var xd2 = new Date(this.model.business_date[ 1 ].setHours(20, 21, 22))

//         const start_date = () => {
//           let st_date = xd;
//           (this.type === "oversea" || this.type === "overseatraining") ? st_date.setDate(st_date.getDate() - 1) : xd;
//           return st_date;
//         }
//         const end_date = () => {
//           let en_date = xd2;
//           (this.type === "oversea" || this.type === "overseatraining") ? en_date.setDate(en_date.getDate() + 1) : xd2;
//           return en_date;
//         }

//         //this.model.travel_date = [xd, xd2];
//         let st_date = start_date();
//         let en_date = end_date();
//         this.model.travel_date = [ st_date, en_date ];

//         // this.model.add_travel.business_date = this.model.business_date;
//         // this.model.add_travel.travel_date = this.model.travel_date;
//         console.log(this.model.business_date)
//         console.log(this.model.travel_date)
//       }
//       else {
//         this.model.travel_date = null;
//       }
//       this.updateTravelDate('root');


//     }
//     else {
//       this.model.travel_date = null;
//       this.updateTravelDate('root');
//     }
//     // }
//     // else {
//     //   if (this.model.business_date === null ||
//     //     this.model.business_date === [] ||
//     //     this.model.business_date.length === 2) {

//     //     //this.model.add_travel.business_date = this.model.business_date;
//     //     this.model.travel_date = null;

//     //     if (this.model.business_date != null) {

//     //       var xd = new Date(this.model.business_date[0].setHours(20, 21, 22))
//     //       var xd2 = new Date(this.model.business_date[1].setHours(20, 21, 22))
//     //       xd.setDate(xd.getDate() - 1);
//     //       xd2.setDate(xd2.getDate() + 1);
//     //       console.log([xd, xd2]);

//     //       this.model.travel_date = [xd, xd2];

//     //       //this.model.add_travel.travel_date = this.model.travel_date;
//     //     }
//     //     else {
//     //       this.model.travel_date = null;
//     //     }
//     //     this.updateTravelDate('root');
//     //     //this.updateTravelDate('table');


//     //   }
//     // }
//   }

//   changeBisinessDateToSummary() {
//     //alert('xx')//this.model.type_radio == "single"
//     //if (this.type == "local" || this.type == "localtraining") {
//     if (this.model.add_travel.business_date != null ||
//       this.model.add_travel.business_date != [] ||
//       this.model.add_travel.business_date.length != 2) {

//       this.model.add_travel.travel_date = null;

//       if (this.model.add_travel.business_date != null) {

//         var xd = new Date(this.model.add_travel.business_date[ 0 ].setHours(20, 21, 22))
//         var xd2 = new Date(this.model.add_travel.business_date[ 1 ].setHours(20, 21, 22))
//         //if (this.type === "oversea" || this.type === "overseatraining") {

//         const start_date = () => {
//           let st_date = xd;
//           (this.type === "oversea" || this.type === "overseatraining") ? st_date.setDate(st_date.getDate() - 1) : st_date;
//           return st_date;
//         }
//         const end_date = () => {
//           let en_date = xd2;
//           (this.type === "oversea" || this.type === "overseatraining") ? en_date.setDate(en_date.getDate() + 1) : en_date;
//           return en_date;
//         }

//         //xd2.setDate(xd2.getDate() + 1);
//         //console.log([xd, xd2]);
//         //}
//         let st_date = start_date();
//         let en_date = end_date();
//         this.model.add_travel.travel_date = [ st_date, en_date ];
//         console.log(this.model.add_travel.business_date)
//         console.log(this.model.add_travel.travel_date)
//       }
//       else {
//         this.model.add_travel.travel_date = null;
//       }
//       this.updateTravelDate('table');


//     }
//     else {
//       this.model.add_travel.travel_date = null;
//       this.updateTravelDate('table');
//     }
//     //}
//     // else {
//     //   if (this.model.business_date === null ||
//     //     this.model.business_date === [] ||
//     //     this.model.business_date.length === 2) {

//     //     this.model.travel_date = null;

//     //     if (this.model.business_date != null) {

//     //       var xd = new Date(this.model.business_date[0].setHours(20, 21, 22))
//     //       var xd2 = new Date(this.model.business_date[1].setHours(20, 21, 22))
//     //       xd.setDate(xd.getDate() - 1);
//     //       xd2.setDate(xd2.getDate() + 1);
//     //       console.log([xd, xd2]);

//     //       this.model.travel_date = [xd, xd2];
//     //     }
//     //     else {
//     //       this.model.travel_date = null;
//     //     }
//     //     this.updateTravelDate('root');


//     //   }
//     // }
//   }

//   // MARK :: Handle push data to summary table
//   handleAddToSummary(state: string = "") {
//     ////debugger;
//     this.statusValidateAddTravel = true;
//     this.statusValidate = true;
//     const clear = () => {
//       this.model.add_travel.emp_id.value = "";
//       this.model.add_travel.emp_id.data = "";
//       this.model.add_travel.emp_title = "";
//       this.model.add_travel.emp_name.value = "";
//       this.model.add_travel.emp_name.data = "";
//       this.model.add_travel.emp_org = "";
//       this.model.add_travel.gl = null;
//       this.model.add_travel.cost = null;
//       this.model.add_travel.order_wrs = "";
//       this.model.add_travel.note = "";
//       console.log(this.model.add_travel.country.list)

//       this.model.add_travel.gl_auto.list = []
//       this.model.add_travel.cost_center_master.list = []
//       this.model.add_travel.wbs.list = []
//       this.statusValidate = false;
//     }

//     const validate = (): boolean => {

//       if (
//         this.model.add_travel.country.value == undefined ||
//         this.model.add_travel.country.value == [] ||
//         this.model.add_travel.city == "" ||
//         this.model.add_travel.emp_id.data == "" ||
//         this.model.add_travel.emp_id.value == "" ||
//         this.model.add_travel.emp_name.value == "" ||
//         this.model.add_travel.emp_name.data == "" ||
//         this.model.add_travel.order_wrs == "") {
//         this.appMain.showMessage("Need to input value * ")
//         return false;
//       }

//       if (this.model.type_radio == "multi") {
//         if (
//           this.model.add_travel.business_date.length < 2 ||
//           this.model.add_travel.business_date[ 0 ] == null ||
//           this.model.add_travel.business_date == [] ||
//           this.model.add_travel.travel_date.length < 2 ||
//           this.model.add_travel.travel_date[ 0 ] == null ||
//           this.model.add_travel.travel_date == []) {
//           this.appMain.showMessage("Need to input value * ")
//           return false;
//         }
//       }
//       else {

//         //Single
//         if (
//           this.model.business_date == null ||
//           this.model.business_date.length < 2 ||
//           this.model.business_date[ 0 ] == null ||
//           this.model.business_date == []) {
//           this.appMain.showMessage("Please select business date.")
//           return false;
//         }

//         if (

//           this.model.travel_date == null ||
//           this.model.travel_date.length < 2 ||
//           this.model.travel_date[ 0 ] == null ||
//           this.model.travel_date == []) {
//           this.appMain.showMessage("Please select travel date.")
//           return false;
//         }
//       }

//       return true;
//     }

//     if (state == "clear") {
//       this.states.add_travel_type = 'add'
//       clear();
//       return;
//     }

//     if (!validate()) return;
//     const data = this.model.add_travel;

//     if (state == 'change') {
//       this.statusValidateAddTravel = false
//       this.model.summary_table[ this.states.add_travel_indexpath ] = {
//         no: "" + (this.states.add_travel_indexpath + 1),
//         continent: data.continent,
//         continent_id: data.continent_id,
//         country_id: data.country.value[ "index" ],
//         country_name: data.country.value[ "name" ],
//         city: data.city,
//         business: "xx",
//         // business_date: data.business_date,
//         business_date: this.model.type_radio === "multi" ? data.business_date : this.model.business_date,
//         travel: "xxx",
//         //travel_date: data.travel_date,
//         travel_date: this.model.type_radio === "multi" ? data.travel_date : this.model.travel_date,
//         duration: data.duration,
//         emp_id: data.emp_id.data,
//         emp_title: data.emp_title,
//         emp_name: data.emp_name.data,
//         emp_org: data.emp_org,
//         gl: (typeof this.model.add_travel.gl == "string") ? this.model.add_travel.gl : this.model.add_travel.gl[ "name" ],
//         cost: (typeof this.model.add_travel.cost == "string") ? this.model.add_travel.cost : this.model.add_travel.cost[ "name" ],
//         order_wrs: (typeof this.model.add_travel.order_wrs == "string") ? this.model.add_travel.order_wrs : this.model.add_travel.order_wrs[ "name" ],
//         note: data.note,
//         traveler_ref_id: data.traveler_ref_id
//       }
//       this.states.add_travel_type = "add"

//       this.model.add_travel.gl_auto.list = []
//       this.model.add_travel.cost_center_master.list = []
//       this.model.add_travel.wbs.list = []

//       console.log('Edit >> this.model.summary_table');
//       console.log(this.model.summary_table);
//     } else {
//       this.statusValidateAddTravel = false
//       var bsDate
//       if (this.model.type_radio == "single") {
//         if (this.model.business_date.length < 2 || this.model.business_date[ 0 ] == null) {
//           this.appMain.showMessage("Please select business date.")
//           return;
//         } else {
//           bsDate = this.model.business_date
//         }
//       } else {
//         bsDate = data.business_date
//       }

//       var tvDate
//       if (this.model.type_radio == "single") {
//         if (this.model.travel_date.length < 2 || this.model.travel_date[ 0 ] == null) {
//           this.appMain.showMessage("Please select travel date.")
//           return;
//         } else {
//           tvDate = this.model.travel_date
//         }
//       } else {
//         tvDate = data.travel_date
//       }
//       //debugger;
//       this.model.summary_table.push({
//         no: "" + (this.model.summary_table.length + 1),
//         continent: data.continent,
//         country_id: data.country.value[ "index" ],
//         country_name: data.country.value[ "name" ],
//         city: data.city,
//         business: "",
//         business_date: bsDate,
//         travel: "xxx",
//         travel_date: tvDate, //data.travel_date,
//         duration: data.duration,
//         emp_id: data.emp_id.data,
//         emp_title: data.emp_title,
//         emp_name: data.emp_name.data,
//         emp_org: data.emp_org,
//         // gl: (typeof this.model.add_travel.gl == "string") ? this.model.add_travel.gl : this.model.add_travel.gl["name"] ,
//         // cost: (typeof this.model.add_travel.cost == "string") ? this.model.add_travel.cost : this.model.add_travel.cost["name"],
//         gl: (this.model.add_travel.gl != '' && this.model.add_travel.gl != null) ? (typeof this.model.add_travel.gl == "string") ? this.model.add_travel.gl : this.model.add_travel.gl[ "name" ] : "",
//         cost: (this.model.add_travel.cost != '' && this.model.add_travel.cost != null) ? (typeof this.model.add_travel.cost == "string") ? this.model.add_travel.cost : this.model.add_travel.cost[ "name" ] : "",
//         order_wrs: (this.model.add_travel.order_wrs != '' && this.model.add_travel.order_wrs != null) ? (typeof this.model.add_travel.order_wrs == "string") ? this.model.add_travel.order_wrs : this.model.add_travel.order_wrs[ "name" ] : "",
//         note: data.note,
//         traveler_ref_id: ""
//       })
//       console.log('this.model.summary_table');
//       console.log(this.model.summary_table);
//       console.log(data);
//       this.model.add_travel.gl_auto.list = []
//       this.model.add_travel.cost_center_master.list = []
//       this.model.add_travel.wbs.list = []
//     }

//     clear();
//     this.panel.travel = true;
//     this.panel.table = true;
//   }

//   // MARK :: Manager fetch master company
//   onLoadMasterCompany() {
//     const didSet = (dao) => {
//       this.model.company.list = [];
//       dao.forEach(dt => {
//         this.model.company.list.push({
//           '_id': '' + dt[ "com_id" ],
//           'index': dt[ "com_id" ],
//           'name': dt[ "com_name" ]
//         });
//       });

//       //this.model.company.list.sort((a,b) => a.name.localeCompare(b.name))
//     }
//     this.masterHttp.onFetchCompany().subscribe(dao => didSet(dao));
//   }

//   // MARK :: manager fetch master continent
//   onLoadMasterContinent() {
//     const didSet = (dao) => {
//       this.model.continent.list = [];
//       dao.forEach(dt => {
//         // this.model.continent.list.push({
//         //   '_id': '' + dt["id"],
//         //   'index': dt["id"],
//         //   'name': dt["continent"]
//         // });
//         this.model.continent.list.push({
//           item_id: dt[ "id" ],
//           item_text: dt[ "continent" ]
//         })
//       });
//     }
//     this.masterHttp.onFetchContinent().subscribe(dao => didSet(dao));
//   }

//   getType(values, state) {
//     if (state == "gl") {
//       if (this.model.add_travel.gl_auto.list.length == 0) {
//         return ""
//       }
//     } else if (state == "cost") {
//       if (this.model.add_travel.cost_center_master.list.length == 0) {
//         return ""
//       }
//     } else if (state == "wbs") {
//       if (this.model.add_travel.wbs.list.length == 0) {
//         return ""
//       }
//     }
//     return typeof values
//   }

//   // MARK :: manager fetch master Country
//   onLoadMasterCountry() {
//     ////debugger;
//     console.log('---onLoadMasterCountry---');
//     var objectID = []
//     const didSet = (dao) => {
//       //debugger;
//       console.log(dao)
//       this.model.country.list = [];
//       this.daoCountry = dao;
//       dao.forEach(dt => {
//         this.model.country.list.push(
//           {
//             item_id: dt[ "country_id" ],
//             item_text: dt[ "country" ],
//             continent_id: dt[ "continent_id" ],
//           }
//         );
//       });

//       // clear data old not have
//       var bucketCountrySelected = []
//       this.model.country.select.forEach(cSeletced => {
//         // console.log(cSeletced)
//         this.model.country.list.forEach(cList => {
//           // console.log(cList)
//           if (cSeletced[ "item_id" ] == cList[ "item_id" ]) {
//             bucketCountrySelected.push({
//               item_id: cSeletced[ "item_id" ],
//               item_text: cSeletced[ "item_text" ],
//               continent_id: cSeletced[ "continent_id" ],
//             })
//           }
//         });
//       })
//       this.model.country.select = []
//       this.model.country.select = bucketCountrySelected

//     }

//     this.model.continent.select.forEach(current => {
//       objectID.push({
//         "id": current[ "item_id" ]
//       })
//     });

//     this.masterHttp.onFetchCountry(objectID).subscribe(dao => didSet(dao))
//   }

//   // MARK :: handle selected country by dropdown set to data field.
//   onSelectCountry(event) {
//     // auto fill continent
//     //debugger;
//     console.log(event);
//     var bucketContinentName = "";
//     this.daoCountry.forEach(dt => {
//       if (event[ "item_id" ] == dt[ "country_id" ]) {

//         console.log(dt)
//         this.model.continent.value = dt[ "continent" ]
//         this.model.continent.data_id = dt[ "continent_id" ]

//         // check and push continent data
//         var sts = false
//         this.model.continent.select.forEach(current => {
//           if (event[ "item_id" ] == current[ "item_id" ]) {
//             sts = true
//           }
//         })

//         if (this.model.continent.select.length != 0) {
//           sts = true
//         }

//         if (sts == false) {
//           // need to add
//           console.log(this.model.continent.select)
//           this.model.continent.select = []

//           this.model.continent.select.push({
//             'item_id': '' + dt[ "continent_id" ],
//             'isDisabled': undefined,
//             'item_text': dt[ "continent" ]
//           })
//           this.onLoadMasterCountry()
//           console.log(this.model.continent.select)
//         }

//         bucketContinentName = dt[ "continent" ]
//       }
//     });

//     // create master country add travel
//     this.model.add_travel.country.list = [];
//     this.model.country.select.forEach(dt => {

//       let _filter = this.daoCountry.filter(x => x.country_id.toLowerCase() === dt[ "item_id" ].toLowerCase());

//       this.model.add_travel.country.list.push({
//         '_id': '' + _filter[ 0 ].country_id,
//         'index': _filter[ 0 ].country_id,
//         'name': _filter[ 0 ].country,
//       });
//       dt.item_text = _filter[ 0 ].country;
//       //this.model.country.select[0]["item_text"] = _filter[0].country;


//     });

//     console.log(this.model.add_travel.country.list);

//     // single auto to add traveler
//     if (this.model.type_radio == "single") {
//       //this.model.add_travel.country.list = [];
//       this.model.add_travel.country.value = [ {
//         index: "" + this.model.country.select[ 0 ][ "item_id" ],
//         name: this.model.country.select[ 0 ][ "item_text" ],
//         _id: "" + this.model.country.select[ 0 ][ "item_id" ]
//       } ]
//       this.model.add_travel.continent = bucketContinentName
//     }

//     console.log('this.model.country.select');
//     console.log(this.model.country.select);
//   }

//   // MARK :: handle selected country, province in add travel by dropdown set to data field.
//   onSelectCountryAddTravel(event) {
//     //alert('xx')
//     console.log('-----------------------------------------')
//     console.log(this.model.add_travel.country.value);
//     console.log('-----------------------------------------')

//     if (this.model.add_travel.country.value != undefined) {
//       if (this.type == "oversea" || this.type == "overseatraining") {
//         this.daoCountry.forEach(dt => {
//           if (dt.country_id == event.value[ "index" ]) {
//             this.model.add_travel.continent = dt.continent
//             this.model.add_travel.continent_id = dt.continent_id
//           }
//         })

//         this.model.add_travel.business_date = this.model.business_date != null || this.model.business_date != [] ? this.model.business_date : [];
//         this.model.add_travel.travel_date = this.model.travel_date != null || this.model.travel_date != [] ? this.model.travel_date : [];
//         if (this.model.add_travel.travel_date != null || this.model.add_travel.travel_date != []) {
//           this.updateTravelDate('table');
//         }
//       }
//     } else {
//       this.model.add_travel.country.list = [];
//       this.model.country.select.forEach(dt => {

//         let _filter = this.daoCountry.filter(x => x.country_id.toLowerCase() === dt[ "item_id" ].toLowerCase());

//         this.model.add_travel.country.list.push({
//           '_id': '' + _filter[ 0 ].country_id,
//           'index': _filter[ 0 ].country_id,
//           'name': _filter[ 0 ].country,
//         });
//         dt.item_text = _filter[ 0 ].country;
//         //this.model.country.select[0]["item_text"] = _filter[0].country;


//       });
//     }
//   }

//   // MARK :: handle selected province by dropdown set to data field.
//   onSelectProvince(event) {
//     ////debugger;
//     //console.log(this.model.province.list);
//     let province_list = this.model.province.list
//     // create master country add travel
//     this.model.add_travel.country.list = [];
//     this.model.province.select.forEach(dt => {

//       let _filter = province_list.filter(x => x.item_id.toLowerCase() === dt[ "item_id" ].toLowerCase());

//       this.model.add_travel.country.list.push({
//         '_id': '' + _filter[ 0 ].item_id,
//         'index': _filter[ 0 ].item_id,
//         'name': _filter[ 0 ].item_text
//       });

//       // this.model.add_travel.country.list.push({
//       //   '_id': '' + dt["item_id"],
//       //   'index': dt["item_id"],
//       //   'name': dt["item_text"]
//       // });

//       this.model.province.select[ 0 ][ "item_text" ] = _filter[ 0 ].item_text;
//     });

//     if (this.model.type_radio == "single") {
//       this.model.add_travel.country.value = [ {
//         index: "" + this.model.province.select[ 0 ][ "item_id" ],
//         name: this.model.province.select[ 0 ][ "item_text" ],
//         _id: "" + this.model.province.select[ 0 ][ "item_id" ]
//       } ]
//     }
//   }

//   handleCityFreeTextChange() {
//     if (this.model.type_radio == "single") {
//       this.model.add_travel.city = this.model.city
//     }
//   }

//   // MARK :: Update duration day in root, add travel
//   updateTravelDate(path: String) {
//     ////debugger;
//     if (path == "root") {
//       if (this.model.travel_date != [] || this.model.travel_date != undefined || this.model.travel_date != null) {
//         this.calculateDurationDay(
//           this.model.travel_date == null ? "" : (this.model.travel_date.length == 2 ? this.dateStrings(this.model.travel_date[ 0 ]) : ""),
//           this.model.travel_date == null ? "" : (this.model.travel_date.length == 2 ? this.dateStrings(this.model.travel_date[ 1 ]) : ""),
//           path)
//       }
//     } else if (path == "table") {
//       if (this.model.add_travel.travel_date != [] || this.model.add_travel.travel_date != undefined || this.model.add_travel.travel_date != null) {
//         this.calculateDurationDay(
//           this.model.add_travel.travel_date == null ? "" : (this.model.add_travel.travel_date.length == 2 ? this.dateStrings(this.model.add_travel.travel_date[ 0 ]) : ""),
//           this.model.add_travel.travel_date == null ? "" : (this.model.add_travel.travel_date.length == 2 ? this.dateStrings(this.model.add_travel.travel_date[ 1 ]) : ""),
//           path)
//       }
//     }
//   }

//   // MARK :: Manage between day
//   calculateDurationDay(start, stop, path): void {
//     // var diffTime = Math.abs(stop - start)
//     // var diffDay = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
//     // return "" + (diffDay + 1)
//     ////debugger;
//     var cResult = []
//     if (path == "root") {
//       this.model.country.select.forEach(current => {
//         cResult.push(current.item_id)
//       })
//     } else {
//       console.log(this.model.add_travel.country)
//       cResult.push(this.model.add_travel.country.value[ "index" ])
//     }


//     this.masterHttp.onProcessTravelDay(this.type, start, stop, cResult).subscribe(data => {
//       console.log(data)
//       if (path == "root") {
//         this.model.duration = data[ 0 ][ "day" ]
//       } else {
//         this.model.add_travel.duration = data[ 0 ][ "day" ]
//       }
//     })

//   }

//   dateStrings(date: Date) {
//     var d = new Date(date)
//     var m = (d.getMonth() + 1) + ""
//     var mm = m.length == 1 ? "0" + m : m
//     var day = (d.getDate()) + ""
//     var dayS = day.length == 1 ? "0" + day : day
//     var result = d.getFullYear() + "-" + mm + "-" + dayS

//     if (result == "NaN-NaN-NaN") {
//       return ""
//     } else {
//       return result
//     }
//   }

//   // MARK :: Generate Parameter to send api.
//   didConvertFormatValue(action: String, remarks: String): any {



//     var data = {
//       "token_login": localStorage[ "token" ],
//       "id": this.model.document_id,
//       "type": this.type,
//       "behalf": {
//         "status": this.model.behalf.status ? "true" : "false",
//         "emp_id": this.model.behalf.emp_id.data
//       },
//       "id_company": this.model.company.value === [] || this.model.company.value == undefined ? "" : this.model.company.value[ "index" ],
//       "type_of_travel": {
//         "meeting": this.model.type_of_travel.meeting ? "true" : "false",
//         "siteVisite": this.model.type_of_travel.siteVisite ? "true" : "false",
//         "workshop": this.model.type_of_travel.workshop ? "true" : "false",
//         "roadshow": this.model.type_of_travel.roadshow ? "true" : "false",
//         "conference": this.model.type_of_travel.conference ? "true" : "false",
//         "training": this.model.type_of_travel.training ? "true" : "false",
//         "other": this.model.type_of_travel.other ? "true" : "false",
//         "other_detail": this.model.type_of_travel.other ? this.model.type_of_travel.remark : ""
//       },
//       "topic_of_travel": this.model.topic_of_travel,
//       "travel": this.model.type_radio == "single" ? "1" : "2",
//       "continent": [],
//       "country": [],
//       "province": [],
//       "city": this.model.city,
//       "business_date": {
//         "start": this.model.business_date.length == 2 ? this.dateStrings(this.model.business_date[ 0 ]) : "",
//         "stop": this.model.business_date.length == 2 ? this.dateStrings(this.model.business_date[ 1 ]) : ""
//       },
//       "travel_date": {
//         // "start": this.model.travel_date == null ? "" : (this.model.travel_date.length == 2 ? JSON.stringify(this.model.travel_date[0]).replace(/"/g, '') : ""),
//         // "stop": this.model.travel_date == null ? "" : (this.model.travel_date.length == 2 ? JSON.stringify(this.model.travel_date[1]).replace(/"/g, '') : "")
//         "start": this.model.travel_date == null ? "" : (this.model.travel_date.length == 2 ? this.dateStrings(this.model.travel_date[ 0 ]) : ""),
//         "stop": this.model.travel_date == null ? "" : (this.model.travel_date.length == 2 ? this.dateStrings(this.model.travel_date[ 1 ]) : "")
//       },
//       "travel_objective_expected": this.model.travel_object_expected,
//       "summary_table": [],
//       "initiator": {
//         "status": this.model.initiator.status ? "true" : "false",
//         "emp_id": this.model.initiator.status ? this.model.initiator.emp_id.data : '',
//         "remark": this.model.initiator.status ? this.model.initiator.remark : ''
//       },
//       "after_trip": {
//         "opt1": this.model.after.ref1.value ? "true" : "false",
//         "opt2": {
//           "status": this.model.after.ref2.value ? "true" : "false",
//           "remark": this.model.after.ref2.remark
//         },
//         "opt3": {
//           "status": this.model.after.ref3.value ? "true" : "false",
//           "remark": this.model.after.ref3.remark
//         }
//       },
//       "remark": this.model.remark,
//       "action": {
//         "type": action,
//         "remark": remarks
//       },
//       "type_flow": this.model.approved.status && (this.type === "oversea" || this.type === "local") ? "2" : this.model.approved.status && (this.type === "overseatraining" || this.type === "localtraining") ? "3" : "1",
//     }

//     if (this.type == "oversea" || this.type == "overseatraining") {
//       // Oversea

//       // root country
//       this.model.country.select.forEach(current => {
//         data.country.push({
//           "contry_id": current[ "item_id" ]
//         });
//       })

//       this.model.continent.select.forEach(current => {
//         data.continent.push({
//           "id": current[ "item_id" ]
//         })
//       })

//     } else {
//       // Local

//       // root province
//       this.model.province.select.forEach(current => {
//         data.province.push({
//           "province_id": current[ "item_id" ]
//         });
//       })

//     }

//     // summary table
//     var isOversea: Boolean = this.type == "oversea" || this.type == "overseatraining"
//     this.model.summary_table.forEach(current => {
//       data.summary_table.push(
//         {
//           "emp_id": current.emp_id,
//           "country_id": isOversea ? current.country_id : "",
//           "province_id": isOversea ? "" : current.country_id,
//           "city": current.city,
//           "business_date": {
//             "start": current.business_date.length == 2 ? this.dateStrings(current.business_date[ 0 ]) : "",
//             "stop": current.business_date.length == 2 ? this.dateStrings(current.business_date[ 1 ]) : ""
//           },
//           "travel_date": {
//             "start": current.travel_date.length == 2 ? this.dateStrings(current.travel_date[ 0 ]) : "",
//             "stop": current.travel_date.length == 2 ? this.dateStrings(current.travel_date[ 1 ]) : ""
//           },
//           "travel_duration": current.duration,
//           "gl_account": current.gl,
//           "cost": current.cost,
//           "order": current.order_wrs,
//           "remark": current.note,
//           "traveler_ref_id": current.traveler_ref_id
//         }
//       );
//     })
//     //console.log(data)

//     return data
//   }

//   handleSelectedContinentToLoadMasterCountry() {
//     //alert('x')
//     this.onLoadMasterCountry();
//   }

//   // MARK :: Manage clear field initiator
//   handleClearInitiator() {
//     // if (confirm("Do you want to clear data?")) {
//     this.appMain.showConfirm("Do you want to clear data?", () => {
//       this.model.initiator.emp_id.value = ""
//       this.model.initiator.emp_id.data = ""
//       this.model.initiator.emp_name.value = ""
//       this.model.initiator.emp_name.data = ""
//       this.model.initiator.emp_org = ""
//       this.model.initiator.remark = ""
//     })
//   }

//   // MARK :: Button action event.
//   handleActionPages(action: stateAction) {

//     const requestData = (): Boolean => {
//       console.log(this.model)
//       // True: Success, False: Failed

//       // check on behalf
//       if (this.model.behalf.status) {
//         // checked on Behalf of
//         if (this.model.behalf.emp_id.data == "") {
//           this.statusValidate = true
//           return false
//         }
//       }

//       if (
//         this.model.company.value == [] ||
//         this.model.company.value == undefined ||
//         this.model.topic_of_travel == "" ||
//         this.model.business_date.length < 2 ||
//         this.model.business_date[ 0 ] == null ||
//         this.model.travel_object_expected == ""
//       ) {
//         this.statusValidate = true
//         return false
//       }

//       // check Travel Type
//       if (this.model.type_of_travel.meeting != true &&
//         this.model.type_of_travel.siteVisite != true &&
//         this.model.type_of_travel.workshop != true &&
//         this.model.type_of_travel.roadshow != true &&
//         this.model.type_of_travel.conference != true &&
//         this.model.type_of_travel.training != true &&
//         this.model.type_of_travel.other != true) {
//         this.statusValidate = true
//         return false
//       }

//       // check other
//       if (this.model.type_of_travel.other === true && (this.model.type_of_travel.remark === '' || this.model.type_of_travel.remark === null)) {
//         this.statusValidate = true
//         return false
//       }

//       if (this.type == "oversea" || this.type == "overseatraining") {
//         if (this.model.country.select.length == 0) {
//           this.statusValidate = true
//           return false
//         }
//         if (this.model.city == "") {
//           this.statusValidate = true
//           return false
//         }
//       } else {
//         if (this.model.province.select.length == 0) {
//           this.statusValidate = true
//           return false
//         }
//       }
//       ////debugger;
//       // Check After business trip completed, the staff should
//       if (this.model.after.ref2.value) {
//         if (this.model.after.ref2.remark === '') {
//           this.statusValidate = true;
//           return false;
//         }
//       }
//       else {
//         this.model.after.ref2.remark = "";
//       }
//       if (this.model.after.ref3.value) {
//         if (this.model.after.ref3.remark === '') {
//           this.statusValidate = true;
//           return false;
//         }
//       }
//       else {
//         this.model.after.ref3.remark = "";
//       }


//       return true
//     }

//     const save = () => {

//       if (this.buttons.save == false) {
//         return
//       }
//       console.log(">>>> Save request i <<<<");
//       console.log(this.didConvertFormatValue("1", ""))
//       //console.log(this.model.travel_object_expected.length)
//       if (requestData()) {
//         this.appMain.showConfirm(this.messages[ this.messages.rule ].save, () => {
//           console.log(this.model)
//           this.appMain.isLoading = true;
//           this.partIHttp.onSave(this.didConvertFormatValue("1", "")).subscribe(dao => {
//             this.appMain.isLoading = false;
//             console.log(dao);
//             if (dao[ "status" ] == "S") {
//               this.appMain.showMessage("Done.");
//               // this.router.navigate(["/main/request", "edit", this.model.document_id, "ii"]);
//               //// Save แล้วไม่ต้อง direct ไปหน้า tracking
//               // if (!this.model.approved.status) {
//               //   this.router.navigate(["/main/request_list", this.type]);
//               // }
//             } else {
//               this.appMain.showMessage(dao[ "message" ]);
//             }
//           }, error => this.appMain.isLoading = false);
//         })
//       } else {
//         this.appMain.showMessage("Please input value. * ")
//       }
//     }

//     const submit = () => {

//       var confirmsTxt = this.model.initiator.status === true ? this.model.doc_status === "22" ? this.messages[ this.messages.rule ].submit : this.messages[ this.messages.rule ].submitInitiator : this.messages[ this.messages.rule ].submit
//       if (this.buttons.submit == false) {
//         return
//       }

//       if (requestData()) {

//         if (this.model.summary_table.length == 0 || this.model.summary_table == [] || this.model.summary_table == undefined || this.model.summary_table == null) {
//           this.panel.travel = true
//           this.appMain.showMessage("Please input Traveler")
//           return;
//         }

//         // if (confirm(confirmsTxt)) {

//         this.appMain.showConfirm(confirmsTxt, () => {

//           console.log(this.model)

//           this.appMain.isLoading = true;
//           this.partIHttp.onSave(this.didConvertFormatValue("5", "")).subscribe(dao => {
//             this.appMain.isLoading = false;
//             console.log(dao);
//             if (dao[ "status" ] == "S") {
//               this.appMain.showMessage("Done.");
//               // this.router.navigate(["/main/request", "edit", this.model.document_id, "ii"]);
//               if (!this.model.approved.status) {
//                 this.router.navigate([ "/main/request_list", this.type ]);
//               }
//               else {
//                 this.router.navigate([ "/main/request", "edit", this.model.document_id, "ii" ]);
//               }
//             } else {
//               this.appMain.showMessage(dao[ "message" ]);
//             }
//           }, error => this.appMain.isLoading = false);
//         })
//       } else {
//         this.appMain.showMessage("Please input value. * ")
//       }
//     }

//     const cancel = () => {
//       if (this.buttons.cancel == false) {
//         return
//       }

//       this.appMain.showConfirm(this.messages[ this.messages.rule ].cancel, () => {
//         // if (confirm(this.messages[this.messages.rule].cancel)) {
//         console.log(this.model)
//         this.appMain.isLoading = true
//         this.partIHttp.onSave(this.didConvertFormatValue("6", "")).subscribe(dao => {
//           this.appMain.isLoading = false
//           console.log(dao);
//           if (dao[ "status" ] == "S") {
//             this.appMain.showMessage("Done.");
//             this.router.navigate([ "/main/request_list", this.type ]);
//           } else {
//             this.appMain.showMessage(dao[ "message" ]);
//           }
//         }, error => this.appMain.isLoading = false);
//       })

//     }

//     const reject = () => {
//       // var remarks = prompt("Do you want to reject document, please input to remark", "")
//       // if (remarks == null) {
//       //   console.log("No value");
//       // } else {
//       this.appMain.showConfirmTextbox("Do you want to reject document, please input to remark", (remarks) => {
//         if (remarks == "") {
//           this.appMain.showMessage("Please tell me the reason")
//           return
//         }
//         console.log(this.model)
//         this.partIHttp.onSave(this.didConvertFormatValue("2", remarks)).subscribe(dao => {
//           console.log(dao);
//           if (dao[ "status" ] == "S") {
//             this.appMain.showMessage("Done.");
//             this.router.navigate([ "main/services" ])
//           } else {
//             this.appMain.showMessage(dao[ "message" ]);
//           }
//         });
//       })
//     }

//     const revise = () => {
//       // var remarks = prompt("Do you want to revise document, please input to remark", "")
//       // if (remarks == null) {
//       //   console.log("No value");
//       // } else {
//       this.appMain.showConfirmTextbox("Do you want to revise document, please input to remark", (remarks) => {
//         if (remarks == "") {
//           this.appMain.showMessage("Please tell me the reason")
//           return
//         }
//         this.partIHttp.onSave(this.didConvertFormatValue("3", remarks)).subscribe(dao => {
//           console.log(dao);
//           if (dao[ "status" ] == "S") {
//             this.appMain.showMessage("Done.");
//             this.router.navigate([ "main/services" ])
//           } else {
//             this.appMain.showMessage(dao[ "message" ]);
//           }
//         });
//       })
//     }

//     const approve = () => {
//       if (confirm("Do you want to send approve?")) {
//         this.partIHttp.onSave(this.didConvertFormatValue("4", "")).subscribe(dao => {
//           console.log(dao);
//           if (dao[ "status" ] == "S") {
//             this.appMain.showMessage("Done.");
//             this.router.navigate([ "main/services" ])
//           } else {
//             this.appMain.showMessage(dao[ "message" ]);
//           }
//         });
//       }
//     }

//     switch (action) {
//       case this.stateGlobal.save: save(); break;
//       case this.stateGlobal.cancel: cancel(); break;
//       case this.stateGlobal.reject: reject(); break;
//       case this.stateGlobal.revise: revise(); break;
//       case this.stateGlobal.approve: approve(); break;
//       case this.stateGlobal.submit: submit(); break;
//     }
//   }

//   // check uncheck on behalf
//   onChangeCheckBoxBehalf() {
//     if (this.model.behalf.status == false) {
//       this.model.behalf.emp_id.value = ""
//       this.model.behalf.emp_id.data = ""
//       this.model.behalf.emp_name.value = ""
//       this.model.behalf.emp_name.data = ""
//       this.model.behalf.emp_org = ""
//     }
//   }

//   // MARK :: Manage event type travel -> single, multi
//   onChangeTypeTravel() {
//     if (this.model.type_radio == "single") {
//       this.model.country.select = []
//     } else {
//       this.model.country.select = []
//     }
//   }

//   // MARK :: Auto complete to fetch api EMP ID in behalf
//   onSearchBehalfEmpID() {
//     if (this.model.behalf.emp_id.value.length > 1) {
//       this.masterHttp.onSearchEmployee(this.model.behalf.emp_id.value, "").subscribe(dao => {
//         var bucketNew = [];
//         dao.forEach(element => {
//           bucketNew.push({id: "" + element[ "empId" ], name: element[ "empId" ], nameFull: element[ "empName" ], dept: element[ "deptName" ]});
//         });
//         this.model.behalf.emp_id.list = bucketNew
//       })
//     }
//   }

//   // MARK :: Selected Emp ID in behalf effect to emp name, org update
//   onSelectedBehalfEmpID(event) {
//     this.model.behalf.emp_name.value = event[ "nameFull" ];
//     this.model.behalf.emp_org = event[ "dept" ];
//     this.model.behalf.emp_id.data = event[ "id" ];
//     this.model.behalf.emp_name.data = event[ "nameFull" ];
//   }

//   // MARK :: Auto complete to fetch api EMP Name in behalf
//   onSearchBehalfEmpName(event) {
//     if (event.length > 1) {
//       this.masterHttp.onSearchEmployee("", event).subscribe(dao => {
//         var bucketNew = [];
//         dao.forEach(element => {
//           bucketNew.push({id: "" + element[ "empId" ], name: element[ "empName" ], nameFull: element[ "empName" ], dept: element[ "deptName" ]});
//         });
//         this.model.behalf.emp_name.list = bucketNew
//       })
//     }
//   }

//   // MARK :: Selected Emp Name in behalf effect to emp id, org update
//   onSelectedBehalfEmpName(event) {
//     this.model.behalf.emp_id.value = event[ "id" ];
//     this.model.behalf.emp_org = event[ "dept" ];
//     this.model.behalf.emp_name.data = event[ "name" ];
//     this.model.behalf.emp_id.data = event[ "id" ];
//   }

//   // MARK :: Auto complete to fetch api emp id in add travel
//   onSearchAddTravelEmpID(state: String, event: any) {
//     const onLoad = (event) => {
//       if (event.length > 1) {
//         this.masterHttp.onSearchEmployee(event, "").subscribe(dao => {
//           console.log(dao)
//           this.model.add_travel.emp_id.list = [];
//           dao.forEach(element => {
//             this.model.add_travel.emp_id.list.push(
//               {
//                 id: "" + element[ "empId" ],
//                 name: element[ "empId" ],
//                 nameFull: element[ "empName" ],
//                 dept: element[ "deptName" ],
//                 gl: element[ "gl_account" ],
//                 cost_center: element[ "cost_center" ],
//                 order: element[ "order_wbs" ]
//               });
//           });
//         })
//       }
//     }

//     const onSelected = (event) => {
//       this.model.add_travel.emp_id.data = event[ "id" ];
//       this.model.add_travel.emp_name.data = event[ "nameFull" ];
//       this.model.add_travel.emp_name.value = event[ "nameFull" ];
//       this.model.add_travel.emp_org = event[ "dept" ];
//       // this.model.add_travel.gl = event["gl"];
//       this.model.add_travel.cost = event[ "cost_center" ];
//       this.model.add_travel.order_wrs = ""
//       // this.model.add_travel.order_wrs = event["order"];
//       console.log(event)


//     }

//     if (state == "load")
//       onLoad(event)
//     else
//       onSelected(event)
//   }

//   onLoadGL(event: any) {
//     console.log(event)

//     this.partIHttp.onLoadMasterGL(event).subscribe(value => {
//       console.log(value)
//       this.model.add_travel.gl_auto.list = []
//       value.forEach(item => {
//         this.model.add_travel.gl_auto.list.push({
//           "name": item[ "code" ]
//         })
//       });
//     })
//   }

//   onLoadCost(event: any) {
//     console.log(event)

//     this.partIHttp.onLoadMasterCostCenter(event).subscribe(value => {
//       console.log(value)
//       this.model.add_travel.cost_center_master.list = []
//       value.forEach(item => {
//         this.model.add_travel.cost_center_master.list.push({
//           "name": item[ "code" ]
//         })
//       });
//     })
//   }
//   onLoadWbs(event: any) {
//     console.log(event)

//     this.partIHttp.onLoadMasterWBS(event).subscribe(value => {
//       console.log(value)
//       this.model.add_travel.wbs.list = []
//       value.forEach(item => {
//         this.model.add_travel.wbs.list.push({
//           "name": item[ "wbs" ],
//           "cost_center": item[ "cost_center" ]
//         })
//       });
//     })
//   }

//   onSelectWbs(event: any) {
//     console.log(event[ "name" ])
//     //this.model.add_travel.cost = event["cost_center"] != null ? event["cost_center"] : '';
//   }

//   // MARK :: AUTO COMPLETE GL
//   onSelectGL(event: any) {

//   }

//   // MARK :: AUTO COMPLETE Cost
//   onSelectCost() {
//     //this.model.add_travel.order_wrs = ""
//   }

//   // MARK :: Auto complete to fetch api emp name in add travel
//   onSearchAddTravelEmpName(state: String, event: any) {
//     const onLoad = (event) => {
//       if (event.length > 1) {
//         this.masterHttp.onSearchEmployee("", event).subscribe(dao => {
//           this.model.add_travel.emp_name.list = [];
//           dao.forEach(element => {
//             this.model.add_travel.emp_name.list.push({id: "" + element[ "empId" ], name: element[ "empName" ], nameFull: element[ "empName" ], dept: element[ "deptName" ], cost_center: element[ "cost_center" ]});
//           });
//         })
//       }
//     }

//     const onSelected = (event) => {
//       this.model.add_travel.emp_id.value = event[ "id" ];
//       this.model.add_travel.emp_id.data = event[ "id" ];
//       this.model.add_travel.emp_name.data = event[ "nameFull" ];
//       this.model.add_travel.emp_org = event[ "dept" ];
//       this.model.add_travel.cost = event[ "cost_center" ];
//       this.model.add_travel.order_wrs = ""
//     }

//     if (state == "load")
//       onLoad(event)
//     else
//       onSelected(event)
//   }

//   // MARK :: Auto complete to fetch api emp id in initiator
//   onSearchInitiatorEmpId(state: String, event: any) {
//     const onLoad = (event) => {
//       if (event.length > 1) {
//         this.masterHttp.onSearchEmployee(event, "").subscribe(dao => {
//           this.model.initiator.emp_id.list = [];
//           dao.forEach(element => {
//             this.model.initiator.emp_id.list.push({id: "" + element[ "empId" ], name: element[ "empId" ], nameFull: element[ "empName" ], dept: element[ "deptName" ], cost_center: element[ "cost_center" ]});
//           });
//         })
//       }
//     }

//     const onSelected = (event) => {
//       this.model.initiator.emp_id.data = event[ "id" ];
//       this.model.initiator.emp_name.data = event[ "nameFull" ];
//       this.model.initiator.emp_name.value = event[ "nameFull" ];
//       this.model.initiator.emp_org = event[ "dept" ];
//     }

//     if (state == "load")
//       onLoad(event)
//     else
//       onSelected(event)
//   }

//   // MARK :: Auto complete to fetch api emp name in initiator
//   onSearchInitiatorEmpName(state: String, event: any) {
//     const onLoad = (event) => {
//       if (event.length > 1) {
//         this.masterHttp.onSearchEmployee("", event).subscribe(dao => {
//           this.model.initiator.emp_name.list = [];
//           dao.forEach(element => {
//             this.model.initiator.emp_name.list.push({id: "" + element[ "empId" ], name: element[ "empName" ], nameFull: element[ "empName" ], dept: element[ "deptName" ]});
//           });
//         })
//       }
//     }

//     const onSelected = (event) => {
//       this.model.initiator.emp_id.value = event[ "id" ];
//       this.model.initiator.emp_id.data = event[ "id" ];
//       this.model.initiator.emp_name.data = event[ "nameFull" ];
//       this.model.initiator.emp_org = event[ "dept" ];
//     }

//     if (state == "load")
//       onLoad(event)
//     else
//       onSelected(event)
//   }

//   didFetchProfile() {
//     console.log(">>> CHECK USER TYPE <<<")
//     const onSuccess = (dao) => {
//       console.log(dao);
//       console.log("--- CHECK USER TYPE sucess ---")


//       const profile = _ => {

//         this.profile.username = dao[ 0 ][ "empName" ];
//         this.profile.images = dao[ 0 ][ "imgUrl" ];
//         this.profile.user_admin = dao[ 0 ][ "user_admin" ];
//         this.profile.emp_id = dao[ 0 ][ "empId" ];
//         this.profile.user_type = dao[ 0 ][ "user_type" ];
//         const admin = dao[ 0 ][ "user_admin" ];
//         console.log(dao[ 0 ]);
//         console.log(this.profile);

//         if (this.profile.user_type === "2") {
//           this.model.behalf.status = true;
//           this.disCheckEmp = true;
//           this.model.requester_emp_name = dao[ 0 ][ "empName" ];
//         } else {
//           this.model.behalf.status = false;
//           this.disCheckEmp = false;
//           this.model.requester_emp_name = dao[ 0 ][ "empName" ];
//         }


//       }

//       const profileData = profile('');


//     }
//     this.ws.onFetchUserProfile().subscribe(dao => onSuccess(dao), error => alert("loginProfile Error : " + error));
//   }

//   showRemarkFlow(txt) {
//     this.appMain.showMessage(txt);
//   }

//   checkBoxTravelType(types: string, events: any) {

//     const checkBoxCheck = (meeting, siteVisite, workshop, roadshow, conference, other, training) => {
//       this.model.type_of_travel.meeting = meeting;
//       this.model.type_of_travel.siteVisite = siteVisite;
//       this.model.type_of_travel.workshop = workshop;
//       this.model.type_of_travel.roadshow = roadshow;
//       this.model.type_of_travel.conference = conference;
//       this.model.type_of_travel.training = training;
//       this.model.type_of_travel.other = other;
//     }

//     if (types === 'meeting' && events === true) {
//       checkBoxCheck(true, false, false, false, false, false, false);
//     }
//     else if (types === 'siteVisite' && events === true) {
//       checkBoxCheck(false, true, false, false, false, false, false);
//     }
//     else if (types === 'workshop' && events === true) {
//       checkBoxCheck(false, false, true, false, false, false, false);
//     }
//     else if (types === 'roadshow' && events === true) {
//       checkBoxCheck(false, false, false, true, false, false, false);
//     }
//     else if (types === 'conference' && events === true) {
//       checkBoxCheck(false, false, false, false, true, false, false);
//     }
//     else if (types === 'other' && events === true) {
//       checkBoxCheck(false, false, false, false, false, true, false);
//     }
//     else if (types === 'training' && events === true) {
//       checkBoxCheck(false, false, false, false, false, false, true);
//     }
//   }

//   checkCharacters(max: number, text: string) {
//     console.log('text.length : ' + text.length);
//     if (text.length > max) {
//       this.appMain.showMessage("imit string to " + max + " characters.");
//     }
//   }

//   checkMinMaxDate(type: string, date: string) {
//     if (date === 'business_date') {
//       if (this.model.business_date != null && this.model.business_date != [] && this.model.business_date.length === 2) {
//         if (type === 'min') {
//           return this.model.business_date[ 0 ];
//         }
//         else {
//           return this.model.business_date[ 1 ];
//         }
//       }
//       else {
//         return null;
//       }
//     }
//     else {
//       if (this.model.travel_date != null && this.model.travel_date != [] && this.model.travel_date.length === 2) {
//         if (type === 'min') {
//           return this.model.travel_date[ 0 ];
//         }
//         else {
//           return this.model.travel_date[ 1 ];
//         }
//       }
//       else {
//         return null;
//       }
//     }
//   }
// }
