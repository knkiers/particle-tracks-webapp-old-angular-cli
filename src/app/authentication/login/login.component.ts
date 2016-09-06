import { Component, OnInit } from '@angular/core';
import { Router, ROUTER_DIRECTIVES } from '@angular/router';

import {
  FORM_DIRECTIVES,
  REACTIVE_FORM_DIRECTIVES,
  FormBuilder,
  FormGroup,
  FormArray,
  Validators, // used to make a field required
  FormControl
} from '@angular/forms';


import { UserService } from '../../shared/services/user.service';
import { InputWakeUp } from '../../shared/directives/input-wake-up.directive';

@Component({
  moduleId: module.id,
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css'],
  directives: [
    ROUTER_DIRECTIVES,
    FORM_DIRECTIVES,
    REACTIVE_FORM_DIRECTIVES,
    //MaterializeDirective,
    InputWakeUp],
})
export class LoginComponent implements OnInit {


  // see: https://github.com/auth0-blog/angular2-authentication-sample
  //      https://medium.com/@blacksonic86/angular-2-authentication-revisited-611bf7373bf9#.vwfc7gq9v
  //      https://scotch.io/tutorials/using-angular-2s-model-driven-forms-with-formgroup-and-formcontrol

  public loginForm: FormGroup; // model driven form
  private signinServerError: any;

  constructor(private userService: UserService,
              private router: Router,
              private _fb: FormBuilder) {}

  ngOnInit() {
    this.loginForm = this._fb.group({
      username: ['', [<any>Validators.required]],
      password: ['', [<any>Validators.required]]
    });

  }

  // QUESTION: Do we need to use event.preventDefault()...?  See the login
  //           component in https://github.com/auth0-blog/angular2-authentication-sample ....
  // NOTE: Not currently using angular2-jwt.

  onSubmit() {
    //event.preventDefault();
    //console.log(this.loginForm);
    //var username: string;
    //var password: string;
    if (this.loginForm.valid){
      this.signinServerError = null;//reinitialize it....
      this.userService.login(
        this.loginForm.value.username,
        this.loginForm.value.password).subscribe(
        (result) => {
          console.log('back in the login component');
          this.router.navigate(['/end-user']);
        },
        (error) => {
          let errorDict = JSON.parse(error._body);
          console.log('there was an error');
          console.log(errorDict);
          // if there are multiple errors, only the last one will be shown;
          // this will allow the user to fix one error at a time, which isn't so bad....
          for (var key in errorDict) {
            this.signinServerError = errorDict[key][0];//the text of the error is the only entry in an array....
            console.log(errorDict[key]);
          }
        });
    }
  }

  onRegister() {
    this.userService.register('newUser2', 'password123', 'user@user.com', 'New2', 'User2')
      .subscribe(
        (result) => {
          console.log(result)
        },
        (error) => {
          console.log('there was an error');
          console.log(error);
          this.signinServerError = error;
        });
  }




}
