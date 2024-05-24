import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class AlertServiceService {
  private defaultParams = {
    title: '',
    text: '',
    icon: '' as SweetAlertIcon,
    allowOutsideClick: false,
    showConfirmButton: true,
    showCancelButton: false,
    confirmButtonText: 'Yes',
    confirmButtonColor: '#04528a',
    cancelButtonText: 'No',
    cancelButtonColor: '#d33',
    customClass: '',
  };

  constructor(private toastr: ToastrService) {}

  // Toastr methods
  toastr_success(msg: string) {
    this.toastr.success(msg, 'Success!', {
      positionClass: 'toast-bottom-right',
      timeOut: 3000,
    });
  }

  toastr_info(msg: string) {
    this.toastr.info(msg, 'Info', {
      positionClass: 'toast-bottom-right',
      timeOut: 3000,
    });
  }

  toastr_warning(msg: string) {
    this.toastr.warning(msg, 'Warning!', {
      positionClass: 'toast-bottom-right',
      timeOut: 3000,
    });
  }

  toastr_error(msg: string) {
    this.toastr.error(msg, 'Error!', {
      positionClass: 'toast-bottom-right',
      timeOut: 3000,
    });
  }

  // SweetAlert2 methods
  swal_success(msg: string) {
    Swal.fire({
      icon: 'success',
      html: `<pre class="text-center">${msg || 'Successfully saved'}</pre>`,
      confirmButtonColor: this.defaultParams.confirmButtonColor,
      customClass: { confirmButton: 'btn-min-width', popup: 'format-preX' },
    });
  }

  swal_error(msg: string) {
    Swal.fire({
      icon: 'error',
      html: `<pre class="text-center">${msg}</pre>`,
      confirmButtonColor: this.defaultParams.confirmButtonColor,
      customClass: { confirmButton: 'btn-min-width', popup: 'format-preX' },
    });
  }

  swal_warning(msg: string) {
    Swal.fire({
      icon: 'warning',
      html: `<pre class="text-center">${msg}</pre>`,
      confirmButtonColor: this.defaultParams.confirmButtonColor,
      customClass: { confirmButton: 'btn-min-width', popup: 'format-preX' },
    });
  }

  swal_info(msg: string) {
    Swal.fire({
      icon: 'info',
      html: `<pre class="text-center">${msg}</pre>`,
      confirmButtonColor: this.defaultParams.confirmButtonColor,
      customClass: { confirmButton: 'btn-min-width', popup: 'format-preX' },
    });
  }

  swal_custom(title: string, msg: string, action: string) {
    const icon = this.getIcon(action);
    Swal.fire({
      icon: icon,
      title: title,
      text: msg,
      confirmButtonColor: this.defaultParams.confirmButtonColor,
    });
  }

  swal_custom_newline(title: string, msg: string, action: string) {
    const icon = this.getIcon(action);
    Swal.fire({
      icon: icon,
      title: title,
      html: `<pre>${msg}</pre>`,
      customClass: { popup: 'format-preX' },
      confirmButtonColor: this.defaultParams.confirmButtonColor,
    });
  }

  async swal_confirm(title: string, msg: string, action: string) {
    const icon = this.getIcon(action);
    return Swal.fire({
      icon: icon,
      text: title,
      customClass: { confirmButton: 'btn-min-width', cancelButton: 'btn-min-width' },
      showCancelButton: true,
      confirmButtonColor: this.defaultParams.confirmButtonColor,
      cancelButtonColor: this.defaultParams.cancelButtonColor,
      confirmButtonText: this.defaultParams.confirmButtonText,
      allowOutsideClick: false,
    });
  }

  async swal_confirm_delete(msg: string) {
    const title = msg || 'Do you want to delete the data?';
    return Swal.fire({
      icon: 'warning',
      text: title,
      customClass: { confirmButton: 'btn-min-width', cancelButton: 'btn-min-width' },
      showCancelButton: true,
      confirmButtonColor: this.defaultParams.confirmButtonColor,
      cancelButtonColor: this.defaultParams.cancelButtonColor,
      confirmButtonText: this.defaultParams.confirmButtonText,
      allowOutsideClick: false,
    });
  }

  async swal_confirm_changes(msg: string) {
    const title = msg || 'Do you want to save the changes?';
    return Swal.fire({
      icon: 'question',
      text: title,
      customClass: { confirmButton: 'btn-min-width', cancelButton: 'btn-min-width' },
      showCancelButton: true,
      confirmButtonColor: this.defaultParams.confirmButtonColor,
      cancelButtonColor: this.defaultParams.cancelButtonColor,
      confirmButtonText: this.defaultParams.confirmButtonText,
      allowOutsideClick: false,
    });
  }

  private getIcon(action: string): SweetAlertIcon {
    switch (action) {
      case 'success':
        return 'success';
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      case 'question':
        return 'question';
      default:
        return 'info';
    }
  }
}
