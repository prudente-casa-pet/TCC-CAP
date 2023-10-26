import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, MenuController, ModalController } from '@ionic/angular';
import { SharedDataService } from '../services/shared-data.service';
import { AdicionarPacoteComponent } from '../modals/adicionar-pacote/adicionar-pacote.component';
import { DeletarPacoteComponent } from '../modals/deletar-pacote/deletar-pacote.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-pacote',
  templateUrl: './pacote.page.html',
  styleUrls: ['./pacote.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})

export class PacotePage implements OnInit {
  
  router: Router;
  menuStatus: boolean = true;

  constructor(private modalController: ModalController, router: Router, private sharedDataService: SharedDataService, private menu: MenuController) {
    this.router = router;
  }

  pet:any = this.sharedDataService.petPacote;

  ngOnInit() {
    if (this.pet == ''){
      this.router.navigate(['/', 'pet']);
    }
  }

  // Fecha menu ao dar scroll na página
  handleScroll(scroll: any){
    if (!this.menuStatus && scroll != 0){
      this.menuStatus = false;
      this.menu.close('menu');
    } else if (this.menu && scroll != 0){
      this.menuStatus = false;
    }
  }

  menuAberto(){
    this.menuStatus = true;
  }

  // Zera sessão
  sair(){
    localStorage.clear();
    this.router.navigate(['/','home']);
  }

  // Abre modal de adicionar tutopacoter
  async modalAdicionarPacote() {
    const modal = await this.modalController.create({
      component: AdicionarPacoteComponent,
    });
    await modal.present();
  }


  // Abre modal de deletar pacote passa parâmetro
  async modalDeletarPacote(data: any) {
    const modal = await this.modalController.create({
      component: DeletarPacoteComponent,
      componentProps: {
        customData: data
      },
    });
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
