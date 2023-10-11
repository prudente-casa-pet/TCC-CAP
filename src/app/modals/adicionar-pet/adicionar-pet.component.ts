import { CommonModule, NumberSymbol } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonicModule, ModalController, NavParams, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';


@Component({
  selector: 'app-adicionar-pet',
  templateUrl: './adicionar-pet.component.html',
  styleUrls: ['./adicionar-pet.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterLink, FormsModule]
})

export class AdicionarPetComponent  implements OnInit {

  constructor(private modalController: ModalController, private toastController: ToastController, private firebaseService: FirebaseService) {}

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
  
  // Declaração de variavéis
  cod_pet: any = "";
  nome: any = "";
  tutor: any = "";
  especie: any = "";
  raca: any = "";
  porte: any = "";
  sociabilidade: any = "";
  observacoes: any = "";
  foto: any = "";          // Arquivo em si
  arquivo: any = "";       // Nome do arquivo que irá aparecer no input
  caminho: any = "";       // Caminho do arquivo na API
  tutorSelecionado = true;
  
  // LÓGICA DO FORMULARIO

  // Ao selecionar o arquivo, vai aparecer o nome no input
  onFileSelected(event: any) {
    this.foto = event.target.files[0];
    if (this.foto) {
      this.arquivo = this.foto.name;
      this.foto = this.foto; // Atribui o arquivo à variável 'foto'
    }
  }
  
  procurarTutor () {  // Ao desclicar input tutor, procura um tutor com o nome
    let res = this.getAPI('listar', 'tutor', this.tutor)[0];
    if (res){  // Se for achado um tutor, permite cadastro
      this.tutor = res.nome;
      this.tutorSelecionado = false;
    } else {
      this.tutorSelecionado = true;
    }
  }
  
  // Verifica se é array
  verificarArray (items:any): any {
    return Array.isArray(items)
  }
  
  
  // LÓGICA DE ADICIONAR
  
  async adicionarPet () {
    if (this.foto) {
      await this.adicionarArquivo();  // Espera o aquivo ser adicionado
    }
    if (this.tutorSelecionado) {  // Se um tutor não for escolhido
      this.presentToast("Escolha um tutor válido");
    } else {
      let pet = {
        'nome': `'${this.nome}'`,
        'cod_tutor': Number(this.getAPI('listar', 'tutor', this.tutor)[0].cod_tutor),
        'especie': `'${this.especie}'`,
        'raca': `'${this.raca}'`,
        'porte': `'${this.porte}'`,
        'observacoes': `'${this.observacoes}'`,
        'sociabilidade': Number(this.sociabilidade),
        'foto_perfil': `'${this.caminho}'`
      }
      let resposta = await this.postAPI('adicionar', 'pet', '', pet);
      this.cod_pet = resposta.ID;
      if (resposta.ERRO) {
        this.presentToast(resposta.ERRO); //chama toast da verificação
      }
      else {
        this.adicionarProcedimentos();
        this.modalController.dismiss();
      }
    }
  }

  async adicionarProcedimentos(){
    let procedimentos = await this.getAPI('listar', 'tipoProcedimento', '');
    for(let procedimento of procedimentos){
      let procedimento_pet = {
        'cod_pet': Number(this.cod_pet),
        'cod_tipoProcedimento': Number(procedimento.cod_tipoProcedimento)
      }
      await this.postAPI('adicionar', 'pet_procedimento', '', procedimento_pet);
    }
  }
  
  // Faz um post na API
  async postAPI (acao:any, tabela:any, parametro:any, dados:any) {
    const options = {
      method: 'POST',
      body: JSON.stringify(dados),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
      }
      return fetch(`http://localhost/Aula/API/${acao}/${tabela}/${parametro}`, options)
      .then(res => {
        return res.json();
      })
      .catch(err => {
        return err.json()
      })
  }
  
  // Faz um get na API
  getAPI (metodo:any, tabela:any, parametro:any) {
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
  
  
  // LÓGICA DE ARQUIVOS
  
  // Chama aa função de adicionar na API e pega o caminho retornado
  async adicionarArquivo () {
    let extensao = this.foto.name.split(".");
    extensao = extensao[extensao.length-1];
    let nomeFoto = `${this.nome}-${Date.now()}.${extensao}`;
    this.foto = new File([this.foto], nomeFoto, { type: this.foto.type });
    this.caminho = await this.firebaseService.carregarImagem(this.foto)
  }
  

  
  // LÓGICA DOS COMPONENTES

  closeModal () {
    this.modalController.dismiss();
  }
  
  async presentToast (mensagem:any) {
    const toast = await this.toastController.create({
      message: mensagem,
      duration: 2000,
      position: 'top',
    });
    
    await toast.present();
  }
  
}
