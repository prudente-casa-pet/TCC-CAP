import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { IonicModule, MenuController, ModalController } from '@ionic/angular';
import { AdicionarTutorComponent } from '../modals/adicionar-tutor/adicionar-tutor.component';
import { AtualizarTutorComponent } from '../modals/atualizar-tutor/atualizar-tutor.component';
import { DeletarTutorComponent } from '../modals/deletar-tutor/deletar-tutor.component';
import { ListarPagamentoTutorComponent } from '../modals/listar-pagamento-tutor/listar-pagamento-tutor.component';

@Component({
  selector: 'app-tutor',
  templateUrl: './tutor.page.html',
  styleUrls: ['./tutor.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterLink]
})

export class TutorPage{

  menuStatus: boolean = true;
  router: Router;

  // Modal
  constructor(private modalController: ModalController, private menu: MenuController, router: Router) {
    this.router = router;
  }

  ngOnInit() { }

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

  // Abre modal de adicionar tutor
  async modalAdicionarTutor() {
    const modal = await this.modalController.create({
      component: AdicionarTutorComponent,
    });
    await modal.present();
  }

  // Abre modal de listagem de pagamento
  async modalListarPagamentoTutor(data: any) {
    const modal = await this.modalController.create({
      component: ListarPagamentoTutorComponent,
      componentProps: {
        customData: data
      },
    });
    await modal.present();
  }

  // Abre modal de atualizar tutor passa parâmetro
  async modalAtualizarTutor(data: any) {
    const modal = await this.modalController.create({
      component: AtualizarTutorComponent,
      componentProps: {
        customData: data
      },
    });
    await modal.present();
  }

  // Abre modal de deletar tutor passa parâmetro
  async modalDeletarTutor(data: any) {
    const modal = await this.modalController.create({
      component: DeletarTutorComponent,
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

  // Pesquisa de tutor
  handleInput(event:any) {
    let pesquisa = event.target.value;
    this.parametro = pesquisa;
  }

}
