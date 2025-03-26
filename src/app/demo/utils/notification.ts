import Swal from 'sweetalert2';

export function showNotification(success: boolean, text: string) {
  Swal.fire({
    title: success ? 'Success!' : 'Error!',
    text: text,
    icon: success ? 'success' : 'error',
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000
  });
}
