import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApplicationStateService } from 'src/app/core/services/aplication-state/aplication-state.service';
import { User } from 'src/app/core/classes/user';
import { LoginService } from 'src/app/core/services/login/login.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from 'src/app/core/services/alert/alert.service';


@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  
  userModel: User;
  loginForm: FormGroup;
  mobileView: Boolean;
  validUser: Boolean = true;


  constructor(private applicationState: ApplicationStateService, 
    private fb: FormBuilder,
    private loginService: LoginService,
    private spinner: NgxSpinnerService,
    private alertService: AlertService,
    private router: Router) { }

  ngOnInit() {
    this.mobileView = this.applicationState.getIsMobileResolution();
    this.userModel = new User;
    this.userModel.email = this.userModel.password = '';
    this.loginForm = this.fb.group({
      userType: new FormControl(this.userModel.type, Validators.required),
      userEmail: new FormControl(this.userModel.email, [Validators.required, Validators.email]),
      userPassword: new FormControl(this.userModel.password, Validators.required),
    });
  }

  onChange(event) {
    this.userModel.type = event;
  }

  onSubmit() {
    this.spinner.show();
    this.userModel = {
      email: this.loginForm.get('userEmail').value,
      password: this.loginForm.get('userPassword').value,
      type: this.loginForm.get('userType').value
    }
    this.loginService.loginUser$(this.userModel).subscribe(
      response => {
        this.spinner.hide();
        this.router.navigate(['/calendar']);
      },
      error => {
        this.spinner.hide();
        this.alertService.error(error);
      }
    );
  }

}
