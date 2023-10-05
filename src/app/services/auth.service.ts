import { Injectable } from '@angular/core';
import { timestamp } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  async login (senha: any) {
    const dados = {
      "email": "admin@gmail.com",
      "senha": senha
    };
    const options = {
      method: 'POST',
      body: JSON.stringify(dados),
      headers: {
        'Content-Type': 'application/json'
      }
    };
    let res = await fetch(`http://localhost/Aula/API/login`, options)
      .then (res => {
        return res.json();
      })
      if (res) {
        localStorage.setItem('tolken', res);
        return false;
    }
    return 'Login inválido';
  }
}