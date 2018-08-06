import React, { Component } from 'react';

import { View, ScrollView, Text, TouchableOpacity, AsyncStorage, Image, Alert } from 'react-native';

import { connect } from 'react-redux';

import { Actions } from 'react-native-router-flux';

import { getInstance, DbError,salvaOrcamento } from '../classes/DbManager';

import ProdutoItemLista from './_produtoItemLista';

import styles from '../Styles'

import Carrinho from './_carrinho';
import Pesquisa from './_pesquisa';

export class ProdutosItens extends Component {
    state = {
        somenteConsulta: false,
        modalVisible:true,

        currentPedido: {
        },
        linha: {},
        tipoProduto: {},
        itens: [],

    };




    async componentDidMount() {

        await AsyncStorage.getItem("@OTIMA.currentPedido").then(async (value) => {
            let curPed = JSON.parse(value);
            console.log(curPed);
            await this.setState({ currentPedido: curPed });

            AsyncStorage.getItem("@OTIMA.somenteConsulta").then(async (value) => {
                if (value && value == 1) {
                    await this.setState({ somenteConsulta: true });
                }
            }).done();

            await AsyncStorage.getItem("@OTIMA.linha").then(async (value) => {
                let linha = JSON.parse(value);
                await this.setState({ linha });

                await AsyncStorage.getItem("@OTIMA.tipoProduto").then(async (value) => {
                    let tipoProduto = JSON.parse(value);
                    // console.log(tipoProduto);
                    await this.setState({ tipoProduto });

                    await this.getProdutosItens();
                }).done();

            }).done();

        }).done();





    }


    getProdutosItens = async () => {
        let db = getInstance();

        const media_id = (this.state.currentPedido.forma_pagamento.media_id ? this.state.currentPedido.forma_pagamento.media_id : 1);

        let query = `SELECT a.id,a.produto_id,a.titulo,a.embalagem,a.importado,a.referencia,a.ipi, b.preco, c.reajuste, a.importado, d.multiplicador_nacional, d.multiplicador_importado
        FROM otm_formatos a, 
        otm_precos b,
        otm_produtos c,
        otm_ufs d
        WHERE a.produto_id = ${this.state.tipoProduto.id} 
            AND b.formato_id = a.id 
            AND b.media_id = ${media_id} 
            AND c.id = a.produto_id 
            AND d.id = ${this.state.currentPedido.cliente.uf_id} 
            
        ORDER BY a.order_id, a.titulo,a.id`;
        // console.log(query);
        await db.transaction(async (tx) => {
            await tx.executeSql(query, [], async (tx_, results) => {
                let qtde = results.rows.length;
                if (qtde > 0) {
                    let repArray = [];
                    for (let x = 0; x < qtde; x++) {
                        let item = results.rows.item(x);
                        item.cores = [];
                        item.multiplicador = this.state.currentPedido.cliente.multiplicador;
                        let unitario = parseFloat(item.preco).toFixed(2);
                        if(parseFloat(item.multiplicador)>0){
                            unitario = unitario*parseFloat(item.multiplicador);
                        }
                        if(parseFloat(item.reajuste)>0){
                            unitario = unitario*parseFloat(item.reajuste);
                        }
                        if(parseInt(item.importado) == 1){
                            unitario = unitario * item.multiplicador_importado;
                        }else{
                            unitario = unitario * item.multiplicador_nacional;
                        }
                        // if (desc_comercial>0) {
                        //     unitario = unitario - (unitario * (desc_comercial/100));
                        // }
                        item.unitario = unitario;
                        let query_cores = `SELECT id,formato_id,cor,titulo,barras,image,metrics FROM otm_cores WHERE formato_id = ${item.id} and online = 1 order by titulo`;
                        console.log(query_cores);
                        let colocaItem=true;
                        await tx.executeSql(query_cores, [], async (tx__, results_cores) => {
                            let qtde_cores = results_cores.rows.length;
                            if (qtde_cores > 0) {
                                let repCores = [];
                                for (let y = 0; y < qtde_cores; y++) {
                                    let itemCor = results_cores.rows.item(y);
                                    if(itemCor.image != ''){ 
                                        console.log(itemCor.image);
                                        repCores.push(itemCor);
                                    }
                
                                }
                                item.cores = repCores;
                                
                                
                            } else {
                                colocaItem = false;
                                // Alert.alert(
                                //     'Atenção',
                                //     'Nenhuma cor cadastrada no item! '+item.titulo+' id:'+item.id,
                                //     [
                                      
                                //       {text: 'Ok', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                                      
                                //     ],
                                //     { cancelable: true }
                                //   )
                                
                            }
                            
                            
                            
                        }, DbError);
                        if(colocaItem){
                            await repArray.push(item);
                        }
                    }
                    

                    setTimeout(()=>{ this.setState({ itens: repArray });},100); 
                    
                    // console.log(repArray);
                    

                    
                } else {
                    Alert.alert(
                        'Atenção',
                        'Nenhum item cadastrado no produto! '+this.state.tipoProduto.id,
                        [
                          
                          {text: 'Ok', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                          
                        ],
                        { cancelable: true }
                      )
                    
                    Actions.pop();
                }



            }, DbError);
        }, DbError);
    }




   


    addToCart = async (item) => {
        console.log(item);

        let curPed = { ...this.state.currentPedido };
        if(!curPed.produtos){
            curPed.produtos = [];
        }
        let podeSalvar = true;
        for(let x=0; x < curPed.produtos.length; x++){
            if(curPed.produtos[x].cor.id == item.cor.id){
                podeSalvar = false;
            }

        }
        if(podeSalvar){

            await curPed.produtos.push(item);
            await this.savePedido(curPed);
            // await this.setState({ currentPedido: curPed  });
            
            // await AsyncStorage.setItem("@OTIMA.currentPedido",JSON.stringify(curPed));
            // salvaOrcamento(curPed);
        }else{
            Alert.alert(
                'Atenção',
                'Item já adicionado ao carrinho!',
                [
                  
                  {text: 'Ok', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                  
                ],
                { cancelable: true }
              )
        }
        
    }
    
    savePedido = async (pedido) =>{
        await this.setState({ currentPedido: pedido  });
        await AsyncStorage.setItem("@OTIMA.currentPedido",JSON.stringify(pedido)); 
        await salvaOrcamento(pedido);
        this.refs.carrinhoBtn.updateCarrinho();
    }
    render() {

        return (
            <View style={styles.containerWithHeader} >
                <View style={styles.header} >
                    <View style={styles.breadcrumbContainer} >

                        <TouchableOpacity style={styles.breadcrumItem} onPress={() => { Actions.cliente() }}>
                            <View style={[styles.breadcrumbBullet, styles.bulletDisabled]}>
                                <Image style={[styles.checkImg]} source={require('../images/icons/check.png')} />
                            </View>
                            <Text style={[styles.breadcrumbText, styles.txtDisabled]}>Cliente</Text>

                        </TouchableOpacity>
                        <TouchableOpacity style={styles.breadcrumItem} onPress={() => { Actions.pagamento() }}>
                            <View style={[styles.breadcrumbBullet, styles.bulletDisabled]}>
                                <Image style={[styles.checkImg]} source={require('../images/icons/check.png')} />
                            </View>
                            <Text style={[styles.breadcrumbText, styles.txtDisabled]}>Pagamento</Text>

                        </TouchableOpacity>
                        <TouchableOpacity style={styles.breadcrumItem} onPress={() => { Actions.prazoembarque() }}>
                            <View style={[styles.breadcrumbBullet, styles.bulletDisabled]}>
                                <Image style={[styles.checkImg]} source={require('../images/icons/check.png')} />
                            </View>
                            <Text style={[styles.breadcrumbText, styles.txtDisabled]}>Prazo de embarque</Text>
                        </TouchableOpacity>
                        <View style={styles.breadcrumItem}>
                            <View style={styles.breadcrumbBullet}>
                                <Text style={styles.txtBullet}>4</Text>
                            </View>
                            <Text style={styles.breadcrumbText}>Produtos</Text>
                        </View>

                        <View style={styles.breadcrumItem}>
                            <View style={[styles.breadcrumbBullet, styles.bulletDisabled]}>
                                <Text style={[styles.txtBullet, styles.txtDisabled]}>5</Text>
                            </View>
                            <Text style={[styles.breadcrumbText, styles.txtDisabled]}>Pedido</Text>
                        </View>

                    </View>
                    <Pesquisa  />
                    {!this.state.somenteConsulta && (
                        <Carrinho ref="carrinhoBtn" pedido={this.state.currentPedido} savePedido={this.savePedido.bind(this)} />
                    )}
                </View>

                <View style={styles.fieldListProdutos}>
                    <View style={styles.row}>
                        <View style={styles.rowBreadCrumProdutos}>
                            <TouchableOpacity style={styles.breadcrumProdutosItem} onPress={() => { Actions.produtos(); }}>
                                <Text style={styles.breadcrumProdutosText}>Linhas</Text>
                            </TouchableOpacity>
                            <Text style={[styles.h1, styles.textBlue]}> \ </Text>
                            <TouchableOpacity style={styles.breadcrumProdutosItem} onPress={() => { Actions.pop() }}>
                                <Text style={styles.breadcrumProdutosText}>Produtos Linha {this.state.linha.titulo}</Text>
                            </TouchableOpacity>
                            <Text style={styles.h1}> \ {this.state.tipoProduto.titulo}</Text>
                        </View>
                        <TouchableOpacity style={styles.btnCancelar} onPress={() => { Actions.listagem() }}>
                            <Text style={[styles.textRed, styles.textBold]}>Cancelar Pedido</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <ScrollView contentContainerStyle={styles.productItemList} horizontal alwaysBounceVertical={false}>
                    {

                        this.state.itens.map((el, i) => {
                            return (
                                // <View style={styles.productListColumna} key={i}>

                                <ProdutoItemLista somenteConsulta={this.state.somenteConsulta}  item={el}  addItemToCart={this.addToCart.bind(this)} key={i} urlServidor={`${this.props.UrlServer}`} />





                                // </View>
                            );
                        })

                    }




                </ScrollView>
                

            </View>)
    }





}


const mapStateToProps = state => (
    {
        UrlServer: state.GlobalReducer.UrlServer,
        Versao: state.GlobalReducer.Versao,
        VersaoData: state.GlobalReducer.VersaoData,
    }
);


export default connect(mapStateToProps, null)(ProdutosItens);