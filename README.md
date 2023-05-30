Projet de chat en Angular (Front) en cours

Base de données : mysql
front : Angular
Back : Java Spring Boot

Gère des utilisateurs et des messages privés entre utilisateurs

Ajout de ngx-cookie pour gérer les cookies (session utilisateurs)
Ajout de Rx-Stomp pour la gestion des sockets(Chat)

Lien vers le back : https://github.com/CreativeWeb59/chatBack

- dockerfile prévu pour créer une image front de l'application

- création des images autorisées par le back : localhost:4200 à localhost 4203

- connection utilisateurs basique : uniquement création du cookie 

- cookies du style id_4200 correspondant au port des images de manière à différencier les sessions pour les différents tests

- actuellement  : 

    - envoi des messages à tous les utilisateurs : ok

    - envoi des messages en privé : en cours

    - messages enregistrés en bdd : ok