import React, { Component } from 'react';

import { View, Text, TouchableOpacity, Image } from 'react-native';


import styles from '../Styles';

import RNFS from 'react-native-fs';

export default class ItemLista extends Component {
    state = {

        

    };





    async componentDidMount() { 
 
    }

  


    _itemSelected = ()=>{
        this.props.onItemSelected(this.props.item.id,this.props.item.titulo);
    }

    render() {
        let dirs = RNFS.DocumentDirectoryPath;
        
        
        
        return (
            <View style={styles.boxItemProduct} >

                <View style={styles.itemProductImageBox} >
                    <Image style={styles.itemProductImage}   source={{uri:dirs+"/"+this.props.urlImage}} resizeMode="contain"  />
                </View>
                <TouchableOpacity>
                <TouchableOpacity style={[styles.submitButton,styles.marginTop,styles.btnProdutos]} onPress={this._itemSelected} >
                            <Text style={styles.buttonText} >{this.props.item.titulo}</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
            </View>
        )
    }





}


