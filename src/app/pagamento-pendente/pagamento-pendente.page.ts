import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-pagamento-pendente',
  templateUrl: './pagamento-pendente.page.html',
  styleUrls: ['./pagamento-pendente.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class PagamentoPendentePage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
