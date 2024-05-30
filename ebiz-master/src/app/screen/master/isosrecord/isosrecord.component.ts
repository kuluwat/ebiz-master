import { Component, forwardRef, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MasterService } from '../../../http/master/master.service';
import { MasterComponent } from '../master.component';
import { AspxserviceService } from '../../../ws/httpx/aspxservice.service';
import { AlertServiceService } from '../../../services/AlertService/alert-service.service';
import { HeaderComponent } from '../../../components/header/header.component';


declare var $: any;

@Component({
  selector: 'app-isosrecord',
  templateUrl: './isosrecord.component.html',
  styleUrls: ['./isosrecord.component.css']
})
export class IsosrecordComponent implements OnInit {

  model : any = {
    yearArr: [],
    year: null,
    dataSource: []
  }

  registerForm!: FormGroup;
  submitted = false;

  state: String = "";

  constructor(
    @Inject(forwardRef(() => MasterComponent)) private appMain: MasterComponent,
    @Inject(forwardRef(() => HeaderComponent)) private appHeader: HeaderComponent,
    public ws: AspxserviceService,
    private alerts: AlertServiceService,
    private masterHttp: MasterService,
    private formBuilder: FormBuilder
  ) {

    const years = this.getYears().years;
    this.model.yearArr = years;
  }

  ngOnInit() {
    //this.appMain.isLoading = true;
    console.log('*****ISOS Record Oninit*****');
    // if(this.appMain.userSelected != ''){
    //   alert(this.appMain.userSelected)
    // //this.appMain.userSelected = "zattaphonso";
    // }
    const year = this.getCurrentYear();
    this.search(year);
    var contentX = document.getElementById("contentX");
    contentX!.classList.remove("d-none");

    // var contentX = document.getElementById("contentX");
    // contentX.classList.remove("d-none");

    //this.appMain.isLoading = false;

    this.registerForm = this.formBuilder.group({
      // request_type: ['', [Validators.required]],
      year: ['', [Validators.required]],
      // email: ['', [Validators.required, Validators.email]],
      // password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  getCurrentYear() {
    const date = new Date();
    return date.getFullYear();
  }

  getYears() {
    const from = this.getCurrentYear();
    this.model.year = from;
    const years = [];
    const currentYear = this.getCurrentYear();
    // for (let index = 0; index <= currentYear - from; index++) {
    //   years.push(from + index);
    // }
    for (let index = 0; index <= 5; index++) {
      years.push(from - index);
    }


    return { years, currentYear };
  }

  get f() { return this.registerForm.controls; }


  onSubmit() {
    //debugger;
    console.log(this.registerForm);
    this.submitted = true;

    // if (this.registerForm.controls.year.invalid) {
      // var control = document.getElementById('ddlRequestType').children[0].children[0];
      // var control = document.getElementById('ddlRequestType').children[0].children[0];
      // control.classList.add('border-red');
    // }
    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }
    //this.search();
  }

  checkValueNull(val : any) {
    return val === null || val === "" || val === undefined ? true : false;
  }

  search(year : any) {

    this.appMain.isLoading = true;

    //this.model.year = year;
    let bodyX = {
      "token_login": localStorage["token"],
      "year": year,
    }

    const onSuccess = (data : any) => {

      console.log('---Search isos record data---');
      console.log(data);

      this.model.dataSource = [];
      this.model.dataSource = data.details_list;

      this.appMain.isLoading = false;
    }

    this.ws.callWs(bodyX, 'ReportISOSRecord').subscribe(data => onSuccess(data), error => {
      this.appMain.isLoading = false;
      this.alerts.swal_error(error);
      console.log(error);
      alert('Can\'t call web api.' + ' : ' + error.message);
    })
  }

  exportExcel(year : any) {
    if (this.model.dataSource.length > 0) {
      this.appMain.isLoading = true;

      // let date_from = !this.checkValueNull(this.model.business_date_from) ? new Date(this.model.business_date_from) : "";
      // let date_to = !this.checkValueNull(this.model.business_date_to) ? new Date(this.model.business_date_to) : "";
      // let country = "";

      // let countryVal = !this.checkValueNull(this.model.country.value['name']) || this.model.country.value.length > 0 ? !this.checkValueNull(this.model.country.value['name']) ? this.model.country.value['name'] : !this.checkValueNull(this.model.country.value[0]['name']) ? this.model.country.value[0]['name'] : "" : "";
      // let provinceVal = !this.checkValueNull(this.model.province.value['name']) || this.model.province.value.length > 0 ? !this.checkValueNull(this.model.province.value['name']) ? this.model.province.value['name'] : !this.checkValueNull(this.model.province.value[0]['name']) ? this.model.province.value[0]['name'] : "" : "";

      // if (this.model.request_type.select.length === 1) {
      //   if (this.model.request_type.select[0].val === "ob" || this.model.request_type.select[0].val === "ot") {
      //     if (!this.checkValueNull(countryVal)) { country = this.model.country.value['name']; }
      //     else { country = " - " }
      //   }
      //   else {
      //     // if (!this.checkValueNull(provinceVal)) { country = this.model.province.value['name']; }
      //     // else { country = " - " }
      //     if (!this.checkValueNull(provinceVal)) { country = "Thailand"; }
      //     else { country = "Thailand" }
      //   }
      // }

      // else {
      //   country = " - ";
      // }
      // //debugger;
      // let reqt = !this.checkValueNull(this.model.request_type.value['val']) ? this.model.request_type.value['val'] : "";
      // let empId = !this.checkValueNull(this.model.employee.value['val']) ? this.model.employee.value['val'] : "";
      // let sect = !this.checkValueNull(this.model.section.value['val']) || this.model.section.value.length > 0 ? !this.checkValueNull(this.model.section.value['val']) ? this.model.section.value['val'] : !this.checkValueNull(this.model.section.value[0]['val']) ? this.model.section.value[0]['val'] : "" : "";
      // let depr = !this.checkValueNull(this.model.department.value['val']) || this.model.department.value.length > 0 ? !this.checkValueNull(this.model.department.value['val']) ? this.model.department.value['val'] : !this.checkValueNull(this.model.department.value[0]['val']) ? this.model.department.value[0]['val'] : "" : "";
      // let func = !this.checkValueNull(this.model.function.value['val']) || this.model.function.value.length > 0 ? !this.checkValueNull(this.model.function.value['val']) ? this.model.function.value['val'] : !this.checkValueNull(this.model.function.value[0]['val']) ? this.model.function.value[0]['val'] : "" : "";
      // let body = {
      //   "token_login": localStorage["token"],
      //   "doc_id": "",
      //   "country": country,//
      //   "date_from": this.ws.formatDate(date_from) != "" ? this.ws.formatDate(date_from) : "All",
      //   "date_to": this.ws.formatDate(date_to) != "" ? this.ws.formatDate(date_to) : "All",
      //   // "travel_type_name": !this.ws.isEmpty(this.model.request_type.value['name']) ? this.model.request_type.value['name'] : "All",
      //   "travel_type_name": this.travelListName(),
      //   "emp_id": !this.ws.isEmpty(this.model.employee.value) ? this.model.employee.value['name'] : "All",
      //   "section": !this.ws.isEmpty(sect) ? sect : "All",
      //   "department": !this.ws.isEmpty(depr) ? depr : "All",
      //   "function": !this.ws.isEmpty(func) ? func : "All",
      //   // "travel_type": !this.ws.isEmpty(this.model.request_type.value['val']) ? this.model.request_type.value['val'] : "All",
      //   "travel_type": !this.ws.isEmpty(this.travelListValText()) ? this.travelListValText() : "All",
      // }

      let body = {
        "token_login": localStorage["token"],
        "year" : year
      }

      let jsondata = this.model.dataSource;


      const onSuccess = (data : any) => {
        console.log('***Call Asmx***');
        // console.log(data);
        // console.log(data.d);

        var parsed = $.parseJSON(data.d);
        console.log(parsed);
        console.log(parsed.dtResult);

        if (parsed.dtResult[0].status === 'true') {
          console.log(parsed.dtResult[0].file_system_path);
          console.log(parsed.dtResult[0].file_outbound_path);
          console.log(parsed.dtResult[0].file_outbound_name);

          //เอาไว้ทดลองว่า gen file ได้มั้ยโดยการลอง save as
          this.ws.downloadFile(parsed.dtResult[0].file_outbound_path, parsed.dtResult[0].file_outbound_name);
          //this.ws.downloadFile(parsed.dtResult[0].file_system_path, parsed.dtResult[0].file_outbound_name);
          this.appMain.isLoading = false;
        }
        else {
          this.appMain.isLoading = false;
          this.alerts.swal_error(parsed.dtResult[0].status);
        }
      }

      //data, function name(ฝั่ง asmx), method name
      this.ws.excel_report(body, JSON.stringify(jsondata), 'reportISOSRecord', 'reportISOSRecord').subscribe(data => onSuccess(data), error => {
        this.appMain.isLoading = false
        this.alerts.swal_error(error);
        console.log(error);
        alert('Can\'t call web api.' + ' : ' + error.message);
      });
    }
    else {
      this.alerts.swal_warning('No data.');
    }
  }

}
