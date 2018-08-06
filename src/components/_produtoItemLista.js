import React, { Component } from 'react';

import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';

import { connect } from 'react-redux';

import styles from '../Styles';
import { number_format } from '../classes/Funcoes';
import ColorSelector from './inputs/ColorSelector';

import RNFS from 'react-native-fs';

export class ProdutoItemLista extends Component {
    state = {


        barras: "",
        txtPreco: "",
        imagePath: "-",
        qtde: 1,
        step: 1,
        colorSelected: {},
    };



    unitario = 0;
    async componentDidMount() {

        // this.imagePath = this.props.urlServidor+"uploads/cores/"+this.props.item.cores[0].image;
        let percIPI = "";
        if (parseFloat(this.props.item.ipi) > 0) {
            percIPI = ` ${this.props.item.ipi}% de`;
        }
        let dirs = RNFS.DocumentDirectoryPath;
        this.setState({
            barras: (this.props.item.cores[0] ? this.props.item.cores[0].barras : ''),
            qtde: this.props.item.embalagem,
            step: this.props.item.embalagem,
            colorSelected: (this.props.item.cores[0] ? this.props.item.cores[0] : {}),
            // imagePath: this.props.urlServidor + "uploads/cores/" + this.props.item.cores[0].image,
            imagePath:  (this.props.item.cores[0] ? dirs+"/cores/" + this.props.item.cores[0].image : 'https://dummyimage.com/300/eee/ccc.png&text='+this.props.item.titulo),
            txtPreco: `${number_format(this.props.item.unitario, 2, ',', '.')} +${percIPI} IPI`,
        });
    }




    _addCart = () => {
        console.log('add to carr');
        const obj = {
            item : this.props.item,
            cor: this.state.colorSelected,
            qtde : this.state.qtde,
        };
        this.props.addItemToCart(obj);
    }

    _colorSelected = (cor) => {
        let dirs = RNFS.DocumentDirectoryPath;
        this.setState({ colorSelected: cor,barras:cor.barras,imagePath:dirs+"/cores/" + cor.image });
        // this.setState({ colorSelected: cor,barras:cor.barras,imagePath:this.props.urlServidor + "uploads/cores/" + cor.image });

    }
    _increment = () => {
        this.setState({ qtde: this.state.qtde + this.state.step });
    }
    _decrement = () => {
        if (this.state.qtde > this.state.step) {
            this.setState({ qtde: this.state.qtde - this.state.step });
        }
    }

    render() {

        return (
            <View style={[styles.boxItemProduct, styles.card]} >

                <View style={styles.cardImageContainer} >
                    <View style={styles.cardImageBox} >
                        <Image style={styles.itemProductImage}  source={{ uri: this.state.imagePath }} resizeMode="contain" />
                    </View>
                </View>
                <View style={[styles.cardbody]} >

                    <View style={[styles.cardbodyHeader]} >
                        <Text style={styles.plTitle} >{this.props.item.titulo}</Text>
                        <Text style={styles.plDescricao} >{this.props.item.referencia}</Text>
                    </View>
                    <View style={[styles.cardbodyFooter]} >
                        <Text style={styles.plLabel} >Preço unitário</Text>
                        <Text style={styles.plPreco} >R$ {this.state.txtPreco}</Text>
                        <Text style={styles.plBarras} >Cod: {this.state.barras}</Text>
                    </View>
                </View>
                <View style={[styles.cardfooter]} >
                    <View style={[styles.cardFooterRow]} >
                        <Text style={styles.plLabelFooter} >Qtde:</Text>
                        <View style={[styles.stepperContainer]} >
                            <TouchableOpacity style={[styles.stepperButtonContainer, { borderRightWidth: 1, borderRightColor: '#E4E4E5' }]} onPress={this._decrement} >
                                <Image source={require('../images/icons/qty_minus.png')} style={{ width: 12, height: 2 }} />
                            </TouchableOpacity>
                            <Text style={styles.sttepperButtonValue} >{this.state.qtde}</Text>
                            <TouchableOpacity style={[styles.stepperButtonContainer, { borderLeftWidth: 1, borderLeftColor: '#E4E4E5' }]} onPress={this._increment} >
                                <Image source={require('../images/icons/qty_plus.png')} style={{ width: 11, height: 11 }} />

                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={[styles.cardFooterRow]} >
                        <Text style={styles.plLabelFooter} >Cor:</Text>
                        <ScrollView contentContainerStyle={styles.colorSelectorContainer} horizontal alwaysBounceVertical={false}>

                            {

                                this.props.item.cores.map((el, i) => {
                                    // console.log(this.state.colorSelected+"=="+el.id);
                                    
                                    return (
                                        
                                        <ColorSelector onSelect={this._colorSelected.bind(this)} isSelected={this.state.colorSelected.id === el.id ? true : false}  key={i}  obj={el}  />
                                        
                                    );
                                })

                            }



                        </ScrollView>
                    </View>
                    {!this.props.somenteConsulta && (
                    
                    <TouchableOpacity style={[styles.btnAddCard]} onPress={this._addCart} >
                        <Image source={require('../images/icons/cart.png')} style={{ width: 14, height: 14, marginRight: 10 }} />
                        <Text style={styles.buttonText} >Adicionar ao carrinho</Text>
                    </TouchableOpacity>
                    )}
                </View>


            </View>
        )
    }





}

const mapStateToProps = state => (
    {
        UrlServer: state.GlobalReducer.UrlServer,
        Versao: state.GlobalReducer.Versao,
        VersaoData: state.GlobalReducer.VersaoData,
    }
);


export default connect(mapStateToProps, null)(ProdutoItemLista);
