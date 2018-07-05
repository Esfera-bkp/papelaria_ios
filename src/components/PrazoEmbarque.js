import React, { Component } from 'react';

import { View, ScrollView, Text, TouchableOpacity, AsyncStorage,Image } from 'react-native';

import { connect } from 'react-redux';

import { Actions } from 'react-native-router-flux';

import { getInstance, DbError } from '../classes/DbManager';



import styles from '../Styles'

import Select from './inputs/Select';
import MaskedField from './inputs/MaskedField'; 

export class PrazoEmbarque extends Component {
    state = {
        
        prazos:[],
        tipo_selecionado: 0,
        currentPedido: {
            usuario: {},
            cliente: {},
            representante: {},
            data_embarque:"",
            prazo_embarque:{},
        },

    };





    async componentDidMount() {

        AsyncStorage.getItem("@OTIMA.currentPedido").then(async (value) => {
            let curPed = JSON.parse(value);            
            console.log(curPed);
            await this.setState({ currentPedido: curPed });

            
            await this.getPrazos();
            if(curPed.prazo_embarque){
                this.refs.prazos.updateLabel(curPed.prazo_embarque.titulo)
            }
        }).done();



        // await this.getRepresentantes();
        // await this.getUfs();


    }


    getPrazos = async () => {
        let db = getInstance();
        let query = "SELECT id,titulo,dias FROM otm_embarques order by id,titulo";
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

                            if(this.state.currentPedido.prazo_embarque == null ){
                                this._prazoChanged(item);
                                this.refs.prazos.updateLabel(item.titulo);
                            }else{
                                this._setaDados();
                            }

                            this._prazoChanged(item);
                        }
                    }
                    this.setState({ prazos: repArray });
                } else {
                    alert('Erri!');
                }



            }, DbError);
        }, DbError);
    }
    _setaDados = () => {
        this.refs.prazos.updateLabel(this.state.currentPedido.prazo_embarque.titulo);
        
    }
    _submit = () => {
        AsyncStorage.setItem("@OTIMA.currentPedido",JSON.stringify(this.state.currentPedido));
        Actions.produtos();
    }

   
    _prazoChanged = async (prazo_embarque) => {
        let curPed = { ...this.state.currentPedido };
        curPed.prazo_embarque = prazo_embarque;
        await this.setState({ currentPedido: curPed });

        this.refs.prazos.updateLabel(prazo_embarque.titulo);
        this._calculaData();


    }
    _calculaData = async () => {
        const obj =  this.state.currentPedido.prazo_embarque;
        var dias =  parseInt(obj.dias); 
        var now = new Date();
        // console.log(dias);
        // console.log(now);
         
        now.setDate(now.getDate()+dias);
        // alert(now); 
        var dat=now.getDate() < 10 ? '0'+now.getDate() : now.getDate();
        var mon=(now.getMonth()+1) < 10 ? '0'+(now.getMonth()+1) : (now.getMonth()+1);
        var year=now.getFullYear();
        var data = dat+"/"+mon+"/"+year;
    
        // $('#data').val(data);
        // console.log(data);

        let curPed = { ...this.state.currentPedido };
        curPed.data_embarque = data;
        await this.setState({ currentPedido: curPed });
        

       }

       _setaTexto = (txt, campo) => {
        console.log(this.state.currentPedido);

        let curPed = { ...this.state.currentPedido };

        switch (campo) {                        
            case 'data_embarque': curPed.data_embarque = txt; break;
            
        }


        this.setState({ currentPedido: curPed });

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
                        <View style={styles.breadcrumItem}>
                            <View style={styles.breadcrumbBullet}>
                                <Text style={styles.txtBullet}>3</Text>
                            </View>
                            <Text style={styles.breadcrumbText}>Prazo de embarque</Text>
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
                        <Text style={styles.h1}>Prazo de embarque</Text>
                        <TouchableOpacity style={styles.btnCancelar} onPress={() => { Actions.listagem() }}>
                            <Text style={[styles.textRed, styles.textBold]}>Cancelar Pedido</Text>
                        </TouchableOpacity>
                    </View>
                    
                    <View style={styles.rowForm}>
                        <Select labelText="Opções *"  onChange={this._prazoChanged} items={this.state.prazos} ref="prazos" ></Select>
                    </View>
                    <View style={styles.rowForm}> 
                        <MaskedField labelText="Data *" placeholder="" col="12" type={'datetime'}  options={{format: 'DD/MM/YYYY'}} onChange={(txt) => { this._setaTexto(txt, 'data_embarque') }} value={this.state.currentPedido.data_embarque}  ></MaskedField>
                    </View>
            
                    <View style={[styles.rowForm, styles.endFlex]}>
                        <TouchableOpacity style={styles.submitButton} onPress={this._submit} >
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


export default connect(mapStateToProps, null)(PrazoEmbarque);