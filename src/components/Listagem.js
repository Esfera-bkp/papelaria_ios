import React, { Component } from 'react';

import { View, StyleSheet, Text, TouchableOpacity,Image,AsyncStorage,ScrollView,Alert } from 'react-native';

import { connect } from 'react-redux';

import { Actions } from 'react-native-router-flux';
import { getInstance, DbError } from '../classes/DbManager';

import ModalConsulta from './ModalConsulta';
import ModalCatalogo from './ModalCatalogo';

export class Listagem extends Component {
    state = {
        orderby:"data",
        canRemove:false,
        consultaVisible:false,
        modalCatalogoVisible:false,
        user:{},
        pedidos: [

        ],
    };

    componentDidMount = () =>{
        AsyncStorage.setItem("@OTIMA.currentPedido","{}");
        AsyncStorage.setItem("@OTIMA.currentIdPedido","0");
        AsyncStorage.setItem("@OTIMA.somenteConsulta","0");
        AsyncStorage.getItem("@OTIMA.user").then(async (value) => {
            let user = JSON.parse(value);
            await this.setState({ user: user });

            this._loadPedidos();

        }).done();


    }
    _loadPedidos = ()=>{
        let db = getInstance();
        let query = `SELECT id,json,pedido,date_upd
                    FROM otm_pedidos
                    WHERE  usuario_id = ${this.state.user.id} order by date_upd desc`;
        db.transaction((tx) => {
            tx.executeSql(query, [], (tx, results) => {
                let qtde = results.rows.length;
                if (qtde > 0) {
                    let itemsArray = [];

                    for (let x = 0; x < qtde; x++) {
                        let item = results.rows.item(x);                        
                        const dataHora = item.date_upd.split(' ');
                        let data =  dataHora[0].split('-');
                        item.date_upd = data[2]+"/"+data[1]+"/"+data[0] + " "+dataHora[1];
                        itemsArray.push(item);

                    }
                    this.setState({ pedidos: itemsArray });

                  


                }



            }, DbError);
        }, DbError);
    }
    _novoPedido = ()=>{
        AsyncStorage.setItem("@OTIMA.currentIdPedido","0");
        Actions.cliente();
    }
    _viewPedido = (el)=>{
        AsyncStorage.setItem("@OTIMA.currentPedido",el.json);
        AsyncStorage.setItem("@OTIMA.currentIdPedido",el.id.toString());
        Actions.cliente();
    }
    _removePedido = (el)=>{
        Alert.alert(
            'Atenção',
            'Deseja remover este pedido?',
            [
              
              {text: 'Não', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
              {text: 'Sim', onPress: () => {
                  let db = getInstance();
                  let query = `DELETE 
                              FROM otm_pedidos
                              WHERE  id = ${el.id}`;
                  db.transaction((tx) => {
                      tx.executeSql(query, [], (tx, results) => {
                        this.setState({canRemove:false});
                          this._loadPedidos();
                      }, DbError);
                  }, DbError);
                
                }},
            ],
            { cancelable: true }
          )
        
    }
    renderRow(el,i) {
        const pedido = JSON.parse(el.json);
        return(
            <TouchableOpacity style={styles.pedidosRow} key={i} onPress={()=>{this._viewPedido(el)}} >
            {this.state.canRemove && (
                <TouchableOpacity style={[styles.btnRemove]} onPress={()=>{this._removePedido(el)}}  >
                <Image source={require('../images/icons/remove.png')} style={{ width: 8, height: 8 }} />
            </TouchableOpacity>
                                  
                                )}
                <View style={styles.col} >
                    <Text style={styles.label}>Nº Pedido</Text>
                    <Text style={styles.valor}>{el.pedido}</Text>
                </View>
                <View style={styles.col} >
                    <Text style={styles.label}>Cliente</Text>
                    <Text style={styles.valor}>{pedido.cliente.fantasia}</Text>
                </View>
                <View style={styles.col} >
                    <Text style={styles.label}>Qtde Itens</Text>
                    <Text style={styles.valor}>{(pedido.produtos) ? pedido.produtos.length : '0'}</Text>
                </View>
                <View style={styles.col} >
                    <Text style={styles.label}>Hora salvo</Text>
                    <Text style={styles.valor}>{el.date_upd}</Text>
                </View>
            </TouchableOpacity>
        )
    }
    toggleRemove = () =>{
        if(this.state.canRemove){
            this.setState({canRemove:false});
        }else{
            this.setState({canRemove:true});
        }
    }
    render() {
        const { canRemove } = this.state;
        return (
            <View style={styles.container} >
                <View style={styles.header} >
                    <View style={styles.buttomContainer} >
                    <TouchableOpacity style={styles.btnCancelar} onPress={this.toggleRemove.bind(this) }>
                            {!canRemove && (
                                    
                                    <Text style={[styles.textRed, styles.textBold]}>Excluir</Text>
                                )}

                                {canRemove && (
                                <Text style={[styles.textRed, styles.textBold]}>Fechar</Text>
                                  
                                )}
                        </TouchableOpacity>
                    </View>
                    <View style={styles.buttomContainer} >
                        <TouchableOpacity style={styles.buttonBox} onPress={()=>{this.setState({modalCatalogoVisible:true})}}>
                        <Image style={styles.img} source={require('../images/icons/message.png')} style={{width: 16, height: 12}}  />
                            <Text style={styles.txtButton}>Enviar Catálogo</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.buttonBox} onPress={()=>{this.setState({consultaVisible:true})}}>
                        <Image style={styles.img} source={require('../images/icons/info.png')} style={{width: 16, height: 16}}  />
                            <Text style={styles.txtButton}>Consulta</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.buttonBox,styles.blueButton]} onPress={this._novoPedido} >
                        <Image style={styles.img} source={require('../images/icons/plus.png')} style={{width: 16, height: 16}}  />
                            <Text style={styles.txtButton}>Novo Pedido</Text>
                        </TouchableOpacity>
                        butto
                    </View>
                </View>

                <ScrollView contentContainerStyle={styles.pedidoContainer} >
                {
                    this.state.pedidos.map(this.renderRow.bind(this))
                }
                </ScrollView>
            
                <ModalConsulta  visible={this.state.consultaVisible} closeModal={()=>{this.setState({consultaVisible:false})}} />
                <ModalCatalogo urlServidor={this.props.UrlServer}  visible={this.state.modalCatalogoVisible} closeModal={()=>{this.setState({modalCatalogoVisible:false})}} />
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
        backgroundColor: '#EDEEEF',


        // flexDirection: 'row',
        alignItems: 'flex-start',
    },
    btnRemove: {
        backgroundColor: '#ED1C24',
        borderRadius: 2,
        height: 36,
        width: 36,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight:14,
    },
    textRed: {
        color: '#ED1C24',
    },
    textBold: {
        fontWeight: 'bold'
    },
    header: {
        paddingTop: 20,
        paddingHorizontal: 20,
        height: 110,
        width: '100%',
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    buttomContainer:{
        flexDirection: 'row',
        alignItems: 'center',
        width: '50%',
        // backgroundColor: '#f00',
        justifyContent: 'space-between',
    },
    
    buttonBox:{
        backgroundColor:'#A8AAB7',
        borderRadius:4,
        height:35,
        paddingHorizontal:20,
        flexDirection: 'row',
        alignItems: 'center',
        
    },
    verText: {
        position: 'absolute',
        right: 30,
        bottom: 30,
        alignItems: 'flex-end',

    },
    txtButton: {
        color: '#fff',
        fontWeight:'bold',
        paddingLeft:10,
    },
    blueButton:{
        backgroundColor:'#1991EB',
    },
    pedidoContainer:{
        // flex:1,
        padding:20,
    },
    pedidosRow:{
        paddingVertical:12,
        flexDirection:'row',
        borderBottomWidth:1,
        borderBottomColor:'#D0D0D0',
        justifyContent:'flex-start',
        alignItems:'center',
        minWidth:'100%'
    },
    col:{
        flex:1
    },
    label:{
        color:'#7F8FA4',
        fontSize:14,
    }
    ,valor:{
        color:'#354052',
        fontSize:20,
    }


});

export default connect(mapStateToProps, null)(Listagem);