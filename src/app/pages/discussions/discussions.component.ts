import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/auth/services/user.service';
import { ConversationService } from 'src/app/conversation/services/conversation.service';

@Component({
  selector: 'app-discussions',
  templateUrl: './discussions.component.html',
  styleUrls: ['./discussions.component.css']
})
export class DiscussionsComponent implements OnInit {
  messages: any[] = [];
  userId!: string;
  users: Set<any> = new Set(); // Ensemble des utilisateurs distincts

  // creation du nom de cookie par rapport au port du localhost de l'application utilisée
  cookieId: string;

  constructor(
    private userService: UserService,
    private conversationService: ConversationService
  ) {
    const port = window.location.port;  // recupere le port du localhost
    this.cookieId = `id_${port}`;       // nomme la variable cookieId en id_42xx
  }


  ngOnInit() {
    // met a jour la liste des discussions
    this.getListConversationById();
    this.userId = this.userService.getCookie(this.cookieId);
  }

  /**
   * recupere la liste de toutes les conversations avec tous les autres utilisateurs
   * compactée par userName avec l'id
   */
  getListConversationById() {
    // this.conversationService.getListConversationById(this.userService.getCookie("id"))
    // .subscribe(conversations => this.messages = conversations);
    this.conversationService.getListConversationById(this.userService.getCookie(this.cookieId)).subscribe({
      next: (data) => {
        this.messages = data;

        // Parcourir les messages et ajouter les utilisateurs à l'ensemble
        this.messages.forEach((message) => {
          if (this.userId == message.userEntity1.id) {
            if (!this.isUser2(message.userEntity2.id)) { // utilise la fonction pour vérifier si l'utilisateur2 est deja inscrit
              this.users.add(message.userEntity2);
            }
          } else if (this.userId == message.userEntity2.id) {
            if (!this.isUser2(message.userEntity1.id)) {
              this.users.add(message.userEntity1);
            }
          }
        });
      },
      error: (error) => {
        // Gérer les erreurs
        console.log(error);
      },
      complete: () => {
        // Réaliser des actions supplémentaires après la récupération des messages
      }
    });

  }

  /**
   * Verrifie si une conversation existe deja
   * transforme le set en tableau pour utiliser some
   * permet d'envoyer true si la valeur de l'id est trouvée
   */
  isUser2(id: string): boolean {
    const usersArray = Array.from(this.users);
    return usersArray.some((element) => element.id == id);
  }
}