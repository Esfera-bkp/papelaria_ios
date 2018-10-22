import React, { Component } from 'react';

import { View, Text, TouchableOpacity, Image, StyleSheet, Modal, Alert, ActivityIndicator } from 'react-native';

import { Actions } from 'react-native-router-flux';

import { getInstance, DbError } from '../classes/DbManager';
// import styles from '../Styles';


import TextField from './inputs/TextField';
export default class ModalCatalogo extends Component {
    state = {
        isLoading: false,
        email: "",
        nome: "",

    };




    async componentDidMount() {

    }



    _consultar = async () => {
        if (this.state.email != '' && this.state.nome != '') {
            if (!this.state.isLoading) {
                this.setState({ isLoading: true });


                let url = `${this.props.urlServidor}app/sendCatalogo-json.php`;
                console.log(url);
                const pingCall = await fetch(url, {
                    method: 'post',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ nome: this.state.nome,email: this.state.email })
                });
                

                const retJson = await pingCall.json();
                console.log(retJson);
                this.setState({ isLoading: false,email:'',nome:'' });
                

                Alert.alert(
                    'Atenção', 
                    'Catálogo enviado com sucesso!',
                    [
    
                        { text: 'Ok', onPress: () => {console.log('cancelar');this.props.closeModal();}, style: 'cancel' },
    
                    ],
                    { cancelable: true }
                )

            }
        } else {
            Alert.alert(
                'Atenção',
                'Preencha o nome e o email!',
                [

                    { text: 'Ok', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },

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
                            <Text style={styles.title}>Enviar catálogo</Text>
                            <TouchableOpacity style={[styles.btnClose]} onPress={this.props.closeModal} >

                                <Image source={require('../images/icons/close.png')} style={{ width: 16, height: 15 }} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.modalBody}>
                            <View style={styles.rowForm}>
                                <TextField labelText="Nome" placeholder="Nome" col="12" onChange={(nome) => { this.setState({ nome }) }} value={this.state.nome}  ></TextField>
                            </View>
                            <View style={styles.rowForm}>
                                <TextField labelText="Email" onSubmitEditing={this.txtBtnFinalizar} placeholder="Email" col="12" onChange={(email) => { this.setState({ email }) }} value={this.state.email}  ></TextField>
                            </View>
                            <TouchableOpacity style={[styles.btnFinalizar, { width: 100, alignSelf: 'flex-end' }]} onPress={this._consultar} >

                                {!this.state.isLoading && (
                                    <Text style={styles.txtBtnFinalizar}>Enviar</Text>
                                )}

                                {this.state.isLoading && (
                                    <ActivityIndicator

                                        color="#fff"

                                    />
                                )}


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
    modalBody: {

        flex: 1,
        padding: 20,
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
        minHeight: 90,

    },



});


