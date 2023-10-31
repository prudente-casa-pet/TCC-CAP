import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { IonicModule, MenuController, ModalController } from '@ionic/angular';
import { SelecionarMesComponent } from '../modals/selecionar-mes/selecionar-mes.component';
import { SharedDataService } from '../services/shared-data.service';
import { PagarComponent } from '../modals/pagar/pagar.component';

@Component({
  selector: 'app-pagamento-pendente',
  templateUrl: 'pagamento-pendente.page.html',
  styleUrls: ['pagamento-pendente.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterLink]  
})

export class PagamentoPendentePage {

  meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
  hoje = new Date();                          // Data atual
  mes = this.hoje.getMonth();                 // Mês atual
  ano = this.hoje.getFullYear();              // Ano atual
  data: any = `${this.meses[this.mes]} ${this.ano}`;
  parametro: any = `${this.ano}-${this.mes+1 < 10 ? '0'+this.mes+1 : this.mes+1}`;
  pesquisa: any = '';
  total: any = 0;

  menuStatus: boolean = true;
  router: Router;

  // Modal
  constructor(private modalController: ModalController, private sharedDataService: SharedDataService, private menu: MenuController, router: Router) {
    this.router = router;
  }

  ngOnInit() {
    this.calcularTotal(this.getAPI('listar', 'pagamento_pendente', this.parametro))
  }

  filtrarObjetosPorNome(objetos: any[], consulta: string){
    if (objetos[0]!=undefined){
      return objetos.filter((objeto: any) => {
        const nomeObjeto = objeto.tutor.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()\u0300-\u036f]/g, '').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const consultaLowerCase = consulta.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()\u0300-\u036f]/g, '').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        return nomeObjeto.includes(consultaLowerCase);
      });
    }
    else {
      return [];
    }
  }

  verificarVazio (vetor:any) {
    if(vetor.length==0){
      return false;
    }
    return true;
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
      this.calcularTotal(this.getAPI('listar', 'pagamento_pendente', this.parametro)) 
    }
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
    this.pesquisa = event.target.value;
  }

  // Calcular Total
  calcularTotal(agendamentos: any){
    if(this.verificarArray(agendamentos)){
      let total = 0;
      agendamentos.forEach((agendamento: any) => {
        total += Number(agendamento.valor);
      });
      this.total = Number(total);
    }
    else {
      this.total = 0;
    }
  }
}