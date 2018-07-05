import React, { Component } from 'react';



import { connect } from 'react-redux';

import { View, StyleSheet, Text, Image, TouchableOpacity,Alert } from 'react-native';
import { number_format } from '../classes/Funcoes';

import RNFS from 'react-native-fs';


export class ItemCarrinho extends Component {
    state = {
        
    };

    txtUnitario = "";
    txtTotalUnitario = "";
    txtIpi = "";
    txtTotal = "";
    prd = {};
    componentDidMount = () => {
        // this.styles.buttonContainer.width = 900;
        // console.log('componentWillMount' + this.props.isSelected);
        // this.setState({ isSelected: this.props.isSelected });
        // setTimeout(()=>{this.render();   },3000);

    }


    _removeItem = () => {
        
      
        Alert.alert(
            'Atenção',
            'Deseja remover este item do carrinho?',
            [
              
              {text: 'Não', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
              {text: 'Sim', onPress: () => {this.props.removeItem(this.prd)}},
            ],
            { cancelable: true }
          )
    }
    _increment = () => {
        
        this.prd.qtde = this.prd.qtde + this.prd.item.embalagem;
        
        this.props.saveItem(this.prd);
    }
    _decrement = () => {
        if (this.prd.qtde > this.prd.item.embalagem) {
            this.prd.qtde = this.prd.qtde - this.prd.item.embalagem;

            this.props.saveItem(this.prd);
        }

    }

    render() {

        let  dirs = RNFS.DocumentDirectoryPath;
        this.prd = this.props.obj;

        this.txtTotalUnitario = number_format(parseFloat(this.prd.item.unitario * this.prd.qtde), 2, ',', '.');
        if (parseFloat(this.prd.item.ipi) > 0) {
            this.txtIpi = `+ ${this.prd.item.ipi}% de IPI`;
        }

        return (

            <View style={styles.itemListCarrinho}>
                <TouchableOpacity style={[styles.btnRemove]} onPress={this._removeItem}  >
                    <Image source={require('../images/icons/remove.png')} style={{ width: 8, height: 8 }} />
                </TouchableOpacity>
                <View style={styles.imageContainer}>
                    <Image style={styles.itemProductImage} source={{ uri: dirs+"/cores/"+this.prd.cor.image }} resizeMode="contain" />
                </View>
                <View style={styles.dadosContainer}>
                    <Text style={styles.dadosTitulo} >{this.prd.item.titulo} - {this.prd.cor.titulo}</Text>
                    <View style={styles.dadosBottomContainer}>
                        <View style={styles.dadosBottomItem}>
                            <Text style={styles.dadosLabel} >Preço unitário</Text>
                            <Text style={styles.dadosUnitario} >R$ {number_format(this.prd.item.unitario, 2, ',', '.')}</Text>
                        </View>
                        <View style={[styles.dadosBottomItem,{width:110}]}>
                            <Text style={styles.dadosLabel} >Qtd</Text>
                            <View style={[styles.stepperContainer]} >
                                <TouchableOpacity style={[styles.stepperButtonContainer, { borderRightWidth: 1, borderRightColor: '#E4E4E5' }]} onPress={this._decrement} >
                                    <Image source={require('../images/icons/qty_minus.png')} style={{ width: 12, height: 2 }} />
                                </TouchableOpacity>
                                <Text style={styles.sttepperButtonValue} >{this.prd.qtde}</Text>
                                <TouchableOpacity style={[styles.stepperButtonContainer, { borderLeftWidth: 1, borderLeftColor: '#E4E4E5' }]} onPress={this._increment} >
                                    <Image source={require('../images/icons/qty_plus.png')} style={{ width: 11, height: 11 }} />

                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.dadosBottomItem}>
                            <Text style={styles.dadosLabel} >Total</Text>
                            <Text style={styles.dadosTotal} >R$ {this.txtTotalUnitario}</Text>
                            <Text style={styles.dadosIpi} >{this.txtIpi}</Text>
                        </View>
                    </View>
                </View>




            </View>
        );

    }







}

const styles = StyleSheet.create({


    itemListCarrinho: {
        borderBottomWidth: 1,
        padding: 20,
        flexDirection: 'row',
        borderBottomColor: '#E5E5E5',
    },
    imageContainer: {
        width: 100,
        height: 90,
        marginHorizontal: 10,

    },
    itemProductImage: {
        width: 100,
        height: 90,
    },
    btnRemove: {
        backgroundColor: '#ED1C24',
        borderRadius: 2,
        height: 36,
        width: 36,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center'
    },
    dadosTitulo: {
        color: '#354052',
        fontSize: 18,
    },
    dadosContainer:{
        flex:1,
        justifyContent:'space-between',
    },
    dadosBottomContainer: {
        flexDirection: 'row',
        justifyContent:'space-between',
        
    },
    dadosBottomItem:{
        // backgroundColor:'rgba(0,0,0,.1)',
        justifyContent:'flex-start',
    },
    dadosLabel:{
        fontSize:12,
        color:'#7F8FA4'
    },
    dadosUnitario:{
        fontSize:20,
        color:'#354052'
    },
    dadosTotal:{
        fontSize:20,
        fontWeight:'bold',
        color:'#2EA2F8'
    },
    dadosIpi:{
        fontSize:14,
        
        color:'rgba(46,162,248,.7)'
    },

    stepperContainer:{
        flexDirection:'row',
        backgroundColor:'#fff',
        flex:1,
        borderRadius:4,
        height:36,
        borderWidth:1,
        borderColor:'#E4E4E5',
    },
    sttepperButtonValue:{
        lineHeight:36,
        color:'#2EA2F8',
        minWidth:36,
        fontSize:14,
        flex:1,
        // backgroundColor:'#E4E4E5',
        textAlign:'center',
        borderRightWidth:2,
        borderRightColor: '#E4E4E5',        
    },
    stepperButtonContainer:{
        width:36,
        height:36,
        alignItems:'center',
        justifyContent:'center',                
    },

});



const mapStateToProps = state => (
    {
        UrlServer: state.GlobalReducer.UrlServer,
        Versao: state.GlobalReducer.Versao,
        VersaoData: state.GlobalReducer.VersaoData,
    }
);


export default connect(mapStateToProps, null)(ItemCarrinho);