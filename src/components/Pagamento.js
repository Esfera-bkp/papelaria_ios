import React, { Component } from 'react';

import { View, ScrollView, Text, TouchableOpacity, AsyncStorage,Image,Alert } from 'react-native';

import { connect } from 'react-redux';

import { Actions } from 'react-native-router-flux';

import { getInstance, DbError,salvaOrcamento } from '../classes/DbManager';

import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';

import styles from '../Styles'

import Select from './inputs/Select';


export class Pagamento extends Component {
    state = {
        tipos: [
            { label: 'Parcela única       ', value: 0 },
            { label: 'Parcelado', value: 1 }
        ],
        formas:[],
        tipo_selecionado: 0,
        currentPedido: {
            tipo_forma_pagamento:0,
            forma_pagamento:null,
            usuario: {},
            cliente: {},
            representante: {}
        },
        exibeRadio:true,

    };
    idCliente120dias = 1268;




    async componentDidMount() {
 
       let value = await  AsyncStorage.getItem("@OTIMA.currentPedido");

    //    await  AsyncStorage.getItem("@OTIMA.currentPedido").then( async (value) => {
            let curPed = JSON.parse(value);            
            
            await this.setState({ currentPedido: curPed,tipo_selecionado:curPed.tipo_forma_pagamento });

        // }).done();

        if(this.state.currentPedido.cliente.id==this.idCliente120dias){
            console.log(this.state.currentPedido.cliente.id);
            console.log(this.state.currentPedido.cliente.fantasia);
            let repArray = [];
            const item = {
                key:30,
                label:'120 dias',
                media_id: 1,
                minimo: 750,
                parcelado: 0,
                parcelas: 1,
            };
            repArray.push(item);
            this.setState({ formas: repArray,exibeRadio:false });
        }else{
            await this.getFormas();
        }



        // await this.getRepresentantes();
        // await this.getUfs();


    }


    getFormas = async () => {
        //1268 zodio
        let db = getInstance();
        const tipo_selecionado = (this.state.tipo_selecionado ? this.state.tipo_selecionado : 0);
        let query = `SELECT id,media_id,minimo,titulo,parcelado,parcelas FROM otm_pagamentos WHERE parcelado = ${tipo_selecionado} order by parcelado,titulo`;
        db.transaction((tx) => {
            tx.executeSql(query, [], (tx, results) => {
                let qtde = results.rows.length;
                if (qtde > 0) {
                    let repArray = [];
                    for (let x = 0; x < qtde; x++) {
                        let item = results.rows.item(x);
                        item.key = item.id;
                        item.label = item.titulo;

                        repArray.push(item);
                        if(x==0){
                            console.log(JSON.stringify(this.state.currentPedido.forma_pagamento));
                            console.log(JSON.stringify(this.state.tipo_selecionado));
                            if(!this.state.currentPedido.forma_pagamento ){
                                console.log('#####');
                                console.log(item);
                                this._formaChanged(item);
                                this.refs.formas.updateLabel(item.titulo);
                            }else{
                                this._setaDados();
                            }
                        }

                    }
                    this.setState({ formas: repArray });
                } else { 
                    alert('Erri!');
                }



            }, DbError);
        }, DbError); 
    }

    _setaDados = () => {
        this.refs.formas.updateLabel(this.state.currentPedido.forma_pagamento.titulo);
        
    }
    _submit = async  () => { 
        if(!this.state.currentPedido.forma_pagamento){
            let curPed = { ...this.state.currentPedido };
            curPed.forma_pagamento = this.state.formas[0];
            await this.setState({ currentPedido: curPed });
        }
        if(!this.state.currentPedido.forma_pagamento){
            Alert.alert(
                'Atenção',
                'Selecione uma forma de pagamento!',
                [
                  
                  {text: 'Ok', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                  
                ],
                { cancelable: true }
              )
        }else{

            AsyncStorage.setItem("@OTIMA.currentPedido",JSON.stringify(this.state.currentPedido));
            
            salvaOrcamento(this.state.currentPedido);
            
            Actions.prazoembarque();
        }
    }
    _tipoChanged = async (tipo_selecionado) => {
        let curPed = { ...this.state.currentPedido };
        curPed.forma_pagamento = null;
        curPed.tipo_forma_pagamento = tipo_selecionado;
        await this.setState({ tipo_selecionado,forma_pagamento:{}, currentPedido: curPed  });
        this.refs.formas.updateLabel("Selecione");
        this.getFormas();
        
    }
    _recalculaPrecos = async (forma) => {
        let db = getInstance();
        
        let curPed = { ...this.state.currentPedido };
        


        const media_id = (curPed.forma_pagamento.media_id ? curPed.forma_pagamento.media_id : 1);

        let produtos = [];

        await db.transaction(async (tx) => {


            for (let i = 0; i < curPed.produtos.length; i++) {
                if(curPed.produtos[i].item){

                
                let query = `SELECT a.id,a.produto_id,a.titulo,a.embalagem,a.importado,a.referencia,a.ipi, b.preco, c.reajuste, a.importado, d.multiplicador_nacional, d.multiplicador_importado
                FROM otm_formatos a, 
                otm_precos b,
                otm_produtos c,
                otm_ufs d
                WHERE a.id = ${curPed.produtos[i].item.id} 
                    AND b.formato_id = a.id 
                    AND b.media_id = ${media_id} 
                    AND c.id = a.produto_id 
                    AND d.id = ${curPed.cliente.uf_id} 
                    
                ORDER BY a.order_id, a.titulo,a.id`;
                
                
                let itemUpdated = curPed.produtos[i].item;
                console.log("itemUpdated--------------");
                console.log(curPed.produtos[i].item);

                await tx.executeSql(query, [], async (tx_, results) => {
                    let qtde = results.rows.length;
                    let item = results.rows.item(0);
                    if(item){

                    
                        console.log("ITEM--------------");
                        console.log(item);
                        
                        item.multiplicador = this.state.currentPedido.cliente.multiplicador;

                        console.log(item.multiplicador);
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
                        // console.log("preco antes: "+curPed.produtos[i].item.unitario+" preco depois: "+unitario);
                        curPed.produtos[i].item.unitario = unitario;
                        // console.log("preco DEPOIS: "+curPed.produtos[i].item.unitario);
                        // produtos.push(curPed.produtos[i].item);
                    }

                }, DbError); 
            }
            
 

            



            }
        }, DbError);
        

        setTimeout(()=>{ 
            // curPed.produtos = produtos;
            console.log(curPed.produtos); 
             this.setState({ currentPedido: curPed });
            
        },1000); 
            
        
        
    }
    _formaChanged = async (forma) => {
        let curPed = { ...this.state.currentPedido };
        curPed.forma_pagamento = forma;


        await this.setState({ currentPedido: curPed });
        console.log(this.state.currentPedido);

        if (curPed.produtos && curPed.produtos.length > 0) {
            this._recalculaPrecos();            
        }



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
                        <View style={styles.breadcrumItem}>
                            <View style={styles.breadcrumbBullet}>
                                <Text style={styles.txtBullet}>2</Text>
                            </View>
                            <Text style={styles.breadcrumbText}>Pagamento</Text>
                        </View>
                        <View style={styles.breadcrumItem}>
                            <View style={[styles.breadcrumbBullet, styles.bulletDisabled]}>
                                <Text style={[styles.txtBullet, styles.txtDisabled]}>3</Text>
                            </View>
                            <Text style={[styles.breadcrumbText, styles.txtDisabled]}>Prazo de embarque</Text>
                        </View>
                        <View style={styles.breadcrumItem}>
                            <View style={[styles.breadcrumbBullet, styles.bulletDisabled]}>
                                <Text style={[styles.txtBullet, styles.txtDisabled]}>4</Text>
                            </View>
                            <Text style={[styles.breadcrumbText, styles.txtDisabled]}>Produto</Text>
                        </View>
                        <View style={styles.breadcrumItem}>
                            <View style={[styles.breadcrumbBullet, styles.bulletDisabled]}>
                                <Text style={[styles.txtBullet, styles.txtDisabled]}>5</Text>
                            </View>
                            <Text style={[styles.breadcrumbText, styles.txtDisabled]}>Pedido</Text>
                        </View>

                    </View>
                </View>

                <ScrollView contentContainerStyle={styles.fieldList}>
                    <View style={styles.row}>
                        <Text style={styles.h1}>Forma de pagamento</Text>
                        <TouchableOpacity style={styles.btnCancelar} onPress={() => {Actions.listagem({refresh: {refresh:Math.random()}} )  }}>
                            <Text style={[styles.textRed, styles.textBold]}>Cancelar Pedido</Text>
                        </TouchableOpacity>
                    </View>
                    {this.state.exibeRadio && (
                    <View style={styles.rowForm}>
                        <Text style={styles.h2}>Tipo</Text>
                    </View>
                    )} 
                    {this.state.exibeRadio && (
                    <View style={styles.rowForm}>
                        <RadioForm
                        radio_props={this.state.tipos}
                        initial={this.state.tipo_selecionado}
                        formHorizontal={true}
                        labelHorizontal={true}

                        animation={true}
                        onPress={this._tipoChanged}
                    />
                    </View>
                    )}
                        
                    <View style={styles.rowForm}>
                        <Select labelText="Opções *"  onChange={this._formaChanged} items={this.state.formas} ref="formas" ></Select>
                    </View>
            
                    <View style={[styles.rowForm, styles.endFlex]}>
                        <TouchableOpacity style={styles.submitButton}  onPress={this._submit} >
                            <Text style={styles.buttonText} >Próximo passo</Text>
                        </TouchableOpacity>
                    </View>

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


export default connect(mapStateToProps, null)(Pagamento);