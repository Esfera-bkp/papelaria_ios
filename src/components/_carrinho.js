import React, { Component } from 'react';

import { View, Text, TouchableOpacity, Image, StyleSheet, Modal, ScrollView,Alert } from 'react-native';

import { Actions } from 'react-native-router-flux';

import { number_format } from '../classes/Funcoes';
// import styles from '../Styles';

import ItemCarrinho from './_itemCarrinho';

export default class Carrinho extends Component {
    state = {
        pedido :{},
        modalVisible: false,
        podeEnviar : false,
        txtTotal : '00,00',
        strMinimo : "Você deve comprar no mínimo R$"
        
    };
    

    // pedido = {};

    componentWillReceiveProps(){
        this._somaTotal(this.props.pedido)
    }
    componentDidMount() {
         this._somaTotal(this.props.pedido);

    }
     updateCarrinho() {
        this._somaTotal(this.props.pedido);

    }
    



    _openCart = () => {
        this.setState({ modalVisible: true });
    }
    _closeCart = () => {
        this.setState({ modalVisible: false });
    }
    _somaTotal = async (pedido) => {
        console.log(pedido)
        let total = 0;
        let txtTotal="00,00";
        if (pedido.produtos && pedido.produtos.length > 0) {

            for (let i = 0; i < pedido.produtos.length; i++) {
                if(pedido.produtos[i].item)
                total += pedido.produtos[i].item.unitario *pedido.produtos[i].qtde ;
            }
            txtTotal = number_format(total, 2, ',', '.');
        }

        console.log('pedido.forma_pagamento.minimo');
        let minimo = 751;
        if(pedido.forma_pagamento){
            minimo = pedido.forma_pagamento.minimo;
        }
        let podeEnviar = false;
        if(total >= minimo){
            podeEnviar = true;
        }
        let strMinimo="Você deve comprar no mínimo R$ "+number_format(minimo, 2, ',', '.');

        

       await this.setState({pedido,podeEnviar,strMinimo,txtTotal});

        
    }

    _saveItem = (prd) =>{
        console.log(prd);
        for (let i = 0; i < this.state.pedido.produtos.length; i++) {
            if(prd.cor.id == this.state.pedido.produtos[i].cor.id){
                this.state.pedido.produtos[i] = prd;
            }
        }
        this.props.savePedido(this.state.pedido);
    }
    _removeItem = async (prd) =>{
        console.log(prd);
        for (let i = 0; i < this.state.pedido.produtos.length; i++) {
            if(prd.cor.id == this.state.pedido.produtos[i].cor.id){
                this.state.pedido.produtos.splice(i,1);
            }
        }
        await this.props.savePedido(this.state.pedido);
        this._somaTotal(this.state.pedido);
    }
    _finalizar = () => {
        if(this.state.podeEnviar){
            this.setState({ modalVisible: false });
            Actions.pedido();
        }else{
            Alert.alert(
                'Atenção',
                this.state.strMinimo,
                [
                  
                  {text: 'Ok', onPress: () => {console.log('Cancel Pressed');this.setState({ modalVisible: false });}, style: 'cancel'},
                  
                ],
                { cancelable: true }
              )
        }
    }
    render() {
        // this._somaTotal(this.props.pedido);

        const {pedido,podeEnviar,strMinimo,txtTotal} = this.state;
        // this.state.pedido = this.props.pedido;
        // this._somaTotal();




        return (
            <View style={styles.container} >

                <TouchableOpacity style={[styles.btnCart, { backgroundColor: (pedido.produtos && pedido.produtos.length > 0) ? '#39B54A' : '#C5D0DE' }]} onPress={this._openCart} >
                    <Image source={require('../images/icons/cart.png')} style={{ width: 14, height: 14 }} />
                    <View style={[styles.counter, { opacity: (pedido.produtos && pedido.produtos.length > 0) ? 1 : 0 }]} >
                        <Text style={styles.counterTxt} >{(pedido.produtos && pedido.produtos.length > 0) ? pedido.produtos.length : '0'}</Text>
                    </View>
                </TouchableOpacity>
                <Modal animationType="fade" transparent={true} visible={this.state.modalVisible} >
                    <View style={styles.overlay} >
                                <TouchableOpacity style={[styles.clickOutside]} onPress={this._closeCart} >
                                
                                </TouchableOpacity>
                        <View style={styles.cartView}>
                            <View style={styles.cartHeader}>
                                <Text style={styles.title}>Carrinho de compras</Text>
                                <TouchableOpacity style={[styles.btnClose]} onPress={this._closeCart} >

                                    <Image source={require('../images/icons/close.png')} style={{ width: 16, height: 15 }} />
                                </TouchableOpacity>
                            </View>
                            <ScrollView contentContainerStyle={styles.cartList} >
                                {
                                    (pedido.produtos && pedido.produtos.length > 0) ?

                                        pedido.produtos.map((el, i) => {
                                            
                                            return (

                                                <ItemCarrinho saveItem={this._saveItem.bind(this)}  removeItem={this._removeItem.bind(this)}  key={i} obj={el} pedido={pedido} />
                                                
                                            );
                                        })
                                        :
                                        <Text style={{padding:20}}></Text>
                                        
                                    }
                                    {!podeEnviar && 
                                    <View style={styles.boxAlert}>
                                        <Text style={styles.boxAlertText}>{strMinimo}</Text>
                                    </View>
                                    }




                            </ScrollView>
                            <View style={styles.cartFooter}>
                                <Text style={styles.label}>Total do pedido</Text>
                                <Text style={styles.total}>R$ {txtTotal}</Text>

                                <TouchableOpacity style={[styles.btnFinalizar]} onPress={this._finalizar} >
                                    <Text style={styles.txtBtnFinalizar}>Finalizar Pedido</Text>


                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                </Modal>
            </View>
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
    clickOutside:{
        position:'absolute',
        left:0,
        top:0,
        maxWidth: '99%',
        minWidth: '99%',
        height:'100%',
        minHeight:'100%',
        backgroundColor: 'transparent',
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
    cartList: {
        // flex: 1,
        // backgroundColor: '#ccc'
        minHeight:'100%',
        
    },
    
    itemListCarrinho:{
        maxHeight:100,
        flex:1,
        backgroundColor: '#fff',
        // justifyContent:'center',
        alignItems:'center',

    },
    title: {
        color: '#354052',
        fontSize: 26,
        fontWeight: 'bold',
    },
    label: {
        color: '#7F8FA4',
        fontSize: 12,

    },
    total: {
        color: '#2EA2F8',
        fontSize: 20,

    },
    btnFinalizar:{
        position:'absolute',
        right:20,
        top:20,

        height: 46,
        flexDirection:'row',
        backgroundColor: '#39B54A',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        paddingHorizontal: 20,
    },
    txtBtnFinalizar:{
        color:'#fff',
        fontSize:18,
        fontWeight:'bold'
    },
    boxAlert:{
        backgroundColor:'#f8d7da',
        borderRadius:4,
        borderColor:'#f5c6cb',
        borderWidth:1,
        padding:20,
        margin:20,
        alignItems:'center',
        justifyContent:'center',
    }
    ,boxAlertText:{
        color:'#721c24',
        fontSize:18,
    }
   


});


