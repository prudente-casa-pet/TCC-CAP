import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonicModule, ModalController, NavParams } from '@ionic/angular';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-adicionar-pet',
  templateUrl: './adicionar-pet.component.html',
  styleUrls: ['./adicionar-pet.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterLink, FormsModule]
})
export class AdicionarPetComponent  implements OnInit {

  arquivo: any = "";
  nome: any = "";
  tutor: any = "";
  especie: any = "";
  raca: any = "";
  porte: any = "";
  sociabilidade: any = "";
  observacoes: any = "";

  // Ao selecionar o arquivo, vai aparecer o nome no input
  onFileSelected(event: any) {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      this.arquivo = selectedFile.name;
    }
  }

  constructor(private modalController: ModalController) {}
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  closeModal() {
    this.modalController.dismiss();
  }
  
  adicionarPet(){
    let pet = {
      'nome': `'${this.nome}'`,
      'cod_tutor': Number(this.tutor),
      'especie': `'${this.especie}'`,
      'raca': `'${this.raca}'`,
      'porte': `'${this.porte}'`,
      'sociabilidade': Number(this.sociabilidade),
      'observacoes': `'${this.observacoes}'`
    }
    this.postAPI('adicionar', 'pet', '', pet);
    this.modalController.dismiss();
  }
  postAPI(acao:any, tabela:any, parametro:any, dados:any) {
    const options = {
        method: 'POST',
        body: JSON.stringify(dados),
        headers: {
            'Content-Type': 'application/json'
        }
    }
    fetch(`http://localhost/Aula/API/${acao}/${tabela}/${parametro}`, options)
        .then(res => res.json())
        .then(res => console.log(JSON.stringify(res)))
        .catch(err => console.error(err))
}

}
