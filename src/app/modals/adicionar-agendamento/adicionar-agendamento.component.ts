import { CommonModule, NumberSymbol } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonicModule, ModalController, NavParams, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ListarAgendamentosComponent } from '../listar-agendamentos/listar-agendamentos.component';

@Component({
  selector: 'app-adicionar-agendamento',
  templateUrl: './adicionar-agendamento.component.html',
  styleUrls: ['./adicionar-agendamento.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterLink, FormsModule]
})

export class AdicionarAgendamentoComponent  implements OnInit {

  constructor(private modalController: ModalController, private toastController: ToastController) {}
  @Input() customData: any

  ngOnInit(): void {
    this.dataModal = `${this.customData.slice(8,10)}/${this.customData.slice(5,7)}`;
    this.gerarValor();    
  }

  // Abre modal de adicionar pet
  async modalListarAgendamentos(data: any) {
    const modal = await this.modalController.create({
      component: ListarAgendamentosComponent,
      componentProps: {
        customData: data
      },
    });
    this.modalController.dismiss();
    await modal.present();
  }

  // Declaração de variavéis
  tutor: any = "";
  cod_tutor: any = '';
  tutorSelecionado = true;
  cod_pet: any = '';
  servico: any = '1';
  qtd_banho: any = '0';
  observacao: any = '';
  cod_pacote: any = '';
  data_saida: any = '';
  status: any = false;
  cod_agendamento: any = '';
  diarias: any = 1
  valor: any = '0.00';
  desconto: any = '0.00';
  valor_total: any = Number(this.valor)+Number(this.desconto);
  forma: any = '';
  dataModal: any;

  // LÓGICA DO FORMULARIO

  procurarTutor () {  // Ao desclicar input tutor, procura um tutor com o nome
    if (this.tutor !== "") {
      let res = this.getAPI('listar', 'tutor', this.tutor)[0];
      if (res) {  // Se for achado um tutor, permite cadastro
        this.tutor = res.nome;
        this.tutorSelecionado = false;
        this.cod_tutor = res.cod_tutor;
      } else {
        this.tutorSelecionado = true;
      }
    }
  }

  gerarValor(){
    if (this.data_saida != '') {
      let d1:any = new Date(this.customData);
      let d2:any = new Date(this.data_saida);
      let diff = d2 - d1;
      this.diarias = diff / (24 * 60 * 60 * 1000);
    }
    let valor_diaria = this.getAPI('listar', 'servico', this.servico)[0].valor_diaria;
    this.valor = valor_diaria * this.diarias
    this.valor_total = this.valor - this.desconto;
  }

  // Verifica se é array
  verificarArray (items:any): any {
    return Array.isArray(items);
  }

  // LÓGICA DE ADICIONAR  
  async adicionarAgendamento () {
    if (this.cod_pet === ""){
      this.presentToast("Escolha um pet");
    } else {
      if (this.verificarPacote()){
        let agendamento = {
          'cod_pet': Number(this.cod_pet),
          'cod_servico': Number(this.servico),
          'cod_pacote': this.cod_pacote == '' ? "NULL" : Number(this.cod_pacote),
          'data': `'${this.customData}'`,
          'data_saida': `'${this.data_saida === '' ? this.customData : this.data_saida}'`,
          'qtd_banho': Number(this.qtd_banho),
          'observacao': `'${this.observacao}'`
        }
        let resposta = await this.postAPI('adicionar', 'agendamento', '', agendamento);
        this.cod_agendamento = resposta.ID;
        if (resposta.ERRO) {
          this.presentToast(resposta.ERRO); //chama toast da verificação
        }
        else {
          let pagamento = {
            'cod_agendamento': Number(this.cod_agendamento),
            'valor': Number(this.valor),
            'desconto': Number(this.desconto),
            'valor_total': Number(this.valor_total),
            'forma': `'${this.forma}'`,
            'status': this.status ? 1 : 0
          }
          let resposta = await this.postAPI('adicionar', 'pgt_agendamento', '', pagamento);
          if (resposta.ERRO) {
            this.presentToast(resposta.ERRO); //chama toast da verificação
          } else {
            this.modalController.dismiss();
          }
        }
      }
    }
  }

  verificarPacote () {
    if (this.cod_pacote != "") {
      let pacote = this.getAPI('listar', 'pacote', this.cod_pacote)[0]
      let diarias_disponiveis = Number(pacote.diarias_disponiveis)

      if (this.diarias == diarias_disponiveis) {
        let pacoteUpdate = {
          'diarias_disponiveis': 0,
          'situacao': 0
        }
        this.postAPI('atualizar', 'pacote', pacote.cod_pacote, pacoteUpdate);
        return true;
      }
      else if (this.diarias < diarias_disponiveis) {
        let pacoteUpdate = {
          'diarias_disponiveis': Number(diarias_disponiveis - this.diarias),
        }
        this.postAPI('atualizar', 'pacote', pacote.cod_pacote, pacoteUpdate);
        return true;
      }
      this.presentToast('Esse pacote não possuí diárias o suficiente');
      return false;
    } 
    return true;
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
        return err.json();
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