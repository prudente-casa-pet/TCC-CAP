import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-agenda',
  templateUrl: 'agenda.page.html',
  styleUrls: ['agenda.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterLink],
  
})
export class AgendaPage {

meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

hoje = new Date();               // Dia atual
mes = this.hoje.getMonth();      // Mês atual
ano = this.hoje.getFullYear();   // Ano atual


primeiroDia = new Date(this.ano, this.mes, 1);     // Primeiro dia do mês atual
ultimoDia = new Date(this.ano, this.mes + 1, 0);   // Ultimo dia do mês atual
anteriorDia = new Date(this.ano, this.mes, 0);     // Ultimo dia do mês anterior

ultDia = this.ultimoDia.getDate();            // Número do ultimo dia do mês atual
antDia = this.anteriorDia.getDate();          // Número do ultimo dia do mês anterior

quantAntDias = this.primeiroDia.getUTCDay();            // Quantidade de dias que aparecera do mês anterior
priMesAnt = this.antDia - this.quantAntDias + 1;        // Primeiro dia que aparecera do mês anterior
proxDias = 6 - this.ultimoDia.getDay()                   // Quantidade de dias que aparecera do mês seguinte  

mesAnterior(){
  if (this.mes == 0){  // Se é janeiro
    this.mes = 11
    this.ano = this.ano-1
  } else{
    this.mes = this.mes-1
  }

  // Reseta configurações
  this.primeiroDia = new Date(this.ano, this.mes, 1);     // Primeiro dia do mês atual
  this.ultimoDia = new Date(this.ano, this.mes + 1, 0);   // Ultimo dia do mês atual
  this.anteriorDia = new Date(this.ano, this.mes, 0);     // Ultimo dia do mês anterior
  
  this.ultDia = this.ultimoDia.getDate();            // Número do ultimo dia do mês
  this.antDia = this.anteriorDia.getDate();          // Número do ultimo dia do mês anterior
  
  this.quantAntDias = this.primeiroDia.getUTCDay();             // Quantidade de dias que aparecera do mês anterior
  this.priMesAnt = this.antDia - this.quantAntDias + 1;         // Primeiro dia que aparecera do mês anterior
  this.proxDias = 6 - this.ultimoDia.getDay()                   // Quantidade de dias que aparecera do mês seguinte  
}

proximoMes(){
  if (this.mes == 11){  // Se é dezembro
    this.mes = 0
    this.ano = this.ano+1
  } else{
    this.mes = this.mes+1
  }

  // Reseta configurações
  this.primeiroDia = new Date(this.ano, this.mes, 1);     // Primeiro dia do mês atual
  this.ultimoDia = new Date(this.ano, this.mes + 1, 0);   // Ultimo dia do mês atual
  this.anteriorDia = new Date(this.ano, this.mes, 0);     // Ultimo dia do mês anterior
  
  this.ultDia = this.ultimoDia.getDate();            // Número do ultimo dia do mês
  this.antDia = this.anteriorDia.getDate();          // Número do ultimo dia do mês anterior
  
  this.quantAntDias = this.primeiroDia.getUTCDay();            // Quantidade de dias que aparecera do mês anterior
  this.priMesAnt = this.antDia - this.quantAntDias + 1;        // Primeiro dia que aparecera do mês anterior
  this.proxDias = 6 - this.ultimoDia.getDay()                   // Quantidade de dias que aparecera do mês seguinte  
  
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

gerarDataAnt(ano:any, mes:any, dia:any){
  const dataDia = `${ano}-${mes-1 < 10 ? `0${mes}` : mes}-${dia < 10 ? '0' + dia : dia}`
  return dataDia;
}

gerarData(ano:any, mes:any, dia:any){
  const dataDia = `${ano}-${mes < 10 ? `0${mes+1}` : mes+1}-${dia < 10 ? '0' + dia : dia}`
  return dataDia;
}

gerarDataPostIt(mes:any, dia:any){

}

gerarDataProx(ano:any, mes:any, dia:any){
  const dataDia = `${ano}-${mes+2 < 10 ? `0${mes+2}` : mes+2}-${dia < 10 ? '0' + dia : dia}`
  return dataDia;
}

// Gera escrita do agendamento
gerarAgendamento(agendamento: any){
  let sevico = this.buscarAPI('servico', agendamento.cod_servico)[0].nome;  // Pega o nome do serviço do agendamento
  let pet = this.buscarAPI('pet', agendamento.cod_pet)[0].nome;             // Pega o nome do pet do agendamento
  return `${sevico} - ${pet}`
}

// Função que faz uma busca na API
buscarAPI(tabela:any, parametro:any) {
  const request = new XMLHttpRequest();
  request.open('GET', `http://localhost/Aula/API%20TCC/listar/${tabela}/${parametro}`, false);
  request.send();

  if (request.status === 200) {
      return JSON.parse(request.responseText);
  } else {
      console.error('Erro na requisição:', request.status);
      return Array();
  }
}

}
