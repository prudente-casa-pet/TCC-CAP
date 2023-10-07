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
    data: any = '';
    data_saida: any = '';
    observacao: any = '';
    
  // Iniciação das variaveis
  ngOnInit(): void {
    this.servico = this.customData.cod_servico;
    this.qtd_banho = this.customData.qtd_banho;
    this.data = this.customData.data;
    this.data_saida = this.customData.data_saida;
    this.observacao = this.customData.observacao;
  }

  async gerarValor(){
    let diarias = 1;
    if (this.data_saida != this.data) {
      let d1:any = new Date(this.data);
      let d2:any = new Date(this.data_saida);
      let diff = d2 - d1;
      diarias = diff / (24 * 60 * 60 * 1000);
    }
    let valor_diaria = this.getAPI('listar', 'servico', this.servico)[0].valor_diaria;
    let valor = Number(valor_diaria) * diarias;
    let desconto = Number(this.getAPI('listar', 'pgtagendamento_agendamento', this.customData.cod_agendamento)[0].desconto);
    let valor_total = valor - desconto;
    let pagamento = {
      'cod_agendamento': Number(this.customData.cod_agendamento),
      'valor': Number(valor),
      'desconto': Number(desconto),
      'valor_total': Number(valor_total),
    }
    let resposta = await this.postAPI('atualizar', 'pgt_agendamento', '', pagamento);
    this.modalController.dismiss();
  }

   // Verifica se é array
  verificarArray (items:any): any {
    return Array.isArray(items);
  }

  // LÓGICA DE ATUALIZAÇÃO

  async atualizarAgendamento (codigo:any) {
    let agendamento = {
      'cod_servico': Number(this.servico),
      'data': `'${this.data}'`,
      'data_saida': `'${this.data_saida === '' ? this.customData : this.data_saida}'`,
      'qtd_banho': Number(this.qtd_banho),
      'observacao': `'${this.observacao}'`
    }
      let resposta = await this.postAPI('atualizar', 'agendamento', codigo, agendamento); 
      if(resposta.ERRO){
        this.presentToast(resposta.ERRO); //chama toast da verificação
      }
      else{
        this.gerarValor();
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
