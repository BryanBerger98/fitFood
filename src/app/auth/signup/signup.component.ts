import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UsersService } from 'src/app/services/users.service';
import { Router } from '@angular/router';
import { User } from 'src/app/models/User.model';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  signUpForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private usersService: UsersService,
    private router: Router) { }

  ngOnInit() {
    this.initSignUpForm();
  }

  initSignUpForm() {
    this.signUpForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(/[0-9a-zA-Z]{6,}/)]],
      passwordConfirm: ['', [Validators.required, Validators.pattern(/[0-9a-zA-Z]{6,}/)]],
      termsCheckbox: ['', Validators.requiredTrue]
    });
  }

  onSignUp() {
    const email = this.signUpForm.get('email').value;
    const password = this.signUpForm.get('password').value;
    const passwordConfirm = this.signUpForm.get('passwordConfirm').value;
    // const terms = this.signUpForm.get('termsCheckbox').value;
    // console.log(email + ' - ' + password + ' - ' + passwordConfirm + ' - ' + terms);
    if (password === passwordConfirm) {
      this.authenticationService.signUpUser(email, password).then(
        (data) => {
          const userId = data['user'].uid;
          const newUser = new User(userId, '','', email, '', '', '');
          this.usersService.createUser(newUser, userId);
          this.signUpForm.reset();
          this.router.navigate(['/profile']);
        },
        (error) => {
          // this.errMsg = error;
          // alert(this.errMsg);
        }
      );
    } else {
      alert ('Les mots de passe doivent être identiques !');
    }
  }

}
