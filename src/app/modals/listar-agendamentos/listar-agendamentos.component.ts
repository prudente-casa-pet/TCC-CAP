import { CommonModule, NumberSymbol } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonicModule, ModalController, NavParams, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { AdicionarAgendamentoComponent } from '../adicionar-agendamento/adicionar-agendamento.component';
import { AtualizarAgendamentoComponent } from '../atualizar-agendamento/atualizar-agendamento.component';
import { DeletarAgendamentoComponent } from '../deletar-agendamento/deletar-agendamento.component';

@Component({
  selector: 'app-listar-agendamentos',
  templateUrl: './listar-agendamentos.component.html',
  styleUrls: ['./listar-agendamentos.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterLink, FormsModule]
})
export class ListarAgendamentosComponent  implements OnInit {

  constructor(private modalController: ModalController, private toastController: ToastController) {}
  @Input() customData: any;

  ngOnInit(): void {
    this.dataModal = `${this.customData.slice(8,10)}/${this.customData.slice(5,7)}`;
  }

  dataModal:any = "";

  async modalAdicionarAgendamento (data: any) {
    const modal = await this.modalController.create({
      component: AdicionarAgendamentoComponent,
      componentProps: {
        customData: data
      },
    });
    this.modalController.dismiss();
    await modal.present();

    modal.onDidDismiss().then(() => {
      location.reload();
    });
  }

  async modalAtualizarAgendamento (data: any) {
    
    const modal = await this.modalController.create({
      component: AtualizarAgendamentoComponent,
      componentProps: {
        customData: data
      },
    });
    this.modalController.dismiss();
    await modal.present();

    modal.onDidDismiss().then(() => {
      location.reload();
    });
  }

  async modalDeletarAgendamento (data: any) {
    const modal = await this.modalController.create({
      component: DeletarAgendamentoComponent,
      componentProps: {
        customData: data
      },
    });
    this.modalController.dismiss();
    await modal.present();

    modal.onDidDismiss().then(() => {
      location.reload();
    });
  }

  verificarArray (items:any): any {
    return Array.isArray(items);
  }
  
  generateRange (start: number, end: number): number[] {
    const range = [];
    for (let i = start; i <= end; i++) {
      range.push(i);
    }
    return range;
  }
  
  // Função que faz uma busca na API
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
}
