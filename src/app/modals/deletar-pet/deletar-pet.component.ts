import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonicModule, ModalController, NavParams } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';


@Component({
  selector: 'app-deletar-pet',
  templateUrl: './deletar-pet.component.html',
  styleUrls: ['./deletar-pet.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterLink, FormsModule]
})
export class DeletarPetComponent  implements OnInit {
  constructor(private modalController: ModalController, private firebaseService: FirebaseService) {}
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  closeModal() {
    this.modalController.dismiss();
  }

  @Input() customData: any;

  deletarPet(parametro:any){
    let foto = this.getAPI('listar', 'pet', parametro)[0].foto_perfil;  // Foto perfil do pet
    if(foto){
      this.deletarArquivo(foto);  // Apaga foto de perfil
    }
    this.getAPI('deletar', 'pet', parametro);  // Apaga pet
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

  deletarArquivo(caminho:any) {
    this.firebaseService.excluirImagem(caminho);
  }
}
