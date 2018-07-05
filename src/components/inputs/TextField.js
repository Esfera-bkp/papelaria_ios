import React, { Component } from 'react';





import { View, StyleSheet, Text, TextInput } from 'react-native';




export default class TextField extends Component {
    state = {

    };

    componentDidMount = () => {
        // this.styles.buttonContainer.width = 900;

        // this.setState({largura:this.props.largura});

    }
    render() {
        let largura = '100%';
        switch (this.props.col) {
            case ("2"):
                largura = '15%'
                break
            case ("3"):
                largura = '24%'
                break
            case ("4"):
                largura = '32%'
                break
            case ("5"):
                largura = '40%'
                break
            case ("6"):
                largura = '49%'
                break
            case ("7"):
                largura = '57%'
                break
            case ("8"):
                largura = '65%'
                break
            case ("10"):
                largura = '82%'
                break

        }

        return (
            <View style={[styles.container, { maxWidth: largura }]}>
                {!this.props.hideLabel &&
                    <Text style={styles.label}>{this.props.labelText}</Text>
                }
                
                <View style={styles.containerDropDown}>

                    <TextInput style={styles.value}
                        placeholder={this.props.placeholder}
                        underlineColorAndroid="rgba(0,0,0,0)"
                        onChangeText={valor => this.props.onChange(valor)}
                        value={this.props.value} />

                </View>


            </View>);

    }







}

const styles = StyleSheet.create({

    container: {

        flex: 1,
        // minWidth:'100%',
        // backgroundColor:'#f00' 
        // paddingHorizontal:20,

    },
    containerDropDown: {
        flex: 1,
        // backgroundColor: '#F1F4F8',
        backgroundColor: '#fff',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,.1)',
        height: 40,
        minHeight: 40,
        maxHeight: 40,
        width: '100%',
        paddingHorizontal: 20,
        alignItems: 'flex-start',
        justifyContent: 'center',


    },
    value: {
        color: '#354052',
        flex: 1,
        minWidth: '100%',
        minHeight: 40,
        maxHeight: 40,

    },
    label: {
        flex: 1,
        fontSize: 14,
        color: '#7F8FA4',
        fontWeight: 'bold',
        marginBottom: 5,
    },


});



