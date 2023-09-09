import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonicModule, ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-deletar-pet',
  templateUrl: './deletar-pet.component.html',
  styleUrls: ['./deletar-pet.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterLink]
})

export class DeletarPetComponent  implements OnInit {
  @Input() customData: any; // Recebe o parâmetro enviado
 
  constructor(private modalController: ModalController) {}
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  closeModal() {
    this.modalController.dismiss();
  }

}
