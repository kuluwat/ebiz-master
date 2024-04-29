import { Injectable } from '@angular/core';
import { HttpmanagerService } from '../../services/http/httpmanager.service';


@Injectable({
  providedIn: 'root'
})
export class PartIiiiService {

  constructor(private https: HttpmanagerService) { }
  didFetch(document_id : any) {
    let data = {
      "token": localStorage["token"],
      "id_doc": document_id
    }
    console.log('data to LoadDocDetail4')
    console.log(data)
    return this.https.onFetch("LoadDocDetail4", data)
  }
  
  onSave(data: any) {
    console.log('Data Save or Approve path CAP')
    console.log(data);
    console.log(JSON.stringify(data))
    return this.https.onFetch("docFlow4", data)
  }
}
