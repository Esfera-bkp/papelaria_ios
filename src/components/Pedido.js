import React, { Component } from 'react';

import { View, ScrollView, Text, TouchableOpacity, AsyncStorage, Image, TextInput, Modal, ActivityIndicator } from 'react-native';

import { connect } from 'react-redux';

import { Actions } from 'react-native-router-flux';

import { getInstance, DbError } from '../classes/DbManager';

import { number_format } from '../classes/Funcoes';

import styles from '../Styles'



export class Pedido extends Component {
    state = {
        descontoVisible: false,
        isLoading: false,
        idPedido: 0,
        idUsuario: 0,
        numPedido: 0,
        descontoComercial: 0,
        modalVisible: false,
        currentPedido: {
            observacoes: '',
        },
        linhas: [],

    };

    totalMercadorias = 0;
    totalIpi = 0;
    totalParcial = 0;
    totalFrete = 0;
    totalGeral = 0;
    objFrete = {};




    async componentDidMount() {

        AsyncStorage.getItem("@OTIMA.currentPedido").then(async (value) => {
            let curPed = JSON.parse(value);
            await this.setState({ currentPedido: curPed });

            this.calculaValores();
        }).done();

        AsyncStorage.getItem("@OTIMA.currentIdPedido").then(async (value) => {
            if (value) {
                await this.setState({ idPedido: value });
            }

        }).done();
        AsyncStorage.getItem("@OTIMA.user").then(async (value) => {
            let user = JSON.parse(value);
            await this.setState({ idUsuario: user.id });
        }).done();




        // await this.getRepresentantes();
        // await this.getUfs();


    }
    salvaOrcamento = () => {
        AsyncStorage.setItem("@OTIMA.currentPedido", JSON.stringify(this.state.currentPedido));

        let data = new Date();
        const mes = data.getMonth() + 1 < 10 ? "0" + (data.getMonth() + 1) : data.getMonth() + 1;
        const dia = data.getDate() < 10 ? "0" + (data.getDate()) : data.getDate();
        const dataHora = data.getFullYear() + "-" + mes + "-" + dia + " " + data.getHours() + ":" + data.getMinutes() + ":" + data.getSeconds();

        let query = "";

        let jsonPedido = JSON.stringify(this.state.currentPedido);
        jsonPedido = jsonPedido.split("'").join("''");
        // console.log(jsonPedido);
        
        if (this.state.idPedido != 0) {
            query = "UPDATE otm_pedidos set json = '"+jsonPedido+"', date_upd='"+dataHora+"' where id = "+this.state.idPedido+";";
        } else {
            query = "INSERT INTO otm_pedidos  (json, usuario_id,date_upd)  VALUES ('"+jsonPedido+"','"+this.state.idUsuario+"','"+ dataHora+"') ;";
        }


        let db = getInstance();
        console.log(query);
        db.transaction((tx) => {
            tx.executeSql(query, [], (tx, res) => {

                console.log("insertId: " + res.insertId + " -- probably 1");
                console.log("rowsAffected: " + res.rowsAffected + " -- should be 1");
                if (res.insertId) {
                    this.setState({ idPedido: res.insertId });
                }



            }, DbError);
        }, DbError);
    }
    salvaOrcamentoPressed = async () => {
        await this.salvaOrcamento();
        setTimeout(() => { Actions.listagem(); }, 300);

    }
    _enviar = async () => {
        if (!this.state.isLoading) {


            this.setState({ isLoading: true });
            await this.salvaOrcamento();

            let produtosCalculados = [];
            let parcelas = [];

            this.state.currentPedido.produtos.map((el, i) => {

                const objPrd = {
                    referencia: el.item.referencia,
                    barras: el.cor.barras,
                    cor: el.cor.titulo,
                    linecor: el.cor.cor,
                    descricao: el.item.titulo,
                    ipiper: el.item.ipi,
                    qtde: el.qtde,
                    unitario: number_format(el.item.unitario, 2, ',', '.'),
                    total: number_format(parseFloat(el.item.unitario * el.qtde).toFixed(2), 2, ',', '.'),
                    ipi: number_format(parseFloat(el.item.unitario * (el.item.ipi / 100)).toFixed(2), 2, ',', '.'),
                    st: number_format(0, 2, ',', '.'),
                };
                produtosCalculados.push(objPrd);
            });

            const qtdeParcelas = (this.state.currentPedido.forma_pagamento.parcelas) ? this.state.currentPedido.forma_pagamento.parcelas : 1;
            const parcelaNormal = parseFloat(this.totalMercadorias / qtdeParcelas).toFixed(2);
            for (let y = 1; y <= qtdeParcelas; y++) {
                parcelas.push({
                    parcela: y,
                    valor: number_format(parcelaNormal, 2, ',', '.'),
                });
            }


            const pedidoCompleto = {
                parcelas: parcelas,
                carrinho: produtosCalculados,
                frete: number_format(this.totalFrete, 2, ',', '.'),
                obj_frete: this.objFrete,
                totalIPI: number_format(this.totalIpi, 2, ',', '.'),
                totalMercIPI: number_format(this.totalParcial, 2, ',', '.'),
                totalST: number_format(0, 2, ',', '.'),
                totalPagar: number_format(this.totalGeral, 2, ',', '.'),
                total_mercadorias: number_format(this.totalMercadorias, 2, ',', '.'),
            };


            const obj = {
                id_local: this.state.idPedido,
                id_pedidos: this.state.numPedido,
                produtos: pedidoCompleto,
                desc_comercial: this.state.descontoComercial,
                cliente: this.state.currentPedido.cliente,
                observacoes: this.state.currentPedido.observacoes,
                forma: this.state.currentPedido.forma_pagamento,
                prazo: this.state.currentPedido.prazo_embarque,
                prazo_data: this.state.currentPedido.data_embarque,
                usuario: this.state.currentPedido.usuario,
                representante: this.state.currentPedido.representante,
                versao: this.props.Versao,
                versaodata: this.props.VersaoData,
            };

            console.log(obj);

            let url = `${this.props.UrlServer}app/sendMail-json.php`;
            console.log(url);
            const pingCall = await fetch(url, {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ object: obj })
            });
            const retJson = await pingCall.json();
            console.log(retJson);
            if (retJson.numero_pedido) {
                let data = new Date();
                const mes = data.getMonth() + 1 < 10 ? "0" + (data.getMonth() + 1) : data.getMonth() + 1;
                const dia = data.getDate() < 10 ? "0" + (data.getDate()) : data.getDate();
                const dataHora = data.getFullYear() + "-" + mes + "-" + dia + " " + data.getHours() + ":" + data.getMinutes() + ":" + data.getSeconds();
                const query = `UPDATE otm_pedidos set pedido = '${retJson.numero_pedido}', date_upd='${dataHora}' where id = ${this.state.idPedido};`;
                let db = getInstance();
                db.transaction((tx) => {
                    tx.executeSql(query, [], (tx, res) => {
                        console.log("rowsAffected: " + res.rowsAffected + " -- pedido Saved");

                        this.setState({ isLoading: false, modalVisible: true });
                    }, DbError);
                }, DbError);
            }

        }


    }
    calculaValores = () => {

        if (this.state.currentPedido.produtos && this.state.currentPedido.produtos.length > 0) {
            let totalM = 0;
            for (let x = 0; x < this.state.currentPedido.produtos.length; x++) {
                const prd = this.state.currentPedido.produtos[x];
                let totalUnitario = (prd.item.unitario * prd.qtde);
                if(this.state.descontoComercial>0){
                    totalUnitario = totalUnitario - (totalUnitario * (this.state.descontoComercial/100));
                }
                totalM += totalUnitario;

                if (prd.item.ipi > 0) {
                    const total = prd.item.unitario * prd.qtde;
                    const ipi = total * (prd.item.ipi / 100);
                    this.totalIpi = ipi;
                }
            }

            this.totalMercadorias = totalM;
            this.totalParcial = this.totalMercadorias + this.totalIpi;
            this.totalGeral = this.totalParcial;


            let db = getInstance();
            let query = `SELECT a.id,a.uf_id,a.dias,a.minimo,a.maximo,a.preco,b.short as UF 
                        FROM otm_fretes a, otm_ufs b 
                        WHERE  a.uf_id = ${this.state.currentPedido.cliente.uf_id}
                        AND b.id = a.uf_id 
                        AND ${this.totalMercadorias} >= a.minimo 
                        AND ${this.totalMercadorias} < a.maximo`;
            db.transaction((tx) => {
                tx.executeSql(query, [], (tx, results) => {
                    let qtde = results.rows.length;
                    if (qtde > 0) {
                        let item = results.rows.item(0);
                        this.objFrete = item;
                        this.totalFrete = item.preco;
                        this.totalGeral += this.totalFrete;

                        let curPed = { ...this.state.currentPedido };
                        curPed.frete = item;
                        this.setState({ currentPedido: curPed });


                    } else {
                        alert('Erro!');
                    }



                }, DbError);
            }, DbError);



        }

    }


    _changeObs = (observacoes) => {
        let curPed = { ...this.state.currentPedido };
        curPed.observacoes = observacoes;
        this.setState({ currentPedido: curPed });

    }


    renderRow(el, i) {
        const txtUnitario = number_format(el.item.unitario, 2, ',', '.');
        const txtTotal = number_format(el.item.unitario * el.qtde, 2, ',', '.');
        let txtIpi;
        if (el.item.ipi > 0) {
            const total = el.item.unitario * el.qtde;
            const ipi = total * (el.item.ipi / 100);
            txtIpi = number_format(ipi, 2, ',', '.');
        } else {
            txtIpi = number_format(0, 2, ',', '.');
        }
        return (
            <View style={styles.tr} key={i}>
                <View style={[{ flex: 2 }, styles.td]} ><Text style={styles.tdText}>{el.item.referencia}</Text></View>
                <View style={[{ flex: 3 }, styles.td, styles.tableBorderLeft]} ><Text style={styles.tdText}>{el.item.titulo}</Text></View>
                <View style={[{ flex: .6 }, styles.td, styles.tableBorderLeft]} ><Text style={styles.tdText}>{(el.cor ? el.cor.titulo : '')}</Text></View>
                <View style={[{ flex: .4 }, styles.td, styles.tableBorderLeft]} ><Text style={styles.tdText}>{el.item.ipi}</Text></View>
                <View style={[{ flex: .6 }, styles.td, styles.tableBorderLeft]} ><Text style={styles.tdText}>{el.qtde}</Text></View>
                <View style={[{ flex: .6 }, styles.td, styles.tableBorderLeft]} ><Text style={styles.tdText}>{txtUnitario}</Text></View>
                <View style={[{ flex: .6 }, styles.td, styles.tableBorderLeft]} ><Text style={styles.tdText}>{txtTotal}</Text></View>
                <View style={[{ flex: .5 }, styles.td, styles.tableBorderLeft]} ><Text style={styles.tdText}>{txtIpi}</Text></View>

            </View>
        );
    }
    _setDesconto = async (perc) => {

        await this.setState({ descontoVisible: false,descontoComercial:perc });
        this.calculaValores();
    }
    _toggleDesconto = () => {
        if (this.state.descontoVisible) {
            this.setState({ descontoVisible: false });
        } else {
            this.setState({ descontoVisible: true });
        }
    }

    render() {
        // console.log(this.state.currentPedido);
        const { isLoading } = this.state;

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
                        <TouchableOpacity style={styles.breadcrumItem} onPress={() => { Actions.produtos() }}>
                            <View style={[styles.breadcrumbBullet, styles.bulletDisabled]}>
                                <Image style={[styles.checkImg]} source={require('../images/icons/check.png')} />
                            </View>
                            <Text style={[styles.breadcrumbText, styles.txtDisabled]}>Produtos</Text>
                        </TouchableOpacity>
                        <View style={styles.breadcrumItem}>
                            <View style={styles.breadcrumbBullet}>
                                <Text style={styles.txtBullet}>5</Text>
                            </View>
                            <Text style={styles.breadcrumbText}>Pedido</Text>
                        </View>



                    </View>

                </View>

                <ScrollView contentContainerStyle={styles.pedidoContainer} >

                    <View style={styles.fieldListProdutos}>
                        <View style={styles.row}>
                            <Text style={styles.h1}>Pedido</Text>
                            <TouchableOpacity style={styles.btnCancelar} onPress={() => { Actions.listagem() }}>
                                <Text style={[styles.textRed, styles.textBold]}>Cancelar Pedido</Text>
                            </TouchableOpacity>
                        </View>
                    </View>


                    <View style={styles.rowFormContainer}>
                        <View style={styles.formContainer}>
                            <View style={styles.tableHeader}>
                                <View style={{ flex: 1, alignSelf: 'stretch', flexDirection: 'row' }}>
                                    <View style={[{ flex: 2 }, styles.th]} ><Text style={styles.thText}>Referência</Text></View>
                                    <View style={[{ flex: 3 }, styles.th, styles.tableBorderLeft]} ><Text style={styles.thText}>Descrição</Text></View>
                                    <View style={[{ flex: .6 }, styles.th, styles.tableBorderLeft]} ><Text style={styles.thText}>Cor</Text></View>
                                    <View style={[{ flex: .4 }, styles.th, styles.tableBorderLeft]} ><Text style={styles.thText}>% IPI</Text></View>
                                    <View style={[{ flex: .6 }, styles.th, styles.tableBorderLeft]} ><Text style={styles.thText}>Qtde</Text></View>
                                    <View style={[{ flex: .6 }, styles.th, styles.tableBorderLeft]} ><Text style={styles.thText}>Unit. R$</Text></View>
                                    <View style={[{ flex: .6 }, styles.th, styles.tableBorderLeft]} ><Text style={styles.thText}>Total. R$</Text></View>
                                    <View style={[{ flex: .5 }, styles.th, styles.tableBorderLeft]} ><Text style={styles.thText}>IPI R$</Text></View>

                                </View>
                            </View>
                            <View style={styles.tableBody}>
                                {
                                    (this.state.currentPedido.produtos && this.state.currentPedido.produtos.length > 0) ?

                                        this.state.currentPedido.produtos.map((el, i) => {
                                            return (

                                                this.renderRow(el, i)

                                            );
                                        })
                                        :
                                        <View style={styles.tr}  >
                                            <Text style={{ padding: 20 }}>Nenhum item</Text>
                                        </View>

                                }
                            </View>
                            <View style={styles.tableFooter}>
                                <TextInput
                                    style={styles.textArea}
                                    multiline={true}
                                    numberOfLines={4}
                                    placeholder="Observações"
                                    onChangeText={this._changeObs.bind(this)}
                                    value={this.state.currentPedido.observacoes} />
                                <View style={styles.tableDetails}>
                                    <View style={styles.detailRow}>
                                        <Text style={styles.detailLabel}>Total das mercadorias (R$)</Text>
                                        <Text style={styles.detailValue}>{number_format(this.totalMercadorias, 2, ',', '.')}</Text>
                                    </View>
                                    <View style={styles.detailRow}>
                                        <Text style={styles.detailLabel}>Total de IPI (R$)</Text>
                                        <Text style={styles.detailValue}>{number_format(this.totalIpi, 2, ',', '.')}</Text>
                                    </View>
                                    <View style={styles.detailRow}>
                                        <Text style={styles.detailLabel}>Total mercadoras + IPI (R$)</Text>
                                        <Text style={styles.detailValue}>{number_format(this.totalParcial, 2, ',', '.')}</Text>
                                    </View>
                                    <View style={styles.detailRow}>
                                        <Text style={styles.detailLabel}>Frete (R$)</Text>
                                        <Text style={styles.detailValue}>{number_format(this.totalFrete, 2, ',', '.')}</Text>
                                    </View>
                                    <View style={styles.detailRow}>
                                        <Text style={styles.detailLabelBig}>Total a Pagar (R$)</Text>
                                        <Text style={styles.detailValueBig}>{number_format(this.totalGeral, 2, ',', '.')}</Text>
                                    </View>
                                </View>
                            </View>

                        </View>
                    </View>
                    <View style={[styles.rowBtns]}>
                        <TouchableOpacity style={styles.descontoButton} onPress={this._toggleDesconto} >
                            <Image source={require('../images/icons/check_circle.png')} style={{ width: 36, height: 36 }} />
                        </TouchableOpacity>
                        {this.state.descontoVisible && (
                            <View style={styles.viewComercial} >
                                <TouchableOpacity style={styles.descontoItemButton} onPress={() => { this._setDesconto(5) }} >
                                    <Text style={styles.descontoItemTxt}>5</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.descontoItemButton} onPress={() => { this._setDesconto(4) }} >
                                    <Text style={styles.descontoItemTxt}>4</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.descontoItemButton} onPress={() => { this._setDesconto(3) }} >
                                    <Text style={styles.descontoItemTxt}>3</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.descontoItemButton} onPress={() => { this._setDesconto(2) }} >
                                    <Text style={styles.descontoItemTxt}>2</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.descontoItemButton} onPress={() => { this._setDesconto(1) }} >
                                    <Text style={styles.descontoItemTxt}>1</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.descontoItemButton} onPress={() => { this._setDesconto(0) }} >
                                    <Text style={styles.descontoItemTxt}>0</Text>
                                </TouchableOpacity>
                            </View>
                            
                        )}
                        <View style={[styles.rightBtns]}>
                            <TouchableOpacity style={styles.saveButton} onPress={this.salvaOrcamentoPressed.bind(this)} >
                                <Text style={styles.buttonText} >Salvar Orçamento</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.sendButton} onPress={this._enviar.bind(this)} >

                                {!isLoading && (
                                    <Text style={styles.buttonText} >Enviar</Text>
                                )}

                                {isLoading && (
                                    <ActivityIndicator

                                        color="#fff"

                                    />
                                )}

                            </TouchableOpacity>
                        </View>
                    </View>






                </ScrollView>

                {/* MODAL ALERT */}
                <Modal animationType="fade" visible={this.state.modalVisible} >
                    <View style={styles.alertPedido}>
                        <View style={styles.alertPedidoContainer}>


                            <Image source={require('../images/logo_escura.png')} style={{ width: 200, height: 62 }} />
                            <Text style={styles.alertPedidoTitle}>Pedido enviado com sucesso!</Text>
                            <Text style={styles.alertPedidoPergunta}>Deseja retornar para tela inicial?</Text>
                            <View style={styles.alertPedidoButtomBox}>
                                <TouchableOpacity style={[styles.saveButton, { width: 100 }]} onPress={() => { this.setState({ modalVisible: false }) }} >
                                    <Text style={styles.buttonText} >Não</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.submitButton, { width: 100 }]} onPress={() => { this.setState({ modalVisible: false }); Actions.listagem() }} >
                                    <Text style={styles.buttonText} >Sim</Text>
                                </TouchableOpacity>
                            </View>
                        </View>


                    </View>

                </Modal>



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


export default connect(mapStateToProps, null)(Pedido);