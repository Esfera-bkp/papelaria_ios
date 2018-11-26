import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { Router, Scene } from 'react-native-router-flux';
import { createStore } from 'redux';


import Inicial from './src/components/Inicial';
import Listagem from './src/components/Listagem';
import Cliente from './src/components/Cliente';
import Pagamento from './src/components/Pagamento';
import PrazoEmbarque from './src/components/PrazoEmbarque';
import ProdutosLinhas from './src/components/ProdutosLinhas';
import ProdutosTipos from './src/components/ProdutosTipos';
import ProdutosItens from './src/components/ProdutosItens';
import Pedido from './src/components/Pedido';

import reducers from './src/reducers'; 





export default class App extends Component {




  render() {
    return (
      <Provider store={createStore(reducers)}>
      
        <Router  >
          <Scene key="root">
            <Scene key="inicial"  hideNavBar component={Inicial}  title="Login" />            
            <Scene key="listagem"     hideNavBar component={Listagem} title="Listagem" />
            <Scene key="cliente"   hideNavBar component={Cliente}  title="Cliente" />
            <Scene key="pagamento"  hideNavBar component={Pagamento}  title="Cliente" />
            <Scene key="prazoembarque" hideNavBar component={PrazoEmbarque}   title="Cliente" />
            <Scene key="produtos"   >
              <Scene key="produtoslinhas"  hideNavBar component={ProdutosLinhas}     title="Cliente" />
              <Scene key="produtostipos" hideNavBar component={ProdutosTipos}     title="Cliente" />
              <Scene key="produtositens"   hideNavBar component={ProdutosItens}     title="Cliente" />
            </Scene>
            <Scene key="pedido"    hideNavBar component={Pedido}   title="Pedido" />
          </Scene>
        </Router>
        
      </Provider>
    );
  }
}




