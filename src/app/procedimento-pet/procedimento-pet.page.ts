import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { SharedDataService } from '../services/shared-data.service';
import { AtualizarProcedimentoPetComponent } from '../modals/atualizar-procedimento-pet/atualizar-procedimento-pet.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-procedimento-pet',
  templateUrl: './procedimento-pet.page.html',
  styleUrls: ['./procedimento-pet.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})

export class ProcedimentoPetPage implements OnInit {
  router: Router;
  
  constructor(private modalController: ModalController, router: Router, private sharedDataService: SharedDataService) {
    this.router = router;
  }

  pet: any = this.sharedDataService.petProcedimento;

  ngOnInit() {
    if (this.pet == ''){
      this.router.navigate(['/', 'pet']);
    }
  }

  // Abre modal de adicionar pet
  async modalAtualizarProcedimentoPet(data: any) {
    const modal = await this.modalController.create({
      component: AtualizarProcedimentoPetComponent,
      componentProps: {
        customData: data
      }
    });
    await modal.present();
  }

  // Lógica de listagem

  gerarVencimento(data: any, intervalo: any){
    let data_vencimento = "Dose única";
    if (intervalo != 0){
      let dataNova = new Date(data);
      dataNova.setMonth(dataNova.getMonth() + intervalo);
      let ano = dataNova.getFullYear();
      let mes = dataNova.getMonth() + 1; 
      let dia = dataNova.getDate();
      data_vencimento = ano + '-' + (mes < 10 ? '0' : '') + mes + '-' + (dia < 10 ? '0' : '') + dia;
    }
    return data_vencimento;
  }

  verificarArray(items:any): any {
    return Array.isArray(items)
  }
  
  generateRange(start: number, end: number): number[] {
    const range = [];
    for (let i = start; i <= end; i++) {
      range.push(i);
    }
    return range;
  }

  // Função que faz uma busca na API
  getAPI(metodo:any, tabela:any, parametro:any) {
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

}
