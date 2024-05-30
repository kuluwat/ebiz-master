import { Component, forwardRef, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MasterService } from '../../../http/master/master.service';
import { AspxserviceService } from '../../../ws/httpx/aspxservice.service';
import { AlertServiceService } from '../../../services/AlertService/alert-service.service';
import { HeaderComponent } from '../../../components/header/header.component';
import { MasterComponent } from '../master.component';

declare var $: any;

@Component({
  selector: 'app-travelrecord',
  templateUrl: './travelrecord.component.html',
  styleUrls: ['./travelrecord.component.css']
})
export class TravelrecordComponent implements OnInit {


  panel : any= {
    country: false,
    province: false
  }

  model : any = {
    request_type: {
      value: [],
      config: {
        displayKey: 'name', // if objects array passed which key to be displayed defaults to description
        search: true,
        limitTo: 1000,
        clearOnSelection: true,
        customComparator: (function (a : any, b : any) {
          if (a.sort_by < b.sort_by) { return -1; }
          if (a.sort_by > b.sort_by) { return 1; }
          return 0;
        })
        // placeholder: 'Select'
      },
      list: [
      ],
      select: [],
      settingMulti: {
        enableCheckAll: false,
        singleSelection: false,
        idField: 'val',
        textField: 'name',
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        itemsShowLimit: 100,
        allowSearchFilter: true,
        closeDropDownOnSelection: true
      }
      // list: [
      //   {
      //     '_id': '5a66d6c31d5e4e36c7711b7a',
      //     'val': 'oversea',
      //     'name': 'Oversea'
      //   }, {
      //     '_id': '5a66d6c31d5e4e36c7711b7a',
      //     'val': 'local',
      //     'name': 'Local'
      //   }
      // ]
    },
    country: {
      value: [],
      config: {
        displayKey: 'name', // if objects array passed which key to be displayed defaults to description
        search: true,
        limitTo: 1000,
        height: "300px",
        placeholder: 'Select',
        clearOnSelection: true,
        customComparator: (function (a : any, b : any) {
          if (a.name < b.name) { return -1; }
          if (a.name > b.name) { return 1; }
          return 0;
        })
      },
      list: [],
      disabled: false,
    },
    province: {
      value: [],
      config: {
        displayKey: 'name', // if objects array passed which key to be displayed defaults to description
        search: true,
        limitTo: 1000,
        height: "300px",
        placeholder: 'Select',
        clearOnSelection: true,
        // customComparator: (function (a, b) {
        //   if (a.name < b.name) { return -1; }
        //   if (a.name > b.name) { return 1; }
        //   return 0;
        // })
      },
      list: [],
      disabled: false,
    },
    employee: {
      value: [],
      config: {
        displayKey: 'name', // if objects array passed which key to be displayed defaults to description
        search: true,
        limitTo: 1000,
        height: "300px",
        placeholder: 'Select',
        clearOnSelection: true,
        customComparator: (function (a : any, b : any) {
          if (a.firstname < b.firstname) { return -1; }
          if (a.firstname > b.firstname) { return 1; }
          return 0;
        })
      },
      list: [{}],
      disabled: false
    },
    section: {
      value: [],
      config: {
        displayKey: 'name', // if objects array passed which key to be displayed defaults to description
        search: true,
        limitTo: 1000,
        height: "300px",
        placeholder: 'Select',
        clearOnSelection: true,
        customComparator: (function (a : any, b : any) {
          if (a.name < b.name) { return -1; }
          if (a.name > b.name) { return 1; }
          return 0;
        })
      },
      list: [],
      disabled: false,
      master: []
    },
    department: {
      value: [],
      config: {
        displayKey: 'val', // if objects array passed which key to be displayed defaults to description
        search: true,
        limitTo: 1000,
        height: "300px",
        placeholder: 'Select',
        clearOnSelection: true,
        customComparator: (function (a : any, b : any) {
          if (a.name < b.name) { return -1; }
          if (a.name > b.name) { return 1; }
          return 0;
        })
      },
      list: [],
      disabled: false,
      master: []
    },
    function: {
      value: [],
      config: {
        displayKey: 'name', // if objects array passed which key to be displayed defaults to description
        search: true,
        limitTo: 1000,
        height: "300px",
        placeholder: 'Select',
        clearOnSelection: true,
        customComparator: (function (a : any, b : any) {
          if (a.name < b.name) { return -1; }
          if (a.name > b.name) { return 1; }
          return 0;
        })
      },
      list: [],
      disabled: false,
      master: []
    },
    business_date_from: new Date(),
    business_date_to: new Date(),
    min_business_date_from: new Date(),
    max_business_date_to: new Date(),
    keyword: "",
    dataSource: []
  }

  registerForm!: FormGroup;
  submitted = false;

  state: String = "";


  constructor(
    @Inject(forwardRef(() => MasterComponent)) private appMain: MasterComponent,
    // @Inject(forwardRef(() => HeaderComponent)) private appHeader: HeaderComponent,
    public ws: AspxserviceService,
    private alerts: AlertServiceService,
    private masterHttp: MasterService,
    private formBuilder: FormBuilder
  ) {
    console.log('>>>>>>>>>>>> default date <<<<<<<<<<')
    //console.log(new Date().getDate() - 365)
    const date_fromX = new Date();
    date_fromX.setDate(date_fromX.getDate() - 365);
    const date_toX = new Date();

    console.log(date_fromX);
    console.log(date_toX);
    // this.model.business_date_from = date_fromX;
    // this.model.business_date_to = date_toX;

    this.checkDate365('date_from');
    //this.checkDate365('date_to');
  }

  ngOnInit() {
    this.appMain.isLoading = true;
    console.log('*****Travel Record Oninit*****');
    //this.appMain.userSelected = "zattaphonso";
    this.didSetDefault(this.state);
    this.loadMaster();
    //this.didFetchProvince();
    //this.didFetchCountry();
    //this.didFetchEmployee();

    this.registerForm = this.formBuilder.group({
      // request_type: ['', [Validators.required]],
      request_type: ['', [Validators.required]],
      country: [''],
      province: [''],
      date_from: ['', [Validators.required]],
      date_to: ['', [Validators.required]],
      employee: [''],
      section: [''],
      department: [''],
      function: [''],
      // email: ['', [Validators.required, Validators.email]],
      // password: ['', [Validators.required, Validators.minLength(6)]]
    });

  }

  get f() { return this.registerForm?.controls; }

  CountryChange(event : any) {

  }

  loadMaster() {

    this.appMain.isLoading = true;
    let bodyX = {
      "token_login": localStorage["token"],
    }
    const onSuccess = (data : any) => {
      console.log("*****Load master travel record*****");
      console.log(data);

      // Master country
      this.model.country.list = [];
      data.m_country.forEach((current : any) => {
        this.model.country.list.push({
          '_id': current.id,
          'val': current.id,
          'name': current.name
        })
      });
      //console.log(this.model.country.list);

      //Master Province
      this.model.province.list = [];
      data.m_province.forEach((current : any) => {
        this.model.province.list.push({
          '_id': current.id,
          'val': current.id,
          'name': current.name
        })
      });

      //Master Travel type
      this.model.request_type.list = [];
      data.m_traveltype.forEach((current : any) => {
        this.model.request_type.list.push({
          '_id': current.id,
          'val': current.id,
          'name': current.name
        })
      });
      // this.model.request_type.value = this.model.request_type.list[0];

      this.model.request_type.select = [];
      //this.model.request_type.list.forEach(dr => {
      for (var dr = 0; dr < 1; dr++) {
        this.model.request_type.select.push({
          'val': data.m_traveltype[0].id,
          'name': data.m_traveltype[0].name
        })
      }
      //})

      // Master Employee
      this.model.employee.list = [];
      // data.emp_list.forEach(current => {
      //   this.model.employee.list.push({
      //     '_id': current.emp_id,
      //     'val': current.emp_id,
      //     'name': current.displayname
      //   });

      // });

      //Master Section
      let section = [];
      let department = [];
      let functions = [];
      this.model.section.list = [];
      let result;
      const loopData = (_: any) => {

        for (const i in data.emp_list) {

          this.model.employee.list.push({
            '_id': data.emp_list[i].emp_id,
            'val': data.emp_list[i].emp_id,
            'name': data.emp_list[i].displayname,
            'sections': data.emp_list[i].sections,
            'department': data.emp_list[i].department,
            'function': data.emp_list[i].function,
            'email': data.emp_list[i].email,
            'firstname': data.emp_list[i].firstname,
            'lastname': data.emp_list[i].lastname,
          });
        }

        for (const i in data.m_section) {

          if (!this.ws.isEmpty(data.m_section[i].section)) {
            result = section.filter(val => val.name.toLowerCase().indexOf(data.m_section[i].section.toLowerCase()) > -1);
            if (result.length === 0) {
              section.push({
                '_id': data.m_section[i].section,
                'val': data.m_section[i].section,
                'name': data.m_section[i].section,
                'department': data.m_section[i].department,
                'function': data.m_section[i].function
              });
            }
          }
          if (!this.ws.isEmpty(data.m_section[i].department)) {
            result = department.filter(val => val.name.toLowerCase().indexOf(data.m_section[i].department.toLowerCase()) > -1);
            if (result.length === 0) {
              department.push({
                '_id': data.m_section[i].department,
                'val': data.m_section[i].department,
                'name': data.m_section[i].department,
                'function': data.m_section[i].function
              });
            }
          }
          if (!this.ws.isEmpty(data.m_section[i].function)) {
            result = functions.filter(val => val.name.toLowerCase().indexOf(data.m_section[i].function.toLowerCase()) > -1);
            if (result.length === 0) {
              functions.push({
                '_id': data.m_section[i].function,
                'val': data.m_section[i].function,
                'name': data.m_section[i].function
              });
            }
          }
        }

        this.model.section.list  = [];
        this.model.section.master = [];
        section.sort(function (a, b) {
          if (a.name < b.name) { return -1; }
          if (a.name > b.name) { return 1; }
          return 0;
        });
        // this.model.section.list = section;
        // this.model.section.master = section;
        //console.log(department);
        this.model.department.list = [];
        this.model.department.master = [];
        department.sort(function (a, b) {
          if (a.name < b.name) { return -1; }
          if (a.name > b.name) { return 1; }
          return 0;
        });
        // this.model.department.list = department;
        // this.model.department.master = department;

        this.model.function.list = [];
        this.model.function.master = [];
        functions.sort(function (a, b) {
          if (a.name < b.name) { return -1; }
          if (a.name > b.name) { return 1; }
          return 0;
        });
        // this.model.function.list = functions;
        // this.model.function.master = functions;
        return this.model;
      }

      const loopSucess = loopData('');
      console.log('***Loop data sucess***');
      console.log(loopSucess);

      setTimeout(() => {

        // ถ้าไม่ใช่ admin จะดูได้เฉพาะ Report ของตัวเอง
        if (data.user_admin === false) {

          let empId = "";

          const onSuccess = (dao: string | any[]) => {
            // console.log(dao);
            // console.log("---Load Profile sucess---")
            if (dao.length === 0) {

              this.alerts.swal_error('Error get user profile in travel record.');
            }
            else {

              const profile = (_: string) => {


                empId = dao[0]["empId"];

                console.log("*****NO ADMIN*****");
                //console.log(this.appHeader.profile.emp_id);
                const empLogin = loopSucess.employee.list.filter((val : any) => val._id === empId);
                /* fix it */
                // this.model.employee.value = empLogin.length > 0 ? empLogin : [];

                // this.model.employee.value = empLogin;
                //console.log(empLogin[0]['sections']);

                /* fix it */
                // if (empLogin.length > 0) {
                //   const selectedData = this.model.section.list.filter((val : any) => val._id === empLogin[0]['sections']);
                //   this.model.section.value = selectedData.length > 0 ? selectedData : [];

                //   // select ddl department
                //   const selectedDepartment = this.model.department.list.filter(val => val._id === empLogin[0]['department']);
                //   this.model.department.value = selectedDepartment.length > 0 ? selectedDepartment : [];

                //   // select ddl function
                //   const selectedFunction = this.model.function.list.filter(val => val._id === empLogin[0]['function']);
                //   this.model.function.value = selectedFunction.length > 0 ? selectedFunction : [];

                //   this.model.employee.disabled = true;
                //   this.model.section.disabled = true;
                //   this.model.department.disabled = true;
                //   this.model.function.disabled = true;
                // }
                // else {
                //   this.model.employee.disabled = true;
                //   this.model.section.disabled = true;
                //   this.model.department.disabled = true;
                //   this.model.function.disabled = true;
                // }
              }

              const profileData = profile('');


            }
          }
          this.ws.onFetchUserProfile().subscribe(dao => onSuccess(dao), error => alert("loginProfile Error : " + error));


        }


        var contentX = document.getElementById("contentX");
        contentX?.classList.remove("d-none");

        this.appMain.isLoading = false;
      }, 0);

      // data.m_section.forEach(current => {
      //   if (!this.ws.isEmpty(current.section)) {
      //     result = section.filter(val => val.name.toLowerCase().indexOf(current.section.toLowerCase()) > -1);
      //     section.push({
      //       '_id': current.section,
      //       'val': current.section,
      //       'name': current.section,
      //       'department': current.department
      //     });
      //   }
      //   //debugger;
      //   if (!this.ws.isEmpty(current.department)) {
      //     result = department.filter(val => val.name.toLowerCase().indexOf(current.department.toLowerCase()) > -1);
      //     if (result.length === 0) {
      //       department.push({
      //         '_id': current.department,
      //         'val': current.department,
      //         'name': current.department,
      //         'function': current.function
      //       });
      //     }
      //   }
      //   if (!this.ws.isEmpty(current.function)) {
      //     result = functions.filter(val => val.name.toLowerCase().indexOf(current.function.toLowerCase()) > -1);
      //     if (result.length === 0) {
      //       functions.push({
      //         '_id': current.function,
      //         'val': current.function,
      //         'name': current.function
      //       });
      //     }
      //   }

      // });

      // section.sort(function (a, b) {
      //   if (a.name < b.name) { return -1; }
      //   if (a.name > b.name) { return 1; }
      //   return 0;
      // });
      // this.model.section.list = section;

      // //console.log(department);
      // this.model.department.list = [];
      // department.sort(function (a, b) {
      //   if (a.name < b.name) { return -1; }
      //   if (a.name > b.name) { return 1; }
      //   return 0;
      // });
      // this.model.department.list = department;


      // this.model.function.list = [];
      // functions.sort(function (a, b) {
      //   if (a.name < b.name) { return -1; }
      //   if (a.name > b.name) { return 1; }
      //   return 0;
      // });
      // this.model.function.list = functions;




      // var a = ['a', 1, 'a', 2, '1'];
      // unique = a.filter(this.onlyUnique);

      // console.log(unique);
    }
    this.ws.callWs(bodyX, 'LoadMasterTravelRecord').subscribe(data => onSuccess(data), error => {
      this.appMain.isLoading = false
      console.log(error);
      alert('Can\'t call web api.' + ' : ' + error.message);
    })
  }

  changeProvince(event: { value: any; }) {
    try {
      if (!this.ws.isEmpty(event.value)) {

      }
      else {
        this.model.province.value = [];
      }
    }
    catch (ex) {

    }
  }

  changeCountry(event: { value: any; }) {
    try {
      if (!this.ws.isEmpty(event.value)) {

      }
      else {
        this.model.country.value = [];
      }
    }
    catch (ex) {

    }
  }

  changeEmployee(event: { value: { sections: string; department: string; function: string; }; }) {
    //debugger;
    console.log('changeEmployee');
    console.log(event);
    //debugger;

    try {
      if (!this.ws.isEmpty(event.value)) {
        if (!this.ws.isEmpty(event.value.sections)) {
          const selectedData = this.model.section.list.filter((val : any) => val._id.toLowerCase().includes(event.value.sections.toLowerCase()));

          // selectedData.forEach(element => {
          //   this.model.section.value.push({
          //     '_id': element._id,
          //     'val': element.val,
          //     'name': element.name,
          //     'department': element.department,
          //     'function': element.function
          //   })
          // });
          // console.log(selectedData)
          this.model.section.value = selectedData;
        }
        else {
          this.model.section.value = [];
        }

        // select ddl department
        const selectedDepartment = this.model.department.list.filter((val : any) => val._id.toLowerCase().includes(event.value.department.toLowerCase()));
        this.model.department.value = selectedDepartment;

        // select ddl function
        const selectedFunction = this.model.function.list.filter((val : any) => val._id.toLowerCase().includes(event.value.function.toLowerCase()));
        this.model.function.value = selectedFunction;
      }
      else {

        this.model.employee.value = [];
        // clear value ddl section
        this.model.section.value = [];
        // clear value ddl department
        this.model.department.value = [];
        // clear value ddl function
        this.model.function.value = [];

        //this.changeSection(event);
      }
    }
    catch (ex) {

    }
  }

  changeSection(event: { value: { department: string; }; }) {
    //debugger;
    console.log('changeSection');
    console.log(event);
    try {
      if (!this.ws.isEmpty(event.value)) {
        const selectedData = this.model.department.list.filter((val : any) => val._id.toLowerCase().includes(event.value.department.toLowerCase()));
        this.model.department.value = selectedData;

        // clear ddl employee
        this.model.employee.value = [];
        // select ddl department
        // this.changeDepartment(event, 'section');
      }
      else {
        // clear value ddl section
        this.model.section.value = [];
        // clear value ddl department
        this.model.department.value = [];
        // clear value ddl function
        this.model.function.value = [];
      }
    }
    catch (ex) {

    }
  }

  changeDepartment(event: { value: { function: string; }; }, action: string) {
    console.log('changeDepartment');
    console.log(event);
    try {
      if (!this.ws.isEmpty(event.value)) {
        const selectedData = this.model.function.list.filter((val : any) => val._id.toLowerCase().includes(event.value.function.toLowerCase()));
        this.model.function.value = selectedData;

        if (action === 'department') {
          this.model.employee.value = [];
          // clear value ddl section
          this.model.section.value = [];
        }
      }
      else {
        // clear value ddl section
        this.model.section.value = [];
        // clear value ddl department
        this.model.department.value = [];

      }
    }
    catch (ex) {

    }
  }

  changeFunction(event: { value: any; }, action: string) {
    console.log('changeFunction');
    console.log(event);
    try {
      if (!this.ws.isEmpty(event.value)) {
        if (action === 'function') {
          this.model.employee.value = [];
          // clear value ddl section
          this.model.section.value = [];
          // clear value ddl department
          this.model.department.value = [];
        }
      }
      else {
        // clear value ddl section
        this.model.section.value = [];
        // clear value ddl department
        this.model.department.value = [];
        // clear value ddl function
        this.model.function.value = [];
      }
    }
    catch (ex) {

    }
  }

  changeDate(type: string) {

    debugger;
    if (!this.checkValueNull(this.model.business_date_from) && !this.checkValueNull(this.model.business_date_to)) {
      

      const date1 = new Date(this.model.business_date_from);
      const date2 = new Date(this.model.business_date_to);
      const diffTime = Math.abs(date2.setHours(0,0,0,0).valueOf() - date1.setHours(0,0,0,0).valueOf());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      console.log(diffTime + " milliseconds");
      console.log(diffDays + " days");
      

      if (diffDays > 365) {
        
        if (type === 'date_from') { this.model.business_date_from == null; }
        else if (type === 'date_to') { this.model.business_date_to == null; }

        this.alerts.swal_warning('Can view data maximum 1 year.');
      }
    }
    // else if (this.checkValueNull(this.model.business_date_from) && !this.checkValueNull(this.model.business_date_to)) {

    //   //alert('x')
    // }
    this.checkDate365('date_from');
    //this.checkDate365('date_to');
  }

  checkDate365(type: string) {
    //let dateX = null;
    this.model.min_business_date_from == null;
    this.model.max_business_date_to == null;
    debugger;
    if (!this.checkValueNull(this.model.business_date_from) && !this.checkValueNull(this.model.business_date_to)) {
      const date1 = new Date(this.model.business_date_from);
      const date2 = new Date(this.model.business_date_to);
      const diffTime = Math.abs(date2.valueOf() - date1.valueOf());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      const date_from = date2;
      date_from.setDate(date_from.getDate() - 365);
      this.model.min_business_date_from = date_from;

      const date_fromX = date1;
      date_fromX.setDate(date_fromX.getDate() + 365);
      this.model.max_business_date_to = date_fromX;

    }
    else if (this.checkValueNull(this.model.business_date_from) && !this.checkValueNull(this.model.business_date_to)) {
      const date1 = new Date(this.model.business_date_from);
      const date2 = new Date(this.model.business_date_to);

      const date_from = date2;
      date_from.setDate(date_from.getDate() - 365);
      this.model.min_business_date_from = date_from;
    }
    else if (!this.checkValueNull(this.model.business_date_from) && this.checkValueNull(this.model.business_date_to)) {
      const date1 = new Date(this.model.business_date_from);
      const date2 = new Date(this.model.business_date_to);

      const date_fromX = date1;
      date_fromX.setDate(date_fromX.getDate() + 365);
      this.model.max_business_date_to = date_fromX;

    }
    else {
      this.model.min_business_date_from == null;
      this.model.max_business_date_to == null;
    }
    //return dateX;
  }

  clearValue(type: string) {
    if (type === 'date_from') { this.model.business_date_from == null; }
    else if (type === 'date_to') { this.model.business_date_to == null; }

    this.checkDate365('date_from');
    //this.checkDate365('date_to');
  }

  keyDown(event: { keyCode: number; preventDefault: () => void; }) {
    if (event.keyCode == 8 || event.keyCode == 46) {
      //alert('xxx')
      event.preventDefault();
    }
    //this.checkDate365('date_from');
    //alert('x');
  }

  hanleChangeRequestType(event: { value: { val: any; } | null | undefined; }) {
    //debugger;
    let request_type = event.value === undefined || event.value === null ? "" : event.value.val;
    //console.log(event.value.val);
    console.log(request_type);
    var control = document.getElementById('ddlRequestType')?.children[0].children[0];
    if (request_type != "") {
      control?.classList.remove('border-red');
    }
    // if (this.submitted && this.f.request_type.errors) {
    //   control.classList.add('border-red');
    // }
    this.didSetDefault(request_type);
  }
  // set default 
  didSetDefault(state: String) {
    if (state === "lb" || state === "lt") {
      // Local
      this.panel.province = true;
      this.panel.country = false;

    } else {
      // Oversea
      this.panel.province = false;
      this.panel.country = true;
    }
    this.model.country.value = [];
    this.model.province.value = [];
  }

  didFetchCountry() {
    const onSuccess = (dao: any[]) => {
      this.model.country.list = [];
      dao.forEach((current: { [x: string]: any; }) => {
        this.model.country.list.push({
          '_id': current["country_id"],
          'val': current["country_id"],
          'name': current["country"]
        })
      });
    }

    this.masterHttp.onFetchCountry("").subscribe(dao => onSuccess(dao))
  }

  didFetchProvince() {
    const onSuccess = (dao: any[]) => {
      this.model.province.list = [];
      dao.forEach((current: { [x: string]: any; }) => {
        this.model.province.list.push({
          '_id': current["id"],
          'val': current["id"],
          'name': current["province"]
        })
      });
      console.log(this.model.province.list)
    }

    this.masterHttp.onFetchProvince().subscribe(dao => onSuccess(dao))
  }

  handleSelectedContinentToLoadMasterCountry() {
    console.log(this.model.request_type.select);
    if (this.model.request_type.select.length > 1) {
      this.model.country.disabled = true;
      this.model.province.disabled = true;
      this.model.country.value = [];
      this.model.province.value = [];
    }
    else {
      this.model.country.disabled = false;
      this.model.province.disabled = false;
    }
    if (this.model.request_type.select.length === 1) {
      // this.didSetDefault(this.model.request_type.select[0].val);
    }
  }

  didFetchEmployee() {

    var bodyX = {

      "token_login": localStorage["token"],
      "filter_value": ''

    }

    const onSuccess = (data: { emp_list: any[]; }) => {
      console.log('***ditFetchEmployee***');

      //console.log(data);
      this.model.employee.list = [];
      data.emp_list.forEach((current: { [x: string]: any; }) => {
        this.model.employee.list.push({
          '_id': current["username"],
          'val': current["username"],
          'name': current["displayname"]
        })
      })
      console.log(this.model.province.list)


      this.appMain.isLoading = false;

    }

    //data, function name(ฝั่ง asmx), method name
    this.ws.callWs(bodyX, 'LoadEmployeeList').subscribe(data => onSuccess(data), error => {
      this.appMain.isLoading = false
      console.log(error);
      this.alerts.swal_error(error);
    })
  }

  onSubmit() {
    //debugger;
    console.log(this.registerForm);
    this.submitted = true;

    // if (this.registerForm.controls.request_type.invalid) {
    //   // var control = document.getElementById('ddlRequestType').children[0].children[0];
    //   var control = document.getElementById('ddlRequestType').children[0].children[0];
    //   control.classList.add('border-red');
    // }
    // stop here if form is invalid
    if (this.registerForm?.invalid) {
      return;
    }
    this.search();
  }

  checkValueNull(val: any) {
    return val === null || val === "" || val === undefined ? true : false;
  }

  search() {

    this.appMain.isLoading = true;
    console.log('*****Search Travel Record*****');
    console.log(this.model);
    //debugger;
    let date_from = !this.checkValueNull(this.model.business_date_from) ? new Date(this.model.business_date_from) : "";
    let date_to = !this.checkValueNull(this.model.business_date_to) ? new Date(this.model.business_date_to) : "";
    let country = "";

    // let countryVal = !this.checkValueNull(this.model.country.value['val']) || this.model.country.value.length > 0 ? !this.checkValueNull(this.model.country.value['val']) ? this.model.country.value['val'] : !this.checkValueNull(this.model.country.value[0]['val']) ? this.model.country.value[0]['val'] : "" : "";
    // let provinceVal = !this.checkValueNull(this.model.province.value['val']) || this.model.province.value.length > 0 ? !this.checkValueNull(this.model.province.value['val']) ? this.model.province.value['val'] : !this.checkValueNull(this.model.province.value[0]['val']) ? this.model.province.value[0]['val'] : "" : "";

    // if (!this.checkValueNull(this.model.request_type.value['val'])) {
    //   if (this.model.request_type.value['val'] === "ob" || this.model.request_type.value['val'] === "ot") {
    //     if (!this.checkValueNull(countryVal)) { country = this.model.country.value['val']; }
    //     else { country = "" }
    //   }
    //   else {
    //     if (!this.checkValueNull(provinceVal)) { country = this.model.province.value['val']; }
    //     else { country = "" }
    //   }
    // }
    // else {
    //   //this.model.request_type.value['val']
    // }

    if (this.model.request_type.select.length === 1) {
      // if (this.model.request_type.select[0].val === "ob" || this.model.request_type.select[0].val === "ot") {
      //   if (!this.checkValueNull(countryVal)) { country = this.model.country.value['val']; }
      //   else { country = "" }
      // }
      // else {
      //   if (!this.checkValueNull(provinceVal)) { country = this.model.province.value['val']; }
      //   else { country = "" }
      // }
    }
    else {
      country = "";
    }

    debugger;
    // let reqt = !this.checkValueNull(this.model.request_type.value['val']) ? this.model.request_type.value['val'] : "";
    // let empId = !this.checkValueNull(this.model.employee.value['val']) || this.model.employee.value.length > 0 ? !this.checkValueNull(this.model.employee.value['val']) ? this.model.employee.value['val'] : !this.checkValueNull(this.model.employee.value[0]['val']) ? this.model.employee.value[0]['val'] : "" : "";
    //!this.checkValueNull(this.model.employee.value['val']) ? this.model.employee.value['val'] : "";
    // let sect = !this.checkValueNull(this.model.section.value['val']) || this.model.section.value.length > 0 ? !this.checkValueNull(this.model.section.value['val']) ? this.model.section.value['val'] : !this.checkValueNull(this.model.section.value[0]['val']) ? this.model.section.value[0]['val'] : "" : "";
    // let depr = !this.checkValueNull(this.model.department.value['val']) || this.model.department.value.length > 0 ? !this.checkValueNull(this.model.department.value['val']) ? this.model.department.value['val'] : !this.checkValueNull(this.model.department.value[0]['val']) ? this.model.department.value[0]['val'] : "" : "";
    // let func = !this.checkValueNull(this.model.function.value['val']) || this.model.function.value.length > 0 ? !this.checkValueNull(this.model.function.value['val']) ? this.model.function.value['val'] : !this.checkValueNull(this.model.function.value[0]['val']) ? this.model.function.value[0]['val'] : "" : "";

    // let body = {
    //   "token_login": localStorage["token"],
    //   "doc_id": "",
    //   "country": country,//
    //   "date_from": this.ws.formatDate(date_from),
    //   "date_to": this.ws.formatDate(date_to),
    //   "travel_type": reqt,
    //   "emp_id": empId,
    //   "section": sect,
    //   "department": depr,
    //   "function": func,
    //   "travel_list": this.travelList(),
    // }
    // console.log(body);

    const onSuccess = (data: { travelrecord: never[]; }) => {

      console.log('---Search travel record data---');
      console.log(data);

      this.model.dataSource = [];
      this.model.dataSource = data.travelrecord;

      this.appMain.isLoading = false;
    }

    // this.ws.callWs(body, 'LoadTravelRecord').subscribe(data => onSuccess(data), error => {
    //   this.appMain.isLoading = false;
    //   this.alerts.swal_error(error);
    //   console.log(error);
    //   alert('Can\'t call web api.' + ' : ' + error.message);
    // })
  }

  travelList() {
    let travel_list: { id: any; }[] = [];
    this.model.request_type.select.forEach((dr : any) => {
      travel_list.push({
        "id": dr.val
      })
    });
    return travel_list;
  }
  travelListName() {
    let travel_list = "";
    if (this.model.request_type.select.length < 4) {
      this.model.request_type.select.forEach((dr : any) => {
        travel_list = travel_list === "" ? dr.name : travel_list + ", " + dr.name;
      });
    } else {
      travel_list = "All";
    }
    return travel_list;
  }

  travelListValText() {
    let travel_list = "";
    if (this.model.request_type.select.length < 4) {
      this.model.request_type.select.forEach((dr : any) => {
        travel_list = travel_list === "" ? dr.val : travel_list + "," + dr.val;
      });
    } else {
      travel_list = "All";
    }
    return travel_list;
  }


  isFilter() {
    //if(!this.ws.isEmpty(this.model.request_type.value) || !this.ws.isEmpty(this.model.request_type.value))
  }

  exportExcel() {
    if (this.model.dataSource.length > 0) {
      this.appMain.isLoading = true;

      let date_from = !this.checkValueNull(this.model.business_date_from) ? new Date(this.model.business_date_from) : "";
      let date_to = !this.checkValueNull(this.model.business_date_to) ? new Date(this.model.business_date_to) : "";
      let country = "";

      // let countryVal = !this.checkValueNull(this.model.country.value['name']) || this.model.country.value.length > 0 ? !this.checkValueNull(this.model.country.value['name']) ? this.model.country.value['name'] : !this.checkValueNull(this.model.country.value[0]['name']) ? this.model.country.value[0]['name'] : "" : "";
      // let provinceVal = !this.checkValueNull(this.model.province.value['name']) || this.model.province.value.length > 0 ? !this.checkValueNull(this.model.province.value['name']) ? this.model.province.value['name'] : !this.checkValueNull(this.model.province.value[0]['name']) ? this.model.province.value[0]['name'] : "" : "";

      // if (!this.checkValueNull(this.model.request_type.value['val'])) {
      //   if (this.model.request_type.value['val'] === "ob" || this.model.request_type.value['val'] === "ot") {
      //     if (!this.checkValueNull(countryVal)) { country = this.model.country.value['name']; }
      //     else { country = "All" }
      //   }
      //   else {
      //     if (!this.checkValueNull(provinceVal)) { country = this.model.province.value['name']; }
      //     else { country = "All" }
      //   }
      // }
      // else {
      //   //this.model.request_type.value['val']
      // }
      if (this.model.request_type.select.length === 1) {
        // if (this.model.request_type.select[0].val === "ob" || this.model.request_type.select[0].val === "ot") {
        //   if (!this.checkValueNull(countryVal)) { country = this.model.country.value['name']; }
        //   else { country = " - " }
        // }
        // else {
        //   // if (!this.checkValueNull(provinceVal)) { country = this.model.province.value['name']; }
        //   // else { country = " - " }
        //   if (!this.checkValueNull(provinceVal)) { country = "Thailand"; }
        //   else { country = "Thailand" }
        // }
      }
      // else if(this.model.request_type.select.length > 1){
      //   this.model.request_type.select.forEach(dr =>{
      //     country = country === "" ? dr.name : ", " +  dr.name;
      //   })
      // }
      else {
        country = " - ";
      }
      //debugger;
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
      // let body = {
      //   "token_login": localStorage["token"],
      //   "doc_id": "",
      //   "country": country,//
      //   "date_from": this.ws.formatDate(date_from),
      //   "date_to": this.ws.formatDate(date_to),
      //   "travel_type": reqt,
      //   "emp_id": empId,
      //   "section": sect,
      //   "department": depr,
      //   "function": func,
      //   "travel_list": this.travelList(),
      // }
      

      let jsondata = this.model.dataSource;

      // this.model.dataSource.forEach(current => {
      //   this.model.request_type.list.push({
      //     '_id': current.id,
      //     'val': current.id,
      //     'name': current.name
      //   })
      // });

      const onSuccess = (data: { d: any; }) => {
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

      //data, function name(ฝั่ง asmx), method name JSON.stringify(jsondata)
      // this.ws.excel_report(body, JSON.stringify(this.getParamForExport()), 'TravelRecordX', 'TravelRecordX').subscribe(data => onSuccess(data), error => {
      //   this.appMain.isLoading = false
      //   this.alerts.swal_error(error);
      //   console.log(error);
      //   alert('Can\'t call web api.' + ' : ' + error.message);
      // });
    }
    else {
      this.alerts.swal_warning('No data.');
    }
  }

  getParamForExport(){
    let date_from = !this.checkValueNull(this.model.business_date_from) ? new Date(this.model.business_date_from) : "";
    let date_to = !this.checkValueNull(this.model.business_date_to) ? new Date(this.model.business_date_to) : "";
    let country = "";

    // let countryVal = !this.checkValueNull(this.model.country.value['val']) || this.model.country.value.length > 0 ? !this.checkValueNull(this.model.country.value['val']) ? this.model.country.value['val'] : !this.checkValueNull(this.model.country.value[0]['val']) ? this.model.country.value[0]['val'] : "" : "";
    // let provinceVal = !this.checkValueNull(this.model.province.value['val']) || this.model.province.value.length > 0 ? !this.checkValueNull(this.model.province.value['val']) ? this.model.province.value['val'] : !this.checkValueNull(this.model.province.value[0]['val']) ? this.model.province.value[0]['val'] : "" : "";

    if (this.model.request_type.select.length === 1) {
      // if (this.model.request_type.select[0].val === "ob" || this.model.request_type.select[0].val === "ot") {
      //   if (!this.checkValueNull(countryVal)) { country = this.model.country.value['val']; }
      //   else { country = "" }
      // }
      // else {
      //   if (!this.checkValueNull(provinceVal)) { country = this.model.province.value['val']; }
      //   else { country = "" }
      // }
    }
    else {
      country = "";
    }

    debugger;
    // let reqt = !this.checkValueNull(this.model.request_type.value['val']) ? this.model.request_type.value['val'] : "";
    // let empId = !this.checkValueNull(this.model.employee.value['val']) || this.model.employee.value.length > 0 ? !this.checkValueNull(this.model.employee.value['val']) ? this.model.employee.value['val'] : !this.checkValueNull(this.model.employee.value[0]['val']) ? this.model.employee.value[0]['val'] : "" : "";
    // //!this.checkValueNull(this.model.employee.value['val']) ? this.model.employee.value['val'] : "";
    // let sect = !this.checkValueNull(this.model.section.value['val']) || this.model.section.value.length > 0 ? !this.checkValueNull(this.model.section.value['val']) ? this.model.section.value['val'] : !this.checkValueNull(this.model.section.value[0]['val']) ? this.model.section.value[0]['val'] : "" : "";
    // let depr = !this.checkValueNull(this.model.department.value['val']) || this.model.department.value.length > 0 ? !this.checkValueNull(this.model.department.value['val']) ? this.model.department.value['val'] : !this.checkValueNull(this.model.department.value[0]['val']) ? this.model.department.value[0]['val'] : "" : "";
    // let func = !this.checkValueNull(this.model.function.value['val']) || this.model.function.value.length > 0 ? !this.checkValueNull(this.model.function.value['val']) ? this.model.function.value['val'] : !this.checkValueNull(this.model.function.value[0]['val']) ? this.model.function.value[0]['val'] : "" : "";

    let body = {
      "token_login": localStorage["token"],
      "doc_id": "",
      "country": country,//
      "date_from": this.ws.formatDate(date_from),
      "date_to": this.ws.formatDate(date_to),
      // "travel_type": reqt,
      // "emp_id": empId,
      // "section": sect,
      // "department": depr,
      // "function": func,
      "travel_list": this.travelList(),//!this.ws.isEmpty(this.travelListValText()) ? this.travelListValText() : "All",
    }

    return body;
  }

  EmployeeLetter() {
    this.appMain.isLoading = true;
    //ถ้าไม่มีข้อมูลให้ใส่ขีด - แทนค่าว่างก่อนส่งไป
    let bodyX = {
      "token_login": localStorage["token"],
      "nameOfEmbassy": "Thailand",
      "nameOfEmployee": 'Mr Luck Saraya', //ชื่อพนักงาน
      "gender": 'Men', //เพศ [Mr. = Men, Mrs./ Ms./ Miss = Women]
      "joinDate": '2 May 2008', //วันที่เริ่มงาน (d MMMM yyyy)
      "position": 'Manager – Corporate Venture Capital', //ชื่อตำแหน่งแบบเต็ม
      "travelTopic": 'Industry of things World',
      "cityCountry": 'Berlin, Germany', //ชื่อเมืองและประเทศ (ชื่อเมืองขึ้นก่อนประเทศ) ex : Berlin, Germany
      "dateOfDeparture": '12 September 2019', //วันที่ออกเดินทาง(Departure date บรรทัดแรกจากหน้า air ticket)(d MMMM yyyy)
      "company": 'TOP', // TOP / TES
    }

    const onSuccess = (data: { d: any; }) => {
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
        // this.ws.downloadFile(parsed.dtResult[0].file_outbound_path, parsed.dtResult[0].file_outbound_name);
        this.ws.downloadFile(parsed.dtResult[0].file_system_path, parsed.dtResult[0].file_outbound_name);


        this.appMain.isLoading = false;
      }
      else {
        this.appMain.isLoading = false;
        this.alerts.swal_error(parsed.dtResult[0].status);
      }
    }

    //data, function name(ฝั่ง asmx), method name
    this.ws.callWs_asmx(bodyX, 'Report', 'employee_letter').subscribe(data => onSuccess(data), error => {
      this.appMain.isLoading = false
      console.log(error);
      alert('Can\'t call web api.' + ' : ' + error.message);
    })
  }
  testCallAsmx() {

    this.appMain.isLoading = true;
    //ถ้าไม่มีข้อมูลให้ใส่ขีด - แทนค่าว่างก่อนส่งไป
    let bodyX = {
      "token_login": localStorage["token"],
      "policyHolder": 'Mr Attaphon Sodsarn',
      "passportNo": 'A0012345',
      "companyName": 'Thai Oil Public Company Limited Branch 00001 Tax ID No.010-7547000-711',
      "address": '42/1 Moo 1, Sukhumvit Road Km 124, Tungsukla, Sriracha, Cholburi 20230',
      "occupation": 'Employee',
      "age": '34',
      "tel": '099-999-9999',
      "fax": '-',
      "nameOfBeneficiary": 'Mrs. Siripan  Siriwit',
      "relationship": 'Wife',
      "pdateFrom": '24/01/2019', //dd/MM/yyyy
      "pdateTo": '25/01/2019', //dd/MM/yyyy
      "duration": '2',
      "insPlan": 'Classic Plan 4',
      "destination": 'Netherlands',
      "broker": 'Multi Risk Consultants (Thailand) Ltd'
    }

    const onSuccess = (data: { d: any; }) => {
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

        this.appMain.isLoading = false;
      }
      else {
        this.appMain.isLoading = false;
        this.alerts.swal_error(parsed.dtResult[0].status);
      }
    }

    //data, function name(ฝั่ง asmx), method name
    this.ws.callWs_asmx(bodyX, 'Report', 'insurance').subscribe(data => onSuccess(data), error => {
      this.appMain.isLoading = false
      console.log(error);
      alert('Can\'t call web api.' + ' : ' + error.message);
    })
  }
}
