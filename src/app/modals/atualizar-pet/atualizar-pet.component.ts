import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonicModule, ModalController, NavParams } from '@ionic/angular';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-atualizar-pet',
  templateUrl: './atualizar-pet.component.html',
  styleUrls: ['./atualizar-pet.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterLink, FormsModule]
})
export class AtualizarPetComponent  implements OnInit {
  @Input() customData: any;

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

  

  atualizarPet(codigo:any){
    let pet = {
      'nome': `'${this.nome}'`,
      'cod_tutor': Number(this.tutor),
      'especie': `'${this.especie}'`,
      'raca': `'${this.raca}'`,
      'porte': `'${this.porte}'`,
      'sociabilidade': Number(this.sociabilidade),
      'observacoes': `'${this.observacoes}'`
    }
    alert(JSON.stringify(pet));
    alert(codigo);
    this.postAPI('atualizar', 'pet', codigo, pet);
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
