import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonicModule, ModalController } from '@ionic/angular';
import { SelecionarMesComponent } from '../modals/selecionar-mes/selecionar-mes.component';
import { SharedDataService } from '../services/shared-data.service';


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

  // Modal
  constructor(private modalController: ModalController,
    private sharedDataService: SharedDataService) {}


  obterVariavel() {
    let data=this.sharedDataService.mes.split("-");
    this.ano = data[0]
    this.mes = data[1]
    this.data = `${this.meses[this.mes-1]} ${this.ano}`;
  }


  // Abre modal de adicionar pet
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
}