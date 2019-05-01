import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignupComponent } from './auth/signup/signup.component';
import { SigninComponent } from './auth/signin/signin.component';
import { ProfileComponent } from './user/profile/profile.component';
import { HomeComponent } from './home/home.component';
import { RecipesComponent } from './recipes/recipes.component';
import { SingleRecipeComponent } from './recipes/single-recipe/single-recipe.component';
import { EditRecipeComponent } from './recipes/edit-recipe/edit-recipe.component';
import { AuthGuardService } from './services/auth-guard.service';
import { ShoppingComponent } from './shopping/shopping.component';

const routes: Routes = [
  { path: 'home', canActivate: [AuthGuardService], component: HomeComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'signin', component: SigninComponent },
  { path: 'profile', canActivate: [AuthGuardService], component: ProfileComponent },
  { path: 'recipes', canActivate: [AuthGuardService], component: RecipesComponent },
  { path: 'recipe/edit', canActivate: [AuthGuardService], component: EditRecipeComponent },
  { path: 'recipe/edit/:id', canActivate: [AuthGuardService], component: EditRecipeComponent },
  { path: 'recipe/:id', canActivate: [AuthGuardService], component: SingleRecipeComponent },
  { path: 'shopping', canActivate: [AuthGuardService], component: ShoppingComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
