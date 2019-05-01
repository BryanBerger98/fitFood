import { Component } from '@angular/core';
import * as firebase from 'firebase';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'fitFood1';

  constructor() {
    var config = {
      apiKey: "AIzaSyAktNCgJUnaa4HkybxaiAq6SMHs4jpN_ac",
      authDomain: "health-d1d66.firebaseapp.com",
      databaseURL: "https://health-d1d66.firebaseio.com",
      projectId: "health-d1d66",
      storageBucket: "health-d1d66.appspot.com",
      messagingSenderId: "316398556013"
    };
    firebase.initializeApp(config);
  }

}
