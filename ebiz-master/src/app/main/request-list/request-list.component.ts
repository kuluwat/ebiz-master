import {Component, OnInit, ViewChild, Inject, forwardRef} from '@angular/core';
import {ActivatedRoute, NavigationExtras, Router} from '@angular/router';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { LoadListService } from '../../http/load-list/load-list.service';
import { MasterService } from '../../http/master/master.service';
import {MainComponent} from '../main.component';
import { AspxserviceService } from '../../ws/httpx/aspxservice.service';
import {DatePipe} from '@angular/common';
@Component({
  selector: 'app-request-list',
  templateUrl: './request-list.component.html',
  styleUrls: [ './request-list.component.css' ]
})
export class RequestListComponent implements OnInit {

  model = {
    request_type: {
      value: [],
      config: {
        displayKey: 'name', // if objects array passed which key to be displayed defaults to description
        search: true,
        limitTo: 1000,
        placeholder: 'Select',
        customComparator: (function (a : any, b: any) {
          if (a.sort < b.sort) {return -1;}
          if (a.sort > b.sort) {return 1;}
          return 0;
        })
      },
      list: [
        {
          '_id': '5a66d6c31d5e4e36c7711b7a',
          'val': 'oversea',
          'name': 'Oversea business',
          'sort': 1
        }, {
          '_id': '5a66d6c31d5e4e36c7711b7a',
          'val': 'local',
          'name': 'Local business',
          'sort': 2
        }
        , {
          '_id': '5a66d6c31d5e4e36c7711b7a',
          'val': 'overseatraining',
          'name': 'Oversea training',
          'sort': 3
        }, {
          '_id': '5a66d6c31d5e4e36c7711b7a',
          'val': 'localtraining',
          'name': 'Local training',
          'sort': 4
        }
      ]
    },
    country: {
      value: [],
      config: {
        displayKey: 'name', // if objects array passed which key to be displayed defaults to description
        search: true,
        limitTo: 1000,
        height: "500px",
        placeholder: 'Select'
      },
      list: [
        {
          '_id': '5a66d6c31d5e4e36c7711b7a',
          'val': '1',
          'name': 'On Process'
        }
      ]
    },
    province: {
      value: [],
      config: {
        displayKey: 'name', // if objects array passed which key to be displayed defaults to description
        search: true,
        limitTo: 1000,
        height: "500px",
        placeholder: 'Select'
      },
      list: [ {
        '_id': '5a66d6c31d5e4e36c7711b7a',
        'val': '1',
        'name': 'On Process'
      } ]
    },
    business_date: [],
    request_status: {
      value: [],
      config: {
        displayKey: 'name', // if objects array passed which key to be displayed defaults to description
        search: true,
        limitTo: 10,
        height: "500px",
        width: "500px",
        placeholder: 'Select'
      },
      list: [
        {
          '_id': '5a66d6c31d5e4e36c7711b7a',
          'val': '1',
          'name': 'On Process'
        }
      ]
    },
    keyword: "",
    data_set: [{
      id:'',
      doc_date: Date(),
      button_status: '',
      tab_no:'',
      business_trip:'',
      business:'',
      person:'',
      place:'',
      doc_id:'',
      type:'',
      by:'',
      status_trip_cancelled:'',
      button_copy:'',
      title:''

    }],
    btnCreate: true,
    req_type: ""
  }

  panel = {
    country: false,
    province: false
  }

  state: string = "";


  requestTypeDisplay: string = "";

  public onload: boolean = true;
  public now: number = new Date().setMonth(new Date().getMonth() - 2);





  public onloadStart: any = null;
  public onloadEnd: any = null;

  @ViewChild(MatPaginator, {static: true}) paginator?: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort?: MatSort;


  constructor(
    // @Inject(forwardRef(() => MainComponent)) private appMain: MainComponent,
    private route: ActivatedRoute,
    private loadList: LoadListService,
    private masterHttp: MasterService,
    private router: Router,
    public ws: AspxserviceService
  ) {
    //     onloadStart
    // onloadEnd
    var montF = new DatePipe('en-US');

    this.onloadStart = new Date(this.now);
    this.onloadEnd = montF.transform(new Date(), "yyyy-MM-dd")


    // @ts-ignore
    console.log(this.onloadStart, this.onloadEnd)
    // this.route.params.subscribe(params => {
    //   this.state = params[ "types" ];


    //   const checkParams = () => {
    //     if (this.state === 'local' || this.state === 'oversea') {
    //       this.requestTypeDisplay = "Business trip";
    //       this.model.request_type.list = [];

    //       this.model.request_type.list = [
    //         {
    //           '_id': '5a66d6c31d5e4e36c7711b7a',
    //           'val': 'oversea',
    //           'name': 'Oversea business',
    //           'sort': 1
    //         }, {
    //           '_id': '5a66d6c31d5e4e36c7711b7a',
    //           'val': 'local',
    //           'name': 'Local business',
    //           'sort': 2
    //         }
    //       ];

    //       // this.model.request_type.value = [ {
    //       //   '_id': '5a66d6c31d5e4e36c7711b7a',
    //       //   'val': this.state == "local" ? 'local' : "oversea",
    //       //   'name': this.state == "local" ? 'Local business' : "Oversea business",
    //       //   'sort': this.state == "local" ? 2 : 1,
    //       // } ];

    //       this.model.req_type = this.state === "local" ? 'local' : "oversea";

    //     } else if (this.state === 'localtraining' || this.state === 'overseatraining') {

    //       this.requestTypeDisplay = "Training trip";
    //       this.model.request_type.list = [];

    //       this.model.request_type.list = [
    //         {
    //           '_id': '5a66d6c31d5e4e36c7711b7a',
    //           'val': 'overseatraining',
    //           'name': 'Oversea training',
    //           'sort': 3
    //         }, {
    //           '_id': '5a66d6c31d5e4e36c7711b7a',
    //           'val': 'localtraining',
    //           'name': 'Local training',
    //           'sort': 4
    //         }
    //       ];

    //       // this.model.request_type.value = [ {
    //       //   '_id': '5a66d6c31d5e4e36c7711b7a',
    //       //   'val': this.state === "localtraining" ? "localtraining" : 'overseatraining',
    //       //   'name': this.state === "localtraining" ? "Local training" : 'Oversea training',
    //       //   'sort': this.state === "localtraining" ? 4 : 3,
    //       // } ];

    //       this.model.req_type = this.state === "localtraining" ? "localtraining" : 'overseatraining';
    //     }
    //     else {
    //       this.model.btnCreate = false;
    //       this.requestTypeDisplay = "";
    //       this.model.request_type.list = [];

    //       this.model.request_type.list = [
    //         {
    //           '_id': '5a66d6c31d5e4e36c7711b7a',
    //           'val': 'oversea',
    //           'name': 'Oversea business',
    //           'sort': 1
    //         }, {
    //           '_id': '5a66d6c31d5e4e36c7711b7a',
    //           'val': 'local',
    //           'name': 'Local business',
    //           'sort': 2
    //         },
    //         {
    //           '_id': '5a66d6c31d5e4e36c7711b7a',
    //           'val': 'overseatraining',
    //           'name': 'Oversea training',
    //           'sort': 3
    //         }, {
    //           '_id': '5a66d6c31d5e4e36c7711b7a',
    //           'val': 'localtraining',
    //           'name': 'Local training',
    //           'sort': 4
    //         }
    //       ];
    //     }



    //     this.model.request_type.list.sort(function (a, b) {
    //       if (a.sort < b.sort) {return -1;}
    //       if (a.sort > b.sort) {return 1;}
    //       return 0;
    //     });
    //     //this.model.request_type.value = this.model.request_type.list[0]//this.state === "local" ? this.model.request_type.list[1] : this.state === "oversea" ? this.model.request_type.list[0] : [];
    //     return true
    //   }
    //   if (checkParams()) {
    //     this.didSetDefault(this.state)
    //     this.didFetchProvince();
    //     this.didFetchCountry();
    //     this.didFetchRequestStatus();
    //     this.didSearchRequestTacking();
    //   }
    // });
  }

  handleGoToDetail(docID : any, part : any) {
    console.log(">>> Tab No <<<");
    console.log(part);
    var states = "i"
    switch (part) {
      case "1": states = "i"; break;
      case "2": states = "ii"; break;
      case "3": states = "iii"; break;
      case "4": states = "cap"; break;
      default: states = "i"; break;
    }
    // this.router.navigate([ '/main/request/edit', docID, states ])
  }

  didSearchRequestTacking() {
    // this.appMain.isLoading = true;
    const onSuccess = (dao : any) => {
      this.onload = false;
      // this.appMain.isLoading = false;
      console.log('>>> LoadDocList (Tracking) <<<')
      console.log(dao)
      this.model.data_set = dao
    }
    //let xxx = this.model.request_type.value[0]["val"];
    // let states = this.model.request_type.value == [] || this.model.request_type.value == undefined ? this.state : this.model.request_type.value["val"]
    let states = this.model.req_type;
    if (this.onload) {
      // this.model.business_date[ 0 ] = this.onloadStart;
      // this.model.business_date[ 1 ] = new Date();

    }
    //let states = this.model.request_type.value == [] || this.model.request_type.value == undefined ? "" :  this.model.request_type.value["val"]
    // let country = this.model.country.value == [] || this.model.country.value == undefined ? "" : this.model.country.value
    // let status = this.model.request_status.value == [] || this.model.request_status.value == undefined ? "" : this.model.request_status.value
    // this.loadList.onFetch(states == undefined ? "" : states, country, this.model.business_date, status, this.model.keyword).subscribe(dao => onSuccess(dao), error => (this.appMain.isLoading = false))
  }

  ngOnInit() {
  }

  // handle change request type to update country / province
  hanleChangeRequestType(event : any) {
    debugger;
    if (event.value != undefined) {
      this.model.request_type.list.sort(function (a, b) {
        if (a.sort < b.sort) {return -1;}
        if (a.sort > b.sort) {return 1;}
        return 0;
      });
      this.model.req_type = event.value.val;
      this.didSetDefault(event.value.val);
      this.model.btnCreate = true;
    } else {
      this.model.req_type = "";
      this.model.btnCreate = false;
    }
  }

  handleCopy(id: string) {
    const didCopy = (dao : any) => {
      if (dao[ "status" ] == "S") {
        // success
        alert("Copy Done.")
        // this.router.navigate([ '/main/request/edit', dao[ "value" ], "i" ])
      } else {
        // failed
        alert(dao[ "message" ])
      }
    }
    // this.appMain.showConfirm("Do you want to copy?", () => {
    //   // if(confirm("Do you want to copy?")){
    //   this.loadList.onCopy(id).subscribe(dao => didCopy(dao))
    // })
  }

  // set default 
  didSetDefault(state: String) {
    if (state === "local" || state === "localtraining") {
      // Local
      this.panel.province = true;
      this.panel.country = false;
    } else {
      // Oversea
      this.panel.province = false;
      this.panel.country = true;
    }

  }

  didFetchCountry() {
    const onSuccess = (dao : any) => {
      this.model.country.list = [];
      dao.forEach((current : any) => {
        this.model.country.list.push({
          '_id': current[ "country_id" ],
          'val': current[ "country_id" ],
          'name': current[ "country" ]
        })
      });
    }

    // this.masterHttp.onFetchCountry("").subscribe(dao => onSuccess(dao))
  }

  didFetchProvince() {
    const onSuccess = (dao : any) => {
      this.model.province.list = [];
      dao.forEach((current : any) => {
        this.model.province.list.push({
          '_id': current[ "id" ],
          'val': current[ "id" ],
          'name': current[ "province" ]
        })
      })
      console.log(this.model.province.list)
    }

    // this.masterHttp.onFetchProvince().subscribe(dao => onSuccess(dao))
  }

  didFetchRequestStatus() {
    const onSuccess = (dao : any) => {
      console.log('---Master status in tracking---')
      console.log(dao);
      this.model.request_status.list = [];
      dao.forEach((current : any) => {
        if (current.id.toString() != '42') {
          this.model.request_status.list.push({
            '_id': current[ "id" ],
            'val': current[ "id" ],
            'name': current[ "name" ]
          });
        }
      });
    }
    // this.masterHttp.onFetchRequestStatus().subscribe(dao => onSuccess(dao))
  }

  handleOnCreate() {
    // this.router.navigate([ '/main/request/create', this.model.request_type.value, 'i' ])
  }


  // phase2

  handleOpenTravelerDetail(id: string, typeX : any) {
    debugger;
    let typeStr = "";
    typeX === '7' ? typeStr = "view" : typeStr = "detail";
    console.log('--handleOpenTravelerDetail--')
    console.log(typeX);
    console.log(typeStr);
    console.log(this.state);

    let stateX = "";
    if (this.state === "all") {
      stateX = id.substr(0, 2).toUpperCase() === "OB" ? "oversea" : id.substr(0, 2).toUpperCase() === "OT" ? "overseatraining" : id.substr(0, 2).toUpperCase() === "LB" ? "local" : id.substr(0, 2).toUpperCase() === "LT" ? "localtraining" : "";
    }
    else {
      stateX = id.substr(0, 2).toUpperCase() === "OB" ? "oversea" : id.substr(0, 2).toUpperCase() === "OT" ? "overseatraining" : id.substr(0, 2).toUpperCase() === "LB" ? "local" : id.substr(0, 2).toUpperCase() === "LT" ? "localtraining" : "";
      //stateX = this.state;
    }
    const navigationExtras: NavigationExtras = {
      //queryParams
      queryParams: {
        // id: 1,
        status_type: typeStr,
        doc_id: id,
        requestType: stateX
      },
      // skipLocationChange: false,
      // fragment: 'top'
    };


    // this.router.navigate([ '/master', id, {t: typeStr} ], {state: {paramsDesc: navigationExtras}});


    // const url = this.router.serializeUrl(
    //   this.router.createUrlTree(['/master', id])
    // )
    // window.open(url, '_blank');


    //this.router.navigate(['/master', id])

    // const didCopy = (dao) => {
    //   if(dao["status"] == "S"){
    //     // success
    //     alert("Copy Done.")
    //     this.router.navigate(['/main/request/edit', dao["value"], "i"])
    //   }else{
    //     // failed
    //     alert(dao["message"])
    //   }
    // }
    // this.appMain.showConfirm("Do you want to copy?", () => {
    // // if(confirm("Do you want to copy?")){
    //   this.loadList.onCopy(id).subscribe(dao => didCopy(dao))
    // })
  }

}
