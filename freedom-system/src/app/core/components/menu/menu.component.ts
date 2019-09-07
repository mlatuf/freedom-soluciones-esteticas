import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/core/services/login/login.service';
import { AlertService } from 'src/app/core/services/alert/alert.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  
  openModal: Boolean = false;
  
  constructor(private loginService: LoginService,
    private spinner: NgxSpinnerService,
    private alertService: AlertService,
    private router: Router) { }

  ngOnInit() {}

  logout(): void {
    this.spinner.show();
    this.loginService.logout$().subscribe( 
      response => {
        this.spinner.hide();
        this.openModal = false;
        this.router.navigate(['/login']);
      },
      error => {
        this.spinner.hide();
        this.alertService.error(error);
      }
    );
  }

}
