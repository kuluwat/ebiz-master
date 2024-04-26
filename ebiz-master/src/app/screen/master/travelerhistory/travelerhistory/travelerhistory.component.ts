import { HttpClient } from '@angular/common/http';
import { Component, forwardRef, HostListener, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AppComponent } from '../../../../app.component';
import { MainComponent } from '../../../../components/main/main.component';
import { FileuploadserviceService } from '../../../../ws/fileuploadservice/fileuploadservice.service';
import { AspxserviceService } from '../../../../ws/httpx/aspxservice.service';
import { MasterComponent } from '../../master.component';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { AlertServiceService } from '../../../../services/AlertService/alert-service.service';
// import * as fs from "file-saver";
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
// import { Document, Packer, Paragraph, TextRun } from "docx";
// import { Packer } from "docx";
// import { saveAs } from "file-saver/FileSaver";
// import { experiences, education, skills, achievements } from "./cv-data";
// import { DocumentCreator } from "./cv-generator";

declare var $: any;
declare const toastr: any;

@Component({
  selector: 'app-travelerhistory',
  templateUrl: './travelerhistory.component.html',
  styleUrls: ['./travelerhistory.component.css']
})
export class TravelerhistoryComponent implements OnInit {

  pagename = "travelerhistory"
  titlename = ""
  firstname = ""
  lastname = ""
  userDisplay = ""
  userName = ""
  division = ""
  emp_id = ""
  userEmail = ""
  userPhone = ""
  userTel = ""
  isEdit = false
  doc_id = ""
  user_admin = null
  isAdmin: boolean = null
  travel_topic = ""
  travel_topic_sub = ""
  travel_date = ""
  dateofexpire = ""

  arrTraveler = [];

  passportno = ""
  dateofissue = ""
  dateofbirth = ""

  imgpath = "assets/filedata/profile/zattaphonso/"
  imgprofilename = "avatar-m-1.png"
  imgprofile = ""//this.imgpath + this.imgprofilename

  arrayX: any = [];
  dataRet = [];
  selectedFile: File = null;
  traveler_emp: any = []

  scrollSlide: any = 0;
  show_button: boolean = true;
  imgUrl_passport: any;
  img_avilable_passport = "";
  passport_img_name = "";

  img_airplan = "assets/imgs/Group_1099.png";

  pdpa_wording: string ="";
  modalRef: BsModalRef;
  tp_clone: TemplateRef<any>;
  @ViewChild('templatePDPA', { static: true }) templatePDPA: TemplateRef<any>;

  constructor(
    @Inject(forwardRef(() => MasterComponent)) private appMain: MasterComponent,
    public ws: AspxserviceService,
    private x: AppComponent,
    private http: HttpClient,
    private fileuploadservice: FileuploadserviceService,
    private alerts: AlertServiceService,
    private modalService: BsModalService,
  ) {


  }

  ngOnInit() {


    this.doc_id = this.appMain.DOC_ID
    console.log('this.appMain.TYPES')
    console.log(this.appMain.TYPES)


    this.onloadX();

    //alert(this.appMain.TRAVEL_TYPE);
  }


  scrollAmount = 0;
  scrollMin = 0
  scrollX = 0;


  slideX() {
    document.getElementById('containerX').addEventListener('scroll', function () {
      //this.scrollSlide = parseInt(this.scrollLeft.toString());
      console.log(this.scrollLeft);
      //return this.scrollLeft;
    });
  }

  slideRight() {


    var container = document.getElementById('containerX');


    var input = document.getElementById('tblUserList');
    var scrollMax = input.clientWidth

    scrollX = (container.scrollLeft + 500);
    container.scrollTo({
      top: 0,
      left: scrollX,//Math.max(this.scrollAmount += 20, scrollX),
      behavior: 'smooth'
    });



  }
  slideLeft() {
    //document.getElementById('containerX').scrollLeft -= 160;

    var container = document.getElementById('containerX');
    var input = document.getElementById('tblUserList');
    var scrollMax = input.clientWidth

    scrollX = (container.scrollLeft - 500);

    container.scrollTo({
      top: 0,
      left: scrollX,//Math.max(this.scrollAmount -= 200, this.scrollMin),
      behavior: 'smooth'
    });



  }

  panel = {
    show: true,
    after: false
  }

  openModal(template: TemplateRef<any>) {
    this.tp_clone = template;
    let config: object = {
      class: 'modal-lg',
      animated: true,
      keyboard: false,
      ignoreBackdropClick: true,
    };
    // if (type == 'new_passport') {
    //   this.vaildator_save = false;
    //   let dsemp = this.model_all.passport_detail.filter((res) => {
    //     return res.emp_id == this.emp_id;
    //   })[0];
    //   this.frmHandle.passport_name = dsemp.passport_name;
    //   this.frmHandle.passport_surname = dsemp.passport_surname;
    //   this.frmHandle.passport_title = dsemp.passport_title;
    // }
    // if (type == 'edit_passport') {
    //   let dsemp_img = this.model_all.img_list.filter((res) => {
    //     return res.emp_id == this.emp_id && res['id_level_1'] == dr.id && res.action_type != 'delete';
    //   });
    //   this.frmHandle = { ...dr };
    //   this.frmHandle['img_def'] = [];
    //   if (dsemp_img.length > 0) {
    //     this.frmHandle['img_def'][0] = dsemp_img[0];
    //   }
    //   this.frmHandle_Edit = dr;
    //   this.frmHandle.IsEdit = 'insert';
    // }
    this.modalRef = this.modalService.show(template, config);

    // var configx = $('#modal-test').closest('.modal-content').addClass('rounded-20').addClass('border-blue border-2');
    var configx = $('#modal-test').closest('.modal-content');
  }

  accept_pdpa(){
    this.fnEdit(0);
  }

  fnEdit(edit) {
    if (edit === 1) {
      this.isEdit = true;
    }
    else {
      this.appMain.isLoading = true
      this.isEdit = false;
      this.modalRef.hide();
      const eId: string = this.emp_id;

      var ArrFilterX = $.grep(this.arrayX.traveler_emp, function (v) {
        return (v.emp_id === eId);
      });

      if (ArrFilterX.length > 0) {
        ArrFilterX[0].userTel = this.userTel;
        ArrFilterX[0].userPhone = this.userPhone;
        // this.array_result.img_list[0].action_change = "true";
        // this.array_result.img_list[0].action_type = "delete";

      }

      this.arrayX.data_type = "save";
      console.log('---save---');
      console.log(this.arrayX)
      //console.log(updateItem)

      const onSuccess = (data) => {
        this.appMain.isLoading = false
        if (data.after_trip.opt1 == "true") {
          console.log('---success---');
          console.log(data)
          this.alerts.swal_sucess(data.after_trip.opt2.status);
          // Swal.fire(
          //   'Success!',
          //   'Update data successfully.',
          //   'success'
          // )
        }
        else {
          console.log('---error---');
          console.log(data);
          this.alerts.swal_error(data.after_trip.opt2.status);
          // Swal.fire(
          //   'Error!',
          //   'Error : ' + data.after_trip.opt2.status,
          //   'error'
          // )
        }
      }

      this.ws.callWs(this.arrayX, 'SaveTravelerHistory').subscribe(data => onSuccess(data), error => {
        this.appMain.isLoading = false
        console.log(error);
        alert('Can\'t call web api.' + ' : ' + error.message);
      })
    }
  }

  findIndexToUpdate(newItem) {
    return newItem.id === this;
  }

  onFileSelect(event) {

    this.selectedFile = <File>event.target.files[0]
    console.log(event)
    console.log(this.selectedFile)
    this.onUpload();
  }

  onUpload() {

    this.appMain.isLoading = true

    const onSuccess = (res) => {
      this.appMain.isLoading = false

      if (res.after_trip.opt1 == "true") {
        console.log("---Upload image success---")
        console.log(res)
        this.imgprofile = res.img_list.path + res.img_list.filename;
        toastr.success('Update data complete.', 'Sucess!', { "positionClass": "toast-bottom-right", "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 3000 });
        Swal.fire(
          'Success!',
          res.after_trip.opt2.status,
          'success'
        )
      }
      else {
        console.log('---error---');
        console.log(res)
        Swal.fire(
          'Error!',
          'Error : ' + res.after_trip.opt2.status,
          'error'
        )
      }

    }

    this.fileuploadservice.postFile(this.selectedFile, this.doc_id, this.pagename, this.emp_id).subscribe(res => onSuccess(res), error => {
      this.appMain.isLoading = false;
      console.log(error);
      alert('error!');
    })
  }

  testToastr() {
    toastr.success('Update data complete.', 'Sucess!', { "showMethod": "slideDown", "hideMethod": "slideUp", timeOut: 3000 });
  }

  simpleAlert() {

    Swal.fire('Hello world!');


  }

  clickme() {
    //console.log('xxx')
    this.appMain.confirmTextBox.sts = true;
  }
  clickme2() {
    //console.log('xxx')
    this.appMain.message.sts = true;
    this.appMain.message.text = "Hello"
  }

  onloadX() {
    debugger;
    console.log('---load travel history---');
    this.appMain.isLoading = true;
    let bodyX = {
      "token_login": localStorage["token"],
      "doc_id": this.doc_id
    }

    console.log(bodyX)

    const onSuccess = (data) => {

      console.log('---Data travelerhistory---');
      this.arrayX = data;
      console.log(this.arrayX);

      this.traveler_emp = this.arrayX.traveler_emp;
      console.log(this.traveler_emp)

       this.pdpa_wording = data.pdpa_wording;

      if (this.arrayX.traveler_emp.length > 0) {

        this.doc_id = this.arrayX.doc_id;

        //this.arrayX.user_admin = false
        if (this.arrayX.user_admin === false) {

          this.isAdmin = false

          this.titlename = this.arrayX.traveler_emp[0].titlename;
          this.doc_id = this.arrayX.traveler_emp[0].doc_id;
          this.dateofexpire = this.arrayX.traveler_emp[0].dateofexpire;
          this.firstname = this.arrayX.traveler_emp[0].firstname;
          this.lastname = this.arrayX.traveler_emp[0].lastname;
          this.userDisplay = this.arrayX.traveler_emp[0].userDisplay;
          this.userName = this.arrayX.traveler_emp[0].userName;
          this.division = this.arrayX.traveler_emp[0].division;
          this.emp_id = this.arrayX.traveler_emp[0].emp_id;
          this.userEmail = this.arrayX.traveler_emp[0].userEmail;
          this.userPhone = this.arrayX.traveler_emp[0].userPhone;
          this.userTel = this.arrayX.traveler_emp[0].userTel;
          this.isEdit = this.arrayX.traveler_emp[0].isEdit;

          this.passportno = this.arrayX.traveler_emp[0].passportno;
          this.dateofissue = this.arrayX.traveler_emp[0].dateofissue;
          this.dateofbirth = this.arrayX.traveler_emp[0].dateofbirth;
          this.imgprofile = this.arrayX.traveler_emp[0].imgpath + this.arrayX.traveler_emp[0].imgprofilename;
          this.show_button = this.arrayX.traveler_emp[0].show_button;
          this.imgUrl_passport = this.arrayX.traveler_emp[0].passport_img;
          this.passport_img_name = this.arrayX.traveler_emp[0].passport_img_name;

         
          let eId = this.emp_id;

          let arrX = this.arrayX.arrTraveler.filter(function (item) {
            return (item.emp_id === eId); //activeIds.indexOf(item.emp_id) === -1;
          });

          if (arrX.length > 0) {
            this.arrTraveler = arrX;
          }
          else {
            this.arrTraveler = []
          }



          var contentUser = document.getElementById("contentUser")
          setTimeout(() => {

            contentUser.classList.remove("d-none");

          }, 300);
        }
        else {

          var contentX = document.getElementById("contentX")

          this.isAdmin = true

          this.arrTraveler = this.arrayX.arrTraveler;
          this.user_admin = this.arrayX.user_admin;
          this.travel_topic = this.arrayX.travel_topic;
          this.travel_topic_sub = this.arrayX.travel_topic_sub;
          this.travel_date = this.arrayX.travel_date;
          setTimeout(() => {

            contentX.classList.remove("d-none");

          }, 300);
        }
      }

      if (this.arrayX.traveler_emp.length > 0) {
        if (this.doc_id === "personal") {
          //debugger;
          this.titlename = this.arrayX.traveler_emp[0].titlename;
          this.doc_id = this.arrayX.traveler_emp[0].doc_id;
          this.dateofexpire = this.arrayX.traveler_emp[0].dateofexpire;
          this.firstname = this.arrayX.traveler_emp[0].firstname;
          this.lastname = this.arrayX.traveler_emp[0].lastname;
          this.userDisplay = this.arrayX.traveler_emp[0].userDisplay;
          this.userName = this.arrayX.traveler_emp[0].userName;
          this.division = this.arrayX.traveler_emp[0].division;
          this.emp_id = this.arrayX.traveler_emp[0].emp_id;
          this.userEmail = this.arrayX.traveler_emp[0].userEmail;
          this.userPhone = this.arrayX.traveler_emp[0].userPhone;
          this.userTel = this.arrayX.traveler_emp[0].userTel;
          this.isEdit = this.arrayX.traveler_emp[0].isEdit;

          this.passportno = this.arrayX.traveler_emp[0].passportno;
          this.dateofissue = this.arrayX.traveler_emp[0].dateofissue;
          this.dateofbirth = this.arrayX.traveler_emp[0].dateofbirth;
          this.imgprofile = this.arrayX.traveler_emp[0].imgpath + this.arrayX.traveler_emp[0].imgprofilename;
          this.show_button = this.arrayX.traveler_emp[0].show_button;
          this.imgUrl_passport = this.arrayX.traveler_emp[0].passport_img;
          this.passport_img_name = this.arrayX.traveler_emp[0].passport_img_name;

          let eId = this.emp_id;

          let arrX = this.arrayX.arrTraveler.filter(function (item) {
            return (item.emp_id === eId); //activeIds.indexOf(item.emp_id) === -1;
          });

          if (arrX.length > 0) {
            this.arrTraveler = arrX;
          }
          else {
            this.arrTraveler = []
          }


          var contentX = document.getElementById("contentX")
          var contentUser = document.getElementById("contentUser")
          setTimeout(() => {

            contentX.classList.add("d-none");
            contentUser.classList.remove("d-none");

          }, 300);
        }
      }
      else{
        this.alerts.swal_error("Error : No data traveler_emp. & api http://tbkc-dapps-05.thaioil.localnet/ebiz_ws/API/travelerhistory /// " + JSON.stringify(bodyX));
      }
      // this.appMain.isLoading = false
      setTimeout(() => {
        this.appMain.isLoading = false
      }, 200);

    }

    console.log('>>>> load travelerhistory <<<<');
    console.log(bodyX);
    this.ws.callWs(bodyX, 'travelerhistory').subscribe(data => onSuccess(data), error => {
      this.appMain.isLoading = false
      console.log(error);
      alert('Can\'t call web api.' + ' : ' + error.message);
    })

    //console.log('status : '+onSuccess)
  }

  selectTraveler(selected_empid) {
    //alert(selected_empid);
    console.log(selected_empid)
    let arr = this.traveler_emp.filter(function (item) {
      return (item.emp_id === selected_empid); //activeIds.indexOf(item.emp_id) === -1;
    });
    console.log(arr)
    console.log(arr[0].firstname)

    let arr2 = this.arrTraveler.filter(function (item) {
      return (item.emp_id === selected_empid); //activeIds.indexOf(item.emp_id) === -1;
    });
    console.log('---arrTraveler---');
    console.log(arr2)



    if (arr.length > 0) {


      this.show_button = arr[0].show_button;
      this.titlename = arr[0].titlename;

      this.firstname = arr[0].firstname;
      this.lastname = arr[0].lastname;
      this.userDisplay = arr[0].userDisplay;
      this.userName = arr[0].userName;
      this.division = arr[0].division;
      this.emp_id = arr[0].emp_id;
      this.userEmail = arr[0].userEmail;
      this.userPhone = arr[0].userPhone;
      this.userTel = arr[0].userTel;
      this.isEdit = arr[0].isEdit;

      this.passportno = arr[0].passportno;
      this.dateofissue = arr[0].dateofissue;
      this.dateofbirth = arr[0].dateofbirth;
      this.dateofexpire = arr[0].dateofexpire;
      this.imgprofile = arr[0].imgpath + arr[0].imgprofilename;

      this.imgUrl_passport = arr[0].passport_img;//"http://TBKC-DAPPS-05.thaioil.localnet/ebiz_ws/Image/OB20110006/passport/foreignpassportrus.jpg";
      this.passport_img_name = arr[0].passport_img_name;
      console.log(this.passport_img_name)

      let arrX = this.arrayX.arrTraveler.filter(function (item) {
        return (item.emp_id === selected_empid); //activeIds.indexOf(item.emp_id) === -1;
      });

      if (arrX.length > 0) {
        this.arrTraveler = arrX;
      }
      else {
        this.arrTraveler = []
      }

      this.isAdmin = false

      var contentX = document.getElementById("contentX")
      var contentUser = document.getElementById("contentUser")
      //console.log(contentUser)

      setTimeout(() => {
        //contentX.classList.remove("animate__animated animate__fadeIn delay-2s")
        contentX.classList.add("d-none")
        contentUser.classList.remove("d-none");
        //contentX.classList.add("animate__animated animate__bounce")
      }, 0);

      console.log(this.isAdmin)
    }
  }

  goAdminPage() {
    this.isAdmin = true
    console.log(this.isAdmin)

    var contentX = document.getElementById("contentX")
    var contentUser = document.getElementById("contentUser")


    setTimeout(() => {

      contentX.classList.remove("d-none")
      contentUser.classList.add("d-none");

    }, 0);

    //$("#divX").hide();

  }

  OpenModal() {
    var modalX = <any>document.getElementById("exampleModalCenter")
    console.log(modalX)

    // $("#exampleModalCenter")
    //   .modal({
    //     keyboard: false,
    //   })
    //   .modal("show");
    // // cdk-overlay-container
    // $(".modal-backdrop").css({ "z-index": 800 });
  }

  testCallWs() {
    // var param = [{
    //   "UserName": "zattaphonso"
    // }]

    // this.http.post<any>(this.baseUrl + 'Get_All', param).subscribe(
    //   ret => {
    //     console.log(ret)
    //   },
    //   error => {
    //     console.log("ErroX : " + error)
    //   }
    // )
    var array = [
      {
        seq: 1,
        country: "Singapore",
        icon: "plane",
        datefrom: "05/18",
        dateto: "24/20"
      },
      {
        seq: 2,
        country: "USA",
        icon: "plane",
        datefrom: "05/18",
        dateto: "24/20"
      },
      {
        seq: 3,
        country: "Jpan",
        icon: "plane",
        datefrom: "05/18",
        dateto: "24/20"
      }
    ]
    var param2 = {
      "year": 2020,
      "month": "10",
      "carfrom": "",
      // "jsonBooking":JSON.stringify(array)
    }

    var paramX = { "UserName": "zattaphonso" }

    let bodyX = {
      "token_login": localStorage["token_login"],
      "doc_id": "D001"
    }



    this.ws.callWs(bodyX, 'travelerhistory')//Get_All GetReportData
      .subscribe(data => {
        this.arrayX = data;
        console.log(this.arrayX);

        //this.dateofbirth = this.arrayX.token_login;

        this.arrTraveler = this.arrayX.arrTraveler;
        this.titlename = "Mr."
        this.firstname = "Attaphon"
        this.lastname = "Sodsarn"
        this.userDisplay = "Mr. Attaphon Sodsarn";
        this.userName = ""
        this.division = "PMSV/PMVP/EVPO"
        this.emp_id = "TO102155"
        this.userEmail = "zattaphonso@thaioilgroup.com"
        this.userPhone = "02-777-6666"
        this.userTel = "092-777-6666"
        this.isEdit = false

        this.passportno = "AA5437854"
        this.dateofissue = "06 OCT 2015"
        this.dateofbirth = "06 OCT 1994"


        // this.states = JSON.parse(this.states.d); 
        //console.log(JSON.parse(this.arrayX.d));
        // var parsed = JSON.parse(data.d);
        // console.log("parsed");
        // console.log(parsed.dtReport);
        // this.dataRet = parsed.dtReport;

      }, error => {
        console.log(error);
      }
      );

  }

  checkTelNo(type, event) {
    //alert(this.userTel+" || "+value);
    //console.log(event);

    if (event.keyCode != 8) {

      if (type === 'Mobile') {
        var str = this.userPhone;
        var sub = "";

        if (this.userPhone.length == 3) {
          if (this.userPhone.substring(3, 4) != "-") {
            sub = str.substring(0, 3) + "-" + str.substring(3, 4);
            this.userPhone = sub;
          }
        }
        else if (this.userPhone.length == 4) {
          if (this.userPhone.substring(3, 4) != "-") {
            sub = str.substring(0, 3) + "-" + str.substring(3, 4);
            this.userPhone = sub;
          }
        }
        else if (this.userPhone.length == 7) {

          if (this.userPhone.substring(7, 8) != "-") {
            sub = str.substring(0, 7) + "-" + str.substring(7, 8);
            this.userPhone = sub;
          }
        }
        else if (this.userPhone.length == 8) {

          if (this.userPhone.substring(7, 8) != "-") {
            sub = str.substring(0, 7) + "-" + str.substring(7, 8);
            this.userPhone = sub;
          }
        }
        else if (this.userPhone.length == 10 && event.keyCode === 17) {

          sub = str.substring(0, 3) + "-" + str.substring(3, 6) + "-" + str.substring(6, 10);
          this.userPhone = sub;

        }
      }
      else if (type === 'Telephone') {
        var str = this.userTel;
        var sub = "";

        if (this.userTel.length == 2) {
          if (this.userTel.substring(2, 3) != "-") {
            sub = str.substring(0, 2) + "-" + str.substring(2, 3);
            this.userTel = sub;
          }
        }
        else if (this.userTel.length == 3) {
          if (this.userTel.substring(2, 3) != "-") {
            sub = str.substring(0, 2) + "-" + str.substring(2, 3);
            this.userTel = sub;
          }
        }
        else if (this.userTel.length == 6) {

          if (this.userTel.substring(6, 7) != "-") {
            sub = str.substring(0, 6) + "-" + str.substring(6, 7);
            this.userTel = sub;
          }
        }
        else if (this.userTel.length == 7) {

          if (this.userTel.substring(6, 7) != "-") {
            sub = str.substring(0, 6) + "-" + str.substring(6, 7);
            this.userTel = sub;
          }
        }
        else if (this.userTel.length == 9 && event.keyCode === 17) {

          sub = str.substring(0, 2) + "-" + str.substring(2, 5) + "-" + str.substring(5, 9);
          this.userTel = sub;

        }
      }
    }

  }

  // downloadFile(url) {
  //   window.open(url, '_blank');
  // }

  downloadFile(url, filename) {
    let Regex = /.[A-Za-z]{3}$/;
    let fullurl = url.match(Regex);
    //let fileType = fullurl[0];
    let file_name = filename;
    // fs.saveAs(url, file_name);
  }

  dummyDataEmList() {
    let arr = [
      { "token_login": "4d80b2c4-d278-407f-a65a-231225873503", "doc_id": "OB20120006", "emp_id": "00000910", "id": "0", "user_admin": true, "age": "28", "org_unit": "EVPM", "titlename": "Mr.", "firstname": "Jeerawat", "lastname": "Pattanasomsit", "userDisplay": "Mr. Jeerawat Pattanasomsit", "userName": "JEERAWAT", "division": "EVPM", "idNum": "00000910", "userEmail": "JEERAWAT@THAIOILGROUP.COM", "userPhone": "099999999", "userTel": "0299999999", "isEdit": false, "passportno": "AA5437854", "dateofissue": "06 OCT 2015", "dateofbirth": "06 OCT 1994", "dateofexpire": "07 OCT 2020", "imgpath": "https://tel.thaioilgroup.com/pic/TOP/", "imgprofilename": "910.jpg", "travel_topic": "Participate HAZOP/SIL Reviewwith EPC \u0026 PMC(6 people.)", "travel_topic_sub": "Participate HAZOP/SIL Reviewwith EPC \u0026 PMC(6 people.)", "business_date": "20 JAN 2019-20 APR 2019", "travel_date": "20 JAN 2019-20 APR 2019", "country_city": "ItalyCosenza", "remark": null, "action_type": "update" },
      { "token_login": "4d80b2c4-d278-407f-a65a-231225873503", "doc_id": "OB20120006", "emp_id": "00000909", "id": "1", "user_admin": true, "age": "28", "org_unit": "MPVP/EVPM", "titlename": "Mr.", "firstname": "Sarunyu", "lastname": "Limwongse", "userDisplay": "Mr. Sarunyu Limwongse", "userName": "SARUNYU", "division": "MPVP/EVPM", "idNum": "00000909", "userEmail": "SARUNYU@THAIOILGROUP.COM", "userPhone": "099999999", "userTel": "0299999999", "isEdit": false, "passportno": "AA5437855", "dateofissue": "06 OCT 2015", "dateofbirth": "06 OCT 1994", "dateofexpire": "07 OCT 2020", "imgpath": "https://tel.thaioilgroup.com/pic/TOP/", "imgprofilename": "909.jpg", "travel_topic": "Participate HAZOP/SIL Reviewwith EPC \u0026 PMC(6 people.)", "travel_topic_sub": "Participate HAZOP/SIL Reviewwith EPC \u0026 PMC(6 people.)", "business_date": "20 JAN 2019-20 APR 2019", "travel_date": "20 JAN 2019-20 APR 2019", "country_city": "ItalyCosenza", "remark": null, "action_type": "update" },
      { "token_login": "4d80b2c4-d278-407f-a65a-231225873503", "doc_id": "OB20120006", "emp_id": "08000024", "id": "2", "user_admin": true, "age": "28", "org_unit": "PEES/PEVP/EVPO", "titlename": "Mrs.", "firstname": "Sukulya", "lastname": "Veeradaechapol", "userDisplay": "Mrs. Sukulya Veeradaechapol", "userName": "SUKULYA", "division": "PEES/PEVP/EVPO", "idNum": "08000024", "userEmail": "SUKULYA@THAIOILGROUP.COM", "userPhone": "", "userTel": "", "isEdit": false, "passportno": "", "dateofissue": "", "dateofbirth": "", "dateofexpire": "", "imgpath": "http://tsr-ahr-01.thaioil.localnet/pic/TOP/", "imgprofilename": "8000024.jpg", "travel_topic": "Participate HAZOP/SIL Reviewwith EPC \u0026 PMC(6 people.)", "travel_topic_sub": "Participate HAZOP/SIL Reviewwith EPC \u0026 PMC(6 people.)", "business_date": "20 JAN 2019-20 APR 2019", "travel_date": "20 JAN 2019-20 APR 2019", "country_city": "Italy", "remark": null, "action_type": "update" },
      { "token_login": "4d80b2c4-d278-407f-a65a-231225873503", "doc_id": "OB20120006", "emp_id": "00000396", "id": "3", "user_admin": true, "age": "28", "org_unit": "SHSC/SHMG/EVPD", "titlename": "Mrs.", "firstname": "Somporn", "lastname": "Woowong", "userDisplay": "Mrs. Somporn Woowong", "userName": "SOMPORNW", "division": "SHSC/SHMG/EVPD", "idNum": "00000396", "userEmail": "SOMPORN.WO@THAIOILGROUP.COM", "userPhone": "099999999", "userTel": "0299999999", "isEdit": false, "passportno": "AA5437855", "dateofissue": "06 OCT 2015", "dateofbirth": "06 OCT 1994", "dateofexpire": "07 OCT 2020", "imgpath": "https://tel.thaioilgroup.com/pic/TOP/", "imgprofilename": "396.jpg", "travel_topic": "Participate HAZOP/SIL Reviewwith EPC \u0026 PMC(6 people.)", "travel_topic_sub": "Participate HAZOP/SIL Reviewwith EPC \u0026 PMC(6 people.)", "business_date": "20 JAN 2019-20 APR 2019", "travel_date": "20 JAN 2019-20 APR 2019", "country_city": "Italy", "remark": null, "action_type": "update" },
      { "token_login": "4d80b2c4-d278-407f-a65a-231225873503", "doc_id": "OB20120006", "emp_id": "00000528", "id": "4", "user_admin": true, "age": "28", "org_unit": "MROB/MRVP/EVPM", "titlename": "Mr.", "firstname": "Dacho", "lastname": "Rungseeborirak", "userDisplay": "Mr. Dacho Rungseeborirak", "userName": "DACHO", "division": "MROB/MRVP/EVPM", "idNum": "00000528", "userEmail": "DACHO@THAIOILGROUP.COM", "userPhone": "099999999", "userTel": "0299999999", "isEdit": false, "passportno": "AA5437854", "dateofissue": "06 OCT 2015", "dateofbirth": "06 OCT 1994", "dateofexpire": "07 OCT 2020", "imgpath": "https://tel.thaioilgroup.com/pic/TOP/", "imgprofilename": "528.jpg", "travel_topic": "Participate HAZOP/SIL Reviewwith EPC \u0026 PMC(6 people.)", "travel_topic_sub": "Participate HAZOP/SIL Reviewwith EPC \u0026 PMC(6 people.)", "business_date": "20 JAN 2019-20 APR 2019", "travel_date": "20 JAN 2019-20 APR 2019", "country_city": "Italy", "remark": null, "action_type": "update" },
      { "token_login": "4d80b2c4-d278-407f-a65a-231225873503", "doc_id": "OB20120006", "emp_id": "00000520", "id": "5", "user_admin": true, "age": "28", "org_unit": "MROB/MRVP/EVPM", "titlename": "Mr.", "firstname": "Boonsrang", "lastname": "Jindathai", "userDisplay": "Mr. Boonsrang Jindathai", "userName": "BOONSRANG", "division": "MROB/MRVP/EVPM", "idNum": "00000520", "userEmail": "BOONSRANG@THAIOILGROUP.COM", "userPhone": "099999999", "userTel": "0299999999", "isEdit": false, "passportno": "AA5437855", "dateofissue": "06 OCT 2015", "dateofbirth": "06 OCT 1994", "dateofexpire": "07 OCT 2020", "imgpath": "https://tel.thaioilgroup.com/pic/TOP/", "imgprofilename": "520.jpg", "travel_topic": "Participate HAZOP/SIL Reviewwith EPC \u0026 PMC(6 people.)", "travel_topic_sub": "Participate HAZOP/SIL Reviewwith EPC \u0026 PMC(6 people.)", "business_date": "20 JAN 2019-20 APR 2019", "travel_date": "20 JAN 2019-20 APR 2019", "country_city": "Italy", "remark": null, "action_type": "update" },
      { "token_login": "4d80b2c4-d278-407f-a65a-231225873503", "doc_id": "OB20120006", "emp_id": "00000910", "id": "0", "user_admin": true, "age": "28", "org_unit": "EVPM", "titlename": "Mr.", "firstname": "Jeerawat", "lastname": "Pattanasomsit", "userDisplay": "Mr. Jeerawat Pattanasomsit", "userName": "JEERAWAT", "division": "EVPM", "idNum": "00000910", "userEmail": "JEERAWAT@THAIOILGROUP.COM", "userPhone": "099999999", "userTel": "0299999999", "isEdit": false, "passportno": "AA5437854", "dateofissue": "06 OCT 2015", "dateofbirth": "06 OCT 1994", "dateofexpire": "07 OCT 2020", "imgpath": "https://tel.thaioilgroup.com/pic/TOP/", "imgprofilename": "910.jpg", "travel_topic": "Participate HAZOP/SIL Reviewwith EPC \u0026 PMC(6 people.)", "travel_topic_sub": "Participate HAZOP/SIL Reviewwith EPC \u0026 PMC(6 people.)", "business_date": "20 JAN 2019-20 APR 2019", "travel_date": "20 JAN 2019-20 APR 2019", "country_city": "ItalyCosenza", "remark": null, "action_type": "update" },
      { "token_login": "4d80b2c4-d278-407f-a65a-231225873503", "doc_id": "OB20120006", "emp_id": "00000909", "id": "1", "user_admin": true, "age": "28", "org_unit": "MPVP/EVPM", "titlename": "Mr.", "firstname": "Sarunyu", "lastname": "Limwongse", "userDisplay": "Mr. Sarunyu Limwongse", "userName": "SARUNYU", "division": "MPVP/EVPM", "idNum": "00000909", "userEmail": "SARUNYU@THAIOILGROUP.COM", "userPhone": "099999999", "userTel": "0299999999", "isEdit": false, "passportno": "AA5437855", "dateofissue": "06 OCT 2015", "dateofbirth": "06 OCT 1994", "dateofexpire": "07 OCT 2020", "imgpath": "https://tel.thaioilgroup.com/pic/TOP/", "imgprofilename": "909.jpg", "travel_topic": "Participate HAZOP/SIL Reviewwith EPC \u0026 PMC(6 people.)", "travel_topic_sub": "Participate HAZOP/SIL Reviewwith EPC \u0026 PMC(6 people.)", "business_date": "20 JAN 2019-20 APR 2019", "travel_date": "20 JAN 2019-20 APR 2019", "country_city": "ItalyCosenza", "remark": null, "action_type": "update" },
      { "token_login": "4d80b2c4-d278-407f-a65a-231225873503", "doc_id": "OB20120006", "emp_id": "08000024", "id": "2", "user_admin": true, "age": "28", "org_unit": "PEES/PEVP/EVPO", "titlename": "Mrs.", "firstname": "Sukulya", "lastname": "Veeradaechapol", "userDisplay": "Mrs. Sukulya Veeradaechapol", "userName": "SUKULYA", "division": "PEES/PEVP/EVPO", "idNum": "08000024", "userEmail": "SUKULYA@THAIOILGROUP.COM", "userPhone": "", "userTel": "", "isEdit": false, "passportno": "", "dateofissue": "", "dateofbirth": "", "dateofexpire": "", "imgpath": "http://tsr-ahr-01.thaioil.localnet/pic/TOP/", "imgprofilename": "8000024.jpg", "travel_topic": "Participate HAZOP/SIL Reviewwith EPC \u0026 PMC(6 people.)", "travel_topic_sub": "Participate HAZOP/SIL Reviewwith EPC \u0026 PMC(6 people.)", "business_date": "20 JAN 2019-20 APR 2019", "travel_date": "20 JAN 2019-20 APR 2019", "country_city": "Italy", "remark": null, "action_type": "update" },
      { "token_login": "4d80b2c4-d278-407f-a65a-231225873503", "doc_id": "OB20120006", "emp_id": "00000396", "id": "3", "user_admin": true, "age": "28", "org_unit": "SHSC/SHMG/EVPD", "titlename": "Mrs.", "firstname": "Somporn", "lastname": "Woowong", "userDisplay": "Mrs. Somporn Woowong", "userName": "SOMPORNW", "division": "SHSC/SHMG/EVPD", "idNum": "00000396", "userEmail": "SOMPORN.WO@THAIOILGROUP.COM", "userPhone": "099999999", "userTel": "0299999999", "isEdit": false, "passportno": "AA5437855", "dateofissue": "06 OCT 2015", "dateofbirth": "06 OCT 1994", "dateofexpire": "07 OCT 2020", "imgpath": "https://tel.thaioilgroup.com/pic/TOP/", "imgprofilename": "396.jpg", "travel_topic": "Participate HAZOP/SIL Reviewwith EPC \u0026 PMC(6 people.)", "travel_topic_sub": "Participate HAZOP/SIL Reviewwith EPC \u0026 PMC(6 people.)", "business_date": "20 JAN 2019-20 APR 2019", "travel_date": "20 JAN 2019-20 APR 2019", "country_city": "Italy", "remark": null, "action_type": "update" },
      { "token_login": "4d80b2c4-d278-407f-a65a-231225873503", "doc_id": "OB20120006", "emp_id": "00000528", "id": "4", "user_admin": true, "age": "28", "org_unit": "MROB/MRVP/EVPM", "titlename": "Mr.", "firstname": "Dacho", "lastname": "Rungseeborirak", "userDisplay": "Mr. Dacho Rungseeborirak", "userName": "DACHO", "division": "MROB/MRVP/EVPM", "idNum": "00000528", "userEmail": "DACHO@THAIOILGROUP.COM", "userPhone": "099999999", "userTel": "0299999999", "isEdit": false, "passportno": "AA5437854", "dateofissue": "06 OCT 2015", "dateofbirth": "06 OCT 1994", "dateofexpire": "07 OCT 2020", "imgpath": "https://tel.thaioilgroup.com/pic/TOP/", "imgprofilename": "528.jpg", "travel_topic": "Participate HAZOP/SIL Reviewwith EPC \u0026 PMC(6 people.)", "travel_topic_sub": "Participate HAZOP/SIL Reviewwith EPC \u0026 PMC(6 people.)", "business_date": "20 JAN 2019-20 APR 2019", "travel_date": "20 JAN 2019-20 APR 2019", "country_city": "Italy", "remark": null, "action_type": "update" },
      { "token_login": "4d80b2c4-d278-407f-a65a-231225873503", "doc_id": "OB20120006", "emp_id": "00000520", "id": "5", "user_admin": true, "age": "28", "org_unit": "MROB/MRVP/EVPM", "titlename": "Mr.", "firstname": "Boonsrang", "lastname": "Jindathai", "userDisplay": "Mr. Boonsrang Jindathai", "userName": "BOONSRANG", "division": "MROB/MRVP/EVPM", "idNum": "00000520", "userEmail": "BOONSRANG@THAIOILGROUP.COM", "userPhone": "099999999", "userTel": "0299999999", "isEdit": false, "passportno": "AA5437855", "dateofissue": "06 OCT 2015", "dateofbirth": "06 OCT 1994", "dateofexpire": "07 OCT 2020", "imgpath": "https://tel.thaioilgroup.com/pic/TOP/", "imgprofilename": "520.jpg", "travel_topic": "Participate HAZOP/SIL Reviewwith EPC \u0026 PMC(6 people.)", "travel_topic_sub": "Participate HAZOP/SIL Reviewwith EPC \u0026 PMC(6 people.)", "business_date": "20 JAN 2019-20 APR 2019", "travel_date": "20 JAN 2019-20 APR 2019", "country_city": "Italy", "remark": null, "action_type": "update" }
    ]

    return arr;
  }
}
