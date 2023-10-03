import { CommonModule } from '@angular/common';
import { Component} from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonicModule, ModalController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { SharedDataService } from '../../services/shared-data.service';


@Component({
  selector: 'app-listar-pagamento-tutor',
  templateUrl: './listar-pagamento-tutor.component.html',
  styleUrls: ['./listar-pagamento-tutor.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterLink, FormsModule]
})
export class ListarPagamentoTutorComponent {

  meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
  hoje = new Date();                          // Data atual
  mes = this.hoje.getMonth();                 // Mês atual
  ano = this.hoje.getFullYear();              // Ano atual
  data:any = `${this.meses[this.mes]} ${this.ano}`;
  parametro:any = `${this.ano}-${this.mes}`;

  // ngOnInit(): void {
  //   this.tutor = `{{buscarAPI('listar', 'tutor', pagamento_pendente.cod_tutor)[0].cod_codtutor}}`;
  // }


  // Modal
  constructor(private modalController: ModalController,
    private sharedDataService: SharedDataService) {}


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
  buscarAPI(metodo:any, tabela:any, parametro:any) {
    const request = new XMLHttpRequest();
    request.open('GET', `http://localhost/Aula/API/${metodo}/${tabela}/${parametro}`, false);
    request.send();

    if (request.status === 200) {
        return JSON.parse(request.responseText);
    } else {
        console.error('Erro na requisição:', request.status);
        return Array();
    }
  }

}
