import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { NotFoundComponent } from './commons/not-found/not-found.component';
import { MessagesComponent } from './conversation/pages/messages/messages.component';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { DiscussionsComponent } from './pages/discussions/discussions.component';

const routes: Routes = [
  // On indique que tous les chemins 'vides' seront renvoyés vers l'URI '/home'
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  { path: 'home', component: HomePageComponent },
  { path: 'auth', component: RegisterComponent },
  { path: 'connexion', component: LoginComponent },
  // liste de toutes les discussions
  { path: 'discussions', component: DiscussionsComponent },
  { path: 'messages', component: MessagesComponent },
  // detail de la conversation avec un user
  { path: 'messages/:user2_id', component: MessagesComponent },

    // ... on va les rediriger vers le composant NotFoundComponent
    { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
