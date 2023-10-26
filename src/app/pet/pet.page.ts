import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { IonicModule, MenuController, ModalController } from '@ionic/angular';
import { SharedDataService } from '../services/shared-data.service';
import { AdicionarPetComponent } from '../modals/adicionar-pet/adicionar-pet.component';
import { AtualizarPetComponent } from '../modals/atualizar-pet/atualizar-pet.component';
import { DeletarPetComponent } from '../modals/deletar-pet/deletar-pet.component';


@Component({
  selector: 'app-pet',
  templateUrl: 'pet.page.html',
  styleUrls: ['pet.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterLink]
})

export class PetPage {

  router: Router;
  menuStatus: boolean = true;

  // Modal
  constructor(private modalController: ModalController, router: Router, private sharedDataService: SharedDataService, private menu: MenuController) {
    this.router = router;
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
  
  // Abre modal de adicionar pet
  async modalAdicionarPet() {
    const modal = await this.modalController.create({
      component: AdicionarPetComponent,
    });
    await modal.present();
  }

  // Abre modal de atualizar pet passa parâmetro
  async modalAtualizarPet(data: any) {
    const modal = await this.modalController.create({
      component: AtualizarPetComponent,
      componentProps: {
        customData: data
      },
    });
    await modal.present();
  }

  // Abre modal de atualizar pet passa parâmetro
  async modalDeletarPet(data: any) {
    const modal = await this.modalController.create({
      component: DeletarPetComponent,
      componentProps: {
        customData: data
      },
    });
    await modal.present();
  }

  // Abre página do pacote do pet
  async abrirPacotes(data: any){
    this.sharedDataService.petPacote = data;
    this.router.navigate(['/', 'pacote']);
  }
  // Abre página do procedimento do pet
  async abrirProcedimentos(data: any){
    this.sharedDataService.petProcedimento = data;
    this.router.navigate(['/', 'procedimento-pet']);
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

  // Pesquisa de pet
  handleInput(event:any) {
    let pesquisa = event.target.value;
    this.parametro = pesquisa;
  }
}