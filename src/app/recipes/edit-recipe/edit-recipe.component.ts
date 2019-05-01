import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as $ from 'jquery';
import * as firebase from 'firebase';
import { Ingredient } from 'src/app/models/Ingredient.model';
import { Recipe } from 'src/app/models/Recipe.model';
import { RecipesService } from 'src/app/services/recipes.service';
import { UsersService } from 'src/app/services/users.service';
import { User } from 'src/app/models/User.model';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-recipe',
  templateUrl: './edit-recipe.component.html',
  styleUrls: ['./edit-recipe.component.css']
})
export class EditRecipeComponent implements OnInit {

  user: User;
  userSubscription: Subscription;

  recipe: Recipe;
  recipeSubscription: Subscription;

  loading: boolean = false;

  recipeForm: FormGroup;
  addedIngredients: any[] = [];
  addedSteps: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private recipesService: RecipesService,
    private usersService: UsersService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.initRecipeForm();
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
        setTimeout(() => {
          this.recipeForm.get('title').setValue(this.recipe.title);
          this.recipeForm.get('persons').setValue(this.recipe.persons);
          this.recipeForm.get('prepareTime').setValue(this.recipe.prepareTime);
          this.recipeForm.get('globalTime').setValue(this.recipe.globalTime);
          this.addedIngredients = this.recipe.ingredients ? this.recipe.ingredients : [];
          this.addedSteps = this.recipe.steps ? this.recipe.steps : [];
        }, 500)
      }
    );
    this.recipesService.getRecipe(userId, recipeId);
    this.recipesService.emitRecipe();
  }

  initRecipeForm() {
    this.recipeForm = this.formBuilder.group({
      title: ['', Validators.required],
      persons: [''],
      prepareTime: [''],
      globalTime: ['']
    });
  }

  onSaveRecipe() {
    const recipeId = this.route.snapshot.params['id'];
    const title = this.recipeForm.get('title').value;
    const persons = this.recipeForm.get('persons').value;
    const prepareTime = this.recipeForm.get('prepareTime').value;
    const globalTime = this.recipeForm.get('globalTime').value;
    const ingredient = this.addedIngredients ? this.addedIngredients : [];
    const steps = this.addedSteps ? this.addedSteps : [];
    const toShop = false;
    const newRecipe = new Recipe(title, persons, prepareTime, globalTime, ingredient, steps, toShop);
    if(this.route.snapshot.params['id']) {
      this.recipesService.updateRecipe(newRecipe, recipeId, this.user.userId);
    } else {
      this.recipesService.createRecipe(newRecipe, this.user.userId);
    }
    
    this.router.navigate(['/recipes']);
  }

  onAddIngredient() {
    const name = $('#recipeIngredientInput').val();
    const quantity = $('#recipeQuantityInput').val();
    if ($('#recipeUnitInput').val() === 'aucun') {
      const unit = '';
      const newIngredient = new Ingredient(name, quantity, unit, false);
      this.addedIngredients.push(newIngredient);
      console.log(this.addedIngredients);
    } else {
      const unit = $('#recipeUnitInput').val();
      const newIngredient = new Ingredient(name, quantity, unit, false);
      this.addedIngredients.push(newIngredient);
    }
    $('#recipeIngredientInput').val('');
    $('#recipeQuantityInput').val('');
  }

  onRemoveIngredient(id: number) {
    //this.propertiesService.removePropertyPhoto(this.photosAdded[id]);
    this.addedIngredients.splice(id, 1);
  }

  onAddStep() {
    const step = $('#recipeStepInput').val();
    this.addedSteps.push(step);
    $('#recipeStepInput').val('');
  }

  onRemoveStep(id: number) {
    this.addedSteps.splice(id, 1);
  }

}
