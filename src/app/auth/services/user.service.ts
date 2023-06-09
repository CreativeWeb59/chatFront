import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, BehaviorSubject, count } from 'rxjs';
import { CookieOptions, CookieService } from 'ngx-cookie';
import User from '../model/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly apiUrl = 'http://localhost:8080/users';
  private isLoggedInSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public isLoggedIn$: Observable<boolean> = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient,
    private cookieService: CookieService
  ) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  addUser(user: User): Observable<User> {
    console.log("Envoi creation utilisateur au back");
    return this.http.post<User>(this.apiUrl, user);
  }

  updateUser(user: User): Observable<User> {
    const url = `${this.apiUrl}/${user.id}`;
    return this.http.put<User>(url, user);
  }

  deleteUser(userId: number | null): Observable<unknown> {
    const url = `${this.apiUrl}/${userId}`;
    return this.http.delete(url);
  }

  /**
   * recupere un utilisateur
   * @returns 
   */
  getUser(userName: string, password: string): Observable<User> {
    const url = `${this.apiUrl}/${userName}/${password}`;
    console.log('Service user : ' + this.http.get<User[]>(url));
    return this.http.get<User>(url);
  }

  // getLeUser(userName: string, password: string): Observable<User> {
  //   const url = `${this.apiUrl}/${userName}/${password}`;
  //   return this.http.get<User>(url);
  // }

  getUserAuth(userName: string, password: string): Observable<any> {
    const url = `${this.apiUrl}/${userName}/${password}`;
    return this.http.get<any>(url);
  }

  /**
   * methode de connexion
   */
  public login(): void {
    // Effectuer ici la logique d'authentification, par exemple, envoyer une requête HTTP pour vérifier les informations de connexion.

    // Après une authentification réussie :
    this.isLoggedInSubject.next(true);
  }

  /**
   * methode de deconnection
   */
  public logout(): void {
    // Effectuer ici la logique de déconnexion, par exemple, supprimer les cookies ou les jetons d'authentification.
    console.log("logout");
    // Après une déconnexion réussie :
    this.isLoggedInSubject.next(false);
  }

  /**
   * methode pour tester la connection
   * @returns 
   */
  public isLoggedIn(): boolean {
    return this.isLoggedInSubject.value;
  }

  /**
   * authentifie l'utilisateur
   * fait un appel en bd pour recuperer si l'utilisateur et le password sont corrects
   * si le back ne renvoi pas "not" on stocke le cookie et renvoi true
   * sinon renvoi false
   */
  authenticate(userName: string, password: string) {
    // creation du nom de cookie par rapport au port du localhost de l'application utilisée
    const port = window.location.port;
    const cookieId = `id_${port}`;
    const cookieUserName = `userName_${port}`;

    return this.getUserAuth(userName, password).subscribe(
      (response: any) => {
        if (response.userName != "not" && response.id != "not") {
          this.putCookie(cookieId, ("" + response.id));
          this.putCookie(cookieUserName, response.userName);
          console.log("test true");
          return true;
        } else {
          console.log("mauvaise connexion");
          return false;
        }
      },
      (error: any) => {
        // Gérez l'erreur de la requête GET ici
        console.log("erreur");
        return false;
      }
    );
  }


  // getUserData(userName: string, password: string) {
  //   this.getLeUser(userName, password).subscribe(
  //     (user: User) => {
  //       if (user.userName != "not" && user.email != "not" && user.id){
  //         this.user = user;
  //         this.putCookie("id", (""+user.id));
  //         this.putCookie("userName", user.userName);
  //       }
  //     },
  //     (error) => {
  //       // Gérer les erreurs de la requête ici
  //       console.log("erreur");
  //     }
  //   );
  // }

  getCookie(key: string) {
    return this.cookieService.get(key) || "0";
  }

  /**
 * @param {string} key Id for the `value`.
 * @param {string} value Raw value to be stored.
 * @param {CookieOptions} options (Optional) Options object.
 */
  putCookie(key: string, value: string): void {
    this.cookieService.put(key, value);
    console.log("Le cookie : " + key + " : " + value);
  }
}
