import React, { Component } from 'react';





import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';





export default class ColorSelector extends Component {
    state = {

    };
    isSelected= false;

    componentDidMount =  () => {
        // this.styles.buttonContainer.width = 900;
        // console.log('componentWillMount' + this.props.isSelected);
        // this.setState({ isSelected: this.props.isSelected });
        // setTimeout(()=>{this.render();   },3000);
        
    }
    _colorSelected = () => {
        // this.setState({ isSelected: true });
        
        this.isSelected = true;
        this.props.onSelect(this.props.obj);
        // this.render();    
    }
    refreshItem = (selected) => {
        this.isSelected = selected;
        
        
        this.render();    
    }
    render() {
        this.isSelected = this.props.isSelected;
        
        
         
        return (

            <View style={[styles.container, { padding: this.isSelected ? 2 : 0, borderWidth: this.isSelected ? 1 : 0, borderColor: this.isSelected ? '#2EA2F8' : '#fff' }]}>
                <TouchableOpacity onPress={this._colorSelected}>
                    <View style={[styles.colorSelectorItem, { backgroundColor: `${this.props.obj.cor}`, height: this.isSelected ? 24 : 30, width: this.isSelected ? 24 : 30 }]}></View>
                    <Image source={require('../../images/icons/check_white.png')} style={[styles.check, { width: 8, height: 7, opacity: this.isSelected ? 1 : 0 }]} />
                </TouchableOpacity>
            </View>
        );

    }







}

const styles = StyleSheet.create({

    container: {

        width: 30,
        height: 30,
        marginRight: 8,
        backgroundColor: '#fff',
        borderRadius: 2,

        // padding: (state.isSelected ) ? 20 : 0,



    },
    colorSelectorItem: {
        height: 30,
        width: 30,
        borderRadius: 2,
        marginRight: 8,
    },
    check: {
        position: 'absolute',
        left: 8,
        top: 9,
    }


});



