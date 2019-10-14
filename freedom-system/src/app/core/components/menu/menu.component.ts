import { Component, OnInit, ApplicationInitStatus } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/core/services/login/login.service';
import { AlertService } from 'src/app/core/services/alert/alert.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApplicationStateService } from '../../services/aplication-state/aplication-state.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  
  openModal: Boolean = false;
  mobileView: Boolean;
  
  constructor(private loginService: LoginService,
    private spinner: NgxSpinnerService,
    private alertService: AlertService,
    private router: Router,
    private aplicationState: ApplicationStateService ) { }

  ngOnInit() {
    this.mobileView = this.aplicationState.getIsMobileResolution();
  }

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
