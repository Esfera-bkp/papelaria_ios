import React, { Component } from 'react';

import { View, ScrollView, Text, TouchableOpacity, AsyncStorage, Image } from 'react-native';

import { connect } from 'react-redux';

import { Actions } from 'react-native-router-flux';

import { getInstance, DbError } from '../classes/DbManager';

import ItemLista from './_itemLista';

import styles from '../Styles'

import Carrinho from './_carrinho';
import Pesquisa from './_pesquisa';

export class ProdutosLinhas extends Component {
    state = {

        somenteConsulta: false,

        currentPedido: {
        },
        linhas: [],

    };




    async componentDidMount() {

        AsyncStorage.getItem("@OTIMA.currentPedido").then(async (value) => {
            let curPed = JSON.parse(value);
            await this.setState({ currentPedido: curPed });
            await this.getLinhas();

            AsyncStorage.getItem("@OTIMA.somenteConsulta").then(async (value) => {
                if (value && value == 1) {
                    await this.setState({ somenteConsulta: true });
                }
            }).done();
        }).done();



        // await this.getRepresentantes();
        // await this.getUfs();


    }


    getLinhas = async () => {
        let db = getInstance();
        let query = "SELECT id,titulo,image FROM otm_linhas order by order_id,titulo";
        db.transaction(async (tx) => {
            await tx.executeSql(query, [], async (tx, results) => {
                let qtde = results.rows.length;
                if (qtde > 0) {
                    let repArray = [];
                    for (let x = 0; x < qtde; x++) {
                        let item = results.rows.item(x);


                        repArray.push(item);

                    }
                    this.linhas = repArray;
                    // console.log(JSON.stringify(this.linhas));
                    this.setState({ linhas: repArray });
                } else {
                    alert('Erri!');
                }



            }, DbError);
        }, DbError);
    }




    linhaSelected = (linha_id, linha_titulo) => {
        console.log(linha_id + " " + linha_titulo);
        let obj = { id: linha_id, titulo: linha_titulo };
        AsyncStorage.setItem("@OTIMA.linha", JSON.stringify(obj));

        Actions.produtostipos();
    }

    savePedido = async (pedido) => {
        await this.setState({ currentPedido: pedido });
        AsyncStorage.setItem("@OTIMA.currentPedido", JSON.stringify(pedido));
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
                        <Carrinho pedido={this.state.currentPedido} savePedido={this.savePedido.bind(this)} />
                    )}
                </View>

                <View style={styles.fieldListProdutos}>
                    <View style={styles.row}>
                        <Text style={styles.h1}>Linhas</Text>
                        <TouchableOpacity style={styles.btnCancelar} onPress={() => { Actions.listagem() }}>
                            <Text style={[styles.textRed, styles.textBold]}>Cancelar Pedido</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <ScrollView contentContainerStyle={styles.productList} horizontal alwaysBounceVertical={false}>
                    {

                        this.state.linhas.map((el, i) => {
                            return (
                                // <View style={styles.productListColumna} key={i}>

                                <ItemLista onSelect={() => { }} item={el} onItemSelected={(linha_id, linha_titulo) => { this.linhaSelected(linha_id, linha_titulo) }} key={i} urlImage={`linhas/${el.image}`} />





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


export default connect(mapStateToProps, null)(ProdutosLinhas);