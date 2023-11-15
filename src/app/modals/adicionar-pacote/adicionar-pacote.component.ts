import { CommonModule, NumberSymbol } from '@angular/common';
import { Component, HostListener, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonicModule, ModalController, NavParams, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { SharedDataService } from '../../services/shared-data.service';

@Component({
  selector: 'app-adicionar-pacote',
  templateUrl: './adicionar-pacote.component.html',
  styleUrls: ['./adicionar-pacote.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterLink, FormsModule]
})

export class AdicionarPacoteComponent  implements OnInit {

  constructor(private modalController: ModalController, private toastController: ToastController, private sharedDataService: SharedDataService) {}
  
  pet:any = this.sharedDataService.petPacote;

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  // Declaração de variavéis
  cod_pet:any = this.pet.cod_pet;
  nome: any = "";
  qtd_diaria: any = "";
  diarias_disponiveis:any = "";
  
  // LÓGICA DE ADICIONAR
  
  async adicionarPacote () {
    let pacote = {
      'cod_pet': Number(this.cod_pet),
      'nome': `'${this.nome}'`,
      'qtd_diaria': Number(this.qtd_diaria),
      'diarias_disponiveis': Number(this.qtd_diaria),
      'situacao': 1
    }
    let resposta = await this.postAPI('adicionar', 'pacote', '', pacote);
    if (resposta.ERRO) {
      this.presentToast(resposta.ERRO);       // Chama toast da verificação
    }
    else {
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
