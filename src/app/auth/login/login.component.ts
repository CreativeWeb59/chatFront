import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder  } from '@angular/forms';
import User from '../model/user.model';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
    // pas besoin de générer les FormControls
  // On précise aussi les validations
  formLogin: FormGroup = this.formBuilder.group({
    userName: ['', Validators.required],
    password: ['', Validators.required],
  }
  )
  public loginError: boolean = false;
  user!: User;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    
  ) {
    // this.userService.isAuthenticated$.subscribe((isAuthenticated) => {
    //   this.isAuthenticated = isAuthenticated;
    // });
  }

  ngOnInit(){
  }

  onSubmit(){
    if (this.formLogin.invalid) {
      return;
    }

    const userName = this.formLogin.value.userName;
    const password = this.formLogin.value.password;

    // Appeler le service d'authentification pour effectuer la vérification des informations de connexion
    const isAuthenticated = this.userService.authenticate(userName, password);
    console.log(isAuthenticated);
 
    if (isAuthenticated) {
      // Rediriger vers la page de succès de connexion
      // ...
      console.log("authentification réussie");
    } else {
      this.loginError = true;
      console.log("authentification false");
    }
  }

  /**
   * gestion de la deconnection
   */
  disconnect(){
    
    this.userService.logout();
    console.log("deconnection");
  }
}
