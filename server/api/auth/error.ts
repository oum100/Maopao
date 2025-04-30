import { H3Event } from 'h3';
import Swal from 'sweetalert2'

export default defineEventHandler(async(event:H3Event)=>{
    Swal.fire({
        icon: 'error',
        title: 'Authentication Failed',
        text: "test aleart",
        timer: 2000,
        showConfirmButton: false,
        position: 'top',
      })
})