import { AfterViewInit, Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatTableDataSource } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { AlertServiceService } from '../../services/AlertService/alert-service.service';
import { AspxserviceService } from '../../ws/httpx/aspxservice.service';
import { COMMA, ENTER, SEMICOLON, SPACE } from '@angular/cdk/keycodes';
import { tap, startWith, debounceTime, distinctUntilChanged, switchMap, map } from 'rxjs/operators';
import { element } from 'protractor';

declare var $: any;

@Component({
  selector: 'app-manageadmin',
  templateUrl: './manageadmin.component.html',
  styleUrls: ['./manageadmin.component.css']
})
export class ManageadminComponent implements OnInit, AfterViewInit {

  tp_clone: TemplateRef<any>;
  modalRef: BsModalRef;
  editTypes: string = "";

  isLoading: boolean = false;

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource: any = [];//= new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  allEmployees: any = [];
  EmployeeList: any = [];
  masterEmp: any = [];
  txtFilter: string = "";
  MailList: any = [];
  fCtrl = new FormControl();
  filteredEmp: Observable<string[]>;
  allEmp: any = [];
  inputText = '';
  selectable = true;
  removable = true;
  addOnBlur = false;
  separatorKeysCodes: number[] = [ENTER, COMMA, SEMICOLON, SPACE];

  NewSuper_Admin: string = "false";
  NewPMSV_Admin: string = "false";
  NewPMDV_Admin: string = "false";
  NewContect_Admin: string = "false";

  msgAlert: boolean = false;

  defaultData: any = [];

  data = {

    admin_list: [{
      emp_id: "00001247",
      displayname: "Miss Acharee Tiyabhorn",
      email: "ACHAREE@THAIOILGROUP.COM",
      idicator: "SPVP/EVPS",
      username: "acharee",
      super_admin: "true",
      pmsv_admin: "true",
      pmdv_admin: "false",
      contact_admin: "false",
    },
    {
      emp_id: "08001170",
      displayname: "Mr. Achirawich Krabin",
      email: "ACHIRAWICH@THAIOILGROUP.COM",
      idicator: "MROA/MRVP/EVPM",
      username: "ACHIRAWICH",
      super_admin: "true",
      pmsv_admin: "true",
      pmdv_admin: "false",
      contact_admin: "true",
    },
    ]
  }

  // @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  // for Search Emp
  @ViewChild('fInput', { static: true }) fInput: ElementRef;
  // for Search Emp


  constructor(
    private alerts: AlertServiceService,
    public ws: AspxserviceService,
    private modalService: BsModalService,
  ) {
    // for Search Emp
    this.filteredEmp = this.fCtrl.valueChanges.pipe(
      startWith(null),
      map((x: string | null) => x ? this._filter(x) : this.allEmp.slice()));
    // for Search Emp
  }

  ngOnInit() {


    this.isLoading = true;
    var contentX = document.getElementById("contentX");
    contentX.classList.remove("d-none");

    this.onload();
    //this.loadEmpList();
    //this.loadAdminList();

    // this.dataSource = this.data.admin_list;
    // this.allEmployees = this.data.admin_list;


    // this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
    // this.allEmployees = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

    // setTimeout(() => {


    //   this.isLoading = false;
    // }, 800);
  }

  ngAfterViewInit() {
    console.log('ngAfterViewInit');
    //this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

  }

  checkedCheckbox(types: string, source: any, checked: string, username_checked: string) {
    console.log('checkedCheckbox');
    console.log(types);
    console.log(source);
    console.log(checked);
    console.log(username_checked);

    let item = this.dataSource.find(x => x.username === username_checked);
    let itemAll = this.allEmployees.find(x => x.username === username_checked);

    console.log(item);

    if (item) {
      item.super_admin = types === 'super_admin' ? checked : item.super_admin;
      item.pmsv_admin = types === 'pmsv_admin' ? checked : item.pmsv_admin;
      item.pmdv_admin = types === 'pmdv_admin' ? checked : item.pmdv_admin;
      item.contact_admin = types === 'contact_admin' ? checked : item.contact_admin;
      item.action_change = "true";
      item.action_type = item.action_type != 'insert' ? "update" : item.action_type;

      itemAll.super_admin = types === 'super_admin' ? checked : item.super_admin;
      itemAll.pmsv_admin = types === 'pmsv_admin' ? checked : item.pmsv_admin;
      itemAll.pmdv_admin = types === 'pmdv_admin' ? checked : item.pmdv_admin;
      itemAll.contact_admin = types === 'contact_admin' ? checked : item.contact_admin;
      itemAll.action_change = "true";
      itemAll.action_type = itemAll.action_type != 'insert' ? "update" : itemAll.action_type;
    }

    console.log(this.dataSource);

    console.log('---checkedCheckbox---');
    console.log(this.defaultData);
  }

  // applyFilter(filterValue: string) {
  applyFilter() {
    //debugger;
    let filterValue = this.txtFilter;
    console.log(filterValue);
    let filterValueLower = filterValue.toLowerCase();
    if (filterValue === '') {
      this.dataSource = this.allEmployees;
    }
    else {
      this.dataSource = this.allEmployees.filter(x => x.displayname.toLowerCase().includes(filterValueLower)
        || x.idicator.toLowerCase().includes(filterValueLower)
        || x.emp_id.toLowerCase().includes(filterValueLower)
        || x.username.toLowerCase().includes(filterValueLower));
    }
  }

  onload() {

    let bodyX = {
      "token_login": localStorage["token"],
      "doc_id": ''
    }

    //this.isLoading = true;
    const onSuccess = (data) => {
      console.log("---load admin list success---")
      console.log(data);

      this.defaultData = data;
      this.dataSource = data.admin_list;
      // this.dataSource = [];
      // data.admin_list.forEach(m => {
      //   this.dataSource.push(
      //     {
      //       displayname: m.displayname,
      //       email: m.email,
      //       emp_id: m.emp_id,
      //       idicator: m.idicator,
      //       pmdv_admin: m.pmdv_admin,
      //       pmsv_admin: m.pmsv_admin,
      //       super_admin: m.super_admin,
      //       contact_admin: m.contact_admin,
      //       username: m.username
      //     });
      // });
      this.allEmployees = data.admin_list;

      this.loadEmpList();
    }
    this.ws.callWs(bodyX, 'LoadManageRole').subscribe(data => onSuccess(data), error => {
      this.isLoading = false
      console.log(error);
      alert('Can\'t call web api.' + ' : ' + error.message);
    })

  }

  loadEmpList() {

    let bodyX = {
      "token_login": localStorage["token"],
      "filter_value": ''
    }

    //this.isLoading = true;
    const onSuccess = (data) => {
      console.log("---load emp list success---")
      console.log(data);
      if (data.after_trip.opt1 == "true") {

        var filterX = [];

        this.dataSource.forEach(e => {
          filterX.push({
            username: e.username
          });

        });

        this.EmployeeList = data.emp_list;
        //this.masterEmp = data.emp_list;

        filterX.forEach(element => {
          this.EmployeeList = this._emplist(element.username.toLowerCase(), this.EmployeeList);
        })
        console.log(this.EmployeeList);
        this.masterEmp = this.EmployeeList;

        this.isLoading = false;
      }
      else {
        this.isLoading = false;
        console.log('---error---');
        console.log(data);
        this.alerts.swal_error(data.after_trip.opt2.status);

      }
    }
    this.ws.callWs(bodyX, 'LoadEmployeeList').subscribe(data => onSuccess(data), error => {
      this.isLoading = false
      console.log(error);
      alert('Can\'t call web api.' + ' : ' + error.message);
    })
  }

  _emplist(word, array) {
    return array.filter(x => !x.username.toLowerCase().includes(word.toLowerCase()));
  }

  async loadAdminList() {

    let bodyX = {
      "token_login": localStorage["token"],
      "filter_value": ''
    }

    this.isLoading = true;

    let promise = new Promise((resolve, reject) => {
      setTimeout(() => resolve("done!"), 5000)

      //resolve("done1");

      //   setTimeout(() => {



      // }, 5000);
    });

    let result = await promise; // wait until the promise resolves (*)

    console.log('---result---');
    console.log(result);
    if (result) {
      this.isLoading = false;
    }

    // const onSuccess = (data) => {
    //   console.log("---load success---")
    //   console.log(data);
    //   if (data.after_trip.opt1 == "true") {

    //     this.EmployeeList = data.emp_list;
    //     this.masterEmp = data.emp_list;
    //     this.isLoading = false;
    //   }
    //   else {
    //     this.isLoading = false;
    //     console.log('---error---');
    //     console.log(data);
    //     this.alerts.swal_error(data.after_trip.opt2.status);

    //   }
    // }
    // this.ws.callWs(bodyX, 'LoadEmployeeList').subscribe(data => onSuccess(data), error => {
    //   this.isLoading = false
    //   console.log(error);
    //   alert('Can\'t call web api.' + ' : ' + error.message);
    // })
  }

  clearFilter() {
    this.txtFilter = "";
    this.dataSource = this.allEmployees;
  }

  openModalContact(templateX: TemplateRef<any>, types: string) {

    this.clearFilter();
    this.msgAlert = false;
    this.editTypes = types;
    //this.tp_clone = templateX;
    let config: object = {
      class: "modal-lg",
      animated: true,
      keyboard: false,
      ignoreBackdropClick: true,

    };

    //console.log(this.template)
    this.modalRef = this.modalService.show(templateX, config);
    // var configx = $("#exampleModalCenter").closest('.modal-backdrop').addClass('z-index:1100');

    this.set_modal();
    setTimeout(function () {

      $(".multiselect-dropdown .dropdown-btn").css({ "border": "1px solid #ced4da", "padding": "9px 12px" });
    }, 100)

  }

  //ถ้าไม่เลือกที่ autocomplete จะเข้า fn นี้
  add(event: MatChipInputEvent): void {

    console.log(event);
    // //debugger
    const input = event.input;
    const value = event.value;
    // Add our fruit
    if ((value || '').trim()) {
      this.MailList.push({
        id: "0",
        emp_id: "",
        titlename: "",
        firstname: "",
        lastname: "",
        email: value.trim(),
        displayname: value.trim(),
        idicator: "",
        username: value.trim()
      });
    }
    console.log(this.MailList)
    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.fCtrl.setValue(null);
  }

  remove(emp, indx): void {
    this.MailList.splice(indx, 1);

    if (this.MailList.length === 0 || this.MailList === null) {
      this.msgAlert = false;
    }
  }

  //ถ้าเลือกที่ autocomplete จะเข้า fn นี้
  selected(event: MatAutocompleteSelectedEvent): void {
    this.MailList.push(event.option.value);
    //this.fInput.nativeElement.value = '';
    this.fCtrl.setValue(null);
  }

  private _filter(value: any): any[] {
    return this.allEmp.filter(x => x.displayname.toLowerCase().includes(value) ||
      x.emp_id.toLowerCase().includes(value) ||
      x.idicator.toLowerCase().includes(value) ||
      x.username.toLowerCase().includes(value));
  }

  doFilter() {
    if (this.inputText != null && this.inputText != "" && this.inputText.length >= 2) {
      //console.log(this.inputText);
      this.allEmp = this.masterEmp;

    }
    else {
      this.allEmp = [];
    }
  }

  displayName(EmpList) {
    return EmpList.displayname;
  }
  set_modal() {

    $(".modal-backdrop").css({ "z-index": 700 });
    $(".modal").css({ "z-index": 800 });


  }

  addEmplist() {
    console.log(this.fCtrl.value);
    console.log(this.MailList);

    if (this.fCtrl.value != '' && this.fCtrl.value != null) {
      this.MailList.push({
        id: "0",
        emp_id: "",
        titlename: "",
        firstname: "",
        lastname: "",
        email: this.fCtrl.value.trim(),
        displayname: this.fCtrl.value.trim(),
        idicator: "",
        username: this.fCtrl.value.trim()
      });
      this.fCtrl.setValue(null);
      this.inputText = '';
      //console.log(this.fCtrl.value);
    }

    if (!this.checkUserDuplicate()) {
      var filterX = [];

      filterX = [];

      this.MailList.forEach(element => {
        this.dataSource.push({
          id: ((this.dataSource.length) + 1).toString(),
          action_change: "true",
          action_type: "insert",
          emp_id: element.emp_id,
          displayname: element.displayname,
          email: element.email,
          idicator: element.idicator,
          username: element.username,
          super_admin: this.NewSuper_Admin,
          pmsv_admin: this.NewPMSV_Admin,
          pmdv_admin: this.NewPMDV_Admin,
          contact_admin: this.NewContect_Admin,
          sort_by: "",
          status: null
        });


        filterX.push({
          username: element.username
        });

      });

      this.allEmployees = this.dataSource;


      filterX.forEach(element => {
        this.EmployeeList = this._emplist(element.username.toLowerCase(), this.EmployeeList);
      })
      console.log(this.EmployeeList);
      this.masterEmp = this.EmployeeList;

      this.MailList = [];
      this.modalRef.hide();

      this.NewSuper_Admin = "false";
      this.NewPMSV_Admin = "false";
      this.NewPMDV_Admin = "false";
      this.NewContect_Admin = "false";
      console.log(this.dataSource);
      this.alerts.toastr_sucess('Mark the user for insert.');
    }
    else {
      this.msgAlert = true;
    }
  }

  checkUserDuplicate() {

    //debugger;
    let ret = false;
    this.MailList.forEach(element => {

      ret = (this.dataSource.filter(x => x.username.toLowerCase().includes(element.username.toLowerCase()))).length > 0 ? true : false;
      console.log(this.dataSource.filter(x => x.username.toLowerCase().includes(element.username.toLowerCase())))
    });
    return ret;
  }

  deleteEmpList(username: string) {

    this.alerts.swal_confrim_delete('').then((val) => {

      if (val.isConfirmed) {
        //alert(username);

        this.clearFilter();

        this.dataSource.forEach(function (item, index, object) {
          if (item.username === username) {
            //object.splice(index, 1);
            item.action_change = "true";
            item.action_type = "delete";
          }
        });
        console.log(this.dataSource);

        // this.defaultData.admin_list.forEach(function (item, index, object) {
        //   if (item.username === username) {

        //     item.action_change = "true";
        //     item.action_type = "delete";
        //   }
        // });
        console.log(this.defaultData);
        this.alerts.toastr_sucess('Mark the user for deletion.');
        //this.alerts.swal_sucess('');
      } else {

      }

    });


  }

  cancelModal() {
    this.MailList = [];
    this.modalRef.hide();

    this.NewSuper_Admin = "false";
    this.NewPMSV_Admin = "false";
    this.NewPMDV_Admin = "false";
    this.NewContect_Admin = "false";
  }
  // for Search Emp

  checkboxChange(checked: string, types) {

    this.NewSuper_Admin = types === 'super_admin' ? checked : this.NewSuper_Admin;
    this.NewPMSV_Admin = types === 'pmsv_admin' ? checked : this.NewPMSV_Admin;
    this.NewPMDV_Admin = types === 'pmdv_admin' ? checked : this.NewPMDV_Admin;
    this.NewContect_Admin = types === 'contact_admin' ? checked : this.NewContect_Admin;

    // console.log('---checkboxChange---');
    // console.log(this.defaultData);
    //console.log(this.NewSuper_Admin);
  }

  save() {

    this.isLoading = true;
    console.log('---save---');
    console.log(this.defaultData);
    debugger;
    const onSuccess = (data) => {
      console.log("---save success---")
      console.log(data);
      if (data.after_trip.opt1 == "true") {


        this.defaultData = data;
        this.dataSource = data.admin_list;
        this.allEmployees = data.admin_list;
        
        if (data.after_add_user.length === 0) {
          this.isLoading = false;
          this.alerts.swal_sucess(data.after_trip.opt2.status);
        }
        else {
          let msg = "";
          let no = 1;
          data.after_add_user.forEach(dr => {
            if (no != 1) { msg += '\n'; }
            msg += no.toString() + '. ' + dr.username;
            no++;
          });
          this.alerts.swal_custom_newline('Invalid username specified.', msg, 'warning');
          this.isLoading = false;
        }
      }
      else {
        this.isLoading = false;
        console.log('---error---');
        console.log(data);
        this.alerts.swal_error(data.after_trip.opt2.status);

      }
    }
    this.ws.callWs(this.defaultData, 'SaveManageRole').subscribe(data => onSuccess(data), error => {
      this.isLoading = false
      console.log(error);
      alert('Can\'t call web api.' + ' : ' + error.message);
    })
  }
}

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
  { position: 11, name: 'Sodium', weight: 22.9897, symbol: 'Na' },
  { position: 12, name: 'Magnesium', weight: 24.305, symbol: 'Mg' },
  { position: 13, name: 'Aluminum', weight: 26.9815, symbol: 'Al' },
  { position: 14, name: 'Silicon', weight: 28.0855, symbol: 'Si' },
  { position: 15, name: 'Phosphorus', weight: 30.9738, symbol: 'P' },
  { position: 16, name: 'Sulfur', weight: 32.065, symbol: 'S' },
  { position: 17, name: 'Chlorine', weight: 35.453, symbol: 'Cl' },
  { position: 18, name: 'Argon', weight: 39.948, symbol: 'Ar' },
  { position: 19, name: 'Potassium', weight: 39.0983, symbol: 'K' },
  { position: 20, name: 'Calcium', weight: 40.078, symbol: 'Ca' },
];