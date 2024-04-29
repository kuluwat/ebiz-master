import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  forwardRef,
  Inject,
  OnInit,
  Renderer2,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { AppComponent } from '../../app.component';
import { MainComponent } from '../../components/main/main.component';
import { AlertServiceService } from '../../services/AlertService/alert-service.service';
import { MaintainComponent } from '../maintain/maintain.component';
import { FileuploadserviceService } from '../../ws/fileuploadservice/fileuploadservice.service';
import { AspxserviceService } from '../../ws/httpx/aspxservice.service';
import * as fs from 'file-saver';
import { NgModel } from '@angular/forms';
import { CloneDeep } from '../../screen/master/transportation/transportation/transportation.component';
import { isArray } from 'util';
declare var $: any;
@Component({
  selector: 'app-mtvisacountries',
  templateUrl: './mtvisacountries.component.html',
  styleUrls: ['./mtvisacountries.component.css'],
})
export class MtvisacountriesComponent implements OnInit {
  @ViewChild('cancel', { static: true }) btnCloseX: ElementRef;

  selectedFile: File = null;
  tp_clone: TemplateRef<any>;
  modalRef: BsModalRef;
  ArrData = [];
  visa_docountries: any;
  masterDoc: any;
  zone_select: any;
  country_select: any;
  zone_model = '';
  country_model = '';
  masterDoc_model: any;
  data_defult: any;
  modeDev = false;
  country_modelDT = {
    config: {
      displayKey: 'name',
      search: true,
      limitTo: 1000,
      height: '250px',
      position: 'fixed',
      clearOnSelection: false,
      customComparator: function (a, b) {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
      },
      /* placeholder: 'Select', */
      /* clearOnSelection: true,
      inputDirection: 'ltr' */
    },
  };

  Zone_modelDT = {
    config: {
      displayKey: 'name',
      search: true,
      limitTo: 1000,
      height: '250px',
      position: 'fixed',
      placeholder: 'Select',
      customComparator: function (a, b) {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
      },
    },
  };

  img_list = [];
  zone_new: string | object = '';
  county_new_arr = [];
  county_new = '';

  destC = 'พาสปอรตตัวจรงเลมปจจบันอายุไมตากวา 6 เดือน และตองมีหนาวางตั้งแต 2 หนาข้นไป';
  Preparing = 'PMSV/Employee';
  country_select_ALL: any[];
  masterDoc_Selection: any[];
  constructor(
    @Inject(forwardRef(() => MaintainComponent)) private appMain: MaintainComponent,
    private elem: ElementRef,
    private renderer: Renderer2,
    private modalService: BsModalService,
    private http: HttpClient,
    private ws: AspxserviceService,
    private x: AppComponent,
    private fileuploadservice: FileuploadserviceService,
    private swl: AlertServiceService,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadMasterDoc();
    this.Masterlocation();
    this.onloadX();
  }
  ngAfterViewChecked() {
    //your code to update the model // ใช้สำหรับ re-rendered กรณีไป update view แล้วเข้า lifecycle นี้จะ error
    this.changeDetector.detectChanges();
  }
  Masterlocation() {
    this.appMain.isLoading = true;

    let bodyX = {
      token_login: 'b8a27da5-c587-405d-8a45-20e39c98e5ce',
      page_name: 'mtvisacountries',
      module_name: 'master location',
    };

    const onSuccess = (data): void => {
      console.log('>>>>> load master <<<<<');
      console.log(data);
      this.appMain.isLoading = false;
      this.zone_select = data.master_zone;
      this.country_select = data.master_country;
      this.country_select_ALL = [...data.master_country];
      this.county_new_arr = data.master_country;
    };

    this.ws.callWs(bodyX, 'LoadMasterData').subscribe(
      (data) => onSuccess(data),
      (error) => {
        this.appMain.isLoading = false;
        console.log(error);
      }
    );
  }

  loadMasterDoc() {
    this.appMain.isLoading = true;

    let bodyX = {
      token_login: 'b8a27da5-c587-405d-8a45-20e39c98e5ce',
      page_name: 'visa',
      module_name: 'master visa document',
    };

    const onSuccess = (data): void => {
      console.log('loadMasterDoc');
      console.log(data);
      this.masterDoc = data.visa_document;
      this.masterDoc_Selection = CloneDeep(this.masterDoc);
      this.appMain.isLoading = false;
    };

    this.ws.callWs(bodyX, 'LoadMasterData').subscribe(
      (data) => onSuccess(data),
      (error) => {
        this.appMain.isLoading = false;
        console.log(error);
      }
    );
  }

  onloadX() {
    this.appMain.isLoading = true;
    /* let bodyX = {
      "token_login": localStorage["token"],
      "doc_id": this.doc_id
    } */
    let bodyX = {
      token_login: localStorage['token'], //"b8a27da5-c587-405d-8a45-20e39c98e5ce"
      page_name: 'mtvisacountries',
      module_name: 'master visa docountries',
    };

    const onSuccess = (data): void => {
      console.log('primery data');
      debugger;
      console.log(data);
      this.ArrData = data;
      const defalt = data.visa_docountries;
      this.data_defult = defalt;
      this.visa_docountries = data.visa_docountries;
      console.log(this.visa_docountries);
      //this.img_list = data.img_list

      data.img_list.forEach((ct) => {
        this.img_list.push({
          action_change: ct.action_change,
          action_type: ct.action_type,
          actionname: ct.actionname,
          active_type: ct.active_type,
          doc_id: ct.doc_id,
          emp_id: ct.emp_id,
          filename: ct.filename,
          fullname: ct.fullname,
          id: ct.id,
          id_level_1: ct.id_level_1,
          id_level_2: ct.id_level_2,
          modified_by: ct.modified_by,
          modified_date: ct.modified_date,
          pagename: ct.pagename,
          path: ct.path,
          remark: ct.remark,
          status: ct.status,
        });
      });

      this.ArrData['list_status'].forEach(function (e) {
        if (typeof e === 'object') {
          var re;
          if (e.status == '1') {
            re = true;
          } else {
            re = false;
          }
          e['StatusTF'] = re;
        }
      });
      this.appMain.isLoading = false;
    };

    this.ws.callWs(bodyX, 'LoadMasterData').subscribe(
      (data) => onSuccess(data),
      (error) => {
        this.appMain.isLoading = false;
        console.log(error);
      }
    );
  }

  openModalx(template: TemplateRef<any>, zone_new, county_new) {
    if (zone_new == '' && county_new == '') {
      this.swl.swal_warning('Please select your zone or country');
    } else {
      this.tp_clone = template;
      let config: object = {
        class: 'modal-lg',
        animated: true,
        keyboard: false,
        ignoreBackdropClick: true,
      };

      this.modalRef = this.modalService.show(template, config);
    }

    /* console.log(this.zone_model); 
    console.log(this.country_model);  */
  }

  Chang_Status(id, textX, txbtn) {
    console.log(this.ArrData['list_status']);
    var mes;
    //var mes = "Do you want to delete?";
    if (textX == 'update') {
      mes = 'Do you want to save the changes?';
    } else {
      mes = 'Do you want to delete?';
    }
    //var txbtn = "Delete";
    this.swl.swal_confrim_changes('').then((val) => {
      if (val.isConfirmed) {
        this.ArrData['list_status'].forEach(function (e) {
          if (e.id == id) {
            if (textX == 'update') {
              if (e.StatusTF == true) {
                e.status = '1';
              } else {
                e.status = '0';
              }
            }
            e.action_type = textX.toLowerCase();
            e.action_change = true;
          }
        });

        //this.Save_D();
      } else {
        this.ArrData['list_status'].forEach(function (e) {
          if (e.id == id) {
            if (e.status == false) {
              e.status = true;
            } else {
              e.status = false;
            }
            e.action_change = true;
          }
        });
        return;
      }
    });
  }

  Status_Edit(template: TemplateRef<any>, id) {
    /* this.TypeUpdate = true;
    this.openModalx(template);
    var text;
    var Booking_StatusX;
    this.ArrData['list_status'].forEach(e => {
      if(e.id == id){
        text = e.name ;
        Booking_StatusX = e.status ; 
      }
    });
    localStorage.setItem("id", id);
    this.Booking_name = text ;
    this.Booking_Status = Booking_StatusX ; */
  }

  zone_chang() {
    this.country_model = '';
  }

  filter_country(arr, model) {
    console.log(arr);
    console.log(model);
    var re;
    if (model != '') {
      re = arr.filter((word) => word.main_id == model);
    } else {
      re = [];
    }

    return re;
  }

  add_zone_to_country(id_zone, id_coun) {
    debugger;
    if (id_zone == 'undefined') {
      return;
    } else {
      try {
        var arr_objectx = this.visa_docountries.filter((word) => word.continent_id == id_zone && word.country_id == '');
        var arr_visa_docountries = this.visa_docountries;
        console.log('Before add new function');
        console.log(arr_visa_docountries);
        arr_objectx.forEach((e) => {
          var data_max1 = this.getMax(arr_visa_docountries, 'id');
          var data_max2 = this.getMax(this.visa_docountries, 'sort_by');

          arr_visa_docountries.push({
            token_login: null,
            data_type: null,
            user_admin: false,
            id: parseInt(data_max1.id) + 1,
            continent_id: id_zone,
            country_id: id_coun,
            visa_doc_id: e.visa_doc_id,
            name: '',
            preparing_by: '',
            description: '',
            status: '1',
            sort_by: parseInt(data_max2.id) + 1,
            remark: null,
            action_type: 'insert',
            action_change: 'true',
          });
        });

        var arr_Imgx = this.img_list.filter((word) => word.id_level_1 == id_zone && word.id_level_2 == '');
        var img_list_arr = this.img_list;
        if (arr_Imgx.length > 0) {
          arr_Imgx.forEach((el) => {
            var idMax = parseInt(this.getMax(this.img_list, 'id').id);
            img_list_arr.push({
              doc_id: el.doc_id,
              emp_id: null,
              id: idMax + 1,
              path: el.path,
              filename: el.filename,
              pagename: 'mtvisacountries',
              id_level_1: el.id_level_1,
              id_level_2: id_coun,
              actionname: el.actionname,
              status: el.status,
              modified_date: el.modified_date,
              modified_by: el.modified_by,
              action_type: 'insert',
              action_change: 'true',
              fileStatus: false,
            });
          });
        }

        console.log(' add new function');
        console.log(this.visa_docountries);
        console.log(arr_visa_docountries);
        this.visa_docountries = arr_visa_docountries;
        this.Save_D();
      } catch (err) {}
    }
    // this.visa_docountries = arr_visa_docountries ;
  }

  /*   TestChang(event,zone,country) {
      console.log(event);
      console.log(zone);
      console.log(country);
      var re = [];
      re = this.visa_docountries.filter(word => word.country_id == country.id);
      if(re.length <= 0){
        this.add_zone_to_country(zone.id,country.id);
      }
  
    } */

  TestChang(event, zone, country) {
    console.log(event);
    // if (!country) {
    //   return;
    // }
    //SET Zone
    const zoneNew: any = this.zone_new;
    if (zone == [] || zone == '') {
      if ('value' in event) {
        this.zone_new = this.zone_select.filter((word) => word.id == event.value.main_id);
        var zoneIDD = this.zone_new[0]['id'];
      }
    } else {
      var zoneIDD = zone.id;
    }

    if (event.value == 'undefined' || event.value == null || event.value == '') {
      this.county_new = '';
    } else {
      this.county_new = event.value;
      // this.county_new_arr = this.country_select_ALL.

      //this.zone_new = this.zone_select.filter(word => word.id == event.value.main_id);
    }

    if (typeof country === 'object') {
      if (country != undefined && country != null && country != '' && country != []) {
        var check_length = this.visa_docountries.filter((word) => word.country_id == country.id);
        if (check_length.length <= 0) {
          this.add_zone_to_country(zoneIDD, country.id);
        }
      }
    }

    if (zoneNew) {
      if (typeof zoneNew === 'object' && event.value) {
        //@ts-ignore
        const checkZone = zoneNew.id === event.value.main_id;
        //?? ถ้า zone ไม่ตรงกับ selectBox ต้อง update ให้
        if (!checkZone) {
          //@ts-ignore
          this.zone_new = this.zone_select.filter((word) => word.id == event.value.main_id);
        }
        //?? ถ้า zone ไม่ตรงกับ selectBox ต้อง update ให้

        //?? กรอง country ตาม zone
        //@ts-ignore
        if (typeof this.zone_new === 'object' && this.zone_new.length > 0 && this.zone_new[0].id) {
          //@ts-ignore
          this.county_new_arr = this.country_select.filter((word) => word.main_id == this.zone_new[0].id);
        }
        //?? กรอง country ตาม zone
      }
    }
  }

  County_chang(zone) {
    debugger;
    // console.log(zone, 'zone');
    this.county_new = '';
    this.county_new_arr = [];

    if (zone == '' || zone == 'undefined' || zone == null || zone == []) {
      this.zone_new = '';
      this.county_new_arr = this.country_select_ALL;
      // console.log(this.county_new_arr, 'county_new_arr');
    } else {
      try {
        var re = this.country_select.filter((word) => word.main_id == zone.id);
        //console.log();
        this.county_new_arr = re;
      } catch (err) {
        this.county_new_arr = [];
        this.county_new = '';
      }
    }
  }

  filter_country_new(arr, model) {
    //console.log(model.name);
    var re;
    try {
      if (model != '') {
        re = arr.filter((word) => word.main_id == model.name);
      } else {
        re = [];
      }
    } catch (err) {
      re = [];
    }

    return re;
  }

  //checkbox(arr,zone,country){
  checkbox(arr, zone_new, county_new) {
    // visa_docountries

    var re = this.visa_docountries;
    console.log(zone_new);
    console.log(county_new);

    if (typeof county_new === 'object') {
      if (county_new.id != 'undefined' && county_new != '' && county_new != []) {
        re = this.visa_docountries.filter(
          (word) => word.country_id == county_new.id && word.continent_id == zone_new.id
        );
      } else {
        re = this.visa_docountries.filter((word) => word.continent_id == zone_new.id && word.country_id == '');
      }
    } else {
      if (county_new != 'undefined' && county_new != '') {
        re = this.visa_docountries.filter(
          (word) => word.country_id == county_new.id && word.continent_id == zone_new.id
        );
      } else {
        re = this.visa_docountries.filter((word) => word.continent_id == zone_new.id && word.country_id == '');
      }
    }

    re = re.filter((word) => word.action_type != 'delete');
    //var check_length = re.filter(word => word.country_id == country);
    /* console.log('--------loop data check box -----------');
    console.log(this.visa_docountries)
    console.log(re)
 */
    //var visa_docountries
    arr.forEach(function (e) {
      e['ShowStatus'] = false;
    });

    re.forEach(function (e) {
      arr.forEach(function (x) {
        if (x.id == e.visa_doc_id) {
          x['ShowStatus'] = true;
        }
      });
    });

    /* console.log(re);
    console.log(arr); */
    //
    return arr;
  }
  getmtDoc(arr, zone_new, county_new) {
    const visaCountry = this.visa_docountries;
    const caseCountry = (word) =>
      word.country_id == county_new.id && word.continent_id == zone_new.id && word.action_type != 'delete';
    const caseNoCountry = (word) =>
      word.continent_id == zone_new.id && word.country_id == '' && word.action_type != 'delete';
    let arrResult: any[] = [];

    if (typeof county_new === 'object') {
      if (county_new && county_new !== [] && county_new.length > 0) {
        arrResult = visaCountry.filter(caseCountry);
      } else {
        arrResult = visaCountry.filter(caseNoCountry);
      }
    } else {
      if (county_new) {
        arrResult = visaCountry.filter(caseCountry);
      } else {
        arrResult = visaCountry.filter(caseNoCountry);
      }
    }
    // console.log(arrResult, zone_new, county_new, 'arrResult', visaCountry, 'visaCountry');

    //??  update status ใน mtdoc
    arr.forEach(function (e) {
      e['ShowStatus'] = false;
    });
    //??  update status ใน mtdoc
    arrResult.forEach(function (e) {
      arr.forEach(function (x) {
        if (x.id == e.visa_doc_id) {
          x['ShowStatus'] = true;
        }
      });
    });
    return arr;
  }
  UpdateChecked({ ev, item }) {
    const { checked } = ev.target;
    item['ShowStatus'] = checked;
    // console.log(checked, item, this.masterDoc_Selection);
  }
  setCheckBoxDoc(event, idx, zone_new, county_new, masterDoc) {
    event.currentTarget.checked && console.log(event.currentTarget.checked);
    var county_new_id = '';
    if (county_new.id == undefined || county_new.id == 'undefined' || county_new.id == []) {
      county_new_id == '';
    } else {
      county_new_id = county_new.id;
    }

    var re;
    if (typeof county_new === 'object') {
      re = this.visa_docountries.filter((word) => word.continent_id == zone_new.id && word.country_id == county_new_id);
    } else {
      re = this.visa_docountries.filter((word) => word.continent_id == zone_new.id && word.country_id == '');
    }

    var check_length = re.filter((word) => word.visa_doc_id == idx);

    if (check_length.length > 0) {
      this.visa_docountries.forEach(function (e) {
        if (e.id == check_length[0].id) {
          if (event.currentTarget.checked == true) {
            e.action_type = 'update';
            e.action_change = 'true';
          } else {
            e.action_type = 'delete';
            e.action_change = 'true';
          }
        }
      });

      var img_del = this.visa_docountries.filter(
        (word) => word.continent_id == zone_new.id && word.country_id == county_new_id
      );
      var img_del_length = img_del.filter((word) => word.action_type != 'delete');
      if (img_del_length.length <= 0) {
        this.img_list.forEach(function (e) {
          if (e.id_level_1 == zone_new.id && e.id_level_2 == county_new_id) {
            e.action_type = 'delete';
            e.action_change = 'true';
          }
        });
      }
    } else {
      this.addrow(idx, zone_new, county_new);
    }

    console.log(this.visa_docountries);
  }

  second_load() {
    this.appMain.isLoading = true;
    /* let bodyX = {
      "token_login": localStorage["token"],
      "doc_id": this.doc_id
    } */
    let bodyX = {
      token_login: 'b8a27da5-c587-405d-8a45-20e39c98e5ce',
      page_name: 'mtvisacountries',
      module_name: 'master visa docountries',
    };

    const onSuccess = (data): void => {
      /* console.log(data); */
      this.ArrData = data;
      const defalt = data.visa_docountries;
      this.data_defult = defalt;
      this.visa_docountries = data.visa_docountries;

      this.ArrData['list_status'].forEach(function (e) {
        if (typeof e === 'object') {
          var re;
          if (e.status == '1') {
            re = true;
          } else {
            re = false;
          }
          e['StatusTF'] = re;
        }
      });
      this.appMain.isLoading = false;
    };

    this.ws.callWs(bodyX, 'LoadMasterData').subscribe(
      (data) => onSuccess(data),
      (error) => {
        this.appMain.isLoading = false;
        console.log(error);
      }
    );
  }
  // tableRespont(arr,zone_model,country_model){
  tableRespont(arr, zone_new, county_new) {
    try {
      var xx = county_new;
      if (zone_new.id == 'undefined' || zone_new.id == '') {
        return;
      } else {
        var re;
        if (typeof county_new === 'object') {
          if (county_new == [] || county_new.length <= 0) {
            re = this.visa_docountries.filter((word) => word.continent_id == zone_new.id && word.country_id == '');
          } else {
            re = this.visa_docountries.filter(
              (word) => word.continent_id == zone_new.id && word.country_id == county_new.id
            );
          }
        } else {
          re = this.visa_docountries.filter((word) => word.continent_id == zone_new.id && word.country_id == '');
        }

        re = re.filter((word) => word.action_type != 'delete');

        var arr_re = [];
        var count = 0;
        re.forEach(function (e) {
          var datax = arr.filter((word) => word.id == e.visa_doc_id);
          if (datax != undefined && datax.length > 0) {
            arr_re[count] = datax[0];
          }

          datax = [];
          count++;
        });

        return arr_re;
      }
    } catch (err) {
      return;
    }
  }

  check_length(masterDoc, zone_new, county_new) {
    var outEx;
    try {
      outEx = this.tableRespont(masterDoc, zone_new, county_new).length;
    } catch (err) {
      outEx = 0;
    }

    return outEx;
  }
  //check_boxChang(event,sort_by,zone_model,country_model,masterDoc){
  check_boxChang(event, idx, zone_new, county_new, masterDoc) {
    debugger;
    console.log(' masterDoc 1');
    console.log(this.visa_docountries);
    var county_new_id = '';
    if (county_new.id == undefined || county_new.id == 'undefined' || county_new.id == []) {
      county_new_id == '';
    } else {
      county_new_id = county_new.id;
    }

    var re;
    if (typeof county_new === 'object') {
      re = this.visa_docountries.filter((word) => word.continent_id == zone_new.id && word.country_id == county_new_id);
    } else {
      re = this.visa_docountries.filter((word) => word.continent_id == zone_new.id && word.country_id == '');
    }

    //var re = this.visa_docountries.filter(word => word.country_id == county_new.id);
    var check_length = re.filter((word) => word.visa_doc_id == idx);
    //var check_length = re;
    /* console.log('-------------- length 1----------------')
    console.log(check_length.length); */

    if (check_length.length > 0) {
      this.visa_docountries.forEach(function (e) {
        if (e.id == check_length[0].id) {
          if (event.currentTarget.checked == true) {
            e.action_type = 'update';
            e.action_change = 'true';
          } else {
            e.action_type = 'delete';
            e.action_change = 'true';
          }
        }
      });

      var img_del = this.visa_docountries.filter(
        (word) => word.continent_id == zone_new.id && word.country_id == county_new_id
      );
      var img_del_length = img_del.filter((word) => word.action_type != 'delete');
      if (img_del_length.length <= 0) {
        this.img_list.forEach(function (e) {
          if (e.id_level_1 == zone_new.id && e.id_level_2 == county_new_id) {
            e.action_type = 'delete';
            e.action_change = 'true';
          }
        });
      }
      //this.Save_D();
    } else {
      this.addrow(idx, zone_new, county_new);
      //this.Save_D();
    }

    console.log(' masterDoc 2');
    console.log(masterDoc);
    console.log(this.visa_docountries);

    /* console.log('-------------- length 2----------------')
    console.log(event.currentTarget.checked);
    console.log(this.visa_docountries); */
  }

  addrow(id, zone_new, county_new) {
    // addrow(sort_by_id,zone_model,country_model){

    debugger;
    var data_max1 = this.getMax(this.visa_docountries, 'id');
    var data_max2 = this.getMax(this.visa_docountries, 'sort_by');
    //var zone = '';
    var country = '';

    if (county_new.id == 'undefined' || county_new.id == null || county_new.id == '') {
      country = '';
    } else {
      country = county_new.id;
    }

    this.visa_docountries.push({
      token_login: null,
      data_type: null,
      user_admin: false,
      id: parseInt(data_max1.id) + 1,
      continent_id: zone_new.id,
      country_id: country,
      visa_doc_id: id,
      name: '',
      preparing_by: '',
      description: '',
      status: '1',
      sort_by: parseInt(data_max2.id) + 1,
      remark: null,
      action_type: 'insert',
      action_change: 'true',
    });

    /* console.log(this.visa_docountries); */
    //this.Save_D();
  }

  deleterow() {
    this.visa_docountries.forEach(function (e) {
      if (e.continent_id == '1') {
        e.action_type = 'delete';
        e.action_change = 'true';
      }
    });
    /* this.img_list.forEach(function (e) {
      
        e.action_type = "delete";
        e.action_change = "true";
      
    }) */
    this.Save_D();
  }

  Save_D() {
    //this.ArrSaveMaster =  data_type":"save",
    debugger;
    this.appMain.isLoading = true;
    this.ArrData['data_type'] = 'save';
    this.ArrData['page_name'] = 'mtvisacountries';
    this.ArrData['module_name'] = 'master visa docountries';
    this.ArrData['visa_docountries'] = this.visa_docountries;
    this.ArrData['img_list'] = this.img_list;

    console.log('------------ Before Save ---------------');
    console.log(this.ArrData);

    const onSuccess = (data): void => {
      console.log('------------ After Save ---------------');
      console.log(data);
      this.ArrData = data;
      this.img_list = data.img_list;
      this.visa_docountries = data.visa_docountries;
      this.loadMasterDoc();
      this.appMain.isLoading = false;
    };

    this.ws.callWs(this.ArrData, 'SaveMasterData').subscribe(
      (data) => onSuccess(data),
      (error) => {
        this.appMain.isLoading = false;
        console.log(error);
      }
    );
  }

  getMax(arr, prop) {
    var max;

    for (var i = 0; i < arr.length; i++) {
      if (max == null || parseInt(arr[i][prop]) > parseInt(max[prop])) max = arr[i];
    }
    //if ( max == "") { max = 0;}

    return max;
  }

  cancel_checkbox() {
    /* this.swl.swal_confrim_changes('').then((val) => {
      if (val.isConfirmed) {
        
        
        this.Save_D();
        this.modalRef.hide()
       
      }
      else{
        this.onloadX();
        
      }
    }) */
    //this.second_load();
    this.modalRef.hide();
  }

  SaveFunction() {
    // this.masterDoc_Selection.forEach((e, i, ds) => {
    //   let event = { currentTarget: { checked: e['ShowStatus'] } };
    //   const { id } = e;
    //   if (e['ShowStatus']) {
    //     this.setCheckBoxDoc(event, id, this.zone_new, this.county_new, ds);
    //   }
    // });
    // this.masterDoc_Selection.forEach((e, i, ds) => {
    //   e['ShowStatus'] = false;
    // });
    this.Save_D();
    this.modalRef.hide();
  }

  id_uploadFile;
  id_uploadFile2;
  onFileSelect(event, id, id2) {
    debugger;

    var county_new_id = '';

    var re;
    this.id_uploadFile = id.id;
    var idv2;
    if (typeof id2 === 'object') {
      if (id2.id == undefined || id2.id == 'undefined' || id2.id == []) {
        idv2 = '';
      } else {
        idv2 = id2.id;
      }
    } else {
      if (id2.id == 'undefined' || id2.id == '') {
        idv2 = '';
      } else {
        idv2 = id2.id;
      }
    }

    this.id_uploadFile2 = idv2;
    this.selectedFile = <File>event.target.files[0];
    console.log(' ///****/////****/// ');
    console.log(id);
    console.log(event);
    console.log(this.selectedFile);
    this.onUpload();
  }

  onUpload() {
    this.appMain.isLoading = true;
    const onSuccess = (res) => {
      this.appMain.isLoading = false;
      debugger;
      var today = new Date();
      var dd = String(today.getDate()).padStart(2, '0');
      var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
      var yyyy = today.getFullYear();

      var todayStr = mm + '/' + dd + '/' + yyyy;
      var montF = new DatePipe('en-US');
      var dx = montF.transform(todayStr, 'dd MMM yyyy');
      console.log(dx);
      console.log('------------- Date Str --------------');
      console.log(todayStr);
      var idMax = parseInt(this.getMax(this.img_list, 'id').id);
      var emp = localStorage['token'];

      // action_change: "false"
      // action_type: "update"
      // actionname: ""
      // active_type: "false"
      // doc_id: "master visa docountries"
      // emp_id: ""
      // filename: "Img_003.png"
      // fullname: "http://TBKC-DAPPS-05.thaioil.localnet/ebiz_ws/Image/master visa docountries/mtvisacountries/Img_003.png"
      // id: "359"
      // id_level_1: "1"
      // id_level_2: "48"
      // modified_by: ""
      // modified_date: "04 JUN 2021"
      // pagename: "mtvisacountries"
      // path: "http://TBKC-DAPPS-05.thaioil.localnet/ebiz_ws/Image/master visa docountries/mtvisacountries/"
      // remark: null
      // status: null
      // this.img_list.push({

      //   "doc_id": res.img_list.doc_id,
      //   "emp_id": null,
      //   "id": idMax + 1,
      //   "path": res.img_list.path,
      //   "filename": res.img_list.filename,
      //   "pagename": 'mtvisacountries',
      //   "id_level_1": this.id_uploadFile,
      //   "id_level_2": this.id_uploadFile2,
      //   "actionname": '',
      //   "status": "",
      //   "modified_date": dx.toUpperCase(),
      //   "modified_by": res.img_list.modified_by,
      //   "action_type": "insert",
      //   "action_change": "true",
      //   "fileStatus": false
      // })

      this.img_list.push({
        action_change: 'true',
        action_type: 'insert',
        actionname: '',
        active_type: 'false',
        doc_id: 'master visa docountries',
        emp_id: '',
        filename: res.img_list.filename,
        fullname:
          'http://TBKC-DAPPS-05.thaioil.localnet/ebiz_ws/Image/master visa docountries/mtvisacountries/' +
          res.img_list.filename,
        id: idMax + 1,
        id_level_1: this.id_uploadFile,
        id_level_2: this.id_uploadFile2,
        modified_by: res.img_list.modified_by,
        modified_date: dx.toUpperCase(),
        pagename: 'mtvisacountries',
        path: res.img_list.path,
        remark: null,
        status: null,
      });

      // this.img_list.push({

      //   action_change: "true",
      //   action_type: "insert",
      //   actionname: "",
      //   active_type: "false",
      //   doc_id: "master visa docountries",
      //   emp_id: "",
      //   filename: res.img_list.filename,
      //   fullname: "http://TBKC-DAPPS-05.thaioil.localnet/ebiz_ws/Image/master visa docountries/mtvisacountries/"+res.img_list.filename,
      //   id: idMax + 1,
      //   id_level_1: this.id_uploadFile,
      //   id_level_2: this.id_uploadFile2,
      //   modified_by: res.img_list.modified_by,
      //   modified_date: dx.toUpperCase(),
      //   pagename: "mtvisacountries",
      //   path: res.img_list.path,
      //   remark: null,
      //   status: null,
      // })

      //this.swl.toastr_warning("Please Save Data");
      $('#file_id').val('');
      console.log(res);
      console.log(this.img_list);
      this.Save_D();
    };
    var token = localStorage['token'];
    this.postFile(this.selectedFile, '', 'mtvisacountries', '', token).subscribe(
      (res) => onSuccess(res),
      (error) => {
        this.appMain.isLoading = false;
        console.log(error);
        alert('error!');
      }
    );
  }

  file_emp: string;
  postFile(
    fileToUpload: File,
    file_doc: string,
    file_page: string,
    file_emp: string,
    file_token_login: string
  ): Observable<any> {
    const endpoint = 'UploadFile';
    const fd = new FormData();
    fd.append('file', fileToUpload);
    fd.append('file_doc', '');
    fd.append('file_page', 'mtvisacountries');
    fd.append('file_emp', '');
    fd.append('file_token_login', file_token_login);
    return this.http.post<any>(this.ws.baseUrl + endpoint, fd);
  }

  deleterow_img(id, zone, county, img_list) {
    console.log(this.img_list);
    this.swl.swal_confrim_delete('').then((val) => {
      if (val.isConfirmed) {
        this.img_list.forEach(function (e) {
          if (e.id == id) {
            e.action_type = 'delete';
            e.action_change = 'true';
          }
        });
        this.Save_D();
      } else {
        return;
      }
    });
  }

  imgArr(zone, country, arr) {
    // debugger;
    arr = this.img_list;
    var re = arr;
    var c_data, z_data;

    if (typeof zone === 'object') {
      if (zone == 'undefined' || zone == '' || zone == []) {
        return [];
      }
    } else {
      if (zone == 'undefined' || zone == '') {
        return [];
      }
    }

    if (zone.id == 'undefined' || zone.id == '') {
      return re;
    } else {
      if (typeof country === 'object') {
        var county_new_id = '';
        if (country.id == undefined || country.id == 'undefined' || country.id == []) {
          county_new_id == '';
        } else {
          county_new_id = country.id;
        }

        if (country.id == 'undefined' || country.id == '' || country.length <= 0) {
          re = arr.filter((word) => word.id_level_1 == zone.id && word.id_level_2 == '');
        } else {
          re = arr.filter((word) => word.id_level_1 == zone.id && word.id_level_2 == county_new_id);
        }
      } else {
        if (country == 'undefined' || country == '' || country.length <= 0) {
          re = arr.filter((word) => word.id_level_1 == zone.id && word.id_level_2 == '');
          /* console.log(re); */
        } else {
          re = arr.filter((word) => word.id_level_1 == zone.id && word.id_level_2 == country.id);
          /* console.log(re); */
        }
      }

      return re;
    }
  }

  not_select_zone() {
    this.swl.swal_warning('Please Select Zone Or Country');
  }

  downloadFile(url, filename) {
    let Regex = /.[A-Za-z]{3}$/;
    let fullurl = url.match(Regex);
    //let fileType = fullurl[0];
    let file_name = filename;
    fs.saveAs(url, file_name);
    //const blob = new Blob([], { type: 'text/csv' });
    //const url= window.URL.createObjectURL("http://tbkc-dapps-05.thaioil.localnet/ebiz_ws/Image/D001/transportation/00000910/1606366192767.jpg");
    //window.open("http://tbkc-dapps-05.thaioil.localnet/ebiz_ws/Image/D001/transportation/00000910/1606366192767.jpg");
  }
}
