import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { NotifierService } from '../../services/notifier.service';
import Conversation from '../../models/conversation.model';
import { map } from 'rxjs/operators';
import { UserService } from 'src/app/auth/services/user.service';
import { ConversationService } from '../../services/conversation.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnDestroy, OnInit {
  form = new FormGroup({
    'user1_id': new FormControl(""),
    'user2_id': new FormControl(""),
    'message': new FormControl(),
    'date': new FormControl('')
  })
  laDate: Date = new Date();
  dateAFormater!: string;

  messages: any[] = [];
  lastUserMessage: any = '';
  newDate!: string;

  // creation du nom de cookie par rapport au port du localhost de l'application utilisée
  cookieId: string;

  @Input()
  user2_id: string = '';
  private disconnect$ = new Subject();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public notifierService: NotifierService,
    private userService: UserService,
    private conversationService: ConversationService) {
    this.connect();
    const port = window.location.port;  // recupere le port du localhost
    this.cookieId = `id_${port}`;       // nomme la variable cookieId en id_42xx
  }

  ngOnInit() {

    // On récupère la partie 'type' de l'URL
    // renvoi 0 si pas de valeur
    const user2_id = this.route.snapshot.paramMap.get('user2_id') || '0';

    /**
     * se connecte au service,
     * envoi les messages et les recupere
     * 
     * A faire => gestion de l'id
     */
    this.notifierService.subscribeToTopic(this.userService.getCookie(this.cookieId)).subscribe((message) => {
      const parsedMessage = JSON.parse(message.body); // Conversion de la chaîne JSON en objet JavaScript
      this.messages.push(parsedMessage.message); // Ajout de l'objet dans le tableau messages - recupere uniquement le message
    });

    // met a jour le formulaire avec les bonnes id
    this.ajoutFormId();

    // Recupere les messages de la Bdd relatifs à la conversation : user1 et user2
    this.getMessageConversation(user2_id);
    console.log(this.form.value);
  }


  connect() {
    this.notifierService.notify
      .pipe(takeUntil(this.disconnect$))
      .subscribe((msg: any) => {
        this.messages.push(msg);
      })

    this.notifierService.newMessage
      .pipe(takeUntil(this.disconnect$))
      .subscribe((msg: any) => {
        this.lastUserMessage = msg;
      })
    console.log("Connexion");
  }

  disconnect() {
    this.disconnect$.next(true);
    console.log("Deconnexion");
  }

  /**
   * Recupere la date du jour formatée pour le sql
   * Envoi l'add en Bdd
   * Envoi la notification de maj du front
   */
  sendMessage() {
    this.majDate();
    // this.notifierService.send(this.form.value);
    this.notifierService.sendMessage(this.form.value);
    this.form.patchValue({
      message: ''
    });
  }

  ngOnDestroy() {
    this.disconnect();
  }

  /**
   *   Formate la date : 2023-04-10 10:00:00
   *   pour etre acceptée en bdd 
   */
  majDate() {
    this.dateAFormater = this.laDate.toISOString().slice(0, 19).replace('T', ' ');
    this.form.patchValue({
      date: this.dateAFormater
    });
  }

  /**
   * recupere en get les conversations depuis la bdd;
   */
  private getConversations(): void {
    this.conversationService.getConversationsById(this.userService.getCookie(this.cookieId))
      .subscribe(conversations => this.messages = conversations);
  }

  private getMessageConversation(user2_id: string): void {
    this.conversationService.getConversationsByIdUnique(this.userService.getCookie(this.cookieId), user2_id)
      .pipe(
        map(conversations => conversations.map(conversation => conversation.message))
      )
      .subscribe(messages => this.messages = messages);
  }

  /**
   * ajoute les id utilisateur et receveur au formulaire
   */
  ajoutFormId(): void {
    this.form.patchValue({
      'user1_id': this.userService.getCookie(this.cookieId),
      'user2_id': this.route.snapshot.paramMap.get('user2_id') || '0'
    });
  }
}
