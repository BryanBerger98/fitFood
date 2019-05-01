import { Component, OnInit, OnDestroy } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';
import { User } from 'src/app/models/User.model';
import { Subscription } from 'rxjs';
import * as firebase from 'firebase';
import * as $ from 'jquery';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {

  user: User;
  userSubscription: Subscription;

  loading: boolean = false;
  profileModalTitle: string;
  profileModalObject: string;

  constructor(private usersService: UsersService,
    private authenticationService: AuthenticationService,
    private router: Router) { }

  ngOnInit() {
    firebase.auth().onAuthStateChanged(
      (user) => {
        if (user) {
          this.initUser(user.uid);
          console.log(this.user);
        } else {
          console.log('déconnecté');
        }
      }
    );
  }

  initUser(userId) {
    this.userSubscription = this.usersService.userSuject.subscribe(
      (user: User) => {
        this.user = user;
        if (this.user !== undefined) {
          this.loading = true;
        } else {
          this.loading = false;
        }
      }
    );
    this.usersService.getUser(userId);
    this.usersService.emitUser();
  }

  onOpenProfileModal(title: string) {
    if (title === 'firstname') {
      this.profileModalTitle = 'Nom';
      this.profileModalObject = title;
    } else if (title === 'lastname') {
      this.profileModalTitle = 'Prénom';
      this.profileModalObject = title;
    } else if (title === 'email') {
      this.profileModalTitle = 'Adresse email';
      this.profileModalObject = title;
    } else if (title === 'phone') {
      this.profileModalTitle = "Téléphone";
      this.profileModalObject = title;
    } else if (title === 'birth') {
      this.profileModalTitle = "Date de naissance";
      this.profileModalObject = title;
    } else if (title === 'sex') {
      this.profileModalTitle = "Sexe";
      this.profileModalObject = title;
    }
    $('#profileModal').modal('show');    
  }

  onSaveProfile() {
    let userId = this.user.userId;
    let userFirstname = this.user.firstname;
    let userLastname = this.user.lastname;
    let userEmail = this.user.email;
    let userPhone = this.user.phone;
    let userBirth = this.user.birth;
    let userSex= this.user.sex;
    if (this.profileModalObject === 'firstname') {
      userFirstname = $('.profileModalInput').val();
      console.log(userFirstname);
    } else if (this.profileModalObject === 'lastname') {
      userLastname = $('.profileModalInput').val();
      console.log(userLastname);
    } else if (this.profileModalObject === 'email') {
      userEmail = $('.profileModalInput').val();
      var user = firebase.auth().currentUser;
      user.updateEmail(userEmail).then(function() {
        // Update successful.
      }).catch(function(error) {
        alert(error);
      });
      console.log(userEmail);
    } else if (this.profileModalObject === 'phone') {
      userPhone = $('.profileModalInput').val();
      console.log(userPhone);
    } else if (this.profileModalObject === 'birth') {
      userBirth = $('.profileModalInput').val();
      console.log(userBirth);
    } else if (this.profileModalObject === "sex") {
      userSex = $('.profileModalInput').val();
      console.log(userSex);
    }
    const newUser = new User(userId, userFirstname, userLastname, userEmail, userPhone, userBirth, userSex);
    this.usersService.updateUser(newUser, this.user.userId).then(
      () => {
        $('#profileModal').modal('hide');
        this.profileModalTitle = "";
        this.profileModalObject = "";
      }
    );
  }

  onSignOut() {
    this.authenticationService.signOutUser();
    this.router.navigate(['/signin']);
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

}
