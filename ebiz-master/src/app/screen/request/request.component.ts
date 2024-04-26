// import { Component, forwardRef, Inject, OnInit } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
// import { LoadListService } from 'src/app/http/load-list/load-list.service';
// import { AspxserviceService } from 'src/app/master/ws/httpx/aspxservice.service';
// import { AlertServiceService } from 'src/app/services/AlertService/alert-service.service';
// import { MainComponent } from '../main.component';

// declare var $: any;
// @Component({
//   selector: 'app-request',
//   templateUrl: './request.component.html',
//   styleUrls: ['./request.component.css']
// })
// export class RequestComponent implements OnInit {

//   type: string = ""
//   id: string = ""
//   types: string = ""
//   root_doc_id = ""    // ID DOC
//   root_doc_status = ""   // draft / ???

//   buttons = {
//     PartI: true,
//     PartII: false,
//     PartIII: false,
//     PartIIII: false,
//     Print: false
//   }

//   select = "i";
//   stateX: string = "";
//   btnGoToPhase2: boolean = false;

//   constructor(
//     @Inject(forwardRef(() => MainComponent)) private appMain: MainComponent,
//     private route: ActivatedRoute,
//     public ws: AspxserviceService,
//     private alerts: AlertServiceService,
//     private loadList: LoadListService
//   ) {

//     this.route.params.subscribe(params => {

//       this.type = params["types"];
//       this.id = params["ids"];
//       this.stateX = this.id.substr(0, 2).toUpperCase() === "OB" ? "oversea" : this.id.substr(0, 2).toUpperCase() === "OT" ? "overseatraining" : this.id.substr(0, 2).toUpperCase() === "LB" ? "local" : this.id.substr(0, 2).toUpperCase() === "LT" ? "localtraining" : "";
//       console.log(this.stateX);


//       this.buttons.Print = this.type === "create" ? false : true;
//       //console.log(this.id.substr(0, 2));
//       // oversea
//       // local
//     });
//     // this.type = route.params["types"];
//     // this.id = route.params["ids"];
//     // console.log(this.type)
//     // console.log(this.id)
//   }

//   ngOnInit() {


//     const onSuccess = (data) => {
//       console.log('load header request');
//       console.log(data);
//       if (data.length > 0) {
//         this.btnGoToPhase2 = data[0].button_status === 2 || data[0].button_status === 7 ? false : true;
//         //button_status
//       }
//     }

//     this.loadList.onFetch("", "", "", "", this.root_doc_id).subscribe(dao => onSuccess(dao), error => this.appMain.isLoading = false)

//   }

//   openPhase2(){
//     let url = 'master/'+ this.root_doc_id +'/travelerhistory';
//     window.open(url, "_blank");
//   }

//   al() {
//     alert("TEST")
//     console.log("TEST")
//   }

//   report() {
//     if (this.buttons.Print) {
//       this.appMain.isLoading = true;
//       // body ให้ส่ง parameter ต่างๆที่แสดงด้านบนของ excel
//       let body = {
//         "token_login": localStorage["token"],
//         "doc_id": this.id,
//         "state": this.stateX, // OB = oversea, OT = overseatraining, LB = local, LT = localtraining
//       }

//       // ข้อมูลในตารางรูปแบบ json
//       let jsondata = [
//         {
//           "data": "row1",
//           "doc_id": "xxxx",
//         },
//         {
//           "data": "row2",
//           "doc_id": "xxxx",
//         }
//       ];

//       const onSuccess = (data) => {
//         console.log('***Call Asmx***');
//         // console.log(data);
//         // console.log(data.d);

//         var parsed = $.parseJSON(data.d);
//         console.log(parsed);
//         console.log(parsed.dtResult);

//         if (parsed.dtResult[0].status === 'true') {
//           console.log(parsed.dtResult[0].file_system_path);
//           console.log(parsed.dtResult[0].file_outbound_path);
//           console.log(parsed.dtResult[0].file_outbound_name);

//           this.ws.downloadFile(parsed.dtResult[0].file_outbound_path, parsed.dtResult[0].file_outbound_name);
//           this.appMain.isLoading = false;
//         }
//         else {
//           this.appMain.isLoading = false;
//           this.alerts.swal_error(parsed.dtResult[0].status);
//         }
//       }

//       //data, function name(ฝั่ง asmx), method name(phase1report, allowance, reimbursement)
//       this.ws.excel_report(body, JSON.stringify(jsondata), 'TravelReport', 'phase1report').subscribe(data => onSuccess(data), error => {
//         this.appMain.isLoading = false
//         this.alerts.swal_error(error);
//         console.log(error);
//         alert('Can\'t call web api.' + ' : ' + error.message);
//       });
//     }
//   }
// }
