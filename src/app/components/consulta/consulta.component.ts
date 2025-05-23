import { Component, OnInit, inject } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { ClienteService } from '../../cliente.service';
import { Cliente } from '../cadastro/cliente';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar'

@Component({
  selector: 'app-consulta',
  imports: [
            MatInputModule,
            MatCardModule,
            FlexLayoutModule,
            MatIconModule,
            FormsModule,
            MatTableModule,
            MatButtonModule,
            CommonModule
          ],
  templateUrl: './consulta.component.html',
  styleUrl: './consulta.component.scss'
})
export class ConsultaComponent {

  listaClientes : Cliente[] = [];
  colunasTable: string[] = ["id", "nome", "cpf", "dataNascimento", "email", "uf", "municipio", "acoes"]
  nomeBusca: string = '';
  snack: MatSnackBar = inject(MatSnackBar);

  constructor(
    private service : ClienteService,
    private router: Router
  ){

  }

  ngOnInit(){
    this.listaClientes = this.service.pesquisarClientes('');
  }


  preparaEditar(id: string){
    this.router.navigate(['/cadastro'], {queryParams: {"id": id}});
  }

  pesquisar(){
    this.listaClientes = this.service.pesquisarClientes(this.nomeBusca);
  }

  preparaDeletar(cliente : Cliente){
    cliente.deletando = true;
  }

  deletar(cliente: Cliente){
    this.service.deletar(cliente);
    this.listaClientes = this.service.pesquisarClientes('');
    this.snack.open("Item deletado com sucesso!", "ok");
  }

}
