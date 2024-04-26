import { Injectable } from '@angular/core';
import { HttpmanagerService } from '../../services/http/httpmanager.service';

@Injectable({
  providedIn: 'root'
})
export class PartIService {

  constructor(private https: HttpmanagerService) { }

  onSave(data: any) {
    console.log('Save tab 1 data to docFlow1');
    console.log(JSON.stringify(data))
    console.log(data);
    return this.https.onFetch("docFlow1", data)
  }

  didGenerateDocument(state: String) {
    let data = {
      "token_login": "xxxx",
      "doc_type": state
    }
    return this.https.onFetch("genDocNo", data)
  }

  didFetch(document_id) {
    let data = {
      "token_login": localStorage["token"],
      "id_doc": document_id
    }
    return this.https.onFetch("LoadDocDetail", data)
  }

  onLoadMasterGL(text) {
    let data = {
      "token_login": localStorage["token"],
      "text": text
    }
    return this.https.onFetch("GLAccount", data)
  }
  
  onLoadMasterCostCenter(text) {
    let data = {
      "token_login": localStorage["token"],
      "text": text
    }
    return this.https.onFetch("CostCenter", data)
  }
  onLoadMasterWBS(text) {
    let data = {
      "token_login": localStorage["token"],
      "text": text
    }
    return this.https.onFetch("WBS", data)
  }



}
