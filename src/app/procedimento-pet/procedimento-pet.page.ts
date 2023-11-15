import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, MenuController, ModalController} from '@ionic/angular';
import { SharedDataService } from '../services/shared-data.service';
import { AtualizarProcedimentoPetComponent } from '../modals/atualizar-procedimento-pet/atualizar-procedimento-pet.component';
import { ActivatedRoute, Router } from '@angular/router';
import { addMonths } from 'date-fns';

@Component({
  selector: 'app-procedimento-pet',
  templateUrl: './procedimento-pet.page.html',
  styleUrls: ['./procedimento-pet.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})

export class ProcedimentoPetPage implements OnInit {
  
  router: Router;
  menuStatus: boolean = true;
  
  constructor(private route: ActivatedRoute, private modalController: ModalController, router: Router, private sharedDataService: SharedDataService, private menu: MenuController) {
    this.router = router;
  }

  pet: any = this.sharedDataService.petProcedimento;

  ngOnInit() {
    if (this.pet == '' || this.sharedDataService.petProcedimento == ''){
      this.router.navigate(['/', 'pet']);
    }
  }

  ionViewDidEnter() {
    this.pet = this.sharedDataService.petProcedimento;
    if (this.pet == '' || this.sharedDataService.petProcedimento == ''){
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

  // Abre modal de adicionar pet
  async modalAtualizarProcedimentoPet(data: any) {
    const modal = await this.modalController.create({
      component: AtualizarProcedimentoPetComponent,
      componentProps: {
        customData: data
      }
    });
    await modal.present();
  }

  // Lógica de listagem

  gerarVencimento(data: any, intervalo: any){
    let data_vencimento = "Dose única";
    if (intervalo != 0){
      data = new Date(data);
      const novaData = addMonths(data, intervalo);
      const dia = novaData.getDate() < 10 ? `0${novaData.getDate()}` : novaData.getDate();
      const mes = novaData.getMonth()+1 < 10 ? `0${novaData.getMonth()+1}` : novaData.getMonth()+1;
      const ano = novaData.getFullYear();
      data_vencimento = `${dia}/${mes}/${ano}`;
    }
    return data_vencimento;
  }

  formatarData(data: any){
    data = data.split("-");
    const dia = data[2];
    const mes = data[1];
    const ano = data[0];
    return `${dia}/${mes}/${ano}`;
  }

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
