import React, { Component } from 'react';

import { View, ScrollView, Text, TouchableOpacity, AsyncStorage, Image } from 'react-native';

import { connect } from 'react-redux';

import { Actions } from 'react-native-router-flux';

import { getInstance, DbError,salvaOrcamento } from '../classes/DbManager';

import ItemLista from './_itemLista';

import styles from '../Styles'

import Carrinho from './_carrinho';
import Pesquisa from './_pesquisa';

export class ProdutosTipos extends Component {
    state = {
        produtos:[],

        somenteConsulta: false,
        currentPedido: {
        },
        linha: {},
        

    };

    

    async componentWillReceiveProps(){
        console.log("########");
              
                let value = await AsyncStorage.getItem("@OTIMA.currentPedido");      
                let curPed = JSON.parse(value);
                await this.setState({ currentPedido: curPed });
                this.refs.carrinhoBtn.updateCarrinho();
       
    }

    async componentDidMount() {
        await AsyncStorage.getItem("@OTIMA.currentPedido").then(async (value) => {
            let curPed = JSON.parse(value);
            console.log(curPed);
            await this.setState({ currentPedido: curPed });
            this.refs.carrinhoBtn.updateCarrinho();
            AsyncStorage.getItem("@OTIMA.linha").then(async (value) => {
                let linha = JSON.parse(value);
                await this.setState({ linha });

                AsyncStorage.getItem("@OTIMA.somenteConsulta").then(async (value) => {
                    if (value && value == 1) {
                        await this.setState({ somenteConsulta: true });
                    }
                }).done();

                await this.getProdutos();

            }).done();
        }).done();



        // await this.getRepresentantes();
        // await this.getUfs();


    }


    getProdutos = async () => {
        let db = getInstance();
        let query = `SELECT id,linha_id,titulo,reajuste,image,order_id FROM otm_produtos WHERE linha_id = ${this.state.linha.id} order by order_id,titulo`;
        db.transaction(async (tx) => {
            await tx.executeSql(query, [], async (tx, results) => {
                let qtde = results.rows.length;
                if (qtde > 0) {
                    let repArray = [];
                    for (let x = 0; x < qtde; x++) {
                        let item = results.rows.item(x);


                        repArray.push(item);

                    }


                    this.setState({ produtos: repArray });
                } else {
                    alert('Erri!');
                }



            }, DbError);
        }, DbError);
    }




    linhaSelected = (tipo_produto_id, tipo_produto_titulo) => {
        console.log(tipo_produto_id + " " + tipo_produto_titulo);
        let obj = { id: tipo_produto_id, titulo: tipo_produto_titulo };
        AsyncStorage.setItem("@OTIMA.tipoProduto", JSON.stringify(obj));

        Actions.produtositens();
    }

    savePedido = async (pedido) => {
        await this.setState({ currentPedido: pedido });
        AsyncStorage.setItem("@OTIMA.currentPedido", JSON.stringify(pedido));
        salvaOrcamento(pedido);
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
                            <TouchableOpacity style={styles.breadcrumProdutosItem} onPress={() => { Actions.produtoslinhas({refresh: {refresh:Math.random()}}); }}>
                                <Text style={styles.breadcrumProdutosText}>Linhas</Text>
                            </TouchableOpacity>
                            <Text style={styles.h1}> \ Produtos Linha {this.state.linha.titulo}</Text>
                        </View>
                        <TouchableOpacity style={styles.btnCancelar} onPress={() => { Actions.listagem({refresh: {refresh:Math.random()}} )  }}>
                            <Text style={[styles.textRed, styles.textBold]}>Cancelar Pedido</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <ScrollView contentContainerStyle={styles.productList} horizontal alwaysBounceVertical={false}>
                    {

                        this.state.produtos.map((el, i) => {
                            return (
                                // <View style={styles.productListColumna} key={i}>

                                <ItemLista onSelect={() => { }} item={el} onItemSelected={(tipo_id, tipo_titulo) => { this.linhaSelected(tipo_id, tipo_titulo) }} key={i} urlImage={`produtos/${el.image}`} />





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


export default connect(mapStateToProps, null)(ProdutosTipos);