import { Component, OnInit } from '@angular/core';
import { RecipesService } from '../services/recipes.service';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import * as $ from 'jquery';
import { Recipe } from '../models/Recipe.model';
import { Subscription } from 'rxjs';
import { User } from '../models/User.model';
import { UsersService } from '../services/users.service';
import { ShoppingService } from '../services/shopping.service';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css']
})
export class RecipesComponent implements OnInit {

  loading: boolean = false;

  user: User;
  userSubscription: Subscription;

  allRecipes: Recipe[];
  allRecipesSubscription: Subscription;

  constructor(private recipesService: RecipesService,
    private usersService: UsersService,
    private shoppingService: ShoppingService,
    private router: Router) { }

  ngOnInit() {
    firebase.auth().onAuthStateChanged(
      (user) => {
        if (user) {
          this.initUser(user.uid);
          this.initAllRecipes(user.uid);
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

  initAllRecipes(userId) {
    this.allRecipesSubscription = this.recipesService.allRecipesSubject.subscribe(
      (allRecipes: Recipe[]) => {
        this.allRecipes = allRecipes;
      }
    );
    this.recipesService.getAllRecipes(userId);
    this.recipesService.emitAllRecipes();
  }

  onNewRecipe() {
    this.router.navigate(['/recipe', 'edit']);
  }

  onDisplayRecipe(id) {
    this.router.navigate(['/recipe', id]);
  }

  onAddRecipeToShoppingList(recipeId) {
    this.recipesService.updateShopParam(recipeId, this.user.userId);
    this.recipesService.addIngredientsToShop(this.user.userId);
  }

  onRemoveRecipeFromShoppingList(recipeId) {
    this.recipesService.updateShopParam(recipeId, this.user.userId);
    this.recipesService.addIngredientsToShop(this.user.userId);
  }

}
