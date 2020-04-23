import { Component, OnInit } from '@angular/core';
import { Router} from "@angular/router";
import Swal from 'sweetalert2';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  user:any={};
  constructor(public router:Router) { }

  ngOnInit() {
    //Getting the loged in user details
    this.user = JSON.parse(localStorage.getItem("currentUser"))
    this.checkUser();
  }

   // Checking whether the user is logged in and if the logged in user is the MAIN_USER
  checkUser(){
    var token = localStorage.getItem("token");
     console.log(token)
    
    if (!token || token == null || token == undefined) {
      this.router.navigate(['/login']);
    } else if(this.user.uRole.role != 'MAIN_USER'){
      Swal.fire({
        type: 'error',
        text: 'You are not authorized user',
      }).then((result) => {
        if (result.value) {
          this.router.navigate(['/login']);
        }
      })
    }
  
}

// logout the user and clear localstorage
  logoutUser() {
    // remove everything at the time of log out
    localStorage.clear();
    this.router.navigate(['/']);
  }

  // function to show and close the user setting dropdown
  showDropDown(event){
    if(event.type == 'mouseover'){
      document.getElementById("profileDropDown").style.display = 'block'
    }else{
      document.getElementById("profileDropDown").style.display = 'none'
    }
  }
}
