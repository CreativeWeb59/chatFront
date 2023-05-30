import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RxStomp } from '@stomp/rx-stomp';
import { Observable, Subject, map, share } from 'rxjs';
import Conversation from '../models/conversation.model';


@Injectable({
  providedIn: 'root'
})
export class NotifierService {
  private readonly apiUrl = 'http://localhost:8080/conversation';

  notify: Observable<any> = new Subject();
  newMessage: Observable<any> = new Subject();

  constructor(private stomp: RxStomp, private http: HttpClient) {
    this.notify = stomp.watch('/notifier/message')
      .pipe(
        map(message => JSON.parse(message.body)),
        share({ resetOnRefCountZero: true })
      );

    this.newMessage = stomp.watch('/notifier/new-message')
      .pipe(
        map(message => JSON.parse(message.body)),
        share({ resetOnRefCountZero: true })
      )
  }

  /**
   * permet d'envoyer le message vers le back
   * pour sauvegarde Bdd
   * @param message : Contenu du formulaire
   */
  // public send(message: any) {
  //   this.stomp.publish({
  //     destination: 'app/message',
  //     body: JSON.stringify(message),
  //     headers: { 'content-type': 'application/json' }
  //   });
  // }

  /**
  * envoie les donnees au back qui renvoi au front
  * afin de mettre à jour le socket sur les clients front
   * @param message 
   */
  public sendMessage(message: any) {
    this.stomp.publish({
      destination: `/app/private-message/${message.user2_id}`,
      body: JSON.stringify(message),
      headers: { 'content-type': 'application/json' }
    });
  }


  // Ajout
  // public subscribeToTopic(topic: string) {
  //   //    return this.stomp.watch(`/topic/${topic}`);
  //   return this.stomp.watch(`/topic/new-message`);
  // }

  // Ajout
  public subscribeToTopic(user1_id: string) {
    return this.stomp.watch(`/private/message/${user1_id}`);
    // return this.stomp.watch(`/topic/messages`);
  }

  
  getConversations(): Observable<Conversation[]> {
    return this.http.get<Conversation[]>(this.apiUrl);
  }

  
  
}

// commande docker :
// docker build --rm -f chatfront/Dockerfile -t chatfront:v1 chatfront