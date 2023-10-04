import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  async login (senha: any) {
    const dados = {
      "senha": senha
    };
    const options = {
      method: 'POST',
      body: JSON.stringify(dados),
      headers: {
        'Content-Type': 'application/json'
      }
    };
    let res = await fetch(`http://localhost/Aula/API/login-adm`, options)
      .then (res => {
        return res.json();
      })
      if (res) {
        localStorage.setItem('login', 'true');
        return false;
    }
    return 'Login inválido';
  }
}