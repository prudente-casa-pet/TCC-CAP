import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonicModule, ModalController, NavParams, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-atualizar-procedimento-pet',
  templateUrl: './atualizar-procedimento-pet.component.html',
  styleUrls: ['./atualizar-procedimento-pet.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterLink, FormsModule]
})

export class AtualizarProcedimentoPetComponent  implements OnInit {

  constructor(private modalController: ModalController, private toastController: ToastController) {}
  @Input() customData: any;

  // Declaração de variaveis
  data: any;
  descricao: any;

  // Iniciação da variavel
  ngOnInit(): void {
    this.data = this.customData.data;
    this.descricao = this.customData.descricao;
  }

    // LÓGICA DE ATUALIZAÇÃO

  async atualizarProcedimentoPet (codigo:any) {
    if (this.data == null) {
      this.presentToast("Data não foi escolhida");
    } else {
      let pet_procedimento = {
        'data': `'${this.data}'`,
        'descricao': `'${this.descricao}'`
      }
      let resposta = await this.postAPI('atualizar', 'pet_procedimento', codigo, pet_procedimento); 
      if (resposta.ERRO) {
        this.presentToast(resposta.ERRO); //chama toast da verificação
      }
      else{
        this.modalController.dismiss();
      }
    }
  }
  
  // Faz um post na API
  async postAPI(acao:any, tabela:any, parametro:any, dados:any) {
    const options = {
      method: 'POST',
      body: JSON.stringify(dados),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }
    return fetch(`http://localhost/Aula/API/${acao}/${tabela}/${parametro}`, options)
    .then(res => {
      return res.json();
    })
    .catch(err => {
      return err.json()
    })
  }
  
  
  // LÓGICA DOS COMPONENTES

  closeModal() {
    this.modalController.dismiss();
  }
  
  async presentToast(mensagem:any) {
    const toast = await this.toastController.create({
      message: mensagem,
      duration: 2000,
      position: 'top',
    });    
    await toast.present();
  }

}
