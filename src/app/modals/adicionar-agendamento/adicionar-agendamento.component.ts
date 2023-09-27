import { CommonModule, NumberSymbol } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonicModule, ModalController, NavParams, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-adicionar-agendamento',
  templateUrl: './adicionar-agendamento.component.html',
  styleUrls: ['./adicionar-agendamento.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterLink, FormsModule]
})
export class AdicionarAgendamentoComponent  implements OnInit {

  constructor(private modalController: ModalController, private toastController: ToastController) {}
  @Input() customData: any;

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  // Declaração de variavéis
  tutor: any = "";
  cod_tutor: any = '';
  tutorSelecionado = true;
  cod_pet: any = '';
  servico: any = '1';
  qtd_banho: any = '';
  observacoes: any = '';
  cod_pacote: any = '';
  status: any = false;
  valor: any = '0.00';
  desconto: any = 0;
  valor_total: any = Number(this.valor)+Number(this.desconto);
  forma:any = '';


  // LÓGICA DO FORMULARIO
  procurarTutor () {  // Ao desclicar input tutor, procura um tutor com o nome
    let res = this.getAPI('listar', 'tutor', this.tutor)[0];
    if (res){  // Se for achado um tutor, permite cadastro
      this.tutor = res.nome;
      this.tutorSelecionado = false;
      this.cod_tutor = res.cod_tutor;
    } else {
      this.tutorSelecionado = true;
    }
  }
  
  // Verifica se é array
  verificarArray (items:any): any {
    return Array.isArray(items)
  }

  // LÓGICA DE ADICIONAR  
  async adicionarAgendamento () {
    if (this.tutorSelecionado) {  // Se um tutor não for escolhido
      this.presentToast("Escolha um tutor válido");
    } 
  }
    
    // Faz um post na API
    async postAPI (acao:any, tabela:any, parametro:any, dados:any) {
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
    getAPI (metodo:any, tabela:any, parametro:any) {
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