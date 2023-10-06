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
    CreateCommentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
