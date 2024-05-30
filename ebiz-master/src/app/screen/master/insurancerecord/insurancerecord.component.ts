import { Component, forwardRef, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MasterService } from '../../../http/master/master.service';
import { AspxserviceService } from '../../../ws/httpx/aspxservice.service';
import { AlertServiceService } from '../../../services/AlertService/alert-service.service';
import { HeaderComponent } from '../../../components/header/header.component';
import { MasterComponent } from '../master.component';

declare var $: any;
@Component({
  selector: 'app-insurancerecord',
  templateUrl: './insurancerecord.component.html',
  styleUrls: ['./insurancerecord.component.css']
})
export class InsurancerecordComponent implements OnInit {

  model : any = {
    yearArr: [],
    year: [
      {
        errors: ''
      }
    ],
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
    const years : any = this.getYears().years;
    this.model.yearArr = years;
  }

  ngOnInit() {
    //this.appMain.isLoading = true;
    console.log('*****Insurance Record Oninit*****');

    const year = this.getCurrentYear();
    this.search(year);
    var contentX : any = document.getElementById("contentX");
    contentX.classList.remove("d-none");

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
    const from : any = this.getCurrentYear();
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

  get f() { return this.registerForm?.controls; }


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
    if (this.registerForm?.invalid) {
      return;
    }
    //this.search();
  }

  checkValueNull(val : any) {
    return val === null || val === "" || val === undefined ? true : false;
  }

  checkNumber(val : any){
    if(val != ''){
      return Number(val);
    }
    else{
      return null;
    }
  }

  search(year : any) {

    this.appMain.isLoading = true;

    //this.model.year = year;
    let bodyX = {
      "token_login": localStorage["token"],
      "year": year,
    }

    const onSuccess = (data : any) => {

      console.log('---Search insurance record data---');
      console.log(data);

      this.model.dataSource = [];
      this.model.dataSource = data.details_list;

      this.appMain.isLoading = false;
    }

    this.ws.callWs(bodyX, 'ReportInsuranceRecord').subscribe(data => onSuccess(data), error => {
      this.appMain.isLoading = false;
      this.alerts.swal_error(error);
      console.log(error);
      alert('Can\'t call web api.' + ' : ' + error.message);
    })
  }

  exportExcel(year : any) {
    if (this.model.dataSource.length > 0) {
      this.appMain.isLoading = true;

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
      this.ws.excel_report(body, JSON.stringify(jsondata), 'reportInsuranceRecord', 'reportInsuranceRecord').subscribe(data => onSuccess(data), error => {
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
