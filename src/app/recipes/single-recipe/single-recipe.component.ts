import { Component, OnInit, OnDestroy } from '@angular/core';
import { Recipe } from 'src/app/models/Recipe.model';
import { Subscription } from 'rxjs';
import { RecipesService } from 'src/app/services/recipes.service';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from 'src/app/models/User.model';
import { UsersService } from 'src/app/services/users.service';
import * as firebase from 'firebase';
import * as $ from 'jquery';

@Component({
  selector: 'app-single-recipe',
  templateUrl: './single-recipe.component.html',
  styleUrls: ['./single-recipe.component.css']
})
export class SingleRecipeComponent implements OnInit, OnDestroy {

  recipe: Recipe;
  recipeSubscription: Subscription;

  user: User;
  userSubscription: Subscription;

  loading: boolean = false;

  constructor(private recipesService: RecipesService,
    private usersService: UsersService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    firebase.auth().onAuthStateChanged(
      (user) => {
        if (user) {
          this.initUser(user.uid);
          this.initRecipe(user.uid);
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

  initRecipe(userId) {
    const recipeId = this.route.snapshot.params['id'];
    this.recipeSubscription = this.recipesService.recipeSubject.subscribe(
      (recipe: Recipe) => {
        this.recipe = recipe;
      }
    );
    this.recipesService.getRecipe(userId, recipeId);
    this.recipesService.emitRecipe();
  }

  onRemoveRecipe() {
    const recipeId = this.route.snapshot.params['id'];
    this.recipesService.removeRecipe(recipeId, this.user.userId);
    $('#removeRecipeModal').modal('hide');
    this.router.navigate(['/recipes']);
  }

  onEditRecipe() {
    const recipeId = this.route.snapshot.params['id'];
    this.router.navigate(['/recipe', 'edit', recipeId]);
  }

  ngOnDestroy() {
    this.recipeSubscription.unsubscribe();
  }

}
