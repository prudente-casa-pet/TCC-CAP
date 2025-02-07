import { CommonModule, NumberSymbol } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonicModule, ModalController, NavParams, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-adicionar-procedimentos',
  templateUrl: './adicionar-procedimentos.component.html',
  styleUrls: ['./adicionar-procedimentos.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterLink, FormsModule]
})

export class AdicionarProcedimentosComponent  implements OnInit {

  constructor(private modalController: ModalController, private toastController: ToastController) {}

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  // Declaração de variavéis
  cod_procedimento: any = "";
  nome: any = "";
  intervalo: any = "";

  // LÓGICA DE ADICIONAR
  
  async adicionarProcedimentos () {
    let procedimentos = {
      'nome': `'${this.nome}'`,
      'intervalo': Number(this.intervalo),
    }
    let resposta = await this.postAPI('adicionar', 'tipoprocedimento', '', procedimentos);
    this.cod_procedimento = resposta.ID;
    if (resposta.ERRO) {
      this.presentToast(resposta.ERRO); //chama toast da verificação
    }
    else {
      this.adicionarProcedimentoPet();
      this.modalController.dismiss();
    }
  }
  
  async adicionarProcedimentoPet(){
    let pets = await this.getAPI('listar', 'pet', '');
    for(let pet of pets){
      let procedimento_pet = {
        'cod_pet': Number(pet.cod_pet),
        'cod_tipoProcedimento': Number(this.cod_procedimento),
        'data': 'null',
        'descricao': 'null'
      }
      console.log(JSON.stringify(procedimento_pet))
      await this.postAPI('adicionar', 'pet_procedimento', '', procedimento_pet);
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
