import { Cliente } from './components/cadastro/cliente';
import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common'; // Importe isPlatformBrowser

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  static REPO_CLIENTES = "_CLIENTES";
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  salvar(cliente: Cliente){
    if (this.isBrowser) { // Verifica se está no navegador antes de acessar localStorage
      const storage = this.obterStorage();
      storage.push(cliente);
      localStorage.setItem(ClienteService.REPO_CLIENTES, JSON.stringify(storage));
    } else {
      console.warn('localStorage não disponível no servidor. Cliente não salvo.');
    }
  }

  obterStorage() : Cliente[]{
    if (this.isBrowser) { // Verifique se está no navegador antes de acessar localStorage
      const repositorioClientes = localStorage.getItem(ClienteService.REPO_CLIENTES);
      if(repositorioClientes){
        const clientes: Cliente[] = JSON.parse(repositorioClientes);
        return clientes;
      }
      const clientes: Cliente[] = [];
      localStorage.setItem(ClienteService.REPO_CLIENTES, JSON.stringify(clientes));
      return clientes;
    } else {
      // Retorne um array vazio ou lide com a lógica de não ter acesso ao storage no servidor
      return [];
    }
  }


  pesquisarClientes(nomeBusca: string) : Cliente[]{

    const clientes = this.obterStorage();

    if(!nomeBusca){
      return clientes;
    }

    const nomeBuscaLower = nomeBusca.toLowerCase();

    return clientes.filter(cliente => {
      return cliente.nome?.toLowerCase().indexOf(nomeBuscaLower) !== -1;
    });
  }

  BuscarClientePorId(id: string) : Cliente | undefined{
    const clientes = this.obterStorage();
    return clientes.find(clientes => clientes.id === id)
  }

  atualizar(cliente: Cliente){
    const storage = this.obterStorage();

    storage.forEach(c => {
      if(c.id === cliente.id){
        Object.assign(c, cliente);
      }
    })
    localStorage.setItem(ClienteService.REPO_CLIENTES, JSON.stringify(storage));
  }

  deletar(cliente: Cliente){
    const storage = this.obterStorage();

    const novaLista = storage.filter(c => c.id !== cliente.id);

    const indexItem = storage.indexOf(cliente);
    if(indexItem > -1){
      storage.splice(indexItem, 1);
    }

    localStorage.setItem(ClienteService.REPO_CLIENTES, JSON.stringify(novaLista));
  }


}
