import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class ShoppingService {

  // allRecipes: Recipe[] = [];
  // allRecipesSubject = new Subject<Recipe[]>();

  shoppingList: any[] = [];
  shoppingListSubject = new Subject<any[]>();

  constructor() { }

  emitShoppingList() {
    this.shoppingListSubject.next(this.shoppingList);
  }

  saveShoppingList(userId) {
    firebase.database().ref('/users/' + userId + '/shopping/').set(this.shoppingList);
  }

  addRecipeToList(recipeId, userId) {
    this.shoppingList.push(recipeId);
    this.saveShoppingList(userId);
    this.emitShoppingList();
  }

  // removeRecipeFromList(recipeId, userId) {
  //   this.shoppingList.splice(recipeId, 1);
  //   this.saveShoppingList(userId);
  //   this.emitShoppingList();
  // }

  getRecipeFromList() {
    
  }

}
