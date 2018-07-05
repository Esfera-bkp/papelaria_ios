import React, { Component } from 'react';

import { View, Text, TouchableOpacity, Image, StyleSheet, Modal, AsyncStorage,Alert } from 'react-native';

import { Actions } from 'react-native-router-flux';

import { getInstance, DbError } from '../classes/DbManager';
// import styles from '../Styles';

import Select from './inputs/Select';

export default class ModalConsulta extends Component {
    state = {
        ufs: [],
        formas:[],
        uf_id:0,
        forma_id:0,
        currentPedido:{
            cliente:{},
            forma_pagamento:{},
        },
    };




    async componentDidMount() {

        this.getUfs();
        this.getFormas();
    }


    getUfs = async () => {
        let db = getInstance();
        let query = "SELECT id, short FROM otm_ufs order by name,short";
        db.transaction((tx) => {
            tx.executeSql(query, [], (tx, results) => {
                let qtde = results.rows.length;
                if (qtde > 0) {
                    let repArray = [];
                    for (let x = 0; x < qtde; x++) {
                        let item = results.rows.item(x);
                        item.key = item.id;
                        item.label = item.short; 

                        repArray.push(item);

                    }
                    this.setState({ ufs: repArray });
                } else {
                 
                }



            }, DbError);
        }, DbError);
    }
    getFormas = async () => {
        let db = getInstance();
        let query = `SELECT id,media_id,minimo,titulo,parcelado,parcelas FROM otm_pagamentos  order by parcelado,titulo`;
        
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
                            // console.log(JSON.stringify(this.state.currentPedido.tipo_forma_pagamento));
                            if(!this.state.currentPedido.forma_pagamento ){
                                this._formaChangedConstulta(item);
                                this.refs.formas_consulta.updateLabel(item.titulo);
                            }else{
                                // this._setaDados();
                            }
                        }

                    }
                    
                    this.setState({ formas: repArray });
                } else { 
                    console.log("ERRO get Formas");
                    
                }



            }, DbError);
        }, DbError); 
    }

    _formaChangedConstulta = (forma) => {
        let curPed = { ...this.state.currentPedido };
        curPed.forma_pagamento = forma;
        this.setState({ currentPedido: curPed });



    }

    _ufChangedConsulta = (uf) => {
        
        let curPed = { ...this.state.currentPedido };
        curPed.uf_id = uf.id;
        curPed.cliente.uf_id = uf.id;
        this.setState({ currentPedido: curPed });        
    }
    _consultar = () => {
        if(this.state.currentPedido.cliente.uf_id && this.state.currentPedido.forma_pagamento){
            AsyncStorage.setItem("@OTIMA.currentPedido",JSON.stringify(this.state.currentPedido));
            AsyncStorage.setItem("@OTIMA.somenteConsulta","1");
            this.props.closeModal();
            Actions.produtos();
        }else{
            Alert.alert(
                'Atenção',
                'Selecione um Estado de destino e a forma de pagamento',
                [
                  
                  {text: 'Ok', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                 
                ],
                { cancelable: true }
              )
        }
    }
    render() {




        return (

            <Modal animationType="fade" transparent={true} visible={this.props.visible} >
                <View style={styles.overlay}>
                    <View style={styles.cartView}>
                        <View style={styles.cartHeader}>
                            <Text style={styles.title}>Consulta de preços</Text>
                            <TouchableOpacity style={[styles.btnClose]} onPress={this.props.closeModal} >

                                <Image source={require('../images/icons/close.png')} style={{ width: 16, height: 15 }} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.modalBody}>
                            <View style={styles.rowForm}>
                                <Select labelText="Estado" col="12" onChange={this._ufChangedConsulta} items={this.state.ufs} ref="uf" ></Select>
                            </View>
                            <View style={styles.rowForm}>
                                <Select labelText="Forma de pagamento" col="12" onChange={this._formaChangedConstulta} items={this.state.formas} ref="formas_consulta" ></Select>
                            </View>
                            <TouchableOpacity style={[styles.btnFinalizar,{width:150,alignSelf:'flex-end'}]} onPress={this._consultar} >
                                <Text style={styles.txtBtnFinalizar}>Consultar</Text>


                            </TouchableOpacity>
                        </View>
                        
                    </View>
                </View>

            </Modal>

        )
    }





}


const styles = StyleSheet.create({

    btnCart: {

        backgroundColor: '#C5D0DE',
        borderRadius: 2,
        // flex:1,
        width: 36,
        height: 36,


        position: 'absolute',
        right: 0,
        top: -20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnClose: {

        // backgroundColor: '#f00',
        borderRadius: 2,
        // flex:1,
        width: 36,
        height: 36,


        position: 'absolute',
        right: 10,
        top: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    counter: {
        backgroundColor: '#FF6719',
        position: 'absolute',
        right: -10,
        top: -10,
        width: 20,
        height: 20,
        borderRadius: 20,
    },
    counterTxt: {
        color: '#fff',
        height: 20,
        lineHeight: 20,
        width: 20,
        textAlign: 'center',
        fontSize: 12,

    },

    overlay: {
        backgroundColor: 'rgba(0,0,0,.6)',
        flex: 1,
    },
    cartView: {
        flex: 1,
        maxWidth: '55%',
        minWidth: '55%',
        backgroundColor: '#fff',
        alignSelf: 'flex-end',
        // paddingTop:20,
    },
    cartHeader: {
        padding: 20,
    },
    cartFooter: {
        padding: 20,
        backgroundColor: '#F6F6F6'
    },
    

    
    title: {
        color: '#354052',
        fontSize: 26,
        fontWeight: 'bold',
    },
  
    btnFinalizar: {
        // position: 'absolute',
        // right: 20,
        // top: 20,

        height: 46,
        flexDirection: 'row',
        backgroundColor: '#1991EB',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        paddingHorizontal: 20,
    },
    txtBtnFinalizar: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold'
    },
    modalBody:{

        flex: 1,
        padding:20,
        // maxHeight:300,
        // flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    rowForm: {
        
        
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingBottom: 20, 
        // backgroundColor:'#f00', 
        // backgroundColor:'#ccc',
        minHeight:90,
        
    },



});


