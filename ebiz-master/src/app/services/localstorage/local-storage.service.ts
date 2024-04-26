import { Injectable } from '@angular/core';
import { localstoragemodel } from '../../model/localstorage.model';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  onSave(key: localstoragemodel, value: any = null): void {
    window.localStorage[key] = value
  }

  onLoad(key: localstoragemodel): any {
    return window.localStorage[key]
  }
  
}
