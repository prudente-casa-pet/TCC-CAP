import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterLink, FormsModule],
})

export class HomePage {

  router: Router;

  constructor(private authService: AuthService, router: Router, private toastController: ToastController) {
    this.router = router;
  }

  senha: string = ''; 

  async fazerLogin(){
    let res = await this.authService.login(this.senha);
    if (res){
      this.presentToast(res);
    }
    else {
      this.router.navigate(['/']);
    }
  }

  async presentToast (mensagem:any) {
    const toast = await this.toastController.create({
      message: mensagem,
      duration: 2000,
      position: 'top',
    });
    await toast.present();
  }

}