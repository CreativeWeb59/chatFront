import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CookieModule } from 'ngx-cookie';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import { NavBarComponent } from './commons/nav-bar/nav-bar.component';
import { FooterComponent } from './commons/footer/footer.component';
import { NotFoundComponent } from './commons/not-found/not-found.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { MessagesComponent } from './conversation/pages/messages/messages.component';
import { RxStomp } from '@stomp/rx-stomp';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { DiscussionsComponent } from './pages/discussions/discussions.component';


@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    NavBarComponent,
    FooterComponent,
    NotFoundComponent,
    HomePageComponent,
    MessagesComponent,
    LoginComponent,
    RegisterComponent,
    DiscussionsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    CookieModule.withOptions()
  ],
  providers: [
    {
      provide: RxStomp,
      useFactory: () => {
        const rxStomp = new RxStomp();
        rxStomp.configure({
          brokerURL: 'ws://localhost:8080/stomp'
        });
        rxStomp.activate();
        return rxStomp;
      },
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
