import {HttpClient} from '@angular/common/http';
import {Component, OnInit, ViewChild, TemplateRef, ElementRef, AfterViewInit, OnDestroy, Inject, forwardRef, ViewEncapsulation} from '@angular/core';

import { AppComponent } from '../../app.component';
import { FileuploadserviceService } from '../../ws/fileuploadservice/fileuploadservice.service';
import { AspxserviceService } from '../../ws/httpx/aspxservice.service';
import {DatePipe} from '@angular/common';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AlertServiceService } from '../../services/AlertService/alert-service.service';
import { SafePipe } from '../../safe.pipe';
import {DomSanitizer} from '@angular/platform-browser';
import { FooterComponent } from '../../components/footer/footer.component';
import {FormControl} from '@angular/forms';
import {Observable, of, ReplaySubject, Subject} from 'rxjs';
import {map, startWith, take, takeUntil} from 'rxjs/operators';
import {MatSelect} from '@angular/material/select';
import { HeaderComponent } from '../../components/header/header.component';

import {NavigationExtras, Router} from '@angular/router';
// import {BreakpointObserver, MediaMatcher, Breakpoints, BreakpointState} from '@angular/cdk/layout';
import { NgbCarousel, NgbSlideEvent, NgbSlideEventSource } from '@ng-bootstrap/ng-bootstrap';
// import { MasterComponent } from '../../screen/master/master.component';
//import select2 from "src/assets/app-assets/vendors/js/forms/select/select2.full.min.js"

declare const select2: any;

declare var $: any;

@Component({
  selector: 'app-ebizhome',
  templateUrl: './ebizhome.component.html',
  styleUrls: [ './ebizhome.component.css' ]
})
export class EbizhomeComponent implements OnInit, AfterViewInit, OnDestroy {

  mockImg = true;
  images = {
    imagespath1: 'assets/imgs/inner-page-hero.jpg',
    imagespath2: 'assets/imgs/bgtwo.jpeg',
    // Add more image paths as needed
  };

  imgPaths = {
    imgPath_1: "assets/imgs/inner-page-hero.jpg",
    imgPath_2: "assets/imgs/400300.png",
    imgPath_3_1: "assets/imgs/400300.png",
    imgPath_3_2: "assets/imgs/400300.png",
    imgPath_3_3: "assets/imgs/400300.png",
    imgPath_4: "assets/imgs/460300.png",
  };
  urlBanners = {
    url_banner_1: "",
    url_banner_2: "",
    url_banner_3: "",
  };
  selected = 'date';
  tpClone!: TemplateRef<any>;
  modalRef!: BsModalRef;
  editTypes = "";

  showEdit = true;
  dateFrom: Date [] | undefined;
  dateTo: Date [] | undefined;
  trainingDateFrom: any;
  trainingDateTo: any;
  isAdmin = false;
  htmlContent = '';
  lbInputFile = "Choose file";
  fileUploadTo: any = null;
  textPopupUpload = "";
  typeUploadTo = "";
  progressbar = false;
  textboxPopup = false;
  textWelcome = "";
  textWelDesc = "";
  textWelcomePopup = "";
  textWelDescPopup = "";
  txtBanner = "";
  bannerUrl = false;
  isLoading = false;
  isFirstLoading = false;
  travelingObjective = "";
  textBoxGetInTouch = false;
  textGetInTouchTitle = "";
  textGetInTouchEmail = "";
  textGetInTouchCallUs = "";
  textGetInTouchTitlePopup = "";
  textGetInTouchEmailPopup = "";
  textGetInTouchCallUsPopup = "";
  urlCarservice = "https://carservice.thaioilgroup.com/";
  urlIpettyCash = "http://i-link/ess1/Tcp.aspx";
  listContact: any[] = [];
  listMasterData: any[] = [];

  typeForSave = "";

  destination = "";
  myControl = new FormControl();
  filteredOptions!: Observable<string[]>;

  trainingDestination = "";
  trainingMyControl = new FormControl();
  trainingFilteredOptions!: Observable<string[]>;

  requestType = "oversea";
  destinationObj: any = {};

  trainingRequestType = "overseatraining";
  trainingDestinationObj: any = {};

  dataSource = ELEMENT_DATA;
  dataComingPlan: any[] = [];
  masterEmp: any[] = [];

  mailContactName = "";
  mailContactSubject = "";
  mailContactBody = "";

  urlApproval = "";
  urlEmployeePayment = "";
  urlOthers = "";
  urlTransportation = "";

  countryModel = {
    config: {
      displayKey: 'name',
      search: true,
      limitTo: 1000,
      height: "300px",
      // position: "absolute",
      placeholder: 'Select',
      // appendTo:"body"
    }
  }
  visa_nationality: any = [];
  model = {
    country: {
      list: [],
      select: [],
      settingSingle: {
        enableCheckAll: false,
        singleSelection: true,
        idField: 'name',
        textField: 'name',
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        itemsShowLimit: 100,
        allowSearchFilter: true,
        closeDropDownOnSelection: true
      },
      settingMulti: {
        enableCheckAll: false,
        singleSelection: false,
        idField: 'name',
        textField: 'name',
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        itemsShowLimit: 100,
        allowSearchFilter: true,
        closeDropDownOnSelection: true
      }
    },
  }
  country_list: any = [];
  country_list_training: any = [];

  /** list of banks */
  protected banks: Bank[] = BANKS;

  /** control for the selected bank */
  public bankCtrl: FormControl = new FormControl();

  /** control for the MatSelect filter keyword */
  public bankFilterCtrl: FormControl = new FormControl();

  /** list of banks filtered by search keyword */
  public filteredBanks: ReplaySubject<Bank[]> = new ReplaySubject<Bank[]>(1);

  @ViewChild('singleSelect', { static: true })
  singleSelect!: MatSelect;

  @ViewChild('carousel', { static: true }) carousel?: NgbCarousel;

  /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();

  data = {
    img_list: [ {
      img_header: "http://tbkc-dapps-05.thaioil.localnet/Ebiz_ws/image/home/w0002.jpg",
      img_personal_profile: "http://tbkc-dapps-05.thaioil.localnet/Ebiz_ws/image/home/w400300_4.jpg",
      img_banner_1: "http://tbkc-dapps-05.thaioil.localnet/Ebiz_ws/image/home/400x300.png",
      url_banner_1: "http://adb-thailand.com/",
      img_banner_2: "http://tbkc-dapps-05.thaioil.localnet/Ebiz_ws/image/home/400x300.png",
      url_banner_2: "http://adb-thailand.com/",
      img_banner_3: "http://tbkc-dapps-05.thaioil.localnet/Ebiz_ws/image/home/400x300.png",
      url_banner_3: "http://adb-thailand.com/",
      img_practice_areas: "http://tbkc-dapps-05.thaioil.localnet/Ebiz_ws/image/home/w460300_1.png",
    } ],
    up_coming_plan: [
      {
        date: "20/04/2021", //20 APR 21
        topic_of_traveling: "Retest Oversea // ไม่จำกัดวงเงิน Multiple (Many Country 2 person)",
        country: "Vietnam, Indonesia",
        business_date: "01 Apr 2021 - 16 Apr 2021",
        button_status: "1"
      },
      {
        date: "25/04/2021", //25 APR 21
        topic_of_traveling: "Retest Oversea // ไม่จำกัดวงเงิน Multiple (many country)",
        country: "China, India",
        business_date: "01 Aug 2021 - 20 Aug 2021",
        button_status: "7"
      },
      {
        date: "01/05/2021", //01 MAY 21
        topic_of_traveling: "Retest Oversea // <300,000 Multiple (one country)",
        country: "Australia",
        business_date: "06 Jun 2021 - 16 Jun 2021",
        button_status: "4"
      }
    ],
    text_title: "Welcome to E-Business Traveling Plan",
    text_desc: "E-Business Traveling Plan, is apps to help you running smoothty. While simple process will be a great fit here, power users might want to look into item to help with their scheduling needs. All these tools allow for easy access for multiple needs, from one-on-one meetings to group meetings. some let the invitee set up the appointment on your avallable dates.",
    text_contact_title: "We can't wait to hear from you!",
    text_contact_email: "toptravelservice@thaioilgroup.com",
    text_contact_tel: "3211, 3217",
    user_admin: true

  }

  dataContact = {
    contactus: [
      {
        name_th: "พิราภรณ์ วิวัฒน์เจริญกิจ",
        name_en: "Piraporn Wiwatjaroenkit",
        tel: "21632",
        mobile: "06-1919-6616",
        email: "pirapornw@thaioilgroup.com",
        img: ""
      },
      {
        name_th: "พิราภรณ์ วิวัฒน์เจริญกิจ2",
        name_en: "Piraporn Wiwatjaroenkit2",
        tel: "21632",
        mobile: "06-1919-6616",
        email: "pirapornw@thaioilgroup.com2",
        img: ""
      },
      {
        name_th: "พิราภรณ์ วิวัฒน์เจริญกิจ3",
        name_en: "Piraporn Wiwatjaroenkit3",
        tel: "21632",
        mobile: "06-1919-6616",
        email: "pirapornw@thaioilgroup.com3",
        img: ""
      }
    ]
  }

  url_employee_privacy_center: string = "";

  _dataSource: any = [];

  mediaMatch: boolean = true;

  mobileBatch: boolean = false;

  startIndex = 1;
  Imagedata: any = [ "http://tbkc-dapps-05.thaioil.localnet/Ebiz_ws/image/home/400x300.png", "http://tbkc-dapps-05.thaioil.localnet/Ebiz_ws/image/home/400x300.png", "http://tbkc-dapps-05.thaioil.localnet/Ebiz_ws/image/home/400x300.png" ];


  mainIndex!: number;
  public innerWidth: any;
  imageSource: any;
Object: any;


  constructor(
    // @Inject(forwardRef(() => HeaderComponent)) private appMain: HeaderComponent,
    // public ws: AspxserviceService,
    // private x: AppComponent,
    // private http: HttpClient,
    // private fileuploadservice: FileuploadserviceService,
    // public datepipe: DatePipe,
    // private modalService: BsModalService,
    // private alerts: AlertServiceService,
    // private sanitizer: DomSanitizer,
    // private router: Router,
    // private mediaMatcher: MediaMatcher,
    // public breakpointObserver: BreakpointObserver
  ) {

    // Check screen size
    // const mediaQueryList = mediaMatcher.matchMedia('(min-width: 1200px)');
    console.log('---mediaQueryList---');
    // console.log(mediaQueryList);
    // this.mediaMatch = mediaQueryList.matches;


    // if (mediaMatcher.matchMedia('(min-width: 992px)').matches) {
    //   this.mobileBatch = true;
    // }



    //encapsulation: ViewEncapsulation.None
    // const users: UserData[] = [];
    // for (let i = 1; i <= 100; i++) { users.push(createNewUser(i)); }

    // // Assign the data to the data source for the table to render
    // this.dataSource = new MatTableDataSource(users);
  }

  ngOnInit() {

    this.isFirstLoading = true;

    this.getContectAdmin();
    this.onload();

    //this.Repeat();

    this.innerWidth = window.innerWidth;
    console.log('this.innerWidth : ' + this.innerWidth);

    // this.breakpointObserver
    //   .observe([ Breakpoints.Small, Breakpoints.HandsetPortrait ])
    //   .subscribe((state: BreakpointState) => {
    //     if (state.matches) {
    //       console.log(
    //         'Matches small viewport or handset in portrait mode'
    //       );
    //     }
    //     //console.log('this.innerWidth : ' + this.innerWidth);
    //   });

    setTimeout(() => {
      this.mainIndex = 1;

    }, 800);
    setTimeout(() => {
      this.mainIndex = 0;
    }, 1600);

    // console.log('admin : ' + this.isAdmin);

  }

  onSlide(slideEvent: NgbSlideEvent) {
    if (
      slideEvent.paused &&
      (slideEvent.source === NgbSlideEventSource.ARROW_LEFT || slideEvent.source === NgbSlideEventSource.ARROW_RIGHT)
    ) {

    }
    if (!slideEvent.paused && slideEvent.source === NgbSlideEventSource.INDICATOR) {

    }
  }

  onResize(event : any) {
    console.log(
      'onResize : ' +
      event.target.innerWidth
    );
  }

  getCurrentYear() {
    const date = new Date();
    return date.getFullYear();
  }

  openDocument(doc_id : number, part: string) {
    //alert(doc_id);
    //status === '1' ? 'CONFIRM' : status === '2' ? 'DRAFT' : status === '3' ? 'CAP APPROVE' : status === '4' ? 'VERIFYING' : status === '5' ? 'TO BE APPROVED' : status === '6' ? 'APPROVED' : status === '7' ? 'REJECTED' : '';

    //let part = status === '1' || status === '2' ? "1" : status === '3' || status === '4' ? "2" : status === '5' ? "3" : status === '6' ? "4" : "1";

    var states = "i"
    switch (part) {
      case "1": states = "i"; break;
      case "2": states = "ii"; break;
      case "3": states = "iii"; break;
      case "4": states = "cap"; break;
      default: states = "i"; break;
    }
    // this.router.navigate([ '/main/request/edit', doc_id, states ]);
    // let url = '/main/request/edit/'+ doc_id +'/'+ states;
    // window.open(url, "_blank");
  }

  testCallAsmx() {

    this.isLoading = true;
    //ถ้าไม่มีข้อมูลให้ใส่ขีด - แทนค่าว่างก่อนส่งไป
    let bodyX = {
      "token_login": localStorage[ "token" ],
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

    const onSuccess = (data: any) => {
      console.log('***Call Asmx***');
      // console.log(data);
      // console.log(data.d);

      var parsed = $.parseJSON(data.d);
      console.log(parsed);
      console.log(parsed.dtResult);

      if (parsed.dtResult[ 0 ].status === 'true') {
        console.log(parsed.dtResult[ 0 ].file_system_path);
        console.log(parsed.dtResult[ 0 ].file_outbound_path);
        console.log(parsed.dtResult[ 0 ].file_outbound_name);

        //เอาไว้ทดลองว่า gen file ได้มั้ยโดยการลอง save as
        // this.ws.downloadFile(parsed.dtResult[ 0 ].file_outbound_path, parsed.dtResult[ 0 ].file_outbound_name);

        this.isLoading = false;
      }
      else {
        this.isLoading = false;
        // this.alerts.swal_error(parsed.dtResult[ 0 ].status);
      }
    }

    //data, function name(ฝั่ง asmx), method name
    // this.ws.callWs_asmx(bodyX, 'Report', 'insurance').subscribe(data => onSuccess(data), error => {
    //   this.isFirstLoading = false
    //   console.log(error);
    //   alert('Can\'t call web api.' + ' : ' + error.message);
    // })
  }

  // Repeat() {
  //   setTimeout(() => {
  //     this.__FunctionSlide();
  //     this.Repeat();
  //   }, 2000);
  // }

  // __FunctionSlide() {
  //   const slides = Array.from(document.getElementsByClassName('mall-show-slide'));
  //   if (slides === []) {
  //     this.Repeat();
  //   }
  //   for (const x of slides) {
  //     const y = x as HTMLElement;
  //     y.style.display = 'none';
  //   }
  //   if (this.startIndex > slides.length - 1) {
  //     this.startIndex = 0;
  //     const slide = slides[this.startIndex] as HTMLElement;
  //     slide.style.display = 'block';
  //     this.startIndex++;
  //   } else {

  //     const slide = slides[this.startIndex] as HTMLElement;
  //     slide.style.display = 'block';
  //     this.startIndex++;
  //   }
  // }

  selectedOption(event : any, type: string) {
    console.log(event.option.value);
    console.log(type);
    if (type === "business") {

      this.destinationObj = event.option.value;
      this.destination = event.option.value.name;
    }
    else {
      this.trainingDestinationObj = event.option.value;
      this.trainingDestination = event.option.value.name;
    }
  }

  displayName(list : any) {
    return list.name;
  }
  private _filter(value: any): any[] {
    const filterValue = value;//value.toLowerCase();

    return this.country_list.filter((option: { name: string; }) => option.name.toLowerCase().includes(filterValue.toLowerCase()));
  }
  private _filter_training(value: any): any[] {
    const filterValue = value;//value.toLowerCase();

    return this.country_list_training.filter((option: { name: string; }) => option.name.toLowerCase().includes(filterValue.toLowerCase()));
  }

  ngAfterViewInit() {
    this.setInitialValue();
  }
  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  getContectAdmin() {

    let bodyX = {
      "token_login": localStorage[ "token" ],
      "filter_value": "contact_admin"
    }

    //console.log(bodyX)

    const onSuccess = (data : any) => {

      console.log('---LoadEmpRoletList---');
      console.log(data);

      this.dataContact.contactus = data.emprole_list;

      this.listContact = this.dataContact.contactus;

      console.log(this.dataContact);
    }

    // this.ws.callWs(bodyX, 'LoadEmpRoletList').subscribe(data => onSuccess(data), error => {

    //   console.log(error);
    //   alert('Can\'t call web api.' + ' : ' + error.message);
    // })
  }

  /**
   * Sets the initial value after the filteredBanks are loaded initially
   */
  protected setInitialValue() {
    this.filteredBanks
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        // setting the compareWith property to a comparison function
        // triggers initializing the selection according to the initial value of
        // the form control (i.e. _initializeSelection())
        // this needs to be done after the filteredBanks are loaded initially
        // and after the mat-option elements are available
        this.singleSelect.compareWith = (a: Bank, b: Bank) => a && b && a.id === b.id;
      });
  }

  protected filterBanks() {
    if (!this.banks) {
      return;
    }
    // get the search keyword
    let search = this.bankFilterCtrl.value;
    if (!search) {
      this.filteredBanks.next(this.banks.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredBanks.next(
      this.banks.filter(bank => bank.name.toLowerCase().indexOf(search) > -1)
    );
  }

  onload() {
    //this.getUrl();

    let bodyX = {
      "token_login": localStorage[ "token" ],
      "doc_id": ''
    }

    const onSuccess = (data : any) => {
      console.log("---LOAD EBIZ HOME SUCCESS---")
      console.log(data);

      this._dataSource = data;

      this.imgPaths.imgPath_1 = data.img_list[ 0 ].img_header.replace(" ", "%20");
      this.imgPaths.imgPath_2 = data.img_list[ 0 ].img_personal_profile.replace(" ", "%20");

      this.imgPaths.imgPath_3_1 = data.img_list[ 0 ].img_banner_1.replace(" ", "%20");
      this.urlBanners.url_banner_1 = data.img_list[ 0 ].url_banner_1;
      this.imgPaths.imgPath_3_2 = data.img_list[ 0 ].img_banner_2.replace(" ", "%20");
      this.urlBanners.url_banner_2 = data.img_list[ 0 ].url_banner_2;
      this.imgPaths.imgPath_3_3 = data.img_list[ 0 ].img_banner_3.replace(" ", "%20");
      this.urlBanners.url_banner_3 = data.img_list[ 0 ].url_banner_3;
      this.imgPaths.imgPath_4 = data.img_list[ 0 ].img_practice_areas.replace(" ", "%20");

      this.textWelcome = data.text_title;
      this.textWelDesc = data.text_desc;
      this.textWelcomePopup = data.text_title;
      this.textWelDescPopup = data.text_desc;

      this.dataComingPlan = data.up_coming_plan;
      this.textGetInTouchTitle = data.text_contact_title;
      this.textGetInTouchEmail = data.text_contact_email;
      this.textGetInTouchCallUs = data.text_contact_tel;

      this.textGetInTouchTitlePopup = data.text_contact_title;
      this.textGetInTouchEmailPopup = data.text_contact_email;
      this.textGetInTouchCallUsPopup = data.text_contact_tel;

      this.urlApproval = data.practice_areas[ 0 ].url_approval;
      this.urlEmployeePayment = data.practice_areas[ 0 ].url_employee_payment;
      this.urlOthers = data.practice_areas[ 0 ].url_others;
      this.urlTransportation = data.practice_areas[ 0 ].url_transportation;

      this.url_employee_privacy_center = data.url_employee_privacy_center;

      //this.listContact = this.dataContact.contactus;
      this.isAdmin = data.user_admin;

      let body2 = {
        "token_login": localStorage[ "token" ],
        "page": "",
        "module_name": "master zone and country"
      }
      const onSuccess2 = (data : any) => {
        console.log('---load master sucess---');
        console.log(data);
        this.listMasterData = data;
        this.country_list = data.master_country;
        this.country_list_training = data.master_country;
        //console.log(this.country_list);

        this.filteredOptions = this.myControl.valueChanges
          .pipe(
            startWith(''),
            map(value => this._filter(value))
          );
        this.trainingFilteredOptions = this.trainingMyControl.valueChanges
          .pipe(
            startWith(''),
            map(value => this._filter_training(value))
          );
        setTimeout(() => {
          this.isFirstLoading = false;
          var contentX = document.getElementById("contentX");
          contentX!.classList.remove("d-none");
        }, 800);
      }

      // this.ws.callWs(body2, 'LoadMasterData').subscribe(data => onSuccess2(data), error => {
      //   this.isFirstLoading = false
      //   console.log(error);
      //   alert('Can\'t call web api.' + ' : ' + error.message);
      // })

    }
    // this.ws.callWs(bodyX, 'LoadPortal').subscribe(data => onSuccess(data), error => {
    //   this.isFirstLoading = false
    //   console.log(error);
    //   alert('Can\'t call web api.' + ' : ' + error.message);
    // })

  }

  changeRequestType(event : string) {
    console.log(event);
    //console.log(this.requestType)
    //debugger;
    if (event === 'oversea') {
      this.country_list = this.listMasterData[0].master_country;
    }
    else if (event === 'local') {

      this.country_list = this.listMasterData[0].master_province;
    }
    else if (event === 'overseatraining') {
      this.country_list_training = this.listMasterData[0].master_country;
    }
    else if (event === 'localtraining') {

      this.country_list_training = this.listMasterData[0].master_province;
    }
    else {
      //this.country_list = [];
    }
    if (event === 'oversea' || event === 'local') {
      this.filteredOptions = this.myControl.valueChanges
        .pipe(
          startWith(''),
          map(value => this._filter(value))
        );
    }
    else {
      this.trainingFilteredOptions = this.trainingMyControl.valueChanges
        .pipe(
          startWith(''),
          map(value => this._filter_training(value))
        );
    }
  }

  getDateformat(dateString: string, formatType: string): string {
    if (!dateString) {
      console.error('Invalid date string provided');
      return '';
    }
  
    const dateParts = dateString.split('/');
    if (dateParts.length !== 3) {
      console.error('Invalid date format. Expected format: DD/MM/YYYY');
      return '';
    }
  
    const day = +dateParts[0];
    const month = +dateParts[1] - 1; // Month is 0-indexed
    const year = +dateParts[2];
    
    if (isNaN(day) || isNaN(month) || isNaN(year)) {
      console.error('Invalid date components');
      return '';
    }
  
    const dateObject = new Date(year, month, day);
    const datePipe = new DatePipe('en-US');
  
    let formattedDate = '';
    switch (formatType) {
      case 'DM':
        formattedDate = datePipe.transform(dateObject, 'dd MMM') || '';
        break;
      case 'YY':
        formattedDate = datePipe.transform(dateObject, 'yy') || '';
        break;
      default:
        console.error('Invalid format type');
        break;
    }
  
    return formattedDate;
  }

  getClassStatus(status : any) {

    return status === '1' ? 'CONFIRM' : status === '2' ? 'DRAFT' : status === '3' ? 'CAP APPROVE' : status === '4' ? 'VERIFYING' : status === '5' ? 'TO BE APPROVED' : status === '6' ? 'APPROVED' : status === '7' ? 'REJECTED' : '';

  }

  getUrl() {
    if (this.mockImg) {
      this.imgPaths.imgPath_1 = this.data.img_list[ 0 ].img_header; //"assets/imgs/w0002.jpg";
      this.imgPaths.imgPath_2 = this.data.img_list[ 0 ].img_personal_profile;//"assets/imgs/w400300_4.jpg";
      //this.imgPath_3 = "assets/imgs/w1500300_2.jpg";
      this.imgPaths.imgPath_3_1 = this.data.img_list[ 0 ].img_banner_1;
      this.urlBanners.url_banner_1 = this.data.img_list[ 0 ].url_banner_1;
      this.imgPaths.imgPath_3_2 = this.data.img_list[ 0 ].img_banner_2;
      this.urlBanners.url_banner_2 = this.data.img_list[ 0 ].url_banner_2;
      this.imgPaths.imgPath_3_3 = "";//this.data.img_list[0].img_banner_3;
      this.urlBanners.url_banner_3 = "";
      this.imgPaths.imgPath_4 = this.data.img_list[ 0 ].img_practice_areas;//"assets/imgs/w460300_1.png";
    }
    this.textWelcome = this.data.text_title;
    this.textWelDesc = this.data.text_desc;
    this.dataComingPlan = this.data.up_coming_plan;
    this.textGetInTouchTitle = this.data.text_contact_title;
    this.textGetInTouchEmail = this.data.text_contact_email;
    this.textGetInTouchCallUs = this.data.text_contact_tel;

    this.listContact = this.dataContact.contactus;
  }

  edit(modules: string) {
    //alert(modules);
    //this.openModalx(template);
  }

  showHideBtnEdit() {
    this.showEdit = !this.showEdit;
    //this.alerts.toastr_error('xxxx');
  }

  openModalx(template: TemplateRef<any>, types: string) {
    //console.log(types);
    this.typeUploadTo = "";
    this.imageSource = "";
    this.lbInputFile = "Choose file";
    this.fileUploadTo = null;
    this.typeForSave = "";
    this.txtBanner = "";


    if (types === 'bg_top_header') {this.typeForSave = "img_header", this.imageSource = 'assets/imgs/inner-page-hero.jpg'; this.textPopupUpload = "1500 x 500"; this.textboxPopup = false; this.bannerUrl = false; this.textBoxGetInTouch = false;}
    else if (types === 'bg_personal_profile') {this.typeForSave = "img_personal_profile", this.imageSource = 'assets/imgs/400300.png'; this.textPopupUpload = "400 x 300"; this.textboxPopup = false; this.bannerUrl = false; this.textBoxGetInTouch = false;}
    else if (types === 'bg_banner_1') {this.typeForSave = "img_banner_1", this.imageSource = 'assets/imgs/400300.png'; this.textPopupUpload = "400 x 300"; this.textboxPopup = false; this.bannerUrl = true; this.textBoxGetInTouch = false;}
    else if (types === 'bg_banner_2') {this.typeForSave = "img_banner_2", this.imageSource = 'assets/imgs/400300.png'; this.textPopupUpload = "400 x 300"; this.textboxPopup = false; this.bannerUrl = true; this.textBoxGetInTouch = false;}
    else if (types === 'bg_banner_3') {this.typeForSave = "img_banner_3", this.imageSource = 'assets/imgs/400300.png'; this.textPopupUpload = "400 x 300"; this.textboxPopup = false; this.bannerUrl = true; this.textBoxGetInTouch = false;}
    else if (types === 'bg_practice_areas') {this.typeForSave = "img_practice_areas", this.imageSource = 'assets/imgs/460300.png'; this.textPopupUpload = "460 x 300"; this.textboxPopup = false; this.bannerUrl = false; this.textBoxGetInTouch = false;}
    else if (types === 'txt_welcome') {this.typeForSave = "title", this.textboxPopup = true; this.bannerUrl = false; this.textBoxGetInTouch = false;}
    else if (types === 'contact') {this.typeForSave = "get_in_touch", this.textboxPopup = false; this.bannerUrl = false; this.textBoxGetInTouch = true;}
    else {this.imageSource = 'assets/imgs/400300.png'; this.textPopupUpload = ""; this.textBoxGetInTouch = false;}

    if (types === "bg_banner_1") {
      this.txtBanner = this._dataSource.img_list[ 0 ].url_banner_1;
    }
    else if (types === "bg_banner_2") {
      this.txtBanner = this._dataSource.img_list[ 0 ].url_banner_2;
    }
    else if (types === "bg_banner_3") {
      this.txtBanner = this._dataSource.img_list[ 0 ].url_banner_3;
    }

    this.typeUploadTo = types;

    this.editTypes = types;
    this.tpClone = template;
    let config: object = {
      class: "modal-lg",
      animated: true,
      keyboard: false,
      ignoreBackdropClick: true,

    };
    // this.modalRef = this.modalService.show(template, config);
    // var configx = $("#exampleModalCenter").closest('.modal-backdrop').addClass('z-index:1100');

  }

  selectionChanges(type: string, event : any) {
    console.log(event);
    //alert(type);

  }

  getBase64(event : any) {
    this.progressbar = true;
    $("#imgEx").removeClass("animate__animated animate__flipInX");
    setTimeout(() => {

      let me = this;
      let file = event.target.files[ 0 ];
      this.fileUploadTo = file;
      //this.lbInputFile = file.name;
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
        //me.modelvalue = reader.result;
        me.lbInputFile = file.name;
        const f: string | ArrayBuffer = reader.result as string;
        me.htmlContent = f;
        // me.imageSource = me.sanitizer.bypassSecurityTrustResourceUrl(`${me.htmlContent}`);
        //console.log(reader.result);
      };
      reader.onerror = function (error) {
        console.log('Error: ', error);
        // me.alerts.swal_error(error.toString());
      };

      //console.log(this.fileUploadTo);
      this.progressbar = false;
      $("#imgEx").addClass("animate__animated animate__flipInX"); //.removeClass("d-none");

    }, 1000);

  }

  cancelUpload() {
    this.lbInputFile = "Choose file";
    this.typeUploadTo = "";
    this.imageSource = "";
    this.modalRef.hide();
    this.fileUploadTo = null;
  }

  uploadFile() {
    this.isLoading = true;
    console.log('---uploadFile---');
    console.log(this.fileUploadTo);

    //this.appMain.isLoading = true;

    let body = [ {
      param: "file_typename",
      value: this.typeForSave
    } ]


    const onSuccess = (res : any) => {
      this.modalRef.hide();


      if (res.after_trip.opt1 == "true") {
        console.log("---Upload image success---");
        console.log(res);

        this.saveText(res.img_list.fullname);
        //this.alerts.toastr_sucess('Upload file complete.');

      }
      else {
        console.log('---error---');
        console.log(res);
        // this.alerts.swal_error(res.after_trip.opt2.status);
        // this.appMain.isLoading = false
      }

    }

    // this.fileuploadservice.postFile_Custom(this.fileUploadTo, "0", "portal", "0", body).subscribe(res => onSuccess(res), error => {
    //   this.appMain.isLoading = false;
    //   console.log(error);
    //   alert('error!');
    // })
  }

  saveText(types : any) {
    //this.isLoading = true;

    if (this.typeForSave === "title") {
      this._dataSource.action_change_imgname = "title";
      this._dataSource.text_title = this.textWelcomePopup;
      this._dataSource.text_desc = this.textWelDescPopup;

    }
    else if (this.typeForSave === "get_in_touch") {
      this._dataSource.action_change_imgname = "get_in_touch";
      this._dataSource.text_contact_title = this.textGetInTouchTitlePopup;
      this._dataSource.text_contact_email = this.textGetInTouchEmailPopup;
      this._dataSource.text_contact_tel = this.textGetInTouchCallUsPopup;
    }
    else if (this.typeForSave === "img_header") {
      this._dataSource.action_change_imgname = "img_header";
      this._dataSource.img_list[ 0 ].img_header = types;
    }
    else if (this.typeForSave === "img_personal_profile") {
      this._dataSource.action_change_imgname = "img_personal_profile";
      this._dataSource.img_list[ 0 ].img_personal_profile = types;
    }
    else if (this.typeForSave === "img_practice_areas") {
      this._dataSource.action_change_imgname = "img_practice_areas";
      this._dataSource.img_list[ 0 ].img_practice_areas = types;
    }
    else if (this.typeForSave === "img_banner_1") {
      this._dataSource.action_change_imgname = "img_banner_1";
      this._dataSource.img_list[ 0 ].img_banner_1 = types;
      this._dataSource.img_list[ 0 ].url_banner_1 = this.txtBanner;
    }
    else if (this.typeForSave === "img_banner_2") {
      this._dataSource.action_change_imgname = "img_banner_2";
      this._dataSource.img_list[ 0 ].img_banner_2 = types;
      this._dataSource.img_list[ 0 ].url_banner_2 = this.txtBanner;
    }
    else if (this.typeForSave === "img_banner_3") {
      this._dataSource.action_change_imgname = "img_banner_3";
      this._dataSource.img_list[ 0 ].img_banner_3 = types;
      this._dataSource.img_list[ 0 ].url_banner_3 = this.txtBanner;
    }

    this._dataSource.token_login = localStorage[ "token" ];
    console.log('---Before save---');
    // console.log(this.textWelcome);
    // console.log(this.textWelDesc);
    console.log(this._dataSource);


    const onSuccess = (data : any) => {
      console.log("---save success---")
      console.log(data);
      if (data.after_trip.opt1 == "true") {

        setTimeout(() => {
          this._dataSource = data;

          this.imgPaths.imgPath_1 = data.img_list[ 0 ].img_header;
          this.imgPaths.imgPath_2 = data.img_list[ 0 ].img_personal_profile;

          this.imgPaths.imgPath_3_1 = data.img_list[ 0 ].img_banner_1;
          this.urlBanners = data.img_list[ 0 ].url_banner_1;
          this.imgPaths.imgPath_3_2 = data.img_list[ 0 ].img_banner_2;
          this.urlBanners = data.img_list[ 0 ].url_banner_2;
          this.imgPaths.imgPath_3_3 = data.img_list[ 0 ].img_banner_3;
          this.urlBanners = data.img_list[ 0 ].url_banner_3;
          this.imgPaths = data.img_list[ 0 ].img_practice_areas;

          this.textWelcome = data.text_title;
          this.textWelDesc = data.text_desc;
          this.textWelcomePopup = data.text_title;
          this.textWelDescPopup = data.text_desc;

          this.dataComingPlan = data.up_coming_plan;
          this.textGetInTouchTitle = data.text_contact_title;
          this.textGetInTouchEmail = data.text_contact_email;
          this.textGetInTouchCallUs = data.text_contact_tel;

          this.textGetInTouchTitlePopup = data.text_contact_title;
          this.textGetInTouchEmailPopup = data.text_contact_email;
          this.textGetInTouchCallUsPopup = data.text_contact_tel;


          this.modalRef.hide();
          this.isLoading = false;
          // this.alerts.swal_sucess(data.after_trip.opt2.status);
        }, 1000);


      }
      else {
        this.isLoading = false;
        console.log('---error---');
        console.log(data);
        // this.alerts.swal_error(data.after_trip.opt2.status);

      }
    }
    // this.ws.callWs(this._dataSource, 'SavePortal').subscribe(data => onSuccess(data), error => {
    //   this.isLoading = false
    //   console.log(error);
    //   alert('Can\'t call web api.' + ' : ' + error.message);
    // })
  }

  gotoUrl(url: string) {

    console.log(url);
    if (url != "") {
      let sp = url.split('http');
      if (sp.length <= 1) {url = 'http://' + url;}
      //alert(sp.length);
      window.open(url, "_blank");
    }
  }

  loadEmpList() {

    let bodyX = {
      "token_login": localStorage[ "token" ],
      "filter_value": ''
    }

    this.isLoading = true;
    const onSuccess = (data : any) => {
      console.log("---load success---")
      console.log(data);
      if (data.after_trip.opt1 == "true") {

        this.masterEmp = data.emp_list;
        //console.log(this.masterEmp);
        this.isLoading = false;
      }
      else {
        this.isLoading = false;
        console.log('---error---');
        console.log(data);
        // this.alerts.swal_error(data.after_trip.opt2.status);
        // Swal.fire(
        //   'Error!',
        //   'Error : ' + data.after_trip.opt2.status,
        //   'error'
        // )
      }
    }
    // this.ws.callWs(bodyX, 'LoadEmployeeList').subscribe(data => onSuccess(data), error => {
    //   this.isLoading = false
    //   console.log(error);
    //   alert('Can\'t call web api.' + ' : ' + error.message);
    // })
  }

  openModalContact(templateX: TemplateRef<any>, types: string) {
    // openModalx(types: string) {
    //console.log(types);
    this.editTypes = types;
    //this.tp_clone = templateX;
    let config: object = {
      class: "modal-lg",
      animated: true,
      keyboard: false,
      ignoreBackdropClick: true,

    };
    //console.log(this.template)
    // this.modalRef = this.modalService.show(templateX, config);
    // var configx = $("#exampleModalCenter").closest('.modal-backdrop').addClass('z-index:1100');

  }


  goto() {
    //debugger;
    if (this.destination === "") {this.destinationObj = {};}
    console.log(this.requestType);
    console.log(this.destinationObj);
    let typeStr = "";
    let name = "";
    // !this.ws.isEmpty(this.destinationObj) ? typeStr = this.destinationObj.id : typeStr = "";

    console.log(typeStr);

    let dateF;// = this.dateFrom === undefined || this.dateFrom.setHours(20, 21, 22) === "" ? "" : new Date(this.dateFrom);
    let dateT;

    if (this.dateFrom != undefined && this.dateFrom != null && this.dateFrom.length === 2) {
      dateF = new Date(this.dateFrom[ 0 ].setHours(20, 21, 22));
      dateT = new Date(this.dateFrom[ 1 ].setHours(20, 21, 22));
    }
    else {
      dateF = "";
      dateT = "";
    }

    const navigationExtras: NavigationExtras = {
      //queryParams
      queryParams: {
        // id: 1,
        country_id: typeStr,
        // dateFrom: dateF,
        // dateTo: this.dateTo === undefined || this.dateTo.setHours(20, 21, 22) === "" ? "" : new Date(this.dateTo),
        dateFrom: dateF,
        dateTo: dateT,
        requestType: this.requestType
      },
      skipLocationChange: false,
      fragment: 'top'
    };

    console.log('---send params from ebizhome to create---');
    console.log(navigationExtras.queryParams);

    // Navigate to component B
    // this.router.navigate([ 'main/request/create/' + this.requestType + '/i' ], {
    //   state: {requestDetails: navigationExtras}
    // });

    // this.router.navigate(['main/request/create/' + this.requestType + '/i', { pm: typeStr }]);
    //this.router.navigate(['main/request/create/' + this.requestType + '/i'], { queryParams: { pm: typeStr }});
  }

  goto_training_trip() {
    ////debugger;
    if (this.trainingDestination === "") {this.trainingDestinationObj = {};}
    console.log(this.trainingRequestType);
    console.log(this.trainingDestinationObj);
    let typeStr = "";
    let name = "";
    // !this.ws.isEmpty(this.trainingDestinationObj) ? typeStr = this.trainingDestinationObj.id : typeStr = "";

    console.log(typeStr);

    //let dateF = this.training_dateFrom === undefined || this.training_dateFrom.setHours(20, 21, 22) === "" ? "" : new Date(this.training_dateFrom);
    let dateF;// = this.dateFrom === undefined || this.dateFrom.setHours(20, 21, 22) === "" ? "" : new Date(this.dateFrom);
    let dateT;

    if (this.trainingDateFrom != undefined && this.trainingDateFrom != null && this.trainingDateFrom.length === 2) {
      dateF = new Date(this.trainingDateFrom[ 0 ].setHours(20, 21, 22));
      dateT = new Date(this.trainingDateFrom[ 1 ].setHours(20, 21, 22));
    }
    else {
      dateF = "";
      dateT = "";
    }

    const navigationExtras: NavigationExtras = {
      //queryParams
      queryParams: {
        // id: 1,
        country_id: typeStr,
        // dateFrom: dateF,
        // dateTo: this.training_dateTo === undefined || this.training_dateTo.setHours(20, 21, 22) === "" ? "" : new Date(this.training_dateTo),
        dateFrom: dateF,
        dateTo: dateT,
        requestType: this.trainingRequestType
      },
      skipLocationChange: false,
      fragment: 'top'
    };

    console.log('---send params from ebizhome to create---');
    console.log(navigationExtras.queryParams);

    // Navigate to component B
    // this.router.navigate([ 'main/request/create/' + this.trainingRequestType + '/i' ], {
    //   state: {requestDetails: navigationExtras}
    // });

  }

  sendMail() {

    this.isLoading = true;


    this._dataSource.text_name = this.mailContactName;
    this._dataSource.text_subject = this.mailContactSubject;
    this._dataSource.text_message = this.mailContactBody;
    console.log("---after send mail success---")
    console.log(this._dataSource);
    const onSuccess = (data : any) => {
      console.log("---send mail success---")
      console.log(data);
      if (data.after_trip.opt1 == "true") {

        // this.alerts.toastr_success(data.after_trip.opt2.status);
        this.isLoading = false;
      }
      else {
        this.isLoading = false;
        console.log('---send mail error---');
        console.log(data);
        // this.alerts.swal_error(data.after_trip.opt2.status);

      }
    }
    // this.ws.callWs(this._dataSource, 'SendMailContact').subscribe(data => onSuccess(data), error => {
    //   this.isLoading = false
    //   console.log(error);
    //   alert('Can\'t call web api.' + ' : ' + error.message);
    // })

  }

  parseDate(dateString: string): Date {
    const months: { [key: string]: number } = {
      jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
      jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11
    };
  
    const dateParts = dateString.split(' ');
    if (dateParts.length !== 3) {
      console.error('Invalid date format. Expected format: DD Mon YYYY');
      return new Date(); // Return current date if parsing fails
    }
  
    const day = parseInt(dateParts[0], 10);
    const month = months[dateParts[1].toLowerCase()];
    const year = parseInt(dateParts[2], 10);
  
    if (isNaN(day) || isNaN(month) || isNaN(year)) {
      console.error('Invalid date components');
      return new Date(); // Return current date if parsing fails
    }
  
    return new Date(year, month, day);
  }
  
  navigateWithArray(): void {
    //debugger;
    // Create our query parameters object
    const queryParams: any = {};
    // Create our array of values we want to pass as a query parameter
    const arrayOfValues = [ 'a', 'b', 'c', 'd' ];

    // Add the array of values to the query parameter as a JSON string
    queryParams.myArray = JSON.stringify(arrayOfValues);

    // Create our 'NaviationExtras' object which is expected by the Angular Router
    const navigationExtras: NavigationExtras = {
      //queryParams
      queryParams: {
        // id: 1,
        productName: 'Netgear Cable Modem',
        productCode: 'CM700',
        description: 'Netgear Cable Modem compatible with all cables',
        prodRating: 4.9
      },
      skipLocationChange: false,
      fragment: 'top'
    };

    // Navigate to component B
    // this.router.navigate([ 'main/request/create/' + this.requestType + '/i' ], {
    //   state: {requestDetails: navigationExtras}
    // });
    //this.router.navigate(['/componentB'], navigationExtras);
  }


}

// function isEmpty(obj) {
//   var hasOwnProperty = Object.prototype.hasOwnProperty;
//   // null and undefined are "empty"
//   if (obj == null) return true;

//   // Assume if it has a length property with a non-zero value
//   // that that property is correct.
//   if (obj.length > 0) return false;
//   if (obj.length === 0) return true;

//   // If it isn't an object at this point
//   // it is empty, but it can't be anything *but* empty
//   // Is it empty?  Depends on your application.
//   if (typeof obj !== "object") return true;

//   // Otherwise, does it have any properties of its own?
//   // Note that this doesn't handle
//   // toString and valueOf enumeration bugs in IE < 9
//   for (var key in obj) {
//     if (hasOwnProperty.call(obj, key)) return false;
//   }

//   return true;
// }
export interface PeriodicElement {
  position: number;
  menu: string;
  url: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, menu: 'Personal Details', url: '/master/personal/travelerhistory'},
  {position: 2, menu: 'Passport', url: '/master/personal/passport'},
  {position: 3, menu: 'VISA', url: '/master/personal/visa'},
  {position: 3, menu: 'Travel Record', url: '/master/personal/travelrecord'},
];

const ELEMENT_DATA_USER: PeriodicElement[] = [

];

export interface Bank {
  id: string;
  name: string;
}
/** list of banks */
export const BANKS: Bank[] = [
  {name: 'All', id: 'All'},
  {name: 'Bank A (Switzerland)', id: 'A'},
  {name: 'Bank B (Switzerland)', id: 'B'},
  {name: 'Bank C (France)', id: 'C'},
  {name: 'Bank D (France)', id: 'D'},
  {name: 'Bank E (France)', id: 'E'},
  {name: 'Bank F (Italy)', id: 'F'},
  {name: 'Bank G (Italy)', id: 'G'},
  {name: 'Bank H (Italy)', id: 'H'},
  {name: 'Bank I (Italy)', id: 'I'},
  {name: 'Bank J (Italy)', id: 'J'},
  {name: 'Bank Kolombia (United States of America)', id: 'K'},
  {name: 'Bank L (Germany)', id: 'L'},
  {name: 'Bank M (Germany)', id: 'M'},
  {name: 'Bank N (Germany)', id: 'N'},
  {name: 'Bank O (Germany)', id: 'O'},
  {name: 'Bank P (Germany)', id: 'P'},
  {name: 'Bank Q (Germany)', id: 'Q'},
  {name: 'Bank R (Germany)', id: 'R'}
];


// /** Builds and returns a new User. */
// function createNewUser(id: number): UserData {
//   const name =
//       NAMES[Math.round(Math.random() * (NAMES.length - 1))] + ' ' +
//       NAMES[Math.round(Math.random() * (NAMES.length - 1))].charAt(0) + '.';

//   return {
//     id: id.toString(),
//     name: name,
//     progress: Math.round(Math.random() * 100).toString(),
//     color: COLORS[Math.round(Math.random() * (COLORS.length - 1))]
//   };
// }

// /** Constants used to fill up our data base. */
// const COLORS = ['maroon', 'red', 'orange', 'yellow', 'olive', 'green', 'purple',
//   'fuchsia', 'lime', 'teal', 'aqua', 'blue', 'navy', 'black', 'gray'];
// const NAMES = ['Maia', 'Asher', 'Olivia', 'Atticus', 'Amelia', 'Jack',
//   'Charlotte', 'Theodore', 'Isla', 'Oliver', 'Isabella', 'Jasper',
//   'Cora', 'Levi', 'Violet', 'Arthur', 'Mia', 'Thomas', 'Elizabeth'];

// export interface UserData {
//   id: string;
//   name: string;
//   progress: string;
//   color: string;
// }

// export interface PeriodicElement {
//   name: string;
//   position: number;
//   weight: number;
//   symbol: string;
// }

// const ELEMENT_DATA: PeriodicElement[] = [
//   {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
//   {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
//   {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
//   {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
//   {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
//   {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
//   {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
//   {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
//   {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
//   {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
// ];


