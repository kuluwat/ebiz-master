import { Component, forwardRef, Inject, OnInit } from '@angular/core';
import { AlertServiceService } from '../../services/AlertService/alert-service.service';
import { HeaderComponent } from '../../components/header/header.component';
import { MaintainComponent } from '../maintain/maintain.component';
import { MasterComponent } from '../../screen/master/master.component';
import { FileuploadserviceService } from '../../ws/fileuploadservice/fileuploadservice.service';
import { AspxserviceService } from '../../ws/httpx/aspxservice.service';

@Component({
  selector: 'app-mtkhcode',
  templateUrl: './mtkhcode.component.html',
  styleUrls: ['./mtkhcode.component.css']
})
export class MtkhcodeComponent implements OnInit {

  model = {
    file_detail: {
      fileName: "",
      fileSize: "",
      lastUploadDate: "",
      url: "",
      uploadBy: ""
    }
  }
  selectedFile: File = null;

  constructor(
    @Inject(forwardRef(() => MaintainComponent)) private appMain: MaintainComponent,
    @Inject(forwardRef(() => HeaderComponent)) private appHeader: HeaderComponent,
    public ws: AspxserviceService,
    private alerts: AlertServiceService,
    private fileuploadservice: FileuploadserviceService
  ) { }

  ngOnInit() {

    this.onLoad();


  }

  onLoad() {

    let bodyX = {
      "token_login": localStorage["token"],
      "doc_id": ""
    }
    this.appMain.isLoading = true;
    const onSuccess = (data) => {
      console.log('>>> Load Page Upload KH Code <<<');
      console.log(data);
      // this.model.file_detail.push({
      //   'fileName': "Medical Certificate.pdf",
      //   'fileSize': "10.45kb",
      //   'lastUploadDate': "27 Aug 2021",
      //   'url': "xxx/xxx/xxx/xxx",
      // });
      this.model.file_detail.fileName = data.fileName;//"Medical Certificate.pdf";
      this.model.file_detail.fileSize = data.fileSize;//"10.45kb";
      this.model.file_detail.lastUploadDate = data.lastUploadDate;//"27 Aug 2021";
      this.model.file_detail.url = data.url;//"Medical Certificate.pdf";
      this.model.file_detail.uploadBy = data.uploadBy;//"PTTDIGITAL-ComX-Attaphon";

      var contentX = document.getElementById("contentX");
      contentX.classList.remove("d-none");

      this.appMain.isLoading = false;
    }
    this.ws.callWs(bodyX, 'LoadFileKHCode').subscribe(data => onSuccess(data), error => {
      this.appMain.isLoading = false;
      console.log(error);
      this.alerts.swal_error(error.message);
      //alert('Can\'t call web api.' + ' : ' + error.message);
    })

  }
  onFileSelect(event) {
    this.selectedFile = <File>event.target.files[0];
    if (this.selectedFile.size / 1024 / 1024 <= 50) {
      console.log(event);
      console.log(this.selectedFile);
      this.onUpload();

    } else {
      console.log(this.selectedFile);
      this.alerts.swal_warning('Maximum upload file size 50 mb.');
    }
  }

  onUpload() {
    this.appMain.isLoading = true;

    const onSuccess = (res) => {
      this.appMain.isLoading = false;

      if (res.after_trip.opt1 == 'true') {
        console.log('---Upload file success---');
        console.log(res);

        //this.alerts.toastr_sucess('Upload file complete.');
        this.alerts.swal_sucess('Upload file complete.');

        this.onLoad();

      } else {
        console.log('---error---');
        console.log(res);
        this.alerts.swal_error(res.after_trip.opt2.status);
        //Swal.fire('Error!', 'Error : ' + res.after_trip.opt2.status, 'error');
      }
    };

    this.fileuploadservice.postFilePhase2(this.selectedFile, '0', 'kh code', '0', localStorage["token"]).subscribe(
      (res) => onSuccess(res),
      (error) => {
        this.appMain.isLoading = false;
        console.log(error);
        //alert('error!');
        this.alerts.swal_error(error.error);
        //Swal.fire('Error!', 'Error : ' + error.error, 'error');
      }
    );
  }

  downLoadFile(){
    this.ws.downloadFile(this.model.file_detail.url, this.model.file_detail.fileName);
  }
}
