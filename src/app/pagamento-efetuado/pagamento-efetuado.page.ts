import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-pagamento-efetuado',
  templateUrl: './pagamento-efetuado.page.html',
  styleUrls: ['./pagamento-efetuado.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class PagamentoEfetuadoPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
