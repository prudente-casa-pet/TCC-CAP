import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonicModule, ModalController, NavParams } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-deletar-tutor',
  templateUrl: './deletar-tutor.component.html',
  styleUrls: ['./deletar-tutor.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterLink, FormsModule]
})
export class DeletarTutorComponent  implements OnInit {

  constructor(private modalController: ModalController) {}
  ngOnInit(): void {
  }

  closeModal() {
    this.modalController.dismiss();
  }

  @Input() customData: any;

  deletarTutor(parametro:any){
    this.getAPI('deletar', 'tutor', parametro);  // Apaga tutor
    this.getAPI('deletar', 'login_tutor', parametro);  // Apaga login do tutor
    this.modalController.dismiss();
  }

  getAPI(metodo:any, tabela:any, parametro:any) {
    const request = new XMLHttpRequest();
    request.open('GET', `http://localhost/Aula/API/${metodo}/${tabela}/${parametro}`, false);
    const token = localStorage.getItem('token');
    if (token) {
      request.setRequestHeader('Authorization', `Bearer ${token}`);
    }
    request.send();

    if (request.status === 200) {
      if (JSON.parse(request.responseText).ACESSO){
        console.log(JSON.parse(request.responseText).ACESSO)
        localStorage.clear();
        window.location.reload();
      } else {
        return JSON.parse(request.responseText);
      }
    } else {
        console.error('Erro na requisição:', request.status);
        return Array();
    }
  }

}
