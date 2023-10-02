import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonicModule, ModalController, NavParams, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-atualizar-procedimentos',
  templateUrl: './atualizar-procedimentos.component.html',
  styleUrls: ['./atualizar-procedimentos.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterLink, FormsModule]
})
export class AtualizarProcedimentosComponent  implements OnInit {

  constructor(private modalController: ModalController, private toastController: ToastController) {}
  @Input() customData: any;

  // Declaração de variaveis
  nome: any;
  intervalo: any;

  // Iniciação das variaveis
  ngOnInit(): void {
    this.nome = this.customData.nome;
    this.intervalo = this.customData.intervalo;
  }

  // LÓGICA DE ATUALIZAÇÃO

  async atualizarProcedimentos (codigo:any) {
      let procedimentos = {
        'nome': `'${this.nome}'`,
        'intervalo': `'${this.intervalo}'`
      }
      let resposta = await this.postAPI('atualizar', 'tipoprocedimento', codigo, procedimentos); 
      if(resposta.ERRO){
        this.presentToast(resposta.ERRO); //chama toast da verificação
      }
      else{
        this.modalController.dismiss();
    }
  }
  
  // Faz um post na API
  async postAPI(acao:any, tabela:any, parametro:any, dados:any) {
    const options = {
      method: 'POST',
      body: JSON.stringify(dados),
      headers: {
        'Content-Type': 'application/json'
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
