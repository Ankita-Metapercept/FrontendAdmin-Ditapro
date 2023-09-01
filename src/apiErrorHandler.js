// apiErrorHandler.js

import Swal from 'sweetalert2';
export function handleApiError(error) {
    if (error.response.data.message == "Another device has login with your account!") {
        localStorage.clear()
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Another device has logged in with your account!',
        }).then(() => {
            window.location.href = '/';
        });
    }
    if (error.response.data.message == "Invalid Token") {
        localStorage.clear()
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Your session has expired. Please log in again to continue accessing the DITAxPresso. ',
        }).then(() => {
            window.location.href = '/';
        });
    }
    if (error.response.data.message == "The current subscription of your organization has been expired !") {
        localStorage.clear()
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'The current subscription of your organization has been expired. Please ask your organization to renew the subscription plan to use our services again. Thank you!',
        }).then(() => {
            window.location.href = '/';
        });
    }
    
}
