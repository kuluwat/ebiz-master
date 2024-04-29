import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
// import toastr from '../../../assets/extensions/toastr/toastr.js';


//declare const toastr: any;

@Injectable({
  providedIn: 'root',
})
export class AlertServiceService {
  constructor() {}
  // Toastr //

  // toastr_sucess(msg: string) {
  //   toastr.success(msg, 'Sucess!', {
  //     positionClass: 'toast-bottom-right',
  //     showMethod: 'slideDown',
  //     hideMethod: 'slideUp',
  //     timeOut: 3000,
  //   });
  // }
  // toastr_info(msg: string) {
  //   toastr.info(msg, 'Info', {
  //     positionClass: 'toast-bottom-right',
  //     showMethod: 'slideDown',
  //     hideMethod: 'slideUp',
  //     timeOut: 3000,
  //   });
  // }
  // toastr_warning(msg: string) {
  //   toastr.warning(msg, 'Warning!', {
  //     positionClass: 'toast-bottom-right',
  //     showMethod: 'slideDown',
  //     hideMethod: 'slideUp',
  //     timeOut: 3000,
  //   });
  // }
  // toastr_error(msg: string) {
  //   toastr.error(msg, 'Error!', {
  //     positionClass: 'toast-bottom-right',
  //     showMethod: 'slideDown',
  //     hideMethod: 'slideUp',
  //     timeOut: 3000,
  //   });
  // }
  // Toastr //

  // Sweetalert2 //

  defaultParams = {
    title: '',
    text: '',
    type: null,
    icon: '',
    allowOutsideClick: false,
    showConfirmButton: true,
    showCancelButton: false,
    closeOnConfirm: true,
    closeOnCancel: true,
    confirmButtonText: 'Yes',
    confirmButtonColor: '#04528a',
    cancelButtonText: 'No',
    imageUrl: null,
    imageSize: null,
    timer: null,
    customClass: '',
    html: false,
    animation: true,
    allowEscapeKey: true,
    inputType: 'text',
    inputPlaceholder: '',
    inputValue: '',
    showLoaderOnConfirm: false,
    cancelButtonColor: '#d33',
  };

  swal_sucess(msg: string) {
    msg === '' && (msg = 'Successfully saved');
    Swal.fire({
      icon: 'success',
      // title: 'Success',
      // text: msg,
      customClass: { confirmButton: 'btn-min-width', popup: 'format-preX' },
      html: '<pre class="text-center">' + msg + '</pre>',
      confirmButtonColor: this.defaultParams.confirmButtonColor,
    });
  }

  swal_error(msg: string) {
    Swal.fire({
      icon: 'error',
      // title: 'Error!',
      // text: msg,
      customClass: { confirmButton: 'btn-min-width', popup: 'format-preX' },
      html: '<pre class="text-center">' + msg + '</pre>',
      confirmButtonColor: this.defaultParams.confirmButtonColor,
    });
  }

  swal_warning(msg: string) {
    Swal.fire({
      icon: 'warning',
      // title: 'Warning!',
      // text: msg,
      customClass: { confirmButton: 'btn-min-width', popup: 'format-preX' },
      html: '<pre class="text-center">' + msg + '</pre>',
      confirmButtonColor: this.defaultParams.confirmButtonColor,
    });
  }

  swal_info(msg: string) {
    Swal.fire({
      icon: 'info',
      // title: 'Info',
      // text: msg,
      customClass: { confirmButton: 'btn-min-width', popup: 'format-preX' },
      html: '<pre class="text-center">' + msg + '</pre>',
      confirmButtonColor: this.defaultParams.confirmButtonColor,
    });
  }

  swal_custom(title: string, msg: string, action: string) {
    this.defaultParams.icon =
      action === 'success'
        ? 'success'
        : action === 'error'
        ? 'error'
        : action === 'warning'
        ? 'warning'
        : action === 'info'
        ? 'info'
        : action === 'question'
        ? 'question'
        : '';

    Swal.fire({
      // icon: this.defaultParams.icon,
      title: title,
      text: msg,
      confirmButtonColor: this.defaultParams.confirmButtonColor,
    });
  }

  swal_custom_newline(title: string, msg: string, action: string) {
    this.defaultParams.icon =
      action === 'success'
        ? 'success'
        : action === 'error'
        ? 'error'
        : action === 'warning'
        ? 'warning'
        : action === 'info'
        ? 'info'
        : action === 'question'
        ? 'question'
        : '';

    Swal.fire({
      // icon: this.defaultParams.icon,
      title: title,
      html: '<pre>' + msg + '</pre>',
      customClass: {
        popup: 'format-preX',
      },
      confirmButtonColor: this.defaultParams.confirmButtonColor,
    });
  }

  async swal_confrim(title: string, msg: string, action: string) {
    this.defaultParams.icon =
      action === 'success'
        ? 'success'
        : action === 'error'
        ? 'error'
        : action === 'warning'
        ? 'warning'
        : action === 'info'
        ? 'info'
        : action === 'question'
        ? 'question'
        : '';

    return await Swal.fire({
      // title: title,
      text: title,
      // icon: this.defaultParams.icon,
      customClass: { confirmButton: 'btn-min-width', cancelButton: 'btn-min-width' },
      showCancelButton: true,
      confirmButtonColor: this.defaultParams.confirmButtonColor,
      cancelButtonColor: this.defaultParams.cancelButtonColor,
      confirmButtonText: this.defaultParams.confirmButtonText,
      stopKeydownPropagation: false,
      allowOutsideClick: false,
    });
  }

  async swal_confrim_delete(msg: string) {
    this.defaultParams.title = msg === '' ? 'Do you want to delete the data?' : msg;

    return await Swal.fire({
      // title: this.defaultParams.title,
      text: this.defaultParams.title,
      icon: 'warning',
      showCancelButton: true,
      customClass: { confirmButton: 'btn-min-width', cancelButton: 'btn-min-width' },
      confirmButtonColor: this.defaultParams.confirmButtonColor,
      cancelButtonColor: this.defaultParams.cancelButtonColor,
      confirmButtonText: this.defaultParams.confirmButtonText,
      stopKeydownPropagation: false,
      allowOutsideClick: false,
    });
  }

  async swal_confrim_changes(msg: string) {
    this.defaultParams.title = msg === '' ? 'Do you want to save the changes?' : msg;

    return await Swal.fire({
      // title: this.defaultParams.title,
      text: this.defaultParams.title,
      icon: 'question',
      customClass: { confirmButton: 'btn-min-width', cancelButton: 'btn-min-width' },
      showCancelButton: true,
      confirmButtonColor: this.defaultParams.confirmButtonColor,
      cancelButtonColor: this.defaultParams.cancelButtonColor,
      confirmButtonText: this.defaultParams.confirmButtonText,
      stopKeydownPropagation: false,
      allowOutsideClick: false,
    });
  }

  // Sweetalert2 //
}
