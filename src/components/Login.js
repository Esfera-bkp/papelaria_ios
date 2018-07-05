import React, { Component } from 'react';

import {
    View,
    StyleSheet,
    Text,
    TextInput,
    Modal,
    Image,
    TouchableOpacity,
    AsyncStorage
} from 'react-native';

import md5 from "react-native-md5";

import { connect } from 'react-redux';
import { getInstance, DbError } from '../classes/DbManager';
import { Actions } from 'react-native-router-flux';



export class Login extends Component {

    state = {
        // emailText: 'luccaco@luccaco.com',
        // senhaText: '102030',
        emailText: '',
        senhaText: '',


    }

    constructor(props) {
        super(props);

    }

    async componentDidMount() {
        // const jsonObj =  JSON.parse(await AsyncStorage.getItem('@OTIMA.state'));
        // console.log(jsonObj);

        // if(jsonObj){
        //     this.setState({emailText:jsonObj.emailText});
        // }

    }
    componentWillMount = async () => {

    }
    _changeEmail = async (text) => {
        // this.setState({emailText:text});
        // await AsyncStorage.setItem('@OTIMA.state',JSON.stringify(this.state.emailText));

    }

    _validaEmail = () => {
        if (this.state.emailText != '' && this.state.senhaText != '') {
            let db =  getInstance();
            let query = `SELECT * from otm_usuarios where email = "${this.state.emailText}";`;
            
            db.transaction((tx) => {
                tx.executeSql(query, [], (tx, results) => {
                    // console.log("Query completed");
                    let qtde = results.rows.length;
                    console.log(query+ "Query completed results = " + qtde);
                    if(qtde == 1){
                        let user = results.rows.item(0);
                        let str_md5v = md5.hex_md5(this.state.senhaText);
                       
                        if(user.senha == str_md5v){
                            this.props.hideLogin();
                            let userObj = JSON.stringify(user);
                            
                            AsyncStorage.setItem('@OTIMA.user',userObj);

                            

                            
                            Actions.listagem();
                        }else{
                            alert('Senha incorreta!');
                        }
                        
                    }else{
                        alert('Email incorreto!');
                    }
    
    
    
                }, DbError);
            }, DbError);

        } else {
            alert('Preencha o email e a senha!');
        }


    }
   

    _limpa = () => {

        this.setState({ emailText: '', senhaText: '' });
    }

    textHandler = (text) => {
        console.log(text);
        // if(text == '' || text == '-' ){
        //   text = '';
        // }

        // this.setState({emailText: text});
    }
    render() {





        return (
            <Modal animationType="fade" useNativeDriver={true}   transparent={true} visible={this.props.visible}>

                <View style={styles.modalContainer}>
                    <View style={styles.boxContainer}>


                        <View style={styles.imageContainer}>
                            <Image source={require('../images/logo_branca.png')} style={{ width: 204, height: 78 }} />
                        </View>

                        <TextInput
                            key="emailField"
                            autoFocus
                            autoCapitalize="none"
                            style={styles.boxInput}
                            underlineColorAndroid="rgba(0,0,0,0)"
                            placeholder="Email"
                            value={this.state.emailText}
                            controlled={true}
                            onChangeText={(text) => { this.setState({ emailText: text }); this._changeEmail(text); }}

                        />
                        <TextInput
                            secureTextEntry
                            autoCapitalize="none"
                            style={styles.boxInput}
                            underlineColorAndroid="rgba(0,0,0,0)"
                            placeholder="Senha"
                            value={this.state.senhaText}
                            controlled={true}
                            onChangeText={(text) => this.setState({ senhaText: text })}
                            onSubmitEditing={this._validaEmail}

                        />
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.cancelButton} onPress={this._limpa}  >
                                <Text style={styles.buttonText}>Limpar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.submitButton} onPress={this._validaEmail} >
                                <Text style={styles.buttonText}>Login</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </View>

            </Modal>);
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

    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.0)',
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingHorizontal: 40,
        paddingBottom:250,
    },
    loader: {
        padding: 20,
    },
    boxContainer: {
        padding: 20,

        borderRadius: 10,
        alignItems: 'center',
        width: 380,


    },
    imageContainer: {
        paddingBottom: 30,
    },

    boxInput: {
        alignSelf: 'stretch',
        marginTop: 10,
        paddingVertical: 0,
        paddingHorizontal: 20,
        borderWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#fff',
        color: '#354052',
        height: 40,
        borderRadius: 6,
        fontWeight: 'bold',
    },
    buttonContainer: {
        marginTop: 10,
        height: 40,
        flexDirection: 'row',
        justifyContent: 'space-between',

    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',


    },
    cancelButton: {

        width: 60,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',

    },
    submitButton: {
        width: 100,
        height: 40,
        backgroundColor: '#1991EB',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        marginLeft: 180,

    }



});

export default connect(mapStateToProps, null)(Login);