import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TimelineComponent } from './timeline/timeline.component';
import { LoginUserComponent } from './login-user/login-user.component';
import { RegisterUserComponent } from './register-user/register-user.component';
import { AccountDetailComponent } from './account-detail/account-detail.component';
import { NgrxComponent } from "./ngrx/ngrx.component";

const routes: Routes = [
  { path: 'timeline', component: TimelineComponent },
  { path: 'login', component: LoginUserComponent },
  { path: 'register', component: RegisterUserComponent },
  { path: 'account/:username', component: AccountDetailComponent },
  { path: 'ngrx', component: NgrxComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
