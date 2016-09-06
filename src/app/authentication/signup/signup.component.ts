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
  selector: 'app-signup',
  templateUrl: 'signup.component.html',
  styleUrls: ['signup.component.css'],
  directives: [
    ROUTER_DIRECTIVES,
    FORM_DIRECTIVES,
    REACTIVE_FORM_DIRECTIVES,
    //MaterializeDirective,
    InputWakeUp],
})
export class SignupComponent implements OnInit {

  private signinServerError: any;
  private userData: any;
  private newUser = true;
  public userForm: FormGroup; // our model driven form

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private userService: UserService) {
    console.log('inside sign-up constructor');
  }

  ngOnInit() {
    console.log('inside ngOnInit of sign-up');
    this.initializeForm();
  }

  initializeForm(){
    this.createEmptyUserData();// could (conditionally) user supplied userData instead....
    this.userForm = this.formBuilder.group({
      username: [this.userData.username, [<any>Validators.required]],
      email: [this.userData.email, Validators.compose([<any>Validators.required, this.emailValidator])],
      passwords: this.formBuilder.group({
        password: [this.userData.password, [<any>Validators.required]],
        password2: [this.userData.password, [<any>Validators.required]]
      }, {validator: this.areEqual}),
      firstName: [this.userData.firstName, [<any>Validators.required]],
      lastName: [this.userData.lastName, [<any>Validators.required]],
      //joinedOn: [this.date.toISOString(), [<any>Validators.required]],//maybe fill this in upon submission instead...?!?
      //enabled: [true, [<any>Validators.required]],
      //preferredVersionID: [this.userData.preferredVersionID, [<any>Validators.required]],
    });

  }

  createEmptyUserData() {
    this.userData = {
      username: '',
      email: '',
      password: '',
      firstName: '',
      lastName: '',
    }
  }

  areEqual(group) {
    if (group.value.password === group.value.password2) {
      return null;
    } else {
      return {error: 'Passwords must match.'};
    }
  }

  emailValidator(control) {
    //see: http://stackoverflow.com/questions/34072092/generic-mail-validator-in-angular2
    var EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

    if (!EMAIL_REGEXP.test(control.value)) {
      return {invalidEmail: true};
    }
  }

  onSubmit() {
    //event.preventDefault();
    //console.log(this.loginForm);
    //var username: string;
    //var password: string;
    if (this.userForm.valid){
      this.signinServerError = null;//reinitialize it....
      this.userService.register(
        this.userForm.value.username,
        this.userForm.value.passwords.password,
        this.userForm.value.email,
        this.userForm.value.firstName,
        this.userForm.value.lastName
      ).subscribe(
        (result) => {
          console.log('back in the login component');
          console.log(result);
          this.router.navigate(['/login']);
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


}
