import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonicModule, ModalController } from '@ionic/angular';
import { SelecionarMesComponent } from '../modals/selecionar-mes/selecionar-mes.component';
import { SharedDataService } from '../services/shared-data.service';
import { PagarComponent } from '../modals/pagar/pagar.component';


@Component({
  selector: 'app-pagamento-pendente',
  templateUrl: 'pagamento-pendente.page.html',
  styleUrls: ['pagamento-pendente.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterLink],
  
})
export class PagamentoPendentePage {
  meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
  hoje = new Date();                          // Data atual
  mes = this.hoje.getMonth();                 // Mês atual
  ano = this.hoje.getFullYear();              // Ano atual
  data:any = `${this.meses[this.mes]} ${this.ano}`;
  parametro:any = `${this.ano}-${this.mes}`;
  pesquisa:any = '';


  // Modal
  constructor(private modalController: ModalController, private sharedDataService: SharedDataService) {}
  
  // Abre modal de atualizar pagamento passa parâmetro, ou seja, pagar
  async modalPagar(data: any) {
    const modal = await this.modalController.create({
      component: PagarComponent,
      componentProps: {
        customData: data
      },
    });
    await modal.present();
  }

  obterVariavel() {
    if (this.sharedDataService.mes){  // Se for escolhido um mês
      let data=this.sharedDataService.mes.split("-");
      this.ano = data[0]
      this.mes = data[1]
      this.data = `${this.meses[this.mes-1]} ${this.ano}`;
      this.parametro = `${this.ano}-${this.mes}`; 
    }
  }


  // Abre modal de adicionar pagamento pendente
  async modalSelecionarMes() {
    const modal = await this.modalController.create({
      component: SelecionarMesComponent,
    });
    modal.onDidDismiss().then(() => {
      // O modal foi fechado, então podemos verificar o valor aqui
      this.obterVariavel();
    });
  
    return await modal.present();
  }

  // Lógica de listagem
  // parametro = "";

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

  // Pesquisa de pet
  handleInput(event:any) {
    this.pesquisa = event.target.value;
  }
}