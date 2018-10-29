import React, { Component } from 'react';

import { View, StyleSheet, Text, TouchableOpacity,Image,AsyncStorage,ScrollView,Alert,ActivityIndicator } from 'react-native';

import { connect } from 'react-redux';

import { Actions } from 'react-native-router-flux';
import { getInstance, DbError } from '../classes/DbManager';

import ModalConsulta from './ModalConsulta';
import ModalCatalogo from './ModalCatalogo';

export class Listagem extends Component {
    state = {
        orderby:"data",
        canEdit:false,
        isLoadingBaixar:false,
        consultaVisible:false,
        modalCatalogoVisible:false,
        user:{},
        pedidos: [

        ],
        numPedidos: [

        ],
    };

    async componentDidMount() {
        AsyncStorage.setItem("@OTIMA.currentPedido","{}");
        AsyncStorage.setItem("@OTIMA.currentIdPedido","0");
        AsyncStorage.setItem("@OTIMA.somenteConsulta","0");

        let userJ = await AsyncStorage.getItem("@OTIMA.user");
        let user = JSON.parse(userJ);
        await this.setState({ user: user });

            this._loadPedidos();

        // AsyncStorage.getItem("@OTIMA.user").then(async (value) => {
        //     let user = JSON.parse(value);
        //     await this.setState({ user: user });

        //     this._loadPedidos();

        // }).done();


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
                    let numPedidos = [];

                    for (let x = 0; x < qtde; x++) {
                        let item = results.rows.item(x);                        
                        const dataHora = item.date_upd.split(' ');
                        let data =  dataHora[0].split('-');
                        item.date_upd = data[2]+"/"+data[1]+"/"+data[0] + " "+dataHora[1];
                        itemsArray.push(item);
                        numPedidos.push(item.pedido);
                    }
                    this.setState({ pedidos: itemsArray,numPedidos:numPedidos });

                }



            }, DbError);
        }, DbError);
    }
    _novoPedido = async ()=>{
        await AsyncStorage.setItem("@OTIMA.currentIdPedido","0");
        await AsyncStorage.setItem("@OTIMA.currentPedido","{}");
        Actions.cliente();
    }
    _viewPedido = async (el)=>{
        await AsyncStorage.setItem("@OTIMA.currentPedido",el.json);
        await AsyncStorage.setItem("@OTIMA.currentIdPedido",el.id.toString());
        console.log("IDPEDIDO");
        console.log(el.id.toString());
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
                        this.setState({canEdit:false});
                          this._loadPedidos();
                      }, DbError);
                  }, DbError);
                
                }},
            ],
            { cancelable: true }
          )
        
    }
    _duplicatePedido = async (el)=>{
        Alert.alert(
            'Atenção',
            'Deseja duplicar este pedido?', 
            [
              
              {text: 'Não', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
              {text: 'Sim', onPress: () => {
                  let db = getInstance();
                  let data = new Date();
                    const mes = data.getMonth() + 1 < 10 ? "0" + (data.getMonth() + 1) : data.getMonth() + 1;
                    const dia = data.getDate() < 10 ? "0" + (data.getDate()) : data.getDate();
                    const dataHora = data.getFullYear() + "-" + mes + "-" + dia + " " + data.getHours() + ":" + data.getMinutes() + ":" + data.getSeconds();
                    
                  let query = "INSERT INTO otm_pedidos (json, usuario_id,date_upd)  SELECT json, usuario_id, '"+ dataHora+"' FROM otm_pedidos WHERE  id = "+el.id+" ;";
                  db.transaction((tx) => {
                      tx.executeSql(query, [], (tx, results) => {

                        this.setState({canEdit:false});
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
            {this.state.canEdit && (
                <TouchableOpacity style={[styles.btnRemove]} onPress={()=>{this._removePedido(el)}}  >
                <Image source={require('../images/icons/remove.png')} style={{ width: 8, height: 8 }} />
            </TouchableOpacity>
                                  
                                )}
            {this.state.canEdit && (
                <TouchableOpacity style={[styles.btnRemove,styles.blueButton]} onPress={()=>{this._duplicatePedido(el)}}  >
                <Image source={require('../images/icons/duplicate.png')} style={{ width: 16, height: 16 }} />
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
    doBaixar = async () =>{


        await this.setState({ isLoadingBaixar: true });

            

            

            let url = `${this.props.UrlServer}app/getPedidos-json.php?usuario_id=${this.state.user.id}`;
            console.log(url);
            const pingCall = await fetch(url, {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ usuario_id: this.state.user.id })
            }).catch(err => {
                console.log('getPedidos Error: ', err)
              });
            
            if(pingCall){

                
                const retJson = await pingCall.json();
                console.log(retJson);

                console.log(this.state.numPedidos);
                let db = getInstance();

                for(let i =0; i < retJson.pedidos.length ; i++){
                    const pedido = retJson.pedidos[i];
                    let pode = true;
                    for(let x =0; x < this.state.numPedidos.length ; x++){
                        if(pedido.numero == this.state.numPedidos[x]){
                            pode = false;
                        }
                    }

                    if(pode){
                        //pode inserir

                        let query = "INSERT INTO otm_pedidos (id,pedido,json, usuario_id,date_upd) values (";
                        query += "'"+pedido.id+"',";
                        query += "'"+pedido.numero+"',";
                        query += "'"+pedido.json_app+"',";
                        query += "'"+pedido.usuario_id+"',";
                        query += "'"+pedido.date_upd+"'";
                        query += ");";
                        console.log(query);
                        await db.transaction( async (tx) => {
                           await tx.executeSql(query, [],  async (tx, results) => {
        
                              
                                
                            }, DbError);
                        }, DbError);
                    }


                }

                this._loadPedidos();
                  
                    
                    



                await this.setState({ isLoadingBaixar: false});
            }else{
                console.log('getPedidos Error: '); 
                
                await this.setState({ isLoadingBaixar: false});
            }

    }
    baixar = () =>{
        Alert.alert(
            'Atenção',
            'Deseja trazer todos os seus pedidos já enviados?',
            [
              
              {text: 'Não', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
              {text: 'Sim', onPress: () => {
                    this.doBaixar();                
                }},
            ],
            { cancelable: true }
          )
    }
    toggleRemove = () =>{
        if(this.state.canEdit){
            this.setState({canEdit:false});
        }else{
            this.setState({canEdit:true});
        }
    }
    render() {
        
        const { canEdit,isLoadingBaixar } = this.state;
        return (
            <View style={styles.container} >
                <View style={styles.header} >
                    <View style={[styles.buttomContainer,{justifyContent: 'flex-start'}]} >
                    <TouchableOpacity style={styles.btnCancelar} onPress={this.toggleRemove.bind(this) }>
                            {!canEdit && (
                                    
                                    <Text style={[styles.textRed, styles.textBold]}>Editar</Text>
                                )}

                                {canEdit && (
                                <Text style={[styles.textRed, styles.textBold]}>Fechar</Text>
                                  
                                )}
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btnBaixar} onPress={this.baixar.bind(this) }>
                        {!isLoadingBaixar && (
                            <Text style={[styles.textBaixar, styles.textBold]}>Baixar Pedidos</Text>
                                )}
                                {isLoadingBaixar && (
                                    <ActivityIndicator

                                        color="#fff"

                                    />
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
    btnBaixar:{
        marginLeft:20,
        paddingHorizontal: 10,
        backgroundColor:'#ccc',
        borderRadius:4,
        height:35,
        paddingHorizontal:20,
        flexDirection: 'row',
        alignItems: 'center',
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
    textBaixar: {
        color: '#fff',
        fontWeight:'bold',
        
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