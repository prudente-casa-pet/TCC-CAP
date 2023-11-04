import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonicModule, ModalController, NavParams, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-atualizar-agendamento',
  templateUrl: './atualizar-agendamento.component.html',
  styleUrls: ['./atualizar-agendamento.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterLink, FormsModule]
})

export class AtualizarAgendamentoComponent  implements OnInit {

  constructor(private modalController: ModalController, private toastController: ToastController) {}
  @Input() customData: any;

    // Declaração de variavéis
    servico: any = '1';
    qtd_banho: any = '0';
    observacao: any = '';
    
  // Iniciação das variaveis
  ngOnInit(): void {
    this.servico = this.customData.cod_servico;
    this.qtd_banho = this.customData.qtd_banho;
    this.observacao = this.customData.observacao;
  }

   // Verifica se é array
  verificarArray (items:any): any {
    return Array.isArray(items);
  }

  // LÓGICA DE ATUALIZAÇÃO

  async atualizarAgendamento (codigo:any) {
    let agendamento = {
      'qtd_banho': Number(this.qtd_banho),
      'observacao': `'${this.observacao}'`
    }
    let resposta = await this.postAPI('atualizar', 'agendamento', codigo, agendamento); 
    if (resposta.ERRO) {
      this.presentToast(resposta.ERRO); //chama toast da verificação
    } else {
      this.modalController.dismiss();
    }
  }
  
  // Faz um post na API
  async postAPI (acao:any, tabela:any, parametro:any, dados:any) {
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
      
  // Faz um get na API
  getAPI (metodo:any, tabela:any, parametro:any) {
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

    // LÓGICA DOS COMPONENTES

    closeModal () {
      this.modalController.dismiss();
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
