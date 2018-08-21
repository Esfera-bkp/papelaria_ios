import React, { Component } from 'react';

import { View, Text, TouchableOpacity, Image, StyleSheet, Modal, ScrollView, Alert,AsyncStorage } from 'react-native';

import { Actions } from 'react-native-router-flux';
import { getInstance, DbError } from '../classes/DbManager';

// import styles from '../Styles';

import TextField from './inputs/TextField';

export default class Pesquisa extends Component {
    state = {

        comResultado: false,
        modalVisible: false,
        criterio :'',
        linhas:[],
        produtos:[],
        cores:[],
    };

    

    async componentDidMount() {


    }




    _openPesquisa = () => {
        this.setState({ modalVisible: true });
    }
    _closePesquisa = () => {
        this.setState({ modalVisible: false });
    }

    _doSearch = () => { 

        let db = getInstance();
        let queryLinhas = `SELECT id,titulo FROM otm_linhas where titulo like '%${this.state.criterio}%' order by titulo`;
        let queryProdutos = `SELECT a.id,a.titulo,a.linha_id, b.titulo as linha_titulo FROM otm_produtos a, otm_linhas b where a.linha_id = b.id and a.titulo like '%${this.state.criterio}%' order by a.titulo`;
        let queryCores = `SELECT a.id,a.titulo,a.barras ,a.formato_id, b.titulo as formato_titulo, b.produto_id, c.titulo as produto_titulo, c.linha_id, d.titulo as linha_titulo FROM otm_cores a, otm_formatos b, otm_produtos c, otm_linhas d where a.formato_id = b.id and b.produto_id = c.id and c.linha_id = d.id and (a.barras like '%${this.state.criterio}%' or b.titulo like '%${this.state.criterio}%') order by a.titulo`;
        db.transaction((tx) => {
            tx.executeSql(queryLinhas, [], (tx, results) => {
                let qtde = results.rows.length;
                if (qtde > 0) {
                    let repArray = [];
                    for (let x = 0; x < qtde; x++) {
                        const item = results.rows.item(x);                        
                        repArray.push(item);
                    }
                    this.setState({ linhas: repArray });
                } else {
                    his.setState({ linhas: [] });
                }
            }, DbError);
            tx.executeSql(queryProdutos, [], (tx, results) => {
                let qtde = results.rows.length;
                if (qtde > 0) {
                    let repArray = [];
                    for (let x = 0; x < qtde; x++) {
                        const item = results.rows.item(x);                        
                        repArray.push(item);
                    }
                    this.setState({ produtos: repArray });
                } else {
                    his.setState({ produtos: [] });
                }
            }, DbError);
            tx.executeSql(queryCores, [], (tx, results) => {
                let qtde = results.rows.length;
                if (qtde > 0) {
                    let repArray = [];
                    for (let x = 0; x < qtde; x++) {
                        const item = results.rows.item(x);                        
                        repArray.push(item);
                    }
                    this.setState({ cores: repArray });
                } else {
                    his.setState({ cores: [] });
                }
            }, DbError);
        }, DbError);
    }
    
    _consultar = () => {
        if(this.state.criterio!=''){
            this.setState({comResultado:true});
            this._doSearch();
        }else{
            Alert.alert(
                'Atenção',
                'Digite um critério de pesquisa',
                [
                  
                  {text: 'Ok', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                 
                ],
                { cancelable: true }
              )
        }
    }

    _abreLinha = async (el) => {
        let obj = { id: el.id, titulo: el.titulo };
        await AsyncStorage.setItem("@OTIMA.linha", JSON.stringify(obj));

        Actions.produtostipos();
        this._closePesquisa();
    }
    _abreProduto = async (el) => {
        let obj = { id: el.linha_id, titulo: el.linha_titulo };
       await AsyncStorage.setItem("@OTIMA.linha", JSON.stringify(obj));

        
        let obj2 = { id: el.id, titulo: el.titulo };
       await  AsyncStorage.setItem("@OTIMA.tipoProduto", JSON.stringify(obj2));

        Actions.produtositens();
        this._closePesquisa();
    }
    _abreCor = async (el) => {
        let obj = { id: el.linha_id, titulo: el.linha_titulo }; 
       await AsyncStorage.setItem("@OTIMA.linha", JSON.stringify(obj));

        
        let obj2 = { id: el.produto_id, titulo: el.produto_titulo };
       await AsyncStorage.setItem("@OTIMA.tipoProduto", JSON.stringify(obj2));

        
        Actions.produtositens({refresh: {refresh:Math.random()}});
        this._closePesquisa();
    }


    render() {





        return (
            <View style={styles.container} >

                <TouchableOpacity style={[styles.btnPesquisa, { backgroundColor: '#C5D0DE' }]} onPress={this._openPesquisa} >
                    <Image source={require('../images/icons/lupa.png')} style={{ width: 16, height: 16 }} />
                    <View style={[styles.counter, { opacity:  0 }]} >
                        <Text style={styles.counterTxt} ></Text>
                    </View>
                </TouchableOpacity>
                <Modal animationType="fade" transparent={true} visible={this.state.modalVisible} >
                    <View style={styles.overlay}>
                        <View style={styles.cartView}>
                            <View style={styles.cartHeader}>
                                <Text style={styles.title}>Pesquisar produtos</Text>
                                <TouchableOpacity style={[styles.btnClose]} onPress={this._closePesquisa} >

                                    <Image source={require('../images/icons/close.png')} style={{ width: 16, height: 15 }} />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.modalBody}>
                                <View style={styles.rowForm}>
                                    <TextField labelText="Pesquisa" hideLabel  placeholder="Pesquisar" col="12" onChange={(criterio) => { this.setState({ criterio,comResultado:false,linhas:[],produtos:[],cores:[] }) }} value={this.state.criterio}  ></TextField>
                                </View>

                                <TouchableOpacity style={[styles.btnFinalizar, { width: 150, alignSelf: 'flex-end' }]} onPress={this._consultar} >
                                    <Text style={styles.txtBtnFinalizar}>Pesquisar</Text>


                                </TouchableOpacity>
                            </View>
                            <ScrollView contentContainerStyle={styles.resultList} >
                            {this.state.comResultado && (
                                <View style={styles.rowResultadoHeader}>
                                    <Text style={styles.tituloResultado}>Resultados para:</Text>
                                    <Text style={styles.labelCriterio}>"{this.state.criterio}"</Text>
                                </View>
                            )}
                            {this.state.linhas.length > 0 && (
                                <View style={styles.rowResultado}>
                                    <Text style={styles.tituloSessao}>Linhas</Text>                                    
                                </View>
                            )}
                                
                            {this.state.linhas.map((el,i)=>{
                                return (
                                    <TouchableOpacity style={[styles.btnResult]} onPress={()=>{this._abreLinha(el)}} key={i} >
                                    <Text style={styles.txtResult}>{el.titulo}</Text>
                                </TouchableOpacity>
                                )
                            })}

                             {this.state.produtos.length > 0 && (
                                <View style={styles.rowResultado}>
                                    <Text style={styles.tituloSessao}>Produtos</Text>                                    
                                </View>
                            )}
                                
                            {this.state.produtos.map((el,i)=>{
                                return (
                                    <TouchableOpacity style={[styles.btnResult]} onPress={()=>{this._abreProduto(el)}} key={i} >
                                    <Text style={styles.txtResult}>{el.linha_titulo} - {el.titulo}</Text>
                                </TouchableOpacity>
                                )
                            })}

                             {this.state.cores.length > 0 && (
                                <View style={styles.rowResultado}>
                                    <Text style={styles.tituloSessao}>Cores</Text>                                    
                                </View>
                            )}
                                
                            {this.state.cores.map((el,i)=>{
                                return (
                                    <TouchableOpacity style={[styles.btnResult]} onPress={()=>{this._abreCor(el)}} key={i} >
                                    <Text style={styles.txtResult}>{el.linha_titulo} - {el.produto_titulo} - {el.formato_titulo} - {el.titulo}</Text>
                                </TouchableOpacity>
                                )
                            })}

                            





                            </ScrollView>
                            
                        </View>
                    </View>

                </Modal>
            </View>
        )
    }





}


const styles = StyleSheet.create({
    rowResultadoHeader:{
        paddingHorizontal:20,
        paddingTop:20,
    },
    rowResultado:{
        paddingHorizontal:20,
        paddingTop:20,
    },
    btnResult:{
        paddingHorizontal:20,
        paddingTop:10,
    },
    txtResult:{
        fontSize:14,
        color:'#1991EB',
    },
    labelCriterio:{
        fontSize:22,
        color:'#1991EB',
    },
    tituloSessao:{
        fontSize:18,
        color:'#354052',
    },
    tituloResultado:{
        fontSize:22,
        color:'#354052',
    },
    btnPesquisa: {

        backgroundColor: '#C5D0DE',
        borderRadius: 2,
        // flex:1,
        width: 36,
        height: 36,


        position: 'absolute',
        right: 60,
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
    resultList:{
        
        // flex:1,
        paddingBottom:40,
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
    modalBody: {
        borderBottomWidth:1,
        borderBottomColor:'#E5E5E5',
        // flex: 1,
        paddingHorizontal: 20,
        paddingBottom: 20,
        // maxHeight:200,
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
        minHeight: 50,

    },
    cartList: {
        flex: 1,
        // backgroundColor: '#ccc'

    },

    itemListCarrinho: {
        maxHeight: 100,
        flex: 1,
        backgroundColor: '#fff',
        // justifyContent:'center',
        alignItems: 'center',

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
    btnFinalizar: {
        // position:'absolute',
        // right:20,
        // top:20,

        maxHeight: 40,
        minHeight: 40,
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



});


