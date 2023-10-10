import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TimelineComponent } from './timeline/timeline.component';
import { HttpClientModule } from '@angular/common/http';
import { ButtonComponent } from './shared/button/button.component';
import { CreatePostComponent } from './create-post/create-post.component';
import { RegisterUserComponent } from './register-user/register-user.component';
import { LoginUserComponent } from './login-user/login-user.component';
import { InputComponent } from './shared/input/input.component';
import { LogoutComponent } from './logout/logout.component';
import { AccountDetailComponent } from './account-detail/account-detail.component';
import { CreateCommentComponent } from './create-comment/create-comment.component';
import { StoreModule } from '@ngrx/store';
import { counterReducer } from "./counter/counter.reducer";
import { CounterComponent } from "./counter/counter.component";
import { SearchComponent } from './search/search.component';
import { NavbarComponent } from './navbar/navbar.component';
import { showFormReducer, showCommentsReducer } from "./timeline/show-form.reducer";

@NgModule({
  declarations: [
    AppComponent,
    TimelineComponent,
    ButtonComponent,
    CreatePostComponent,
    RegisterUserComponent,
    LoginUserComponent,
    InputComponent,
    LogoutComponent,
    AccountDetailComponent,
    CreateCommentComponent,
    CounterComponent,
    SearchComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    StoreModule.forRoot({ count: counterReducer, showForm: showFormReducer, showComments: showCommentsReducer })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
