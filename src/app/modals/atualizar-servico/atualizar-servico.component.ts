import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonicModule, ModalController, NavParams, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-atualizar-servico',
  templateUrl: './atualizar-servico.component.html',
  styleUrls: ['./atualizar-servico.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterLink, FormsModule]
})
export class AtualizarServicoComponent  implements OnInit {

  constructor(private modalController: ModalController, private toastController: ToastController) {}
  @Input() customData: any;

  // Declaração de variaveis
  valor_diaria: any;

  // Iniciação da variavel
  ngOnInit(): void {
    this.valor_diaria = this.customData.valor_diaria;
  }

    // LÓGICA DE ATUALIZAÇÃO

  async atualizarServico (codigo:any) {

    let servico = {
      'valor_diaria': `'${this.valor_diaria}`
    }
    let resposta = await this.postAPI('atualizar', 'servico', codigo, servico); 
    if (resposta.ERRO) {
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
      
  // Faz um get na API
  getAPI(metodo:any, tabela:any, parametro:any) {
    const request = new XMLHttpRequest();
    request.open('GET', `http://localhost/Aula/API/${metodo}/${tabela}/${parametro}`, false);
    request.send();  
    if (request.status === 200) {
      return JSON.parse(request.responseText);
    } else {
      console.error('Erro na requisição:', request.status);
      return Array();
    }
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
