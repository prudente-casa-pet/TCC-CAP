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

}
