import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { Recipe } from '../models/Recipe.model';
import { Subject } from 'rxjs';
import { Ingredient } from '../models/Ingredient.model';

@Injectable({
  providedIn: 'root'
})
export class RecipesService {

  recipe: Recipe;
  recipeSubject = new Subject<Recipe>();

  allRecipes: Recipe[] = [];
  allRecipesSubject = new Subject<Recipe[]>();

  ingredientsToShop: any[] = [];
  ingredientsToShopSubject = new Subject<Ingredient[]>();

  addToList: boolean = true;

  constructor() {
    this.getIngredientsToShop = this.getIngredientsToShop.bind(this);
  }

  emitRecipe() {
    this.recipeSubject.next(this.recipe);
  }

  emitAllRecipes() {
    this.allRecipesSubject.next(this.allRecipes);
  }

  emitIngredientsToShop() {
    this.ingredientsToShopSubject.next(this.ingredientsToShop);
  }

  saveAllRecipes(userId) {
    firebase.database().ref('/users/' + userId + '/recipes/').set(this.allRecipes);
  }

  createRecipe(newRecipe, userId) {
    this.allRecipes.push(newRecipe);
    this.saveAllRecipes(userId);
    this.emitAllRecipes();
  }

  updateRecipe(recipe: Recipe, recipeId: string, userId: string) {
    firebase.database().ref('/users/' + userId + '/recipes/' + recipeId).update(recipe);
  }

  updateShopParam(recipeId, userId) {
    if (this.allRecipes[+recipeId]['toShop'] === true) {
      this.allRecipes[+recipeId]['toShop'] = false;
    } else if (this.allRecipes[+recipeId]['toShop'] === false) {
      this.allRecipes[+recipeId]['toShop'] = true;
    }
    this.saveAllRecipes(userId);
    this.emitAllRecipes();
  }

  getRecipe(userId: string, recipeId: string) {
    firebase.database().ref('/users/' + userId + '/recipes/' + recipeId).on('value', (data) => {
      this.recipe = data.val();
      this.emitRecipe();
    });
  }

  getAllRecipes(userId: string) {
    firebase.database().ref('/users/' + userId + '/recipes/').on('value', (data) => {
      this.allRecipes = data.val() ? data.val() : [];
      this.emitAllRecipes();
    });
  }

  findRecipeIndex(recipe: Recipe) {
    const recipeIndex = this.allRecipes.findIndex(
      (recipeEl) => {
        if(recipeEl === recipe) {
          return true;
        }
      }
    );
    return recipeIndex;
  }

  getSingleRecipe(userId, recipeId) {
    return new Promise(
      (resolve, reject) => {
        firebase.database().ref('/users/' + userId + '/recipes/' + recipeId).once('value').then(
          (data) => {
            resolve(data.val());
          }, (error) => {
            reject(error);
          }
        );
      }
    );
  }

  removeRecipe(recipeId, userId) {
    this.allRecipes.splice(recipeId, 1);
    this.saveAllRecipes(userId);
    this.emitAllRecipes();
  }

  addIngredientsToShop(userId) {
    this.ingredientsToShop = [];
    firebase.database().ref('/users/' + userId + '/recipes').once('value', function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        var childKey = childSnapshot.key;
        var childData = childSnapshot.val();
        var ingredients = childData.ingredients;
        if (childData.toShop === true) { // if the recipe is added to shopping list
          ingredients.forEach(function(child) { // forEach Ingredients of recipes in shopping list from firebase
            this.compareIngredients(child);
          }.bind(this));
        }
      }.bind(this));
    }.bind(this));
    this.saveShoppingList(userId);
  }

  getIngredientsToShop(userId) {
    firebase.database().ref('/users/' + userId + '/shopping/').on('value', (data) => {
      this.ingredientsToShop = data.val();
      this.emitIngredientsToShop();
    });
  }

  compareIngredients(ingredient) {
    var ingToAddNameLower = ingredient.name.toLowerCase();
    if (this.ingredientsToShop.length !== 0) {
      for (let i = 0; i < this.ingredientsToShop.length; i++) {
        const element = this.ingredientsToShop[i];
        const elementNameLow = element.name.toLowerCase();
        if (elementNameLow.includes(ingToAddNameLower)) {
          element.quantity = +ingredient.quantity + +element.quantity;
          this.addToList = false;
        }
      }
      if (this.addToList === true) {
        this.ingredientsToShop.push(ingredient);
      } else {
        this.addToList = true;
      }
    } else {
      this.ingredientsToShop.push(ingredient);
    }
  }

  saveShoppingList(userId) {
    firebase.database().ref('/users/' + userId + '/shopping/').set(this.ingredientsToShop);
  }

  updateShoppingList(userId, ingredientId, ingredient) {
    firebase.database().ref('/users/' + userId + '/shopping/' + ingredientId).update(ingredient);
  }

}
