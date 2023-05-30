import { Injectable } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})

export class SocketIoService {
  private socket: any;
  readonly url: string = "http://localhost:8080";

  constructor() {
    this.socket = io(this.url, {
      withCredentials: true
    });
  }

  /**
   * Methode qui permet d'envoyer le contenu du message au serveur
   * socket.io
   * le serveur recuperer sendMessage pour le traiter
   * et le renvoyer à Angular
   * @param message => contenu de l'input renseigné par l'utilisateur
   */

  public sendMessage(message: string) {
    console.log("envoi du message (service)" + message)
    this.socket.emit('sendMessage', message);
  }

  // ecoute le serveur socket.io
  public listen(eventName: string) {
    return new Observable((Subscriber) => {
      this.socket.on(eventName, (data: any) => {
        Subscriber.next(data);
      })
    });
  }

}
