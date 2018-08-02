import React, { Component } from 'react';

import { View, StyleSheet, Text, Image,Alert,Linking } from 'react-native';

import { connect } from 'react-redux';

import Loader from './Loader';
import Login from './Login';

import KeepAwake from 'react-native-keep-awake';


export  class Inicial extends Component {
    state = {
        loaderVisible:true,
        loginVisible:false,
        repos:[
        
        ],
      };
      
      updateApk = async () => {
        
        console.log('updateApk');
        const url = 'itms-services://?action=download-manifest&url=https://londigital.com.br/manifests/otima_papelariav2/manifest.plist';
        Linking.canOpenURL(url).then(supported => {
            if (!supported) {
                console.log('Can\'t handle url: ' + url);
            } else {
                console.log(url);
              Linking.openURL(url);
            }
          }).catch(err => console.error('An error occurred', err));
        
      }
      componentDidMount = async() => {
        KeepAwake.activate();

        // let url = `${this.props.UrlServer}app/v2/versao.json`;
        // console.log(url); 
        // const pingCall = await fetch(url);
        // const txt = await pingCall.json();
        // if(txt.versao != this.props.Versao){
        //     console.log(this.props.Versao); 
        //     console.log(txt.versao); 

        //     Alert.alert(
        //         'Atenção',
        //         "Versão desatualizada, aperte ok para atualizar",
        //         [
                  
        //           {text: 'Ok', onPress: this.updateApk.bind(this), style: 'cancel'},
                  
        //         ],
        //         { cancelable: true }
        //       )

        // }

        
      }
      _showLogin = async (newRepoText) => {
          console.log('_showLogin');
          this.setState({loaderVisible:false,loginVisible:true});
      }
      _hideLogin = async (newRepoText) => {
          console.log('_hideLogin');
          this.setState({loginVisible:false});
      }
    render() {
        const resizeMode = 'center';
        showRectView = true;
        return (
            <View style={styles.container} >

                <Image style={styles.bgfoto} 
                 source={require('../images/bg_login.png')}
                />

                <Loader showLogin={this._showLogin} visible={this.state.loaderVisible} />
                
                <Login visible={this.state.loginVisible} hideLogin={this._hideLogin} /> 
                
                <View style={styles.verText}>
                <Text style={styles.verlabel}>Versão: {this.props.Versao}</Text>
                <Text style={styles.verlabel}>Data: {this.props.VersaoData}</Text>
                </View>

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

const styles = StyleSheet.create({

    container: {
        flex: 1,



        flexDirection: 'row',
        alignItems: 'center',
    },
    verText:{
        position:'absolute',
        right:30,
        bottom:30,
        alignItems: 'flex-end',
       
    },
    verlabel:{
        color:'#fff',
    },
    bgfoto: {
        flex: 1,
        backgroundColor: '#fff',

        alignItems: 'center',
        position: 'absolute',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
    }

});

export default connect(mapStateToProps, null)(Inicial);