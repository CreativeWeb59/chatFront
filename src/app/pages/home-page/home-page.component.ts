import { Component } from '@angular/core';
import { UserService } from 'src/app/auth/services/user.service';


@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent{

  date: string = '';
  laDate: Date = new Date();

  constructor(private userService: UserService){

}



  onClick(){
    
    // Format qui fonctionne : 2023-04-10 10:00:00
    // this.date = this.laDate.format("m/dd/yy");
    this.date = this.laDate.toISOString().slice(0, 19).replace('T', ' ');
    // this.date = this.datePipe.transform(this.laDate, 'yyyy-MM-dd HH:mm:ss')
    // const formattedDate = this.datePipe.transform(this.laDate, 'yyyy-MM-dd HH:mm:ss');
    
    // recuperation du cookie de connexion
    const port = window.location.port;  // recupere le port du localhost
    const cookieUserName = `userName_${port}`;       // nomme la variable cookieId en id_42xx
    console.log(this.userService.getCookie(cookieUserName));
  }
}


