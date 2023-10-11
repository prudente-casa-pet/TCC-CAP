import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonicModule, ModalController, NavParams, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';


@Component({
  selector: 'app-atualizar-pet',
  templateUrl: './atualizar-pet.component.html',
  styleUrls: ['./atualizar-pet.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterLink, FormsModule]
})

export class AtualizarPetComponent  implements OnInit {
  constructor(private modalController: ModalController, private toastController: ToastController, private firebaseService: FirebaseService) {}
  @Input() customData: any;

  // Declaração de variaveis
  nome: any;
  tutor: any;
  especie: any;
  raca: any;
  porte: any;
  sociabilidade: any;
  observacoes: any;
  foto: any = "";          // Arquivo em si
  arquivo: any = "";       // Nome do arquivo que irá aparecer no input
  caminho: any = "";       // Caminho do arquivo na API
  caminhoAntigo: any = "";       // Caminho do arquivo antigo na API
  tutorSelecionado = false;
  
  // Iniciação das variaveis
  ngOnInit(): void {
    this.nome = this.customData.nome;
    this.tutor = this.getAPI('listar', 'tutor', this.customData.cod_tutor)[0].nome;
    this.especie = this.customData.especie;
    this.raca = this.customData.raca;
    this.porte = this.customData.porte;
    this.sociabilidade = this.customData.sociabilidade;
    this.observacoes = this.customData.observacoes;
    this.caminhoAntigo = this.customData.foto_perfil;
  }

  // LÓGICA DO FORMULÁRIO

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
    if (res) {  // Se for achado um tutor, permite cadastro
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

  // LÓGICA DE ATUALIZAÇÃO

  async atualizarPet (codigo:any) {
    if (this.foto) {
      await this.adicionarArquivo();  // Espera o aquivo ser adicionado
    }
    if (this.tutorSelecionado){  // Se um tutor não for escolhido
      this.presentToast("Escolha um tutor válido");
    } else{
      let pet = {
        'nome': `'${this.nome}'`,
        'cod_tutor': Number(this.getAPI('listar', 'tutor', this.tutor)[0].cod_tutor),
        'especie': `'${this.especie}'`,
        'raca': `'${this.raca}'`,
        'porte': `'${this.porte}'`,
        'sociabilidade': Number(this.sociabilidade),
        'observacoes': `'${this.observacoes}'`,
        'foto_perfil': `'${this.caminho}'`
      }
      let resposta = await this.postAPI('atualizar', 'pet', codigo, pet); 
      if(resposta.ERRO){
        this.presentToast(resposta.ERRO); //chama toast da verificação
      }
      else{
        this.modalController.dismiss();
      }
    }
  }
  
  // Faz um post na API
  async postAPI(acao:any, tabela:any, parametro:any, dados:any) {
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
  
  // LÓGICA DE ARQUIVOS

  deletarArquivo(caminho:any) {
    this.firebaseService.excluirImagem(caminho);
  }
  
  // Chama aa função de adicionar na API e pega o caminho retornado
  async adicionarArquivo() {
    let extensao = this.foto.name.split(".");
    extensao = extensao[extensao.length-1];
    let nomeFoto = `${this.nome}-${Date.now()}.${extensao}`;
    this.foto = new File([this.foto], nomeFoto, { type: this.foto.type });
    this.caminho = await this.firebaseService.carregarImagem(this.foto);
    let foto = this.caminhoAntigo;  // Foto perfil do pet antigo
    if(foto){
      this.deletarArquivo(foto);  // Apaga foto de perfil
    }
  }
  
  
  // LÓGICA DOS COMPONENTES

  closeModal() {
    this.modalController.dismiss();
  }
  
  async presentToast(mensagem:any) {
    const toast = await this.toastController.create({
      message: mensagem,
      duration: 2000,
      position: 'top',
    });
    
    await toast.present();
  }
}
