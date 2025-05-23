import { Municipio } from './../../brasilapi.models';
import { Component, OnInit, inject  } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout'
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule} from '@angular/material/input';
import { MatButtonModule} from '@angular/material/button';
import { Cliente } from '../cadastro/cliente'
import { ClienteService} from '../../cliente.service'
import { ActivatedRoute, Router } from '@angular/router';
import { NgxMaskDirective, provideNgxMask} from 'ngx-mask'
import { MatSnackBar } from '@angular/material/snack-bar'
import { BrasilapiService } from '../../brasilapi.service';
import { Estado } from '../../brasilapi.models';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cadastro',
  imports: [
    FlexLayoutModule,
    MatCardModule, FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    NgxMaskDirective,
    MatSelectModule,
    CommonModule
    ],
    providers: [
      provideNgxMask()
    ],
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.scss'
})
export class CadastroComponent {

  cliente: Cliente = Cliente.newCliente();
  atualizando: boolean = false;
  snack: MatSnackBar = inject(MatSnackBar);
  estados: Estado[] = [];
  municipio: Municipio [] = [];

  constructor(
    private service: ClienteService,
    private route: ActivatedRoute,
    private router: Router,
    private brasilApiService: BrasilapiService
  ){}

  ngOnInit() : void{
    this.route.queryParamMap.subscribe( (query: any) => {
      const params = query['params'];
      const id = params['id'];
      if(id){
        let clienteEncontrado = this.service.BuscarClientePorId(id);

        if(clienteEncontrado){
          this.atualizando = true;
          this.cliente = clienteEncontrado;
          if(this.cliente.uf){
            const event = {value: this.cliente.uf}
            this.carregarMunicipios(event as MatSelectChange);
          }
        }
      }
    } )

    this.carregarUFs();
  }

  carregarUFs(){
    //Observable padrão de objeto onde algo fica sendo observado e quando há mudança ele notifica o subscriber
    //subscriber é quem recebe a informação
    this.brasilApiService.listarUFs().subscribe({
      next: listaEstados => this.estados = listaEstados,
      error: erro => console.log("ocorreu um erro: ", erro)
    })
  }

  carregarMunicipios(event: MatSelectChange){
    const ufSelecionada = event.value;
    this.brasilApiService.listarMunicipios(ufSelecionada).subscribe({
      next: listaMunicipios => this.municipio = listaMunicipios,
      error: erro => console.log('Ocorreu um erro', erro)
    })
  }

  salvar(){
    if(!this.atualizando){
      this.service.salvar(this.cliente);
      this.cliente = Cliente.newCliente();
      this.mostraMensagem("Salvo com sucesso");
    }else{
      this.service.atualizar(this.cliente);
      this.router.navigate(['/consulta']);
      this.mostraMensagem("updated")
    }
  }

  mostraMensagem(mensagem : string){
    this.snack.open(mensagem, "ok");
  }




}
