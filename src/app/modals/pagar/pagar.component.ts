import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonicModule, ModalController, NavParams, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pagar',
  templateUrl: './pagar.component.html',
  styleUrls: ['./pagar.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterLink, FormsModule]
})

export class PagarComponent  implements OnInit {

  constructor(private modalController: ModalController, private toastController: ToastController) {}
  @Input() customData: any;

  // Declaração de variaveis
  cod_agendamento: any;
  valor: any;
  desconto: any;
  valor_total: any;
  forma: any;
  status:any = '1';

  // Iniciação das variaveis
  ngOnInit(): void {
    this.cod_agendamento = this.customData.cod_agendamento;
    this.valor = this.customData.valor;
    this.desconto = this.customData.desconto;
    this.forma = this.customData.forma;
    this.gerarValor();
  }

  // LÓGICA DE ATUALIZAÇÃO

  gerarValor(){
    this.valor_total = this.valor - this.desconto;
  }

  async pagar (codigo:any) {
    if (this.forma == "") {
      this.presentToast("Digite a forma de pagamento"); //chama toast da verificação
    } else {
      let pagamento = {
        'valor': Number(this.valor),
        'desconto': Number(this.desconto),
        'valor_total': Number(this.valor_total),
        'forma': `'${this.forma}'`,
        'status': 1
      }
      let resposta = await this.postAPI('atualizar', 'pgt_agendamento', codigo, pagamento); 
      if(resposta.ERRO){
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
