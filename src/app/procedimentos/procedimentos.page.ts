import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonicModule, ModalController } from '@ionic/angular';
import { AdicionarProcedimentosComponent } from '../modals/adicionar-procedimentos/adicionar-procedimentos.component';
import { AtualizarProcedimentosComponent } from '../modals/atualizar-procedimentos/atualizar-procedimentos.component';
import { DeletarProcedimentosComponent } from '../modals/deletar-procedimentos/deletar-procedimentos.component';

@Component({
  selector: 'app-procedimentos',
  templateUrl: './procedimentos.page.html',
  styleUrls: ['./procedimentos.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterLink]
})
export class ProcedimentosPage{

  // Modal
  constructor(private modalController: ModalController) {}

  ngOnInit() {
  }

  // Abre modal de adicionar procedimentos
  async modalAdicionarProcedimentos() {
    const modal = await this.modalController.create({
      component: AdicionarProcedimentosComponent,
    });
    await modal.present();
  }

  // Abre modal de atualizar procedimentos passa parâmetro
  async modalAtualizarProcedimentos(data: any) {
    const modal = await this.modalController.create({
      component: AtualizarProcedimentosComponent,
      componentProps: {
        customData: data
      },
    });
    await modal.present();
  }

  // Abre modal de deletar procedimentos passa parâmetro
  async modalDeletarProcedimentos(data: any) {
    const modal = await this.modalController.create({
      component: DeletarProcedimentosComponent,
      componentProps: {
        customData: data
      },
    });
    await modal.present();
  }

  // Lógica de listagem
  parametro = "";

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

  // Pesquisa de tipo de procedimento
  handleInput(event:any) {
    let pesquisa = event.target.value;
    this.parametro = pesquisa;
  }

}
