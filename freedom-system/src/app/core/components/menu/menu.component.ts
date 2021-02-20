import { Component, OnInit, ApplicationInitStatus } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/core/services/login/login.service';
import { AlertService } from 'src/app/core/services/alert/alert.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApplicationStateService } from '../../services/aplication-state/aplication-state.service';
import { MatDialog } from '@angular/material';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  
  mobileView: Boolean;
  
  constructor(private loginService: LoginService,
    private spinner: NgxSpinnerService,
    private alertService: AlertService,
    private router: Router,
    private aplicationState: ApplicationStateService,
    public dialog: MatDialog ) { }

  ngOnInit() {
    this.mobileView = this.aplicationState.getIsMobileResolution();
  }

  openModal(): void {
    const dialogRef = this.dialog.open(ModalComponent, {
      data: {
        title: 'Salir del sistema', 
        text: "Está seguro que desea salir? Se perderán todos los datos no guardados.",
        isConfirmationModal: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.logout();
      }
    });
  }

  logout(): void {
    this.spinner.show();
    this.loginService.logout$().subscribe( 
      response => {
        this.spinner.hide();
        this.router.navigate(['/login']);
      },
      error => {
        this.spinner.hide();
        this.alertService.error(error);
      }
    );
  }

}
