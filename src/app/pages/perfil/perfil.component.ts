import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  nomUsuario: String;
  rolUsuario: String;

  constructor() { }

  ngOnInit(): void {

    const helper = new JwtHelperService();

    let token = sessionStorage.getItem(environment.TOKEN_NAME);
    const decodedToken = helper.decodeToken(token);
 
    this.nomUsuario = decodedToken.user_name;
    this.rolUsuario = decodedToken.authorities.toString();
  }

}
