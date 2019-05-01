import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { User } from '../models/User.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  user: User;
  userSuject = new Subject<User>();

  allUsers: any[];
  allUsersSubject = new Subject<any[]>();

  constructor() { }

  emitUser() {
    this.userSuject.next(this.user);
  }

  updateUser(user: User, userId: string) {
    return new Promise (
      (resolve, reject) => {
        firebase.database().ref('/users/' + userId).update(user).then(
          () => {
            resolve();
          },
          (error) => {
            reject(error);
          }
        );
      }
    )
  }

  // updateUserEmail(email: string) {
  //   var user = firebase.auth().currentUser;
  //   user.updateEmail(email).then(function() {
  //     // Update successful.
  //   }).catch(function(error) {
  //     // An error happened.
  //   });
  // }

  getUser(userId: string) {
    firebase.database().ref('/users/' + userId).on('value', (data) => {
      this.user = data.val();
      this.emitUser();
    });
  }

  createUser(newUser, userId) {
    return new Promise(
      (resolve, reject) => {
        firebase.database().ref('/users/' + userId).set(newUser).then(
          () => {
            resolve();
          },
          (error) => {
            reject(error);
          }
        );
      }
    );
  }

  uploadFile(file: File) {
    return new Promise(
      (resolve, reject) => {
        const uniqueId = Date.now().toString();
        const upload = firebase.storage().ref().child('images/users/' + uniqueId + file.name).put(file);
        upload.on(firebase.storage.TaskEvent.STATE_CHANGED,
          () => {
            console.log('Loading...');
          },
          (error) => {
            console.log('Error ! : ' + error);
            reject();
          },
          () => {
            upload.snapshot.ref.getDownloadURL().then(function(downloadURL) {
              resolve(downloadURL);
            });
          }
        );
      }
    );
  }

  removeUserPhoto(photoLink: string) {
    if (photoLink) {
      const storageRef = firebase.storage().refFromURL(photoLink);
      storageRef.delete().then(
        () => {
          console.log('File deleted');
        }
      ).catch(
        (error) => {
          console.log('File not found : ' + error);
        }
      );
    }
  }

}
