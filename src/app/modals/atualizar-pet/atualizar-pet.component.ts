import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonicModule, ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-atualizar-pet',
  templateUrl: './atualizar-pet.component.html',
  styleUrls: ['./atualizar-pet.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterLink]
})

export class AtualizarPetComponent  implements OnInit {

  arquivo: any = "";

  // Ao selecionar o arquivo, vai aparecer o nome no input
  onFileSelected(event: any) {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      this.arquivo = selectedFile.name;
    }
  }

  @Input() customData: any;
 
  constructor(private modalController: ModalController) {}
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  closeModal() {
    this.modalController.dismiss();
  }

}
