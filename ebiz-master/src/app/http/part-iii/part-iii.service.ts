import { Injectable } from '@angular/core';
import { HttpmanagerService } from '../../services/http/httpmanager.service';


@Injectable({
  providedIn: 'root'
})
export class PartIiiService {

  constructor(private https: HttpmanagerService) { }

  didFetch(document_id : any) {
    let data = {
      "token": localStorage["token"],
      "id_doc": document_id
    }
    console.log('data to LoadDocDetail3');
    console.log(data);
    return this.https.onFetch("LoadDocDetail3", data)
  }
  
  onSave(data: any) {
    console.log(JSON.stringify(data))
    return this.https.onFetch("docFlow3", data)
  }
}
