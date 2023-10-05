import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { SharedDataService } from '../services/shared-data.service';

@Component({
  selector: 'app-procedimento-pet',
  templateUrl: './procedimento-pet.page.html',
  styleUrls: ['./procedimento-pet.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ProcedimentoPetPage implements OnInit {

  constructor(private modalController: ModalController, private sharedDataService: SharedDataService) { }

  pet:any = this.sharedDataService.petProcedimento;


  ngOnInit() {
    console.log(this.pet);
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
