import React, { Component } from 'react';

import { View, StyleSheet, Text, Image } from 'react-native';

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
      

      componentDidMount = () => {
        KeepAwake.activate();
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