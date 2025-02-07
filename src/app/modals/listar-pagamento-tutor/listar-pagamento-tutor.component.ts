import { CommonModule } from '@angular/common';
import { Component, Input} from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonicModule, ModalController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { PagarComponent } from '../../modals/pagar/pagar.component';


@Component({
  selector: 'app-listar-pagamento-tutor',
  templateUrl: './listar-pagamento-tutor.component.html',
  styleUrls: ['./listar-pagamento-tutor.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterLink, FormsModule]
})
export class ListarPagamentoTutorComponent {
  constructor(private modalController: ModalController) {}
  @Input() customData: any;

  ngOnInit(): void {
  }

  // Gera data formatada
  gerarData(data:any){
    data = data.split('-');
    let dia = data[2];
    let mes = data[1];
    let ano = data[0];
    let dataFormatada = `${dia}/${mes}/${ano}`;
    return dataFormatada;
  }

  // Abre modal de atualizar pagamento passa parâmetro, ou seja, pagar
  async modalPagar(data: any) {
    const modal = await this.modalController.create({
      component: PagarComponent,
      componentProps: {
        customData: data
      },
    });
    this.modalController.dismiss();
    await modal.present();
  }


  // Lógica de listagem

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
