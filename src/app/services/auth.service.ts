import { Injectable } from '@angular/core';
import { timestamp } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  async login (senha: any) {
    localStorage.clear()
    const dados = {
      "email": "admin@gmail.com",
      "senha": senha
    };
    const options = {
      method: 'POST',
      body: JSON.stringify(dados),
      headers: {
        'Content-Type': 'application/json',
      }
    };

    let res = await fetch(`http://localhost/Aula/API/login`, options)
      .then (res => {
        return res.json();
      })
      if (res) {
        let timestamp_atual = new Date().getTime();
        let miliseconds = 1.5 * 60 * 60 * 1000; 
        let exp = timestamp_atual + miliseconds;
        if (res.admin){
          localStorage.setItem('token', res.token);
          localStorage.setItem('exp', exp.toString())
          return false;
        } else {
          return 'Login inválido';
        }
    }
    return 'Login inválido';
  }
}